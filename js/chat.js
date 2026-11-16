// MessagerTale: um messenger à moda antiga. Você escolhe o que responder,
// a frase é "digitada" na caixa de texto e o Aluísio responde.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s);

  // ---------- sons (gerados, sem arquivos) ----------
  let actx = null, mudo = false;
  try { mudo = localStorage.getItem("alu.mudo") === "1"; } catch {}
  function bip(tipo) {
    if (mudo) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const seq = { in: [[880, 0], [1320, .08]], out: [[660, 0], [520, .06]], porta: [[392, 0], [523, .1], [659, .2]], tec: [[2200 + Math.random() * 400, 0]] }[tipo];
      seq.forEach(([f, t]) => {
        const o = actx.createOscillator(), g = actx.createGain(), t0 = actx.currentTime + t, dur = tipo === "tec" ? .025 : .12;
        o.type = tipo === "tec" ? "square" : "triangle"; o.frequency.value = f;
        g.gain.setValueAtTime(tipo === "tec" ? .015 : .07, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
        o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + dur + .02);
      });
    } catch {}
  }

  // ---------- roteiro ----------
  function roteiro(mobile) {
    const P = window.PERFIL, PROJ = window.PROJETOS;
    const nos = {
      inicio: {
        diz: [mobile ? "vi que você abriu meu celular 👀" : "vi que você entrou no meu desktop 👀", `aqui é o ${P.nome}. pode perguntar o que quiser`],
        ops: [["oi! quem é você?", "sobre"], ["quero ver seus projetos", "projetos"], ["como eu falo com você?", "contato"]],
      },
      sobre: {
        diz: [...P.bio.map((b) => b.toLowerCase()), "e sim, eu fiz esse sistema inteiro só pra você ler isso aqui hehe"],
        ops: [["mostra os projetos então", "projetos"], ["e suas skills?", "stack"], ["legal! como te acho?", "contato"]],
      },
      projetos: {
        diz: ["vou te mostrar os que eu mais gosto:", ...PROJ.map((p) => `• ${p.curto}: ${p.resumo.charAt(0).toLowerCase() + p.resumo.slice(1)}`), "qual te interessa?"],
        ops: [...PROJ.map((p) => [`me conta do ${p.curto}`, "p:" + p.id]), ["depois eu vejo, valeu", "tchau"]],
      },
      stack: {
        diz: [`na pasta Skills tem: ${window.SKILLS.map((x) => x.nome).join(", ")}`, `e as certificações: ${window.CERTIFICADOS.map((c) => c.emissor).join(", ")}`, "e eu vou adicionando mais coisa por lá :)"],
        ops: [["e os projetos?", "projetos"], ["como te acho?", "contato"]],
      },
      contato: {
        diz: [`meu DogHub: ${P.contatos.github.replace("https://github.com", "doghub.com")}`,
          `no LigadIn: ${P.contatos.linkedin.replace(/^https?:\/\/(www\.)?/, "")}`,
          ...(P.contatos.email ? [`e-mail: ${P.contatos.email}`] : []),
          "pode chamar que eu respondo :)"],
        ops: [["abre o DogHub aí", "!doghub"], ["e o LigadIn?", "!ligadin"], ["quero ver os projetos", "projetos"], ["valeu, até mais!", "tchau"]],
      },
      tchau: {
        diz: ["valeu pela visita!!", "se quiser voltar, é só me chamar aqui de novo", "fui 👋"],
        ops: [["espera, volta!", "inicio"]], ausente: true,
      },
    };
    PROJ.forEach((p, i) => {
      const outro = PROJ[(i + 1) % PROJ.length];
      nos["p:" + p.id] = {
        diz: [p.descricao.split(". ")[0].toLowerCase() + ".", `o que eu mais curti: ${p.destaques[0].charAt(0).toLowerCase() + p.destaques[0].slice(1)}`, `fiz com ${p.stack.slice(0, 4).join(", ")}`],
        ops: [["abre os detalhes", "!abrir:" + p.id], [`e o ${outro.curto}?`, "p:" + outro.id], ["mostra a lista de novo", "projetos"]],
      };
    });
    return nos;
  }

  ALU.bip = bip;
  ALU.chat = function (el, ctx) {
    const P = window.PERFIL, NOS = roteiro(ctx.mobile);
    const eu = P.usuario, voce = "visitante";
    el.innerHTML = `
      <div class="chat">
        <div class="menubar"><span>Arquivo</span><span>Editar</span><span>Inserir</span><span>Pessoas</span><button class="chat-som" aria-label="Som"></button></div>
        <div class="chat-top">
          <div class="chat-col">
            <div class="chat-to">Para: <b>${eu}</b> <span class="buddy-status"><i class="dot"></i><span>online</span></span></div>
            <div class="chat-log" aria-live="polite"></div>
            <div class="chat-typing"></div>
          </div>
          <div class="dp"><img src="${esc(P.foto)}" alt="Foto de ${esc(P.nome)}"></div>
        </div>
        <div class="chat-ops"></div>
        <div class="chat-bottom">
          <div class="chat-col">
            <div class="fmt"><b>A</b><b class="i">A</b><b class="u">A</b><span>☺</span><button class="chat-nudge" title="Chamar atenção">📳</button></div>
            <div class="chat-input">
              <div class="chat-box" aria-hidden="true"><span class="txt"></span><span class="caret"></span></div>
              <button class="chat-send" disabled>Enviar</button>
            </div>
          </div>
          <div class="dp eu">${ALU.pix("visitante")}</div>
        </div>
      </div>`;
    const log = el.querySelector(".chat-log"), opsEl = el.querySelector(".chat-ops"), box = el.querySelector(".chat-box .txt"),
      send = el.querySelector(".chat-send"), typing = el.querySelector(".chat-typing"), status = el.querySelector(".buddy-status"), som = el.querySelector(".chat-som");
    const hora = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    let vivo = true, timers = [];
    const later = (f, ms) => { const t = setTimeout(() => vivo && f(), ms); timers.push(t); };
    const fim = new MutationObserver(() => { if (!el.isConnected) { vivo = false; timers.forEach(clearTimeout); fim.disconnect(); document.removeEventListener("keydown", tecla); } });
    fim.observe(document.body, { childList: true, subtree: true });

    const pintarSom = () => { som.textContent = mudo ? "🔇" : "🔊"; som.title = mudo ? "Ligar som" : "Desligar som"; };
    pintarSom();
    el.querySelector(".chat-nudge").onclick = () => {
      const w = el.closest(".win") || el; w.classList.remove("treme"); void w.offsetWidth; w.classList.add("treme");
      ALU.bip && ALU.bip("in"); linha("", "Você chamou a atenção de " + eu + "!", true);
      later(() => linha(eu, "opa, tô aqui! não precisa tremer a tela 😅"), 900);
      ALU.conquista && ALU.conquista("nudge", "Chamando atenção", "Tremeu a janela do MessagerTale.");
    };
    som.onclick = () => { mudo = !mudo; try { localStorage.setItem("alu.mudo", mudo ? "1" : "0"); } catch {} pintarSom(); };

    function linha(quem, texto, sistema, h) {
      const d = document.createElement("div");
      d.className = "msg " + (sistema ? "sis" : quem === eu ? "dele" : "meu");
      d.innerHTML = sistema ? esc(texto) : `<span class="nick">${esc(quem)}</span> <span class="hr">(${h || hora()})</span>: ${esc(texto)}`;
      log.appendChild(d); log.scrollTop = log.scrollHeight;
    }

    function falar(no) {
      const n = NOS[no]; let t = 300;
      opsEl.innerHTML = "";
      status.querySelector("span").textContent = "online"; status.classList.remove("away");
      n.diz.forEach((frase) => {
        const espera = Math.min(2200, 350 + frase.length * 22);
        later(() => { typing.textContent = `${eu} está digitando...`; }, t);
        t += espera;
        later(() => { typing.textContent = ""; linha(eu, frase); bip("in"); }, t);
        t += 250;
      });
      later(() => {
        if (n.ausente) { status.querySelector("span").textContent = "ausente: fui tomar um café ☕"; status.classList.add("away"); linha("", `${eu} está ausente.`, true); }
        mostrarOps(n.ops);
      }, t + 100);
    }

    // a frase escolhida é digitada; qualquer tecla acelera, como numa conversa de verdade
    let digitando = null;
    function mostrarOps(ops) {
      opsEl.innerHTML = ops.map(([txt], i) => `<button class="op" data-i="${i}"><b>${i + 1}</b> ${esc(txt)}</button>`).join("");
      opsEl.querySelectorAll(".op").forEach((b) => (b.onclick = () => escolher(ops[+b.dataset.i])));
      log.scrollTop = log.scrollHeight;
    }
    function escolher([txt, destino]) {
      if (digitando) return;
      opsEl.innerHTML = "";
      let i = 0;
      digitando = { avancar: () => { if (i < txt.length) { i = Math.min(txt.length, i + 1 + Math.floor(Math.random() * 2)); box.textContent = txt.slice(0, i); bip("tec"); } if (i >= txt.length) pronto(); } };
      const auto = setInterval(() => { if (!vivo) return clearInterval(auto); digitando && digitando.avancar(); }, 45);
      function pronto() {
        clearInterval(auto);
        if (!digitando || digitando.ok) return; digitando.ok = true;
        send.disabled = false; send.classList.add("pulse");
        const enviar = () => {
          send.onclick = null; send.disabled = true; send.classList.remove("pulse");
          box.textContent = ""; digitando = null;
          linha(voce, txt); bip("out");
          if (destino === "!doghub" || destino === "!ligadin") { later(() => { ctx.abrir("kez", destino === "!doghub" ? "doghub.com/aluisiodev" : "ligadin.com/in/aluisio-alves"); falar("contato_ok"); }, 300); }
          else if (destino.startsWith("!abrir:")) { const id = destino.slice(7); later(() => { ctx.abrir("proj:" + id); falar("abriu"); }, 300); }
          else later(() => falar(destino), 300);
        };
        send.onclick = enviar;
        digitando = { ok: true, avancar: enviar, enviar };
        later(() => { if (digitando && digitando.enviar === enviar) enviar(); }, 900);
      }
    }
    NOS.contato_ok = { diz: ["abri no Kez(i)avana pra você 😉"], ops: [["quero ver os projetos", "projetos"], ["valeu, até mais!", "tchau"]] };
    NOS.abriu = { diz: ["abri os detalhes pra você!", "quando terminar de ler, volta aqui"], ops: [["mostra outro projeto", "projetos"], ["como te acho?", "contato"], ["valeu, até mais!", "tchau"]] };

    function tecla(e) {
      if (!el.isConnected || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target.closest && e.target.closest("input,textarea")) return;
      const vis = el.closest(".win, .m-app");
      if (vis && (vis.hidden || (vis.classList.contains("win") && !vis.classList.contains("focus")))) return;
      if (digitando) { e.preventDefault(); digitando.avancar(); return; }
      const n = parseInt(e.key, 10), b = opsEl.querySelector(`.op[data-i="${n - 1}"]`);
      if (b) { e.preventDefault(); b.click(); }
    }
    document.addEventListener("keydown", tecla);
    el.querySelector(".chat-input").addEventListener("click", () => digitando && digitando.avancar());

    // as mensagens que chegaram pela notificação já aparecem na conversa
    if (!(ALU.chatPre || []).length) NOS.inicio.diz.unshift("oiii");
    (ALU.chatPre || []).forEach((m) => linha(eu, m.txt, false, m.hora));
    ALU.chatAberto = true;
    later(() => falar("inicio"), 700);
  };
})();
