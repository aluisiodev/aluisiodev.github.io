// Fuga de Vice (Escape from Vice): o Bel Air do papel de parede Estrada 57 fugindo da polícia.
// Mesma estrada pseudo-3D do fundo (js/estrada.js empresta o céu, a cidade, as palmeiras e o carro)
// e o mesmo estilo do tema ativo: Retrowave, Pixel 2006, Aero ou Metro.
// Desvie do trânsito, pegue nitro, passe pelo buraco das blitze e não deixe a viatura de trás encostar.
(function () {
  const ALU = window.ALU;
  const conq = (...a) => ALU.conquista && ALU.conquista(...a);
  const ls = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
  const ativo = (el) => { const w = el.closest(".win"); return el.isConnected && (!w || w.classList.contains("focus")); };
  const digitando = (e) => /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || "") || (e.target && e.target.isContentEditable);
  const EN = ALU.lang === "en", T = (pt, en) => (EN ? en : pt);
  const FONTE = "'Pixelify Sans', monospace";

  let ac = null;
  function tom(f, dur = 0.1, tipo = "square", vol = 0.05, quando = 0, ate = 0) {
    try {
      if (localStorage.getItem("alu.mudo") === "1") return;
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = ac.currentTime + quando, o = ac.createOscillator(), g = ac.createGain();
      o.type = tipo; o.frequency.setValueAtTime(f, t0); if (ate) o.frequency.exponentialRampToValueAtTime(ate, t0 + dur);
      g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g).connect(ac.destination); o.start(t0); o.stop(t0 + dur + 0.02);
    } catch {}
  }

  // ---------- sprites dos outros carros, vistos de trás (desenhados uma vez) ----------
  function tela(w, h, f) { const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d"); f((cor, x, y, ww, hh) => { g.fillStyle = cor; g.fillRect(x, y, ww, hh); }); return c; }
  // carro comum: cor da lataria, cor escura e altura do teto
  function carroComum(cor, escura, tipo) {
    const van = tipo === "van", w = 64, h = van ? 46 : 36, top = van ? 0 : 6;
    return tela(w, h, (r) => {
      r("rgba(20,5,35,.5)", 3, h - 3, w - 6, 3);
      r("#140a1c", 6, h - 11, 10, 9); r("#140a1c", w - 16, h - 11, 10, 9);
      r(escura, 8, top + 2, w - 16, 2); r(cor, 6, top + 4, w - 12, van ? 20 : 10); // teto e coluna
      r("#1b2440", 10, top + 6, w - 20, van ? 14 : 8); r("#5a6b9a", 12, top + 6, 8, 2); // vidro de trás com reflexo
      r(cor, 3, top + (van ? 24 : 14), w - 6, h - top - (van ? 33 : 23)); r(escura, 3, h - 12, w - 6, 3);
      r("#ff2d55", 4, top + (van ? 26 : 16), 9, 4); r("#ff2d55", w - 13, top + (van ? 26 : 16), 9, 4); // lanternas
      r("#ffb3c1", 5, top + (van ? 26 : 16), 3, 1); r("#ffb3c1", w - 12, top + (van ? 26 : 16), 3, 1);
      r("#c9c2d6", 2, h - 9, w - 4, 3); r("#ffe9a8", w / 2 - 6, h - 15, 12, 4); // para-choque e placa
    });
  }
  // a viatura: preta e branca, com o giroflex aceso de um lado (dois quadros: vermelho e azul)
  function viatura(lado) {
    const w = 66, h = 40;
    return tela(w, h, (r) => {
      r("rgba(20,5,35,.5)", 3, h - 3, w - 6, 3);
      r("#0b0b12", 6, h - 11, 10, 9); r("#0b0b12", w - 16, h - 11, 10, 9);
      r(lado ? "#ff2d55" : "#4a2030", 14, 0, 18, 4); r(lado ? "#2a3a6a" : "#2f7bff", 34, 0, 18, 4); r("#e8e8f0", 32, 0, 2, 4);
      if (lado) r("#ffd0da", 16, 1, 6, 1); else r("#d6e6ff", 44, 1, 6, 1);
      r("#f4f4fa", 8, 5, w - 16, 3); r("#f4f4fa", 6, 8, w - 12, 9);
      r("#1b2440", 10, 9, w - 20, 7); r("#5a6b9a", 12, 9, 8, 2);
      r("#15151f", 3, 17, w - 6, h - 26); r("#f4f4fa", 3, 21, w - 6, 3); // faixa branca na traseira
      r("#ff2d55", 4, 18, 9, 3); r("#ff2d55", w - 13, 18, 9, 3);
      r("#9aa0b5", 2, h - 9, w - 4, 3); r("#ffe9a8", w / 2 - 6, h - 15, 12, 4);
    });
  }
  const cone = () => tela(10, 14, (r) => { r("#ff7a1a", 3, 0, 4, 3); r("#ffffff", 2, 3, 6, 2); r("#ff7a1a", 1, 5, 8, 4); r("#ffffff", 1, 9, 8, 1); r("#ff7a1a", 0, 10, 10, 2); r("#3a1a0a", 0, 12, 10, 2); });
  const nitro = () => tela(14, 20, (r) => {
    r("#0d1f4a", 2, 1, 10, 19); r("#2f7bff", 3, 2, 8, 17); r("#8fc1ff", 4, 3, 2, 14); r("#c9c2d6", 4, 0, 6, 2);
    r("#ffd23f", 7, 5, 3, 3); r("#ffd23f", 5, 8, 5, 2); r("#ffd23f", 6, 10, 3, 3); r("#ffd23f", 5, 13, 2, 2);
  });
  let SPR = null;
  function sprites() {
    if (SPR) return SPR;
    const cores = [["#e0413a", "#8a1f1f"], ["#ffd23f", "#a07a12"], ["#5dd39e", "#257a55"], ["#f2f2f2", "#9a9aa8"], ["#9b6bff", "#5a3a9a"], ["#ff8a3d", "#a04a14"]];
    SPR = {
      carros: cores.map(([c, e], i) => carroComum(c, e, i % 3 === 2 ? "van" : "")),
      viatura: [viatura(1), viatura(0)], cone: cone(), nitro: nitro(),
    };
    return SPR;
  }

  // ---------- o jogo ----------
  const W = 320, H = 200, HY = Math.round(H * 0.52), BASE = H - HY, MEIA = W * 0.5;
  const Y_CARRO = Math.round(H * 0.93), P_CARRO = (Y_CARRO - HY) / BASE, D_CARRO = 1 / P_CARRO;
  const FAIXAS = [-2 / 3, 0, 2 / 3];
  const M_POR_SEG = 4; // metros por segmento da estrada
  const CRUZEIRO = 14, TURBO = 20; // segmentos por segundo
  const RECORDE = "alu.fuga";

  function fuga(area) {
    const pecas = ALU.estrada && ALU.estrada.pecas;
    if (!pecas) { area.innerHTML = `<p class="muted">${T("A estrada ainda não carregou. Recarregue a página.", "The road hasn't loaded yet. Reload the page.")}</p>`; return; }
    area.innerHTML = `<div class="jg-hud fg-hud"><span>${T("Distância", "Distance")}: <b class="fg-m">0</b> m</span><span><b class="fg-v">0</b> km/h</span><span>${T("Recorde", "Best")}: <b class="fg-rc">${ls.get(RECORDE, 0)}</b> m</span></div>
      <div class="fg"><canvas class="jg-canvas fg-cv" aria-label="${T("Fuga de Vice", "Escape from Vice")}"></canvas>
      <div class="fg-pad"><button data-c="e" aria-label="${T("Esquerda", "Left")}">◀</button><button data-c="n" class="fg-nitro" aria-label="Nitro">⚡ NITRO</button><button data-c="d" aria-label="${T("Direita", "Right")}">▶</button></div></div>
      <p class="muted">${T("A polícia de Vice quer multar o Bel Air por excesso de estilo. Desvie do trânsito, pegue as latas de nitro ⚡, passe pelo buraco das blitze e não deixe a viatura de trás encostar. ← → ou A D para dirigir, ↑, W ou espaço para o nitro. No celular, use os botões ou toque nos lados da tela.", "Vice police want to fine the Bel Air for excessive style. Dodge the traffic, grab the nitro cans ⚡, go through the gap in the roadblocks and don't let the cruiser behind you catch up. ← → or A D to steer, ↑, W or space for nitro. On mobile, use the buttons or tap the sides of the screen.")}</p>`;
    const cv = area.querySelector("canvas"), g = cv.getContext("2d");
    const $ = (s) => area.querySelector(s);
    const S = sprites(), carro = pecas.carro();
    const eu = document.createElement("canvas"); eu.width = pecas.CW; eu.height = pecas.CH + 4;
    const ge = eu.getContext("2d");
    const predios = pecas.gerarPredios(pecas.semente(57));

    let estiloNome = "", E = null, C = null;
    function aplicarEstilo() {
      const st = (ALU.fundos && ALU.fundos.estiloAtual()) || "retro";
      if (st === estiloNome) return;
      estiloNome = st; E = pecas.ESTILOS[st] || pecas.ESTILOS.retro; C = E.pal();
      cv.width = W * E.k; cv.height = H * E.k;
      cv.classList.toggle("liso", !!E.suave || E.k > 1);
    }

    // estado
    let st, raf = 0, ult = 0;
    const tec = { e: false, d: false, n: false }, toque = { e: false, d: false };
    function novo() {
      st = {
        fase: "pronto", tempo: 0, z: 0, v: 0, x: 0, dist: 0, bonus: 0, gap: 120, nitro: 60, alerta: 1,
        objs: [], palm: [], prox: 2, proxBlitz: 900, proxNitro: 120, invul: 0, tremor: 0, sirene: 0, avisos: [], usouNitro: false, motivo: "",
      };
      for (let i = 0; i < 16; i++) st.palm.push({ z: 2 + i * 2.4, lado: i % 2 ? 1 : -1, var: Math.random() });
      $(".fg-m").textContent = 0; $(".fg-v").textContent = 0;
    }
    // a curva da pista depende de onde você está (a mesma estrada toda vez)
    const curvaEm = (z) => Math.sin(z * 0.012) * 0.9 + Math.sin(z * 0.0041 + 1) * 0.6;
    let cam = 0; // a câmera acompanha o carro de lado, um pouco atrasada
    const centro = (p, curva) => W / 2 + curva * (1 - p) * (1 - p) * W * 0.55 - curva * W * 0.05 * p - cam * MEIA * p;
    const metros = () => Math.floor(st.dist);
    const pontos = () => metros() + st.bonus;
    function aviso(txt, cor) { st.avisos.push({ txt, cor, t: 1.4 }); }

    function surgir(tipo, faixa, extra = {}) { st.objs.push({ tipo, x: FAIXAS[faixa], z: st.z + 70, v: 0, dAnt: 99, ...extra }); }
    function gerar(dt) {
      // trânsito: mais denso a cada nível de alerta
      st.prox -= dt * st.v;
      if (st.prox <= 0) {
        st.prox = Math.max(5, 16 - st.alerta * 2) * (0.6 + Math.random() * 0.8);
        const livres = [0, 1, 2].filter((f) => !st.objs.some((o) => o.z > st.z + 55 && Math.abs(o.x - FAIXAS[f]) < 0.3));
        if (livres.length > 1) { const f = livres[Math.floor(Math.random() * livres.length)]; surgir("carro", f, { v: 5 + Math.random() * 4, spr: Math.floor(Math.random() * S.carros.length), troca: st.alerta >= 3 && Math.random() < 0.35 ? 1.5 + Math.random() * 2 : 0 }); }
      }
      st.proxNitro -= dt * st.v * M_POR_SEG;
      if (st.proxNitro <= 0) { st.proxNitro = 260 + Math.random() * 260; surgir("nitro", Math.floor(Math.random() * 3)); }
      // blitz: duas viaturas atravessadas e cones; só uma faixa fica livre
      if (st.alerta >= 2) {
        st.proxBlitz -= dt * st.v * M_POR_SEG;
        if (st.proxBlitz <= 0) {
          st.proxBlitz = Math.max(450, 1100 - st.alerta * 120) * (0.8 + Math.random() * 0.4);
          const livre = Math.floor(Math.random() * 3);
          // o que está longe some (ainda é um pontinho no horizonte), pra ninguém tampar a faixa livre na hora da blitz
          st.objs = st.objs.filter((o) => o.z - st.z < 25);
          for (let f = 0; f < 3; f++) if (f !== livre) { surgir("blitz", f); surgir("cone", f, { z: st.z + 68.8, x: FAIXAS[f] - 0.14 }); surgir("cone", f, { z: st.z + 68.8, x: FAIXAS[f] + 0.14 }); }
          aviso(T("BLITZ À FRENTE!", "ROADBLOCK AHEAD!"), "#ffd23f"); tom(523, 0.12, "square", 0.04); tom(392, 0.18, "square", 0.04, 0.13);
        }
      }
    }

    function bater(o) {
      if (o.tipo === "nitro") {
        o.morto = true; st.nitro = Math.min(100, st.nitro + 35); st.bonus += 25; aviso("+NITRO", "#5fd4ff");
        tom(660, 0.06, "square", 0.04); tom(990, 0.1, "square", 0.04, 0.06); return;
      }
      if (o.tipo === "blitz" || o.tipo === "cone") { acabou(T("Parou na blitz", "Stopped at the roadblock")); return; }
      if (st.invul > 0) return;
      st.v *= 0.4; st.invul = 1.1; st.tremor = 0.4; st.gap -= 6; o.z += 3; o.v += 3;
      aviso(T("BATIDA!", "CRASH!"), "#ff5a5a"); tom(140, 0.25, "sawtooth", 0.07); tom(90, 0.3, "square", 0.05, 0.05);
    }

    function acabou(motivo) {
      st.fase = "pego"; st.motivo = motivo; st.v = 0; st.avisos = [];
      tom(330, 0.18, "square", 0.05); tom(262, 0.18, "square", 0.05, 0.2); tom(196, 0.4, "square", 0.05, 0.4);
      const p = pontos();
      if (p > ls.get(RECORDE, 0)) { ls.set(RECORDE, p); $(".fg-rc").textContent = p; st.recorde = true; }
    }

    function passo(dt) {
      st.tempo += dt;
      if (st.fase !== "jogando") { st.v += ((st.fase === "pronto" ? 6 : 0) - st.v) * Math.min(1, dt * 3); st.z += st.v * dt; return; }
      const esq = tec.e || toque.e, dir = tec.d || toque.d;
      const fora = Math.abs(st.x) > 1.02;
      const usandoNitro = tec.n && st.nitro > 0;
      if (usandoNitro) { st.nitro = Math.max(0, st.nitro - dt * 28); if (!st.usouNitro) { st.usouNitro = true; tom(200, 0.35, "sawtooth", 0.04, 0, 600); } } else st.usouNitro = false;
      const alvo = (usandoNitro ? TURBO : CRUZEIRO) * (fora ? 0.55 : 1);
      st.v += (alvo - st.v) * Math.min(1, dt * (st.v > alvo ? 2.5 : usandoNitro ? 1.6 : 0.7));
      // direção mais leve parado, e a curva puxa o carro pra fora
      const curva = curvaEm(st.z);
      st.x += ((dir ? 1 : 0) - (esq ? 1 : 0)) * dt * 1.9 * Math.min(1, 0.4 + st.v / CRUZEIRO);
      st.x -= curva * dt * (st.v / CRUZEIRO) * 0.32;
      st.x = Math.max(-1.3, Math.min(1.3, st.x));
      st.z += st.v * dt;
      st.dist += st.v * dt * M_POR_SEG;
      // a polícia: começa um pouco mais lenta que você e acelera a cada nível
      const vPol = 12.4 + (st.alerta - 1) * 0.9;
      st.gap = Math.min(160, st.gap + (st.v - vPol) * dt * M_POR_SEG);
      const nivel = Math.min(5, 1 + Math.floor(st.dist / 900));
      if (nivel > st.alerta) { st.alerta = nivel; aviso(T("ALERTA ", "ALERT ") + nivel, "#ff3f8e"); tom(784, 0.1, "square", 0.04); tom(1046, 0.16, "square", 0.04, 0.1); }
      if (st.dist >= 3000 && !st.conq) { st.conq = true; conq("fuga", T("Saiu de Vice", "Out of Vice"), T("Fugiu 3 km da polícia na Fuga de Vice.", "Ran 3 km from the police in Escape from Vice.")); }
      st.invul = Math.max(0, st.invul - dt); st.tremor = Math.max(0, st.tremor - dt);
      gerar(dt);
      for (const o of st.objs) {
        if (o.troca) { o.troca -= dt; if (o.troca <= 0) { o.troca = 0; const f = FAIXAS.findIndex((x) => Math.abs(x - o.x) < 0.1); o.alvo = FAIXAS[Math.max(0, Math.min(2, f + (Math.random() < 0.5 ? -1 : 1)))]; } }
        if (o.alvo != null) { o.x += Math.sign(o.alvo - o.x) * Math.min(Math.abs(o.alvo - o.x), dt * 0.7); }
        o.z += o.v * dt;
        const d = o.z - st.z;
        const larg = o.tipo === "nitro" ? 0.3 : o.tipo === "cone" ? 0.3 : 0.46; // metade do Bel Air + metade do objeto, com uma folga
        const cruzou = o.dAnt > D_CARRO - 0.3 && d < D_CARRO + 0.3;
        if (!o.morto && cruzou && !o.passou) {
          if (Math.abs(o.x - st.x) < larg) bater(o);
          else if (o.tipo === "carro" && Math.abs(o.x - st.x) < 0.8 && st.invul <= 0 && d < D_CARRO) { o.passou = true; st.bonus += 50; st.nitro = Math.min(100, st.nitro + 6); aviso(T("RASPÃO! +50", "CLOSE CALL! +50"), "#5dff9c"); tom(1175, 0.06, "square", 0.03); }
        }
        if (d < D_CARRO - 0.3) o.passou = true;
        o.dAnt = d;
        if (st.fase !== "jogando") return;
      }
      st.objs = st.objs.filter((o) => !o.morto && o.z - st.z > 0.3);
      // sirene quando a viatura está perto
      st.sirene -= dt;
      if (st.gap < 50 && st.sirene <= 0) { st.sirene = 0.5; const v = 0.015 + (50 - st.gap) / 50 * 0.03; tom(740, 0.22, "square", v); tom(988, 0.22, "square", v, 0.25); }
      if (st.gap <= 0) acabou(T("A viatura te alcançou", "The cruiser caught you"));
      $(".fg-m").textContent = metros(); $(".fg-v").textContent = Math.round(st.v * M_POR_SEG * 3.6);
    }

    function obj(img, d, x, curva, escala = 1, dy = 0) {
      const p = 1 / d; if (p > 1.4 || d <= 0.2) return;
      const s = (p / P_CARRO) * escala, y = HY + p * BASE - 1, cx = centro(Math.min(p, 1), curva) + x * MEIA * p;
      const w = img.width * s, h = img.height * s;
      if (w < 1) return;
      g.drawImage(img, Math.round(cx - w / 2), Math.round(y - h - dy * s), Math.round(w), Math.round(h));
    }

    function desenhar() {
      aplicarEstilo();
      const k = E.k, curva = curvaEm(st.z);
      cam += (st.x * 0.55 - cam) * 0.15;
      const tr = st.tremor > 0 ? (Math.random() - 0.5) * 4 : 0;
      g.setTransform(k, 0, 0, k, tr * k, 0); g.imageSmoothingEnabled = !!E.suave;
      pecas.ceuECidade(g, E, C, W, H, HY, st.tempo, curva, st.z * 0.6 + curva * 30, predios);
      // pista com três faixas
      const passoY = 1 / k;
      for (let y = HY; y < H; y += passoY) {
        const p = (y - HY + 1) / BASE, z = 1 / p + st.z, seg = Math.floor(z * 0.9) & 1;
        const cx = centro(p, curva), mp = MEIA * p, zb = mp * 0.1;
        g.fillStyle = C.areia[seg]; g.fillRect(0, y, W, passoY);
        g.fillStyle = C.zebra[seg]; g.fillRect(cx - mp - zb, y, mp * 2 + zb * 2, passoY);
        g.fillStyle = C.pista[seg]; g.fillRect(cx - mp, y, mp * 2, passoY);
        if (seg) { g.fillStyle = C.faixa; const fw = Math.max(1, mp * 0.025); g.fillRect(cx - mp / 3 - fw / 2, y, fw, passoY); g.fillRect(cx + mp / 3 - fw / 2, y, fw, passoY); }
      }
      if (C.nevoa) { g.fillStyle = C.nevoa; g.fillRect(0, HY, W, 2); }
      // palmeiras e objetos, de trás pra frente
      for (const pm of st.palm) if (pm.z - st.z < 0.4) { pm.z += 16 * 2.4; pm.var = Math.random(); }
      const coisas = st.palm.map((pm) => ({ d: pm.z - st.z, pm })).concat(st.objs.map((o) => ({ d: o.z - st.z, o })));
      coisas.sort((a, b) => b.d - a.d);
      const pisca = Math.floor(st.tempo * 6) & 1;
      for (const c of coisas) {
        if (c.d < D_CARRO - 0.05 && c.o) continue; // o que já passou some debaixo da câmera
        if (c.pm) { const p = 1 / c.d; if (p > 1.6) continue; palmeiraEm(c.pm, p, curva); continue; }
        const o = c.o;
        if (o.tipo === "carro") obj(S.carros[o.spr], c.d, o.x, curva);
        else if (o.tipo === "blitz") obj(S.viatura[pisca], c.d, o.x, curva);
        else if (o.tipo === "cone") obj(S.cone, c.d, o.x, curva);
        else if (o.tipo === "nitro") obj(S.nitro, c.d, o.x, curva, 1, 6 + Math.sin(st.tempo * 6) * 3);
      }
      // o Bel Air
      const pula = st.v > 1 && Math.sin(st.tempo * 14) > 0.6 ? 1 : 0;
      ge.clearRect(0, 0, eu.width, eu.height);
      ge.fillStyle = "#e3a4cf"; ge.fillRect(15, 11, 50, 1);
      ge.fillStyle = "#a2679f"; ge.fillRect(15, 12, 1, 7); ge.fillRect(64, 12, 1, 7);
      pecas.casal(ge, 0, 3, st.tempo);
      ge.drawImage(carro, 0, 4);
      if (!(st.invul > 0 && pisca)) {
        const cx = centro(P_CARRO, curva) + st.x * MEIA * P_CARRO;
        g.drawImage(eu, Math.round(cx - pecas.CW / 2), Y_CARRO - pecas.CH - pula - 4);
        if (tec.n && st.nitro > 0 && st.fase === "jogando") { // chama do escapamento
          g.fillStyle = pisca ? "#5fd4ff" : "#ffd23f";
          g.fillRect(Math.round(cx - 37), Y_CARRO - 9, 3, 3 + pisca * 2); g.fillRect(Math.round(cx + 34), Y_CARRO - 9, 3, 3 + pisca * 2);
        }
      }
      // a viatura que vem atrás, subindo pela parte de baixo da tela
      if (st.gap < 45 && st.fase !== "pronto") {
        const perto = Math.max(0, Math.min(1, (45 - st.gap) / 45)), img = S.viatura[pisca], s = 1.5;
        const vx = centro(1, curva) + (st.x * 0.8) * MEIA;
        g.drawImage(img, Math.round(vx - img.width * s / 2), Math.round(H + 4 - img.height * s * (0.3 + 0.45 * perto)), Math.round(img.width * s), Math.round(img.height * s));
        g.fillStyle = pisca ? "rgba(255,45,85,.18)" : "rgba(47,123,255,.18)";
        g.fillRect(0, 0, 10 + perto * 10, H); g.fillRect(W - 10 - perto * 10, 0, 10 + perto * 10, H);
      }
      hud(pisca);
      g.setTransform(1, 0, 0, 1, 0, 0);
    }

    function palmeiraEm(pm, p, curva) {
      const y = HY + p * BASE, x = centro(Math.min(p, 1), curva) + pm.lado * MEIA * p * 1.4;
      pecas.palmeira(g, C, x, y, p * 76 * (0.85 + pm.var * 0.3), pm.lado);
    }

    function texto(t, x, y, tam, cor, sombra = "#1b1426") {
      g.font = `700 ${tam}px ${FONTE}`; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillStyle = sombra; g.fillText(t, x + 1, y + 1); g.fillText(t, x + 2, y + 2);
      g.fillStyle = cor; g.fillText(t, x, y);
    }
    function barra(x, y, w, v, cor, rot) {
      g.fillStyle = "rgba(15,8,30,.7)"; g.fillRect(x - 1, y - 1, w + 2, 6);
      g.fillStyle = cor; g.fillRect(x, y, Math.round(w * Math.max(0, Math.min(1, v))), 4);
      g.font = `700 8px ${FONTE}`; g.textAlign = "left"; g.textBaseline = "bottom"; g.fillStyle = "#fff"; g.fillText(rot, x, y - 1);
    }
    function hud(pisca) {
      if (st.fase === "jogando" || st.fase === "pausa" || st.fase === "pego") {
        // nível de alerta: cinco giroflex
        for (let i = 0; i < 5; i++) { const on = i < st.alerta; g.fillStyle = "rgba(15,8,30,.7)"; g.fillRect(W - 62 + i * 12, 5, 10, 7); if (on) { g.fillStyle = (i + pisca) % 2 ? "#ff2d55" : "#2f7bff"; g.fillRect(W - 61 + i * 12, 6, 8, 5); } }
        barra(8, 14, 70, st.nitro / 100, "#5fd4ff", "NITRO");
        barra(8, 30, 70, st.gap / 160, st.gap < 40 ? (pisca ? "#ff2d55" : "#ffd23f") : "#5dff9c", T("POLÍCIA ", "POLICE ") + Math.max(0, Math.round(st.gap)) + " m");
      }
      st.avisos.forEach((a, i) => { texto(a.txt, W / 2, 46 + i * 14 - (1.4 - a.t) * 6, 12, a.cor); });
      st.avisos = st.avisos.filter((a) => a.t > 0);
      if (st.fase === "pronto") {
        g.fillStyle = "rgba(15,8,30,.45)"; g.fillRect(0, 40, W, 74);
        texto(T("FUGA DE VICE", "ESCAPE FROM VICE"), W / 2, 66, 26, "#ff7ad9");
        texto(T("toque ou aperte espaço para fugir", "tap or press space to escape"), W / 2, 96, 11, "#fff");
      } else if (st.fase === "pausa") {
        g.fillStyle = "rgba(15,8,30,.55)"; g.fillRect(0, 60, W, 50); texto(T("PAUSA", "PAUSED"), W / 2, 78, 18, "#fff"); texto(T("toque para continuar", "tap to continue"), W / 2, 98, 10, "#fff");
      } else if (st.fase === "pego") {
        g.fillStyle = "rgba(15,8,30,.62)"; g.fillRect(0, 34, W, 96);
        texto(T("TE PEGARAM!", "CAUGHT!"), W / 2, 54, 22, pisca ? "#ff2d55" : "#5fa0ff");
        texto(st.motivo, W / 2, 76, 10, "#fff");
        texto(`${metros()} m + ${st.bonus} ${T("bônus", "bonus")} = ${pontos()}${st.recorde ? " ★ " + T("RECORDE", "BEST") : ""}`, W / 2, 94, 11, "#ffd23f");
        if (st.tempo - st.fimEm > 0.8) texto(T("toque para fugir de novo", "tap to escape again"), W / 2, 114, 10, "#fff");
      }
    }

    function comecar() {
      if (st.fase === "pronto") { st.fase = "jogando"; tom(392, 0.08, "square", 0.04); tom(523, 0.08, "square", 0.04, 0.09); tom(784, 0.14, "square", 0.04, 0.18); if (matchMedia("(pointer: coarse)").matches) cv.scrollIntoView({ behavior: "smooth", block: "center" }); }
      else if (st.fase === "pausa") st.fase = "jogando";
      else if (st.fase === "pego" && st.tempo - st.fimEm > 0.8) { novo(); st.fase = "jogando"; }
    }

    function quadro(t) {
      raf = 0;
      if (!area.isConnected) return;
      const dt = Math.min(0.05, ult ? (t - ult) / 1000 : 0.016); ult = t;
      if (st.fase === "jogando" && (!ativo(area) || document.hidden)) st.fase = "pausa";
      const antes = st.fase;
      if (st.fase !== "pausa") { passo(dt); st.avisos.forEach((a) => (a.t -= dt)); }
      if (antes === "jogando" && st.fase === "pego") st.fimEm = st.tempo;
      desenhar();
      raf = requestAnimationFrame(quadro);
    }

    // teclado
    const K = { ArrowLeft: "e", a: "e", A: "e", ArrowRight: "d", d: "d", D: "d", ArrowUp: "n", w: "n", W: "n", " ": "n" };
    const baixo = (e) => {
      if (digitando(e) || !ativo(area)) return;
      const c = K[e.key]; if (!c && e.key !== "Enter") return;
      e.preventDefault();
      if (st.fase !== "jogando" && (c === "n" || e.key === "Enter")) { comecar(); return; }
      if (c) tec[c] = true;
    };
    const cima = (e) => { const c = K[e.key]; if (c) tec[c] = false; };
    document.addEventListener("keydown", baixo); document.addEventListener("keyup", cima);
    // toque na tela: metade esquerda vira pra esquerda, metade direita pra direita
    const dedos = new Map();
    const lerDedos = () => { toque.e = [...dedos.values()].includes("e"); toque.d = [...dedos.values()].includes("d"); };
    cv.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (st.fase !== "jogando") { comecar(); return; }
      const r = cv.getBoundingClientRect(); dedos.set(e.pointerId, e.clientX - r.left < r.width / 2 ? "e" : "d"); lerDedos();
      try { cv.setPointerCapture(e.pointerId); } catch {}
    });
    const soltar = (e) => { dedos.delete(e.pointerId); lerDedos(); };
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => cv.addEventListener(ev, soltar));
    // botões (seguram enquanto o dedo estiver em cima)
    area.querySelectorAll(".fg-pad button").forEach((b) => {
      const c = b.dataset.c;
      b.addEventListener("pointerdown", (e) => { e.preventDefault(); if (st.fase !== "jogando") { comecar(); return; } tec[c] = true; b.classList.add("on"); try { b.setPointerCapture(e.pointerId); } catch {} });
      const sol = () => { tec[c] = false; b.classList.remove("on"); };
      ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => b.addEventListener(ev, sol));
      b.addEventListener("contextmenu", (e) => e.preventDefault());
    });

    aplicarEstilo(); novo();
    raf = requestAnimationFrame(quadro);
    return () => { if (raf) cancelAnimationFrame(raf); raf = 0; document.removeEventListener("keydown", baixo); document.removeEventListener("keyup", cima); };
  }

  Object.assign(ALU.JOGOS = ALU.JOGOS || {}, { fuga });
})();
