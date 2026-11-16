// Joguinhos do clicajogos. Cada jogo desenha numa área e devolve uma função de limpeza.
(function () {
  const ALU = window.ALU;
  const conq = (...a) => ALU.conquista && ALU.conquista(...a);
  const ls = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
  const EN = ALU.lang === "en", T = (pt, en) => (EN ? en : pt);
  const ativo = (el) => { const w = el.closest(".win"); return el.isConnected && (!w || w.classList.contains("focus")); };

  // ---------------- Cobrinha ----------------
  function cobrinha(area) {
    const N = 20, S = 18;
    area.innerHTML = `<div class="jg-hud"><span>${T("Pontos", "Score")}: <b class="pt">0</b></span><span>${T("Recorde", "Best")}: <b class="rc">${ls.get("alu.cobrinha", 0)}</b></span><button class="btn jg-go">${T("Jogar", "Play")}</button></div>
      <canvas width="${N * S}" height="${N * S}" class="jg-canvas"></canvas><p class="muted">${T("Setas ou WASD. No celular, toque nas bordas.", "Arrow keys or WASD. On mobile, tap the edges.")}</p>`;
    const cv = area.querySelector("canvas"), g = cv.getContext("2d");
    let cobra, dir, prox, fruta, pts, timer = null, vivo = false;
    const novaFruta = () => { do { fruta = [Math.floor(Math.random() * N), Math.floor(Math.random() * N)]; } while (cobra.some(([x, y]) => x === fruta[0] && y === fruta[1])); };
    function desenhar() {
      g.fillStyle = "#12301a"; g.fillRect(0, 0, cv.width, cv.height);
      g.fillStyle = "#1a4024"; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if ((i + j) % 2) g.fillRect(i * S, j * S, S, S);
      g.fillStyle = "#ff4d6d"; g.fillRect(fruta[0] * S + 3, fruta[1] * S + 3, S - 6, S - 6);
      cobra.forEach(([x, y], i) => { g.fillStyle = i ? "#7ee081" : "#c6ff9e"; g.fillRect(x * S + 1, y * S + 1, S - 2, S - 2); });
    }
    function tick() {
      dir = prox;
      const [hx, hy] = cobra[0]; const nx = hx + dir[0], ny = hy + dir[1];
      if (nx < 0 || ny < 0 || nx >= N || ny >= N || cobra.some(([x, y]) => x === nx && y === ny)) return fim();
      cobra.unshift([nx, ny]);
      if (nx === fruta[0] && ny === fruta[1]) { pts++; area.querySelector(".pt").textContent = pts; novaFruta(); if (pts === 15) conq("cobra15", T("Cobra criada", "Snake charmer"), T("Fez 15 pontos na Cobrinha.", "Scored 15 in Snake.")); }
      else cobra.pop();
      desenhar();
    }
    function fim() {
      clearInterval(timer); timer = null; vivo = false;
      if (pts > ls.get("alu.cobrinha", 0)) { ls.set("alu.cobrinha", pts); area.querySelector(".rc").textContent = pts; }
      g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(0, 0, cv.width, cv.height);
      g.fillStyle = "#fff"; g.font = "28px 'Pixelify Sans', monospace"; g.textAlign = "center"; g.fillText(T("fim de jogo", "game over"), cv.width / 2, cv.height / 2);
    }
    function iniciar() { cobra = [[10, 10], [9, 10], [8, 10]]; dir = prox = [1, 0]; pts = 0; area.querySelector(".pt").textContent = 0; novaFruta(); desenhar(); clearInterval(timer); timer = setInterval(tick, 110); vivo = true; }
    const K = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] };
    const tecla = (e) => { if (!vivo || !ativo(area)) return; const k = K[e.key]; if (k && !(k[0] === -dir[0] && k[1] === -dir[1])) { prox = k; e.preventDefault(); } };
    document.addEventListener("keydown", tecla);
    cv.addEventListener("pointerdown", (e) => {
      if (!vivo) return; const r = cv.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      const k = Math.abs(x) > Math.abs(y) ? [Math.sign(x), 0] : [0, Math.sign(y)]; if (!(k[0] === -dir[0] && k[1] === -dir[1])) prox = k;
    });
    area.querySelector(".jg-go").onclick = iniciar;
    cobra = [[10, 10]]; fruta = [14, 10]; desenhar();
    return () => { clearInterval(timer); document.removeEventListener("keydown", tecla); };
  }

  // ---------------- Jogo da velha ----------------
  function velha(area) {
    area.innerHTML = `<div class="jg-hud"><span class="msg">Sua vez (X)</span><span>Você <b class="v">0</b> × <b class="p">0</b> Pato · Velha <b class="e">0</b></span><button class="btn jg-go">Recomeçar</button></div><div class="velha"></div>`;
    const tab = area.querySelector(".velha"), msg = area.querySelector(".msg");
    const placar = { v: 0, p: 0, e: 0 };
    const L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    let b, fim;
    const ganhou = (q, s) => L.some((l) => l.every((i) => q[i] === s));
    function cpu() {
      const vazios = b.map((v, i) => (v ? null : i)).filter((i) => i !== null);
      for (const s of ["O", "X"]) for (const i of vazios) { const q = b.slice(); q[i] = s; if (ganhou(q, s)) return i; }
      if (!b[4]) return 4;
      if (Math.random() < 0.25) return vazios[Math.floor(Math.random() * vazios.length)];
      const cantos = [0, 2, 6, 8].filter((i) => !b[i]); if (cantos.length) return cantos[Math.floor(Math.random() * cantos.length)];
      return vazios[0];
    }
    function checar() {
      if (ganhou(b, "X")) { fim = true; placar.v++; msg.textContent = "Você venceu! 🎉"; conq("velha", "Mais esperto que o pato", "Venceu o pato no jogo da velha."); }
      else if (ganhou(b, "O")) { fim = true; placar.p++; msg.textContent = "O pato venceu. quack."; }
      else if (b.every(Boolean)) { fim = true; placar.e++; msg.textContent = "Deu velha."; }
      area.querySelector(".v").textContent = placar.v; area.querySelector(".p").textContent = placar.p; area.querySelector(".e").textContent = placar.e;
    }
    function desenhar() { tab.innerHTML = b.map((v, i) => `<button data-i="${i}" class="${v || ""}">${v === "O" ? "🦆" : v || ""}</button>`).join(""); tab.querySelectorAll("button").forEach((x) => (x.onclick = () => jogar(+x.dataset.i))); }
    function jogar(i) {
      if (fim || b[i]) return; b[i] = "X"; checar(); desenhar(); if (fim) return;
      msg.textContent = "O pato está pensando…";
      setTimeout(() => { if (fim) return; b[cpu()] = "O"; checar(); desenhar(); if (!fim) msg.textContent = "Sua vez (X)"; }, 400);
    }
    function novo() { b = Array(9).fill(null); fim = false; msg.textContent = "Sua vez (X)"; desenhar(); }
    area.querySelector(".jg-go").onclick = novo; novo();
    return () => {};
  }

  // ---------------- Pato Clicker ----------------
  function pato(area) {
    const st = ls.get("alu.pato", { q: 0, ups: { pao: 0, lago: 0, dev: 0 } });
    const UPS = [["pao", T("Pão velho", "Stale bread"), 15, 0.2], ["lago", T("Laguinho", "Little pond"), 120, 2], ["dev", T("Pato dev sênior", "Senior dev duck"), 900, 12]];
    area.innerHTML = `<div class="pato-jogo"><div><div class="pato-q"><b>0</b> quacks</div><small class="pato-ps">0 ${T("por segundo", "per second")}</small>
      <button class="pato-btn" aria-label="${T("Clique no pato", "Click the duck")}">${ALU.pix("peep")}</button></div><div class="pato-loja"><h3>${T("Loja", "Shop")}</h3></div></div>`;
    const qEl = area.querySelector(".pato-q b"), psEl = area.querySelector(".pato-ps"), loja = area.querySelector(".pato-loja"), btn = area.querySelector(".pato-btn");
    const custo = (u) => Math.ceil(u[2] * Math.pow(1.15, st.ups[u[0]]));
    const ps = () => UPS.reduce((a, u) => a + st.ups[u[0]] * u[3], 0);
    function pintar() {
      qEl.textContent = Math.floor(st.q); psEl.textContent = ps().toFixed(1) + T(" por segundo", " per second");
      loja.querySelectorAll("button").forEach((b) => { const u = UPS.find((x) => x[0] === b.dataset.u); b.disabled = st.q < custo(u); b.querySelector("small").textContent = `${custo(u)} quacks · ${T("você tem", "you have")} ${st.ups[u[0]]}`; });
    }
    loja.insertAdjacentHTML("beforeend", UPS.map((u) => `<button class="btn" data-u="${u[0]}"><span>${u[1]} (+${u[3]}/s)</span><small></small></button>`).join(""));
    loja.querySelectorAll("button").forEach((b) => (b.onclick = () => { const u = UPS.find((x) => x[0] === b.dataset.u); if (st.q >= custo(u)) { st.q -= custo(u); st.ups[u[0]]++; pintar(); } }));
    btn.onclick = (e) => {
      st.q += 1; ALU.bip && ALU.bip("tec"); pintar();
      const f = document.createElement("span"); f.className = "pato-fx"; f.textContent = "quack!"; f.style.left = e.offsetX + "px"; f.style.top = e.offsetY + "px"; btn.appendChild(f); setTimeout(() => f.remove(), 700);
      if (st.q >= 100) conq("pato100", T("Criador de patos", "Duck breeder"), T("Juntou 100 quacks no Pato Clicker.", "Collected 100 quacks in Pato Clicker."));
    };
    // os patos trabalham mesmo com o site fechado: ao voltar, soma o tempo que passou (até 7 dias)
    const agora = Date.now();
    if (st.t && ps() > 0) {
      const seg = Math.min(7 * 86400, Math.max(0, (agora - st.t) / 1000)), ganho = Math.floor(ps() * seg);
      if (ganho > 0) {
        st.q += ganho;
        const h = seg >= 3600 ? Math.floor(seg / 3600) + "h " : "", m = Math.floor((seg % 3600) / 60);
        area.querySelector(".pato-jogo > div").insertAdjacentHTML("beforeend", T(`<p class="pato-off">Enquanto você estava fora (${h}${m}min) seus patos fizeram <b>+${ganho.toLocaleString("pt-BR")}</b> quacks 🦆</p>`, `<p class="pato-off">While you were away (${h}${m}min) your ducks made <b>+${ganho.toLocaleString("en-US")}</b> quacks 🦆</p>`));
      }
    }
    st.t = agora;
    let ult = agora;
    const t = setInterval(() => { const n = Date.now(); st.q += ps() * (n - ult) / 1000; ult = n; st.t = n; pintar(); ls.set("alu.pato", st); }, 250);
    pintar(); ls.set("alu.pato", st);
    return () => { clearInterval(t); st.t = Date.now(); ls.set("alu.pato", st); };
  }

  // ---------------- Memória ----------------
  function memoria(area) {
    const ICS = ["kez", "peep", "chat", "doghub", "ligadin", "csharp", "terminal", "quarto"];
    area.innerHTML = `<div class="jg-hud"><span>${T("Jogadas", "Moves")}: <b class="j">0</b></span><span class="msg"></span><button class="btn jg-go">${T("Embaralhar", "Shuffle")}</button></div><div class="mem"></div>`;
    const tab = area.querySelector(".mem");
    let cartas, abertas, jog, ok, trava;
    function novo() {
      cartas = [...ICS, ...ICS].map((v) => ({ v, r: Math.random() })).sort((a, b) => a.r - b.r).map((c) => c.v);
      abertas = []; ok = new Set(); jog = 0; trava = false; area.querySelector(".j").textContent = 0; area.querySelector(".msg").textContent = "";
      tab.innerHTML = cartas.map((v, i) => `<button data-i="${i}"><span class="frente">${ALU.pix(v)}</span><span class="verso">?</span></button>`).join("");
      tab.querySelectorAll("button").forEach((b) => (b.onclick = () => virar(+b.dataset.i, b)));
    }
    function virar(i, b) {
      if (trava || ok.has(i) || abertas.includes(i)) return;
      b.classList.add("on"); abertas.push(i);
      if (abertas.length < 2) return;
      jog++; area.querySelector(".j").textContent = jog;
      const [a, c] = abertas;
      if (cartas[a] === cartas[c]) { ok.add(a); ok.add(c); abertas = []; if (ok.size === cartas.length) { area.querySelector(".msg").textContent = T(`Venceu em ${jog} jogadas!`, `Won in ${jog} moves!`); conq("memoria", T("Memória de elefante", "Elephant memory"), T("Completou a Memória da savana.", "Completed Savanna Memory.")); } }
      else { trava = true; setTimeout(() => { abertas.forEach((k) => tab.children[k].classList.remove("on")); abertas = []; trava = false; }, 700); }
    }
    area.querySelector(".jg-go").onclick = novo; novo();
    return () => {};
  }

  ALU.JOGOS = { cobrinha, velha, pato, memoria };
})();
