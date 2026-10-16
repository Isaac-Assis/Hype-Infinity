import { siteConfig } from "@/lib/site-config";

// Conteúdo migrado do site estático original, sem alterações de texto ou design.
export default function PublicSite() {
  return (
    <>
<a className="skip" href="#conteudo">Pular para o conteúdo</a>

  <header className="header" id="topo">
    <div className="wrap header__in">
      <a className="brand" href="#inicio" aria-label="Hype Infinity, ir para o início">
        <img src="/assets/logo.png" alt="" width="47" height="28" id="logo-img" />
        <span className="brand__name">Hype Infinity</span>
      </a>
      <button className="burger" aria-expanded="false" aria-controls="menu" aria-label="Abrir menu"><span></span><span></span><span></span></button>
      <nav className="nav" id="menu" aria-label="Principal">
        <a href="#inicio">Início</a>
        <a href="#servicos">Serviços</a>
        <a href="#produtos">Produtos</a>
        <a href="#sobre">Sobre</a>
        <a href="#contato">Contato</a>
        <a href="/entrar">Entrar</a>
        <a className="btn btn--gold btn--sm" data-wa="geral" href="#contato">Solicitar orçamento</a>
      </nav>
    </div>
  </header>

  <main id="conteudo">
    <section className="hero" id="inicio">
      <div className="wrap hero__in">
        <div className="hero__text">
          <h1>Ideias que ganham vida. Soluções sem limites.</h1>
          <p>Desenvolvimento de sistemas, soluções para jogos e plugins personalizados para transformar ideias em projetos digitais.</p>
          <div className="actions">
            <a className="btn btn--gold" data-wa="geral" href="#contato">Solicitar orçamento</a>
            <a className="btn btn--ghost" href="#servicos">Conhecer nossos serviços</a>
          </div>
        </div>
        <img className="hero__art" src="/assets/logo.png" alt="Logo da Hype Infinity: símbolo de infinito dourado" width="731" height="434" fetchPriority="high" />
      </div>
    </section>

    <section className="sec" id="servicos">
      <div className="wrap">
        <h2>Nossas soluções</h2>
        <p className="lead">Tecnologia e criatividade para tirar projetos do papel.</p>
        <div className="grid3">
          <article className="card">
            <svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg>
            <h3>Desenvolvimento de sistemas</h3>
            <p>Soluções digitais personalizadas de acordo com as necessidades de cada projeto.</p>
            <a className="btn btn--line" data-wa="sistemas" href="#contato">Consultar serviço</a>
          </article>
          <article className="card">
            <svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10v5M4.5 12.5h5M15.5 11h.01M18 14h.01"/></svg>
            <h3>Mods para jogos</h3>
            <p>Personalizações e modificações para jogos, conforme as possibilidades de cada projeto.</p>
            <a className="btn btn--line" data-wa="mods" href="#contato">Consultar serviço</a>
          </article>
          <article className="card">
            <svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3v5M15 3v5M6 8h12v4a6 6 0 0 1-12 0V8zM12 18v3"/></svg>
            <h3>Plugins para aplicativos</h3>
            <p>Plugins e funcionalidades adicionais para aplicativos e plataformas compatíveis.</p>
            <a className="btn btn--line" data-wa="plugins" href="#contato">Consultar serviço</a>
          </article>
        </div>
      </div>
    </section>

    <section className="sec sec--alt" id="produtos">
      <div className="wrap">
        <h2>Livros e produtos digitais</h2>
        <div className="empty">
          <p>O catálogo está sendo preparado. Para saber o que está disponível e como adquirir, fale com a gente pelo WhatsApp.</p>
          <a className="btn btn--gold" data-wa="produtos" href="#contato">Consultar disponibilidade</a>
        </div>
        
      </div>
    </section>

    
    <section className="sec" id="iptv" hidden>
      <div className="wrap"><h2>IPTV</h2><p className="lead">Conteúdo a ser definido.</p></div>
    </section>

    <section className="sec" id="sobre">
      <div className="wrap about">
        <div>
          <h2>Tecnologia com propósito. Soluções sob medida.</h2>
          <p className="lead">A Hype Infinity atua na criação e oferta de soluções digitais, buscando transformar ideias em projetos que atendam às necessidades de cada cliente.</p>
        </div>
        <ul className="values">
          <li><strong>Criatividade</strong><span>Ideias pensadas para cada projeto.</span></li>
          <li><strong>Personalização</strong><span>Cada solução é ajustada ao que você precisa.</span></li>
          <li><strong>Tecnologia</strong><span>Ferramentas adequadas ao objetivo do projeto.</span></li>
          <li><strong>Compromisso</strong><span>Atenção a cada projeto, do contato à entrega.</span></li>
        </ul>
      </div>
    </section>

    <section className="sec sec--alt" id="processo">
      <div className="wrap">
        <h2>Como funciona o atendimento</h2>
        <p className="lead">Orçamento, prazo e condições são definidos individualmente, de acordo com cada projeto.</p>
        <ol className="steps">
          <li><b>1</b><h3>Entre em contato</h3><p>Chame a gente pelo WhatsApp.</p></li>
          <li><b>2</b><h3>Explique sua ideia</h3><p>Conte o que você quer criar.</p></li>
          <li><b>3</b><h3>Receba uma proposta</h3><p>Com valores e prazos do seu projeto.</p></li>
          <li><b>4</b><h3>Alinhe os detalhes</h3><p>Ajustamos tudo antes de começar.</p></li>
        </ol>
      </div>
    </section>

    <section className="sec" id="faq">
      <div className="wrap wrap--narrow">
        <h2>Perguntas frequentes</h2>
        <details className="qa" name="faq"><summary>Como posso solicitar um orçamento?</summary><p>Clique em “Solicitar orçamento”. O WhatsApp abre com uma mensagem pronta, que você revisa e envia.</p></details>
        <details className="qa" name="faq"><summary>Quais informações devo enviar?</summary><p>Conte o que deseja criar, para qual plataforma ou jogo, e qualquer referência que ajude a entender o projeto.</p></details>
        <details className="qa" name="faq"><summary>É possível desenvolver um sistema personalizado?</summary><p>Sim, o desenvolvimento de sistemas é feito sob medida. A viabilidade de cada ideia é avaliada na conversa inicial.</p></details>
        <details className="qa" name="faq"><summary>Como consultar a disponibilidade dos produtos?</summary><p>Use o botão da seção de produtos para perguntar pelo WhatsApp o que está disponível no momento.</p></details>
        <details className="qa" name="faq"><summary>Como são definidos os prazos?</summary><p>Os prazos dependem do tamanho e da complexidade de cada projeto e são combinados junto com a proposta.</p></details>
      </div>
    </section>

    <section className="sec sec--alt" id="contato">
      <div className="wrap contact">
        <div>
          <h2>Vamos tirar sua ideia do papel?</h2>
          <p className="lead">Entre em contato com a Hype Infinity e explique o que você precisa.</p>
          <a className="btn btn--gold" data-wa="geral" href="#contato">Falar no WhatsApp</a>
        </div>
        <ul className="links">
          <li><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></li>
          {siteConfig.socials.map((s) => (
            <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>
          ))}
        </ul>
      </div>
    </section>

    
    <section className="sec legal" id="privacidade">
      <div className="wrap wrap--narrow">
        <h2>Política de Privacidade</h2>
        <p><em>Modelo a ser revisado antes da publicação.</em> Este site não coleta dados por formulários. Ao clicar nos botões de contato, você é levado ao WhatsApp, onde a conversa segue as regras do próprio aplicativo. Ao entrar em contato, você fornece voluntariamente as informações que escolher enviar.</p>
      </div>
    </section>
    <section className="sec legal" id="termos">
      <div className="wrap wrap--narrow">
        <h2>Termos de Uso</h2>
        <p><em>Modelo a ser revisado antes da publicação.</em> O conteúdo deste site tem caráter informativo. Orçamentos, prazos e condições são definidos individualmente com cada cliente e só valem após acordo entre as partes.</p>
      </div>
    </section>
  </main>

  <footer className="footer">
    <div className="wrap footer__in">
      <div className="brand"><img src="/assets/logo.png" alt="" width="47" height="28" id="logo-foot" /><span className="brand__name">Hype Infinity</span></div>
      <nav aria-label="Rodapé">
        <a href="#inicio">Início</a><a href="#servicos">Serviços</a><a href="#produtos">Produtos</a><a href="#sobre">Sobre</a><a href="#contato">Contato</a><a href="/entrar">Entrar</a>
      </nav>
      <p><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
      <p className="small">© <span id="ano">2026</span> Hype Infinity. Todos os direitos reservados. Desenvolvido pela NexaWeb. <a href="#privacidade">Política de Privacidade</a> | <a href="#termos">Termos de Uso</a></p>
    </div>
  </footer>
    </>
  );
}
