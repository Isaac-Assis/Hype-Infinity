(() => {
  "use strict";

  // Dados vêm de js/config.js (carregado antes deste arquivo)
  const { number: WA_NUMBER, messages: MESSAGES } = window.HYPE_CONFIG.whatsapp;

  // Monta os links do WhatsApp. O visitante revisa e envia a mensagem no próprio app.
  document.querySelectorAll("[data-wa]").forEach((el) => {
    const text = MESSAGES[el.dataset.wa] || MESSAGES.geral;
    el.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });

  // Menu mobile
  const burger = document.querySelector(".burger");
  const menu = document.getElementById("menu");
  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.classList.toggle("is-open", open);
  };
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") { setMenu(false); burger.focus(); }
  });

  // Cabeçalho ganha borda ao rolar
  const header = document.querySelector(".header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Ano do rodapé
  document.getElementById("ano").textContent = new Date().getFullYear();

  // Se assets/logo.png ainda não existir, esconde a imagem e mantém o nome em texto
  // (também verifica imagens que já falharam antes deste script rodar)
  document.querySelectorAll(".brand img").forEach((img) => {
    const hide = () => { img.hidden = true; };
    img.addEventListener("error", hide);
    if (img.complete && img.naturalWidth === 0) hide();
  });
})();
