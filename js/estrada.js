// Tema "Estrada 57": um Bel Air conversível 1957 com o Aluísio e a Kezia
// numa estrada ao pôr do sol, no estilo dos jogos de corrida em pseudo-3D.
// Tudo desenhado por código num canvas de baixa resolução, ampliado sem suavizar.
// Fica parado se a pessoa pediu menos movimento e pausa quando a aba some.
(function () {
  const ALU = window.ALU;

  // paleta de fim de tarde: violeta, magenta, rosa, laranja e turquesa
  const C = {
    ceu: ["#1d0b3d", "#2c0f52", "#47156b", "#6c1a7e", "#97228a", "#c42f8c", "#e8458a", "#ff5f7e", "#ff7f6a", "#ff9e5c", "#ffbd5a"],
    sol: ["#fff3a8", "#ffe27a", "#ffc65e", "#ffa35a", "#ff7f64", "#ff5f7e", "#f2468f"],
    nuvem: ["#ff9fc6", "#d95fae", "#a8429c"],
    predio: "#3a1259", predio2: "#541a72", janela: ["#3ff3dd", "#ff7ad9", "#ffd36b"],
    areia: ["#f0956f", "#e5835f"], zebra: ["#fff1e6", "#ff3f8e"], pista: ["#4b3566", "#45305e"], faixa: "#ffe7d6",
    palmeira: "#2a0d3e", palmeira2: "#3d1456",
  };

  // ---------- o carro, visto de trás (sprite 80×46, desenhado uma vez) ----------
  const CW = 80, CH = 46;
  function desenharCarro() {
    const cv = document.createElement("canvas"); cv.width = CW; cv.height = CH;
    const g = cv.getContext("2d");
    const r = (c, x, y, w, h) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    const tq = "#2ec4b6", tqC = "#7ff0e0", tqE = "#168a80", tqEE = "#0d5c59", marfim = "#fff1dc", marfimE = "#e2c9b0";
    const cr = ["#ffffff", "#ffd6ea", "#e3a4cf", "#a2679f", "#5b2f66"];
    // sombra no asfalto
    g.fillStyle = "rgba(20,5,35,.55)"; g.fillRect(4, 42, 72, 4); g.fillRect(8, 41, 64, 1);
    // pneus com faixa branca
    r("#140a1c", 7, 34, 12, 10); r("#140a1c", 61, 34, 12, 10);
    r("#f4eadf", 9, 36, 2, 7); r("#f4eadf", 69, 36, 2, 7);
    // banco e encosto (marfim com friso turquesa)
    r(marfimE, 16, 14, 48, 8); r(marfim, 17, 14, 21, 6); r(marfim, 42, 14, 21, 6); r(tq, 38, 14, 4, 8);
    // tampa traseira e deck
    r(tqE, 10, 21, 60, 2); r(tq, 10, 23, 60, 9); r(tqC, 12, 23, 56, 1);
    // rabos de peixe (as aletas de 57)
    for (const [x0, dir] of [[2, 1], [69, -1]]) {
      for (let i = 0; i < 9; i++) {
        const x = dir > 0 ? x0 + i : x0 + (8 - i);
        const topo = 15 + Math.floor(i * 0.9);
        r(i < 2 || i > 6 ? tqE : tq, x, topo, 1, 34 - topo);
        r(cr[1], x, topo, 1, 1);
      }
      // lanterna dentro da aleta, com moldura cromada
      const lx = dir > 0 ? 3 : 71;
      r(cr[3], lx, 19, 6, 11); r("#ff2d55", lx + 1, 20, 4, 9); r("#ff9db0", lx + 1, 20, 1, 4); r("#b3123a", lx + 4, 25, 1, 4);
    }
    // faixa lateral marfim e o "V" dourado
    r(marfim, 11, 26, 58, 1);
    r("#ffcf4a", 36, 25, 2, 2); r("#ffcf4a", 42, 25, 2, 2); r("#ffcf4a", 38, 27, 4, 2); r("#c78a1e", 39, 29, 2, 1);
    // para-choque cromado com os protetores
    r(cr[0], 1, 32, 78, 1); r(cr[1], 1, 33, 78, 2); r(cr[2], 1, 35, 78, 1); r(cr[3], 2, 36, 76, 1); r(cr[4], 4, 37, 72, 1);
    r(cr[1], 25, 29, 3, 7); r(cr[0], 25, 29, 1, 6); r(cr[1], 52, 29, 3, 7); r(cr[0], 52, 29, 1, 6);
    // saídas de escape nas pontas
    r(cr[4], 3, 33, 3, 2); r(cr[4], 74, 33, 3, 2);
    // placa
    r("#ffe9a8", 34, 30, 12, 4); r("#3a1259", 35, 31, 2, 1); r("#3a1259", 38, 31, 1, 2); r("#3a1259", 40, 31, 2, 1); r("#3a1259", 43, 31, 2, 2);
    // brilho do pôr do sol no topo da carroceria
    g.fillStyle = "rgba(255,160,190,.45)"; g.fillRect(10, 21, 60, 1);
    return cv;
  }

  // os dois de costas: cabelo azul e camiseta vermelha (como nos desenhos do site)
  function desenharCasal(g, ox, oy, t) {
    const r = (c, x, y, w, h) => { g.fillStyle = c; g.fillRect(ox + x, oy + y, w, h); };
    const az = "#2f5bd3", azC = "#6b95ff", azE = "#1b2f7a", verm = "#e0413a", vermE = "#a82a2a", pele = "#f2d6c0";
    const v = Math.sin(t * 7) > 0 ? 1 : 0, v2 = Math.sin(t * 7 + 1.7) > 0 ? 1 : 0;
    // Aluísio (motorista, à esquerda): cabelo curto e espetado
    r(verm, 18, 11, 16, 5); r(verm, 19, 10, 14, 1); r(vermE, 18, 15, 16, 1);
    r(pele, 24, 9, 4, 2);
    r(pele, 19, 5, 1, 2); r(pele, 32, 5, 1, 2);
    r(az, 20, 1, 12, 8); r(az, 21, 0, 10, 1); r(azE, 20, 8, 12, 1); r(azE, 21, 9, 10, 1);
    r(az, 20, -1, 2, 1); r(az, 24, -2, 2, 2); r(az, 28, -1, 2, 1); r(az, 31, 0, 2, 1); r(az, 19, 1, 1, 2);
    r(azC, 23, 1, 4, 2); r(azC, 22, 3, 1, 2); r(azE, 26, 4, 1, 3); r(azE, 29, 2, 1, 3);
    r("#c9772e", 25, -3, 2, 1); // o enfeite laranja do desenho
    r(pele, 16, 9, 2, 2); // mão no volante
    // Kezia (à direita): cabelo comprido até os ombros, balançando com o vento
    r(verm, 45, 11, 16, 5); r(verm, 46, 10, 14, 1); r(vermE, 45, 15, 16, 1);
    r(az, 47, 0, 12, 10); r(az, 46, 1, 14, 12); r(az, 48, -1, 10, 1);
    r(az, 45 - v, 4, 1, 9); r(az, 60 + v2, 4, 1, 9); r(az, 44 - v, 8 + v2, 1, 4); r(az, 61 + v2, 7 + v, 1, 5);
    r(azE, 46, 12, 14, 1); r(azE, 49, 7, 1, 4); r(azE, 56, 6, 1, 5); r(azE, 52, 9, 2, 2);
    r(azC, 50, 0, 3, 2); r(azC, 48, 2, 1, 2); r(azC, 55, 1, 2, 1);
    r("#ffd23f", 51, -3, 3, 2); r("#ffd23f", 50, -2, 1, 1); r("#ffd23f", 54, -2, 1, 1); // a coroinha amarela do desenho
    // braço pra cima, dando tchau pro pôr do sol
    const b = Math.sin(t * 3) > 0 ? 0 : 1;
    r(verm, 61, 9, 3, 3); r(pele, 62, 3, 2, 6); r(pele, 61 + b, 0, 3, 3); r(pele, 61 + b, -1, 1, 1); r(pele, 63 + b, -1, 1, 1);
  }

  // ---------- cenário ----------
  const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cv = null, g = null, carro = null, W = 0, H = 0, raf = 0, ultimo = 0, tempo = 0;
  let camZ = 0, curva = 0, fundoX = 0;
  const palmeiras = [];
  const predios = [];

  function semente(n) { let s = n; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

  function preparar() {
    const rnd = semente(57);
    predios.length = 0;
    for (let x = 0; x < 520;) {
      const w = 6 + Math.floor(rnd() * 12), h = 6 + Math.floor(rnd() * 26) + (x > 150 && x < 260 ? 14 : 0);
      predios.push({ x, w, h, cor: rnd() > 0.5 ? C.predio : C.predio2, j: Math.floor(rnd() * 1000) });
      x += w + (rnd() > 0.7 ? 6 + Math.floor(rnd() * 30) : 0);
    }
    palmeiras.length = 0;
    for (let i = 0; i < 14; i++) palmeiras.push({ d: 1.2 + i * 2.2, lado: i % 2 ? 1 : -1, var: rnd() });
  }

  function dimensionar() {
    const vw = innerWidth, vh = innerHeight;
    H = vw < vh ? 300 : 200;
    W = Math.max(120, Math.round(H * vw / vh));
    cv.width = W; cv.height = H;
  }

  function desenhar(dt) {
    tempo += dt;
    const vel = 9; // segmentos por segundo
    camZ += dt * vel;
    curva = Math.sin(tempo * 0.09) * 0.9 + Math.sin(tempo * 0.031) * 0.5;
    fundoX += curva * dt * 6;
    const retrato = H > W;
    const hy = Math.round(H * (retrato ? 0.5 : 0.52));

    // céu em faixas
    const nb = C.ceu.length;
    for (let i = 0; i < nb; i++) {
      const y0 = Math.floor(hy * Math.pow(i / nb, 0.75)), y1 = Math.floor(hy * Math.pow((i + 1) / nb, 0.75));
      g.fillStyle = C.ceu[i]; g.fillRect(0, y0, W, y1 - y0 + 1);
      // pontilhado na transição, bem 16 bits
      if (i < nb - 1) { g.fillStyle = C.ceu[i + 1]; for (let x = (y1 & 1); x < W; x += 2) g.fillRect(x, y1 - 1, 1, 1); }
    }
    // estrelas piscando no alto
    const rs = semente(7);
    for (let i = 0; i < 40; i++) {
      const x = Math.floor(rs() * W), y = Math.floor(rs() * hy * 0.35), f = rs();
      if (Math.sin(tempo * (1 + f * 2) + f * 9) > -0.3) { g.fillStyle = f > 0.8 ? "#ffd6f0" : "#a98ad8"; g.fillRect(x, y, 1, 1); }
    }

    // sol listrado nascendo do horizonte
    const sr = Math.round(Math.min(W * (retrato ? 0.36 : 0.2), H * 0.24));
    const sx = Math.round(W / 2 - curva * W * 0.04 + Math.sin(fundoX * 0.01) * 4), sy = hy - Math.round(sr * 0.25);
    for (let y = -sr; y <= sr; y++) {
      const yy = sy + y; if (yy >= hy) break;
      const k = (y + sr) / (2 * sr);
      if (k > 0.5) { const per = 6, faixa = Math.floor((k - 0.5) * 10) + 1; if (((yy - sy + Math.floor(tempo * 3)) % per + per) % per < Math.min(faixa, 4)) continue; }
      const meia = Math.floor(Math.sqrt(sr * sr - y * y));
      g.fillStyle = C.sol[Math.min(C.sol.length - 1, Math.floor(k * C.sol.length))];
      g.fillRect(sx - meia, yy, meia * 2, 1);
    }
    // nuvens finas cruzando o sol
    const rn = semente(23);
    for (let i = 0; i < 7; i++) {
      const w = 20 + Math.floor(rn() * 50), y = Math.floor(hy * (0.25 + rn() * 0.6));
      const x = Math.floor(((rn() * (W + 120) + tempo * (2 + i * 0.6) - fundoX * 0.2) % (W + 120) + (W + 120)) % (W + 120)) - 60;
      g.fillStyle = C.nuvem[i % 3]; g.fillRect(x, y, w, 1); g.fillRect(x + 6, y + 1, w - 14, 1);
    }

    // cidade no horizonte (paralaxe lenta)
    const off = ((Math.floor(fundoX * 0.5) % 520) + 520) % 520;
    for (const p of predios) {
      for (const k of [-520, 0, 520]) {
        const x = p.x - off + k; if (x + p.w < 0 || x > W) continue;
        // perto do sol os prédios baixam, pra ele aparecer inteiro
        const perto = Math.max(0, 1 - Math.abs(x + p.w / 2 - sx) / (sr * 1.4));
        const h = Math.max(2, Math.round(p.h * (1 - perto * 0.85)));
        g.fillStyle = p.cor; g.fillRect(x, hy - h, p.w, h);
        const rj = semente(p.j + 1);
        for (let jy = hy - h + 2; jy < hy - 2; jy += 3) for (let jx = x + 1; jx < x + p.w - 1; jx += 2) {
          const v = rj(); if (v > 0.82) { g.fillStyle = C.janela[Math.floor(v * 100) % 3]; g.fillRect(jx, jy, 1, 1); }
        }
      }
    }

    // chão e pista, linha a linha (projeção clássica dos jogos de corrida)
    const base = H - hy, meiaPista = W * (retrato ? 0.62 : 0.42);
    const centro = (p) => W / 2 + curva * (1 - p) * (1 - p) * W * 0.55 - curva * W * 0.05 * p;
    for (let y = hy; y < H; y++) {
      const p = (y - hy + 1) / base, z = 1 / p + camZ, seg = Math.floor(z * 0.9) & 1;
      const cx = centro(p), mp = meiaPista * p, zb = mp * 0.12;
      g.fillStyle = C.areia[seg]; g.fillRect(0, y, W, 1);
      g.fillStyle = C.zebra[seg]; g.fillRect(cx - mp - zb, y, mp * 2 + zb * 2, 1);
      g.fillStyle = C.pista[seg]; g.fillRect(cx - mp, y, mp * 2, 1);
      if (seg) { g.fillStyle = C.faixa; const fw = Math.max(1, mp * 0.03); g.fillRect(cx - fw / 2, y, fw, 1); }
    }
    // névoa rosada no horizonte
    g.fillStyle = "rgba(255,120,150,.35)"; g.fillRect(0, hy, W, 2);

    // palmeiras na beira da estrada, de trás pra frente
    for (const pm of palmeiras) { pm.d -= dt * vel; if (pm.d < 0.35) { pm.d += 14 * 2.2; pm.var = Math.random(); } }
    palmeiras.sort((a, b) => b.d - a.d);
    for (const pm of palmeiras) {
      const p = 1 / pm.d; if (p > 1.6) continue;
      const y = hy + p * base, x = centro(Math.min(p, 1)) + pm.lado * meiaPista * p * 1.45;
      palmeira(x, y, p * (retrato ? 70 : 80) * (0.85 + pm.var * 0.3), pm.lado);
    }

    // o Bel Air
    const pula = Math.sin(tempo * 14) > 0.6 ? 1 : 0;
    const cxCarro = Math.round(W / 2 - CW / 2 - curva * 5), cyCarro = Math.round(H * (retrato ? 0.8 : 0.93)) - CH - pula;
    // moldura do para-brisa fica atrás dos dois, que ficam atrás da carroceria
    g.fillStyle = "#e3a4cf"; g.fillRect(cxCarro + 15, cyCarro + 7, 50, 1);
    g.fillStyle = "#a2679f"; g.fillRect(cxCarro + 15, cyCarro + 8, 1, 7); g.fillRect(cxCarro + 64, cyCarro + 8, 1, 7);
    desenharCasal(g, cxCarro, cyCarro - 1, tempo);
    g.drawImage(carro, cxCarro, cyCarro);
  }

  function palmeira(x, yBase, alt, lado) {
    if (alt < 2) return;
    const s = alt / 40; // a palmeira "padrão" tem 40 px
    const px = (c, dx, dy, w, h) => { g.fillStyle = c; g.fillRect(Math.round(x + dx * s), Math.round(yBase - dy * s), Math.max(1, Math.ceil(w * s)), Math.max(1, Math.ceil(h * s))); };
    // tronco curvado para fora da estrada, em gomos
    for (let i = 0; i < 34; i += 2) { const dx = lado * Math.pow(i / 34, 2) * 6; px(i % 4 ? C.palmeira : C.palmeira2, dx - 1.2, i + 2, 2.6 - i * 0.02, 2.2); }
    const tx = lado * 6 - 0.2, ty = 36;
    // folhas em arco, caindo com o peso
    for (const [hx, vy] of [[-1, 0.15], [-0.8, 0.6], [-0.3, 1], [0.3, 1], [0.8, 0.6], [1, 0.15]]) {
      for (let k = 0; k <= 13; k++) {
        const dx = hx * k * 1.15, dy = vy * k * 0.8 - k * k * 0.045 * (1.3 - vy * 0.6);
        const esp = 2.6 - k * 0.13;
        px(k % 3 ? C.palmeira : C.palmeira2, tx + dx - esp / 2, ty + dy + esp / 2, esp, esp * 0.8);
      }
    }
    px("#4a1a52", tx - 1.5, ty, 3, 2.4);
  }

  function loop(t) {
    raf = 0;
    if (!cv || !cv.isConnected) return;
    const dt = Math.min(0.1, ultimo ? (t - ultimo) / 1000 : 0.016);
    // até ~30 quadros por segundo: o visual é de 16 bits, não precisa de mais
    if (ultimo && t - ultimo < 32) { raf = requestAnimationFrame(loop); return; }
    ultimo = t;
    desenhar(dt);
    if (!reduzido && !document.hidden) raf = requestAnimationFrame(loop);
  }

  function ligar() {
    const wp = document.getElementById("wallpaper"); if (!wp) return;
    if (!cv) {
      cv = document.createElement("canvas"); cv.className = "estrada-cv"; cv.setAttribute("aria-hidden", "true");
      g = cv.getContext("2d"); carro = desenharCarro(); preparar();
    }
    if (!cv.isConnected) wp.appendChild(cv);
    dimensionar();
    ultimo = 0;
    if (reduzido) { tempo = 8; desenhar(0); return; }
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function desligar() {
    if (raf) cancelAnimationFrame(raf); raf = 0;
    if (cv && cv.isConnected) cv.remove();
  }
  function aplicar() { document.documentElement.dataset.tema === "estrada" ? ligar() : desligar(); }

  ALU.estrada = { aplicar };
  new MutationObserver(aplicar).observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });
  document.addEventListener("DOMContentLoaded", aplicar);
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { if (cv && cv.isConnected) { dimensionar(); if (reduzido) desenhar(0); } }, 150); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden && cv && cv.isConnected && !reduzido && !raf) { ultimo = 0; raf = requestAnimationFrame(loop); } });
})();
