# Testa as regras de acesso do banco em um PostgreSQL local (pip install pgserver "psycopg[binary]"). Rode da raiz: python3 tests/db/rls_test.py
import pgserver, psycopg, json, tempfile, uuid, sys
srv=pgserver.get_server(tempfile.mkdtemp()); uri=srv.get_uri()
c=psycopg.connect(uri,autocommit=True)
x=lambda q,*a: c.execute(q,a)
# --- stubs mínimos do Supabase ---
x("create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;")
x("create schema auth; create table auth.users(id uuid primary key default gen_random_uuid(), email text, invited_at timestamptz, raw_user_meta_data jsonb);")
x("""create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claims',true)::jsonb->>'sub','')::uuid $$;
create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
grant usage on schema auth to authenticated, anon, service_role; grant usage on schema public to authenticated, anon, service_role;""")
x(open('supabase/migrations/0001_foundation.sql').read())
x("grant all on all tables in schema public to service_role")
x("grant all on all tables in schema auth to service_role")
ok=0; fail=0
def check(name,cond):
    global ok,fail
    print(('PASS' if cond else 'FAIL'),name); ok+=cond; fail+=(not cond)
good=lambda n,**k:{'full_name':n,'age_declared':True,'info_true':True,'terms_accepted':True,'role':'admin','phone':'(61) 91234-5678',**k}
def signup(mail,meta,invited=False):
    uid=str(uuid.uuid4())
    c.execute("insert into auth.users(id,email,invited_at,raw_user_meta_data) values (%s,%s,%s,%s)",(uid,mail,'now()' if invited else None,json.dumps(meta)))
    return uid
def as_user(uid,aal='aal2'):
    c.execute("set role authenticated"); c.execute("select set_config('request.jwt.claims',%s,false)",(json.dumps({'sub':uid,'aal':aal}),))
def reset(): c.execute("reset role")
def raises(fn):
    try: fn(); return False
    except psycopg.Error: return True
    finally: reset()
# 1) Cadastro
check('cadastro sem declaração de maioridade é bloqueado no banco', raises(lambda: signup('a@x.com',{'full_name':'Ana Souza','info_true':True,'terms_accepted':True})))
check('cadastro com nome curto é bloqueado', raises(lambda: signup('b@x.com',good('Al'))))
cli=signup('cli@x.com',good('Cliente Um')); cli2=signup('cli2@x.com',good('Cliente Dois'))
check("papel 'admin' enviado no cadastro é ignorado (vira cliente)", c.execute("select role from profiles where id=%s",(cli,)).fetchone()[0]=='cliente')
check('telefone é normalizado só com dígitos', c.execute("select phone from profiles where id=%s",(cli,)).fetchone()[0]=='61912345678')
adm=signup('adm@x.com',{},invited=True); staff=signup('func@x.com',{},invited=True)
check('conta convidada cria perfil como cliente', c.execute("select role from profiles where id=%s",(adm,)).fetchone()[0]=='cliente')
c.execute("set role service_role"); c.execute("update profiles set role='admin' where id=%s",(adm,)); c.execute("update profiles set role='funcionario' where id=%s",(staff,)); reset()
# 2) Cliente
as_user(cli); n=c.execute("select count(*) from profiles").fetchone()[0]; reset()
check('cliente enxerga apenas o próprio perfil', n==1)
as_user(cli); c.execute("update profiles set full_name='Cliente Novo' where id=%s",(cli,)); reset()
check('cliente edita o próprio nome', c.execute("select full_name from profiles where id=%s",(cli,)).fetchone()[0]=='Cliente Novo')
check('cliente NÃO consegue virar admin (update direto)', (as_user(cli) or True) and raises(lambda: c.execute("update profiles set role='admin' where id=%s",(cli,))))
as_user(cli); n=c.execute("update profiles set full_name='Hack' where id=%s",(cli2,)).rowcount; reset()
check('cliente NÃO altera perfil de outro (0 linhas)', n==0)
check('cliente NÃO lê auditoria', (as_user(cli) or True) and c.execute("select count(*) from audit_log").fetchone()[0]==0 and not reset())
check('cliente NÃO executa admin_set_role', (as_user(cli) or True) and raises(lambda: c.execute("select admin_set_role(%s,'admin')",(cli,))))
# 3) Administrador
as_user(adm,'aal1'); n=c.execute("select count(*) from profiles").fetchone()[0]; reset()
check('admin SEM MFA (aal1) enxerga só o próprio perfil', n==1)
check('admin SEM MFA não executa admin_set_role', (as_user(adm,'aal1') or True) and raises(lambda: c.execute("select admin_set_role(%s,'funcionario')",(cli,))))
as_user(adm); n=c.execute("select count(*) from profiles").fetchone()[0]; reset()
check('admin COM MFA (aal2) enxerga todos os perfis', n==4)
as_user(adm); c.execute("select admin_set_permissions(%s,%s)",(staff,['produtos.ver','produtos.editar'])); reset()
check('admin define permissões de funcionário (com auditoria)', c.execute("select count(*) from audit_log where action='permissions_changed'").fetchone()[0]==1)
check('admin NÃO altera o próprio papel', (as_user(adm) or True) and raises(lambda: c.execute("select admin_set_role(%s,'cliente')",(adm,))))
check('permissão inválida é rejeitada', (as_user(adm) or True) and raises(lambda: c.execute("select admin_set_permissions(%s,%s)",(staff,['tudo.liberado']))))
as_user(adm); c.execute("select admin_set_status(%s,'suspenso')",(cli2,)); reset()
check('admin suspende conta (com auditoria)', c.execute("select status from profiles where id=%s",(cli2,)).fetchone()[0]=='suspenso')
# 4) Funcionário
as_user(staff); a=c.execute("select has_permission('produtos.editar')").fetchone()[0]; b=c.execute("select has_permission('ofertas.gerir')").fetchone()[0]; reset()
check('funcionário tem só as permissões concedidas', a is True and b is False)
as_user(staff,'aal1'); a=c.execute("select has_permission('produtos.editar')").fetchone()[0]; reset()
check('funcionário SEM MFA perde as permissões', a is False)
check('funcionário NÃO altera permissões de colegas', (as_user(staff) or True) and raises(lambda: c.execute("select admin_set_permissions(%s,%s)",(staff,['ofertas.gerir']))))
as_user(staff); n=c.execute("select count(*) from staff_permissions").fetchone()[0]; reset()
check('funcionário vê só as próprias permissões', n==2)
# 5) Auditoria imutável e defesa extra
check('audit_log não pode ser alterado', raises(lambda: c.execute("update audit_log set action='x'")))
check('audit_log não pode ser apagado', raises(lambda: c.execute("delete from audit_log")))
c.execute("grant update on profiles to authenticated")  # simula um erro de privilégio
check('trigger bloqueia mudança de papel mesmo com privilégio de update', (as_user(cli) or True) and raises(lambda: c.execute("update profiles set role='admin' where id=%s",(cli,))))
c.execute("revoke update on profiles from authenticated; grant update (full_name, phone) on profiles to authenticated")
check('anon não lê nada', (c.execute("set role anon") or True) and raises(lambda: c.execute("select * from profiles")))
print(f'\n{ok} aprovados, {fail} reprovados'); sys.exit(1 if fail else 0)
