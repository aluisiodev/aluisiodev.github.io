// Zizi: o mascote do aluOS. Cabelo azul, camiseta vermelha, espada nas costas.
// Mora na área de trabalho, dá dicas, conta piada e joga (e provoca) no Jogo da velha.
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
    u.innerHTML = `<div class="urso-balao" hidden></div><button class="urso-corpo" aria-label="Zizi, o mascote do aluOS">${svg()}</button>`;
    root.appendChild(u);
    const corpo = u.querySelector(".urso-corpo"), balao = u.querySelector(".urso-balao");
    let tFecha = null, conheceu = false, poseAtual = "normal";

    const pose = (p) => { poseAtual = p; corpo.innerHTML = svg(p); };
    function falar(html, botoes, ms = 7000) {
      balao.innerHTML = `<p>${html}</p>${botoes ? `<div class="urso-ops">${botoes.map(([t], i) => `<button data-i="${i}">${esc(t)}</button>`).join("")}</div>` : ""}<button class="urso-x" aria-label="Fechar">✕</button>`;
      balao.hidden = false;
      balao.querySelector(".urso-x").onclick = (e) => { e.stopPropagation(); balao.hidden = true; };
      if (botoes) balao.querySelectorAll(".urso-ops button").forEach((b) => (b.onclick = (e) => { e.stopPropagation(); botoes[+b.dataset.i][1](); }));
      clearTimeout(tFecha); if (ms) tFecha = setTimeout(() => (balao.hidden = true), ms);
      ALU.bip && ALU.bip("in");
    }
    const um = (a) => a[Math.floor(Math.random() * a.length)];
    function menu() {
      falar("Oi! Em que posso ajudar?", [
        ["Me dá uma dica", () => falar(um(DICAS), [["Outra!", () => falar(um(DICAS), null)], ["Valeu", () => (balao.hidden = true)]], 12000)],
        ["Conta uma piada", () => { const [a, b] = um(ALU.lang === "en" ? PIADAS_EN : PIADAS); falar(esc(a), null, 0); setTimeout(() => { pose("ri"); falar(esc(b), [[ALU.T("kkkk", "lol"), () => (balao.hidden = true)]], 8000); setTimeout(() => pose("normal"), 1500); }, 2200); }],
        ["Bora jogar da velha", () => { balao.hidden = true; ALU.abrirApp && ALU.abrirApp("kez", "clicajogos.com/velha"); }],
        ["Dança!", () => { balao.hidden = true; u.classList.remove("danca"); void u.offsetWidth; u.classList.add("danca"); pose("ri"); setTimeout(() => pose("normal"), 1600); }],
        ["Falar com o Aluísio", () => { balao.hidden = true; ALU.abrirApp && ALU.abrirApp("chat"); }],
        ["Vai descansar", () => { falar("Tá bom! Se sentir saudade, clique no meu ícone ao lado do relógio. 💤", null, 3000); setTimeout(esconder, 3000); }],
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
        falar(intro ? ALU.T("Oi! Eu sou <b>Zizi</b> ⚔️<br>Moro aqui na área de trabalho. Clique em mim se precisar de alguma coisa!", "Hi! I'm <b>Zizi</b> ⚔️<br>I live here on the desktop. Click me if you need anything!") : ALU.T("Voltei! ⚔️", "I'm back! ⚔️"), null, 9000);
      }, 900);
    }
    function esconder() { u.hidden = true; balao.hidden = true; if (btTray) btTray.hidden = false; }
    ALU.urso = ALU.zizi = { mostrar: () => mostrar(false), esconder, falar: (t) => { if (!u.hidden) falar(esc(t), null, 6000); } };

    setTimeout(() => mostrar(true), 12000);
    return () => { clearInterval(piscar); clearInterval(tagarela); u.remove(); btTray && btTray.remove(); };
  };
})();
