// Modo celular (aluPhone): tela de bloqueio, tela inicial em páginas, apps em tela cheia,
// Zizi flutuando, Mensagens (SMS), Banco Savana, Toques e uma ligação surpresa.
(function () {
  const ALU = window.ALU, esc = ALU.esc;
  const T = (pt, en) => (ALU.T ? ALU.T(pt, en) : pt);
  const VOLTAR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>`;
  const ls = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };

  // apps que só existem no celular
  Object.assign(ALU.APPS, {
    sms: { titulo: "Mensagens", icone: "sms" },
    banco: { titulo: "Banco Savana", icone: "banco" },
    toque: { titulo: "Toques", icone: "toque" },
  });
  const PROPRIOS = { sms: renderSMS, banco: renderBanco, toque: renderToque };

  const PAG1 = ["pasta:sobre", "pasta:projetos", "pasta:contatos", "pasta:skills", "sms", "banco", "quarto", "notas"];
  const PAG2_FIM = ["concord", "toque", "ajustes", "lixeira"];
  const DOCK = ["chat", "kez", "peep", "terminal"];

  // ================= toques (melodias originais, tocadas com Web Audio) =================
  const TOQUES = [
    { id: "savana", nome: "Savana Jazz", bpm: 150, onda: "sawtooth", filtro: 1800,
      mel: [[67, .5], [70, .5], [72, .5], [75, 1], [72, .5], [70, .5], [67, 1], [0, .5], [65, .5], [67, .5], [70, .5], [67, 1.5], [0, .5],
        [72, .5], [75, .5], [77, .5], [79, 1], [77, .5], [75, .5], [72, .5], [70, .5], [67, 2]],
      baixo: [[48, 1], [0, .5], [48, .5], [51, 1], [53, 1], [55, 1], [0, .5], [55, .5], [53, 1], [51, 1], [48, 1], [0, .5], [48, .5], [51, 1], [53, 1], [55, 1], [53, 1], [51, 1], [48, 1]] },
    { id: "bip", nome: "Bip 2006", bpm: 180, onda: "square", filtro: 5000,
      mel: [[88, .5], [86, .5], [78, 1], [80, 1], [85, .5], [83, .5], [74, 1], [76, 1], [83, .5], [81, .5], [73, 1], [76, 1], [81, 3], [0, 1]] },
    { id: "zizi", nome: "Zizi ⚔️", bpm: 140, onda: "triangle", filtro: 6000,
      mel: [[72, .5], [76, .5], [79, .5], [84, 1], [79, .5], [84, 1.5], [0, .5], [74, .5], [77, .5], [81, .5], [86, 1], [81, .5], [86, 1.5], [0, .5],
        [76, .5], [79, .5], [83, .5], [88, 1.5], [86, .5], [84, 2], [0, 1]] },
    // a música do modo difícil da Batalha de Ritmo, em versão toque: arpejos sobre acordes de sétima que descem
    { id: "coral", nome: "Recife de Coral 🌊", bpm: 132, onda: "triangle", filtro: 2600, eco: true, ...(() => {
      const PROG = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59], [46, 50, 53, 57], [45, 48, 52, 55], [43, 46, 50, 53], [45, 49, 52, 55]];
      const FORMAS = [[0, 1, 2, 3, 2, 1, 2, 3], [0, 2, 1, 3, 2, 3, 1, 2], [3, 2, 1, 2, 0, 1, 2, 3], [0, 1, 3, 2, 3, 1, 2, 0]];
      const mel = [], baixo = [];
      PROG.forEach((ac, c) => {
        FORMAS[c % 4].forEach((k, i) => mel.push(i === 7 && c % 2 === 1 ? [0, .5] : [ac[k] + 12, .5]));
        baixo.push([ac[0] - 12, 2], [ac[0], 2]);
      });
      return { mel, baixo };
    })() },
  ];
  let actx = null, tocando = null;
  // iPhone: a chave do silencioso cala o Web Audio e o som só sai depois de um toque.
  // No primeiro toque em qualquer lugar, liga o áudio no modo "reprodução" e destrava o AudioContext,
  // assim os toques (e a ligação surpresa, que chega sem ninguém tocar na tela) funcionam.
  const SILENCIO = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
  let destravado = false;
  function destravarAudio() {
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch {}
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state !== "running") actx.resume(); } catch {}
    if (destravado) return; destravado = true;
    try { const a = new Audio(SILENCIO); a.setAttribute("playsinline", ""); a.play().catch(() => {}); } catch {}
  }
  ALU.destravarAudio = destravarAudio;
  ["pointerdown", "touchend", "keydown"].forEach((ev) => document.addEventListener(ev, destravarAudio, { capture: true, passive: true }));
  function tocar(id, loop = true) {
    parar();
    const t = TOQUES.find((x) => x.id === id) || TOQUES[0];
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state !== "running") actx.resume(); } catch { return; }
    const out = actx.createGain(); out.gain.value = 0.16; out.connect(actx.destination);
    const lp = actx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = t.filtro; lp.connect(out);
    if (t.eco) { // eco de água, como no jogo
      const d = actx.createDelay(1), fb = actx.createGain(); d.delayTime.value = (60 / t.bpm) * 0.75; fb.gain.value = 0.35;
      lp.connect(d); d.connect(fb); fb.connect(d); d.connect(out);
    }
    const b = 60 / t.bpm, dur = (seq) => seq.reduce((a, [, d]) => a + d, 0) * b;
    const voz = (seq, onda, vol, t0) => {
      let at = t0;
      seq.forEach(([n, d]) => {
        if (n) {
          const o = actx.createOscillator(), g = actx.createGain();
          o.type = onda; o.frequency.value = 440 * 2 ** ((n - 69) / 12);
          g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + 0.015); g.gain.setTargetAtTime(vol * 0.55, at + 0.05, 0.08); g.gain.setTargetAtTime(0, at + d * b * 0.85, 0.03);
          o.connect(g); g.connect(lp); o.start(at); o.stop(at + d * b + 0.2);
        }
        at += d * b;
      });
    };
    const volta = Math.max(dur(t.mel), t.baixo ? dur(t.baixo) : 0) + b;
    let prox = actx.currentTime + 0.05;
    const agenda = () => { voz(t.mel, t.onda, 0.5, prox); if (t.baixo) voz(t.baixo, "triangle", 0.7, prox); prox += volta; };
    agenda();
    const timer = loop ? setInterval(() => { if (prox - actx.currentTime < 1) agenda(); }, 250) : null;
    tocando = { out, timer };
    if (!loop) setTimeout(() => tocando && tocando.out === out && parar(), volta * 1000);
  }
  function parar() {
    if (!tocando) return;
    clearInterval(tocando.timer);
    try { tocando.out.gain.setTargetAtTime(0, actx.currentTime, 0.03); const o = tocando.out; setTimeout(() => o.disconnect(), 200); } catch {}
    tocando = null;
  }
  const toqueAtual = () => ls.get("alu.toque") || "savana";

  // ================= SMS =================
  const CONVERSAS = () => [
    { id: "alu", nome: "aluisio.dev", ini: "A", cor: "#18c3d6", msgs: [
      ["eles", T("salva meu número aí 😎", "save my number 😎")]],
      resp: () => T("respondo melhor pelo MessagerTale, me chama lá! 💬", "I reply faster on MessagerTale, ping me there! 💬") },
    { id: "banco", nome: "Banco Savana", ini: "$", cor: "#7a2ff0", msgs: [
      ["eles", T("Compra aprovada: PADARIA DO ZE R$ 3,50.", "Purchase approved: ZE'S BAKERY R$ 3.50.")],
      ["eles", T("Pix recebido de MAE: R$ 10,00.", "Pix received from MOM: R$ 10.00.")],
      ["eles", T("Seu saldo é R$ 6,70. Que tal investir? 📈", "Your balance is R$ 6.70. How about investing? 📈")]],
      resp: () => T("Este número não recebe respostas. 🤖", "This number doesn't accept replies. 🤖") },
    { id: "mae", nome: T("Mãe ❤️", "Mom ❤️"), ini: "M", cor: "#e2557a", msgs: [
      ["eles", T("filho já almoçou?", "son, did you have lunch?")], ["eu", T("já mãe", "yes mom")],
      ["eles", T("traz pão quando voltar", "bring bread on your way back")], ["eles", T("e não fica até tarde no computador", "and don't stay up late on the computer")]],
      resp: () => [T("ok filho 😘", "ok son 😘"), T("e o pão?", "and the bread?"), T("te amo, se cuida", "love you, take care")][Math.floor(Math.random() * 3)] },
    { id: "rh", nome: "Tech Recruiter", ini: "R", cor: "#1d6fd1", msgs: [
      ["eles", T("Oi Aluísio! Vi seu portfolio, aquele aluOS ficou incrível. 👀", "Hi Aluísio! Saw your portfolio, that aluOS is amazing. 👀")],
      ["eles", T("Tem disponibilidade pra uma conversa essa semana?", "Are you available for a chat this week?")]],
      resp: () => T("Perfeito! Te chamo no LigadIn pra marcar. 🤝", "Perfect! I'll reach out on LigadIn to schedule. 🤝") },
    { id: "zizi", nome: "Zizi ⚔️", ini: "Z", cor: "#2f5fd8", msgs: [
      ["eles", T("oi! sou eu, a Zizi. sabia que dá pra me arrastar pela tela?", "hi! it's me, Zizi. did you know you can drag me around the screen?")],
      ["eles", T("se precisar de ajuda, toca em mim ⚔️", "if you need help, just tap me ⚔️")]],
      resp: () => T("tô aqui! toca em mim na tela que eu te ajudo. ⚔️", "I'm here! tap me on the screen and I'll help. ⚔️") },
    { id: "op", nome: T("Operadora Tchau", "Bye Mobile"), ini: "📶", cor: "#ff6a3d", msgs: [
      ["eles", T("Seu pacote de dados acabou. Navegue a 64 kbps como em 2006. 🐢", "Your data plan ran out. Browse at 64 kbps like it's 2006. 🐢")],
      ["eles", T("PROMOÇÃO: responda SIM e ganhe 3 toques polifônicos!", "PROMO: reply YES and get 3 polyphonic ringtones!")]],
      resp: (txt) => (/^(sim|yes)\b/i.test(txt.trim())
        ? (ALU.conquista && ALU.conquista("toques", "Toque polifônico", "Respondeu SIM pra operadora."), T("Parabéns! Seus 3 toques polifônicos estão no app Toques. 🎵", "Congrats! Your 3 polyphonic ringtones are in the Ringtones app. 🎵"))
        : T("Comando inválido. Responda SIM.", "Invalid command. Reply YES.")) },
  ];
  let conversas = null;
  const extrasSMS = []; // mensagens que chegam durante a visita
  function renderSMS(el, ctx) {
    conversas = conversas || CONVERSAS();
    extrasSMS.splice(0).forEach(([id, m]) => { const c = conversas.find((x) => x.id === id); c && c.msgs.push(m); c && (c.nova = true); });
    el.innerHTML = `<div class="sms-lista">${conversas.map((c) => `
      <button class="sms-item ${c.nova ? "nova" : ""}" data-id="${c.id}"><span class="sms-av" style="--c:${c.cor}">${esc(c.ini)}</span>
        <span class="sms-t"><b>${esc(c.nome)}</b><small>${esc(c.msgs[c.msgs.length - 1][1])}</small></span></button>`).join("")}</div>`;
    el.querySelectorAll(".sms-item").forEach((b) => (b.onclick = () => ctx.abrirTela(conversas.find((c) => c.id === b.dataset.id).nome, (body) => conversa(body, b.dataset.id))));
  }
  function conversa(el, id) {
    const c = conversas.find((x) => x.id === id); c.nova = false;
    el.innerHTML = `<div class="sms-conv"><div class="sms-log"></div>
      <form class="sms-form"><input placeholder="${T("Mensagem de texto", "Text message")}" aria-label="${T("Mensagem", "Message")}" maxlength="160"><button>${T("Enviar", "Send")}</button></form></div>`;
    const log = el.querySelector(".sms-log"), inp = el.querySelector("input");
    const pintar = () => { log.innerHTML = c.msgs.map(([q, t]) => `<p class="sms-b ${q}">${esc(t)}</p>`).join(""); log.scrollTop = log.scrollHeight; };
    pintar();
    el.querySelector("form").onsubmit = (e) => {
      e.preventDefault(); const t = inp.value.trim(); if (!t) return;
      c.msgs.push(["eu", t]); inp.value = ""; pintar();
      setTimeout(() => { c.msgs.push(["eles", c.resp(t)]); pintar(); ALU.bip && ALU.bip("in"); }, 1100);
    };
  }

  // ================= Banco Savana =================
  const EXTRATO = () => [
    [T("Rendimento da conta", "Account interest"), 0.2, T("hoje", "today")],
    [T("Padaria do Zé", "Zé's Bakery"), -3.5, T("hoje", "today")],
    [T("Pix recebido · Mãe", "Pix received · Mom"), 10, T("ontem", "yesterday")],
    [T("Assinatura de música", "Music subscription"), -21.9, "12/11"],
    [T("Lanche da madrugada", "Late-night snack"), -18, "10/11"],
    [T("Pix recebido · Freela", "Pix received · Freelance"), 39.9, "08/11"],
  ];
  const reais = (v) => (v < 0 ? "−" : "") + "R$ " + Math.abs(v).toFixed(2).replace(".", ",");
  function renderBanco(el) {
    const ex = EXTRATO(), saldo = ex.reduce((a, [, v]) => a + v, 0);
    let ver = ls.get("alu.banco.ver") !== "0";
    el.innerHTML = `
      <div class="bk">
        <div class="bk-topo"><span class="bk-ola">${T("Olá, Aluísio", "Hi, Aluísio")}</span><button class="bk-olho" aria-label="${T("Mostrar ou esconder saldo", "Show or hide balance")}"></button>
          <small>${T("Saldo em conta", "Account balance")}</small><strong class="bk-saldo"></strong>
          <small class="bk-sub">${T("Rendendo 100% do CDI desde sempre", "Earning interest since forever")}</small></div>
        <div class="bk-acoes">${[["pix", "Pix", "◈"], ["pagar", T("Pagar", "Pay"), "▤"], ["cartao", T("Cartão", "Card"), "▭"], ["caixinha", T("Caixinha", "Savings"), "◎"]]
          .map(([k, n, i]) => `<button data-k="${k}"><i>${i}</i><span>${n}</span></button>`).join("")}</div>
        <div class="bk-aviso" hidden></div>
        <h4>${T("Extrato", "Statement")}</h4>
        <ul class="bk-ext">${ex.map(([n, v, d]) => `<li><span>${esc(n)}<small>${esc(d)}</small></span><b class="${v < 0 ? "sai" : "entra"}">${reais(v)}</b></li>`).join("")}</ul>
      </div>`;
    const sEl = el.querySelector(".bk-saldo"), olho = el.querySelector(".bk-olho"), aviso = el.querySelector(".bk-aviso");
    const pintar = () => { sEl.textContent = ver ? reais(saldo) : "R$ ••••"; olho.textContent = ver ? "👁" : "🙈"; };
    olho.onclick = () => { ver = !ver; ls.set("alu.banco.ver", ver ? "1" : "0"); pintar(); };
    pintar();
    const MSG = {
      pix: T("Saldo insuficiente pra esse sonho. 😅", "Not enough balance for that dream. 😅"),
      pagar: T("Nenhum boleto pendente. Ufa!", "No pending bills. Phew!"),
      cartao: T("Fatura atual: R$ 0,00 · Limite: R$ 50,00. Sem loucuras.", "Current bill: R$ 0.00 · Limit: R$ 50.00. No crazy stuff."),
      caixinha: T("Guardado: R$ 0,00. Meta: um teclado mecânico ⌨️", "Saved: R$ 0.00. Goal: a mechanical keyboard ⌨️"),
    };
    el.querySelectorAll(".bk-acoes button").forEach((b) => (b.onclick = () => { aviso.hidden = false; aviso.textContent = MSG[b.dataset.k]; aviso.classList.remove("pop"); void aviso.offsetWidth; aviso.classList.add("pop"); }));
    ALU.conquista && ALU.conquista("banco", T("Rico de experiência", "Rich in experience"), T("Viu o saldo de R$ 6,70.", "Saw the R$ 6.70 balance."));
  }

  // ================= Toques =================
  function renderToque(el, ctx) {
    el.innerHTML = `<div class="tq">
      <p class="tq-info">${T("Toques originais, feitos em código com Web Audio. Escolha um e peça uma ligação.", "Original ringtones, made in code with Web Audio. Pick one and ask for a call.")}</p>
      <ul class="tq-lista">${TOQUES.map((t) => `<li><label><input type="radio" name="tq" value="${t.id}" ${t.id === toqueAtual() ? "checked" : ""}><span>${esc(t.nome)}</span></label><button class="tq-play" data-id="${t.id}">▶</button></li>`).join("")}</ul>
      <button class="btn tq-ligar">📞 ${T("Me liga em 3 segundos", "Call me in 3 seconds")}</button></div>`;
    el.querySelectorAll("input[name=tq]").forEach((r) => (r.onchange = () => ls.set("alu.toque", r.value)));
    el.querySelectorAll(".tq-play").forEach((b) => (b.onclick = () => {
      const ja = b.textContent === "■"; el.querySelectorAll(".tq-play").forEach((x) => (x.textContent = "▶")); parar();
      if (!ja) { tocar(b.dataset.id, false); b.textContent = "■"; }
    }));
    el.querySelector(".tq-ligar").onclick = () => { parar(); el.querySelectorAll(".tq-play").forEach((x) => (x.textContent = "▶")); setTimeout(() => ctx.ligar(), 3000); };
    return { fechar: parar };
  }

  // ================= o celular =================
  ALU.mobile = function (root) {
    const P = window.PERFIL;
    const atalhos = (ALU.kezAtalhos ? ALU.kezAtalhos() : []);
    const nomeCurto = (id) => { const a = ALU.APPS[id]; return a.projeto ? a.projeto.curto : a.curto && id !== "notas" ? a.curto : a.titulo; };
    const iconBtn = (id) => `<button class="m-icon" data-app="${id}"><span class="m-ic">${ALU.iconeHTML(id)}</span><span class="m-nome">${esc(id === "notas" ? T("Notas", "Notes") : id === "quarto" ? T("Quarto 360°", "Room 360°") : nomeCurto(id))}</span></button>`;
    const siteBtn = ([u, ic, n]) => `<button class="m-icon" data-app="kez" data-arg="${esc(u)}"><span class="m-ic"><span class="pxi">${ic}</span></span><span class="m-nome">${esc(n)}</span></button>`;
    const ziziBtn = () => `<button class="m-icon m-zizi"><span class="m-ic"><span class="pxi zz">${ALU.ziziSVG ? ALU.ziziSVG() : ""}</span></span><span class="m-nome">Zizi</span></button>`;
    const jogos = ["clicajogos.com", `<svg class="px" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect width="16" height="16" fill="#ffd23f"/><rect x="2" y="5" width="12" height="7" fill="#1b1426"/><rect x="4" y="7" width="1" height="3" fill="#fff"/><rect x="3" y="8" width="3" height="1" fill="#fff"/><rect x="10" y="7" width="1" height="1" fill="#ff5a5a"/><rect x="12" y="8" width="1" height="1" fill="#5dff9c"/></svg>`, "clicajogos"];
    const pag2 = [...atalhos, ...(atalhos.some(([u]) => u.startsWith("clicajogos")) ? [] : [jogos])].map(siteBtn).join("") + ziziBtn() + PAG2_FIM.map(iconBtn).join("");

    root.innerHTML = `
      <div class="phone">
        <div class="ph-fundo"><i></i><i></i><i></i><i></i><i></i></div>
        <div class="status"><span class="st-time"></span><span class="st-op">aluPhone</span><span class="st-ic">
          <svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1" opacity=".4"/></svg>
          <span class="bat"><i></i></span></span></div>
        <div class="home">
          <div class="m-pags">
            <section class="m-pag">
              <div class="widget">
                <div class="w-clock"></div><div class="w-date"></div>
                <div class="w-card"><span class="w-av">${esc(P.nome[0])}</span><div><strong>${esc(P.nomeCompleto || P.nome)}</strong><small>${esc(P.cargo)}</small></div></div>
              </div>
              <div class="m-grid">${PAG1.map(iconBtn).join("")}</div>
            </section>
            <section class="m-pag"><div class="m-grid">${pag2}</div></section>
          </div>
          <div class="m-dots"><i class="on"></i><i></i></div>
          <div class="m-dock">${DOCK.map(iconBtn).join("")}</div>
        </div>
        <div class="m-apps"></div>
        <div class="lock">
          <div class="lk-time"></div><div class="lk-date"></div>
          <div class="lk-notifs">
            <div class="lk-notif">${ALU.iconeHTML("chat")}<div><strong>MessagerTale</strong><small>aluisio.dev: ${T("oiii, vem ver meus projetos 👀", "hiii, come see my projects 👀")}</small></div></div>
            <div class="lk-notif">${ALU.iconeHTML("sms")}<div><strong>Banco Savana</strong><small>${T("Seu saldo é R$ 6,70. Que tal investir? 📈", "Your balance is R$ 6.70. How about investing? 📈")}</small></div></div>
          </div>
          <div class="lk-slider"><span class="lk-knob" aria-hidden="true">➜</span><span class="lk-txt">${T("deslize para desbloquear", "slide to unlock")}</span></div>
        </div>
        <div class="ligacao" hidden></div>
        <button class="home-bar" aria-label="${T("Voltar para a tela inicial", "Back to home screen")}"></button>
      </div>`;
    const phone = root.querySelector(".phone"), appsEl = root.querySelector(".m-apps"), lock = root.querySelector(".lock");
    const pilha = []; // telas abertas (a atual é a última)

    // relógio
    const tick = () => {
      const loc = ALU.lang === "en" ? "en-US" : "pt-BR";
      const d = new Date(), h = d.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" });
      let dt = d.toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long" }); dt = dt.charAt(0).toUpperCase() + dt.slice(1);
      root.querySelector(".st-time").textContent = h;
      root.querySelector(".w-clock").textContent = h; root.querySelector(".w-date").textContent = dt;
      root.querySelector(".lk-time").textContent = h; root.querySelector(".lk-date").textContent = dt;
    };
    tick(); const relogio = setInterval(tick, 10000);

    // páginas da tela inicial
    const pags = root.querySelector(".m-pags"), dots = root.querySelectorAll(".m-dots i");
    pags.addEventListener("scroll", () => { const i = Math.round(pags.scrollLeft / pags.clientWidth); dots.forEach((d, k) => d.classList.toggle("on", k === i)); }, { passive: true });
    dots.forEach((d, k) => (d.onclick = () => pags.scrollTo({ left: k * pags.clientWidth, behavior: "smooth" })));

    // desbloquear: arrastar o botão, deslizar para cima ou tocar na tela
    const knob = lock.querySelector(".lk-knob"), trilho = lock.querySelector(".lk-slider");
    let kx = null;
    knob.addEventListener("pointerdown", (e) => { e.stopPropagation(); kx = e.clientX; knob.setPointerCapture(e.pointerId); knob.style.transition = "none"; });
    knob.addEventListener("pointermove", (e) => { if (kx === null) return; const max = trilho.clientWidth - knob.offsetWidth - 8; const dx = Math.max(0, Math.min(max, e.clientX - kx)); knob.style.transform = `translateX(${dx}px)`; trilho.style.setProperty("--p", dx / max); });
    knob.addEventListener("pointerup", (e) => { if (kx === null) return; const max = trilho.clientWidth - knob.offsetWidth - 8; const ok = e.clientX - kx > max * 0.8; kx = null; knob.style.transition = ""; knob.style.transform = ""; trilho.style.setProperty("--p", 0); if (ok) desbloquear(); });
    let ly = null;
    lock.addEventListener("pointerdown", (e) => { if (e.target.closest(".lk-slider")) return; ly = e.clientY; lock.setPointerCapture(e.pointerId); lock.style.transition = "none"; });
    lock.addEventListener("pointermove", (e) => { if (ly === null) return; const dy = Math.min(0, e.clientY - ly); lock.style.transform = `translateY(${dy}px)`; lock.style.opacity = 1 + dy / 600; });
    const soltar = (e) => {
      if (ly === null) return; const dy = e.clientY - ly; ly = null; lock.style.transition = ""; lock.style.transform = ""; lock.style.opacity = "";
      if (dy < -80 || Math.abs(dy) < 6) desbloquear();
    };
    lock.addEventListener("pointerup", soltar); lock.addEventListener("pointercancel", soltar);
    let desbloqueou = false;
    function desbloquear() {
      lock.classList.add("aberto"); phone.classList.add("desbloqueado");
      if (desbloqueou) return; desbloqueou = true;
      ALU.buddy && ALU.buddy(phone);
      let ja = false; try { ja = sessionStorage.getItem("alu.ligou") === "1"; } catch {}
      if (!ja) tLigar = setTimeout(ligar, 45000);
    }
    let tLigar = null;

    // abrir apps
    root.querySelectorAll(".m-icon").forEach((b) => b.addEventListener("click", () => {
      if (b.classList.contains("m-zizi")) { ALU.zizi && ALU.zizi.mostrar(); return; }
      abrir(b.dataset.app, b, b.dataset.arg);
    }));
    function novaTela(titulo, origem, extra) {
      const tela = document.createElement("section");
      tela.className = "m-app " + (extra || "");
      if (origem) {
        const ic = origem.querySelector(".m-ic") || origem, r = ic.getBoundingClientRect(), pr = phone.getBoundingClientRect();
        tela.style.transformOrigin = `${r.left + r.width / 2 - pr.left}px ${r.top + r.height / 2 - pr.top}px`;
      }
      tela.innerHTML = `
        <header class="m-bar">${pilha.length ? `<button class="m-back">${VOLTAR}<span>${T("Voltar", "Back")}</span></button>` : `<button class="m-back m-fechar">${VOLTAR}<span>${T("Início", "Home")}</span></button>`}
          <strong>${esc(titulo)}</strong><span></span></header>
        <div class="m-body"></div>`;
      appsEl.appendChild(tela);
      pilha.push(tela);
      tela.querySelector(".m-back").onclick = voltar;
      phone.classList.add("em-app");
      requestAnimationFrame(() => requestAnimationFrame(() => tela.classList.add("in")));
      return tela;
    }
    function abrir(id, origem, arg) {
      const a = ALU.APPS[id]; if (!a) return;
      ALU.contarApp && ALU.contarApp(id);
      const titulo = id === "kez" && arg ? (atalhos.find(([u]) => u === arg) || [, , a.titulo])[2] : a.projeto ? a.projeto.curto : a.curto || a.titulo;
      const tela = novaTela(titulo, origem, `app-${id.replace(/[^a-z]/g, "")}`);
      const body = tela.querySelector(".m-body");
      if (id === "terminal") body.classList.add("dark");
      const ctx = {
        abrir: (x, arg2) => abrir(x, null, arg2), fechar: voltar, mobile: true, ligar,
        abrirTela: (t, fn) => { const s = novaTela(t, null); fn(s.querySelector(".m-body")); },
      };
      try { tela._api = (PROPRIOS[id] || ((el, c, ar) => ALU.render(id, el, c, ar)))(body, ctx, arg) || null; }
      catch (e) { body.innerHTML = `<p class="pad">${T("Esse app travou. Tenta de novo.", "This app crashed. Try again.")}</p>`; console.error(e); }
    }
    function voltar() {
      const t = pilha.pop(); if (!t) return;
      t._api && t._api.fechar && t._api.fechar();
      t.classList.remove("in"); t.classList.add("out");
      setTimeout(() => t.remove(), 340);
      if (!pilha.length) phone.classList.remove("em-app");
    }
    function irHome() { while (pilha.length) voltar(); }
    ALU.abrirApp = (id, arg) => { if (!lock.classList.contains("aberto")) desbloquear(); abrir(id, null, arg); };

    // barra inferior: toque volta para a tela inicial; deslizar também
    const hb = root.querySelector(".home-bar");
    hb.addEventListener("click", () => (lock.classList.contains("aberto") ? irHome() : desbloquear()));
    let hy = null;
    phone.addEventListener("pointerdown", (e) => { if (e.clientY > phone.getBoundingClientRect().bottom - 28) hy = e.clientY; });
    phone.addEventListener("pointerup", (e) => { if (hy !== null && hy - e.clientY > 60) irHome(); hy = null; });

    // ================= ligação =================
    const lig = root.querySelector(".ligacao");
    function ligar() {
      if (!lig.hidden) return;
      try { sessionStorage.setItem("alu.ligou", "1"); } catch {}
      clearTimeout(tLigar);
      lig.hidden = false; lig.className = "ligacao tocando";
      lig.innerHTML = `
        <div class="lg-quem"><span class="lg-av">${esc(P.nome[0])}</span><strong>${esc(P.nome)}</strong><small>${T("celular · chamando…", "mobile · calling…")}</small></div>
        <div class="lg-legenda"></div>
        <div class="lg-bts"><button class="lg-nao" aria-label="${T("Recusar", "Decline")}">✆</button><button class="lg-sim" aria-label="${T("Atender", "Answer")}">✆</button></div>`;
      tocar(toqueAtual(), true);
      try { navigator.vibrate && navigator.vibrate([400, 200, 400, 200, 400]); } catch {}
      const vib = setInterval(() => { try { navigator.vibrate && navigator.vibrate([400, 200, 400]); } catch {} }, 2400);
      const acabar = (depois) => { clearInterval(vib); parar(); try { navigator.vibrate && navigator.vibrate(0); } catch {} lig.classList.add("fim"); setTimeout(() => { lig.hidden = true; lig.className = "ligacao"; depois && depois(); }, 350); };
      const naoAtendeu = setTimeout(() => acabar(() => chegouSMS(T("Ligação perdida. Te mandei mensagem no MessagerTale 😉", "Missed call. I texted you on MessagerTale 😉"))), 25000);
      lig.querySelector(".lg-nao").onclick = () => { clearTimeout(naoAtendeu); acabar(() => chegouSMS(T("Tudo bem, tá ocupado. Me chama no MessagerTale quando puder! 😅", "No worries, you're busy. Ping me on MessagerTale when you can! 😅"))); };
      lig.querySelector(".lg-sim").onclick = () => {
        clearTimeout(naoAtendeu); clearInterval(vib); parar(); lig.classList.remove("tocando"); lig.classList.add("falando");
        ALU.conquista && ALU.conquista("ligacao", T("Alô?", "Hello?"), T("Atendeu a ligação do Aluísio.", "Answered Aluísio's call."));
        const sub = lig.querySelector("small"), leg = lig.querySelector(".lg-legenda"); let s = 0;
        const cron = setInterval(() => { s++; sub.textContent = `0:${String(s).padStart(2, "0")}`; }, 1000);
        const falas = [
          T("Alô? Aqui é o Aluísio! 👋", "Hello? Aluísio here! 👋"),
          T("Valeu por fuçar no meu celular. Tá tudo aberto, pode mexer.", "Thanks for poking around my phone. Everything's open, go ahead."),
          T("Só não faz Pix, que o saldo tá curto. 😅", "Just don't send a Pix, the balance is tight. 😅"),
          T("Vou te passar pro meu chat, lá a gente conversa melhor!", "I'll move you to my chat, we can talk better there!"),
        ];
        let i = 0;
        const fala = () => { if (i < falas.length) { leg.textContent = falas[i++]; setTimeout(fala, 2600); } else { clearInterval(cron); acabar(() => abrir("chat")); } };
        lig.querySelector(".lg-bts").innerHTML = `<button class="lg-nao" aria-label="${T("Desligar", "Hang up")}">✆</button>`;
        lig.querySelector(".lg-nao").onclick = () => { i = 99; clearInterval(cron); acabar(); };
        fala();
      };
    }
    function chegouSMS(txt) {
      extrasSMS.push(["alu", ["eles", "aluisio.dev: " + txt]]);
      const n = document.createElement("div");
      n.className = "m-banner"; n.innerHTML = `${ALU.iconeHTML("sms")}<div><strong>${T("Mensagens", "Messages")}</strong><small>${esc(txt)}</small></div>`;
      n.onclick = () => { n.remove(); abrir("sms"); };
      phone.appendChild(n); ALU.bip && ALU.bip("in");
      setTimeout(() => n.remove(), 6000);
    }
    ALU.celular = { ligar, tocar, parar };
    return () => { clearInterval(relogio); clearTimeout(tLigar); parar(); };
  };
})();
