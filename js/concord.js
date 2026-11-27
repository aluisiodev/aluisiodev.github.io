// Concord: app de chat de comunidade do aluOS. Um servidor conta como o portfolio foi feito
// (prompts, IA usada, linha do tempo), tem bots que respondem com Gemini/Groq pelo worker
// e um canal de voz de mentira que toca um lo-fi original gerado com Web Audio.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s);
  const EN = () => ALU.lang === "en";
  const T = (pt, en) => (EN() ? en : pt);
  const D = window.CONCORD;
  const P = window.PERFIL;
  const ls = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
  const conq = (...a) => ALU.conquista && ALU.conquista(...a);

  // ---------- membros ----------
  const AV = {
    aluisio: () => `<img src="${esc(P.foto)}" alt="">`,
    claude: () => ALU.pix("claude"),
    zizi: () => (ALU.ziziSVG ? ALU.ziziSVG() : "⭐"),
    peep: () => ALU.pix("peep"),
    kez: () => `<img src="img/kez.jpg" alt="">`,
    voce: () => `<span class="cc-av-voce">🙂</span>`,
  };
  const MEMBROS = () => [
    { id: "aluisio", nome: "aluisio", cor: "#ffd23f", tag: T("dono", "owner"), status: T("tendo ideias", "having ideas"), on: true },
    { id: "claude", nome: "claude", cor: "#e8835f", tag: "IA", status: T("escrevi o código ✦", "i wrote the code ✦"), on: true },
    { id: "zizi", nome: "Zizi", cor: "#5ab0ff", tag: "BOT", status: T("Gemini · Groq", "Gemini · Groq"), on: true },
    { id: "peep", nome: "Peep", cor: "#b893ff", tag: "BOT", status: T("quack (Gemini · Groq)", "quack (Gemini · Groq)"), on: true },
    { id: "kez", nome: "kez_e_olmo", cor: "#ff8fb1", tag: "", status: T("inspirou a Zizi 💙", "inspired Zizi 💙"), on: false },
  ];
  const membro = (id) => MEMBROS().find((m) => m.id === id) || { id, nome: id, cor: "#ccc" };

  // ---------- canais ----------
  const CANAIS = [
    { id: "leia-me", ic: "📌", nome: () => T("leia-me", "read-me") },
    { id: "prompts", ic: "#", nome: "prompts" },
    { id: "ferramentas", ic: "#", nome: () => T("ferramentas", "tools") },
    { id: "linha", ic: "#", nome: () => T("linha-do-tempo", "timeline") },
    { id: "bots", ic: "#", nome: () => T("pergunte-aos-bots", "ask-the-bots") },
  ];
  const nomeCanal = (c) => (typeof c.nome === "function" ? c.nome() : c.nome);
  const VOZ = { id: "lofi", nome: () => T("Lo-fi da madrugada", "Late-night lo-fi") };

  const quando = (iso) => {
    try { return new Date(iso).toLocaleString(EN() ? "en-US" : "pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); } catch { return iso.slice(0, 16).replace("T", " "); }
  };
  // uma mensagem no estilo do Concord
  const msg = (autor, corpo, hora = "", extra = "") => {
    const m = membro(autor);
    return `<div class="cc-msg cc-de-${autor}"><span class="cc-av">${AV[autor] ? AV[autor]() : ""}</span><div class="cc-col">
      <div class="cc-quem"><b style="color:${m.cor}">${esc(m.nome)}</b>${m.tag ? `<i class="cc-tag${m.tag === "BOT" || m.tag === "IA" ? " bot" : ""}">${esc(m.tag)}</i>` : ""}<small>${esc(hora)}</small>${extra}</div>
      <div class="cc-txt">${corpo}</div></div></div>`;
  };
  const p = (t) => `<p>${esc(t)}</p>`;
  const pre = (t) => `<pre class="cc-prompt no-tr">${esc(t)}</pre>`;

  // ---------- conteúdo dos canais de texto ----------
  const CONTEUDO = {
    "leia-me": () => [
      msg("claude", p(T("oi. eu sou o claude, a ia da anthropic que escreveu o código do aluOS (pelo claude code). o aluísio me deu este servidor pra eu contar como foi, do meu jeito. então: oi de novo. ✦",
        "hi. i'm claude, the anthropic ai that wrote the aluOS code (through claude code). aluísio gave me this server to tell how it went, my way. so: hi again. ✦")), T("fixado", "pinned")),
      msg("claude", p(T("o combinado era simples: as ideias eram dele, o código era meu. ele não escreveu nenhuma linha à mão, foi tudo vibecodado.",
        "the deal was simple: the ideas were his, the code was mine. he didn't write a single line by hand, it was all vibecoded."))
        + p(T("ele descrevia o que queria, eu construía, ele testava no computador e no celular, achava bug, mudava de ideia, pedia mais. cada lote virou um PR no github que ele revisava e mesclava.",
          "he described what he wanted, i built it, he tested on desktop and phone, found bugs, changed his mind, asked for more. each batch became a github PR that he reviewed and merged.")), ""),
      msg("aluisio", p(T("e as ideias? todas minhas. 😎", "and the ideas? all mine. 😎")), ""),
      msg("claude", p(T("verdade. kez(i)avana, doghub, ligadin, a zizi, o banco com r$ 6,70, o plantão no museu… tudo dele. eu só fazia existir.",
        "true. kez(i)avana, doghub, ligadin, zizi, the bank with r$ 6.70, the museum night shift… all his. i just made it exist."))
        + p(T("uns números que eu gosto: 10 dias, uns 20 lotes de pedidos, 7 PRs, mais de 6 mil linhas de html, css e javascript, zero frameworks.",
          "some numbers i like: 10 days, about 20 batches of requests, 7 PRs, over 6 thousand lines of html, css and javascript, zero frameworks."))
        + p(T("e umas coisas de que eu me orgulho: o quarto 360° eu desenhei pixel por pixel em código, porque a ia de imagem não acertou. e quando ele pediu a música de uma fase famosa de um jogo, eu não copiei: compus o recife de coral. 🌊",
          "and a few things i'm proud of: i drew the 360° room pixel by pixel in code, because the image ai didn't get it right. and when he asked for a famous game level's song, i didn't copy it: i composed coral reef. 🌊")), ""),
      msg("claude", p(T("os prompts dele estão em #prompts, do primeiro ao último, com o que eu entreguei em cada um. vale ler, dá pra ver o aluOS nascendo.",
        "his prompts are in #prompts, first to last, with what i delivered for each. worth a read, you can watch aluOS being born.")), ""),
      msg("zizi", p(T("e eu tô em #pergunte-aos-bots. pode perguntar qualquer coisa. menos revanche no jogo da velha. ⭐", "and I'm in #ask-the-bots. ask me anything. except a tic-tac-toe rematch. ⭐")), ""),
    ].join(""),
    prompts: () => {
      const intro = msg("claude", p(T(`estes são os prompts do aluísio, na ordem em que ele mandou (${D.prompts.length} dos principais, sem mexer no texto dele). cortei com […] os trechos longos ou com dados de outras pessoas. embaixo de cada um, o que eu entreguei.`,
        `these are aluísio's prompts, in the order he sent them (${D.prompts.length} of the main ones, his words untouched). long parts, or parts with other people's data, are cut with […]. under each one, what i delivered.`))
        + (EN() ? p("(the prompts are in Portuguese, the original language; each one has a short summary in English)") : ""), "");
      return intro + D.prompts.map(([iso, texto, resumoEn, rPt, rEn], i) =>
        `<div class="cc-par" id="cc-p${i}">${msg("aluisio", (EN() ? `<p class="cc-resumo">${esc(resumoEn)}</p>` : "") + pre(texto), quando(iso), `<span class="cc-num">#${i + 1}</span>`)}
        ${msg("claude", `<p class="cc-resp">↳ ${esc(EN() ? rEn : rPt)}</p>`, "")}</div>`).join("");
    },
    ferramentas: () => {
      const li = (a) => `<ul>${a.map(([b, t]) => `<li><b>${esc(b)}</b> ${esc(t)}</li>`).join("")}</ul>`;
      return msg("claude", p(T("o que foi usado para fazer o aluOS:", "what was used to build aluOS:")) + li(EN() ? [
        ["claude (anthropic), via claude code:", "that's me. i wrote all the code from aluísio's prompts, inside a claude project."],
        ["HTML, CSS and plain JavaScript:", "no framework and no build step. every icon and the 360° room are pixel art drawn in code."],
        ["Web Audio:", "every sound and song (Rhythm Battle, ringtones, this lo-fi) is generated live in the browser. nothing is a recording."],
        ["Pyodide and CodeMirror:", "real Python in the browser and the editor in Peep Studio. C# compiles on Wandbox."],
        ["GitHub Pages:", "hosts the site for free."],
        ["Cloudflare Workers + KV:", "a free server for the scoreboard, leaderboard, guestbook, weather, GitHub stats and AI."],
        ["Google Gemini and Groq:", "the AI behind the bots and the \"online\" Aluísio in MessagerTale. Gemini first, Groq when it fails."],
      ] : [
        ["claude (anthropic), pelo claude code:", "sou eu. escrevi todo o código a partir dos prompts do aluísio, dentro de um projeto do claude."],
        ["HTML, CSS e JavaScript puros:", "sem framework e sem build. todos os ícones e o quarto 360° são pixel art desenhada em código."],
        ["Web Audio:", "todos os sons e músicas (Batalha de Ritmo, toques, este lo-fi) são gerados na hora, no navegador. nada é gravação."],
        ["Pyodide e CodeMirror:", "Python de verdade no navegador e o editor do Peep Studio. o C# compila no Wandbox."],
        ["GitHub Pages:", "hospeda o site de graça."],
        ["Cloudflare Workers + KV:", "um servidor grátis para placar, ranking, livro de visitas, clima, GitHub e IA."],
        ["Google Gemini e Groq:", "a IA dos bots e do Aluísio \"online\" no MessagerTale. o Gemini primeiro, a Groq quando ele falha."],
      ]) + p(T("custo para manter o site no ar: zero. 💸", "cost to keep the site online: zero. 💸")), "");
    },
    linha: () => msg("claude", p(T("cada versão, do jeito que saiu:", "every version, as it shipped:")) + `<ol class="cc-linha">${D.linha.map(([d, pt, en]) => `<li><small>${esc(d)}</small> ${esc(EN() ? en : pt)}</li>`).join("")}</ol>`
      + p(T("horários de Brasília. o código fica em github.com/aluisiodev/aluisiodev.github.io.", "Brasília time. the code lives at github.com/aluisiodev/aluisiodev.github.io.")), ""),
    bots: () => msg("zizi", p(T("aqui você conversa comigo ou com o Peep. eu respondo por padrão; comece com @peep para falar com o pato.", "here you can talk to me or to Peep. I answer by default; start with @peep to talk to the duck."))
      + p(T("a gente usa o Gemini e, se ele cair, a Groq. sem servidor, respondo do jeito antigo, com frases prontas.", "we use Gemini and, if it goes down, Groq. with no server, I answer the old way, with ready-made lines.")), ""),
  };

  // ---------- bots: worker (Gemini → Groq) ou respostas prontas ----------
  const OFF = {
    zizi: [
      [/(kez|kezia|inspir)/i, () => T("fui inspirada na Kezia, a namorada do Aluísio. ela é a kez_e_olmo do yakurt. 💙", "I was inspired by Kezia, Aluísio's girlfriend. she's kez_e_olmo on yakurt. 💙")],
      [/(modelo|model|ia |ai |claude|gemini|groq)/i, () => T("o código foi escrito pelo Claude, da Anthropic. eu falo pelo Gemini e, de reserva, pela Groq.", "the code was written by Claude, by Anthropic. I talk through Gemini, with Groq as backup.")],
      [/(vibe|como.*feito|how.*made|prompt)/i, () => T("foi tudo vibecodado: o Aluísio teve as ideias e pediu, a IA escreveu. os prompts estão em #prompts.", "it was all vibecoded: Aluísio had the ideas and asked, the AI wrote it. the prompts are in #prompts.")],
      [/(velha|tic|jogo|game)/i, () => T("jogo da velha? eu agora jogo com minimax. boa sorte. ⭐", "tic-tac-toe? I play with minimax now. good luck. ⭐")],
      [/(oi|olá|ola|hey|hi|hello|eae)/i, () => T("oii! sou a Zizi, a assistente do aluOS. ⭐", "hii! I'm Zizi, the aluOS assistant. ⭐")],
    ],
    peep: [
      [/(c#|csharp|class)/i, () => T("quack. em C# uma classe é: public class Pato { public string Nome { get; set; } }", "quack. in C# a class is: public class Duck { public string Name { get; set; } }")],
      [/(bug|erro|error)/i, () => T("quack. me explica o bug linha por linha. metade das vezes você acha sozinho no meio. 🦆", "quack. explain the bug to me line by line. half the time you find it yourself halfway. 🦆")],
      [/(python|js|javascript)/i, () => T("quack! o Peep Studio roda Python e JavaScript de verdade. testa lá.", "quack! Peep Studio really runs Python and JavaScript. try it there.")],
    ],
  };
  const OFF_PADRAO = { zizi: () => T("hmm, sem servidor agora. pergunta de novo daqui a pouco? ⭐", "hmm, no server right now. ask again in a bit? ⭐"), peep: () => T("quack. (o pato está sem internet agora)", "quack. (the duck has no internet right now)") };
  function respostaOffline(bot, texto) { const r = OFF[bot].find(([re]) => re.test(texto)); return (r ? r[1] : OFF_PADRAO[bot])(); }
  async function perguntar(bot, texto, hist) {
    const api = ALU.CONFIG && ALU.CONFIG.api;
    if (api) {
      const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 15000);
      try {
        const r = await fetch(String(api).replace(/\/+$/, "") + "/concord", { method: "POST", signal: ctl.signal, headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bot, mensagem: texto, historico: hist.slice(-8), idioma: ALU.lang || "pt" }) });
        if (r.ok) { const j = await r.json(); if (j.resposta) return { texto: j.resposta, via: j.via || "", sig: j.sig || "" }; }
      } catch {} finally { clearTimeout(t); }
    }
    return { texto: respostaOffline(bot, texto), via: "" };
  }

  // ---------- canal de voz: lo-fi original gerado na hora ----------
  // Progressão (graus I–vi–ii–V em ré bemol, com sétimas e nonas), Rhodes de mentira, chiado de vinil e bateria abafada.
  function lofi() {
    let ac, mestre, timer = null, passo = 0, prox = 0, ligado = false, aoBater = () => {};
    const BPM = 74, S = 60 / BPM / 2; // colcheias
    const ACORDES = [[61, 65, 68, 72, 75], [58, 61, 65, 68, 72], [63, 66, 70, 73, 77], [56, 60, 63, 66, 70]];
    const BAIXO = [37, 34, 39, 32];
    const MEL = [[0, 80], [3, 77], [6, 75], [10, 77], [12, 73], [16, 72], [19, 70], [22, 68], [28, 70], [32, 80], [35, 82], [38, 80], [42, 77], [48, 75], [51, 73], [54, 72], [58, 68]];
    const hz = (n) => 440 * 2 ** ((n - 69) / 12);
    let ruido = null;
    function nota(f, t, dur, vol, tipo = "sine", destino = mestre) {
      const o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain();
      o.type = tipo; o2.type = "triangle"; o.frequency.value = f; o2.frequency.value = f * 2.001;
      const g2 = ac.createGain(); g2.gain.value = 0.18;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(vol * 0.35, t + 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); o2.connect(g2).connect(g); g.connect(destino); o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
    }
    function bumbo(t) { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.18); g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3); o.connect(g).connect(mestre); o.start(t); o.stop(t + 0.32); }
    function chiado(t, dur, vol, freq) { const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = ruido; f.type = "bandpass"; f.frequency.value = freq; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); s.connect(f).connect(g).connect(mestre); s.start(t, Math.random()); s.stop(t + dur + 0.02); }
    function agenda() {
      if (!ligado) return;
      while (prox < ac.currentTime + 0.4) {
        const t = prox, comp = Math.floor(passo / 8) % 4, b = passo % 8, swing = b % 2 ? S * 0.16 : 0;
        if (b === 0) { ACORDES[comp].forEach((n, i) => nota(hz(n), t + i * 0.012, S * 7.5, 0.05)); nota(hz(BAIXO[comp]), t, S * 3.5, 0.16, "sine"); }
        if (b === 4) nota(hz(BAIXO[comp] + 7), t, S * 2.5, 0.1, "sine");
        if (b === 0 || b === 5) bumbo(t);
        if (b === 2 || b === 6) chiado(t, 0.16, 0.22, 1800);
        chiado(t + swing, 0.04, 0.05, 7000);
        const m = MEL.find(([k]) => k === passo % 64); if (m) nota(hz(m[1]), t + swing, S * 2.6, 0.045, "triangle");
        if (Math.random() < 0.35) chiado(t + Math.random() * S, 0.01, 0.03, 3000); // estalos do vinil
        aoBater(b, comp, t - ac.currentTime);
        passo++; prox += S;
      }
    }
    return {
      ligar(cb) {
        aoBater = cb || aoBater;
        try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state !== "running") ac.resume(); } catch { return false; }
        if (ALU.destravarAudio) ALU.destravarAudio();
        if (!ruido) { ruido = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate); const d = ruido.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
        mestre = ac.createGain(); const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2400; mestre.connect(lp).connect(ac.destination);
        mestre.gain.value = localStorage.getItem("alu.mudo") === "1" ? 0 : ls.get("alu.concord.vol", 0.7);
        ligado = true; passo = 0; prox = ac.currentTime + 0.1; timer = setInterval(agenda, 100); agenda();
        return true;
      },
      volume(v) { if (mestre) mestre.gain.setTargetAtTime(v, ac.currentTime, 0.05); },
      desligar() { ligado = false; clearInterval(timer); if (mestre) { const m = mestre; try { m.gain.setTargetAtTime(0, ac.currentTime, 0.05); } catch {} setTimeout(() => { try { m.disconnect(); } catch {} }, 300); } mestre = null; },
      get ligado() { return ligado; },
    };
  }

  // ---------- o app ----------
  ALU.concord = function (el, ctx) {
    const som = lofi();
    let atual = ls.get("alu.concord.canal", "leia-me"); if (!CONTEUDO[atual] && atual !== "lofi") atual = "leia-me";
    const conversa = []; // histórico do #pergunte-aos-bots nesta sessão
    el.innerHTML = `<div class="cc-wrap"><div class="cc">
      <nav class="cc-rail" aria-label="${T("Servidores", "Servers")}">
        <button class="cc-srv on" title="${T("Como o aluOS foi feito", "How aluOS was made")}">${ALU.pix("concord")}</button>
        <span class="cc-sep"></span>
        <button class="cc-srv cc-ir" data-app="peep" title="Peep Studio">${ALU.pix("peep")}</button>
        <button class="cc-srv cc-ir" data-app="chat" title="MessagerTale">${ALU.pix("chat")}</button>
      </nav>
      <aside class="cc-canais">
        <header>${T("como o aluOS foi feito", "how aluOS was made")}</header>
        <div class="cc-lista">
          <small>${T("canais de texto", "text channels")}</small>
          ${CANAIS.map((c) => `<button class="cc-canal" data-c="${c.id}"><i>${c.ic}</i>${esc(nomeCanal(c))}</button>`).join("")}
          <small>${T("canais de voz", "voice channels")}</small>
          <button class="cc-canal cc-vozbt" data-c="lofi"><i>🔊</i>${esc(VOZ.nome())}</button>
          <div class="cc-navoz"></div>
        </div>
        <footer class="cc-eu"><span class="cc-av">${AV.voce()}</span><div><b>${T("você", "you")}</b><small>${T("visitante", "visitor")}</small></div><button class="cc-sair" hidden title="${T("Sair da voz", "Leave voice")}">📵</button></footer>
      </aside>
      <main class="cc-main">
        <header class="cc-topo"><i>#</i><b class="cc-tit"></b><span class="cc-desc"></span></header>
        <div class="cc-msgs" tabindex="0"></div>
        <form class="cc-form" hidden><input class="cc-in" maxlength="600" autocomplete="off" placeholder="${T("Mensagem em #pergunte-aos-bots (use @peep para o pato)", "Message #ask-the-bots (use @peep for the duck)")}"><button class="btn">${T("Enviar", "Send")}</button></form>
      </main>
      <aside class="cc-membros"></aside>
    </div></div>`;
    const $ = (s) => el.querySelector(s);
    const msgs = $(".cc-msgs"), form = $(".cc-form"), inp = $(".cc-in");
    const DESC = {
      "leia-me": T("comece por aqui", "start here"), prompts: T("os prompts do Aluísio, do primeiro ao último", "Aluísio's prompts, first to last"),
      ferramentas: T("IA, linguagens e serviços usados", "AI, languages and services used"), linha: T("cada versão, do primeiro commit ao Concord", "every version, from the first commit to Concord"),
      bots: T("Zizi e Peep respondem com Gemini e Groq", "Zizi and Peep answer with Gemini and Groq"), lofi: T("canal de voz · música original gerada na hora", "voice channel · original music generated live"),
    };
    function membros() {
      const ms = MEMBROS(), grupo = (t, l) => l.length ? `<small>${t} — ${l.length}</small>` + l.map((m) => `<div class="cc-mb${m.on ? "" : " off"}"><span class="cc-av">${AV[m.id]()}<i class="cc-bolinha"></i></span><div><b style="color:${m.cor}">${esc(m.nome)}</b>${m.tag ? `<i class="cc-tag${m.tag !== T("dono", "owner") ? " bot" : ""}">${esc(m.tag)}</i>` : ""}<small>${esc(m.status)}</small></div></div>`).join("") : "";
      $(".cc-membros").innerHTML = grupo("online", ms.filter((m) => m.on)) + grupo("offline", ms.filter((m) => !m.on));
    }
    function mostrar(id) {
      atual = id; ls.set("alu.concord.canal", id);
      el.querySelectorAll(".cc-canal").forEach((b) => b.classList.toggle("on", b.dataset.c === id));
      const c = CANAIS.find((x) => x.id === id);
      $(".cc-topo i").textContent = id === "lofi" ? "🔊" : "#";
      $(".cc-tit").textContent = id === "lofi" ? VOZ.nome() : nomeCanal(c);
      $(".cc-desc").textContent = DESC[id] || "";
      form.hidden = id !== "bots";
      if (id === "lofi") return telaVoz();
      msgs.innerHTML = CONTEUDO[id]() + (id === "bots" ? conversa.map((m) => m.html).join("") : "");
      msgs.scrollTop = id === "bots" ? msgs.scrollHeight : 0;
      if (id === "prompts") conq("concord-prompts", T("Bastidores", "Behind the scenes"), T("Leu os prompts de como o aluOS foi feito.", "Read the prompts behind aluOS."));
    }
    el.querySelectorAll(".cc-canal").forEach((b) => (b.onclick = () => mostrar(b.dataset.c)));
    el.querySelectorAll(".cc-ir").forEach((b) => (b.onclick = () => (ctx && ctx.abrir ? ctx.abrir(b.dataset.app) : ALU.abrirApp(b.dataset.app))));

    // ----- #pergunte-aos-bots -----
    let ocupado = false;
    form.onsubmit = async (e) => {
      e.preventDefault();
      const texto = inp.value.trim(); if (!texto || ocupado) return;
      inp.value = ""; ocupado = true;
      const bot = /^@?peep\b|^@pato\b|\bquack\b/i.test(texto) ? "peep" : "zizi";
      const limpo = texto.replace(/^@(peep|zizi|pato)\s*/i, "") || texto;
      const hist = conversa.map((m) => ({ de: m.de, texto: m.texto, ...(m.sig ? { sig: m.sig } : {}) }));
      const eu = { de: "eu", texto: limpo, html: `<div class="cc-msg"><span class="cc-av">${AV.voce()}</span><div class="cc-col"><div class="cc-quem"><b>${T("você", "you")}</b><small>${T("agora", "now")}</small></div><div class="cc-txt"><p>${esc(texto)}</p></div></div></div>` };
      conversa.push(eu); if (atual === "bots") { msgs.insertAdjacentHTML("beforeend", eu.html); }
      const dig = document.createElement("p"); dig.className = "cc-digitando"; dig.textContent = `${membro(bot).nome} ${T("está digitando…", "is typing…")}`;
      if (atual === "bots") { msgs.appendChild(dig); msgs.scrollTop = msgs.scrollHeight; }
      const r = await perguntar(bot, limpo, hist);
      dig.remove(); ocupado = false;
      const via = r.via ? `<span class="cc-via">via ${esc(r.via.replace(/^gemini /, "Gemini · "))}</span>` : `<span class="cc-via">${T("respostas prontas", "canned replies")}</span>`;
      const html = msg(bot, esc(r.texto).split("\n").map((l) => `<p class="cc-l">${l || "&nbsp;"}</p>`).join(""), T("agora", "now"), via);
      conversa.push({ de: "bot", texto: r.texto, sig: r.sig, html }); // a assinatura volta para o servidor no histórico
      if (atual === "bots" && el.isConnected) { msgs.insertAdjacentHTML("beforeend", html); msgs.scrollTop = msgs.scrollHeight; }
      conq("concord-bot", T("Falou com um bot", "Talked to a bot"), T("Conversou com a Zizi ou o Peep no Concord.", "Chatted with Zizi or Peep on Concord."));
    };

    // ----- canal de voz -----
    const NA_VOZ = [["claude", "claude"], ["zizi", "Zizi"], ["peep", "Peep"]];
    function telaVoz() {
      const dentro = som.ligado;
      msgs.innerHTML = `<div class="cc-voz">
        <div class="cc-palco">${[...NA_VOZ, ...(dentro ? [["voce", T("você", "you")]] : [])].map(([id, n]) => `<div class="cc-pessoa" data-p="${id}"><span class="cc-av grande">${AV[id]()}</span><b>${esc(n)}</b></div>`).join("")}</div>
        ${dentro ? `<div class="cc-ctl"><label>🔈 <input type="range" class="cc-vol" min="0" max="1" step="0.05" value="${ls.get("alu.concord.vol", 0.7)}" aria-label="${T("Volume", "Volume")}"></label><button class="btn cc-desligar">📵 ${T("Desconectar", "Disconnect")}</button></div>
          <p class="muted">${T("tocando: \"madrugada na savana\", um lo-fi original que eu escrevi em código. seu navegador está tocando ele agora, nota por nota. nenhuma gravação.", "now playing: \"savanna at 3am\", an original lo-fi i wrote in code. your browser is playing it right now, note by note. no recording.")}</p>`
          : `<button class="btn cc-entrar">🎧 ${T("Entrar no canal de voz", "Join voice channel")}</button><p class="muted">${T("eu, a Zizi e o Peep estamos ouvindo um lo-fi que eu compus. entra aí. ✦", "me, Zizi and Peep are listening to a lo-fi i composed. hop in. ✦")}</p>`}
      </div>`;
      const entrar = msgs.querySelector(".cc-entrar"); if (entrar) entrar.onclick = conectar;
      const sair = msgs.querySelector(".cc-desligar"); if (sair) sair.onclick = desconectar;
      const vol = msgs.querySelector(".cc-vol"); if (vol) vol.oninput = () => { ls.set("alu.concord.vol", +vol.value); som.volume(+vol.value); };
    }
    function naVozLista() {
      $(".cc-navoz").innerHTML = (som.ligado ? [...NA_VOZ, ["voce", T("você", "you")]] : NA_VOZ).map(([id, n]) => `<div class="cc-pessoa mini" data-p="${id}"><span class="cc-av">${AV[id]()}</span>${esc(n)}</div>`).join("");
      $(".cc-sair").hidden = !som.ligado;
    }
    // quem "fala" em cada batida: um anel verde acende, como num app de voz
    function falar(b) {
      if (!el.isConnected) return desconectar();
      if (b % 2) return;
      const quem = Math.random() < 0.5 ? null : NA_VOZ[Math.floor(Math.random() * NA_VOZ.length)][0];
      el.querySelectorAll(".cc-pessoa").forEach((x) => x.classList.toggle("falando", x.dataset.p === quem || (x.dataset.p === "voce" && b === 0 && Math.random() < 0.3)));
    }
    function conectar() {
      if (!som.ligar(falar)) return;
      naVozLista(); if (atual === "lofi") telaVoz();
      conq("concord-voz", T("Madrugada no Concord", "Late night on Concord"), T("Entrou no canal de voz do Concord.", "Joined the Concord voice channel."));
    }
    function desconectar() { som.desligar(); if (el.isConnected) { naVozLista(); if (atual === "lofi") telaVoz(); el.querySelectorAll(".cc-pessoa").forEach((x) => x.classList.remove("falando")); } }
    $(".cc-sair").onclick = desconectar;
    // no canal de voz, clicar no nome já conecta (como no app de verdade)
    $(".cc-vozbt").addEventListener("dblclick", () => !som.ligado && conectar());

    membros(); naVozLista(); mostrar(atual);
    return { fechar: desconectar };
  };
})();
