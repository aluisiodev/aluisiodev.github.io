// Papel de parede "Estrada 57": um Bel Air conversível 1957 com o Aluísio e a Kezia numa estrada,
// no estilo pseudo-3D dos jogos de corrida antigos. A cena se adapta ao tema (js/fundos.js escolhe o estilo):
//   retro  (tema Retrowave):  pôr do sol neon, pixel art com pontilhado e sol listrado
//   pixel  (Pixel 2006):      fim de tarde dourado com campo verde, pixel art
//   aero   (Frutiger Aero):   dia azul e brilhante, em alta resolução, com sol radiante e nuvens fofas
//   metro  (Frutiger Metro):  cores chapadas na cor das janelas, sem degradê
// Fica parado se a pessoa pediu menos movimento, pausa quando a aba some e quando um app cobre o celular.
(function () {
  const ALU = window.ALU;

  const RETRO = {
    ceu: ["#1d0b3d", "#2c0f52", "#47156b", "#6c1a7e", "#97228a", "#c42f8c", "#e8458a", "#ff5f7e", "#ff7f6a", "#ff9e5c", "#ffbd5a"],
    sol: ["#fff3a8", "#ffe27a", "#ffc65e", "#ffa35a", "#ff7f64", "#ff5f7e", "#f2468f"],
    nuvem: ["#ff9fc6", "#d95fae", "#a8429c"], estrela: ["#ffd6f0", "#a98ad8"],
    predio: "#3a1259", predio2: "#541a72", janela: ["#3ff3dd", "#ff7ad9", "#ffd36b"],
    areia: ["#f0956f", "#e5835f"], zebra: ["#fff1e6", "#ff3f8e"], pista: ["#4b3566", "#45305e"], faixa: "#ffe7d6",
    palmeira: "#2a0d3e", palmeira2: "#3d1456", coco: "#4a1a52", nevoa: "rgba(255,120,150,.35)",
  };
  const PIXEL = {
    ceu: ["#1b3f8f", "#2456b5", "#2f6fd1", "#4a8ae0", "#6fa6e8", "#9cc0ea", "#c6d2df", "#f0d6ac", "#ffc983", "#ffb468", "#ff9f55"],
    sol: ["#fffbe0", "#fff3b8", "#ffe596", "#ffd579", "#ffc463", "#ffb352", "#ffa247"],
    nuvem: ["#ffffff", "#e3ebf7", "#ffdcb8"], estrela: [],
    predio: "#2a3c6e", predio2: "#34497f", janela: ["#ffe27a", "#bfe6ff", "#ffffff"],
    areia: ["#5fae3a", "#55a034"], zebra: ["#ffffff", "#e0413a"], pista: ["#5c5f6a", "#575a64"], faixa: "#fff6c8",
    palmeira: "#1e3a1a", palmeira2: "#2a4d22", coco: "#5a3b1a", nevoa: "rgba(255,225,190,.4)",
  };
  const AERO = {
    ceu: ["#0b4fa8", "#2b8fe0", "#6cc6f5", "#bfe9ff", "#f2fbff"],
    sol: ["#ffffff", "#fff8d6"], nuvem: ["rgba(255,255,255,.9)", "rgba(255,255,255,.75)", "rgba(235,248,255,.8)"], estrela: [],
    predio: "#4f8fc6", predio2: "#6aa7d8", janela: ["#e9fbff", "#bfe9ff", "#ffffff"],
    areia: ["#7ed957", "#70cc4b"], zebra: ["#ffffff", "#2b9be8"], pista: ["#6d7a88", "#687584"], faixa: "#ffffff",
    palmeira: "#2f7d2a", palmeira2: "#3f9e2c", coco: "#7a5a2a", nevoa: "rgba(255,255,255,.5)",
  };
  // o Metro usa a cor das janelas (--accent), como o resto do tema
  function METRO() {
    const a = (getComputedStyle(document.documentElement).getPropertyValue("--accent") || "#2f6bff").trim();
    return {
      ceu: [a, a, a], ceuMetro: [mix(a, "#000", 0.35), a, mix(a, "#fff", 0.3)],
      sol: ["#ffffff"], nuvem: [], estrela: [],
      predio: "#1d1d1d", predio2: "#2b2b2b", janela: [a, "#ffffff", "#ffffff"],
      areia: ["#1d1d1d", "#232323"], zebra: ["#ffffff", a], pista: ["#3a3a3a", "#353535"], faixa: "#ffffff",
      palmeira: "#000000", palmeira2: "#111111", coco: "#111111", nevoa: null,
    };
  }
  function mix(c1, c2, t) {
    const p = (c) => { const n = parseInt(c.replace("#", "").padEnd(6, "0").slice(0, 6), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
    const a = p(c1), b = p(c2); return "rgb(" + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",") + ")";
  }
  const ESTILOS = {
    retro: { k: 1, pal: () => RETRO, ceu: "faixas", sol: "listrado", nuvem: "linha" },
    pixel: { k: 1, pal: () => PIXEL, ceu: "faixas", sol: "disco", nuvem: "linha" },
    aero: { k: 3, pal: () => AERO, ceu: "degrade", sol: "brilho", nuvem: "elipse", suave: true },
    metro: { k: 3, pal: METRO, ceu: "chapado", sol: "chapado", nuvem: null },
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

  function semente(n) { let s = n; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
  let carro = null;
  const mqMov = matchMedia("(prefers-reduced-motion: reduce)");
  let reduzido = mqMov.matches;

  // uma cena = um canvas com o seu estado (a do fundo e as das prévias do Painel)
  function criarCena(nomeEstilo) {
    const E = ESTILOS[nomeEstilo] || ESTILOS.retro;
    const cv = document.createElement("canvas"), g = cv.getContext("2d");
    if (!carro) carro = desenharCarro();
    const sprite = document.createElement("canvas"); sprite.width = CW; sprite.height = CH + 4;
    const gs = sprite.getContext("2d");
    let C = E.pal(), W = 0, H = 0, tempo = 0, camZ = 0, curva = 0, fundoX = 0, celular = false;
    const rnd = semente(57), predios = [], palmeiras = [];
    for (let x = 0; x < 520;) {
      const w = 6 + Math.floor(rnd() * 12), h = 6 + Math.floor(rnd() * 26) + (x > 150 && x < 260 ? 14 : 0);
      predios.push({ x, w, h, alt: rnd() > 0.5, j: Math.floor(rnd() * 1000) });
      x += w + (rnd() > 0.7 ? 6 + Math.floor(rnd() * 30) : 0);
    }
    for (let i = 0; i < 14; i++) palmeiras.push({ d: 1.2 + i * 2.2, lado: i % 2 ? 1 : -1, var: rnd() });

    function dimensionar(vw, vh, ehCelular) {
      vw = Math.max(1, vw); vh = Math.max(1, vh); celular = !!ehCelular;
      H = vw < vh ? 300 : 200;
      W = Math.min(1200, Math.max(120, Math.round(H * vw / vh)));
      cv.width = W * E.k; cv.height = H * E.k;
      C = E.pal();
    }

    function palmeira(x, yBase, alt, lado) {
      if (alt < 2) return;
      const s = alt / 40; // a palmeira "padrão" tem 40 px
      const px = (c, dx, dy, w, h) => { g.fillStyle = c; g.fillRect(Math.round(x + dx * s), Math.round(yBase - dy * s), Math.max(1, Math.ceil(w * s)), Math.max(1, Math.ceil(h * s))); };
      for (let i = 0; i < 34; i += 2) { const dx = lado * Math.pow(i / 34, 2) * 6; px(i % 4 ? C.palmeira : C.palmeira2, dx - 1.2, i + 2, 2.6 - i * 0.02, 2.2); }
      const tx = lado * 6 - 0.2, ty = 36;
      for (const [hx, vy] of [[-1, 0.15], [-0.8, 0.6], [-0.3, 1], [0.3, 1], [0.8, 0.6], [1, 0.15]]) {
        for (let k = 0; k <= 13; k++) {
          const dx = hx * k * 1.15, dy = vy * k * 0.8 - k * k * 0.045 * (1.3 - vy * 0.6);
          const esp = 2.6 - k * 0.13;
          px(k % 3 ? C.palmeira : C.palmeira2, tx + dx - esp / 2, ty + dy + esp / 2, esp, esp * 0.8);
        }
      }
      px(C.coco, tx - 1.5, ty, 3, 2.4);
    }

    function desenhar(dt) {
      tempo += dt;
      const vel = 9; // segmentos por segundo
      camZ += dt * vel;
      curva = Math.sin(tempo * 0.09) * 0.9 + Math.sin(tempo * 0.031) * 0.5;
      fundoX += curva * dt * 6;
      const retrato = H > W;
      const hy = Math.round(H * (retrato ? 0.5 : 0.52));
      g.setTransform(E.k, 0, 0, E.k, 0, 0);
      g.imageSmoothingEnabled = !!E.suave;

      // céu
      if (E.ceu === "degrade") {
        const gr = g.createLinearGradient(0, 0, 0, hy);
        C.ceu.forEach((c, i) => gr.addColorStop(i / (C.ceu.length - 1), c));
        g.fillStyle = gr; g.fillRect(0, 0, W, hy);
      } else if (E.ceu === "chapado") {
        const cs = C.ceuMetro;
        cs.forEach((c, i) => { g.fillStyle = c; g.fillRect(0, Math.floor(hy * i / cs.length), W, Math.ceil(hy / cs.length) + 1); });
        // faixas diagonais claras, como no papel de parede do Metro
        g.fillStyle = "rgba(255,255,255,.07)";
        g.beginPath(); g.moveTo(W * 0.55, 0); g.lineTo(W * 0.7, 0); g.lineTo(W * 0.5, hy); g.lineTo(W * 0.35, hy); g.fill();
      } else {
        const nb = C.ceu.length;
        for (let i = 0; i < nb; i++) {
          const y0 = Math.floor(hy * Math.pow(i / nb, 0.75)), y1 = Math.floor(hy * Math.pow((i + 1) / nb, 0.75));
          g.fillStyle = C.ceu[i]; g.fillRect(0, y0, W, y1 - y0 + 1);
          if (i < nb - 1) { g.fillStyle = C.ceu[i + 1]; for (let x = (y1 & 1); x < W; x += 2) g.fillRect(x, y1 - 1, 1, 1); }
        }
      }
      // estrelas piscando no alto
      if (C.estrela.length) {
        const rs = semente(7);
        for (let i = 0; i < 40; i++) {
          const x = Math.floor(rs() * W), y = Math.floor(rs() * hy * 0.35), f = rs();
          if (Math.sin(tempo * (1 + f * 2) + f * 9) > -0.3) { g.fillStyle = f > 0.8 ? C.estrela[0] : C.estrela[1]; g.fillRect(x, y, 1, 1); }
        }
      }

      // sol
      const sr = Math.round(Math.min(W * (retrato ? 0.36 : 0.2), H * 0.24));
      const sx = Math.round(W / 2 - curva * W * 0.04 + Math.sin(fundoX * 0.01) * 4), sy = hy - Math.round(sr * 0.25);
      g.save(); g.beginPath(); g.rect(0, 0, W, hy); g.clip();
      if (E.sol === "brilho") {
        const gl = g.createRadialGradient(sx, sy, sr * 0.2, sx, sy, sr * 3.2);
        gl.addColorStop(0, "rgba(255,255,240,.95)"); gl.addColorStop(0.25, "rgba(255,250,220,.55)"); gl.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gl; g.fillRect(0, 0, W, hy);
        g.fillStyle = C.sol[0]; g.beginPath(); g.arc(sx, sy, sr * 0.62, 0, Math.PI * 2); g.fill();
        // reflexos de lente, bem 2007
        [[0.6, 0.18, ".35"], [1.25, 0.1, ".25"], [1.7, 0.26, ".18"]].forEach(([d, r, a]) => {
          g.fillStyle = `rgba(255,255,255,${a})`; g.beginPath(); g.arc(sx + (W * 0.15 - sx) * d * 0.5, sy + (hy * 0.2 - sy) * d * 0.5, sr * r, 0, Math.PI * 2); g.fill();
        });
      } else if (E.sol === "chapado") {
        g.fillStyle = C.sol[0]; g.beginPath(); g.arc(sx, sy, sr * 0.8, 0, Math.PI * 2); g.fill();
      } else {
        for (let y = -sr; y <= sr; y++) {
          const yy = sy + y; if (yy >= hy) break;
          const k = (y + sr) / (2 * sr);
          if (E.sol === "listrado" && k > 0.5) { const per = 6, faixa = Math.floor((k - 0.5) * 10) + 1; if (((yy - sy + Math.floor(tempo * 3)) % per + per) % per < Math.min(faixa, 4)) continue; }
          const meia = Math.floor(Math.sqrt(sr * sr - y * y));
          g.fillStyle = C.sol[Math.min(C.sol.length - 1, Math.floor(k * C.sol.length))];
          g.fillRect(sx - meia, yy, meia * 2, 1);
        }
      }
      g.restore();
      // nuvens
      if (E.nuvem) {
        const rn = semente(23);
        for (let i = 0; i < 7; i++) {
          const w = 20 + Math.floor(rn() * 50), y = Math.floor(hy * (0.25 + rn() * 0.6) * (E.nuvem === "elipse" ? 0.7 : 1));
          const x = Math.floor(((rn() * (W + 120) + tempo * (2 + i * 0.6) - fundoX * 0.2) % (W + 120) + (W + 120)) % (W + 120)) - 60;
          g.fillStyle = C.nuvem[i % C.nuvem.length];
          if (E.nuvem === "elipse") {
            g.beginPath(); g.ellipse(x + w / 2, y, w / 2, w / 7, 0, 0, Math.PI * 2); g.ellipse(x + w * 0.35, y - w / 9, w / 4, w / 6, 0, 0, Math.PI * 2); g.ellipse(x + w * 0.65, y - w / 12, w / 5, w / 7, 0, 0, Math.PI * 2); g.fill();
          } else { g.fillRect(x, y, w, 1); g.fillRect(x + 6, y + 1, w - 14, 1); }
        }
      }

      // cidade no horizonte (paralaxe lenta)
      const off = ((Math.floor(fundoX * 0.5) % 520) + 520) % 520;
      for (const p of predios) {
        for (const k of [-520, 0, 520]) {
          const x = p.x - off + k; if (x + p.w < 0 || x > W) continue;
          const perto = Math.max(0, 1 - Math.abs(x + p.w / 2 - sx) / (sr * 1.4));
          const h = Math.max(2, Math.round(p.h * (1 - perto * 0.85)));
          g.fillStyle = p.alt ? C.predio : C.predio2; g.fillRect(x, hy - h, p.w, h);
          if (E.suave) { g.fillStyle = "rgba(255,255,255,.28)"; g.fillRect(x, hy - h, p.w * 0.35, h); } // vidro com reflexo
          const rj = semente(p.j + 1);
          for (let jy = hy - h + 2; jy < hy - 2; jy += 3) for (let jx = x + 1; jx < x + p.w - 1; jx += 2) {
            const v = rj(); if (v > 0.82) { g.fillStyle = C.janela[Math.floor(v * 100) % 3]; g.fillRect(jx, jy, 1, 1); }
          }
        }
      }

      // chão e pista, linha a linha (projeção clássica dos jogos de corrida)
      const base = H - hy, meiaPista = W * (retrato ? 0.62 : 0.42);
      const centro = (p) => W / 2 + curva * (1 - p) * (1 - p) * W * 0.55 - curva * W * 0.05 * p;
      const passo = 1 / E.k; // em alta resolução, uma linha por pixel de verdade
      for (let y = hy; y < H; y += passo) {
        const p = (y - hy + 1) / base, z = 1 / p + camZ, seg = Math.floor(z * 0.9) & 1;
        const cx = centro(p), mp = meiaPista * p, zb = mp * 0.12;
        g.fillStyle = C.areia[seg]; g.fillRect(0, y, W, passo);
        g.fillStyle = C.zebra[seg]; g.fillRect(cx - mp - zb, y, mp * 2 + zb * 2, passo);
        g.fillStyle = C.pista[seg]; g.fillRect(cx - mp, y, mp * 2, passo);
        if (seg) { g.fillStyle = C.faixa; const fw = Math.max(1, mp * 0.03); g.fillRect(cx - fw / 2, y, fw, passo); }
      }
      if (C.nevoa) { g.fillStyle = C.nevoa; g.fillRect(0, hy, W, 2); }

      // palmeiras na beira da estrada, de trás pra frente
      for (const pm of palmeiras) { pm.d -= dt * vel; if (pm.d < 0.35) { pm.d += 14 * 2.2; pm.var = Math.random(); } }
      palmeiras.sort((a, b) => b.d - a.d);
      for (const pm of palmeiras) {
        const p = 1 / pm.d; if (p > 1.6) continue;
        const y = hy + p * base, x = centro(Math.min(p, 1)) + pm.lado * meiaPista * p * 1.45;
        palmeira(x, y, p * (retrato ? 70 : 80) * (0.85 + pm.var * 0.3), pm.lado);
      }

      // o Bel Air (montado num sprite e colado na cena; em alta resolução fica liso)
      const pula = Math.sin(tempo * 14) > 0.6 ? 1 : 0;
      gs.clearRect(0, 0, CW, CH + 4);
      gs.fillStyle = "#e3a4cf"; gs.fillRect(15, 11, 50, 1);
      gs.fillStyle = "#a2679f"; gs.fillRect(15, 12, 1, 7); gs.fillRect(64, 12, 1, 7);
      desenharCasal(gs, 0, 3, tempo);
      gs.drawImage(carro, 0, 4);
      const cxCarro = Math.round(W / 2 - CW / 2 - curva * 5), cyCarro = Math.round(H * (retrato ? 0.8 : celular ? 0.8 : 0.93)) - CH - pula - 4;
      g.drawImage(sprite, cxCarro, cyCarro);
      g.setTransform(1, 0, 0, 1, 0, 0);
    }
    return { cv, dimensionar, desenhar, estilo: nomeEstilo, set tempo(v) { tempo = v; } };
  }

  // ---------- o fundo de verdade ----------
  let cena = null, raf = 0, ultimo = 0;
  const celular = () => document.body.dataset.modo === "mobile";
  function loop(t) {
    raf = 0;
    if (!cena || !cena.cv.isConnected) return;
    const dt = Math.min(0.1, ultimo ? (t - ultimo) / 1000 : 0.016);
    // até ~30 quadros por segundo: o visual é de 16 bits, não precisa de mais
    if (ultimo && t - ultimo < 32) { raf = requestAnimationFrame(loop); return; }
    ultimo = t;
    // no celular, com um app aberto em tela cheia, a cena fica escondida: não desenha
    if (!document.querySelector(".phone.em-app")) cena.desenhar(dt);
    if (!reduzido && !document.hidden) raf = requestAnimationFrame(loop);
  }
  function ligar(estilo) {
    const wp = document.getElementById("wallpaper"); if (!wp) return;
    if (!cena || cena.estilo !== estilo) {
      if (cena) cena.cv.remove();
      cena = criarCena(estilo); cena.cv.className = "estrada-cv" + (ESTILOS[estilo] && ESTILOS[estilo].k > 1 ? " liso" : ""); cena.cv.setAttribute("aria-hidden", "true");
    }
    if (!cena.cv.isConnected) wp.appendChild(cena.cv);
    cena.dimensionar(innerWidth, innerHeight, celular());
    ultimo = 0;
    if (reduzido) { cena.tempo = 8; cena.desenhar(0); return; }
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function desligar() {
    if (raf) cancelAnimationFrame(raf); raf = 0;
    if (cena && cena.cv.isConnected) cena.cv.remove();
  }
  // um quadro parado, para a prévia no Painel de controle
  function quadro(estilo, w, h) {
    const c = criarCena(estilo); c.dimensionar(w, h, false); c.tempo = 8; c.desenhar(0); return c.cv;
  }

  ALU.estrada = { ligar, desligar, quadro };
  // se a pessoa liga ou desliga "reduzir movimento" com a página aberta
  const mudouMov = () => { reduzido = mqMov.matches; if (cena && cena.cv.isConnected) { if (raf) cancelAnimationFrame(raf); raf = 0; ligar(cena.estilo); } };
  mqMov.addEventListener ? mqMov.addEventListener("change", mudouMov) : mqMov.addListener(mudouMov);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && cena && cena.cv.isConnected && !reduzido && !raf) { ultimo = 0; raf = requestAnimationFrame(loop); } });
})();
