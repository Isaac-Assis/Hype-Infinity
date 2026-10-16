"use client";
import { useEffect } from "react";
import { siteConfig } from "@/lib/site-config";

// Mesmo comportamento do site estático original (WhatsApp, menu mobile, cabeçalho, ano, logo).
export default function SiteBehavior() {
  useEffect(() => {
    const ac = new AbortController();
    const opt = { signal: ac.signal };
    const { number, messages } = siteConfig.whatsapp;
    document.querySelectorAll<HTMLAnchorElement>("[data-wa]").forEach((el) => {
      const text = messages[el.dataset.wa ?? ""] ?? messages.geral;
      el.href = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    });
    const burger = document.querySelector<HTMLButtonElement>(".burger");
    const menu = document.getElementById("menu");
    if (burger && menu) {
      const setMenu = (open: boolean) => {
        burger.setAttribute("aria-expanded", String(open));
        burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
        menu.classList.toggle("is-open", open);
      };
      burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"), opt);
      menu.addEventListener("click", (e) => { if ((e.target as HTMLElement).closest("a")) setMenu(false); }, opt);
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") { setMenu(false); burger.focus(); }
      }, opt);
    }
    const header = document.querySelector(".header");
    const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true, signal: ac.signal });
    const ano = document.getElementById("ano");
    if (ano) ano.textContent = String(new Date().getFullYear());
    document.querySelectorAll<HTMLImageElement>(".brand img").forEach((img) => {
      const hide = () => { img.hidden = true; };
      img.addEventListener("error", hide, opt);
      if (img.complete && img.naturalWidth === 0) hide();
    });
    return () => ac.abort();
  }, []);
  return null;
}
