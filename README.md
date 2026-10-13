# Hype Infinity — site institucional

Site estático (HTML, CSS e JavaScript puro). Sem backend, banco de dados ou pagamentos.

## Estrutura
```
hype-infinity/
├── index.html
├── css/style.css
├── js/
│   ├── config.js       (dados editáveis: número e mensagens do WhatsApp)
│   └── script.js       (comportamento)
├── assets/
│   ├── logo.png
│   ├── favicon.png
│   ├── logo-original.jpg
│   └── images/
├── vercel.json         (cabeçalhos de segurança, válidos na Vercel)
├── .gitignore
└── README.md
```

## Executar localmente
Abra `index.html` no navegador, ou rode um servidor local na pasta do projeto:
```
python3 -m http.server 8000
```
e acesse http://localhost:8000.

## Publicar (GitHub + Vercel)
1. Crie um repositório no GitHub e envie a pasta:
   `git init && git add . && git commit -m "Site Hype Infinity" && git branch -M main && git remote add origin <URL> && git push -u origin main`
2. Na Vercel, clique em Add New > Project e importe o repositório.
3. Framework Preset: Other. Não precisa de build command nem output directory. Clique em Deploy.
4. Para domínio próprio: Settings > Domains no projeto da Vercel. Depois, adicione a tag canonical e og:image no `<head>`.

## Onde editar
- Número e mensagens do WhatsApp: `js/config.js`.
- Produtos: seção `#produtos` em `index.html` (só com dados confirmados).
- IPTV: seção `#iptv` está com `hidden`; só ative com oferta confirmada e autorizada.
- Políticas de Privacidade e Termos de Uso são modelos e precisam de revisão.

## Pendências do cliente
- Arquivo da logo e favicon
- Confirmar que o WhatsApp +55 61 91141-1108 está correto e ativo
- Dados dos produtos (nome, capa, descrição, preço, forma de aquisição)
- Confirmação do serviço de IPTV (natureza e autorização)
- Domínio definitivo, revisão dos textos legais e dados da empresa, se quiser exibi-los

## Segurança
- Todo HTML, CSS e JavaScript é público: nunca coloque senhas, tokens ou chaves nesses arquivos.
- `vercel.json` aplica CSP e outros cabeçalhos, mas só valem quando o site é servido pela Vercel (não ao abrir o arquivo direto no computador). Se adicionar um script ou fonte de outro domínio, libere-o na CSP.
- O site não tem formulários, login nem banco de dados, então não há dados de usuários a proteger.

## Evolução futura (o que exigiria back-end)
- Formulário de orçamento que envia e-mail ou grava dados: função serverless (Vercel Functions) ou serviço de formulários, com validação no servidor.
- Cadastro de produtos pelo cliente: um CMS ou banco gerenciado, com autenticação.
- Área administrativa, login ou pagamentos: back-end com banco de dados e autenticação.
- Novas páginas: crie novos `.html` na raiz reaproveitando `css/style.css` e `js/script.js`.