(() => {
  "use strict";

  // WhatsApp: número no formato internacional, sem "+" e sem espaços (+55 61 91141-1108)
  const WA_NUMBER = "556191141108";
  const MESSAGES = {
    geral: "Olá! Conheci a Hype Infinity pelo site e gostaria de solicitar um orçamento para um projeto personalizado.",
    sistemas: "Olá! Conheci a Hype Infinity pelo site e gostaria de consultar um orçamento para desenvolvimento de um sistema.",
    mods: "Olá! Gostaria de saber mais sobre os serviços de mods para jogos da Hype Infinity.",
    plugins: "Olá! Gostaria de consultar a possibilidade de desenvolver um plugin para meu projeto.",
    produtos: "Olá! Gostaria de consultar a disponibilidade e as informações dos produtos da Hype Infinity."
  };

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
  document.querySelectorAll(".brand img").forEach((img) => {
    img.addEventListener("error", () => { img.hidden = true; });
  });
})();
