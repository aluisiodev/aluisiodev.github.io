// MessagerTale: um messenger à moda antiga. Você escolhe o que responder,
// a frase é "digitada" na caixa de texto e o Aluísio responde.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s), T = (pt, en) => (ALU.lang === "en" ? en : pt);

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
        diz: [mobile ? T("vi que você abriu meu celular 👀", "i see you opened my phone 👀") : T("vi que você entrou no meu desktop 👀", "i see you got into my desktop 👀"), T(`aqui é o ${P.nome}. pode perguntar o que quiser`, `${P.nome} here. ask me anything`)],
        ops: [[T("oi! quem é você?", "hi! who are you?"), "sobre"], [T("quero ver seus projetos", "i want to see your projects"), "projetos"], [T("como eu falo com você?", "how do i reach you?"), "contato"]],
      },
      sobre: {
        diz: [...P.bio.map((b) => b.toLowerCase()), T("e sim, eu fiz esse sistema inteiro só pra você ler isso aqui hehe", "and yes, i built this whole system just so you could read this hehe")],
        ops: [[T("mostra os projetos então", "show me the projects then"), "projetos"], [T("e suas skills?", "what about your skills?"), "stack"], [T("legal! como te acho?", "cool! where can i find you?"), "contato"]],
      },
      projetos: {
        diz: [T("vou te mostrar os que eu mais gosto:", "here are my favorites:"), ...PROJ.map((p) => `• ${p.curto}: ${p.resumo.charAt(0).toLowerCase() + p.resumo.slice(1)}`), T("qual te interessa?", "which one interests you?")],
        ops: [...PROJ.map((p) => [T(`me conta do ${p.curto}`, `tell me about ${p.curto}`), "p:" + p.id]), [T("depois eu vejo, valeu", "i'll check later, thanks"), "tchau"]],
      },
      stack: {
        diz: [T(`na pasta Skills tem: ${window.SKILLS.map((x) => x.nome).join(", ")}`, `in the Skills folder: ${window.SKILLS.map((x) => x.nome).join(", ")}`), T(`e os cursos que fiz: ${window.CERTIFICADOS.map((c) => c.curto || c.emissor).join(", ")}`, `and the courses i took: ${window.CERTIFICADOS.map((c) => c.curto || c.emissor).join(", ")}`), T("e eu vou adicionando mais coisa por lá :)", "and i keep adding more stuff there :)")],
        ops: [[T("e os projetos?", "and the projects?"), "projetos"], [T("como te acho?", "where can i find you?"), "contato"]],
      },
      contato: {
        diz: [T("meu DogHub: ", "my DogHub: ") + `${P.contatos.github.replace("https://github.com", "doghub.com")}`,
          T("no LigadIn: ", "on LigadIn: ") + `${P.contatos.linkedin.replace(/^https?:\/\/(www\.)?/, "")}`,
          ...(P.contatos.email ? [`e-mail: ${P.contatos.email}`] : []),
          T("pode chamar que eu respondo :)", "message me anytime, i'll answer :)")],
        ops: [[T("abre o DogHub aí", "open DogHub"), "!doghub"], [T("e o LigadIn?", "and LigadIn?"), "!ligadin"], [T("quero ver os projetos", "i want to see the projects"), "projetos"], [T("valeu, até mais!", "thanks, see you!"), "tchau"]],
      },
      tchau: {
        diz: [T("valeu pela visita!!", "thanks for visiting!!"), T("se quiser voltar, é só me chamar aqui de novo", "if you want to come back, just message me here again"), T("fui 👋", "bye 👋")],
        ops: [[T("espera, volta!", "wait, come back!"), "inicio"]], ausente: true,
      },
    };
    PROJ.forEach((p, i) => {
      const outro = PROJ[(i + 1) % PROJ.length];
      nos["p:" + p.id] = {
        diz: [p.descricao.split(". ")[0].toLowerCase() + ".", T("o que eu mais curti: ", "what i liked the most: ") + `${p.destaques[0].charAt(0).toLowerCase() + p.destaques[0].slice(1)}`, T("fiz com ", "built with ") + p.stack.slice(0, 4).join(", ")],
        ops: [[T("abre os detalhes", "open the details"), "!abrir:" + p.id], [T(`e o ${outro.curto}?`, `and ${outro.curto}?`), "p:" + outro.id], [T("mostra a lista de novo", "show the list again"), "projetos"]],
      };
    });
    return nos;
  }

  ALU.bip = bip;
  ALU.chat = function (el, ctx) {
    const P = window.PERFIL, NOS = roteiro(ctx.mobile);
    const eu = P.usuario, voce = T("visitante", "visitor");
    el.innerHTML = `
      <div class="chat">
        <div class="menubar"><span>${T("Arquivo", "File")}</span><span>${T("Editar", "Edit")}</span><span>${T("Inserir", "Insert")}</span><span class="chat-pessoas-bt" role="button" tabindex="0">${T("Pessoas", "People")} ▾</span><button class="chat-som" aria-label="${T("Som", "Sound")}"></button></div>
        <div class="chat-top">
          <div class="chat-col">
            <div class="chat-to">${T("Para", "To")}: <b>${eu}</b> <span class="buddy-status"><i class="dot"></i><span>online</span></span></div>
            <div class="chat-log" aria-live="polite"></div>
            <div class="chat-typing"></div>
          </div>
          <div class="dp"><img src="${esc(P.foto)}" alt="Foto de ${esc(P.nome)}"></div>
        </div>
        <div class="chat-ops"></div>
        <div class="chat-bottom">
          <div class="chat-col">
            <div class="fmt"><b>A</b><b class="i">A</b><b class="u">A</b><span>☺</span><button class="chat-nudge" title="${T("Chamar atenção", "Nudge")}">📳</button></div>
            <div class="chat-input">
              <input class="chat-real" maxlength="300" placeholder="${T("Escreva o que quiser ou escolha uma opção…", "Type anything or pick an option…")}" aria-label="${T("Sua mensagem", "Your message")}">
              <button class="chat-send" disabled>${T("Enviar", "Send")}</button>
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
    // aba Pessoas: lista de contatos. Só o aluisio.dev conversa; os outros são contatos reais
    // que aparecem como ausentes/offline e não respondem (ninguém fala em nome deles aqui).
    const PESSOAS = [
      [eu, "online", T("programando o aluOS", "coding aluOS"), ""],
      ["Vitor Brauer", T("ausente", "away"), "♪", "VB"],
      ['George "Joji" Miller', "offline", "", "GM"],
    ];
    const btP = el.querySelector(".chat-pessoas-bt");
    const abrirPessoas = (e) => {
      e && e.stopPropagation();
      let pop = el.querySelector(".chat-pessoas");
      if (pop) { pop.remove(); return; }
      pop = document.createElement("div"); pop.className = "chat-pessoas";
      pop.innerHTML = `<b class="cp-t">${T("Pessoas", "People")} (${PESSOAS.filter((x) => x[1] !== "offline").length}/${PESSOAS.length} online)</b>` + PESSOAS.map(([n, st, msg, ini], i) => `<button data-i="${i}" class="cp-${st === "away" ? "ausente" : st}"><span class="cp-av">${i === 0 ? `<img src="${esc(P.foto)}" alt="">` : esc(ini)}</span><span><b>${esc(n)}</b><small><i class="dot"></i>${st}${msg ? " · " + esc(msg) : ""}</small></span></button>`).join("");
      el.querySelector(".chat").appendChild(pop);
      pop.querySelectorAll("button").forEach((b) => (b.onclick = (ev) => {
        ev.stopPropagation(); pop.remove();
        const [n, st] = PESSOAS[+b.dataset.i];
        if (+b.dataset.i === 0) { linha("", T("Você já está conversando com ", "You are already talking to ") + eu + ".", true); return; }
        linha("", st === "offline" ? T(`${n} está offline. Mensagens não podem ser entregues agora.`, `${n} is offline. Messages can't be delivered right now.`) : T(`${n} está ausente e não pode responder agora.`, `${n} is away and can't answer right now.`), true);
        ALU.bip && ALU.bip("in");
      }));
      setTimeout(() => document.addEventListener("click", function f() { pop.remove(); document.removeEventListener("click", f); }), 0);
    };
    btP.onclick = abrirPessoas; btP.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") abrirPessoas(e); };
    som.onclick = () => { mudo = !mudo; try { localStorage.setItem("alu.mudo", mudo ? "1" : "0"); } catch {} pintarSom(); };

    function linha(quem, texto, sistema, h) {
      const d = document.createElement("div");
      d.className = "msg " + (sistema ? "sis" : quem === eu ? "dele" : "meu");
      d.innerHTML = sistema ? esc(texto) : `<span class="nick">${esc(quem)}</span> <span class="hr">(${h || hora()})</span>: ${esc(texto)}`;
      log.appendChild(d); log.scrollTop = log.scrollHeight;
    }

    // online = o Aluísio "de verdade" (IA). offline = o algoritmo dele (roteiro + regras).
    const viaIA = () => ALU.bot && ALU.bot.iaLigada && ALU.bot.iaLigada();
    function pintarStatus() {
      const off = !!(ALU.CONFIG && (ALU.CONFIG.api || ALU.CONFIG.chatApi)) && ALU.bot.estaOffline();
      status.querySelector("span").textContent = off ? T("offline · o algoritmo dele responde", "offline · his algorithm is answering") : "online";
      status.classList.toggle("away", off);
    }
    let avisouOff = false;
    function ficouOffline() {
      if (avisouOff || !el.isConnected) return; avisouOff = true;
      pintarStatus();
      linha("", T(`${eu} ficou offline. Ele deixou um algoritmo respondendo por ele 🤖`, `${eu} went offline. He left an algorithm answering for him 🤖`), true);
    }
    ALU.bot.aoFicarOffline && ALU.bot.aoFicarOffline(() => later(ficouOffline, 0));

    function falar(no) {
      const n = NOS[no]; let t = 300;
      opsEl.innerHTML = "";
      pintarStatus();
      n.diz.forEach((frase) => {
        const espera = Math.min(2200, 350 + frase.length * 22);
        later(() => { typing.textContent = T(`${eu} está digitando...`, `${eu} is typing...`); }, t);
        t += espera;
        later(() => { typing.textContent = ""; linha(eu, frase); bip("in"); }, t);
        t += 250;
      });
      later(() => {
        if (n.ausente) { status.querySelector("span").textContent = T("ausente: fui tomar um café ☕", "away: went for a coffee ☕"); status.classList.add("away"); linha("", T(`${eu} está ausente.`, `${eu} is away.`), true); }
        mostrarOps(n.ops);
      }, t + 100);
    }

    // A caixa de texto é de verdade: dá pra escrever o que quiser (o bot responde)
    // ou clicar numa opção, que é "digitada" sozinha e enviada.
    const real = el.querySelector(".chat-real"), historico = [];
    let digitando = null, pensando = false;
    const atualizarEnviar = () => { send.disabled = !real.value.trim() || !!digitando; };
    real.addEventListener("input", atualizarEnviar);
    function mostrarOps(ops) {
      opsEl.innerHTML = ops.map(([txt], i) => `<button class="op" data-i="${i}"><b>${i + 1}</b> ${esc(txt)}</button>`).join("");
      opsEl.querySelectorAll(".op").forEach((b) => (b.onclick = () => escolher(ops[+b.dataset.i])));
      log.scrollTop = log.scrollHeight;
    }
    function escolher([txt, destino]) {
      if (digitando || pensando) return;
      opsEl.innerHTML = "";
      let i = 0; real.value = ""; real.readOnly = true;
      const auto = setInterval(() => {
        if (!vivo) return clearInterval(auto);
        i = Math.min(txt.length, i + 1 + Math.floor(Math.random() * 2)); real.value = txt.slice(0, i); bip("tec");
        if (i >= txt.length) { clearInterval(auto); later(enviar, 350); }
      }, 45);
      digitando = { pular: () => { i = txt.length - 1; } };
      atualizarEnviar();
      function enviar() {
        real.value = ""; real.readOnly = false; digitando = null; atualizarEnviar();
        linha(voce, txt); bip("out");
        if (viaIA() && !destino.startsWith("!")) { conversarIA(txt); return; }
        if (destino === "!doghub" || destino === "!ligadin") { later(() => { ctx.abrir("kez", destino === "!doghub" ? "doghub.com/aluisiodev" : "ligadin.com/in/aluisio-alves"); falar("contato_ok"); }, 300); }
        else if (destino.startsWith("!abrir:")) { const id = destino.slice(7); later(() => { ctx.abrir("proj:" + id); falar("abriu"); }, 300); }
        else later(() => falar(destino), 300);
      }
    }
    async function enviarLivre() {
      const txt = real.value.trim();
      if (!txt || pensando || digitando) return;
      real.value = ""; atualizarEnviar(); linha(voce, txt); bip("out");
      conversarIA(txt);
    }
    async function conversarIA(txt) {
      historico.push({ de: "visitante", texto: txt });
      pensando = true;
      later(() => { typing.textContent = T(`${eu} está digitando...`, `${eu} is typing...`); }, 350);
      let resp;
      try { resp = await ALU.bot.responder(txt, historico); } catch { resp = [T("opa, deu um erro aqui. tenta de novo?", "oops, something broke. try again?")]; }
      let t = 350;
      resp.forEach((frase, i) => {
        t += Math.min(1800, 450 + frase.length * 18);
        later(() => { typing.textContent = i < resp.length - 1 ? T(`${eu} está digitando...`, `${eu} is typing...`) : ""; linha(eu, frase); bip("in"); }, t);
      });
      // vai para o histórico a resposta inteira com a assinatura do servidor (sem ela, o servidor ignora a fala)
      historico.push(resp.sig ? { de: eu, texto: resp.original, sig: resp.sig } : { de: eu, texto: resp.join("\n") });
      later(() => { pensando = false; if (!opsEl.children.length) mostrarOps(NOS.menu.ops); }, t);
    }
    send.onclick = enviarLivre;
    real.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); if (digitando) digitando.pular(); else enviarLivre(); } });
    NOS.menu = { diz: [T("beleza! escolhe aí:", "alright! pick one:")], ops: [[T("quem é você?", "who are you?"), "sobre"], [T("quero ver seus projetos", "i want to see your projects"), "projetos"], [T("como eu falo com você?", "how do i reach you?"), "contato"]] };

    NOS.contato_ok = { diz: [T("abri no Kez(i)avana pra você 😉", "opened it in Kez(i)avana for you 😉")], ops: [[T("quero ver os projetos", "i want to see the projects"), "projetos"], [T("valeu, até mais!", "thanks, see you!"), "tchau"]] };
    NOS.abriu = { diz: [T("abri os detalhes pra você!", "opened the details for you!"), T("quando terminar de ler, volta aqui", "come back here when you're done reading")], ops: [[T("mostra outro projeto", "show another project"), "projetos"], [T("como te acho?", "where can i find you?"), "contato"], [T("valeu, até mais!", "thanks, see you!"), "tchau"]] };

    function tecla(e) {
      if (!el.isConnected || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target.closest && e.target.closest("input,textarea")) return;
      const vis = el.closest(".win, .m-app");
      if (vis && (vis.hidden || (vis.classList.contains("win") && !vis.classList.contains("focus")))) return;
      if (digitando) { e.preventDefault(); digitando.pular(); return; }
      const n = parseInt(e.key, 10), b = opsEl.querySelector(`.op[data-i="${n - 1}"]`);
      if (b) { e.preventDefault(); b.click(); }
    }
    document.addEventListener("keydown", tecla);


    // as mensagens que chegaram pela notificação já aparecem na conversa
    if (!(ALU.chatPre || []).length) NOS.inicio.diz.unshift(T("oiii", "hiii"));
    (ALU.chatPre || []).forEach((m) => linha(eu, m.txt, false, m.hora));
    ALU.chatAberto = true;
    // começa a conversa: com a IA no ar, o próprio Aluísio puxa assunto; senão, o roteiro.
    if (viaIA()) {
      pensando = true;
      later(() => { typing.textContent = T(`${eu} está digitando...`, `${eu} is typing...`); }, 600);
      ALU.bot.iniciar().then((r) => {
        if (!vivo) return;
        if (!r) { pensando = false; typing.textContent = ""; falar("inicio"); return; }
        let t = 300;
        r.forEach((frase, i) => { t += Math.min(1800, 450 + frase.length * 18); later(() => { typing.textContent = i < r.length - 1 ? T(`${eu} está digitando...`, `${eu} is typing...`) : ""; linha(eu, frase); bip("in"); }, t); });
        historico.push(r.sig ? { de: eu, texto: r.original, sig: r.sig } : { de: eu, texto: r.join("\n") });
        later(() => { pensando = false; mostrarOps(NOS.menu.ops); }, t);
      });
    } else later(() => falar("inicio"), 700);
    pintarStatus();
  };
})();
