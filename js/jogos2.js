// Mais jogos do clicajogos: Jogo da velha contra Zizi, Pato Voador, Plantão Noturno e Batalha de Ritmo.
// Tudo desenhado em pixel art no canvas. Recordes ficam salvos no navegador.
(function () {
  const ALU = window.ALU;
  const conq = (...a) => ALU.conquista && ALU.conquista(...a);
  const ls = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
  const ativo = (el) => { const w = el.closest(".win"); return el.isConnected && (!w || w.classList.contains("focus")); };
  const um = (a) => a[Math.floor(Math.random() * a.length)];
  const FONTE = "'Pixelify Sans', monospace";

  // ---------- som simples ----------
  let ac = null;
  function tom(f, dur = 0.1, tipo = "square", vol = 0.05, quando = 0) {
    try {
      if (localStorage.getItem("alu.mudo") === "1") return;
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = ac.currentTime + quando, o = ac.createOscillator(), g = ac.createGain();
      o.type = tipo; o.frequency.value = f; g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g).connect(ac.destination); o.start(t0); o.stop(t0 + dur + 0.02);
    } catch {}
  }

  // ---------- ranking (compartilhado por velha, voador e ritmo) ----------
  // A pessoa escolhe o nome que quiser e publica a melhor marca dela. Do lado aparece o top 10.
  function ranking(caixa, jogo, rotulo, minhaMarca) {
    const esc = (s) => ALU.esc(s);
    caixa.innerHTML = `<div class="rk"><h4>🏆 Ranking · ${esc(rotulo)}</h4>
      <form class="rk-form"><input class="rk-nome" maxlength="20" placeholder="Seu nome no ranking" value="${esc(ls.get("alu.rk.nome", ""))}" aria-label="Seu nome no ranking"><button class="btn">Publicar <b class="rk-m">0</b></button></form>
      <ol class="rk-lista"><li class="muted">carregando…</li></ol>
      <small class="muted rk-aviso">${ALU.api && ALU.api.online() ? "Ranking de todo mundo que jogou." : "Ranking deste navegador (o global liga quando o servidor estiver no ar)."}</small></div>`;
    const lista = caixa.querySelector(".rk-lista"), m = caixa.querySelector(".rk-m"), nome = caixa.querySelector(".rk-nome");
    const pintar = (r) => { const eu = nome.value.trim().toLowerCase(); lista.innerHTML = (r || []).slice(0, 10).map((x, i) => `<li class="${x.nome.toLowerCase() === eu ? "eu" : ""}"><span>${["🥇", "🥈", "🥉"][i] || i + 1 + "."}</span><b>${esc(x.nome)}</b><i>${x.pontos}</i></li>`).join("") || '<li class="muted">Ninguém ainda. Seja o primeiro!</li>'; };
    const atualizar = () => { m.textContent = minhaMarca(); };
    caixa.querySelector(".rk-form").onsubmit = async (e) => {
      e.preventDefault();
      const n = nome.value.trim().slice(0, 20);
      if (!n) { nome.focus(); nome.placeholder = "Escreva um nome primeiro 🙂"; return; }
      ls.set("alu.rk.nome", n);
      if (!ALU.api) return;
      pintar(await ALU.api.enviarRanking(jogo, n, minhaMarca()));
    };
    if (ALU.api) ALU.api.ranking(jogo).then(pintar); else pintar([]);
    atualizar();
    return atualizar;
  }

  // =================== Jogo da velha contra Zizi ===================
  const FALAS = {
    inicio: ["Pode começar. Eu deixo. 😏", "Você é X. Eu sou a estrela. ⭐", "Já perdeu e nem sabe ainda.", "Respira fundo. Vai precisar."],
    jogador: ["Hmm… corajoso.", "Essa jogada aí? Sério?", "Tô vendo tudo daqui. 👀", "Interessante… pra um iniciante.", "Você tá suando? Parece.", "Vou fingir que não vi isso.", "Tá jogando de olho fechado?"],
    zizi: ["Toma essa. ⭐", "Calculado.", "Sua vez. Sem pressão. (muita pressão)", "Eu já vi esse final.", "Isso foi só o aquecimento."],
    quase: ["Opa, opa, opa! Quase.", "Tá esquentando hein…", "Achou que eu não ia ver?"],
    vacilo: ["Ops. Isso foi de propósito. Acho.", "Deixa eu ver… não, peraí…", "Eu tava olhando o relógio, não vale."],
    ziziVence: ["GG fácil. 😎", "Quer revanche? Vai perder de novo.", "Eu avisei.", "Mais sorte da próxima. Você vai precisar."],
    jogadorVence: ["Não… impossível!", "Foi sorte. Pura sorte.", "Ok, você venceu. Dessa vez.", "Vou contar pra ninguém."],
    velha: ["Empate. Respeito… um pouquinho.", "Deu velha. Que nem você. Brincadeira!", "Ninguém ganha. Que sem graça."],
  };
  function velha(area) {
    const pl = ls.get("alu.velha", { v: 0, z: 0, e: 0 });
    area.innerHTML = `<div class="zv">
      <div class="zv-lado"><div class="zv-zizi">${ALU.ziziSVG ? ALU.ziziSVG() : ""}</div><div class="zv-balao"><p></p></div></div>
      <div><div class="zv-global" title="Placar somado de todas as pessoas que jogaram"><span>All users <b class="g-t">…</b></span><i>×</i><span><b class="g-z">…</b> Zizi</span></div>
        <div class="jg-hud"><span class="msg">Sua vez (X)</span><span>Você <b class="v">${pl.v}</b> × <b class="z">${pl.z}</b> Zizi · Velha <b class="e">${pl.e}</b></span><button class="btn jg-go">Revanche</button></div>
        <div class="velha zv-tab"></div></div>
      <div class="zv-rk"></div></div>`;
    const tab = area.querySelector(".zv-tab"), msg = area.querySelector(".msg"), balao = area.querySelector(".zv-balao p"), zEl = area.querySelector(".zv-zizi");
    const L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    let b, fim, tFala;
    const ganhou = (q, s) => L.some((l) => l.every((i) => q[i] === s));
    const pose = (p) => { if (ALU.ziziSVG) zEl.innerHTML = ALU.ziziSVG(p); };
    const pintarGlobal = (p) => { if (!p || !area.isConnected) return; area.querySelector(".g-t").textContent = p.todos || 0; area.querySelector(".g-z").textContent = p.zizi || 0; };
    if (ALU.api) ALU.api.placar().then(pintarGlobal);
    const attRk = ranking(area.querySelector(".zv-rk"), "velha", "vitórias contra Zizi", () => pl.v);
    function falar(tipo, p) {
      balao.textContent = um(FALAS[tipo]); balao.parentElement.classList.remove("pop"); void balao.offsetWidth; balao.parentElement.classList.add("pop");
      if (p) { pose(p); clearTimeout(tFala); tFala = setTimeout(() => !fim && pose("normal"), 1400); }
      tom(520 + Math.random() * 200, 0.05, "square", 0.03); tom(700, 0.05, "square", 0.03, 0.06);
    }
    // Zizi joga bem, mas se distrai: às vezes não bloqueia e às vezes joga em qualquer lugar.
    function cpu() {
      const vazios = b.map((v, i) => (v ? null : i)).filter((i) => i !== null);
      const fecha = (s) => vazios.find((i) => { const q = b.slice(); q[i] = s; return ganhou(q, s); });
      const vence = fecha("O"); if (vence != null && Math.random() < 0.85) return [vence, "zizi"];
      const bloqueio = fecha("X");
      if (bloqueio != null) return Math.random() < 0.55 ? [bloqueio, "quase"] : [(() => { const o = vazios.filter((i) => i !== bloqueio); return o.length ? um(o) : bloqueio; })(), "vacilo"];
      if (Math.random() < 0.4) return [um(vazios), "zizi"];
      if (!b[4] && Math.random() < 0.6) return [4, "zizi"];
      const cantos = [0, 2, 6, 8].filter((i) => !b[i]); if (cantos.length) return [um(cantos), "zizi"];
      return [um(vazios), "zizi"];
    }
    function checar() {
      let vencedor = null;
      if (ganhou(b, "X")) { fim = true; vencedor = "todos"; pl.v++; msg.textContent = "Você venceu! 🎉"; falar("jogadorVence"); pose("triste"); conq("velha", "Mais esperto que Zizi", "Venceu Zizi no jogo da velha."); }
      else if (ganhou(b, "O")) { fim = true; vencedor = "zizi"; pl.z++; msg.textContent = "Zizi venceu."; falar("ziziVence"); pose("ri"); }
      else if (b.every(Boolean)) { fim = true; vencedor = "velha"; pl.e++; msg.textContent = "Deu velha."; falar("velha"); pose("normal"); }
      area.querySelector(".v").textContent = pl.v; area.querySelector(".z").textContent = pl.z; area.querySelector(".e").textContent = pl.e;
      if (fim) { ls.set("alu.velha", pl); attRk(); if (ALU.api) ALU.api.somarPlacar(vencedor).then(pintarGlobal); }
    }
    const ZICON = `<span class="zv-o">★</span>`;
    function desenhar() { tab.innerHTML = b.map((v, i) => `<button data-i="${i}" class="${v || ""}" aria-label="${v === "O" ? "estrela da Zizi" : v || "vazio"}">${v === "O" ? ZICON : v || ""}</button>`).join(""); tab.querySelectorAll("button").forEach((x) => (x.onclick = () => jogar(+x.dataset.i))); }
    function jogar(i) {
      if (fim || b[i] || msg.dataset.pensando) return; b[i] = "X"; tom(330, 0.06); checar(); desenhar(); if (fim) return;
      falar("jogador", Math.random() < 0.5 ? "brava" : null);
      msg.textContent = "Zizi está pensando…"; msg.dataset.pensando = "1";
      setTimeout(() => {
        delete msg.dataset.pensando; if (fim || !area.isConnected) return;
        const [j, tipo] = cpu(); b[j] = "O"; tom(440, 0.06); checar(); desenhar();
        if (!fim) { msg.textContent = "Sua vez (X)"; falar(tipo, tipo === "quase" ? "brava" : tipo === "vacilo" ? "triste" : "ri"); }
      }, 700 + Math.random() * 500);
    }
    function novo() { b = Array(9).fill(null); fim = false; msg.textContent = "Sua vez (X)"; desenhar(); pose("normal"); falar("inicio"); }
    area.querySelector(".jg-go").onclick = novo; novo();
    return () => clearTimeout(tFala);
  }

  // =================== Pato Voador ===================
  function voador(area) {
    const W = 288, H = 400;
    area.innerHTML = `<div class="jg-hud"><span>Pontos: <b class="pt">0</b></span><span>Recorde: <b class="rc">${ls.get("alu.voador", 0)}</b></span></div>
      <div class="pv-wrap"><div><canvas class="jg-canvas pv" width="${W}" height="${H}"></canvas><p class="muted">Clique, toque ou aperte espaço para bater as asas.</p></div><div class="zv-rk"></div></div>`;
    const attRk = ranking(area.querySelector(".zv-rk"), "voador", "recorde no Pato Voador", () => ls.get("alu.voador", 0));
    const cv = area.querySelector("canvas"), g = cv.getContext("2d");
    let y, vy, canos, pts, estado = "pronto", raf, t = 0;
    const GAP = 135, VX = 1.7; // física por tempo (não por quadro), senão em telas de 120/144 Hz fica o dobro de rápido
    let ultT = 0, k = 1, prox = 0;
    function reset() { y = H / 2; vy = 0; canos = []; pts = 0; t = 0; prox = 40; area.querySelector(".pt").textContent = 0; }
    function pular() {
      if (estado === "morto") { reset(); estado = "pronto"; return; }
      if (estado === "pronto") estado = "jogando";
      vy = -5; tom(660, 0.06, "square", 0.04);
    }
    function pato(x, y, ang) {
      g.save(); g.translate(x, y); g.rotate(ang);
      const P = [["....kkkk....", "...kppppk...", "..kppppwek..", "..kppppppkoo", "kkkppppppkoo", "kwwkpppppk..", ".kwwkppppk..", "..kkkkkkk..."], { k: "#1b1426", p: "#9b6bff", w: "#d9c6ff", e: "#1b1426", o: "#f28c28" }];
      P[0].forEach((l, j) => [...l].forEach((c, i) => { if (P[1][c]) { g.fillStyle = P[1][c]; g.fillRect((i - 6) * 3, (j - 4) * 3, 3, 3); } }));
      g.restore();
    }
    function cano(x, topo) {
      g.fillStyle = "#2f8f3a"; g.fillRect(x, 0, 44, topo); g.fillRect(x, topo + GAP, 44, H - topo - GAP - 40);
      g.fillStyle = "#4fc35a"; g.fillRect(x + 4, 0, 8, topo); g.fillRect(x + 4, topo + GAP, 8, H - topo - GAP - 40);
      g.fillStyle = "#1b1426"; g.fillRect(x - 3, topo - 14, 50, 14); g.fillRect(x - 3, topo + GAP, 50, 14);
      g.fillStyle = "#3aa34a"; g.fillRect(x - 1, topo - 12, 46, 10); g.fillRect(x - 1, topo + GAP + 2, 46, 10);
    }
    function quadro(agora) {
      agora = agora || performance.now(); k = ultT ? Math.min(3, (agora - ultT) / 16.67) : 1; ultT = agora; t += k;
      // céu de fim de tarde em faixas
      ["#f6c56b", "#f2a25a", "#e9845a", "#c9667a", "#8e5a9a"].forEach((c, i) => { g.fillStyle = c; g.fillRect(0, i * 72, W, 72); });
      g.fillStyle = "#ffe9a8"; g.fillRect(200, 250, 40, 40);
      g.fillStyle = "#5a3a6a"; for (let i = 0; i < W; i += 24) g.fillRect((i - (t * 0.5) % 24), 300 - ((i * 7) % 30), 24, 60);
      if (estado === "jogando") {
        vy = Math.min(6.5, vy + 0.24 * k); y += vy * k;
        prox -= k; if (prox <= 0) { prox = 105; canos.push({ x: W, topo: 50 + Math.random() * (H - GAP - 140), ok: false }); }
        canos.forEach((c) => { c.x -= VX * k; if (!c.ok && c.x + 44 < 60) { c.ok = true; pts++; area.querySelector(".pt").textContent = pts; tom(880, 0.08, "triangle", 0.05); if (pts === 10) conq("voador", "Asas de pato", "Fez 10 pontos no Pato Voador."); } });
        canos = canos.filter((c) => c.x > -60);
        if (y < 8) { y = 8; vy = Math.max(0, vy); }
        const bateu = y > H - 52 || canos.some((c) => 60 + 14 > c.x && 60 - 14 < c.x + 44 && (y - 10 < c.topo || y + 10 > c.topo + GAP));
        if (bateu) {
          estado = "morto"; tom(160, 0.3, "sawtooth", 0.06);
          if (pts > ls.get("alu.voador", 0)) { ls.set("alu.voador", pts); area.querySelector(".rc").textContent = pts; attRk(); }
        }
      } else if (estado === "pronto") y = H / 2 + Math.sin(t / 10) * 6;
      canos.forEach((c) => cano(c.x, c.topo));
      g.fillStyle = "#c48b4a"; g.fillRect(0, H - 40, W, 40); g.fillStyle = "#8a5a2a"; for (let i = 0; i < W + 16; i += 16) g.fillRect(i - (t * VX) % 16, H - 40, 8, 6);
      pato(60, y, Math.max(-0.5, Math.min(1, vy / 10)));
      g.fillStyle = "#fff"; g.font = `24px ${FONTE}`; g.textAlign = "center";
      if (estado === "pronto") g.fillText("toque para voar", W / 2, 120);
      if (estado === "morto") { g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(0, 140, W, 90); g.fillStyle = "#fff"; g.fillText("quack! bateu", W / 2, 180); g.font = `16px ${FONTE}`; g.fillText("toque para tentar de novo", W / 2, 208); }
      raf = requestAnimationFrame(quadro);
    }
    const tecla = (e) => { if (!ativo(area)) return; if (e.code === "Space" || e.key === "ArrowUp" || e.key === "w") { e.preventDefault(); pular(); } };
    cv.addEventListener("pointerdown", (e) => { e.preventDefault(); pular(); });
    document.addEventListener("keydown", tecla);
    reset(); quadro();
    return () => { cancelAnimationFrame(raf); document.removeEventListener("keydown", tecla); };
  }

  // =================== Plantão Noturno no Museu da Savana ===================
  // Você é a pessoa da segurança. Três robôs do museu andam à noite. Vigie as câmeras,
  // feche as portas quando alguém chegar e não deixe a bateria acabar até as 6h.
  function plantao(area) {
    const SALAS = ["Palco", "Salão", "Corredor E", "Corredor D", "Porta E", "Porta D"];
    const ROBOS = [
      { nome: "Girafa de Lata", cor: "#e0a03a", lado: "E", agr: 0.32, cara: "🦒" },
      { nome: "Leão Enferrujado", cor: "#c8642a", lado: "D", agr: 0.3, cara: "🦁" },
      { nome: "Pato Mecânico", cor: "#9b6bff", lado: "?", agr: 0.26, cara: "🦆" },
    ];
    area.innerHTML = `<div class="pn">
      <div class="pn-tela"><canvas width="480" height="270"></canvas><div class="pn-hud"><b class="pn-hora">12 AM</b><span>Noite <b class="pn-noite">1</b></span><span>Bateria <b class="pn-bat">100</b>%</span><span>Uso <b class="pn-uso">▮</b></span></div><button class="btn real pn-go">Começar a noite</button></div>
      <div class="pn-ctrl"><button class="btn pn-pe">◧ Porta E</button><button class="btn pn-le">💡 Luz E</button><button class="btn real pn-cam">📷 Câmeras</button><button class="btn pn-ld">💡 Luz D</button><button class="btn pn-pd">Porta D ◨</button></div>
      <div class="pn-cams" hidden>${SALAS.slice(0, 4).map((s, i) => `<button data-c="${i}">CAM ${i + 1} · ${s}</button>`).join("")}</div>
      <p class="muted">Feche a porta quando a luz mostrar um robô. Câmeras, luzes e portas gastam bateria. Sobreviva até as 6 AM.</p>
</div>`;
    const cv = area.querySelector("canvas"), g = cv.getContext("2d");
    const $ = (s) => area.querySelector(s);
    let st = null, timer = null, raf = null;
    const noiteSalva = ls.get("alu.plantao", 1);
    $(".pn-noite").textContent = noiteSalva;
    function iniciar() {
      const noite = ls.get("alu.plantao", 1);
      st = { noite, hora: 0, seg: 0, bat: 100, pe: false, pd: false, le: false, ld: false, cam: false, camSel: 0, morto: false, venceu: false,
        pos: ROBOS.map(() => 0), lado: ROBOS.map((r) => r.lado === "?" ? um(["E", "D"]) : r.lado), susto: 0 };
      $(".pn-noite").textContent = noite; $(".pn-go").hidden = true; area.querySelector(".pn-cams").hidden = true;
      clearInterval(timer); timer = setInterval(passo, 1000);
      pintarBotoes();
    }
    const uso = () => 1 + (st.pe ? 1 : 0) + (st.pd ? 1 : 0) + (st.le ? 1 : 0) + (st.ld ? 1 : 0) + (st.cam ? 1 : 0);
    function passo() {
      if (!st || st.morto || st.venceu) return;
      st.seg++; st.bat = Math.max(0, st.bat - uso() * 0.16);
      if (st.seg % 20 === 0) { st.hora++; tom(220, 0.4, "triangle", 0.05); }
      if (st.hora >= 6) { st.venceu = true; clearInterval(timer); ls.set("alu.plantao", Math.min(5, st.noite + 1)); tom(523, 0.2, "triangle", 0.06); tom(659, 0.2, "triangle", 0.06, 0.2); tom(784, 0.4, "triangle", 0.06, 0.4); conq("plantao", "Sobreviveu ao plantão", "Chegou às 6 AM no Plantão Noturno."); $(".pn-go").hidden = false; $(".pn-go").textContent = "Próxima noite"; return; }
      if (st.bat <= 0) { st.pe = st.pd = st.le = st.ld = st.cam = false; }
      ROBOS.forEach((r, i) => {
        const chance = r.agr + st.noite * 0.06 + st.hora * 0.02;
        if (Math.random() < chance * 0.35) {
          if (st.pos[i] < 2) st.pos[i]++;
          else if (st.pos[i] === 2) st.pos[i] = 3; // na porta
          else if (st.pos[i] === 3) {
            const fechada = st.lado[i] === "E" ? st.pe : st.pd;
            if (fechada) { st.pos[i] = Math.random() < 0.5 ? 0 : 1; if (r.lado === "?") st.lado[i] = um(["E", "D"]); tom(140, 0.15, "square", 0.05); }
            else { st.morto = true; st.susto = i; clearInterval(timer); tom(90, 0.8, "sawtooth", 0.12); tom(60, 0.8, "square", 0.1, 0.05); $(".pn-go").hidden = false; $(".pn-go").textContent = "Tentar de novo"; }
          }
        }
      });
      pintarBotoes();
    }
    function pintarBotoes() {
      if (!st) return;
      $(".pn-hora").textContent = (st.hora === 0 ? 12 : st.hora) + " AM"; $(".pn-bat").textContent = Math.ceil(st.bat); $(".pn-uso").textContent = "▮".repeat(uso());
      [["pe", ".pn-pe"], ["pd", ".pn-pd"], ["le", ".pn-le"], ["ld", ".pn-ld"], ["cam", ".pn-cam"]].forEach(([k, s]) => $(s).classList.toggle("on", st[k]));
      area.querySelector(".pn-cams").hidden = !st.cam;
      area.querySelectorAll(".pn-cams button").forEach((b) => b.classList.toggle("on", +b.dataset.c === st.camSel));
    }
    const alternar = (k) => () => { if (!st || st.morto || st.venceu || st.bat <= 0) return; st[k] = !st[k]; tom(k[0] === "p" ? 180 : 900, 0.05, "square", 0.04); pintarBotoes(); };
    $(".pn-pe").onclick = alternar("pe"); $(".pn-pd").onclick = alternar("pd"); $(".pn-le").onclick = alternar("le"); $(".pn-ld").onclick = alternar("ld"); $(".pn-cam").onclick = alternar("cam");
    area.querySelectorAll(".pn-cams button").forEach((b) => (b.onclick = () => { if (st) { st.camSel = +b.dataset.c; tom(1200, 0.03, "square", 0.03); pintarBotoes(); } }));
    $(".pn-go").onclick = iniciar;

    function robo(x, y, s, r, olhos = true) {
      g.fillStyle = "#1b1426"; g.fillRect(x - 2 * s, y - 2 * s, 14 * s, 18 * s);
      g.fillStyle = r.cor; g.fillRect(x - s, y - s, 12 * s, 16 * s);
      g.fillStyle = "#1b1426"; g.fillRect(x + s, y + 3 * s, 3 * s, 3 * s); g.fillRect(x + 6 * s, y + 3 * s, 3 * s, 3 * s); g.fillRect(x + 2 * s, y + 9 * s, 6 * s, 2 * s);
      if (olhos) { g.fillStyle = "#fff"; g.fillRect(x + 2 * s, y + 4 * s, s, s); g.fillRect(x + 7 * s, y + 4 * s, s, s); }
      g.font = `${10 * s}px serif`; g.textAlign = "center"; g.fillText(r.cara, x + 5 * s, y - 3 * s);
    }
    function quadro() {
      raf = requestAnimationFrame(quadro);
      g.fillStyle = "#07060c"; g.fillRect(0, 0, 480, 270);
      if (!st) { g.fillStyle = "#cfd6e4"; g.font = `20px ${FONTE}`; g.textAlign = "center"; g.fillText("Plantão Noturno no Museu da Savana", 240, 120); g.font = `14px ${FONTE}`; g.fillText("Noite " + ls.get("alu.plantao", 1) + " · boa sorte", 240, 150); return; }
      if (st.morto) { const r = ROBOS[st.susto]; g.fillStyle = Math.random() < 0.5 ? "#2a0000" : "#000"; g.fillRect(0, 0, 480, 270); robo(160 + Math.random() * 8, 20 + Math.random() * 8, 11, r); g.fillStyle = "#ff4d6d"; g.font = `22px ${FONTE}`; g.textAlign = "center"; g.fillText(r.nome + " te pegou!", 240, 260); return; }
      if (st.venceu) { g.fillStyle = "#ffe9a8"; g.font = `40px ${FONTE}`; g.textAlign = "center"; g.fillText("6 AM", 240, 130); g.font = `16px ${FONTE}`; g.fillText("Você sobreviveu à noite " + st.noite + "! 🌅", 240, 165); return; }
      if (st.cam && st.bat > 0) {
        g.fillStyle = "#14201a"; g.fillRect(0, 0, 480, 270);
        g.fillStyle = "#1f3328"; for (let i = 0; i < 270; i += 4) g.fillRect(0, i, 480, 1);
        const sala = st.camSel; g.fillStyle = "#9fdcb0"; g.font = `14px ${FONTE}`; g.textAlign = "left"; g.fillText("● REC  CAM " + (sala + 1) + " · " + SALAS[sala], 12, 22);
        ROBOS.forEach((r, i) => { const p = st.pos[i]; const ondeSala = p === 0 ? 0 : p === 1 ? 1 : p === 2 ? (st.lado[i] === "E" ? 2 : 3) : -1; if (ondeSala === sala) robo(80 + i * 130, 90, 6, r, Math.random() < 0.9); });
        if (Math.random() < 0.05) { g.fillStyle = "rgba(255,255,255,.08)"; g.fillRect(0, 0, 480, 270); }
        return;
      }
      // escritório
      g.fillStyle = "#1a1626"; g.fillRect(0, 0, 480, 270); g.fillStyle = "#2a2440"; g.fillRect(0, 200, 480, 70);
      g.fillStyle = "#3a3358"; g.fillRect(150, 120, 180, 80); g.fillStyle = "#0b0a12"; g.fillRect(160, 128, 160, 60); g.fillStyle = "#9fdcb0"; g.font = `12px ${FONTE}`; g.textAlign = "center"; g.fillText("museu.exe", 240, 162);
      [["E", 20, st.pe, st.le], ["D", 380, st.pd, st.ld]].forEach(([lado, x, porta, luz]) => {
        g.fillStyle = luz && st.bat > 0 ? "#3a3550" : "#0d0b14"; g.fillRect(x, 40, 80, 160);
        if (luz && st.bat > 0) ROBOS.forEach((r, i) => { if (st.pos[i] === 3 && st.lado[i] === lado) robo(x + 10, 70, 5, r); });
        if (porta) { g.fillStyle = "#6d6d7a"; g.fillRect(x, 40, 80, 160); g.fillStyle = "#4a4a56"; for (let k = 0; k < 160; k += 16) g.fillRect(x, 40 + k, 80, 3); }
        g.strokeStyle = "#000"; g.lineWidth = 4; g.strokeRect(x, 40, 80, 160);
      });
      if (st.bat <= 0) { g.fillStyle = "rgba(0,0,0,.8)"; g.fillRect(0, 0, 480, 270); g.fillStyle = "#ff4d6d"; g.font = `16px ${FONTE}`; g.textAlign = "center"; g.fillText("sem bateria…", 240, 140); }
    }
    quadro();
    return () => { clearInterval(timer); cancelAnimationFrame(raf); };
  }

  // =================== Batalha de Ritmo contra Zizi ===================
  function ritmo(area) {
    const W = 360, H = 420, LANES = ["ArrowLeft", "ArrowDown", "ArrowUp", "ArrowRight"], SIMB = ["←", "↓", "↑", "→"], CORES = ["#c94fd8", "#2fbfd8", "#3aa34a", "#e0413a"];
    const TECLAS = { ArrowLeft: 0, ArrowDown: 1, ArrowUp: 2, ArrowRight: 3, a: 0, s: 1, w: 2, d: 3, d0: 0 };
    area.innerHTML = `<div class="rt">
      <div class="zv-lado"><div class="zv-zizi rt-zizi">${ALU.ziziSVG ? ALU.ziziSVG() : ""}</div><div class="zv-balao"><p>Bora ver se você tem ritmo. 🎵</p></div></div>
      <div><div class="jg-hud"><span>Pontos <b class="rt-p">0</b></span><span>Combo <b class="rt-c">0</b></span><span>Recorde <b class="rt-r">${ls.get("alu.ritmo", 0)}</b></span><button class="btn jg-go">Começar</button></div>
      <canvas class="jg-canvas" width="${W}" height="${H}"></canvas>
      <div class="rt-pads">${SIMB.map((s, i) => `<button data-l="${i}" style="--c:${CORES[i]}">${s}</button>`).join("")}</div>
      <p class="muted">Setas (ou A S W D) quando a nota chegar na linha. No celular, toque nos botões.</p></div><div class="zv-rk"></div></div>`;
    const cv = area.querySelector("canvas"), g = cv.getContext("2d"), balao = area.querySelector(".zv-balao p"), zEl = area.querySelector(".rt-zizi");
    const attRk = ranking(area.querySelector(".zv-rk"), "ritmo", "recorde na Batalha de Ritmo", () => ls.get("alu.ritmo", 0));
    const BPM = 120, BEAT = 60 / BPM, ALVO = H - 60, VEL = 260;
    let notas = [], inicio = 0, raf = null, tocando = false, pts = 0, combo = 0, flash = [0, 0, 0, 0], txt = "", txtT = 0, agendado = 0;
    // música original: baixo + melodia em escala pentatônica, gerada na hora
    const ESCALA = [261.6, 293.7, 329.6, 392, 440, 523.3, 587.3, 659.3];
    function gerar() {
      notas = []; let seed = 7;
      const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
      for (let b = 4; b < 4 + 64; b++) {
        const t = b * BEAT;
        if (rnd() < 0.75) notas.push({ t, l: Math.floor(rnd() * 4), ok: false, perdida: false, f: ESCALA[Math.floor(rnd() * ESCALA.length)] });
        if (b > 20 && rnd() < 0.35) notas.push({ t: t + BEAT / 2, l: Math.floor(rnd() * 4), ok: false, perdida: false, f: ESCALA[Math.floor(rnd() * ESCALA.length)] });
      }
    }
    const agora = () => (ac ? ac.currentTime : 0) - inicio;
    function falar(t, p) { balao.textContent = t; if (ALU.ziziSVG) zEl.innerHTML = ALU.ziziSVG(p || "normal"); }
    function comecar() {
      try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); } catch {}
      if (!ac) return;
      gerar(); pts = 0; combo = 0; inicio = ac.currentTime + 0.3; tocando = true; agendado = 0;
      area.querySelector(".rt-p").textContent = 0; area.querySelector(".rt-c").textContent = 0;
      falar("Valendo! Não pisca. 😏", "ri");
    }
    function batida() {
      // agenda bateria e baixo um pouco à frente
      while (tocando && agendado < 72) {
        const t = agendado * BEAT;
        if (t > agora() + 0.5) break;
        const q = t - agora();
        tom(agendado % 2 ? 110 : 82, 0.12, "triangle", 0.09, Math.max(0, q));
        tom(agendado % 4 === 2 ? 1800 : 3000, 0.02, "square", 0.012, Math.max(0, q));
        agendado++;
      }
    }
    function acertar(l) {
      if (!tocando) return;
      flash[l] = 8;
      const t = agora();
      const n = notas.filter((x) => x.l === l && !x.ok && !x.perdida).sort((a, b) => Math.abs(a.t - t) - Math.abs(b.t - t))[0];
      if (n && Math.abs(n.t - t) < 0.16) {
        n.ok = true; const perf = Math.abs(n.t - t) < 0.06;
        pts += perf ? 300 : 100; combo++; txt = perf ? "PERFEITO!" : "BOM"; txtT = 30;
        tom(n.f, 0.18, "square", 0.05);
        if (combo === 10) falar("Ok… você até que manda bem.", "brava");
        if (combo === 25) { falar("Para de acertar tudo! 😤", "brava"); conq("ritmo", "Ritmo de batalha", "Fez combo 25 na Batalha de Ritmo."); }
      } else { combo = 0; txt = "ERROU"; txtT = 30; tom(120, 0.08, "sawtooth", 0.04); if (Math.random() < 0.3) falar(um(["Ritmo zero. 🙃", "Tá dançando outra música?", "Hahaha!"]), "ri"); }
      area.querySelector(".rt-p").textContent = pts; area.querySelector(".rt-c").textContent = combo;
    }
    function quadro() {
      raf = requestAnimationFrame(quadro);
      g.fillStyle = "#14102a"; g.fillRect(0, 0, W, H);
      const lw = W / 4;
      for (let i = 0; i < 4; i++) {
        g.fillStyle = i % 2 ? "#1b1636" : "#191431"; g.fillRect(i * lw, 0, lw, H);
        g.fillStyle = flash[i] ? CORES[i] : "#3a3358"; g.fillRect(i * lw + 6, ALVO - 4, lw - 12, 8);
        g.fillStyle = "#cfd6e4"; g.font = `22px ${FONTE}`; g.textAlign = "center"; g.fillText(SIMB[i], i * lw + lw / 2, ALVO + 34);
        if (flash[i]) flash[i]--;
      }
      if (tocando) {
        batida();
        const t = agora();
        notas.forEach((n) => {
          if (n.ok || n.perdida) return;
          const y = ALVO - (n.t - t) * VEL;
          if (y > ALVO + 50) { n.perdida = true; combo = 0; area.querySelector(".rt-c").textContent = 0; return; }
          if (y < -30) return;
          g.fillStyle = "#1b1426"; g.fillRect(n.l * lw + 10, y - 14, lw - 20, 28);
          g.fillStyle = CORES[n.l]; g.fillRect(n.l * lw + 13, y - 11, lw - 26, 22);
          g.fillStyle = "#fff"; g.font = `18px ${FONTE}`; g.fillText(SIMB[n.l], n.l * lw + lw / 2, y + 6);
        });
        if (notas.every((n) => n.ok || n.perdida)) {
          tocando = false;
          const tot = notas.length, ac2 = notas.filter((n) => n.ok).length;
          if (pts > ls.get("alu.ritmo", 0)) { ls.set("alu.ritmo", pts); area.querySelector(".rt-r").textContent = pts; attRk(); }
          falar(ac2 / tot > 0.8 ? "Tá bom, você venceu. Dessa vez. 😤" : ac2 / tot > 0.5 ? "Empate técnico. Eu ainda sou melhor." : "Vitória da Zizi! Volta quando treinar. 😎", ac2 / tot > 0.8 ? "triste" : "ri");
        }
      } else { g.fillStyle = "#cfd6e4"; g.font = `18px ${FONTE}`; g.textAlign = "center"; g.fillText("Batalha de Ritmo", W / 2, 150); g.font = `14px ${FONTE}`; g.fillText("clique em Começar", W / 2, 176); }
      if (txtT) { txtT--; g.fillStyle = txt === "ERROU" ? "#ff4d6d" : "#ffd23f"; g.font = `26px ${FONTE}`; g.fillText(txt, W / 2, 110); }
    }
    const tecla = (e) => { if (!ativo(area)) return; const l = TECLAS[e.key]; if (l !== undefined) { e.preventDefault(); if (!e.repeat) acertar(l); } };
    document.addEventListener("keydown", tecla);
    area.querySelectorAll(".rt-pads button").forEach((b) => b.addEventListener("pointerdown", (e) => { e.preventDefault(); acertar(+b.dataset.l); }));
    area.querySelector(".jg-go").onclick = comecar;
    quadro();
    return () => { tocando = false; cancelAnimationFrame(raf); document.removeEventListener("keydown", tecla); };
  }

  Object.assign(ALU.JOGOS = ALU.JOGOS || {}, { velha, voador, plantao, ritmo });
})();
