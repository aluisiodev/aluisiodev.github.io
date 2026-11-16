// Kez(i)avana: o navegador da savana. Só abre as páginas "bootleg" do aluOS;
// os botões "Sair da savana" levam para os sites de verdade numa aba nova.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s);
  const P = window.PERFIL, PROJ = window.PROJETOS;
  const repoDe = (p) => p.repo.replace("https://github.com/aluisiodev/", "");
  const real = (href, txt) => `<a class="btn real" href="${esc(href)}" target="_blank" rel="noopener">${esc(txt)} ↗</a>`;

  const PAGINAS = [
    {
      re: /^(kez:\/\/)?(inicio)?$/, titulo: () => "Kez(i)avana",
      html: () => `
        <div class="kz-home">
          <div class="kz-logo">${ALU.pix("kez")}<h1>Kez<span>(i)</span>avana</h1></div>
          <p class="kz-sub">o navegador que atravessa a savana da internet</p>
          <form class="kz-busca"><input placeholder="Buscar na savana… (tente: nexo, doghub, ligadin)" aria-label="Buscar"><button class="btn">Rugir</button></form>
          <div class="kz-atalhos">
            <button data-ir="ligadin.com/in/aluisio-alves">${ALU.pix("ligadin")}<span>LigadIn</span></button>
            <button data-ir="doghub.com/aluisiodev">${ALU.pix("doghub")}<span>DogHub</span></button>
            ${ALU.kezSites.filter((x) => x.atalho).map((x) => `<button data-ir="${x.atalho.url}">${x.atalho.icone}<span>${esc(x.atalho.nome)}</span></button>`).join("")}
            ${PROJ.map((p) => `<button data-ir="doghub.com/aluisiodev/${repoDe(p)}">${ALU.iconeHTML("proj:" + p.id)}<span>${esc(p.curto)}</span></button>`).join("")}
          </div>
        </div>`,
    },
    {
      re: /^ligadin\.com\/in\/aluisio-alves\/?$/, titulo: () => `${P.nome} | LigadIn`,
      html: () => `
        <div class="li-page">
          <header class="li-top"><span class="li-logo">${ALU.pix("ligadin")}<b>LigadIn</b></span><span class="li-nav">Início · Rede · Vagas · Mensagens</span></header>
          <div class="li-card">
            <div class="li-capa"></div>
            <img class="li-foto" src="${esc(P.foto)}" alt="Foto de ${esc(P.nome)}">
            <h1>${esc(P.nome)}</h1>
            <p>${esc(P.cargo)} · ${esc(P.local)}</p>
            <p class="muted">500+ conexões (na savana)</p>
            <div class="row">${real(P.contatos.linkedin, "Sair da savana: abrir perfil real")}<button class="btn sec" data-ir="chat">Mandar mensagem</button></div>
          </div>
          <div class="li-card"><h2>Sobre</h2>${P.bio.map((b) => `<p>${esc(b)}</p>`).join("")}</div>
          <div class="li-card" id="certs"><h2>Licenças e certificados</h2>
            ${window.CERTIFICADOS.map((c) => `<div class="li-item">${ALU.pix("cert")}<div><strong>${esc(c.nome)}</strong><small>${esc(c.emissor)}</small></div></div>`).join("")}</div>
          <div class="li-card"><h2>Competências</h2>${window.SKILLS.map((s) => `<div class="li-item">${ALU.pix(s.icone)}<div><strong>${esc(s.nome)}</strong></div></div>`).join("")}</div>
        </div>`,
    },
    {
      re: /^doghub\.com\/aluisiodev\/?$/, titulo: () => "aluisiodev · DogHub",
      html: () => `
        <div class="dh-page">
          <header class="dh-top">${ALU.pix("doghub")}<b>DogHub</b><span>Onde o código vira amigo do homem</span></header>
          <div class="dh-wrap">
            <aside class="dh-perfil">
              <img src="${esc(P.foto)}" alt="Foto de ${esc(P.nome)}">
              <h1>${esc(P.nome)}</h1><p class="muted">aluisiodev</p>
              ${real(P.contatos.github, "Sair da savana: DogHub real")}
            </aside>
            <section class="dh-repos"><h2>Repositórios fixados</h2>
              ${PROJ.map((p) => `<button class="dh-repo" data-ir="doghub.com/aluisiodev/${repoDe(p)}"><strong>${esc(repoDe(p))}</strong><p>${esc(p.resumo)}</p><small><i style="background:${p.cor[0]}"></i>${esc(p.stack[0])}</small></button>`).join("")}
            </section>
          </div>
        </div>`,
    },
    {
      re: /^doghub\.com\/aluisiodev\/([\w.-]+)\/?$/, titulo: (m) => `aluisiodev/${m[1]} · DogHub`,
      html: (m) => {
        const p = PROJ.find((x) => repoDe(x).toLowerCase() === m[1].toLowerCase());
        if (!p) return null;
        return `
        <div class="dh-page">
          <header class="dh-top">${ALU.pix("doghub")}<b>DogHub</b><span><button class="link" data-ir="doghub.com/aluisiodev">aluisiodev</button> / <b>${esc(repoDe(p))}</b></span></header>
          <div class="dh-readme">
            <div class="dh-file">README.md</div>
            <div class="pad">
              <h1>${esc(p.nome)}</h1><p>${esc(p.descricao)}</p>
              <h3>Destaques</h3><ul class="lista">${p.destaques.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
              <h3>Stack</h3><div class="chips">${p.stack.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
              <div class="row">${real(p.repo, "Sair da savana: ver código real")}${p.demo ? real(p.demo, "Abrir site") : ""}<button class="btn sec" data-proj="${p.id}">Abrir no Peep Studio</button></div>
            </div>
          </div>
        </div>`;
      },
    },
  ];

  // sites extras (js/sites.js) entram aqui
  ALU.kezSites = ALU.kezSites || [];
  const todas = () => [...ALU.kezSites, ...PAGINAS.slice(1), PAGINAS[0]];

  const norm = (u) => String(u || "").trim().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/#.*$/, "");

  ALU.kez = function (el, ctx, inicial) {
    el.innerHTML = `
      <div class="kz">
        <div class="kz-tabs"><div class="kz-tab on">${ALU.pix("kez")}<span class="kz-tt">Kez(i)avana</span></div><div class="kz-tab nova">+</div></div>
        <div class="kz-bar">
          <button data-n="back" aria-label="Voltar">◀</button><button data-n="fwd" aria-label="Avançar">▶</button><button data-n="home" aria-label="Início">⌂</button>
          <form class="kz-url"><span>${ALU.pix("kez")}</span><input aria-label="Endereço" spellcheck="false"></form>
          <button data-n="go" class="kz-go">Ir</button>
        </div>
        <div class="kz-view"></div>
        <div class="kz-status">Pronto</div>
      </div>`;
    const view = el.querySelector(".kz-view"), input = el.querySelector(".kz-url input"), tt = el.querySelector(".kz-tt"), status = el.querySelector(".kz-status");
    const hist = []; let pos = -1; let limpar = null;
    const obsK = new MutationObserver(() => { if (!el.isConnected) { obsK.disconnect(); if (limpar) try { limpar(); } catch {} } });
    obsK.observe(document.body, { childList: true, subtree: true });

    function mostrar(url) {
      url = norm(url);
      input.value = url ? "kez://" + url.replace(/^kez:\/\//, "") : "kez://inicio";
      let html = null, titulo = "Página não encontrada", achou = null, mm = null;
      for (const pg of todas()) { const m = url.match(pg.re); if (m) { html = pg.html(m); if (html) { titulo = pg.titulo(m); achou = pg; mm = m; break; } } }
      if (limpar) { try { limpar(); } catch {} limpar = null; }
      if (!html) html = `<div class="kz-404"><div class="kz-girafa">🦒</div><h1>A savana não encontrou essa página</h1><p>Nenhum leão, nenhuma zebra, nenhum <code>${esc(url)}</code>.</p><button class="btn" data-ir="inicio">Voltar para o início</button></div>`;
      status.textContent = "Carregando…"; view.classList.add("loading");
      setTimeout(() => {
        view.innerHTML = html; view.scrollTop = 0; tt.textContent = titulo; view.classList.remove("loading"); status.textContent = "Pronto";
        if (achou && achou.init) limpar = achou.init(view, ctx, mm, ir) || null;
        if (!achou && ALU.conquista) ALU.conquista("404", "Perdido na savana", "Você achou a girafa da página 404.");
        view.querySelectorAll("[data-ir]").forEach((b) => (b.onclick = (e) => { e.preventDefault(); b.dataset.ir === "chat" ? ctx.abrir("chat") : ir(b.dataset.ir); }));
        view.querySelectorAll("[data-proj]").forEach((b) => (b.onclick = () => ctx.abrir("peep", "projetos/" + b.dataset.proj + ".md")));
        const busca = view.querySelector(".kz-busca");
        if (busca) busca.onsubmit = (e) => {
          e.preventDefault();
          const q = busca.querySelector("input").value.toLowerCase().trim();
          if (!q) return;
          if (/lig|linked/.test(q)) return ir("ligadin.com/in/aluisio-alves");
          const p = PROJ.find((x) => x.nome.toLowerCase().includes(q) || x.id.includes(q) || repoDe(x).toLowerCase().includes(q));
          if (p) return ir("doghub.com/aluisiodev/" + repoDe(p));
          if (/dog|git/.test(q)) return ir("doghub.com/aluisiodev");
          if (/you|video|vídeo|tube/.test(q)) return ir("youinthescreenofcomputerorphone.com");
          if (/mail|imai|email/.test(q)) return ir("imaiu.com");
          if (/jogo|game|clica/.test(q)) return ir("clicajogos.com");
          ir(q);
        };
        const ancora = url.includes("ligadin") && inicial && String(inicial).includes("#certs") && view.querySelector("#certs");
        if (ancora) ancora.scrollIntoView();
      }, 220);
    }
    function ir(url) { hist.splice(pos + 1); hist.push(url); pos = hist.length - 1; mostrar(url); }
    el.querySelector(".kz-url").onsubmit = (e) => { e.preventDefault(); ir(input.value.replace(/^kez:\/\//, "")); };
    el.querySelector('[data-n="go"]').onclick = () => ir(input.value.replace(/^kez:\/\//, ""));
    el.querySelector('[data-n="back"]').onclick = () => pos > 0 && mostrar(hist[--pos]);
    el.querySelector('[data-n="fwd"]').onclick = () => pos < hist.length - 1 && mostrar(hist[++pos]);
    el.querySelector('[data-n="home"]').onclick = () => ir("inicio");
    ir(inicial || "inicio");
    return { ir: (u) => ir(u || "inicio") };
  };
})();
