# Hype Infinity: plataforma (Etapa 1: fundação)

Next.js 15 (TypeScript) + Supabase (Postgres, Auth, Storage) + Vercel. O site público foi migrado sem mudar texto ou design; o site estático antigo continua na pasta `hype-infinity/` e não foi alterado.

## Ver o site no VS Code
Este projeto usa Next.js, então não existe um `index.html` para abrir direto no navegador (nem a extensão Live Server funciona). Ele roda assim:
1. Instale o Node.js (versão LTS, 20 ou mais recente) em nodejs.org.
2. Extraia o zip e, no VS Code, use File > Open Folder e escolha a pasta `hype-infinity-app`.
3. Abra o terminal (Ctrl+`) e rode `npm install`.
4. Crie o arquivo `.env.local` copiando o `.env.example` (no Windows: `copy .env.example .env.local`). Para só ver o site e as telas de login, os valores fictícios já bastam; use `SITE_URL=http://localhost:3000`.
5. Rode `npm run dev` e abra http://localhost:3000 no navegador. Para parar, Ctrl+C.

Cadastro e login só funcionam depois de configurar o Supabase (seção abaixo). O site estático antigo (`hype-infinity.zip`, com `index.html`) continua abrindo normalmente com Live Server.

## O que já está implementado (Etapa 1)
- Site público idêntico ao atual, mais o link "Entrar".
- Cadastro de clientes (nome, telefone, e-mail, senha, declaração de 18+, de veracidade e aceite dos termos), login, logout e recuperação de senha.
- Papéis: cliente, funcionário e administrador (RBAC), com permissões por funcionário.
- MFA por aplicativo autenticador (TOTP): obrigatório para funcionários e administradores, opcional para clientes.
- Banco com RLS, auditoria imutável e funções administrativas (papel, status, permissões).
- Primeiro administrador criado por script seguro (`scripts/provision-admin.mjs`).
- Páginas `/conta`, `/equipe` e `/admin` protegidas (por ora mostram só dados reais: perfil, permissões e log).

**Ainda não implementado (próximas etapas):** produtos e ofertas, parcerias, notificações, formulários e recrutamento (com upload), troca de logo pelo painel, gestão de funcionários pela interface, uploads privados.

## Arquitetura e segurança
- Todo o acesso ao Supabase passa pelo servidor Next.js; o navegador nunca fala com o Supabase (`connect-src 'self'`) e os cookies de sessão são `httpOnly`.
- Autorização em 3 camadas: middleware, verificação em cada página (`lib/auth.ts`) e RLS no banco. Administrador e funcionário só têm acesso com MFA concluído (aal2), também dentro do banco.
- A chave pública do Supabase permite chamar a API de cadastro sem passar pelo nosso servidor. Por isso o próprio banco exige as declarações (maioridade, veracidade, termos) e força o papel `cliente`.
- CSP com nonce por requisição (`middleware.ts`); por isso as páginas são renderizadas sob demanda. Server Actions já verificam a origem da requisição (proteção CSRF).
- Mensagens de erro de login e recuperação são iguais para qualquer e-mail (não revelam se a conta existe).
- Limite de tentativas: login, cadastro, recuperação e verificação de MFA usam os limites embutidos do Supabase Auth (ajustáveis em Authentication > Rate Limits). Formulários próprios das próximas etapas terão antispam.
- Códigos de recuperação do MFA: o Supabase não oferece. Se alguém perder o autenticador, um administrador roda `reset-mfa` (veja abaixo).
- Nenhuma senha, código MFA ou token é registrado em log.

## Ver o site no computador (VS Code)
Este projeto não tem `index.html`: o Next.js monta a página inicial a partir de `app/page.tsx` e `components/PublicSite.tsx`, e serve tudo em um endereço local.
1. Instale o Node.js (versão LTS, 20 ou mais nova) em nodejs.org.
2. Extraia o zip e abra a pasta `hype-infinity-app` no VS Code (File > Open Folder).
3. Abra o terminal do VS Code (Ctrl+`) e rode `npm install`.
4. Crie o arquivo de ambiente: `copy .env.example .env.local` (Windows) ou `cp .env.example .env.local` (Mac/Linux). Os valores fictícios bastam para VER o site e as telas de login e cadastro. Entrar e cadastrar de verdade exige um projeto Supabase (próxima seção).
5. Rode `npm run dev` e abra http://localhost:3000 no navegador. Para parar, Ctrl+C.
Avisos de "inline style" no console do navegador, no modo `npm run dev`, vêm do painel de desenvolvimento do Next e não aparecem em produção.

## Configuração local com Supabase real
Preencha `.env.local` com `SITE_URL`, `SUPABASE_URL` e `SUPABASE_ANON_KEY` (só servidor). `SUPABASE_SERVICE_ROLE_KEY` serve apenas para o script de administrador, na sua máquina. Nunca a configure na Vercel nem a faça commit.

## Configurar o Supabase
1. Crie o projeto. Em SQL Editor, rode `supabase/migrations/0001_foundation.sql`.
2. Authentication > Providers > Email: habilite "Confirm email". Em Multi-Factor, habilite TOTP.
3. Authentication > URL Configuration: defina o Site URL (domínio final) e adicione `http://localhost:3000` aos Redirect URLs.
4. Authentication > Email Templates: troque os links dos modelos para o formato do servidor:
   - Confirmar cadastro: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`
   - Recuperar senha: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/redefinir`
   - Convite: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next=/redefinir`
5. Em Authentication > Policies de senha, defina o mínimo de 10 caracteres. Configure um SMTP próprio antes de produção (o e-mail padrão do Supabase é limitado).

## Primeiro administrador
```
node --env-file=.env.local scripts/provision-admin.mjs invite admin@empresa.com --yes
```
A pessoa recebe o convite, define a senha e é obrigada a configurar o MFA antes de entrar no painel. Outros modos: `promote <email>` (conta existente) e `reset-mfa <email>`. Cada execução fica registrada na auditoria. Não existe cadastro público que escolha o papel de administrador.

## Testes
- `npm test`: validações de cadastro e MFA (vitest).
- `python3 tests/db/rls_test.py`: regras de acesso do banco em um PostgreSQL local (precisa de `pip install pgserver "psycopg[binary]"`).
- Não automatizado, depende de um projeto Supabase real: cadastro com e-mail, confirmação, MFA ponta a ponta e envio de e-mails. Faça este roteiro manual antes de publicar.

## Implantação (Vercel)
1. Suba o repositório e importe na Vercel. Configure `SITE_URL`, `SUPABASE_URL` e `SUPABASE_ANON_KEY`.
2. Teste em um endereço de homologação antes de apontar o domínio. Só depois configure o domínio em Settings > Domains.
3. Confira os termos e planos atuais: o plano gratuito da Vercel é voltado a uso não comercial.
4. Backup: confira no plano do Supabase se há backups automáticos; se não houver, agende `pg_dump` periódico e teste a restauração.

## LGPD
Coletamos apenas nome, telefone, e-mail e as declarações de aceite (data e versão dos termos). Os textos de Política de Privacidade e Termos de Uso ainda são modelos e precisam de revisão jurídica, assim como prazos de retenção e o fluxo de exclusão de conta.

## Dependências: aviso conhecido
`npm audit` aponta 2 avisos (PostCSS embutido no Next 15.5.28: leitura de arquivo via `sourceMappingURL` e XSS ao reescrever CSS). Eles dependem de processar CSS de fonte não confiável durante o build, o que este projeto não faz (o CSS é só nosso). A correção exige migrar para o Next 16 (mudança maior, inclusive a renomeação do middleware), planejada para uma etapa própria. Rode `npm audit` antes de cada publicação.
