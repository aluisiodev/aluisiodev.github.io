// Ícones em pixel art, desenhados em código numa grade 16×16 e entregues como SVG nítido.
(function () {
  class Px {
    constructor(n = 16) { this.n = n; this.p = Array.from({ length: n }, () => Array(n).fill(null)); }
    px(x, y, c) { if (x >= 0 && y >= 0 && x < this.n && y < this.n) this.p[y][x] = c; return this; }
    rect(x, y, w, h, c) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.px(i, j, c); return this; }
    oval(cx, cy, rx, ry, c, f) { for (let y = 0; y < this.n; y++) for (let x = 0; x < this.n; x++) { const d = ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2; if (d <= 1 && (!f || f(x, y))) this.px(x, y, c); } return this; }
    grid(x0, y0, rows, pal) { rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== "." && pal[ch]) this.px(x0 + i, y0 + j, pal[ch]); })); return this; }
    has(x, y) { return x >= 0 && y >= 0 && x < this.n && y < this.n && this.p[y][x]; }
    outline(c) {
      const add = [];
      for (let y = 0; y < this.n; y++) for (let x = 0; x < this.n; x++)
        if (!this.p[y][x] && (this.has(x + 1, y) || this.has(x - 1, y) || this.has(x, y + 1) || this.has(x, y - 1))) add.push([x, y]);
      add.forEach(([x, y]) => this.px(x, y, c)); return this;
    }
    cantos(c = null) { const m = this.n - 1; [[0, 0], [m, 0], [0, m], [m, m]].forEach(([x, y]) => (this.p[y][x] = c)); return this; }
    svg() {
      let r = "";
      this.p.forEach((row, y) => { let x = 0; while (x < this.n) { const c = row[x]; if (!c) { x++; continue; } let w = 1; while (row[x + w] === c) w++; r += `<rect x="${x}" y="${y}" width="${w}" height="1" fill="${c}"/>`; x += w; } });
      return `<svg class="px" viewBox="0 0 ${this.n} ${this.n}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
    }
  }
  const K = "#1b1426";

  // pequenos "emblemas" 7×7 para as pastas
  const EMB = {
    sobre: (c) => c.grid(9, 8, ["..bbb..", ".bbbbb.", ".bsssb.", ".sksks.", "..sss..", ".rrrrr.", "rrrrrrr"], { b: "#2f6bff", s: "#ffe2c4", k: K, r: "#e0413a" }),
    projetos: (c) => c.grid(8, 9, [".k...k..", "k.....k.", ".k...k.."].map((r) => r), { k: "#2f2a57" }).grid(10, 8, ["....w", "...w.", "..w..", ".w...", "w...."], { w: "#2f2a57" }),
    contatos: (c) => c.grid(8, 9, ["kkkkkkkk", "kwkwwkwk", "kwwkkwwk", "kwwwwwwk", "kkkkkkkk"], { k: "#2f2a57", w: "#ffffff" }),
    skills: (c) => c.grid(9, 7, ["...y...", "...y...", "yyyyyyy", ".yyyyy.", "..yyy..", ".yy.yy.", ".y...y."], { y: "#ff8a00" }),
  };

  const D = {
    pasta(emb) {
      const c = new Px();
      c.rect(1, 3, 6, 2, "#f0b429").rect(1, 4, 14, 10, "#f7c948").rect(1, 5, 14, 1, "#fde68a").rect(1, 13, 14, 1, "#d69e2e");
      c.outline("#7a4f0b");
      if (emb && EMB[emb]) EMB[emb](c);
      return c;
    },
    notas() {
      const c = new Px();
      c.rect(3, 1, 10, 14, "#ffffff").rect(10, 1, 3, 3, null).grid(10, 1, ["k..", "kk.", "kkk"], { k: "#c9c9d6" });
      [4, 6, 8, 10, 12].forEach((y, i) => c.rect(5, y, i % 2 ? 6 : 5, 1, "#5b7bd5"));
      c.rect(3, 1, 1, 14, "#e8e8f0");
      return c.outline(K);
    },
    quarto() {
      const c = new Px();
      c.rect(1, 2, 14, 12, "#1e3a3a").rect(2, 3, 12, 10, "#2f5a58");
      c.rect(2, 10, 12, 3, "#6b4428").rect(3, 5, 4, 3, "#0b1033").px(5, 6, "#f7f1c6");
      c.rect(9, 5, 4, 3, "#0d1b2e").rect(10, 6, 2, 1, "#4fd1c5").rect(9, 8, 4, 1, "#8a5a34").px(4, 4, "#ffd166");
      c.rect(1, 1, 14, 1, "#8fd3ff").rect(1, 14, 14, 1, "#8fd3ff");
      return c.outline(K);
    },
    kez() {
      const c = new Px();
      c.oval(8, 8, 7.6, 7.6, "#ff9a3c").oval(8, 8, 7.6, 7.6, "#ffb85c", (x, y) => y > 5).oval(8, 8, 7.6, 7.6, "#ffd27f", (x, y) => y > 8);
      c.oval(11, 5, 2.2, 2.2, "#fff3b0");
      c.oval(8, 8, 7.6, 7.6, "#c89b3c", (x, y) => y > 11).oval(8, 8, 7.6, 7.6, "#a77f2c", (x, y) => y > 13);
      c.rect(5, 7, 1, 6, "#3b2414").rect(2, 5, 8, 1, "#3b2414").rect(3, 4, 6, 1, "#4b3018").px(4, 6, "#3b2414").px(7, 6, "#3b2414").px(6, 6, "#3b2414");
      c.rect(10, 10, 1, 3, "#3b2414").rect(9, 9, 3, 1, "#4b3018");
      return c.outline(K);
    },
    peep() {
      const c = new Px();
      c.oval(7, 10.5, 6, 4, "#9b6bff").oval(10.5, 5.5, 3.2, 3.2, "#9b6bff");
      c.oval(6.5, 10.5, 3.5, 2, "#7a45e6").rect(13, 5, 3, 2, "#ff9f1c").rect(13, 6, 2, 1, "#e07b00");
      c.px(11, 4, K).px(10, 4, "#ffffff").rect(1, 8, 2, 2, "#9b6bff").oval(7, 12.5, 5, 1.5, "#b893ff");
      return c.outline("#2b1060");
    },
    chat() {
      const c = new Px();
      c.oval(8, 8.5, 6.5, 6.5, "#18c3d6").oval(8, 9.5, 6, 5.5, "#0ea5b7", (x, y) => y > 11);
      c.rect(3, 6, 10, 3, "#ffd9b0").px(5, 7, K).px(6, 7, K).px(10, 7, K).px(11, 7, K).px(5, 6, "#ffffff").px(10, 6, "#ffffff");
      c.rect(2, 4, 12, 1, "#0b7285").rect(13, 3, 2, 1, "#0b7285").rect(14, 2, 2, 1, "#0b7285").rect(13, 5, 2, 1, "#0b7285");
      return c.outline(K);
    },
    doghub() {
      const c = new Px();
      c.rect(0, 0, 16, 16, "#24292f").cantos();
      const Y = "#f6b73c";
      c.oval(8, 7, 5, 4, Y).oval(8, 10, 6, 3, Y).rect(1, 6, 2, 6, Y).rect(13, 6, 2, 6, Y).rect(5, 12, 2, 3, Y).rect(9, 12, 2, 3, Y);
      c.px(6, 7, "#24292f").px(10, 7, "#24292f").rect(7, 9, 3, 1, "#24292f").px(8, 10, "#24292f");
      return c;
    },
    ligadin() {
      const c = new Px();
      c.rect(0, 0, 16, 16, "#1d6fd1").cantos().rect(1, 1, 14, 1, "#3d8ae6");
      c.grid(3, 4, ["w.....w..", "w........", "w.....w..", "w.....w..", "w.....w..", "w.....w..", "w.....w..", "wwwww.w.."], { w: "#ffffff" });
      c.grid(10, 9, ["kk.kk", "k.k.k", "kk.kk"], { k: "#bfe0ff" });
      return c;
    },
    pombo() {
      const c = new Px();
      c.rect(1, 3, 14, 10, "#ffffff");
      for (let i = 0; i < 14; i++) { c.px(1 + i, 3, i % 4 < 2 ? "#e0413a" : "#2f6bff"); c.px(1 + i, 12, i % 4 < 2 ? "#2f6bff" : "#e0413a"); }
      c.grid(2, 4, ["k..........k", ".k........k.", "..k......k..", "...kk..kk...", ".....kk....."], { k: "#9aa0b4" });
      return c.outline(K);
    },
    csharp() {
      const c = new Px();
      c.oval(8, 8, 7.6, 7.6, "#68217a").oval(8, 8, 7.6, 7.6, "#9b4f96", (x, y) => x + y < 13);
      c.grid(3, 5, [".www..w.w.", "w.....www.", "w.....w.w.", "w.....www.", ".www..w.w."], { w: "#ffffff" });
      return c.outline(K);
    },
    cert() {
      const c = new Px();
      c.rect(1, 2, 14, 10, "#fff4d6").rect(2, 3, 12, 8, "#fff9ea");
      [4, 6, 8].forEach((y) => c.rect(4, y, 7, 1, "#c8b68a"));
      c.oval(11.5, 11, 2.6, 2.6, "#e0413a").px(11, 10, "#ff8a7a").rect(10, 13, 1, 3, "#b3261e").rect(12, 13, 1, 3, "#b3261e");
      return c.outline(K);
    },
    terminal() {
      const c = new Px();
      c.rect(1, 2, 14, 12, "#2b2d42").rect(2, 4, 12, 9, "#0d0c14").rect(1, 2, 14, 2, "#5b5f80");
      c.grid(3, 6, ["g...", ".g..", "g..."], { g: "#5dff9c" }).rect(7, 8, 4, 1, "#5dff9c");
      return c.outline(K);
    },
    lixeira() {
      const c = new Px();
      c.rect(3, 4, 10, 11, "#b8c2cc").rect(2, 3, 12, 2, "#8796a5").rect(6, 1, 4, 2, "#8796a5");
      [5, 8, 11].forEach((x) => c.rect(x, 6, 1, 7, "#7a8896"));
      return c.outline(K);
    },
    ajustes() {
      const c = new Px();
      c.rect(1, 2, 14, 10, "#3a6fdc").rect(2, 3, 12, 8, "#9cc3ff").rect(6, 12, 4, 2, "#8796a5").rect(4, 14, 8, 1, "#8796a5");
      c.oval(8, 7, 3, 3, "#5b6475").px(8, 7, "#9cc3ff").px(7, 7, "#9cc3ff").rect(7, 3, 2, 1, "#5b6475").rect(7, 10, 2, 1, "#5b6475").rect(4, 6, 1, 2, "#5b6475").rect(11, 6, 1, 2, "#5b6475");
      return c.outline(K);
    },
    visitante() {
      const c = new Px();
      c.rect(0, 0, 16, 16, "#cfe3ff").oval(8, 6, 3.5, 3.5, "#8aa6cf").oval(8, 15, 6, 4.5, "#8aa6cf");
      c.grid(6, 4, [".kk.", "...k", "..k.", "....", "..k."], { k: "#ffffff" });
      return c;
    },
  };

  const cache = {};
  window.ALU = window.ALU || {};
  window.ALU.pix = function (nome) {
    if (cache[nome]) return cache[nome];
    const [base, arg] = nome.split(":");
    return (cache[nome] = D[base](arg).svg());
  };
})();
