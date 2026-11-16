// Zizi: a assistente virtual do aluOS. Cabelo azul, camiseta vermelha, espada nas costas.
// Mora na área de trabalho, guia a pessoa pelo sistema (inclusive no commit do livro de visitas),
// dá dicas, conta piada e joga (e provoca) no Jogo da velha.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s);
  const PAL = { k: "#1b1426", h: "#2f5fd8", H: "#6f9bff", f: "#fff4ea", p: "#ffb3c0", e: "#1b1426", m: "#1b1426", r: "#e0413a", R: "#b02a24", c: "#9e1f2a", s: "#2a2633", g: "#9a9aa8", G: "#6d6d7a", l: "#2a2633", w: "#dfe5f0", b: "#2f4fd8" };
  const BASE = [
    "..................ww",
    ".....kkkkkkkk....wwk",
    "...kkhhhhhhhhkk.wwk.",
    "..khhHHhhhhhhhhkwk..",
    ".khhHhhhhhhhhhhhkk..",
    ".khhhhhhhhhhhhhhhk..",
    "khhhhkhhhkhhhkhhhhk.",
    "khhhkfkhkfkhkfkhhhk.",
    "khhkfffkffffffffkhk.",
    "khhkffffffffffffkhk.",
    "khhkffekffffekffkhk.",
    "khhkffkkffffkkffkhk.",
    "khhkfpffffffffpfkhk.",
    "khhkffffkffkffffkhk.",
    "khhhkffffkkffffkhhk.",
    "khhhhkkkkffkkkkhhhk.",
    ".khhhkskcccckskhhk..",
    ".khhkssrrrrrrsskhkb.",
    "..kkssrrrrrrrrsskbbk",
    "...ksskrrrrrrkssk.k.",
    "...ksskRrrrrrkssk...",
    "...kffkggggggkffk...",
    "....kkgggggggGkk....",
    ".....kggGggGgggk....",
    ".....klllkklllk.....",
    ".....klllk.kllk.....",
    "....kkkkkk.kkkkk....",
  ];
  const troca = (lin, mapa) => BASE.map((l, i) => (mapa[i] != null ? mapa[i] : l));
  const POSES = {
    normal: BASE,
    pisca: troca(BASE, { 10: "khhkffffffffffffkhk.", 11: "khhkfkkkffffkkkfkhk." }),
    ri: troca(BASE, { 10: "khhkfkfkffffkfkfkhk.", 11: "khhkffffffffffffkhk.", 13: "khhkfffkkkkkkfffkhk.", 14: "khhhkffffkkffffkhhk." }),
    brava: troca(BASE, { 9: "khhkfkkfffffkkffkhk.", 10: "khhkffekffffekffkhk.", 13: "khhkffffkkkkffffkhk.", 14: "khhhkffffffffffkhhk." }),
    triste: troca(BASE, { 10: "khhkffkfffffkfffkhk.", 11: "khhkfkekffffkekfkhk.", 13: "khhkffffkkkkffffkhk.", 14: "khhhkfffkffkfffkhhk." }),
  };
  function svg(pose = "normal") {
    const L = POSES[pose] || BASE;
    let r = "";
    L.forEach((l, y) => { let x = 0; while (x < l.length) { const c = l[x]; if (!PAL[c]) { x++; continue; } let n = 1; while (l[x + n] === c) n++; r += `<rect x="${x}" y="${y}" width="${n}" height="1" fill="${PAL[c]}"/>`; x += n; } });
    return `<svg viewBox="0 0 20 ${L.length}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
  }
  ALU.ziziSVG = svg;

  const DICAS = [
    "Clique duas vezes numa pasta para abrir. Clássico.",
    "O Peep Studio roda Python, JavaScript e C# de verdade. Crie um arquivo na pasta meus-codigos!",
    "No MessagerTale dá pra escrever o que quiser. E até ensinar frases novas.",
    "O quarto_360 dá pra girar com o mouse. Os monitores têm links.",
    "A playlist inteira está no musikzify, lá no Kez(i)avana.",
    "O Painel de controle mostra quantas conquistas você já achou.",
    "Dica secreta: o terminal conhece mais comandos do que o 'ajuda' mostra.",
    "Me desafia no Jogo da velha do clicajogos. Eu não perco fácil. 😏",
  ];
  const PIADAS = [
    ["Por que o programador usa óculos?", "Porque ele não consegue C#. 🤓"],
    ["Qual é o animal mais antigo da internet?", "A zebra. Ela ainda é em preto e branco."],
    ["O que o HTML disse pro CSS?", "Sem você eu não sou ninguém… só um texto feio."],
    ["Por que a espada não foi pra escola?", "Porque já era afiada. ⚔️"],
  ];
  const PIADAS_EN = [
    ["Why do programmers wear glasses?", "Because they can't C#. 🤓"],
    ["Why did the developer go broke?", "Because they used up all their cache. 💸"],
    ["What did the HTML say to the CSS?", "Without you I'm nothing… just ugly text."],
    ["Why didn't the sword go to school?", "It was already sharp. ⚔️"],
  ];

  ALU.buddy = function (root) {
    document.querySelectorAll(".urso").forEach((x) => x.remove());
    const u = document.createElement("div");
    u.className = "urso zizi"; u.hidden = true;
    u.innerHTML = `<div class="urso-balao" hidden></div><button class="urso-corpo" aria-label="${ALU.T("Zizi, assistente virtual do aluOS", "Zizi, the aluOS virtual assistant")}">${svg()}</button>`;
    root.appendChild(u);
    const corpo = u.querySelector(".urso-corpo"), balao = u.querySelector(".urso-balao");
    let tFecha = null, conheceu = false, poseAtual = "normal";

    const pose = (p) => { poseAtual = p; corpo.innerHTML = svg(p); };
    function falar(html, botoes, ms = 7000) {
      balao.innerHTML = `<p>${html}</p>${botoes ? `<div class="urso-ops">${botoes.map(([t], i) => `<button data-i="${i}">${esc(t)}</button>`).join("")}</div>` : ""}<button class="urso-x" aria-label="Fechar">✕</button>`;
      balao.hidden = false; balao.classList.remove("longo");
      balao.querySelector(".urso-x").onclick = (e) => { e.stopPropagation(); balao.hidden = true; };
      if (botoes) balao.querySelectorAll(".urso-ops button").forEach((b) => (b.onclick = (e) => { e.stopPropagation(); botoes[+b.dataset.i][1](); }));
      clearTimeout(tFecha); if (ms) tFecha = setTimeout(() => (balao.hidden = true), ms);
      ALU.bip && ALU.bip("in");
    }
    const um = (a) => a[Math.floor(Math.random() * a.length)];
    const T = ALU.T || ((pt) => pt);
    function menu() {
      falar(T("Oi! Em que posso ajudar?", "Hi! How can I help?"), [
        [T("Quero deixar meu nome ✍️", "I want to leave my name ✍️"), () => guia("inicio")],
        [T("Me mostra o aluOS", "Show me around"), tour],
        ["Me dá uma dica", () => falar(um(DICAS), [["Outra!", () => falar(um(DICAS), null)], ["Valeu", () => (balao.hidden = true)]], 12000)],
        [T("Conta uma história", "Tell me a story"), historia],
        ["Conta uma piada", () => { const [a, b] = um(ALU.lang === "en" ? PIADAS_EN : PIADAS); falar(esc(a), null, 0); setTimeout(() => { pose("ri"); falar(esc(b), [[ALU.T("kkkk", "lol"), () => (balao.hidden = true)]], 8000); setTimeout(() => pose("normal"), 1500); }, 2200); }],
        ["Bora jogar da velha", () => { balao.hidden = true; ALU.abrirApp && ALU.abrirApp("kez", "clicajogos.com/velha"); }],
        ["Dança!", () => { balao.hidden = true; u.classList.remove("danca"); void u.offsetWidth; u.classList.add("danca"); pose("ri"); setTimeout(() => pose("normal"), 1600); }],
        ["Falar com o Aluísio", () => { balao.hidden = true; ALU.abrirApp && ALU.abrirApp("chat"); }],
        ["Vai descansar", () => { falar(document.body.dataset.modo === "mobile" ? T("Tá bom! Se sentir saudade, toque no meu ícone na segunda tela. 💤", "Okay! If you miss me, tap my icon on the second screen. 💤") : T("Tá bom! Se sentir saudade, clique no meu ícone ao lado do relógio. 💤", "Okay! If you miss me, click my icon next to the clock. 💤"), null, 3000); setTimeout(esconder, 3000); }],
      ], 0);
    }
    corpo.onclick = () => {
      if (u.dataset.arrastou) { delete u.dataset.arrastou; return; }
      if (!conheceu) { conheceu = true; ALU.conquista && ALU.conquista("bonzinho", "Amizade com Zizi", "Conversou com Zizi."); }
      if (!balao.hidden && balao.querySelector(".urso-ops")) { balao.hidden = true; return; }
      menu();
    };

    // arrastar (sem deixar sair da tela)
    let ini = null;
    corpo.addEventListener("pointerdown", (e) => { ini = { x: e.clientX, y: e.clientY, l: u.offsetLeft, t: u.offsetTop, m: false }; corpo.setPointerCapture(e.pointerId); });
    corpo.addEventListener("pointermove", (e) => {
      if (!ini) return; const dx = e.clientX - ini.x, dy = e.clientY - ini.y;
      if (!ini.m && Math.hypot(dx, dy) < 5) return; ini.m = true;
      u.style.left = Math.max(0, Math.min(innerWidth - u.offsetWidth, ini.l + dx)) + "px"; u.style.top = Math.max(0, Math.min(innerHeight - u.offsetHeight - 40, ini.t + dy)) + "px";
      u.style.right = "auto"; u.style.bottom = "auto";
    });
    corpo.addEventListener("pointerup", () => { if (ini && ini.m) u.dataset.arrastou = "1"; ini = null; });
    addEventListener("resize", () => { if (u.style.left) { u.style.left = Math.min(parseInt(u.style.left, 10), innerWidth - u.offsetWidth) + "px"; u.style.top = Math.min(parseInt(u.style.top, 10), innerHeight - u.offsetHeight - 40) + "px"; } });

    const piscar = setInterval(() => { if (u.hidden || poseAtual !== "normal") return; pose("pisca"); setTimeout(() => poseAtual === "pisca" && pose("normal"), 160); }, 4200);
    const tagarela = setInterval(() => { if (!u.hidden && balao.hidden && document.visibilityState === "visible") falar(um(DICAS), null, 6000); }, 90000);

    // ícone na bandeja para chamar a Zizi de volta
    const tray = document.querySelector(".tb-tray");
    let btTray = null;
    if (tray) {
      btTray = document.createElement("button");
      btTray.className = "tray-zizi"; btTray.title = "Zizi"; btTray.innerHTML = svg(); btTray.hidden = true;
      btTray.onclick = () => mostrar(false);
      tray.insertBefore(btTray, tray.firstChild);
    }

    function mostrar(intro) {
      if (!u.hidden) { menu(); return; }
      u.hidden = false; if (btTray) btTray.hidden = true;
      u.classList.remove("entra"); void u.offsetWidth; u.classList.add("entra");
      setTimeout(() => {
        pose("ri"); setTimeout(() => pose("normal"), 1400);
        falar(intro ? ALU.T("Oi! Eu sou <b>Zizi</b>, a assistente virtual do aluOS ⚔️<br>Posso te mostrar o sistema ou te ajudar a deixar seu nome pro Aluísio. É só clicar em mim!", "Hi! I'm <b>Zizi</b>, the aluOS virtual assistant ⚔️<br>I can show you around or help you leave your name for Aluísio. Just click me!") : ALU.T("Voltei! ⚔️", "I'm back! ⚔️"), null, 9000);
      }, 900);
    }
    function esconder() { u.hidden = true; balao.hidden = true; if (btTray) btTray.hidden = false; }
    // ---------- assistente: chega perto de uma janela e explica ----------
    function irPara(sel) {
      if (u.hidden) return;
      if (document.body.dataset.modo === "mobile") { u.classList.remove("guia"); void u.offsetWidth; u.classList.add("guia"); return; }
      const w = document.querySelector(sel); if (!w) return;
      const r = w.getBoundingClientRect(), L = Math.min(innerWidth - u.offsetWidth - 8, r.right + 8 > innerWidth - u.offsetWidth ? r.right - u.offsetWidth - 10 : r.right + 4);
      u.style.left = Math.max(0, L) + "px"; u.style.top = Math.max(170, Math.min(innerHeight - u.offsetHeight - 44, r.top + 150)) + "px";
      u.style.right = "auto"; u.style.bottom = "auto";
      u.classList.remove("guia"); void u.offsetWidth; u.classList.add("guia");
    }
    let assinou = false;
    try { assinou = !!localStorage.getItem("alu.visitante"); } catch {}
    function guia(etapa, nome) {
      if (u.hidden) { u.hidden = false; if (btTray) btTray.hidden = true; }
      const quem = nome ? esc(nome) : "";
      if (etapa === "inicio" || etapa === "abrir") {
        if (etapa === "inicio") ALU.abrirApp && ALU.abrirApp("peep", "LivroDeVisitas.cs");
        setTimeout(() => { irPara(".win.focus"); pose("ri"); setTimeout(() => pose("normal"), 1200);
          falar(T("Abri o <b>LivroDeVisitas.cs</b> no Peep Studio. Escreva seu nome entre as aspas em <code>Nome = \"\"</code>. Contato e recado são opcionais.",
            "I opened <b>LivroDeVisitas.cs</b> in Peep Studio. Type your name between the quotes in <code>Nome = \"\"</code>. Contact and message are optional."), [[T("Entendi", "Got it"), () => (balao.hidden = true)]], 0); }, 600);
      } else if (etapa === "nome") {
        irPara(".win.focus");
        falar(T(`Boa, ${quem}! Agora clique em <b>⎇ Commit</b> lá em cima, escreva uma mensagem e faça o push. É assim que dev de verdade assina as coisas. 😉`,
          `Nice, ${quem}! Now click <b>⎇ Commit</b> at the top, write a message and push. That's how real devs sign things. 😉`), null, 0);
      } else if (etapa === "vazio") {
        pose("brava"); setTimeout(() => pose("normal"), 1200);
        falar(T("Faltou o nome! Escreve entre as aspas do <code>Nome</code> e tenta o commit de novo.", "The name is missing! Type it between the quotes of <code>Nome</code> and commit again."), null, 8000);
      } else if (etapa === "commitou") {
        assinou = true; pose("ri"); u.classList.remove("danca"); void u.offsetWidth; u.classList.add("danca"); setTimeout(() => pose("normal"), 1800);
        falar(T(`Commit feito! ✨ O Aluísio vai saber que ${quem} passou por aqui. Obrigada pela visita!`, `Commit done! ✨ Aluísio will know ${quem} stopped by. Thanks for visiting!`), null, 9000);
      }
    }
    // história em capítulos curtos, um balão por vez
    function historia() {
      const H = window.HISTORIA_ZIZI; if (!H) return;
      const txt = H[ALU.lang === "en" ? "en" : "pt"], partes = [];
      let atual = "";
      txt.split(/(?<=[.!?]["”]?)\s+/).forEach((f) => { if ((atual + " " + f).length > 300 && atual) { partes.push(atual); atual = f; } else atual = atual ? atual + " " + f : f; });
      if (atual) partes.push(atual);
      let i = 0;
      const mostrar = () => {
        const fim = i === partes.length - 1;
        if (fim) { pose("ri"); setTimeout(() => pose("normal"), 1600); }
        falar(esc(partes[i]) + `<small class="zz-pag">${i + 1}/${partes.length}</small>`, fim ? [[T("Que história! 🧂", "What a story! 🧂"), () => (balao.hidden = true)]] : [[T("Continua →", "Go on →"), () => { i++; mostrar(); }], [T("Parar", "Stop"), () => (balao.hidden = true)]], 0);
        balao.classList.add("longo");
      };
      mostrar();
    }
    // tour rápido: abre cada parte do sistema e explica
    function tour() {
      const passos = [
        [() => ALU.abrirApp && ALU.abrirApp("pasta:projetos"), T("Aqui ficam os projetos do Aluísio. Dois cliques em um deles para ver detalhes e stack.", "Here are Aluísio's projects. Double-click one to see details and stack.")],
        [() => ALU.abrirApp && ALU.abrirApp("chat"), T("No MessagerTale você conversa com a versão de bolso dele. Escreva o que quiser.", "In MessagerTale you chat with his pocket version. Type anything.")],
        [() => ALU.abrirApp && ALU.abrirApp("peep"), T("O Peep Studio roda Python, JS e C# de verdade. E é onde você assina o livro de visitas com um commit.", "Peep Studio runs real Python, JS and C#. It's also where you sign the guestbook with a commit.")],
        [() => ALU.abrirApp && ALU.abrirApp("kez"), T("O Kez(i)avana é o navegador da savana: LigadIn, jogos, músicas e muito easter egg.", "Kez(i)avana is the savanna browser: LigadIn, games, music and lots of easter eggs.")],
      ];
      let i = 0;
      const prox = () => {
        if (i >= passos.length) { falar(T("Fim do tour! Se quiser deixar seu nome pro Aluísio, é só me chamar. ✍️", "End of the tour! If you want to leave your name for Aluísio, just call me. ✍️"), [[T("Deixar meu nome", "Leave my name"), () => guia("inicio")], [T("Valeu", "Thanks"), () => (balao.hidden = true)]], 0); return; }
        const [abre, txt] = passos[i++]; abre();
        setTimeout(() => { irPara(".win.focus"); falar(txt, [[T("Próximo →", "Next →"), prox], [T("Parar", "Stop"), () => (balao.hidden = true)]], 0); }, 500);
      };
      prox();
    }
    // oferece o livro de visitas uma vez por sessão, depois de um tempo
    setTimeout(() => {
      let ja = false; try { ja = sessionStorage.getItem("alu.ofereceu") === "1"; sessionStorage.setItem("alu.ofereceu", "1"); } catch {}
      if (ja || assinou || u.hidden || !balao.hidden) return;
      falar(T("Psiu! Quer que o Aluísio saiba que você passou por aqui? Dá pra deixar seu nome com um commit no Peep Studio. Eu te ensino. ✍️", "Psst! Want Aluísio to know you stopped by? You can leave your name with a commit in Peep Studio. I'll show you. ✍️"),
        [[T("Me ensina", "Show me"), () => guia("inicio")], [T("Agora não", "Not now"), () => (balao.hidden = true)]], 0);
    }, 100000);

    ALU.urso = ALU.zizi = { mostrar: () => mostrar(false), esconder, guia, tour, falar: (t) => { if (!u.hidden) falar(esc(t), null, 6000); } };

    setTimeout(() => mostrar(true), 12000);
    return () => { clearInterval(piscar); clearInterval(tagarela); u.remove(); btTray && btTray.remove(); };
  };
})();
