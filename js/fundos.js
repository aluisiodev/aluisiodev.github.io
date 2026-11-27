// Papéis de parede que se adaptam ao tema. Cada fundo (Aurora, Savana, Noite, Céu, Metro e Estrada 57)
// é uma cena desenhada por código, e o tema decide o estilo do desenho:
//   pixel  (Pixel 2006):     baixa resolução, faixas de cor com pontilhado, ampliado sem suavizar
//                            (Aurora, Savana e Noite usam os PNGs originais em pixel art)
//   aero   (Frutiger Aero):  alta resolução, degradês lisos, brilho, reflexo e bolhas de vidro
//   metro  (Frutiger Metro): alta resolução, cores chapadas, formas retas, sem brilho nem sombra
//   retro  (Retrowave):      pixel art com a paleta do pôr do sol (violeta, magenta, laranja, turquesa)
// O desenho é feito uma vez (e de novo ao redimensionar, trocar de tema ou de cor); só a Estrada anima.
(function () {
  const ALU = window.ALU;
  const ESTILO_DO_TEMA = { pixel: "pixel", aero: "aero", metro: "metro", estrada: "retro" };
  const PNG = { "wp-aurora": 1, "wp-savana": 1, "wp-noite": 1 }; // no estilo pixel, os originais
  const ehPx = (st) => st === "pixel" || st === "retro";

  function semente(n) { let s = n; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
  const accent = () => (getComputedStyle(document.documentElement).getPropertyValue("--accent") || "#2f6bff").trim();
  function rgb(c) { const n = parseInt(c.replace("#", "").slice(0, 6), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
  function mix(c1, c2, t) { const a = rgb(c1), b = rgb(c2); return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join(""); }
  const rgba = (c, a) => `rgba(${rgb(c).join(",")},${a})`;

  // ---------- o pincel: as mesmas formas, desenhadas de jeitos diferentes por estilo ----------
  function pincel(g, W, H, st) {
    const px = ehPx(st), flat = st === "metro";
    const P = {
      W, H, st, g,
      // céu (ou qualquer faixa vertical de cores)
      ceu(cores, y0 = 0, y1 = H) {
        if (px) {
          const n = cores.length;
          for (let i = 0; i < n; i++) {
            const a = Math.floor(y0 + (y1 - y0) * i / n), b = Math.floor(y0 + (y1 - y0) * (i + 1) / n);
            g.fillStyle = cores[i]; g.fillRect(0, a, W, b - a + 1);
            if (i < n - 1) { g.fillStyle = cores[i + 1]; for (let x = b & 1; x < W; x += 2) g.fillRect(x, b - 1, 1, 1); for (let x = (b + 1) & 1; x < W; x += 4) g.fillRect(x, b - 2, 1, 1); }
          }
        } else if (flat) {
          const n = Math.min(3, cores.length), pick = n === 1 ? [cores[0]] : Array.from({ length: n }, (_, i) => cores[Math.round(i * (cores.length - 1) / (n - 1))]);
          pick.forEach((c, i) => { g.fillStyle = c; g.fillRect(0, y0 + (y1 - y0) * i / n, W, (y1 - y0) / n + 1); });
        } else {
          const gr = g.createLinearGradient(0, y0, 0, y1);
          cores.forEach((c, i) => gr.addColorStop(i / Math.max(1, cores.length - 1), c));
          g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0);
        }
      },
      // sol ou lua; op: { brilho, listras, lua (cor do céu para recortar a fase), corte (y máximo) }
      disco(x, y, r, cores, op = {}) {
        const corte = op.corte ?? H;
        g.save(); g.beginPath(); g.rect(0, 0, W, corte); g.clip();
        if (px) {
          for (let dy = -r; dy <= r; dy++) {
            const yy = Math.round(y + dy); const k = (dy + r) / (2 * r);
            if (op.listras && k > 0.55 && Math.floor((dy + r) / 3) % 2 === 0 && (dy + r) % 3 < 1 + Math.floor((k - 0.55) * 6)) continue;
            const m = Math.floor(Math.sqrt(r * r - dy * dy));
            g.fillStyle = cores[Math.min(cores.length - 1, Math.floor(k * cores.length))]; g.fillRect(Math.round(x - m), yy, m * 2, 1);
          }
          if (op.lua) { for (let dy = -r; dy <= r; dy++) { const m = Math.floor(Math.sqrt(r * r - dy * dy)); g.fillStyle = op.lua; g.fillRect(Math.round(x - m + r * 0.45), Math.round(y + dy - r * 0.15), m * 2, 1); } }
        } else if (flat) {
          g.fillStyle = cores[0]; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
          if (op.lua) { g.fillStyle = op.lua; g.beginPath(); g.arc(x + r * 0.45, y - r * 0.15, r, 0, Math.PI * 2); g.fill(); }
        } else {
          const brilho = op.brilho || cores[0];
          const gl = g.createRadialGradient(x, y, r * 0.5, x, y, r * 4);
          gl.addColorStop(0, rgba(brilho, 0.55)); gl.addColorStop(0.35, rgba(brilho, 0.18)); gl.addColorStop(1, rgba(brilho, 0));
          g.fillStyle = gl; g.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
          const gd = g.createLinearGradient(0, y - r, 0, y + r);
          cores.forEach((c, i) => gd.addColorStop(i / Math.max(1, cores.length - 1), c));
          g.fillStyle = gd; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
          if (op.lua) { g.fillStyle = op.lua; g.beginPath(); g.arc(x + r * 0.45, y - r * 0.15, r * 0.98, 0, Math.PI * 2); g.fill(); }
          // brilho de vidro no topo
          g.fillStyle = "rgba(255,255,255,.35)"; g.beginPath(); g.ellipse(x - r * 0.2, y - r * 0.45, r * 0.5, r * 0.28, -0.3, 0, Math.PI * 2); g.fill();
        }
        g.restore();
      },
      // colina: f(t) devolve a altura (0 a 1 da tela) para t de 0 a 1 na horizontal
      colina(f, cor, op = {}) {
        if (px) {
          for (let x = 0; x < W; x++) { const y = Math.round(f(x / W) * H); g.fillStyle = cor; g.fillRect(x, y, 1, H - y); if (op.borda) { g.fillStyle = op.borda; g.fillRect(x, y, 1, 1); } }
        } else if (flat) {
          g.fillStyle = cor; g.beginPath(); g.moveTo(0, H);
          for (let i = 0; i <= 6; i++) g.lineTo(W * i / 6, f(i / 6) * H);
          g.lineTo(W, H); g.fill();
        } else {
          g.beginPath(); g.moveTo(0, H);
          for (let i = 0; i <= 80; i++) g.lineTo(W * i / 80, f(i / 80) * H);
          g.lineTo(W, H); g.closePath();
          let topo = H; for (let i = 0; i <= 20; i++) topo = Math.min(topo, f(i / 20) * H);
          const gr = g.createLinearGradient(0, topo, 0, H); gr.addColorStop(0, op.claro || mix(cor, "#ffffff", 0.25)); gr.addColorStop(1, cor);
          g.fillStyle = gr; g.fill();
          g.save(); g.clip(); g.strokeStyle = op.aro || "rgba(255,255,255,.55)"; g.lineWidth = Math.max(1.5, H * 0.004);
          g.beginPath(); for (let i = 0; i <= 80; i++) g[i ? "lineTo" : "moveTo"](W * i / 80, f(i / 80) * H + 1); g.stroke(); g.restore();
        }
      },
      estrelas(n, yMax, cores, seed = 3) {
        const r = semente(seed);
        for (let i = 0; i < n; i++) {
          const x = r() * W, y = r() * yMax, v = r(), c = cores[Math.floor(v * cores.length)];
          if (px) { g.fillStyle = c; g.fillRect(Math.floor(x), Math.floor(y), 1, 1); }
          else if (flat) { if (v > 0.55) { const s = H * 0.004; g.fillStyle = c; g.fillRect(x, y, s, s); } }
          else { const s = H * (0.0012 + v * 0.0022); g.fillStyle = c; g.shadowColor = c; g.shadowBlur = s * 4; g.beginPath(); g.arc(x, y, s, 0, Math.PI * 2); g.fill(); g.shadowBlur = 0; }
        }
      },
      // acácia da savana: tronco fino e copa achatada
      acacia(x, y, s, cor) {
        g.fillStyle = cor;
        if (px) { const q = (a, b, w, h) => g.fillRect(Math.round(x + a * s), Math.round(y - b * s), Math.max(1, Math.round(w * s)), Math.max(1, Math.round(h * s))); q(-0.5, 10, 1, 10); q(-6, 12, 12, 2); q(-4, 13, 8, 1); q(1, 8, 3, 1); }
        else if (flat) { g.fillRect(x - 0.6 * s, y - 10 * s, 1.2 * s, 10 * s); g.beginPath(); g.moveTo(x - 7 * s, y - 10.5 * s); g.lineTo(x + 7 * s, y - 10.5 * s); g.lineTo(x + 4 * s, y - 13.5 * s); g.lineTo(x - 4 * s, y - 13.5 * s); g.fill(); }
        else { g.beginPath(); g.moveTo(x - 0.7 * s, y); g.lineTo(x - 0.3 * s, y - 11 * s); g.lineTo(x + 0.3 * s, y - 11 * s); g.lineTo(x + 0.7 * s, y); g.fill(); g.fillRect(x, y - 9 * s, 3 * s, 0.5 * s); g.beginPath(); g.ellipse(x, y - 11.6 * s, 7.5 * s, 1.1 * s, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(x - 0.5 * s, y - 12.5 * s, 5 * s, 0.9 * s, 0, 0, Math.PI * 2); g.fill(); }
      },
      // fita de aurora: f(t) dá o centro (0 a 1); esp em fração da altura
      fita(f, esp, cor, op = {}) {
        if (px) {
          for (let x = 0; x < W; x++) {
            const yc = f(x / W) * H, e = esp * H * (0.6 + 0.4 * Math.sin(x / W * 9 + (op.fase || 0)));
            g.fillStyle = cor; g.fillRect(x, Math.round(yc - e / 2), 1, Math.max(1, Math.round(e)));
            if (op.miolo) { g.fillStyle = op.miolo; g.fillRect(x, Math.round(yc - 0.5), 1, 1); }
          }
        } else if (flat) {
          g.fillStyle = cor; g.beginPath();
          for (let i = 0; i <= 8; i++) g.lineTo(W * i / 8, f(i / 8) * H - esp * H / 2);
          for (let i = 8; i >= 0; i--) g.lineTo(W * i / 8, f(i / 8) * H + esp * H / 2);
          g.fill();
        } else {
          g.save(); g.lineCap = "round"; g.lineJoin = "round";
          const path = () => { g.beginPath(); for (let i = 0; i <= 120; i++) g[i ? "lineTo" : "moveTo"](W * i / 120, f(i / 120) * H); };
          g.shadowColor = cor; g.shadowBlur = esp * H * 1.6; g.strokeStyle = rgba(cor, 0.55); g.lineWidth = esp * H; path(); g.stroke();
          g.shadowBlur = esp * H * 0.6; g.strokeStyle = rgba(op.miolo || "#ffffff", 0.9); g.lineWidth = esp * H * 0.22; path(); g.stroke();
          g.restore();
        }
      },
      // bolhas de vidro (o Aero tem em todo fundo)
      bolhas(lista, cor = "#ffffff") {
        for (const [bx, by, br] of lista) {
          const x = bx * W, y = by * H, r = br * Math.min(W, H);
          if (px) {
            for (let a = 0; a < 64; a++) { const t = a / 64 * Math.PI * 2; g.fillStyle = cor; g.fillRect(Math.round(x + Math.cos(t) * r), Math.round(y + Math.sin(t) * r), 1, 1); }
            g.fillStyle = cor; g.fillRect(Math.round(x - r * 0.45), Math.round(y - r * 0.5), Math.max(1, Math.round(r * 0.3)), 1);
          } else if (flat) {
            g.strokeStyle = rgba(cor, 0.5); g.lineWidth = Math.max(2, r * 0.08); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke();
          } else {
            const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x, y, r);
            gr.addColorStop(0, "rgba(255,255,255,.9)"); gr.addColorStop(0.3, "rgba(255,255,255,.2)"); gr.addColorStop(0.75, "rgba(170,225,255,.12)"); gr.addColorStop(1, "rgba(255,255,255,.55)");
            g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
            g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = Math.max(1, r * 0.03); g.stroke();
          }
        }
      },
      // reflexo de vidro do Aero por cima de tudo
      vidro() {
        if (st !== "aero") return;
        const gr = g.createRadialGradient(W * 0.5, -H * 0.2, 0, W * 0.5, -H * 0.2, H * 0.9);
        gr.addColorStop(0, "rgba(255,255,255,.35)"); gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
      },
    };
    return P;
  }
  const BOLHAS = [[0.18, 0.3, 0.05], [0.72, 0.2, 0.03], [0.85, 0.5, 0.07], [0.4, 0.64, 0.02], [0.6, 0.42, 0.015], [0.1, 0.7, 0.035]];
  const onda = (a, b, c, d) => (t) => a + Math.sin(t * Math.PI * 2 * b + c) * d;

  // ---------- as cenas ----------
  const CENAS = {
    "wp-aurora"(P) {
      const { st } = P;
      const pal = {
        aero: { ceu: ["#01081f", "#03163f", "#082f72", "#0f56b0", "#1e86e0"], fitas: ["#5ff3ff", "#7ab8ff", "#6dffd2"], est: ["#ffffff", "#bfe9ff"] },
        metro: { ceu: ["#0a1a3a", "#0f2a5c", "#14397c"], fitas: ["#00aba9", "#1ba1e2", "#8cbf26"], est: ["#ffffff"] },
        retro: { ceu: ["#1d0b3d", "#25104a", "#2c0f52", "#3a1360", "#47156b", "#5a1876", "#6c1a7e"], fitas: ["#3ff3dd", "#ff5fa2", "#ffbd5a"], est: ["#ffd6f0", "#a98ad8"] },
      }[st] || {};
      P.ceu(pal.ceu); P.estrelas(st === "metro" ? 60 : 160, P.H * 0.55, pal.est, 11);
      pal.fitas.forEach((c, i) => P.fita(onda(0.56 + i * 0.03, 1.3 - i * 0.2, i * 1.7, 0.07), 0.05 - i * 0.008, c, { miolo: st === "retro" ? "#fff1e6" : "#ffffff", fase: i * 2 }));
      if (st === "aero") { const gl = P.g.createRadialGradient(P.W * 0.6, P.H * 1.1, 0, P.W * 0.6, P.H * 1.1, P.H * 0.7); gl.addColorStop(0, "rgba(90,200,255,.6)"); gl.addColorStop(1, "rgba(90,200,255,0)"); P.g.fillStyle = gl; P.g.fillRect(0, 0, P.W, P.H); P.bolhas(BOLHAS); }
      if (st === "retro") P.colina(onda(0.86, 0.8, 0.5, 0.03), "#2c0f52", { borda: "#ff5fa2" });
      if (st === "metro") P.colina(onda(0.88, 0.7, 0.4, 0.03), "#0a1530");
      P.vidro();
    },
    "wp-savana"(P) {
      const { st, W, H } = P;
      const pal = {
        aero: { ceu: ["#3b1f7a", "#7a3f9c", "#d65f9c", "#ff9a5c", "#ffd27a"], sol: ["#fffbe6", "#ffe08a"], brilho: "#ffd27a", c1: "#7a3a6e", c2: "#3a1838", arv: "#2a1028" },
        metro: { ceu: ["#5c2d91", "#d24726", "#f0a30a"], sol: ["#fff4c2"], c1: "#3b1d56", c2: "#1d1d1d", arv: "#1d1d1d" },
        retro: { ceu: ["#1d0b3d", "#2c0f52", "#47156b", "#6c1a7e", "#97228a", "#c42f8c", "#e8458a", "#ff5f7e", "#ff7f6a", "#ff9e5c"], sol: ["#fff3a8", "#ffe27a", "#ffc65e", "#ffa35a", "#ff7f64", "#ff5f7e"], c1: "#541a72", c2: "#2a0d3e", arv: "#1d0b3d" },
      }[st] || {};
      const hz = 0.7;
      P.ceu(pal.ceu, 0, H * hz + 2);
      P.disco(W * 0.7, H * 0.6, Math.min(H, W * 0.9) * 0.14, pal.sol, { brilho: pal.brilho, listras: st === "retro", corte: H * 0.69 });
      P.colina(onda(0.68, 1.1, 0.3, 0.025), pal.c1, { borda: st === "retro" ? "#ff5fa2" : null });
      P.colina(onda(0.8, 0.7, 2.1, 0.03), pal.c2);
      if (st === "retro") { // grade neon no chão, bem anos 80
        P.g.fillStyle = "#ff3f8e";
        for (let i = 1; i < 7; i++) { const y = Math.round(H * (0.82 + Math.pow(i / 7, 2) * 0.18)); P.g.fillRect(0, y, W, 1); }
        for (let i = -12; i <= 12; i++) for (let y = Math.round(H * 0.82); y < H; y++) { const t = (y - H * 0.82) / (H * 0.18); P.g.fillRect(Math.round(W / 2 + i * W * 0.04 * (0.4 + t * 2.6)), y, 1, 1); }
      }
      const s = Math.min(H, W * 0.9) / 90;
      P.acacia(W * 0.24, H * 0.665, s * 1.2, pal.arv); P.acacia(W * 0.86, H * 0.71, s * 0.8, pal.arv); P.acacia(W * 0.1, H * 0.7, s * 0.6, pal.arv);
      if (st === "aero") P.bolhas(BOLHAS.slice(0, 4));
      P.vidro();
    },
    "wp-noite"(P) {
      const { st, W, H } = P;
      const pal = {
        aero: { ceu: ["#010616", "#04113a", "#0a2463", "#123a8a"], lua: ["#fffbea", "#ffe9b0"], brilho: "#fff1c4", corte: "#0a2463", c1: "#0b3157", c2: "#061a33", est: ["#ffffff", "#cfe8ff"] },
        metro: { ceu: ["#0b1a33", "#10264a"], lua: ["#f5f0e1"], corte: "#0b1a33", c1: "#0f2f2a", c2: "#081c18", est: ["#ffffff"] },
        retro: { ceu: ["#12082a", "#1d0b3d", "#2c0f52", "#3a1360", "#47156b"], lua: ["#ffe6f6", "#ffc2e4"], corte: "#1d0b3d", c1: "#16585a", c2: "#0d3b44", est: ["#ffd6f0", "#a98ad8", "#3ff3dd"] },
      }[st] || {};
      P.ceu(pal.ceu); P.estrelas(st === "metro" ? 90 : 220, H * 0.7, pal.est, 5);
      P.disco(W * 0.22, H * 0.22, Math.min(H, W * 0.9) * 0.065, pal.lua, { brilho: pal.brilho, lua: pal.corte });
      if (st === "aero") { P.fita(onda(0.38, 0.9, 1, 0.05), 0.03, "#5ff3ff"); }
      P.colina(onda(0.74, 0.6, 1.2, 0.04), pal.c1, { aro: "rgba(150,200,255,.35)" });
      P.colina(onda(0.84, 0.9, 3.0, 0.025), pal.c2, { aro: "rgba(150,200,255,.25)" });
      if (st === "aero") P.bolhas(BOLHAS.slice(2, 5));
      P.vidro();
    },
    "wp-aero"(P) {
      const { st, W, H, g } = P;
      const pal = {
        pixel: { ceu: ["#1f5fc4", "#2b75d6", "#3f8ce2", "#5ea4ea", "#82bbf0", "#a9d3f6", "#cfe7fb"], sol: ["#ffffff", "#fff6d0"], c1: "#8fdc5c", c2: "#5fb83c", borda: "#c8f59a", nuvem: "#ffffff", bolha: "#ffffff" },
        aero: { ceu: ["#2b9be8", "#6cc6f5", "#bfe9ff", "#e9fbff"], sol: ["#ffffff", "#fff8d6"], c1: "#7ed957", c2: "#3fae3a" },
        metro: { ceu: ["#1ba1e2"], sol: ["#ffffff"], c1: "#8cbf26", c2: "#339933" },
        retro: { ceu: ["#6c1a7e", "#97228a", "#c42f8c", "#e8458a", "#ff5f7e", "#ff7f6a", "#ff9e5c", "#ffbd5a"], sol: ["#fff3a8", "#ffd36b"], c1: "#2ec4b6", c2: "#168a80", borda: "#a6fff3", nuvem: "#ff9fc6", bolha: "#ffd6f0" },
      }[st];
      P.ceu(pal.ceu, 0, H);
      P.disco(W * 0.22, H * 0.2, Math.min(H, W * 0.9) * 0.06, pal.sol, { brilho: "#ffffff" });
      const amp = Math.min(1, (W / H) * 1.1); // em pé, a colina fica mais baixa
      if (ehPx(st)) { // nuvens em blocos
        const r = semente(9);
        for (let i = 0; i < 5; i++) { const x = r() * W, y = H * (0.12 + r() * 0.3), w = 18 + r() * 30; g.fillStyle = pal.nuvem; g.fillRect(Math.round(x), Math.round(y), Math.round(w), 3); g.fillRect(Math.round(x + w * 0.2), Math.round(y - 2), Math.round(w * 0.45), 2); g.fillRect(Math.round(x + w * 0.5), Math.round(y - 4), Math.round(w * 0.25), 2); }
      } else if (st === "aero") {
        const gl = g.createRadialGradient(W / 2, 0, 0, W / 2, 0, H * 0.8); gl.addColorStop(0, "rgba(232,248,255,.9)"); gl.addColorStop(1, "rgba(232,248,255,0)"); g.fillStyle = gl; g.fillRect(0, 0, W, H);
      }
      P.colina((t) => 0.9 - Math.sin(t * Math.PI) * 0.28 * amp, pal.c1, { borda: pal.borda, claro: "#b8f28a" });
      P.colina((t) => 0.96 - Math.sin((t + 0.35) * Math.PI * 1.2) * 0.12 * amp, pal.c2, { borda: pal.borda });
      P.bolhas(BOLHAS, pal.bolha);
      P.vidro();
    },
    "wp-metro"(P) {
      const { st, W, H, g } = P;
      const a = accent();
      if (st === "retro") {
        P.ceu(["#1d0b3d", "#47156b", "#97228a", "#e8458a", "#ff7f6a", "#ffbd5a"]);
      } else if (st === "pixel") {
        P.ceu([mix(a, "#000", 0.45), mix(a, "#000", 0.3), mix(a, "#000", 0.15), a, mix(a, "#fff", 0.15), mix(a, "#fff", 0.3)]);
      } else if (st === "metro") {
        g.fillStyle = a; g.fillRect(0, 0, W, H);
      } else {
        const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, mix(a, "#000", 0.35)); gr.addColorStop(0.6, a); gr.addColorStop(1, mix(a, "#fff", 0.35)); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      }
      // faixas diagonais
      const faixas = [[0.58, 0.7, 0.08], [0.74, 0.82, 0.06], [0.3, 0.36, 0.05]];
      for (const [x0, x1, al] of faixas) {
        const cor = st === "retro" ? (x0 > 0.5 ? "#3ff3dd" : "#ff5fa2") : "#ffffff";
        const op = st === "retro" ? 0.35 : st === "aero" ? al * 2.2 : al;
        if (ehPx(st)) { // em degraus de pixel
          g.fillStyle = rgba(cor, op);
          for (let y = 0; y < H; y += 2) { const d = (H - y) * 0.47; g.fillRect(Math.round(W * x0 - d + H * 0.3), y, Math.round(W * (x1 - x0)), 2); }
        } else {
          g.fillStyle = st === "aero" ? (() => { const gr = g.createLinearGradient(W * x0, 0, W * x1, 0); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.5, `rgba(255,255,255,${op})`); gr.addColorStop(1, "rgba(255,255,255,0)"); return gr; })() : rgba(cor, op);
          g.beginPath(); g.moveTo(W * x0 + H * 0.3, 0); g.lineTo(W * x1 + H * 0.3, 0); g.lineTo(W * x1 + H * 0.3 - H * 0.47, H); g.lineTo(W * x0 + H * 0.3 - H * 0.47, H); g.fill();
        }
      }
      if (st === "aero") P.bolhas(BOLHAS);
      if (st === "retro") P.disco(W * 0.8, H * 0.3, Math.min(H, W * 0.9) * 0.09, ["#fff3a8", "#ffc65e", "#ff7f64", "#ff5f7e"], { listras: true });
      P.vidro();
    },
  };

  // ---------- render ----------
  // tamanho de desenho: baixa resolução nos estilos de pixel, tela inteira nos outros
  function medidas(st, vw, vh) {
    if (ehPx(st)) { const H = vw < vh ? 300 : 200; return { W: Math.max(120, Math.round(H * vw / vh)), H, k: 1 }; }
    const k = Math.min(2, window.devicePixelRatio || 1);
    const esc = Math.min(1, 2400 / (vw * k));
    return { W: vw, H: vh, k: k * esc };
  }
  function pintar(cv, cena, st, vw, vh) {
    const m = medidas(st, vw, vh);
    cv.width = Math.round(m.W * m.k); cv.height = Math.round(m.H * m.k);
    const g = cv.getContext("2d"); g.setTransform(m.k, 0, 0, m.k, 0, 0); g.imageSmoothingEnabled = true;
    CENAS[cena](pincel(g, m.W, m.H, st));
    cv.classList.toggle("liso", !ehPx(st));
  }

  let cv = null;
  const estiloAtual = () => ESTILO_DO_TEMA[document.documentElement.dataset.tema] || "pixel";
  function aplicar() {
    const wp = document.getElementById("wallpaper"); if (!wp) return;
    const cena = document.documentElement.dataset.wall, st = estiloAtual();
    document.documentElement.dataset.estiloFundo = st;
    if (cena === "wp-estrada") { if (cv) cv.remove(); ALU.estrada && ALU.estrada.ligar(st); return; }
    ALU.estrada && ALU.estrada.desligar();
    if (!CENAS[cena] || (st === "pixel" && PNG[cena])) { if (cv) cv.remove(); return; } // o PNG do CSS aparece
    if (!cv) { cv = document.createElement("canvas"); cv.className = "fundo-cv"; cv.setAttribute("aria-hidden", "true"); }
    pintar(cv, cena, st, innerWidth, innerHeight);
    if (!cv.isConnected) wp.appendChild(cv);
  }

  // prévias do Painel de controle no estilo do tema ativo
  const cache = {};
  function previa(cena, st) {
    const chave = cena + "|" + st + "|" + (st === "metro" || cena === "wp-metro" ? accent() : "");
    if (cache[chave] !== undefined) return cache[chave];
    let url = null;
    if (cena === "wp-estrada" && ALU.estrada) {
      const c = ALU.estrada.quadro(st, 320, 180), o = document.createElement("canvas"); o.width = 192; o.height = 108;
      const og = o.getContext("2d"); og.imageSmoothingEnabled = !ehPx(st); og.drawImage(c, 0, 0, 192, 108); url = o.toDataURL();
    } else if (CENAS[cena] && !(st === "pixel" && PNG[cena])) {
      const c = document.createElement("canvas");
      if (ehPx(st)) { c.width = 160; c.height = 90; const g = c.getContext("2d"); CENAS[cena](pincel(g, 160, 90, st)); }
      else { c.width = 384; c.height = 216; const g = c.getContext("2d"); g.setTransform(2, 0, 0, 2, 0, 0); CENAS[cena](pincel(g, 192, 108, st)); }
      url = c.toDataURL();
    }
    return (cache[chave] = url);
  }
  function previas(el) {
    const st = estiloAtual();
    el.querySelectorAll(".wall-opt").forEach((b) => {
      const w = ALU.WALLPAPERS[+b.dataset.w], sp = b.querySelector(".wall-prev"); if (!w || !sp) return;
      const url = previa(w.cls, st);
      // "important" porque os fundos do Aero, Metro e Estrada têm um degradê de reserva com !important no CSS
      if (url) sp.style.setProperty("background", `url(${url}) center / cover no-repeat`, "important"); else sp.style.removeProperty("background");
      sp.style.imageRendering = ehPx(st) ? "pixelated" : "auto";
    });
  }

  ALU.fundos = { aplicar, previas, estiloAtual };
  new MutationObserver(aplicar).observe(document.documentElement, { attributes: true, attributeFilter: ["data-wall", "data-tema"] });
  // a cor das janelas entra no Metro: redesenha quando ela muda
  let ultimaCor = null;
  new MutationObserver(() => { const a = accent(); if (a !== ultimaCor) { ultimaCor = a; aplicar(); } }).observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
  document.addEventListener("DOMContentLoaded", aplicar);
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(aplicar, 150); });
})();
