/* =========================================================================
   CONFIGURAÇÃO DA DENTALIS: tudo o que muda de um cliente para outro fica aqui.
   ========================================================================= */
window.DENTALIS = {
  /* true  = modelo do portfólio: os botões de agendar/contato abrem a janela
             "modelo demonstrativo" do Estúdio Forja.
     false = site de uma clínica real: os botões abrem o WhatsApp da clínica. */
  modoPortfolio: true,

  clinica: {
    nome: "Dentalis",
    whatsapp: "",            // só números, com DDI e DDD. Ex.: "5545999999999"
    mensagens: {
      agendamento: "Olá! Vim pelo site da Dentalis e gostaria de agendar uma avaliação.",
      contato: "Olá! Vim pelo site da Dentalis e tenho uma dúvida."
    }
  },

  estudio: {
    nome: "Estúdio Forja",
    site: "https://estudioforja.com.br",   // endereço definitivo: a confirmar
    whatsapp: "5545991164764",              // atendente virtual do Estúdio
    mensagem: "Olá! Vi o site da Dentalis e quero um site assim para o meu negócio."
  },

  /* Textos da janela, um para cada tipo de botão (data-demo="...") */
  janela: {
    agendamento: {
      titulo: "Esse clique viraria um agendamento.",
      texto: "A Dentalis é uma clínica fictícia. Num site real, este botão levaria o paciente direto para a agenda ou para o WhatsApp da clínica."
    },
    contato: {
      titulo: "Aqui começaria a conversa com a clínica.",
      texto: "A Dentalis é uma clínica fictícia. Num site real, este botão abriria o WhatsApp da recepção, com a mensagem já escrita."
    }
  }
};
