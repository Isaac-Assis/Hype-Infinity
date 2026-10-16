// Dados públicos e editáveis do site (contatos, redes e mensagens do WhatsApp).
// Tudo aqui é público. Nunca coloque senhas ou chaves.
export const siteConfig = {
  email: "Hypeinfinity@proton.me",
  whatsapp: {
    number: "556191141108", // +55 61 91141-1108, formato internacional sem "+"
    messages: {
      geral: "Olá! Conheci a Hype Infinity pelo site e gostaria de solicitar um orçamento para um projeto personalizado.",
      sistemas: "Olá! Conheci a Hype Infinity pelo site e gostaria de consultar um orçamento para desenvolvimento de um sistema.",
      mods: "Olá! Gostaria de saber mais sobre os serviços de mods para jogos da Hype Infinity.",
      plugins: "Olá! Gostaria de consultar a possibilidade de desenvolver um plugin para meu projeto.",
      produtos: "Olá! Gostaria de consultar a disponibilidade e as informações dos produtos da Hype Infinity."
    } as Record<string, string>
  },
  socials: [
    { label: "Instagram @hypeinfinity.ofc", href: "https://www.instagram.com/hypeinfinity.ofc/" },
    { label: "YouTube @Hype_infinity", href: "https://www.youtube.com/@Hype_infinity" },
    { label: "TikTok @hypeinfinity", href: "https://www.tiktok.com/@hypeinfinity/" }
  ]
};
