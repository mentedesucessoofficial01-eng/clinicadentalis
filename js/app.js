/* =========================================================================
   DENTALIS · Comportamento da página
   1. Links do Estúdio Forja       6. Tela de entrada
   2. Rolagem suave (Lenis)        7. Sequência guiada pela rolagem (video 1)
   3. Links internos e menu        8. Entradas das seções
   4. Janela "modelo demonstrativo" 9. Vídeos que tocam uma vez
   5. Cabeçalho e barra do celular
   ========================================================================= */
(() => {
  "use strict";

  const C = window.DENTALIS || {};
  const html = document.documentElement;
  const reduz = html.classList.contains("reduz");
  const temGSAP = !!(window.gsap && window.ScrollTrigger);
  const ehCelular = () => window.matchMedia("(max-width: 899px)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const linkWhats = (numero, msg) => `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;

  if (temGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  /* ---------- 1. Links do Estúdio Forja ---------- */
  if (C.estudio) {
    $$('[data-forja="site"]').forEach((a) => (a.href = C.estudio.site));
    $$('[data-forja="whatsapp"]').forEach((a) => (a.href = linkWhats(C.estudio.whatsapp, C.estudio.mensagem)));
  }
  $$("[data-ano]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- 2. Rolagem suave ---------- */
  let lenis = null;
  if (!reduz && window.Lenis) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    if (temGSAP) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* ---------- 3. Links internos e menu do celular ---------- */
  const topo = $("#topo");
  const menuBotao = $(".menu-botao");
  const menuCelular = $("#menu-celular");

  function abreMenu(abrir) {
    menuBotao.setAttribute("aria-expanded", String(abrir));
    menuBotao.querySelector(".sr").textContent = abrir ? "Fechar menu" : "Abrir menu";
    if (abrir) {
      menuCelular.style.top = Math.max(0, topo.getBoundingClientRect().bottom) + "px";
      menuCelular.hidden = false;
    } else {
      menuCelular.hidden = true;
    }
  }
  menuBotao.addEventListener("click", () => abreMenu(menuBotao.getAttribute("aria-expanded") !== "true"));
  window.addEventListener("resize", () => { if (!ehCelular()) abreMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menuCelular.hidden) { abreMenu(false); menuBotao.focus(); } });
  window.addEventListener("scroll", () => { if (!menuCelular.hidden) abreMenu(false); }, { passive: true });

  function rolarPara(hash) {
    const alvo = hash === "#inicio" ? 0 : $(hash);
    if (alvo === null) return;
    let y = 0;
    if (alvo !== 0) {
      y = alvo.getBoundingClientRect().top + window.scrollY;
      if (hash !== "#experiencia") y -= topo.offsetHeight;
    }
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: reduz ? "auto" : "smooth" });
  }
  $$("a[data-rolar]").forEach((a) =>
    a.addEventListener("click", (e) => {
      const hash = a.getAttribute("href");
      if (!hash || !hash.startsWith("#")) return;
      e.preventDefault();
      abreMenu(false);
      rolarPara(hash);
      history.replaceState(null, "", hash === "#inicio" ? location.pathname : hash);
    })
  );

  /* ---------- 4. Janela "modelo demonstrativo" ---------- */
  const janela = $("#demo");
  let focoAnterior = null;

  function abreJanela(tipo) {
    const clinica = C.clinica || {};
    // Site de clínica real: vai direto para o WhatsApp da clínica
    if (C.modoPortfolio === false && clinica.whatsapp) {
      const msg = (clinica.mensagens && clinica.mensagens[tipo]) || "";
      window.open(linkWhats(clinica.whatsapp, msg), "_blank", "noopener");
      return;
    }
    const t = (C.janela && C.janela[tipo]) || (C.janela && C.janela.agendamento);
    if (t) {
      $("#demo-titulo").textContent = t.titulo;
      $("#demo-texto").textContent = t.texto;
    }
    focoAnterior = document.activeElement;
    abreMenu(false);
    if (lenis) lenis.stop();
    janela.showModal();
  }
  function fechaJanela() { if (janela.open) janela.close(); }
  janela.addEventListener("close", () => {
    if (lenis) lenis.start();
    if (focoAnterior && focoAnterior.focus) focoAnterior.focus({ preventScroll: true });
  });
  $$("[data-fechar]", janela).forEach((b) => b.addEventListener("click", fechaJanela));
  janela.addEventListener("click", (e) => {
    if (e.target !== janela) return;
    const r = janela.getBoundingClientRect();
    const fora = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (fora) fechaJanela();
  });
  $$("[data-demo]").forEach((b) => b.addEventListener("click", () => abreJanela(b.dataset.demo)));

  /* ---------- 5. Cabeçalho e barra fixa do celular ---------- */
  const atualizaTopo = () => topo.classList.toggle("rolou", window.scrollY > 40);
  window.addEventListener("scroll", atualizaTopo, { passive: true });
  atualizaTopo();

  const barra = $("#barra-celular");
  const estado = { passouHero: false, pertoDoFim: false };
  function atualizaBarra() {
    const mostrar = estado.passouHero && !estado.pertoDoFim;
    barra.classList.toggle("visivel", mostrar);
    barra.setAttribute("aria-hidden", String(!mostrar));
    barra.querySelector("button").tabIndex = mostrar ? 0 : -1;
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => {
      estado.passouHero = !e.isIntersecting && e.boundingClientRect.top < 0;
      atualizaBarra();
    }).observe($(".hero__acoes"));
    const fins = new Set();
    const ioFim = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? fins.add(e.target) : fins.delete(e.target)));
      estado.pertoDoFim = fins.size > 0;
      atualizaBarra();
    }, { rootMargin: "0px 0px -20% 0px" });
    [$(".final__acoes"), $(".rodape")].forEach((el) => ioFim.observe(el));
  }

  /* ---------- 7. Sequência guiada pela rolagem ---------- */
  const filme = iniciaFilme();

  function iniciaFilme() {
    const secao = $(".filme");
    const canvas = $("#filme-canvas");
    if (!secao || !canvas || reduz || !temGSAP) return { primeiro: Promise.resolve() };

    const celular = ehCelular();
    const pasta = celular ? "frames/mobile/" : "frames/desktop/";
    const TOTAL = celular ? 95 : 127;
    const VELOCIDADE = 1.6; // a clínica termina de aparecer em ~62% da seção
    const ctx = canvas.getContext("2d");
    const quadros = new Array(TOTAL);
    let alvo = 0;
    let pedido = false;

    html.classList.add("filme-ativo");

    const caminho = (i) => `${pasta}q_${String(i + 1).padStart(3, "0")}.webp`;
    const carrega = (i) =>
      new Promise((res) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => { quadros[i] = img; agenda(); res(img); };
        img.onerror = () => res(null);
        img.src = caminho(i);
      });

    function ajustaTamanho() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      desenha();
    }

    function desenha() {
      pedido = false;
      let img = quadros[alvo];
      if (!img) {
        for (let d = 1; d < TOTAL && !img; d++) img = quadros[alvo - d] || quadros[alvo + d];
      }
      if (!img || !canvas.width) return;
      const cw = canvas.width, ch = canvas.height;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const s = Math.max(cw / iw, ch / ih); // cenário: cobre a tela inteira
      const dw = iw * s, dh = ih * s;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }
    function agenda() { if (!pedido) { pedido = true; requestAnimationFrame(desenha); } }

    // Primeiro quadro já, o resto em segundo plano (4 por vez, na ordem do filme)
    const primeiro = carrega(0);
    primeiro.then(async () => {
      let proximo = 1;
      const trabalhador = async () => { while (proximo < TOTAL) await carrega(proximo++); };
      await Promise.all([trabalhador(), trabalhador(), trabalhador(), trabalhador()]);
    });

    // Abertura em círculo: a "porta" se abre enquanto a seção sobe
    const palco = $(".filme__palco", secao);
    ScrollTrigger.create({
      trigger: secao, start: "top bottom", end: "top top", scrub: true,
      onUpdate: (st) => {
        palco.style.clipPath = st.progress >= 1 ? "none" : `circle(${14 + st.progress * 62}% at 50% 50%)`;
      },
    });

    // Cenas laterais
    const cenas = $$(".cena", secao).map((el) => {
      const sombraNome = el.dataset.sombra;
      const sombra = sombraNome === "veu" ? $(".filme__veu", secao) : $(`.filme__sombra--${sombraNome}`, secao);
      const filhos = $$(".rotulo, .cena__titulo, .cena__texto, .numero, .btn", el);
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(sombra, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power1.out" }, 0);
      tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0);
      switch (el.dataset.animacao) {
        case "desliza-esq":
          tl.from(filhos, { x: -70, autoAlpha: 0, stagger: 0.12, duration: 0.8, ease: "power3.out" }, 0.05);
          break;
        case "recorte":
          tl.from(filhos, { clipPath: "inset(0 0 100% 0)", y: 30, autoAlpha: 0, stagger: 0.13, duration: 0.9, ease: "power4.out" }, 0.05);
          break;
        default:
          tl.from(filhos, { y: 50, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" }, 0.1);
      }
      return {
        el, tl, visivel: false,
        entra: +el.dataset.entra / 100,
        sai: +el.dataset.sai / 100,
        fixa: el.dataset.fixa === "true",
        contadores: $$(".contador", el),
      };
    });

    function conta(cena) {
      cena.contadores.forEach((el) => {
        const final = +el.dataset.valor;
        const o = { v: 0 };
        el.textContent = "0";
        gsap.to(o, { v: final, duration: 1.6, ease: "power2.out", delay: 0.25, onUpdate: () => (el.textContent = Math.round(o.v)) });
      });
    }

    const letreiro = $(".letreiro", secao);
    const letreiroTexto = $(".letreiro__texto", secao);
    gsap.fromTo(letreiroTexto, { xPercent: 0 }, {
      xPercent: -42, ease: "none",
      scrollTrigger: { trigger: secao, start: "top top", end: "bottom bottom", scrub: true },
    });
    const opacidadeLetreiro = (p) => {
      if (p < 0.1 || p > 0.66) return 0;
      if (p < 0.18) return (p - 0.1) / 0.08;
      if (p > 0.58) return (0.66 - p) / 0.08;
      return 1;
    };

    ScrollTrigger.create({
      trigger: secao, start: "top top", end: "bottom bottom",
      onUpdate: (st) => {
        const p = st.progress;
        const i = Math.round(Math.min(p * VELOCIDADE, 1) * (TOTAL - 1));
        if (i !== alvo) { alvo = i; agenda(); }
        letreiro.style.opacity = opacidadeLetreiro(p).toFixed(3);
        cenas.forEach((c) => {
          const dentro = p >= c.entra && (p < c.sai || c.fixa);
          if (dentro && !c.visivel) { c.visivel = true; c.tl.timeScale(1).play(); conta(c); }
          else if (!dentro && c.visivel) { c.visivel = false; c.tl.timeScale(1.6).reverse(); }
        });
      },
    });

    window.addEventListener("resize", ajustaTamanho);
    ajustaTamanho();
    return { primeiro };
  }

  /* ---------- 8. Entradas das seções ---------- */
  if (temGSAP && !reduz) {
    const tipos = {
      "sobe": { y: 44, autoAlpha: 0, stagger: 0.1, duration: 0.9, ease: "power3.out" },
      "sobe-lista": { y: 40, autoAlpha: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" },
      "desliza-esq": { x: -60, autoAlpha: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" },
      "desliza-dir": { x: 60, autoAlpha: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" },
      "recorte": { clipPath: "inset(0 0 100% 0)", y: 24, autoAlpha: 0, stagger: 0.12, duration: 1, ease: "power4.out" },
      "escala": { scale: 0.9, autoAlpha: 0, stagger: 0.12, duration: 1, ease: "power2.out" },
      "gira": { y: 40, rotation: 2, autoAlpha: 0, stagger: 0.1, duration: 0.9, ease: "power3.out" },
    };
    $$(".revela").forEach((el) => {
      const alvos = [...el.children].flatMap((f) => (f.matches("ul, ol") ? [...f.children] : [f]));
      const tipo = tipos[el.dataset.animacao] || tipos.sobe;
      gsap.from(alvos, { ...tipo, transformOrigin: "0% 50%", scrollTrigger: { trigger: el, start: "top 84%", once: true } });
    });

    gsap.fromTo(".beneficios__foto img", { scale: 1.12 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: ".beneficios", start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.from(".estrutura__foto", {
      clipPath: "inset(0 0 0 100%)", duration: 1.3, ease: "power4.inOut",
      scrollTrigger: { trigger: ".estrutura", start: "top 75%", once: true },
    });
    gsap.from(".atendimento__video", {
      scale: 0.92, autoAlpha: 0, duration: 1.1, ease: "power2.out",
      scrollTrigger: { trigger: ".atendimento", start: "top 80%", once: true },
    });
    gsap.from(".final__midia", {
      clipPath: "inset(18% 18% 18% 18%)", duration: 1.3, ease: "power3.out",
      scrollTrigger: { trigger: ".final", start: "top 75%", once: true },
    });
  }

  /* ---------- 9. Vídeos que tocam uma vez e param no último quadro ---------- */
  function tocaUmaVez(video) {
    if (!video) return;
    if (reduz) { video.poster = video.dataset.fim; return; }
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        video.preload = "auto";
        const p = video.play();
        if (p && p.catch) p.catch(() => (video.poster = video.dataset.fim));
      });
    }, { threshold: 0.55 });
    io.observe(video);
  }
  tocaUmaVez($("#video-atendimento"));
  if (!ehCelular()) tocaUmaVez($("#video-final"));

  /* ---------- 10. Dúvidas: só uma resposta aberta por vez ----------
     Ao abrir uma pergunta, a que estava aberta recolhe sozinha. A pergunta
     tocada fica parada no mesmo ponto da tela, mesmo que a de cima encolha. */
  const duvidas = $$(".duvidas details");
  let refrescar = null;
  duvidas.forEach((item) => {
    const pergunta = item.querySelector("summary");
    let posicaoAntes = null;
    pergunta.addEventListener("click", () => { posicaoAntes = pergunta.getBoundingClientRect().top; });
    item.addEventListener("toggle", () => {
      if (item.open) {
        duvidas.forEach((outro) => { if (outro !== item && outro.open) outro.open = false; });
        if (posicaoAntes !== null) {
          const antes = posicaoAntes;
          requestAnimationFrame(() => {
            const desvio = pergunta.getBoundingClientRect().top - antes;
            if (Math.abs(desvio) > 1) {
              if (lenis) lenis.scrollTo(window.scrollY + desvio, { immediate: true, force: true });
              else window.scrollBy(0, desvio);
            }
          });
        }
      }
      posicaoAntes = null;
      if (temGSAP) { clearTimeout(refrescar); refrescar = setTimeout(() => ScrollTrigger.refresh(), 450); }
    });
  });

  /* ---------- 6. Tela de entrada ---------- */
  const loader = $("#loader");
  const barraLoader = $("#loader-bar");
  const pctLoader = $("#loader-percent");
  let etapas = 0;
  const avanca = () => {
    etapas++;
    const pct = Math.round((etapas / 3) * 100);
    barraLoader.style.width = pct + "%";
    pctLoader.textContent = pct + "%";
  };
  const fotoHero = $(".hero__portal img");
  const fotoPronta = fotoHero.complete
    ? Promise.resolve()
    : new Promise((r) => { fotoHero.addEventListener("load", r, { once: true }); fotoHero.addEventListener("error", r, { once: true }); });
  const fontes = document.fonts ? document.fonts.ready : Promise.resolve();

  Promise.race([
    Promise.all([fotoPronta.then(avanca), fontes.then(avanca), filme.primeiro.then(avanca)]),
    espera(1400),
  ]).then(() => {
    barraLoader.style.width = "100%";
    pctLoader.textContent = "100%";
    loader.classList.add("saiu");
    html.classList.add("pronto");
    if (temGSAP) ScrollTrigger.refresh();
  });
  window.addEventListener("load", () => temGSAP && ScrollTrigger.refresh());
})();
