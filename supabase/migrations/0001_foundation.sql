-- Hype Infinity: fundação (perfis, papéis, permissões de funcionários e auditoria).
-- Execute no SQL Editor do Supabase ou com a CLI (supabase db push).
-- Regras de acesso ficam no banco (RLS): esconder botões no front-end nunca é a única barreira.

create type public.user_role as enum ('cliente', 'funcionario', 'admin');
create type public.user_status as enum ('ativo', 'suspenso');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 120),
  phone text check (phone is null or phone ~ '^[0-9]{10,13}$'),
  role public.user_role not null default 'cliente',
  status public.user_status not null default 'ativo',
  age_declared_at timestamptz,
  terms_version text,
  terms_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.staff_permissions (
  user_id uuid not null references public.profiles (id) on delete cascade,
  permission text not null check (permission in (
    'produtos.ver', 'produtos.editar', 'ofertas.gerir', 'parcerias.gerir',
    'candidaturas.ver', 'notificacoes.criar', 'conteudo.publicar')),
  granted_by uuid,
  granted_at timestamptz not null default now(),
  primary key (user_id, permission)
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid, -- sem FK de propósito: o log é imutável e sobrevive à exclusão da conta
  action text not null,
  resource_type text,
  resource_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.staff_permissions enable row level security;
alter table public.audit_log enable row level security;

-- Funções auxiliares. Administrador e funcionário só valem com MFA concluído (aal2).
create function public.is_aal2() returns boolean language sql stable as
$$ select coalesce(auth.jwt() ->> 'aal', '') = 'aal2' $$;

create function public.is_admin() returns boolean language sql stable security definer set search_path = public as
$$ select public.is_aal2() and exists (
     select 1 from public.profiles where id = (select auth.uid()) and role = 'admin' and status = 'ativo') $$;

create function public.has_permission(p text) returns boolean language sql stable security definer set search_path = public as
$$ select public.is_admin() or (public.is_aal2() and exists (
     select 1 from public.staff_permissions sp join public.profiles pr on pr.id = sp.user_id
     where sp.user_id = (select auth.uid()) and sp.permission = p and pr.role = 'funcionario' and pr.status = 'ativo')) $$;

-- Políticas
create policy profiles_select_own on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy profiles_select_admin on public.profiles for select to authenticated using (public.is_admin());
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy perms_select on public.staff_permissions for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());
create policy audit_select_admin on public.audit_log for select to authenticated using (public.is_admin());

-- Privilégios mínimos: o usuário comum só altera nome e telefone do próprio perfil.
revoke all on public.profiles, public.staff_permissions, public.audit_log from anon, authenticated;
grant select on public.profiles, public.staff_permissions, public.audit_log to authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

-- Defesa extra: mesmo com um erro de privilégio, o papel e o status não mudam por acesso direto.
create function public.protect_profile() returns trigger language plpgsql as $$
begin
  if (new.id <> old.id or new.role <> old.role or new.status <> old.status)
     and current_user in ('anon', 'authenticated') then
    raise exception 'Alteração não permitida' using errcode = '42501';
  end if;
  new.updated_at = now();
  return new;
end $$;
create trigger profiles_protect before update on public.profiles for each row execute function public.protect_profile();

-- Auditoria imutável
create function public.audit_immutable() returns trigger language plpgsql as
$$ begin raise exception 'audit_log é imutável'; end $$;
create trigger audit_no_change before update or delete on public.audit_log for each row execute function public.audit_immutable();

-- Criação do perfil. O papel é SEMPRE 'cliente': nada vindo do cadastro define papel.
-- O cadastro público exige as declarações no próprio banco, pois a chave pública do Supabase
-- permite chamar a API de cadastro sem passar pelo nosso servidor.
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  if new.invited_at is null then
    if (m ->> 'age_declared') is distinct from 'true'
       or (m ->> 'info_true') is distinct from 'true'
       or (m ->> 'terms_accepted') is distinct from 'true'
       or char_length(btrim(coalesce(m ->> 'full_name', ''))) < 3 then
      raise exception 'Declarações e dados obrigatórios ausentes';
    end if;
    insert into public.profiles (id, full_name, phone, age_declared_at, terms_version, terms_accepted_at)
    values (new.id, left(btrim(m ->> 'full_name'), 120),
            nullif(regexp_replace(coalesce(m ->> 'phone', ''), '\D', '', 'g'), ''),
            now(), left(coalesce(m ->> 'terms_version', 'v1'), 20), now());
  else -- convite feito por administrador/script (invited_at só é definido pelo servidor)
    insert into public.profiles (id, full_name)
    values (new.id, left(coalesce(nullif(btrim(m ->> 'full_name'), ''), split_part(new.email, '@', 1)), 120));
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Operações administrativas: validam papel + MFA e gravam auditoria na mesma transação.
create function public.admin_set_role(target uuid, new_role public.user_role) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Acesso negado' using errcode = '42501'; end if;
  if target = (select auth.uid()) then raise exception 'Não é possível alterar o próprio papel'; end if;
  update public.profiles set role = new_role where id = target;
  if new_role <> 'funcionario' then delete from public.staff_permissions where user_id = target; end if;
  insert into public.audit_log (actor_id, action, resource_type, resource_id, details)
  values ((select auth.uid()), 'role_changed', 'profile', target::text, jsonb_build_object('new_role', new_role));
end $$;

create function public.admin_set_status(target uuid, new_status public.user_status) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Acesso negado' using errcode = '42501'; end if;
  if target = (select auth.uid()) then raise exception 'Não é possível alterar o próprio status'; end if;
  update public.profiles set status = new_status where id = target;
  insert into public.audit_log (actor_id, action, resource_type, resource_id, details)
  values ((select auth.uid()), 'status_changed', 'profile', target::text, jsonb_build_object('new_status', new_status));
end $$;

create function public.admin_set_permissions(target uuid, perms text[]) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Acesso negado' using errcode = '42501'; end if;
  if not exists (select 1 from public.profiles where id = target and role = 'funcionario') then
    raise exception 'O usuário alvo não é funcionário';
  end if;
  delete from public.staff_permissions where user_id = target;
  insert into public.staff_permissions (user_id, permission, granted_by)
  select target, p, (select auth.uid()) from unnest(perms) p;
  insert into public.audit_log (actor_id, action, resource_type, resource_id, details)
  values ((select auth.uid()), 'permissions_changed', 'profile', target::text, jsonb_build_object('permissions', perms));
end $$;

revoke execute on function public.admin_set_role, public.admin_set_status, public.admin_set_permissions from public, anon;
grant execute on function public.admin_set_role, public.admin_set_status, public.admin_set_permissions to authenticated;
