// Registro de apps e itens do aluOS + os apps "simples" (pastas, bloco de notas, propriedades).
(function () {
  const ALU = window.ALU;
  const P = window.PERFIL, PROJ = window.PROJETOS;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- apps (janelas) ----------
  const APPS = {
    "pasta:sobre":    { titulo: "Sobre mim",   icone: "pasta:sobre",    w: 560, h: 380 },
    "pasta:projetos": { titulo: "Projetos",    icone: "pasta:projetos", w: 620, h: 400 },
    "pasta:contatos": { titulo: "Contatos",    icone: "pasta:contatos", w: 560, h: 360 },
    "pasta:skills":   { titulo: "Skills",      icone: "pasta:skills",   w: 600, h: 380 },
    notas:    { titulo: "sobre_mim.txt - Bloco de notas", curto: "sobre_mim.txt", icone: "notas", w: 560, h: 440 },
    quarto:   { titulo: "quarto_360.png - Visualizador 360°", curto: "quarto_360", icone: "quarto", w: 900, h: 580 },
    kez:      { titulo: "Kez(i)avana", icone: "kez", w: 900, h: 620 },
    peep:     { titulo: "Peep Studio", icone: "peep", w: 920, h: 600 },
    chat:     { titulo: "MessagerTale", icone: "chat", w: 600, h: 520 },
    terminal: { titulo: "Terminal", icone: "terminal", w: 640, h: 420 },
    concord:  { titulo: "Concord", icone: "concord", w: 960, h: 620 },
    lixeira:  { titulo: "Lixeira", icone: "lixeira", w: 460, h: 320 },
    ajustes:  { titulo: "Painel de controle", icone: "ajustes", w: 540, h: 460 },
  };
  PROJ.forEach((p) => (APPS["proj:" + p.id] = { titulo: p.nome, curto: p.curto, projeto: p, w: 760, h: 620 }));
  window.SKILLS.forEach((s) => (APPS["skill:" + s.id] = { titulo: "Propriedades de " + s.nome, curto: s.nome, icone: s.icone, item: s, w: 420, h: 300 }));
  window.CERTIFICADOS.forEach((c) => (APPS["cert:" + c.id] = { titulo: "Propriedades de " + c.nome, curto: c.curto || c.emissor, icone: "cert", item: c, w: 440, h: 300 }));

  // ---------- conteúdo das pastas ----------
  // cada item: { nome, icone, abre: id do app, arg }
  const PASTAS = {
    sobre: () => [
      { nome: "sobre_mim.txt", icone: "notas", abre: "notas" },
      { nome: "quarto_360.png", icone: "quarto", abre: "quarto" },
    ],
    projetos: () => PROJ.map((p) => ({ nome: p.curto, proj: p, abre: "proj:" + p.id })),
    contatos: () => [
      { nome: "LigadIn", icone: "ligadin", abre: "kez", arg: "ligadin.com/in/aluisio-alves" },
      { nome: "DogHub", icone: "doghub", abre: "kez", arg: "doghub.com/aluisiodev" },
      { nome: "MessagerTale", icone: "chat", abre: "chat" },
      ...(P.contatos.email ? [{ nome: "PomboMail", icone: "pombo", href: "mailto:" + P.contatos.email }] : []),
    ],
    skills: () => [
      ...window.SKILLS.map((s) => ({ nome: s.nome, icone: s.icone, abre: "skill:" + s.id })),
      ...window.CERTIFICADOS.map((c) => ({ nome: c.curto || c.emissor, icone: "cert", abre: "cert:" + c.id })),
    ],
  };

  function iconeHTML(id) {
    const a = APPS[id] || {};
    if (a.projeto) return projIcone(a.projeto);
    return `<span class="pxi">${ALU.pix(a.icone || id)}</span>`;
  }
  const projIcone = (p) => `<span class="pxi tile" style="--c1:${p.cor[0]};--c2:${p.cor[1]}"><b>${esc(p.sigla)}</b></span>`;
  const itemIcone = (it) => (it.proj ? projIcone(it.proj) : `<span class="pxi">${ALU.pix(it.icone)}</span>`);

  // ---------- Explorador de pastas ----------
  function renderPasta(el, ctx, nome) {
    const itens = PASTAS[nome]();
    el.innerHTML = `
      <div class="explorer">
        <div class="menubar"><span>Arquivo</span><span>Editar</span><span>Exibir</span><span>Favoritos</span><span>Ajuda</span></div>
        <div class="addr"><span>Endereço</span><div class="addr-box">${ALU.pix("pasta:" + nome)}<span>C:\\Usuários\\Aluísio\\${esc(APPS["pasta:" + nome].titulo)}</span></div></div>
        <div class="ex-main">
          <aside class="ex-side">
            <div class="ex-box"><div class="ex-box-h">Tarefas</div>
              <p>${itens.length} ${itens.length === 1 ? "item" : "itens"}</p>
              <p class="dica">Clique duas vezes para abrir.</p></div>
            <div class="ex-box"><div class="ex-box-h">Outros locais</div>
              ${["sobre", "projetos", "contatos", "skills"].filter((x) => x !== nome).map((x) => `<button class="link" data-pasta="${x}">${esc(APPS["pasta:" + x].titulo)}</button>`).join("")}
            </div>
          </aside>
          <div class="ex-grid">
            ${itens.map((it, i) => `<button class="f-item" data-i="${i}">${itemIcone(it)}<span>${esc(it.nome)}</span></button>`).join("")}
          </div>
        </div>
        <div class="statusbar">${itens.length} objeto(s)</div>
      </div>`;
    const abrirItem = (it) => (it.href ? window.open(it.href, "_blank", "noopener") : ctx.abrir(it.abre, it.arg));
    el.querySelectorAll(".f-item").forEach((b) => {
      const it = itens[+b.dataset.i];
      b.addEventListener("click", () => { el.querySelectorAll(".f-item.sel").forEach((x) => x.classList.remove("sel")); b.classList.add("sel"); if (ctx.mobile) abrirItem(it); });
      b.addEventListener("dblclick", () => abrirItem(it));
      b.addEventListener("keydown", (e) => e.key === "Enter" && abrirItem(it));
    });
    el.querySelectorAll("[data-pasta]").forEach((b) => (b.onclick = () => ctx.abrir("pasta:" + b.dataset.pasta)));
  }

  // ---------- Bloco de notas ----------
  function renderNotas(el) {
    const linhas = [
      `SOBRE MIM`, `=========`, ``,
      `Nome .... ${P.nome}`, `Cargo ... ${P.cargo}`, `Local ... ${P.local}`, ``,
      ...P.bio.flatMap((b) => [b, ""]),
      `Projetos que eu mais gosto:`, ...PROJ.map((p) => `  - ${p.nome}: ${p.resumo}`), ``,
      `Skills: ${window.SKILLS.map((s) => s.nome).join(", ")}`,
      `Cursos: ${window.CERTIFICADOS.map((c) => c.curto || c.emissor).join(", ")}`, ``,
      `PS: tem uma foto do meu quarto aqui na pasta (quarto_360.png).`,
      `Dá pra girar e clicar nas coisas.`,
    ];
    el.innerHTML = `
      <div class="notepad">
        <div class="menubar"><span>Arquivo</span><span>Editar</span><span>Formatar</span><span>Exibir</span><span>Ajuda</span></div>
        <textarea readonly spellcheck="false" aria-label="sobre_mim.txt">${esc(linhas.join("\n"))}</textarea>
      </div>`;
  }

  // ---------- Projeto ----------
  function renderProjeto(el, ctx, p) {
    const T = ALU.T || ((pt) => pt);
    const repo = p.repo.split("/").pop();
    const imgs = p.imagens || [];
    const lista = (xs) => `<ul class="lista">${xs.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>`;
    const selo = (im) => (im.mockup ? `<span class="pj-selo">MOCKUP</span>` : "");
    el.innerHTML = `
      <div class="projeto-wrap">
        <div class="projeto">
          <div class="hero" style="--c1:${p.cor[0]};--c2:${p.cor[1]}">${projIcone(p)}<div><h1>${esc(p.nome)}</h1><p>${esc(p.resumo)}</p></div></div>
          <div class="pad">
            ${p.contexto ? `<p class="pj-ctx"><span class="pj-tag" style="--c1:${p.cor[0]}">${esc(p.contexto.tipo)}</span>${esc(p.contexto.texto)}</p>` : ""}
            ${imgs.length ? `
            <figure class="pj-gal">
              <button class="pj-main" data-i="0" aria-label="${T("Ampliar imagem", "Enlarge image")}"><img src="${esc(imgs[0].src)}" alt="${esc(imgs[0].legenda)}" loading="lazy">${selo(imgs[0])}</button>
              <figcaption>${esc(imgs[0].legenda)}</figcaption>
              ${imgs.length > 1 ? `<div class="pj-thumbs">${imgs.map((im, i) => `<button data-t="${i}" class="${i ? "" : "on"}" aria-label="${esc(im.legenda)}"><img src="${esc(im.src)}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
            </figure>` : ""}
            ${p.problema ? `<fieldset><legend>${T("O problema", "The problem")}</legend><p class="pj-txt">${esc(p.problema)}</p></fieldset>` : ""}
            <fieldset><legend>${T("Como funciona", "How it works")}</legend><p class="pj-txt">${esc(p.descricao)}</p></fieldset>
            <fieldset><legend>${T("Destaques", "Highlights")}</legend>${lista(p.destaques)}</fieldset>
            ${p.aprendizados ? `<fieldset><legend>${T("O que aprendi", "What I learned")}</legend>${lista(p.aprendizados)}</fieldset>` : ""}
            ${p.equipe ? `<fieldset><legend>${T("Equipe", "Team")}</legend><div class="chips">${p.equipe.map((n) => `<span class="chip">${esc(n)}</span>`).join("")}</div></fieldset>` : ""}
            <fieldset><legend>Stack</legend><div class="chips">${p.stack.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div></fieldset>
            <div class="row">
              ${p.demo ? `<a class="btn real" href="${esc(p.demo)}" target="_blank" rel="noopener">${ALU.pix("kez")}<span>${T("Abrir site", "Open site")}</span></a>` : ""}
              <button class="btn" data-a="doghub">${ALU.pix("doghub")}<span>${T("Ver no DogHub", "See on DogHub")}</span></button>
              <button class="btn" data-a="peep">${ALU.pix("peep")}<span>${T("Abrir no Peep Studio", "Open in Peep Studio")}</span></button>
            </div>
          </div>
        </div>
        <div class="pj-lb" hidden role="dialog" aria-label="${T("Imagem ampliada", "Enlarged image")}">
          <button class="pj-x" aria-label="${T("Fechar", "Close")}">×</button>
          <button class="pj-nav" data-d="-1" aria-label="${T("Anterior", "Previous")}">◀</button>
          <figure><img alt=""><figcaption></figcaption></figure>
          <button class="pj-nav" data-d="1" aria-label="${T("Próxima", "Next")}">▶</button>
        </div>
      </div>`;
    el.querySelector('[data-a="doghub"]').onclick = () => ctx.abrir("kez", "doghub.com/aluisiodev/" + repo);
    el.querySelector('[data-a="peep"]').onclick = () => ctx.abrir("peep", "projetos/" + p.id + ".md");
    if (!imgs.length) return;
    const main = el.querySelector(".pj-main"), cap = el.querySelector(".pj-gal figcaption"), lb = el.querySelector(".pj-lb");
    let atual = 0;
    const mostrar = (i) => {
      atual = (i + imgs.length) % imgs.length; const im = imgs[atual];
      main.querySelector("img").src = im.src; main.querySelector("img").alt = im.legenda; main.classList.toggle("cel", !!im.celular);
      main.querySelector(".pj-selo")?.remove(); main.insertAdjacentHTML("beforeend", selo(im));
      cap.textContent = im.legenda;
      el.querySelectorAll(".pj-thumbs button").forEach((b, j) => b.classList.toggle("on", j === atual));
      if (!lb.hidden) ampliar();
    };
    const ampliar = () => { const im = imgs[atual]; lb.querySelector("img").src = im.src; lb.querySelector("img").alt = im.legenda; lb.querySelector("figcaption").textContent = `${im.legenda}${im.mockup ? " · mockup" : ""}  (${atual + 1}/${imgs.length})`; lb.hidden = false; lb.querySelector(".pj-x").focus(); };
    main.classList.toggle("cel", !!imgs[0].celular);
    el.querySelectorAll(".pj-thumbs button").forEach((b) => (b.onclick = () => mostrar(+b.dataset.t)));
    main.onclick = ampliar;
    lb.querySelectorAll(".pj-nav").forEach((b) => (b.onclick = (e) => { e.stopPropagation(); mostrar(atual + +b.dataset.d); }));
    lb.onclick = (e) => { if (e.target === lb || e.target.classList.contains("pj-x")) lb.hidden = true; };
    lb.onkeydown = (e) => { if (e.key === "Escape") lb.hidden = true; else if (e.key === "ArrowLeft") mostrar(atual - 1); else if (e.key === "ArrowRight") mostrar(atual + 1); };
    lb.querySelectorAll(".pj-nav").forEach((b) => (b.hidden = imgs.length < 2));
  }

  // ---------- Propriedades (skill / certificado) ----------
  function renderProps(el, ctx, a) {
    const it = a.item, cert = "emissor" in it;
    el.innerHTML = `
      <div class="props">
        <div class="tabs"><span class="on">Geral</span></div>
        <div class="props-body">
          <div class="props-top">${ALU.pix(a.icone)}<strong>${esc(it.nome)}</strong></div>
          <hr>
          <dl>
            <dt>Tipo:</dt><dd>${cert ? ALU.T("Curso", "Course") : ALU.T("Habilidade", "Skill")}</dd>
            ${cert && it.emissor ? `<dt>Emissor:</dt><dd>${esc(it.emissor)}</dd>` : ""}
            <dt>Descrição:</dt><dd>${esc(cert ? it.detalhe : it.texto)}</dd>
          </dl>
        </div>
        <div class="props-foot">
          ${cert ? `<button class="btn" data-a="li">Ver no LigadIn</button>` : ""}
          <button class="btn" data-a="ok">OK</button>
        </div>
      </div>`;
    el.querySelector('[data-a="ok"]').onclick = () => ctx.fechar();
    const li = el.querySelector('[data-a="li"]'); if (li) li.onclick = () => ctx.abrir("kez", "ligadin.com/in/aluisio-alves");
  }

  const LIXO = [
    ["bugs-de-ontem.txt", "1. botão não clica\n2. botão clica duas vezes\n3. botão clica sozinho às 3h da manhã\n\nstatus: virou feature."],
    ["TODO-final-final-v3.md", "- [x] terminar o portfolio\n- [ ] terminar o portfolio de verdade\n- [ ] parar de mexer no portfolio"],
    ['console.log("aqui").js', 'console.log("aqui");\nconsole.log("aqui 2");\nconsole.log("AQUI PELO AMOR");\n// funcionou e eu não sei por quê'],
    ["segredo.txt", "Se você chegou até aqui, tenta digitar quack em qualquer lugar.\nOu savana.\nOu aquele código antigo com as setas…"],
  ];
  if (ALU.lang === "en") LIXO.splice(0, LIXO.length,
    ["yesterdays-bugs.txt", "1. button doesn't click\n2. button clicks twice\n3. button clicks by itself at 3 AM\n\nstatus: it's a feature now."],
    ["TODO-final-final-v3.md", "- [x] finish the portfolio\n- [ ] actually finish the portfolio\n- [ ] stop tweaking the portfolio"],
    ['console.log("here").js', 'console.log("here");\nconsole.log("here 2");\nconsole.log("HERE FOR THE LOVE OF GOD");\n// it worked and I don\'t know why'],
    ["secret.txt", "If you made it this far, try typing quack anywhere.\nOr savana.\nOr that old code with the arrow keys…"]);
  function renderLixeira(el) {
    el.innerHTML = `<div class="pad">
      <p>${LIXO.length} itens · clique para espiar</p>
      <ul class="lixo">${LIXO.map(([n], i) => `<li><button data-i="${i}">${ALU.pix("notas")} ${esc(n)}</button></li>`).join("")}</ul>
      <pre class="lixo-txt" hidden></pre>
      <p class="muted">Esvaziar? Melhor não. Eles me ensinaram muito.</p></div>`;
    const txt = el.querySelector(".lixo-txt");
    el.querySelectorAll(".lixo button").forEach((b) => (b.onclick = () => {
      txt.hidden = false; txt.textContent = LIXO[+b.dataset.i][1];
      ALU.conquista && ALU.conquista("lixeira", "Revirando o lixo", "Abriu um arquivo da Lixeira.");
    }));
  }

  function renderAjustes(el) {
    const W = ALU.WALLPAPERS;
    el.innerHTML = `
      <div class="pad">
        <fieldset><legend>Tema</legend>
          <div class="temas">${(ALU.TEMAS || []).map(([t, n]) => `<button class="btn tema-opt" data-tema="${t}"><span class="tema-prev ${t}"></span><span>${esc(n)}</span></button>`).join("")}</div></fieldset>
        <fieldset><legend>Papel de parede</legend>
          <div class="walls">${W.map((w, i) => `<button class="wall-opt" data-w="${i}"><span class="wall-prev ${w.cls}"></span><span>${esc(w.nome)}</span></button>`).join("")}</div></fieldset>
        <fieldset><legend>Cor das janelas</legend>
          <div class="accents">${ALU.CORES.map((c) => `<button class="acc" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`).join("")}</div></fieldset>
        <fieldset><legend>Idioma</legend><button class="btn${ALU.lang === "pt" ? " real" : ""}" data-lang="pt">🇧🇷 Português</button> <button class="btn${ALU.lang === "en" ? " real" : ""}" data-lang="en">🇺🇸 English</button></fieldset>
        <fieldset><legend>Sistema</legend>
          <p class="muted">aluOS 2.0 · pixel por pixel, em HTML, CSS e JavaScript.</p>
          <button class="btn" data-act="reboot">Reiniciar</button> <button class="btn" data-act="desligar">Desligar</button></fieldset>
        <fieldset><legend>Conquistas</legend><div class="conq-lista"></div></fieldset>
      </div>`;
    const F = ALU.conquistasFeitas ? ALU.conquistasFeitas() : {}, T = ALU.CONQUISTAS || [];
    el.querySelector(".conq-lista").innerHTML = `<p>${Object.keys(F).length} de ${T.length} encontradas</p><ul>${T.map(([id, n]) => F[id] ? `<li class="ok">🏆 ${esc(n)}</li>` : `<li>🔒 ???</li>`).join("")}</ul>`;
    el.querySelector('[data-act="desligar"]').onclick = () => ALU.desligar && ALU.desligar();
    const marcar = () => {
      el.querySelectorAll(".wall-opt").forEach((b) => b.classList.toggle("on", +b.dataset.w === ALU.estado.wall));
      el.querySelectorAll(".acc").forEach((b) => b.classList.toggle("on", b.dataset.c === ALU.estado.accent));
      el.querySelectorAll(".tema-opt").forEach((b) => b.classList.toggle("on", b.dataset.tema === ALU.estado.tema));
      ALU.fundos && ALU.fundos.previas(el); // as miniaturas dos papéis de parede seguem o estilo do tema
    };
    el.querySelectorAll(".wall-opt").forEach((b) => (b.onclick = () => { ALU.setWall(+b.dataset.w); marcar(); }));
    el.querySelectorAll(".acc").forEach((b) => (b.onclick = () => { ALU.setAccent(b.dataset.c); marcar(); }));
    el.querySelectorAll(".tema-opt").forEach((b) => (b.onclick = () => { ALU.setTema(b.dataset.tema); marcar(); ALU.conquista && b.dataset.tema !== "pixel" && ALU.conquista("tema", "Nostalgia de 2009", "Trocou o tema do aluOS."); }));
    el.querySelector('[data-act="reboot"]').onclick = () => ALU.reboot();
    el.querySelectorAll("[data-lang]").forEach((b) => (b.onclick = () => b.dataset.lang !== ALU.lang && ALU.setLang(b.dataset.lang)));
    marcar();
  }

  function render(id, el, ctx, arg) {
    const a = APPS[id];
    if (!a) return;
    if (a.projeto) return renderProjeto(el, ctx, a.projeto);
    if (a.item) return renderProps(el, ctx, a);
    if (id.startsWith("pasta:")) return renderPasta(el, ctx, id.slice(6));
    const f = { notas: renderNotas, lixeira: renderLixeira, ajustes: renderAjustes, terminal: ALU.terminal, chat: ALU.chat, kez: ALU.kez, peep: ALU.peep, quarto: ALU.quarto, concord: ALU.concord }[id];
    // apps que só existem no celular (Mensagens, Banco, Toques) também ficam em ALU.APPS: no desktop, em vez de travar,
    // mostra um aviso (antes "abrir sms" no terminal dava erro e deixava a janela em branco)
    if (!f) { el.innerHTML = `<p class="pad">${ALU.T("Esse app só existe no celular. Abra o aluOS no telefone 📱", "This app only exists on the phone. Open aluOS on your phone 📱")}</p>`; return; }
    return f(el, ctx, arg);
  }

  Object.assign(ALU, { APPS, PASTAS, iconeHTML, render, esc });
})();
