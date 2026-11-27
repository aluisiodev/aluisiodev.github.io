// Kez(i)avana: o navegador da savana. Só abre as páginas "bootleg" do aluOS;
// os botões "Sair da savana" levam para os sites de verdade numa aba nova.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s), T = (pt, en) => (ALU.lang === "en" ? en : pt);
  const P = window.PERFIL, PROJ = window.PROJETOS;
  const repoDe = (p) => p.repo.split("/").pop();
  // texto do "Sobre" do LigadIn: blocos separados por linha em branco, "## " = subtítulo, "- " = item
  const sobreHTML = (txt) => txt.split(/\n\s*\n/).map((bloco) => {
    let h = "", lista = [];
    const fecha = () => { if (lista.length) h += `<ul>${lista.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`; lista = []; };
    bloco.split("\n").forEach((l) => {
      if (l.startsWith("- ")) return lista.push(l.slice(2));
      fecha();
      h += l.startsWith("## ") ? `<h3>${esc(l.slice(3))}</h3>` : `<p>${esc(l)}</p>`;
    });
    fecha();
    return h;
  }).join("");
  const real = (href, txt) => `<a class="btn real" href="${esc(href)}" target="_blank" rel="noopener">${esc(txt)} ↗</a>`;

  const PAGINAS = [
    {
      re: /^(kez:\/\/)?(inicio)?$/, titulo: () => "Kez(i)avana",
      html: () => `
        <div class="kz-home">
          <div class="kz-logo">${ALU.pix("kez")}<h1>Kez<span>(i)</span>avana</h1></div>
          <p class="kz-sub">${T("o navegador que atravessa a savana da internet", "the browser that crosses the internet savanna")}</p>
          <form class="kz-busca"><input placeholder="${T("Buscar na savana… (tente: deskmate, doghub, ligadin)", "Search the savanna… (try: deskmate, doghub, ligadin)")}" aria-label="${T("Buscar", "Search")}"><button class="btn">${T("Rugir", "Roar")}</button></form>
          <div class="kz-atalhos">
            <button data-ir="ligadin.com/feed">${ALU.pix("ligadin")}<span>LigadIn</span></button>
            <button data-ir="doghub.com/aluisiodev">${ALU.pix("doghub")}<span>DogHub</span></button>
            ${ALU.kezSites.filter((x) => x.atalho).map((x) => `<button data-ir="${x.atalho.url}">${x.atalho.icone}<span>${esc(x.atalho.nome)}</span></button>`).join("")}
            ${PROJ.map((p) => `<button data-ir="doghub.com/aluisiodev/${repoDe(p)}">${ALU.iconeHTML("proj:" + p.id)}<span>${esc(p.curto)}</span></button>`).join("")}
          </div>
        </div>`,
    },
    {
      re: /^ligadin\.com\/in\/aluisio-alves\/?$/, titulo: () => `${P.nomeCompleto || P.nome} | LigadIn`,
      html: () => `
        <div class="li-page">
          <header class="li-top"><span class="li-logo">${ALU.pix("ligadin")}<b>LigadIn</b></span><span class="li-nav"><button class="link" data-ir="ligadin.com/feed">${T("Início", "Home")}</button> · ${T("Rede · Vagas · Mensagens", "Network · Jobs · Messaging")} · <b>${T("Eu", "Me")}</b></span></header>
          <div class="li-card">
            <div class="li-capa"></div>
            <img class="li-foto" src="${esc(P.foto)}" alt="${T("Foto de", "Photo of")} ${esc(P.nome)}">
            <h1>${esc(P.nomeCompleto || P.nome)}</h1>
            <p>${esc(P.headline || P.cargo)}</p>
            <p class="muted">${esc(P.local)} · ${T("500+ conexões (na savana)", "500+ connections (in the savanna)")}</p>
            <div class="row">${real(P.contatos.linkedin, T("Sair da savana: abrir perfil real", "Leave the savanna: open real profile"))}<button class="btn sec" data-ir="chat">${T("Mandar mensagem", "Message")}</button></div>
          </div>
          <div class="li-card li-sobre"><h2>${T("Sobre", "About")}</h2>${window.SOBRE_LIGADIN ? sobreHTML(window.SOBRE_LIGADIN) : P.bio.map((b) => `<p>${esc(b)}</p>`).join("")}</div>
          ${(window.POSTS_LIGADIN || []).length ? `<div class="li-card"><h2>${T("Atividade", "Activity")}</h2>${window.POSTS_LIGADIN.map((p) => `<div class="li-post"><small class="muted">${esc(p.autor || P.nomeCompleto || P.nome)}${p.colab ? T(" · com ", " · with ") + esc(p.colab) : ""} · ${esc(p.quando || "")}</small><p class="li-post-txt">${esc(p.texto).replace(/\n/g, "<br>")}</p></div>`).join("")}<button class="link" data-ir="ligadin.com/feed">${T("Ver no feed →", "See on feed →")}</button></div>` : ""}
          ${(window.EXPERIENCIAS || []).length ? `<div class="li-card"><h2>${T("Experiência", "Experience")}</h2>${window.EXPERIENCIAS.map((x) => `<div class="li-item"><span class="li-emp">💼</span><div><strong>${esc(x.cargo)}</strong><small>${esc(x.empresa)}${x.tipo ? " · " + esc(x.tipo) : ""}</small><small>${esc(x.periodo)}</small></div></div>`).join("")}</div>` : ""}
          <div class="li-card" id="certs"><h2>${T("Licenças e certificações", "Licenses & certifications")}</h2>
            ${window.CERTIFICADOS.map((c) => `<div class="li-item">${ALU.pix("cert")}<div><strong>${esc(c.nome)}</strong>${c.emissor ? `<small>${esc(c.emissor)}</small>` : ""}</div></div>`).join("")}</div>
          <div class="li-card"><h2>${T("Competências", "Skills")}</h2>${window.SKILLS.map((s) => `<div class="li-item">${ALU.pix(s.icone)}<div><strong>${esc(s.nome)}</strong></div></div>`).join("")}</div>
        </div>`,
    },
    {
      re: /^doghub\.com\/aluisiodev\/?$/, titulo: () => "aluisiodev · DogHub",
      html: () => `
        <div class="dh-page">
          <header class="dh-top">${ALU.pix("doghub")}<b>DogHub</b><span>${T("Onde o código vira amigo do homem", "Where code becomes man's best friend")}</span></header>
          <div class="dh-wrap">
            <aside class="dh-perfil">
              <img src="${esc(P.foto)}" alt="${T("Foto de", "Photo of")} ${esc(P.nome)}">
              <h1>${esc(P.nome)}</h1><p class="muted">aluisiodev</p>
              ${real(P.contatos.github, T("Sair da savana: DogHub real", "Leave the savanna: real DogHub"))}
            </aside>
            <section class="dh-repos"><h2>${T("Repositórios fixados", "Pinned repositories")}</h2>
              ${PROJ.map((p) => `<button class="dh-repo" data-ir="doghub.com/aluisiodev/${repoDe(p)}"><strong>${esc(repoDe(p))}</strong><p>${esc(p.resumo)}</p><small><i style="background:${p.cor[0]}"></i>${esc(p.stack[0])}</small></button>`).join("")}
            </section>
          </div>
          <section class="dh-stats" hidden></section>
        </div>`,
      // estatísticas reais do GitHub, pelo servidor do aluOS
      init: (view) => {
        const api = ALU.CONFIG && ALU.CONFIG.api, box = view.querySelector(".dh-stats");
        if (!box) return;
        let vivo = true;
        const CORES = { TypeScript: "#3178c6", JavaScript: "#f1e05a", "C#": "#178600", Go: "#00ADD8", Python: "#3572A5", HTML: "#e34c26", CSS: "#563d7c", Java: "#b07219", Shell: "#89e051" };
        const quando = (iso) => { const d = Math.max(0, Math.round((Date.now() - new Date(iso)) / 864e5)); return ALU.lang === "en" ? (d === 0 ? "today" : d === 1 ? "yesterday" : d < 30 ? `${d} days ago` : d < 365 ? `${Math.round(d / 30)} months ago` : `${Math.round(d / 365)} years ago`) : d === 0 ? "hoje" : d === 1 ? "ontem" : d < 30 ? `há ${d} dias` : d < 365 ? `há ${Math.round(d / 30)} meses` : `há ${Math.round(d / 365)} anos`; };
        // 1º o servidor do aluOS (com cache e gráfico de contribuições); se ele não responder, o GitHub direto do navegador
        const direto = async () => {
          const H = { Accept: "application/vnd.github+json" }, user = "aluisiodev";
          const u = await fetch(`https://api.github.com/users/${user}`, { headers: H }); if (!u.ok) return null;
          const perfil = await u.json();
          const repos = await (await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed&type=owner`, { headers: H })).json();
          const meus = (Array.isArray(repos) ? repos : []).filter((r) => !r.fork), ling = {};
          meus.forEach((r) => { if (r.language) ling[r.language] = (ling[r.language] || 0) + 1; });
          return { perfil: { repos: perfil.public_repos, seguidores: perfil.followers, desde: perfil.created_at }, estrelas: meus.reduce((a, r) => a + r.stargazers_count, 0),
            linguagens: Object.entries(ling).sort((a, b) => b[1] - a[1]).slice(0, 6),
            recentes: meus.slice(0, 6).map((r) => ({ nome: r.name, desc: r.description, lang: r.language, estrelas: r.stargazers_count, atualizado: r.pushed_at, url: r.html_url })) };
        };
        const CHAVE = "alu.github.cache";
        const buscar = async () => {
          try { const c = JSON.parse(sessionStorage.getItem(CHAVE)); if (c && Date.now() - c.t < 36e5) return c.g; } catch {}
          let g = null;
          if (api) g = await fetch(String(api).replace(/\/+$/, "") + "/github").then((r) => (r.ok ? r.json() : null)).catch(() => null);
          if (!g || !g.perfil) g = await direto().catch(() => null);
          if (g && g.perfil) try { sessionStorage.setItem(CHAVE, JSON.stringify({ t: Date.now(), g })); } catch {}
          return g;
        };
        buscar().then((g) => {
          if (!vivo || !g || !g.perfil) return;
          const totL = g.linguagens.reduce((a, [, n]) => a + n, 0) || 1;
          const desde = g.perfil.desde ? new Date(g.perfil.desde).getFullYear() : "";
          const contrib = g.contribuicoes ? `<div class="dh-contrib"><h3>${g.contribuicoes.total} ${T("contribuições no último ano", "contributions in the last year")}</h3><div class="dh-graf">${g.contribuicoes.semanas.map((w) => `<div>${w.map((n) => `<i class="n${n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 10 ? 3 : 4}" title="${n}"></i>`).join("")}</div>`).join("")}</div></div>` : "";
          box.innerHTML = `
            <h2>📊 ${T("Estatísticas reais", "Real stats")} <small>${T("(direto do GitHub, sem filtro da savana)", "(straight from GitHub, no savanna filter)")}</small></h2>
            <div class="dh-nums">
              <div><b>${g.perfil.repos}</b><span>${T("repositórios", "repositories")}</span></div><div><b>${g.estrelas}</b><span>${T("estrelas", "stars")}</span></div>
              <div><b>${g.perfil.seguidores}</b><span>${T("seguidores", "followers")}</span></div><div><b>${desde}</b><span>${T("no GitHub desde", "on GitHub since")}</span></div>
            </div>
            ${g.linguagens.length ? `<div class="dh-ling"><div class="dh-barra">${g.linguagens.map(([l, n]) => `<i style="flex:${n};background:${CORES[l] || "#8b949e"}" title="${esc(l)}"></i>`).join("")}</div>
              <ul>${g.linguagens.map(([l, n]) => `<li><i style="background:${CORES[l] || "#8b949e"}"></i>${esc(l)} <span>${Math.round((n / totL) * 100)}%</span></li>`).join("")}</ul></div>` : ""}
            ${contrib}
            <h3>${T("Mexeu por último", "Recently updated")}</h3>
            <ul class="dh-rec">${g.recentes.map((r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.nome)} ↗</a><p>${esc(r.desc || T("Sem descrição (ainda).", "No description (yet)."))}</p><small>${r.lang ? `<i style="background:${CORES[r.lang] || "#8b949e"}"></i>${esc(r.lang)} · ` : ""}★ ${r.estrelas} · ${T("atualizado", "updated")} ${quando(r.atualizado)}</small></li>`).join("")}</ul>`;
          box.hidden = false;
        }).catch(() => {});
        return () => { vivo = false; };
      },
    },
    {
      re: /^doghub\.com\/aluisiodev\/([\w.-]+)\/?$/, titulo: (m) => `aluisiodev/${m[1]} · DogHub`,
      html: (m) => {
        const p = PROJ.find((x) => repoDe(x).toLowerCase() === m[1].toLowerCase());
        if (!p) return null;
        return `
        <div class="dh-page">
          <header class="dh-top">${ALU.pix("doghub")}<b>DogHub</b><span>${p.repo.split("/")[3] === "aluisiodev" ? `<button class="link" data-ir="doghub.com/aluisiodev">aluisiodev</button>` : esc(p.repo.split("/")[3])} / <b>${esc(repoDe(p))}</b></span></header>
          <div class="dh-readme">
            <div class="dh-file">README.md</div>
            <div class="pad">
              <h1>${esc(p.nome)}</h1>${p.contexto ? `<p><b>${esc(p.contexto.tipo)}.</b> ${esc(p.contexto.texto)}</p>` : ""}
              ${(p.imagens || [])[0] ? `<p><img class="dh-shot" src="${esc(p.imagens[0].src)}" alt="${esc(p.imagens[0].legenda)}" loading="lazy"></p>` : ""}
              <p>${esc(p.descricao)}</p>
              <h3>${T("Destaques", "Highlights")}</h3><ul class="lista">${p.destaques.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
              <h3>Stack</h3><div class="chips">${p.stack.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
              <div class="row">${real(p.repo, T("Sair da savana: ver código real", "Leave the savanna: see real code"))}${p.demo ? real(p.demo, T("Abrir site", "Open site")) : ""}<button class="btn sec" data-proj="${p.id}">${T("Abrir no Peep Studio", "Open in Peep Studio")}</button></div>
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
          <button data-n="back" aria-label="${T("Voltar", "Back")}">◀</button><button data-n="fwd" aria-label="${T("Avançar", "Forward")}">▶</button><button data-n="home" aria-label="${T("Início", "Home")}">⌂</button>
          <form class="kz-url"><span>${ALU.pix("kez")}</span><input aria-label="${T("Endereço", "Address")}" spellcheck="false"></form>
          <button data-n="go" class="kz-go">${T("Ir", "Go")}</button>
        </div>
        <div class="kz-view"></div>
        <div class="kz-status">${T("Pronto", "Done")}</div>
      </div>`;
    const view = el.querySelector(".kz-view"), input = el.querySelector(".kz-url input"), tt = el.querySelector(".kz-tt"), status = el.querySelector(".kz-status");
    const hist = []; let pos = -1; let limpar = null;
    const obsK = new MutationObserver(() => { if (!el.isConnected) { obsK.disconnect(); if (limpar) try { limpar(); } catch {} } });
    obsK.observe(document.body, { childList: true, subtree: true });

    function mostrar(url) {
      url = norm(url);
      input.value = url ? "kez://" + url.replace(/^kez:\/\//, "") : "kez://inicio";
      let html = null, titulo = T("Página não encontrada", "Page not found"), achou = null, mm = null;
      for (const pg of todas()) { const m = url.match(pg.re); if (m) { html = pg.html(m); if (html) { titulo = pg.titulo(m); achou = pg; mm = m; break; } } }
      if (limpar) { try { limpar(); } catch {} limpar = null; }
      if (!html) html = `<div class="kz-404"><div class="kz-girafa">🦒</div><h1>${T("A savana não encontrou essa página", "The savanna couldn't find this page")}</h1><p>${T("Nenhum leão, nenhuma zebra, nenhum", "No lion, no zebra, no")} <code>${esc(url)}</code>.</p><button class="btn" data-ir="inicio">${T("Voltar para o início", "Back to home")}</button></div>`;
      status.textContent = T("Carregando…", "Loading…"); view.classList.add("loading");
      setTimeout(() => {
        view.innerHTML = html; view.scrollTop = 0; tt.textContent = titulo; view.classList.remove("loading"); status.textContent = T("Pronto", "Done");
        if (achou && achou.init) limpar = achou.init(view, ctx, mm, ir) || null;
        if (!achou && ALU.conquista) ALU.conquista("404", T("Perdido na savana", "Lost in the savanna"), T("Você achou a girafa da página 404.", "You found the 404 page giraffe."));
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
