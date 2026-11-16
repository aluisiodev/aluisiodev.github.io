// Bonzinho: o urso vermelho de barriga branca que mora na área de trabalho.
// Parece aqueles assistentes antigos, mas do bem: não instala nada, só dá dica e conta piada.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s);
  const LS = "alu.urso.oculto";
  const PAL = { k: "#2a0f12", r: "#d8343c", d: "#a3222c", p: "#f29aa0", b: "#fff1e6", e: "#1b1426", w: "#ffffff", n: "#3a1418" };
  function sprite(olhos, bracos) {
    const L = [
      "..kk........kk..",
      ".krrk......krrk.",
      ".krpkkkkkkkkprk.",
      "..krrrrrrrrrrk..",
      ".krrrrrrrrrrrrk.",
      olhos,
      ".krrrrrrrrrrrrk.",
      ".krrrrbbbbrrrrk.",
      ".krrrbbnnbbrrrk.",
      "..krrbbbbbbrrk..",
      "...kkrrrrrrkk...",
      ...bracos,
      ".kk.kbbbbbbk.kk.",
      "...kdrbbbbrdk...",
      "..kdrrkkkkrrdk..",
      "..kkkkk..kkkkk..",
    ];
    let r = "";
    L.forEach((l, y) => { for (let x = 0; x < l.length; x++) { const c = l[x]; if (PAL[c]) r += `<rect x="${x}" y="${y}" width="1" height="1" fill="${PAL[c]}"/>`; } });
    return `<svg viewBox="0 0 16 ${L.length}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
  }
  const OLHO = ".krrewrrrrewrrk.", PISCA = ".krrkkrrrrkkrrk.";
  const BR = ["..krrbbbbbbrrk..", ".krrbbbbbbbbrrk.", "krrrbbbbbbbbrrrk", "krrkbbbbbbbbkrrk"];
  const BR_ACENA = ["..krrbbbbbbrrkkk", ".krrbbbbbbbbrkrk", "krrrbbbbbbbbk.kk", "krrkbbbbbbbbk..."];
  const S = { normal: sprite(OLHO, BR), pisca: sprite(PISCA, BR), acena: sprite(OLHO, BR_ACENA) };

  const DICAS = [
    "Clique duas vezes numa pasta para abrir. Clássico.",
    "O Peep Studio roda Python, JavaScript e C# de verdade. Crie um arquivo na pasta meus-codigos!",
    "No MessagerTale dá pra escrever o que quiser. E até ensinar frases novas.",
    "O quarto_360 dá pra girar com o mouse. Os monitores têm links.",
    "Tem uma playlist inteira no musikzify, lá no Kez(i)avana.",
    "O Painel de controle mostra quantas conquistas você já achou.",
    "Dica secreta: o terminal conhece mais comandos do que o 'ajuda' mostra.",
    "Já foi ao yakurt? Tem uma comunidade para quem odeia segunda-feira.",
  ];
  const PIADAS = [
    ["Por que o urso não usa computador?", "Porque tem medo do mouse. 🐭"],
    ["O que um urso programador diz quando o código funciona?", "Ursome! 🐻"],
    ["Qual é o animal mais antigo da internet?", "A zebra. Ela ainda é em preto e branco."],
    ["Quantos ursos são precisos para trocar uma lâmpada?", "Nenhum. A gente hiberna no escuro mesmo."],
  ];

  ALU.buddy = function (root) {
    if (document.querySelector(".urso")) return;
    const u = document.createElement("div");
    u.className = "urso"; u.hidden = true;
    u.innerHTML = `<div class="urso-balao" hidden></div><button class="urso-corpo" aria-label="Bonzinho, o urso ajudante">${S.normal}</button>`;
    root.appendChild(u);
    const corpo = u.querySelector(".urso-corpo"), balao = u.querySelector(".urso-balao");
    let tFecha = null, conheceu = false;

    const pose = (p) => { corpo.innerHTML = S[p] || S.normal; };
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
        ["Conta uma piada", () => { const [a, b] = um(PIADAS); falar(esc(a), null, 0); setTimeout(() => falar(esc(b), [["kkkk", () => (balao.hidden = true)]], 8000), 2200); }],
        ["Dança!", () => { balao.hidden = true; u.classList.remove("danca"); void u.offsetWidth; u.classList.add("danca"); pose("acena"); setTimeout(() => pose("normal"), 1600); }],
        ["Falar com o Aluísio", () => { balao.hidden = true; ALU.abrirApp && ALU.abrirApp("chat"); }],
        ["Vai descansar", () => { falar("Tá bom! Se sentir saudade, digite <b>bonzinho</b> no terminal. 💤", null, 3000); setTimeout(esconder, 3000); }],
      ], 0);
    }
    corpo.onclick = () => {
      if (u.dataset.arrastou) { delete u.dataset.arrastou; return; }
      if (!conheceu) { conheceu = true; ALU.conquista && ALU.conquista("bonzinho", "Amigo urso", "Conversou com o Bonzinho."); }
      if (!balao.hidden && balao.querySelector(".urso-ops")) { balao.hidden = true; return; }
      menu();
    };

    // arrastar
    let ini = null;
    corpo.addEventListener("pointerdown", (e) => { ini = { x: e.clientX, y: e.clientY, l: u.offsetLeft, t: u.offsetTop, m: false }; corpo.setPointerCapture(e.pointerId); });
    corpo.addEventListener("pointermove", (e) => {
      if (!ini) return; const dx = e.clientX - ini.x, dy = e.clientY - ini.y;
      if (!ini.m && Math.hypot(dx, dy) < 5) return; ini.m = true;
      u.style.left = Math.max(0, Math.min(innerWidth - u.offsetWidth, ini.l + dx)) + "px"; u.style.top = Math.max(0, Math.min(innerHeight - u.offsetHeight - 40, ini.t + dy)) + "px";
      u.style.right = "auto"; u.style.bottom = "auto";
    });
    corpo.addEventListener("pointerup", () => { if (ini && ini.m) u.dataset.arrastou = "1"; ini = null; });

    // piscar e falar sozinho de vez em quando
    const piscar = setInterval(() => { if (u.hidden) return; pose("pisca"); setTimeout(() => pose("normal"), 160); }, 4200);
    const tagarela = setInterval(() => { if (!u.hidden && balao.hidden && document.visibilityState === "visible") falar(um(DICAS), null, 6000); }, 75000);

    function mostrar(intro) {
      u.hidden = false; u.classList.remove("entra"); void u.offsetWidth; u.classList.add("entra");
      try { localStorage.removeItem(LS); } catch {}
      setTimeout(() => {
        pose("acena"); setTimeout(() => pose("normal"), 1400);
        falar(intro ? "Oi! Eu sou o <b>Bonzinho</b> 🐻<br>Diferente de certos assistentes roxos de antigamente, eu não instalo nada. Só ajudo. Clique em mim!" : "Voltei! 🐻", null, 9000);
      }, 900);
    }
    function esconder() { u.hidden = true; balao.hidden = true; try { localStorage.setItem(LS, "1"); } catch {} }
    ALU.urso = { mostrar: () => mostrar(false), esconder, falar: (t) => { if (!u.hidden) falar(esc(t), null, 6000); } };

    let oculto = false; try { oculto = localStorage.getItem(LS) === "1"; } catch {}
    if (!oculto) setTimeout(() => mostrar(true), 12000);
    return () => { clearInterval(piscar); clearInterval(tagarela); u.remove(); };
  };
})();
