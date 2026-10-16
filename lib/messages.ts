// Mensagens fixas: a URL só carrega códigos, nunca texto livre (evita reflexão de conteúdo).
export const ERRORS: Record<string, string> = {
  dados: "Confira os campos e tente novamente.",
  declaracoes: "Marque as declarações obrigatórias, incluindo a de maioridade (18 anos ou mais).",
  senha: "A senha deve ter de 10 a 72 caracteres, com letras e números, e a confirmação deve ser igual.",
  falha: "Não foi possível concluir a operação. Tente novamente.",
  credenciais: "E-mail ou senha incorretos, ou e-mail ainda não confirmado.",
  suspenso: "Esta conta está indisponível. Fale com a Hype Infinity.",
  link: "Link inválido ou expirado. Solicite um novo.",
  codigo: "Código inválido ou expirado. Confira o aplicativo autenticador."
};
export const OKS: Record<string, string> = {
  confirme: "Cadastro recebido. Enviamos um link de confirmação para o seu e-mail.",
  enviado: "Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.",
  senha: "Senha atualizada com sucesso."
};
