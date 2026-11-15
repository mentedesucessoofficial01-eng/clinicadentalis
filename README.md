# Dentalis · modelo demonstrativo do Estúdio Forja

Site de uma clínica odontológica **fictícia**, feito para o portfólio do Estúdio Forja.
HTML, CSS e JavaScript puros, sem instalação. Tudo (fontes, bibliotecas, mídias) fica dentro desta pasta.

## Como abrir
Dê dois cliques em `abrir-site.bat`. Ele liga um servidor local e abre `http://localhost:8622`.
(Abrir o `index.html` direto pelo arquivo não carrega a sequência de quadros.)

## O que mudar com mais frequência: `js/config.js`
- `modoPortfolio: true` → os botões de agendar e de contato abrem a janela "modelo demonstrativo".
  `false` + `clinica.whatsapp` preenchido → os botões abrem o WhatsApp da clínica (site real).
- `estudio.site` e `estudio.whatsapp` → endereços do Estúdio Forja (a confirmar).
- `janela` → textos da janela de demonstração.

## Ordem da página
| # | Seção | Mídia |
|---|---|---|
| 1 | Abertura, com a recepção num arco ("portal") | imagem 1 |
| 2 | Sequência guiada pela rolagem: 001 Chegada, 002 Acolhimento, 003 Compromisso (números) | video 1 (127 quadros no computador, 95 no celular) |
| 3 | Benefícios | foto nova (`WhatsApp Image 2026-11-15 at 17.52.36.jpeg`) |
| 4 | Tratamentos | — |
| 5 | Atendimento: conversa, exame, plano | video 2 (corte sem a fala, toca uma vez e para no último quadro) |
| 6 | Estrutura | imagem 4 (recortada sem o brilho neon) |
| 7 | Dúvidas | — |
| 8 | Chamada final | video 3 no computador, imagem 2 no celular |

A imagem 3 e a imagem 5 deram origem aos vídeos 2 e 3; os quadros dos próprios vídeos servem de capa.

## Mídias
Os originais ficam em `midia-original/` (cópia; nada é alterado). Para gerar de novo as versões leves:
```
bash tools/preparar_midia.sh
```

## Regras seguidas
- Cores 60-30-10: branco · azul-petróleo #0E7C86 · coral #FF7A59 só em botões. Texto escuro sobre o coral, por contraste.
- Nada de dado clínico, preço, CRO, endereço ou depoimento inventado. O rodapé reserva a linha do responsável técnico.
- Celular primeiro: barra fixa "Agendar avaliação", menu em tela cheia, quadros recortados sobre o balcão.
- Com "reduzir movimento" ligado no aparelho: sem rolagem suave, sem vídeo tocando, sequência vira foto com os textos.
- Sem cookies, sem formulários e sem serviços de terceiros ao abrir a página (ver `privacidade.html`).

## Testado
Chrome sem janela, controlado por script: celular 390×844 com toque, computador 1440×900 e celular com movimento reduzido.
Sem erros no console, sem rolagem lateral; janela, menu, links internos e vídeo verificados.
