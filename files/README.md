# Hype Infinity — site institucional

Site estático (HTML, CSS e JavaScript puro). Sem backend, banco de dados ou pagamentos.

## Estrutura
```
hype-infinity/
├── index.html
├── css/style.css
├── js/script.js
├── assets/
│   ├── logo.png        (adicionar: logo original do cliente)
│   ├── favicon.png     (adicionar: derivado da logo)
│   └── images/
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
- Número e mensagens do WhatsApp: topo de `js/script.js`.
- Produtos: seção `#produtos` em `index.html` (só com dados confirmados).
- IPTV: seção `#iptv` está com `hidden`; só ative com oferta confirmada e autorizada.
- Políticas de Privacidade e Termos de Uso são modelos e precisam de revisão.

## Pendências do cliente
- Arquivo da logo e favicon
- Confirmar que o WhatsApp +55 61 91141-1108 está correto e ativo
- Dados dos produtos (nome, capa, descrição, preço, forma de aquisição)
- Confirmação do serviço de IPTV (natureza e autorização)
- Domínio definitivo, revisão dos textos legais e dados da empresa, se quiser exibi-los
