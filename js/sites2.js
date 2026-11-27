// Mais sites do Kez(i)avana: alulugle (busca e página inicial), musikzify, ebaa!, clima,
// yakurt e Kezpédia.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s);
  const P = window.PERFIL, PROJ = window.PROJETOS;
  const conq = (...a) => ALU.conquista && ALU.conquista(...a);
  const EN = ALU.lang === "en", T = (pt, en) => (EN ? en : pt);
  const ls = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
  const repoDe = (p) => p.repo.split("/").pop();
  const sem = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  // pixel art a partir de linhas de texto: cada caractere é uma cor da paleta ("." = vazio)
  function px(linhas, pal, cls = "px") {
    const h = linhas.length, w = Math.max(...linhas.map((l) => l.length));
    let r = "";
    linhas.forEach((l, y) => { let x = 0; while (x < l.length) { const c = l[x]; if (c === "." || !pal[c]) { x++; continue; } let n = 1; while (l[x + n] === c) n++; r += `<rect x="${x}" y="${y}" width="${n}" height="1" fill="${pal[c]}"/>`; x += n; } });
    return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
  }

  // ---------------- ícones dos sites ----------------
  const icAlu = px(["..oooo..", ".oyyyyo.", "oyyggyyo", "oyg..gyo", "oyg..gyo", "oyyggyyo", ".oyyyyoo", "..oooo.oo"], { o: "#1b1426", y: "#f2a23a", g: "#3aa34a" });
  const icMz = px(["..kkkk..", ".kggggk.", "kg....gk", "kgkkkkgk", "kg....gk", "kgkkk.gk", ".kggggk.", "..kkkk.."], { k: "#1b1426", g: "#3be07a" });
  const icEb = px(["kkkkkkkk", "kyyyyyyk", "ky.yy.yk", "kyyyyyyk", "ky.yy.yk", "kyy..yyk", "kkkkyykk", "....kk.."], { k: "#1b1426", y: "#ffd23f" });
  const icCl = px(["...yy...", "..yyyy..", ".yyyyyy.", ".yyyywww", "..ywwwww", ".wwwwwww", "wwwwwwww", "........"], { y: "#ffcf3a", w: "#cfd8e8" });
  const icYk = px(["..pppp..", ".pwwwwp.", "pwwppwwp", "pwp..pwp", "pwp..pwp", "pwwppwwp", ".pwwwwp.", "..pppp.."], { p: "#e0408a", w: "#ffffff" });
  const icWk = px(["kkkkkkkk", "kwwwwwwk", "kwkkkkwk", "kwwwwwwk", "kwkkkwwk", "kwwwwwwk", "kwkkkkwk", "kkkkkkkk"], { k: "#1b1426", w: "#f4f4f4" });

  // gato laranja original da comunidade "Eu odeio segunda-feira"
  const GATO = px([
    "....kk..........kk....",
    "...koKk........kKok...",
    "...kooKk......kKook...",
    "..koooookkkkkkooooook.",
    "..kooookooookooooooook",
    ".koosooooooooooosoook.",
    ".koooooooooooooooooook",
    ".kowwwwwwooooowwwwwwok",
    "kooawwkkwoooooawwkkwook",
    "kooaaaaaaoooooaaaaaaook",
    "koooooooooonnooooooooook",
    "kosooooooookkooooooosok",
    "koooooooomkmmkmooooooook",
    ".koooooooommmmooooooook.",
    ".kosoooooooooooooosook..",
    "..koooooooooooooooook...",
    "...kkoooooooooooookk....",
    "..kooookkkkkkkkooook....",
    ".koooook.kccck.kooook...",
    ".kooook..kcmck..koook...",
    ".kkkkk...kccck...kkkk...",
  ], { k: "#2a160c", o: "#f28c28", K: "#f7b267", s: "#c9611a", w: "#ffffff", a: "#ffe9a8", n: "#ff7f9f", m: "#7a2a10", c: "#7fd1e8" }, "px gato");

  // ======================= alulugle =======================
  const INDICE = () => [
    { url: "ligadin.com/feed", t: "Feed | LigadIn", d: T("Posts de gratidão corporativa, vagas sênior por R$ 1.200 e um gato muito produtivo.", "Corporate gratitude posts, senior roles for R$ 1,200 and a very productive cat."), k: "linkedin ligadin feed posts vagas gratidao linkedisney gato bombom demitido jobs gratitude cat" },
    { url: "ligadin.com/in/aluisio-alves", t: `${P.nome} | LigadIn`, d: T("Perfil profissional, experiência e cursos.", "Professional profile, experience and courses."), k: "linkedin ligadin perfil curriculo certificado emprego vaga aluisio profile resume job" },
    { url: "doghub.com/aluisiodev", t: "aluisiodev · DogHub", d: T("Repositórios e código dos projetos.", "Repositories and project code."), k: "github doghub codigo repositorio projetos code repository projects" },
    ...PROJ.map((p) => ({ url: "doghub.com/aluisiodev/" + repoDe(p), t: `${p.nome} · DogHub`, d: p.resumo, k: `${p.nome} ${p.id} ${p.stack.join(" ")} projeto` })),
    { url: "kezpedia.org/wiki/Aluisio", t: T("Aluísio – Kezpédia, a enciclopédia da savana", "Aluísio – Kezpédia, the savanna encyclopedia"), d: T("Desenvolvedor, criador do aluOS e domador de patos roxos.", "Developer, creator of aluOS and tamer of purple ducks."), k: "aluisio quem biografia wiki kezpedia who biography about" },
    { url: "kezpedia.org/wiki/aluOS", t: "aluOS – Kezpédia", d: T("Sistema operacional feito em HTML, CSS e JavaScript para servir de portfolio.", "An operating system made with HTML, CSS and JavaScript to serve as a portfolio."), k: "aluos sistema operacional portfolio desktop operating system" },
    { url: "kezpedia.org/wiki/Pato_roxo", t: T("Pato roxo – Kezpédia", "Purple duck – Kezpédia"), d: T("Mascote do Peep Studio. Revisa PRs desde que evoluiu.", "Peep Studio's mascot. Has been reviewing PRs ever since it evolved."), k: "pato roxo peep studio quack purple duck" },
    { url: "musikzify.com", t: T("musikzify · a playlist do Aluísio", "musikzify · Aluísio's playlist"), d: T("Ouça uma prévia das músicas que tocam enquanto ele programa.", "Preview the songs that play while he codes."), k: "musica spotify musikzify playlist radio ouvir som music songs listen" },
    { url: "ebaa.com.br", t: T("ebaa! · o fórum da savana", "ebaa! · the savanna forum"), d: T("Dúvidas, códigos que só funcionam às 3h da manhã e discussões sobre patos.", "Questions, code that only works at 3 AM and discussions about ducks."), k: "forum ebaa duvida discussao comunidade questions community" },
    { url: "climaselva.com", t: T("Clima da Terra da Garoa", "Land of Drizzle Weather"), d: T("Previsão do tempo para a Terra da Garoa e todas as capitais do Brasil.", "Weather forecast for the Land of Drizzle and every Brazilian state capital."), k: "clima tempo previsao chuva sol garoa sao paulo estado capital weather forecast rain" },
    { url: "yakurt.com/perfil/aluisio", t: `${P.nome} · yakurt`, d: T("Recados, depoimentos e as comunidades mais importantes da sua vida.", "Scraps, testimonials and the most important communities of your life."), k: "yakurt orkut rede social recado comunidade depoimento social network scraps" },
    { url: "yakurt.com/comunidade/segunda", t: T("Eu odeio segunda-feira · yakurt", "I hate Mondays · yakurt"), d: T("Comunidade com 1.204.333 membros que concordam com você.", "A community of 1,204,333 members who agree with you."), k: "segunda feira gato odeio comunidade monday cat hate" },
    { url: "youinthescreenofcomputerorphone.com", t: "YouInTheScreenOfComputerOrPhone", d: T("Vídeos. Muitos vídeos. Alguns de 10 horas.", "Videos. Lots of videos. Some of them 10 hours long."), k: "video youtube you assistir watch" },
    { url: "imaiu.com", t: T("imaíu · caixa de entrada", "imaíu · inbox"), d: T("E-mail grátis. Spam incluso sem custo adicional.", "Free email. Spam included at no extra cost."), k: "email mail imaiu caixa inbox" },
    { url: "clicajogos.com", t: T("clicajogos · jogos grátis!!", "clicajogos · free games!!"), d: T("Cobrinha, Jogo da velha, Pato Clicker, Memória e Fuga de Vice.", "Snake, Tic-tac-toe, Pato Clicker, Memory and Escape from Vice."), k: "jogo jogos game clicajogos cobrinha velha pato memoria games snake memory duck fuga vice policia police corrida racing" },
  ];
  const ATALHOS = () => [
    ["ligadin.com/in/aluisio-alves", ALU.pix("ligadin"), "LigadIn"], ["doghub.com/aluisiodev", ALU.pix("doghub"), "DogHub"],
    ["musikzify.com", icMz, "musikzify"], ["ebaa.com.br", icEb, "ebaa!"], ["climaselva.com", icCl, T("Clima", "Weather")], ["yakurt.com/perfil/aluisio", icYk, "yakurt"], ["kezpedia.org/wiki/Aluisio", icWk, "Kezpédia"],
    ...ALU.kezSites.filter((x) => x.atalho).map((x) => [x.atalho.url, x.atalho.icone, x.atalho.nome]),
  ];
  ALU.kezAtalhos = ATALHOS;
  const logoAlu = (pq) => `<span class="al-logo ${pq ? "pq" : ""}">${"Alulugle".split("").map((c, i) => `<b class="c${i % 5}">${c}</b>`).join("")}</span>`;
  function buscaInit(view, ctx, m, ir) {
    const f = view.querySelector(".al-busca"); if (!f) return;
    const inp = f.querySelector("input");
    f.onsubmit = (e) => { e.preventDefault(); const q = inp.value.trim(); if (q) ir("alulugle.com/busca?q=" + encodeURIComponent(q)); };
    const pesq = view.querySelector(".al-pesq"); if (pesq) pesq.onclick = () => f.requestSubmit();
    const sorte = view.querySelector(".al-sorte");
    if (sorte) sorte.onclick = () => { const q = inp.value.trim(); const r = q ? resultados(q) : []; const l = INDICE(); ir((r[0] || l[Math.floor(Math.random() * l.length)]).url); };
  }
  function resultados(q) {
    const ws = sem(q).split(/\s+/).filter((w) => w.length > 1);
    return INDICE().map((r) => { const alvo = sem(`${r.t} ${r.d} ${r.k} ${r.url}`); return { r, s: ws.reduce((a, w) => a + (alvo.includes(w) ? 1 : 0), 0) }; })
      .filter((x) => x.s > 0).sort((a, b) => b.s - a.s).map((x) => x.r);
  }
  ALU.kezSites.push({
    re: /^(kez:\/\/)?(inicio|alulugle\.com\/?)?$/, titulo: () => "Alulugle",
    html: () => `
      <div class="al-home">
        ${logoAlu()}
        <form class="al-busca"><input placeholder="${T("Pesquise na savana ou digite um endereço", "Search the savanna or type an address")}" aria-label="${T("Pesquisar no Alulugle", "Search Alulugle")}"><button class="btn" aria-label="${T("Pesquisar", "Search")}">🔍</button></form>
        <div class="row"><button class="btn sec al-pesq" type="button">${T("Pesquisar no Alulugle", "Alulugle Search")}</button><button class="btn sec al-sorte" type="button">${T("Estou com sorte", "I'm Feeling Lucky")}</button></div>
        <div class="kz-atalhos">${ATALHOS().map(([u, ic, n]) => `<button data-ir="${u}">${ic}<span>${esc(n)}</span></button>`).join("")}
          ${PROJ.map((p) => `<button data-ir="doghub.com/aluisiodev/${repoDe(p)}">${ALU.iconeHTML("proj:" + p.id)}<span>${esc(p.curto)}</span></button>`).join("")}</div>
        <p class="al-rodape">${T("Alulugle oferecido em", "Alulugle offered in")}: <b>${T("Português", "English")}</b> · <b>${T("Savanês", "Savannese")}</b> · <b>Quack</b></p>
      </div>`,
    init: buscaInit,
  });
  ALU.kezSites.push({
    re: /^alulugle\.com\/busca\?q=(.*)$/, titulo: (m) => `${decodeURIComponent(m[1])} - ${T("Pesquisa Alulugle", "Alulugle Search")}`,
    html: (m) => {
      const q = decodeURIComponent(m[1]), qs = sem(q);
      let extra = "", lista = resultados(q);
      if (/barrel roll|giro|gira|spin/.test(qs)) extra = `<p class="al-dica">🌀 ${T("Uau.", "Whoa.")}</p>`;
      if (qs === "alulugle" || qs === "recursao" || qs === "recursion") extra = `<p class="al-dica">${T("Você quis dizer", "Did you mean")}: <button class="link" data-ir="alulugle.com/busca?q=${encodeURIComponent(q)}">${esc(q)}</button></p>`;
      if (/^(quack|pato|duck)/.test(qs)) extra = `<p class="al-dica">🦆 ${T("Aproximadamente 9.999.999 quacks (0,01 segundo)", "About 9,999,999 quacks (0.01 seconds)")}</p>`;
      return `
      <div class="al-res">
        <header class="al-top">${logoAlu(true)}<form class="al-busca"><input value="${esc(q)}" aria-label="${T("Pesquisar no Alulugle", "Search Alulugle")}"><button class="btn">🔍</button></form></header>
        <p class="muted">${T("Aproximadamente", "About")} ${(lista.length ? lista.length * 1337 : 0).toLocaleString(T("pt-BR", "en-US"))} ${T("resultados (0,42 segundo)", "results (0.42 seconds)")}</p>${extra}
        ${lista.length ? lista.map((r) => `<div class="al-item"><small>kez://${esc(r.url)}</small><button class="link" data-ir="${esc(r.url)}">${esc(r.t)}</button><p>${esc(r.d)}</p></div>`).join("")
          : `<div class="al-nada"><p>${T("Sua pesquisa", "Your search")} <b>${esc(q)}</b> ${T("não encontrou nenhum documento na savana.", "did not match any documents in the savanna.")}</p><p>${T("Sugestões: tente", "Suggestions: try")} <button class="link" data-ir="alulugle.com/busca?q=${T("projetos", "projects")}">${T("projetos", "projects")}</button>, <button class="link" data-ir="alulugle.com/busca?q=${T("musica", "music")}">${T("música", "music")}</button> ${T("ou pergunte no", "or ask on")} <button class="link" data-ir="ebaa.com.br">ebaa!</button></p></div>`}
      </div>`;
    },
    init: (view, ctx, m, ir) => {
      buscaInit(view, ctx, m, ir);
      const qs = sem(decodeURIComponent(m[1]));
      if (/barrel roll|giro|gira|spin/.test(qs)) { view.classList.add("al-gira"); setTimeout(() => view.classList.remove("al-gira"), 1300); conq("barrel", T("Deu um giro", "Do a barrel roll"), T("Pediu um giro pro Alulugle.", "Asked Alulugle to spin.")); }
    },
  });

  // ======================= musikzify =======================
  // A playlist "favs oat" do Aluísio. A prévia toca pelo player oficial do Spotify quando o navegador deixa
  // (num site de verdade, como o GitHub Pages, deixa). Cada faixa também abre direto no Spotify.
  const PLAYLIST = "6kNcU6KqmK0X4zxYZCuhMq";
  const FAIXAS = [["Sunflower", "Rex Orange County", "4:12"], ["Daylight", "Joji, Diplo", "2:43"], ["B", "Jaden", "3:06"], ["Piece of You (with Giveon)", "Joji, GIVĒON", "2:15"], ["Dreams of You", "Brennan Savage, Killstation", "2:48"], ["Die For You", "Joji", "3:31"], ["Preciso Me Encontrar", "Cartola", "2:58"], ["O Mundo É Um Moinho", "Cartola", "3:53"], ["Ew", "Joji", "3:27"], ["Like You Do", "Joji", "4:00"], ["haunt u", "Lil Peep", "1:58"], ["Dia Lindo", "Terno Rei", "1:50"], ["Yoko", "Terno Rei", "3:45"], ["Solidão", "Saudades Futebol Clube", "3:55"], ["Apocalypse", "Cigarettes After Sex", "4:50"], ["My Propeller", "Arctic Monkeys", "3:25"], ["Morioh Cho Radio", "Yung Buda, wxlf7", "4:43"], ["Let Down", "Radiohead", "4:59"], ["Lucky", "Radiohead", "4:18"], ["nunca mais vou ser clt", "Link do Zap", "3:00"], ["dando um jeito", "Link do Zap", "2:17"], ["Spanish Sahara", "Foals", "6:49"], ["Piloto", "Yung Buda", "3:34"], ["Isso é Sério", "Matuê, Brandão85", "4:45"], ["I'LL SEE YOU IN 40", "Joji", "4:13"], ["Well I Wonder - 2011 Remaster", "The Smiths", "3:59"], ["One For The Road", "Arctic Monkeys", "3:26"], ["nuts", "Lil Peep, rainy bear", "1:25"], ["505", "Arctic Monkeys", "4:13"], ["Aquelamusicaali", "Yung Buda", "2:49"], ["Dueto", "Yunk Vino, Vnoahh, Neckklace", "2:19"], ["Monstro", "Yung Buda", "3:49"], ["Subaru Azul", "Yung Buda, Zemaru, Psycho 13", "4:51"], ["BAILE 2002", "predo, DigiMushroom", "3:32"], ["Salão", "Japa", "2:04"], ["I've Been Waiting (w/ ILoveMakonnen & Fall Out Boy)", "Lil Peep, ILOVEMAKONNEN, Fall Out Boy", "3:53"], ["Máquina do Tempo", "Matuê", "3:50"], ["Lean Wit Me", "Juice WRLD", "2:55"], ["Who Shot Cupid?", "Juice WRLD", "3:34"], ["whoa (mind in awe)", "XXXTENTACION", "2:37"], ["Kyoto", "Japa", "3:06"], ["SLOW DANCING IN THE DARK", "Joji", "3:29"], ["Kurt", "Japa", "2:56"], ["Jogo Sujo", "Yunk Vino, Veigh, Nagalli, Trxntin, Labbel Rec", "3:45"], ["VVS", "Japa", "2:36"], ["Glimpse of Us", "Joji", "3:53"], ["Luxúria", "Xamã, Bagua Records, Neo Beats, Matuê", "3:05"], ["Self Control", "Frank Ocean", "4:09"], ["Tenho Medo (De Sentir Que Não Sinto Nada Por Ti)", "Insira Aqui", "2:47"], ["Jazz Clube", "glover.", "3:03"], ["Desastrado, Etc.", "glover.", "4:22"], ["Indo Embora Sem Avisar Ninguém", "glover.", "3:33"], ["Fast", "Juice WRLD", "3:28"], ["É Verdade Que Tu Rasgou Meu Accesscode Talker?", "Lunoaprendiz", "3:53"], ["TEETH!", "ElyOtto", "1:20"], ["Necronomicon", "Yung Buda, Lukanni", "3:25"], ["Luzes de Natal", "Terno Rei", "2:44"], ["Stereonatália", "Rugby Brasileiro", "2:56"], ["Radio/Video", "System Of A Down", "4:09"], ["Lost In Hollywood", "System Of A Down", "5:20"], ["Disenchanted", "My Chemical Romance", "4:55"], ["Sextape", "Deftones", "4:01"], ["LOVE YOU LESS", "Joji", "3:21"], ["Ventos do Norte (Terral)", "Bella e o Olmo da Bruxa", "3:15"]];
  const buscaSpotify = (f) => "https://open.spotify.com/search/" + encodeURIComponent(f[0].replace(/\s*[-(].*$/, "") + " " + f[1].split(",")[0]);
  const emPrevia = () => /claude|anthropic|usercontent/.test(location.hostname);
  ALU.kezSites.push({
    re: /^musikzify\.com\/?$/, titulo: () => "musikzify · favs oat",
    html: () => `
      <div class="mz">
        <aside class="mz-side"><div class="mz-logo">${icMz}<b>musikzify</b></div>
          <span>⌂ ${T("Início", "Home")}</span><span>🔍 ${T("Buscar", "Search")}</span><span>▤ ${T("Sua biblioteca", "Your Library")}</span>
          <hr><span class="on">♫ favs oat</span><span>♫ ${T("Rádio da savana", "Savanna Radio")}</span><span>♫ Quack-fi beats to code to</span></aside>
        <section class="mz-main">
          <div class="mz-hero"><div class="mz-capa"><img src="${esc(P.foto)}" alt=""><i>♫</i></div>
            <div><small>${T("PLAYLIST PÚBLICA", "PUBLIC PLAYLIST")}</small><h1>favs oat</h1><p>${T("O que toca no monitor esquerdo enquanto eu programo. De Cartola a Joji, de Terno Rei a System Of A Down.", "What plays on the left monitor while I code. From Cartola to Joji, from Terno Rei to System Of A Down.")}</p>
            <p class="mz-quem"><img src="${esc(P.foto)}" alt=""> <b>${esc(P.nome)}</b> · ${FAIXAS.length} ${T("músicas", "songs")}</p></div></div>
          <div class="mz-acoes"><button class="mz-play" aria-label="${T("Tocar", "Play")}">▶</button><a class="btn real" href="https://open.spotify.com/playlist/${PLAYLIST}" target="_blank" rel="noopener">${T("Sair da savana: ouvir no Spotify", "Leave the savanna: listen on Spotify")} ↗</a></div>
          <div class="mz-player" hidden><iframe title="${T("Prévia no Spotify", "Spotify preview")}" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe></div>
          <p class="mz-aviso" hidden>${T("Nesta prévia o navegador não deixa o player do Spotify aparecer. Clique numa música para ouvir no Spotify, ou abra o site publicado.", "In this preview the browser won't show the Spotify player. Click a song to listen on Spotify, or open the published site.")}</p>
          <ol class="mz-lista"></ol>
        </section>
      </div>`,
    init: (view) => {
      const player = view.querySelector(".mz-player"), fr = player.querySelector("iframe"), aviso = view.querySelector(".mz-aviso");
      const bloqueado = emPrevia();
      const abrirPlayer = () => {
        if (bloqueado) { aviso.hidden = false; return false; }
        if (!fr.src) fr.src = `https://open.spotify.com/embed/playlist/${PLAYLIST}?utm_source=generator&theme=0`;
        player.hidden = false; return true;
      };
      view.querySelector(".mz-play").onclick = () => { if (!abrirPlayer()) window.open(`https://open.spotify.com/playlist/${PLAYLIST}`, "_blank", "noopener"); };
      // lista: começa com a cópia salva no site; se o servidor estiver no ar, troca pela playlist atual do Spotify (com capas)
      let lista = FAIXAS.map(([nome, artista, d]) => ({ nome, artista, d, capa: "", id: "" }));
      const ol = view.querySelector(".mz-lista"), quem = view.querySelector(".mz-quem");
      const dur = (ms) => `${Math.floor(ms / 60000)}:${String(Math.round(ms / 1000) % 60).padStart(2, "0")}`;
      function pintar() {
        ol.innerHTML = lista.map((f, i) => `<li><button data-i="${i}"><span class="n">${i + 1}</span>${f.capa ? `<img class="mz-mini" src="${esc(f.capa)}" alt="" loading="lazy">` : ""}<span class="t"><b>${esc(f.nome)}</b><small>${esc(f.artista)}</small></span><span class="d">${esc(f.d)}</span></button></li>`).join("");
        if (quem) quem.innerHTML = `<img src="${esc(P.foto)}" alt=""> <b>${esc(P.nome)}</b> · ${lista.length} ${T("músicas", "songs")}`;
        ol.querySelectorAll("button").forEach((b) => (b.onclick = () => {
          const f = lista[+b.dataset.i];
          ol.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
          if (bloqueado) { aviso.hidden = false; window.open(f.id ? `https://open.spotify.com/track/${f.id}` : buscaSpotify([f.nome, f.artista]), "_blank", "noopener"); return; }
          if (f.id) { fr.src = `https://open.spotify.com/embed/track/${f.id}?utm_source=generator&theme=0`; player.hidden = false; } else abrirPlayer();
          ALU.urso && ALU.urso.falar && ALU.urso.falar(T(`Boa! ${f.nome} é das boas.`, `Nice! ${f.nome} is a good one.`));
        }));
      }
      // no site publicado, o player do Spotify já mostra a playlist atual; a cópia salva no código só aparece
      // na prévia (onde o player não carrega) ou até o servidor responder com a lista de verdade
      const api = ALU.CONFIG && ALU.CONFIG.api;
      if (bloqueado) pintar(); else { ol.hidden = true; if (quem) quem.innerHTML = `<img src="${esc(P.foto)}" alt=""> <b>${esc(P.nome)}</b> · Spotify`; }
      if (api) fetch(String(api).replace(/\/+$/, "") + "/musicas").then((r) => (r.ok ? r.json() : null)).then((j) => {
        if (!j || !Array.isArray(j.faixas) || !j.faixas.length || !view.isConnected) return;
        ol.hidden = false;
        lista = j.faixas.map((f) => ({ nome: f.nome, artista: f.artista, d: f.ms ? dur(f.ms) : "", capa: f.capa || "", id: f.id || "" }));
        if (j.capa) { const im = view.querySelector(".mz-capa img"); if (im) im.src = j.capa; }
        pintar();
      }).catch(() => {});
      if (!bloqueado) abrirPlayer(); else aviso.hidden = false;
      conq("musikzify", T("Trilha sonora", "Soundtrack"), T("Abriu a playlist no musikzify.", "Opened the playlist on musikzify."));
    },
  });

  // ======================= ebaa! =======================
  const TOPICOS = [
    { id: "funciona", cat: "Programação", t: "[RESOLVIDO] meu código só funciona quando eu não estou olhando", autor: "dev_noturno", posts: [
      ["dev_noturno", "🦉", "Toda vez que eu chamo alguém pra ver o bug, ele some. Quando a pessoa vai embora, volta. Alguém?"],
      ["pato_roxo", "🦆", "quack. (tradução: explica o código linha por linha pra mim)"],
      ["dev_noturno", "🦉", "expliquei pro pato e achei o erro. era um ponto e vírgula. RESOLVIDO."]] },
    { id: "urso", cat: "Geral da savana", t: "tem alguém de cabelo azul com uma espada na minha área de trabalho??", autor: "visitante_2006", posts: [
      ["visitante_2006", "👀", "apareceu uma assistente de cabelo azul e espada nas costas no meu desktop. é vírus???"],
      ["Zizi", "⚔️", "oi! não sou vírus, sou Zizi, assistente virtual do aluOS. prometo não instalar barra de ferramentas."],
      ["girafa_da_404", "🦒", "ele é gente boa. me ajudou a achar a página que eu perdi"]] },
    { id: "vim", cat: "Programação", t: "tutorial: como sair do vim", autor: "sudo_su", posts: [
      ["sudo_su", "💻", "entrei no vim em 2019. alguém sabe sair? minha família sente minha falta"],
      ["pato_roxo", "🦆", ":q!"],
      ["sudo_su", "💻", "OBRIGADO. vou rever o sol pela primeira vez em anos"]] },
    { id: "album", cat: "Música", t: "melhor álbum: Humbug, Nectar ou OK Computer?", autor: "aluisio.dev", posts: [
      ["aluisio.dev", "🎧", "os três estão na parede do meu quarto, então já sabem minha resposta: sim."],
      ["paranoid_android", "🤖", "OK Computer. não aceito argumentos."],
      ["crying_lightning", "⚡", "Humbug é subestimado e eu vou morrer nessa colina"]] },
    { id: "fnaf", cat: "Jogos", t: "dicas para sobreviver ao turno da noite", autor: "seguranca_novato", posts: [
      ["seguranca_novato", "🔦", "primeiro dia de trabalho no museu. alguma dica?"],
      ["urso_animatronico", "🐻", "har har har"],
      ["seguranca_novato", "🔦", "isso não ajudou em nada"]] },
    { id: "sekiro", cat: "Jogos", t: "zerei Sekiro e agora não sei o que fazer da vida", autor: "lobo_de_um_braco", posts: [
      ["lobo_de_um_braco", "🗡️", "200 horas. o Isshin me ensinou mais que a faculdade."],
      ["aluisio.dev", "🎧", "hesitation is defeat. bora pra NG+"]] },
  ];
  // versão em inglês dos tópicos: id -> [categoria, título, [falas]]
  const TOPICOS_EN = {
    funciona: ["Programming", "[SOLVED] my code only works when I'm not looking at it", ["Every time I call someone over to see the bug, it disappears. When they leave, it comes back. Anyone?", "quack. (translation: explain the code to me line by line)", "explained it to the duck and found the bug. it was a semicolon. SOLVED."]],
    urso: ["Savanna Lounge", "is there someone with blue hair and a sword on my desktop??", ["a blue-haired assistant with a sword on her back showed up on my desktop. is it a virus???", "hi! I'm not a virus, I'm Zizi, aluOS's virtual assistant. I promise not to install any toolbars.", "she's nice. she helped me find the page I lost"]],
    vim: ["Programming", "tutorial: how to exit vim", ["I opened vim in 2019. does anyone know how to get out? my family misses me", ":q!", "THANK YOU. I'll see the sun for the first time in years"]],
    album: ["Music", "best album: Humbug, Nectar or OK Computer?", ["all three are on my bedroom wall, so you know my answer: yes.", "OK Computer. no arguments accepted.", "Humbug is underrated and I will die on this hill"]],
    fnaf: ["Games", "tips for surviving the night shift", ["first day at the museum. any tips?", "har har har", "that didn't help at all"]],
    sekiro: ["Games", "beat Sekiro and now I don't know what to do with my life", ["200 hours. Isshin taught me more than college did.", "hesitation is defeat. on to NG+"]],
  };
  if (EN) TOPICOS.forEach((t) => { const e = TOPICOS_EN[t.id]; if (!e) return; t.cat = e[0]; t.t = e[1]; t.posts.forEach((p, i) => { if (e[2][i]) p[2] = e[2][i]; }); });
  const meusPosts = () => ls.get("alu.ebaa", {});
  ALU.kezSites.push({
    re: /^ebaa\.com\.br\/?$/, titulo: () => T("ebaa! · o fórum da savana", "ebaa! · the savanna forum"),
    html: () => {
      const cats = [...new Set(TOPICOS.map((t) => t.cat))], mp = meusPosts();
      return `<div class="eb">
        <header class="eb-top">${icEb}<b>ebaa!</b><span>${T("o fórum da savana desde 2004", "the savanna forum since 2004")} · ${1337 + Object.values(mp).flat().length} ${T("membros online", "members online")}</span></header>
        ${cats.map((c) => `<table class="eb-tab"><thead><tr><th>${esc(c)}</th><th>${T("Respostas", "Replies")}</th><th>${T("Autor", "Author")}</th></tr></thead><tbody>
          ${TOPICOS.filter((t) => t.cat === c).map((t) => `<tr><td><button class="link" data-ir="ebaa.com.br/t/${t.id}">${esc(t.t)}</button></td><td>${t.posts.length - 1 + (mp[t.id] || []).length}</td><td>${esc(t.autor)}</td></tr>`).join("")}</tbody></table>`).join("")}
        <p class="eb-rodape">Powered by ebaaBB 2.0.4 · ${T("Regras: não alimente os trolls nem os patos.", "Rules: do not feed the trolls or the ducks.")}</p></div>`;
    },
  });
  ALU.kezSites.push({
    re: /^ebaa\.com\.br\/t\/([\w-]+)\/?$/, titulo: (m) => ((TOPICOS.find((t) => t.id === m[1]) || {}).t || T("Tópico", "Topic")) + " · ebaa!",
    html: (m) => {
      const t = TOPICOS.find((x) => x.id === m[1]); if (!t) return null;
      const extras = (meusPosts()[t.id] || []).map((x) => [T("visitante", "visitor"), "🙂", x]);
      return `<div class="eb">
        <header class="eb-top">${icEb}<button class="link" data-ir="ebaa.com.br"><b>ebaa!</b></button><span>${esc(t.cat)} › ${esc(t.t)}</span></header>
        <h2 class="eb-h">${esc(t.t)}</h2>
        <div class="eb-posts">${[...t.posts, ...extras].map(([a, av, txt], i) => `<div class="eb-post"><aside><span>${av}</span><b>${esc(a)}</b><small>${i === 0 ? T("autor do tópico", "topic starter") : T("membro", "member")}</small></aside><div><small>#${i + 1} · ${EN ? `posted ${i + 1} ${i ? "hours" : "day"} ago` : `postado há ${i + 1} ${i ? "horas" : "dia"}`}</small><p>${esc(txt)}</p><em>— ${esc(a)} | ${a === "pato_roxo" ? "quack" : a === "aluisio.dev" ? T("feito com HTML e café", "made with HTML and coffee") : T("minha assinatura é muito legal", "my signature is really cool")}</em></div></div>`).join("")}</div>
        <form class="eb-resp"><b>${T("Responder", "Reply")}</b><textarea maxlength="400" placeholder="${T("Seja gentil. O pato está de olho.", "Be kind. The duck is watching.")}" aria-label="${T("Sua resposta", "Your reply")}"></textarea><button class="btn real">${T("Enviar resposta", "Post reply")}</button></form></div>`;
    },
    init: (view, ctx, m, ir) => {
      view.querySelector(".eb-resp").onsubmit = (e) => {
        e.preventDefault(); const v = view.querySelector(".eb-resp textarea").value.trim(); if (!v) return;
        const mp = meusPosts(); (mp[m[1]] = mp[m[1]] || []).push(v.slice(0, 400)); ls.set("alu.ebaa", mp);
        conq("ebaa", T("Membro do fórum", "Forum member"), T("Respondeu um tópico no ebaa!.", "Replied to a topic on ebaa!."));
        ir("ebaa.com.br/t/" + m[1]);
      };
    },
  });

  // ======================= Clima da Terra da Garoa (e do Brasil todo) =======================
  // [uf, apelido, capital, lat, lon, piada]
  const CIDADES = [
    ["SP", "Terra da Garoa", "São Paulo", -23.55, -46.63, "Chance de garoa: sempre"], ["RJ", "Cidade Maravilhosa", "Rio de Janeiro", -22.91, -43.17, "Sensação térmica: forno"],
    ["MG", "Terra do Pão de Queijo", "Belo Horizonte", -19.92, -43.94, "Chance de café: 100%"], ["ES", "Terra da Moqueca", "Vitória", -20.32, -40.34, "Panela de barro: no fogo"],
    ["PR", "Cidade Sorriso", "Curitiba", -25.43, -49.27, "4 estações num dia só"], ["SC", "Ilha da Magia", "Florianópolis", -27.6, -48.55, "Vento sul: chegando"],
    ["RS", "Terra do Chimarrão", "Porto Alegre", -30.03, -51.23, "Cuia: sempre cheia"], ["MS", "Cidade Morena", "Campo Grande", -20.47, -54.62, "Tereré: gelado"],
    ["MT", "Portal da Amazônia", "Cuiabá", -15.6, -56.1, "Calor: sim"], ["GO", "Terra do Pequi", "Goiânia", -16.68, -49.25, "Cuidado com o caroço"],
    ["DF", "Capital do Brasil", "Brasília", -15.79, -47.88, "Umidade: deserto"], ["BA", "Terra da Felicidade", "Salvador", -12.97, -38.5, "Axé no ar: alto"],
    ["SE", "Cidade da Qualidade de Vida", "Aracaju", -10.91, -37.07, "Caranguejo: liberado"], ["AL", "Paraíso das Águas", "Maceió", -9.67, -35.74, "Mar: verde-água"],
    ["PE", "Veneza Brasileira", "Recife", -8.05, -34.88, "Frevo: provável"], ["PB", "Onde o Sol Nasce Primeiro", "João Pessoa", -7.12, -34.86, "Nascer do sol: antes de todo mundo"],
    ["RN", "Cidade do Sol", "Natal", -5.79, -35.21, "Protetor solar: obrigatório"], ["CE", "Terra da Luz", "Fortaleza", -3.73, -38.52, "Vento: perfeito pra kite"],
    ["PI", "Cidade Verde", "Teresina", -5.09, -42.8, "Calor: lendário"], ["MA", "Ilha do Amor", "São Luís", -2.53, -44.3, "Reggae: tocando"],
    ["PA", "Cidade das Mangueiras", "Belém", -1.46, -48.49, "Chuva da tarde: pontual"], ["AP", "Meio do Mundo", "Macapá", 0.03, -51.07, "Hemisfério: os dois"],
    ["AM", "Coração da Amazônia", "Manaus", -3.12, -60.02, "Umidade: floresta"], ["RR", "Terra de Makunaimã", "Boa Vista", 2.82, -60.67, "Sol: garantido"],
    ["AC", "Terra do Acre (existe!)", "Rio Branco", -9.97, -67.81, "Existência confirmada"], ["RO", "Portal da Amazônia Ocidental", "Porto Velho", -8.76, -63.9, "Chuva: em breve"],
    ["TO", "Capital Mais Nova", "Palmas", -10.18, -48.33, "Calor de planejamento"],
  ];
  // apelidos e piadas em inglês, na mesma ordem de CIDADES
  if (EN) [
    ["Land of Drizzle", "Chance of drizzle: always"], ["Marvelous City", "Feels like: oven"], ["Land of Cheese Bread", "Chance of coffee: 100%"], ["Land of Moqueca", "Clay pot: on the stove"],
    ["Smile City", "4 seasons in a single day"], ["Island of Magic", "South wind: incoming"], ["Land of Chimarrão", "Gourd: always full"], ["Brunette City", "Tereré: ice cold"],
    ["Gateway to the Amazon", "Heat: yes"], ["Land of Pequi", "Watch out for the pit"], ["Capital of Brazil", "Humidity: desert"], ["Land of Happiness", "Axé in the air: high"],
    ["City of Quality of Life", "Crab: allowed"], ["Water Paradise", "Sea: aqua green"], ["Brazilian Venice", "Frevo: likely"], ["Where the Sun Rises First", "Sunrise: before everyone else"],
    ["City of the Sun", "Sunscreen: mandatory"], ["Land of Light", "Wind: perfect for kitesurfing"], ["Green City", "Heat: legendary"], ["Island of Love", "Reggae: playing"],
    ["City of Mango Trees", "Afternoon rain: on time"], ["Middle of the World", "Hemisphere: both"], ["Heart of the Amazon", "Humidity: rainforest"], ["Land of Makunaimã", "Sun: guaranteed"],
    ["Land of Acre (it exists!)", "Existence: confirmed"], ["Gateway to the Western Amazon", "Rain: coming soon"], ["Newest Capital", "Planned heat"],
  ].forEach(([ap, piada], i) => { if (CIDADES[i]) { CIDADES[i][1] = ap; CIDADES[i][5] = piada; } });
  const COND = (c) => c === 0 ? ["☀️", T("Céu limpo (aproveite)", "Clear sky (enjoy it)")] : c <= 2 ? ["🌤️", T("Sol entre nuvens", "Partly cloudy")] : c === 3 ? ["☁️", T("Nublado", "Cloudy")] : c <= 48 ? ["🌫️", T("Neblina", "Fog")]
    : c <= 57 ? ["🌦️", T("Garoa", "Drizzle")] : c <= 67 ? ["🌧️", T("Chuva: leve o guarda-chuva", "Rain: bring an umbrella")] : c <= 77 ? ["❄️", T("Neve?! Confira seu termômetro", "Snow?! Check your thermometer")] : c <= 82 ? ["🌧️", T("Pancadas de chuva", "Rain showers")] : ["⛈️", T("Tempestade. Fique em casa programando", "Thunderstorm. Stay home and code")];
  const DIAS = EN ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  ALU.kezSites.push({
    re: /^climaselva\.com(?:\/(\w\w))?\/?$/, titulo: (m) => { const c = CIDADES.find((x) => x[0] === (m[1] || "SP").toUpperCase()) || CIDADES[0]; return T("Clima da ", "Weather · ") + c[1]; },
    html: (m) => {
      const c = CIDADES.find((x) => x[0] === (m[1] || "SP").toUpperCase()) || CIDADES[0];
      return `
      <div class="cl">
        <header class="cl-top">${icCl}<b>${T("Clima da ", "Weather · ")}${esc(c[1])}</b><label class="cl-sel">${T("Estado", "State")}: <select aria-label="${T("Escolher estado", "Choose state")}">${CIDADES.map((x) => `<option value="${x[0]}" ${x === c ? "selected" : ""}>${x[0]} · ${esc(x[2])}</option>`).join("")}</select></label><button class="cl-loc" type="button">📍 ${T("Usar minha localização", "Use my location")}</button></header>
        <div class="cl-agora"><div class="cl-ic">⏳</div><div><small>${esc(c[1])} (${esc(c[2])}, ${c[0]}) · ${T("agora", "now")}</small><h1 class="cl-t">--°C</h1><p class="cl-c">${T("Consultando os pombos…", "Asking the pigeons…")}</p></div>
          <ul class="cl-extra"><li>💧 ${T("Umidade", "Humidity")}: <b class="cl-u">--</b></li><li>💨 ${T("Vento", "Wind")}: <b class="cl-v">--</b></li><li>✨ ${esc(c[5].split(":")[0])}:<b>${esc(c[5].split(":").slice(1).join(":") || "")}</b></li></ul></div>
        <div class="cl-semana"></div>
        <p class="cl-fonte muted"></p>
      </div>`;
    },
    init: (view, ctx, m, ir) => {
      let vivo = true;
      const c = CIDADES.find((x) => x[0] === (m[1] || "SP").toUpperCase()) || CIDADES[0];
      view.querySelector(".cl-sel select").onchange = (e) => ir("climaselva.com/" + e.target.value.toLowerCase());
      const pintar = (d, real) => {
        if (!vivo) return;
        const [ic, txt] = COND(d.code);
        view.querySelector(".cl-ic").textContent = ic; view.querySelector(".cl-t").textContent = Math.round(d.temp) + "°C"; view.querySelector(".cl-c").textContent = txt;
        view.querySelector(".cl-u").textContent = d.umid + "%"; view.querySelector(".cl-v").textContent = Math.round(d.vento) + " km/h";
        view.querySelector(".cl-semana").innerHTML = d.dias.map((x) => `<div><small>${x.dia}</small><span>${COND(x.code)[0]}</span><b>${Math.round(x.max)}°</b><i>${Math.round(x.min)}°</i></div>`).join("");
        view.querySelector(".cl-fonte").textContent = real ? T("Dados reais de Open-Meteo.com. As piadas são por nossa conta.", "Real data from Open-Meteo.com. The jokes are on us.") : T("Sem conexão com os satélites. Estes números foram chutados por um pombo experiente.", "No connection to the satellites. These numbers were guessed by an experienced pigeon.");
      };
      const falso = () => { const h = new Date(); return { temp: 22, code: 51, umid: 81, vento: 9, dias: [0, 1, 2, 3, 4].map((i) => ({ dia: i ? DIAS[(h.getDay() + i) % 7] : T("hoje", "today"), code: [51, 3, 61, 2, 80][i], max: [24, 26, 21, 27, 23][i], min: [16, 17, 15, 18, 16][i] })) }; };
      // tempo real: Open-Meteo direto; se o navegador bloquear, pelo servidor do aluOS; se nada der, o pombo chuta
      const api = ALU.CONFIG && ALU.CONFIG.api;
      const buscar = (lat, lon) => fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`)
        .then((r) => r.ok ? r.json() : Promise.reject())
        .catch(() => api ? fetch(`${String(api).replace(/\/+$/, "")}/clima?lat=${lat}&lon=${lon}`).then((r) => r.ok ? r.json() : Promise.reject()) : Promise.reject());
      const carregar = (lat, lon) => buscar(lat, lon)
        .then((j) => pintar({ temp: j.current.temperature_2m, code: j.current.weather_code, umid: j.current.relative_humidity_2m, vento: j.current.wind_speed_10m,
          dias: j.daily.time.map((t, i) => ({ dia: i ? DIAS[new Date(t + "T12:00").getDay()] : T("hoje", "today"), code: j.daily.weather_code[i], max: j.daily.temperature_2m_max[i], min: j.daily.temperature_2m_min[i] })) }, true))
        .catch(() => pintar(falso(), false));
      carregar(c[3], c[4]);
      const loc = view.querySelector(".cl-loc");
      if (loc) {
        const base = api ? String(api).replace(/\/+$/, "") : "";
        const usar = (lat, lon, rotulo) => {
          if (!vivo) return;
          view.querySelector(".cl-agora small").textContent = rotulo;
          loc.disabled = false; loc.textContent = T("📍 Sua localização", "📍 Your location"); carregar(lat, lon);
          conq("clima-local", T("Previsão sob medida", "Tailor-made forecast"), T("Viu o clima de onde você está no climaselva.", "Checked the weather where you are on climaselva."));
        };
        // plano B: sem GPS (desligado, indisponível ou demorando), usa a cidade aproximada da conexão.
        // Se a pessoa NEGOU a localização (código 1), respeita a escolha e não procura pela conexão.
        const pelaConexao = (motivo) => {
          if (!base || motivo === 1) return falhou(motivo);
          fetch(base + "/onde").then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((d) => usar(d.lat, d.lon, T(`Perto de ${d.cidade || "você"}${d.estado ? " (" + d.estado + ")" : ""} · pela sua conexão · agora`, `Near ${d.cidade || "you"}${d.estado ? " (" + d.estado + ")" : ""} · from your connection · now`)))
            .catch(() => falhou(motivo));
        };
        const falhou = (motivo) => {
          if (!vivo) return; loc.disabled = false;
          loc.textContent = motivo === 1 ? T("📍 Localização bloqueada. Libere nas configurações", "📍 Location blocked. Allow it in settings") : T("📍 Não deu. Tentar de novo", "📍 Didn't work. Try again");
        };
        loc.onclick = () => {
          loc.disabled = true; loc.textContent = T("📍 procurando você…", "📍 looking for you…");
          if (!navigator.geolocation || !window.isSecureContext) return pelaConexao(0);
          navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude.toFixed(2), lon = pos.coords.longitude.toFixed(2);
            usar(lat, lon, T(`Onde você está (${lat}, ${lon}) · agora`, `Where you are (${lat}, ${lon}) · now`));
          }, (err) => pelaConexao(err && err.code), { enableHighAccuracy: false, timeout: 12000, maximumAge: 900000 });
        };
      }
      return () => { vivo = false; };
    },
  });

  // ======================= yakurt =======================
  const AMIGOS = [["pato_roxo", "🦆"], ["kez_e_olmo", "img:img/kez.jpg"], ["Zizi", "⚔️"], [T("Gerente", "Manager"), "🎩"], [T("Lobo", "Wolf"), "🐺"], ["Marshall", "🧛"], ["Sonic", "💨"], [T("visitante", "visitor"), "🙂"], [T("leão", "lion"), "🦁"]];
  const COMUNIDADES = [["segunda", T("Eu odeio segunda-feira", "I hate Mondays"), GATO], ["csharp", T("Eu amo C#", "I love C#"), ALU.pix("csharp")], ["madrugada", T("Programo de madrugada", "I code at 3 AM"), "🌙"], ["abas", T("Eu não fecho as abas do navegador", "I never close my browser tabs"), "🗂️"], ["sekiro", T("Sekiro me humilhou", "Sekiro humbled me"), "🗡️"], ["aventura", T("Hora de Aventura", "Adventure Time"), "🍬"], ["pato", T("Patos roxos existem", "Purple ducks are real"), ALU.pix("peep")], ["cafe", T("Café > sono", "Coffee > sleep"), "☕"]];
  const recados = () => ls.get("alu.yakurt", []);
  const avYk = (e) => (e.startsWith("img:") ? `<img src="${esc(e.slice(4))}" alt="">` : e);
  const RECADOS_BASE = [["pato_roxo", "🦆", T("quack quack! passando pra deixar um recado 🦆✨", "quack quack! just stopping by to leave a scrap 🦆✨")], ["kez_e_olmo", "img:img/kez.jpg", T("oiii! perfil lindo amor, beijos ❤️", "hiii! lovely profile love, kisses ❤️")], ["Zizi", "⚔️", T("lembrete: beber água e commitar com mensagem decente", "reminder: drink water and write decent commit messages")]];
  const topoYk = () => `<header class="yk-top"><b>yakurt</b><nav><button class="link" data-ir="yakurt.com/perfil/aluisio">${T("Início", "Home")}</button> · <span>${T("Recados", "Scraps")}</span> · <span>${T("Comunidades", "Communities")}</span></nav><small>${T("visitante", "visitor")}@kez.com · ${T("Sair", "Log out")}</small></header>`;
  ALU.kezSites.push({
    re: /^yakurt\.com\/perfil\/aluisio\/?$/, titulo: () => `yakurt - ${P.nome}`,
    html: () => `
      <div class="yk">${topoYk()}
        <div class="yk-wrap">
          <aside class="yk-esq"><img src="${esc(P.foto)}" alt="${T("Foto de", "Photo of")} ${esc(P.nome)}"><b>${esc(P.nome)}</b><small>${esc(P.local)}</small>
            <ul><li>📝 ${T("recados", "scraps")}</li><li>📷 ${T("fotos", "photos")} (1)</li><li>🎬 ${T("vídeos", "videos")}</li><li>💬 ${T("depoimentos", "testimonials")} (3)</li></ul></aside>
          <section class="yk-meio">
            <div class="yk-box"><h1>${esc(P.nome)}</h1><p class="yk-sorte">${T("sorte do dia: hoje é um bom dia para dar commit.", "fortune of the day: today is a good day to commit.")}</p>
              <div class="yk-notas"><span>${T("confiável", "trusty")} <i>😊😊😊</i></span><span>${T("legal", "cool")} <i>🧊🧊🧊</i></span><span>nerd <i>🤓🤓🤓</i></span><span>${T("fãs", "fans")} <i>⭐ 404</i></span></div>
              <dl><dt>${T("quem sou eu", "about me")}:</dt><dd>${esc(P.bio[0])}</dd><dt>${T("humor", "mood")}:</dt><dd>${T("depende do build", "depends on the build")}</dd><dt>${T("estilo", "style")}:</dt><dd>${T("pixel art e café", "pixel art and coffee")}</dd><dt>${T("músicas", "music")}:</dt><dd>Arctic Monkeys, Radiohead, Joji</dd></dl></div>
            <div class="yk-box"><h2>${T("recados", "scraps")} (<span class="yk-n">0</span>)</h2>
              <form class="yk-form"><textarea maxlength="300" placeholder="${T("deixe um recado pro", "leave a scrap for")} ${esc(P.nome)}…" aria-label="${T("Seu recado", "Your scrap")}"></textarea><button class="btn">${T("enviar recado", "send scrap")}</button></form>
              <div class="yk-recados"></div></div>
            <div class="yk-box"><h2>${T("depoimentos", "testimonials")}</h2>
              <p><b>🦆 pato_roxo:</b> ${T("conheci o Aluísio quando ele ainda usava console.log pra tudo. hoje ele usa console.log pra tudo com mais confiança.", "I met Aluísio back when he used console.log for everything. Now he uses console.log for everything with more confidence.")}</p>
              <p><b>⚔️ Zizi:</b> ${T("me deixou morar na área de trabalho dele. sem aluguel. recomendo.", "let me live on his desktop. rent free. recommended.")}</p></div>
          </section>
          <aside class="yk-dir">
            <div class="yk-box"><h3>${T("amigos", "friends")} (${AMIGOS.length})</h3><div class="yk-grade">${AMIGOS.map(([n, e]) => `<span><i>${avYk(e)}</i>${esc(n)}</span>`).join("")}</div></div>
            <div class="yk-box"><h3>${T("comunidades", "communities")} (${COMUNIDADES.length})</h3><div class="yk-grade">${COMUNIDADES.map(([id, n, ic]) => `<button data-ir="yakurt.com/comunidade/${id}"><i>${ic}</i>${esc(n)}</button>`).join("")}</div></div>
          </aside>
        </div></div>`,
    init: (view) => {
      const lista = view.querySelector(".yk-recados"), n = view.querySelector(".yk-n");
      const pintar = () => { const r = [...recados().map((t) => [T("visitante", "visitor"), "🙂", t]), ...RECADOS_BASE]; n.textContent = r.length; lista.innerHTML = r.map(([a, e, t]) => `<div class="yk-recado"><i>${avYk(e)}</i><div><b>${esc(a)}</b><p>${esc(t)}</p></div></div>`).join(""); };
      view.querySelector(".yk-form").onsubmit = (e) => { e.preventDefault(); const ta = view.querySelector(".yk-form textarea"), v = ta.value.trim(); if (!v) return; ls.set("alu.yakurt", [v.slice(0, 300), ...recados()].slice(0, 30)); ta.value = ""; pintar(); conq("recado", T("Deixou recado", "Left a scrap"), T("Escreveu um recado no yakurt.", "Wrote a scrap on yakurt.")); };
      pintar();
    },
  });
  const COM_TOPICOS = {
    segunda: EN ? ["mondays should be optional", "the alarm went off and I took it personally", "does lasagna fix mondays? (debate)", "countdown to friday: 4 days"] : ["segunda deveria ser opcional", "o despertador tocou e eu levei como ofensa pessoal", "lasanha resolve segunda-feira? (debate)", "contagem regressiva pra sexta: 4 dias"],
  };
  ALU.kezSites.push({
    re: /^yakurt\.com\/comunidade\/([\w-]+)\/?$/, titulo: (m) => ((COMUNIDADES.find((c) => c[0] === m[1]) || [])[1] || T("Comunidade", "Community")) + " · yakurt",
    html: (m) => {
      const c = COMUNIDADES.find((x) => x[0] === m[1]); if (!c) return null;
      const membros = c[0] === "segunda" ? T("1.204.333", "1,204,333") : (Math.abs([...c[0]].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7)) % 90000 + 1000).toLocaleString(T("pt-BR", "en-US"));
      const tops = COM_TOPICOS[c[0]] || (EN ? ["introduce yourself here", "what brought you to this community?", "official meme thread"] : ["apresente-se aqui", "o que te trouxe a esta comunidade?", "tópico oficial de memes"]);
      const entrou = ls.get("alu.yakurt.com", []).includes(c[0]);
      return `<div class="yk">${topoYk()}
        <div class="yk-com">
          <aside class="yk-esq yk-com-img">${c[2].startsWith("<") ? c[2] : `<span class="yk-emoji">${c[2]}</span>`}<b>${esc(c[1])}</b><small>${membros} ${T("membros", "members")}</small>
            <button class="btn yk-entrar">${entrou ? T("✔ você participa", "✔ you're a member") : T("participar", "join")}</button></aside>
          <section class="yk-meio"><div class="yk-box"><h1>${esc(c[1])}</h1>
            <dl><dt>${T("descrição", "description")}:</dt><dd>${c[0] === "segunda" ? T("Para quem acorda na segunda já com saudade do domingo. Aqui a gente reclama junto, com um gato laranja como mascote e uma caneca de café na mão.", "For those who wake up on Monday already missing Sunday. Here we complain together, with an orange cat as our mascot and a mug of coffee in hand.") : T("Uma das comunidades favoritas do Aluísio. Entre e fique à vontade.", "One of Aluísio's favorite communities. Come in and make yourself at home.")}</dd>
              <dt>${T("dono", "owner")}:</dt><dd>${c[0] === "segunda" ? T("gato_de_caneca", "mug_cat") : "aluisio.dev"}</dd><dt>${T("categoria", "category")}:</dt><dd>${T("Estilo de vida", "Lifestyle")}</dd></dl></div>
            <div class="yk-box"><h2>${T("fórum", "forum")}</h2>${tops.map((t, i) => `<p class="yk-top-f"><b>${esc(t)}</b><small>${(i + 2) * 17} posts</small></p>`).join("")}</div></section>
        </div></div>`;
    },
    init: (view, ctx, m) => {
      const b = view.querySelector(".yk-entrar");
      b.onclick = () => { const l = ls.get("alu.yakurt.com", []); if (!l.includes(m[1])) l.push(m[1]); ls.set("alu.yakurt.com", l); b.textContent = T("✔ você participa", "✔ you're a member"); if (m[1] === "segunda") conq("segunda", T("Odeio segunda-feira", "I hate Mondays"), T("Entrou na comunidade mais honesta do yakurt.", "Joined the most honest community on yakurt.")); };
    },
  });

  // ======================= Kezpédia =======================
  const WIKI = {
    Aluisio: { t: P.nome, ib: true, txt: () => `<p><b>${esc(P.nome)}</b> é um ${esc(P.cargo.toLowerCase())} brasileiro, criador do <a data-ir="kezpedia.org/wiki/aluOS">aluOS</a> e tutor de pelo menos um <a data-ir="kezpedia.org/wiki/Pato_roxo">pato roxo</a>.</p>
      <h2>Carreira</h2><p>${esc(P.bio.join(" "))}</p>
      <h2>Projetos notáveis</h2><ul>${PROJ.map((p) => `<li><a data-ir="doghub.com/aluisiodev/${repoDe(p)}">${esc(p.nome)}</a>: ${esc(p.resumo)}</li>`).join("")}</ul>
      <h2>Vida pessoal</h2><p>Ama a Kezia. Mora num quarto rosa com luz de fim de tarde, um violão azul-esverdeado e uma estante com mais ninjas do que livros. Ouve Arctic Monkeys enquanto programa.<sup>[carece de fontes]</sup></p>` },
    aluOS: { t: "aluOS", txt: () => `<p>O <b>aluOS</b> é um sistema operacional fictício que roda dentro de uma página web e serve de portfolio para <a data-ir="kezpedia.org/wiki/Aluisio">${esc(P.nome)}</a>. Foi inspirado nos computadores dos anos 2000 e em jogos de mensageiro antigo.</p>
      <h2>Componentes</h2><ul><li><b>Kez(i)avana</b>: navegador da <a data-ir="kezpedia.org/wiki/Savana">savana</a>.</li><li><b>Peep Studio</b>: IDE que roda Python, JavaScript e C# de bolso.</li><li><b>MessagerTale</b>: mensageiro com um bot que aprende frases.</li><li><b>Zizi</b>: assistente virtual de cabelo azul que mora na área de trabalho e guia os visitantes.</li></ul>
      <h2>Curiosidades</h2><p>Existem conquistas escondidas pelo sistema. O número exato é segredo de Estado.<sup>[citação necessária]</sup></p>` },
    Pato_roxo: { t: "Pato roxo", txt: () => `<p>O <b>pato roxo</b> (<i>Anas peepstudiensis</i>) é o mascote do Peep Studio. Comunica-se exclusivamente por quacks.</p><h2>Evolução</h2><p>Relatos indicam que, após cinco execuções seguidas de código, o pato evolui e passa a revisar pull requests.</p>` },
    Savana: { t: "Savana", txt: () => `<p>A <b>savana</b> é o bioma onde fica a internet do aluOS. Habitada por girafas que guardam páginas 404, zebras e um leão que ruge quando alguém digita o próprio nome dela.</p>` },
  };
  // artigos em inglês
  const WIKI_EN = {
    Aluisio: () => `<p><b>${esc(P.nome)}</b> is a Brazilian ${esc(P.cargo.toLowerCase())}, creator of <a data-ir="kezpedia.org/wiki/aluOS">aluOS</a> and keeper of at least one <a data-ir="kezpedia.org/wiki/Pato_roxo">purple duck</a>.</p>
      <h2>Career</h2><p>${esc(P.bio.join(" "))}</p>
      <h2>Notable projects</h2><ul>${PROJ.map((p) => `<li><a data-ir="doghub.com/aluisiodev/${repoDe(p)}">${esc(p.nome)}</a>: ${esc(p.resumo)}</li>`).join("")}</ul>
      <h2>Personal life</h2><p>Loves Kezia. Lives in a pink bedroom with late-afternoon light, a teal guitar and a shelf with more ninjas than books. Listens to Arctic Monkeys while coding.<sup>[citation needed]</sup></p>`,
    aluOS: () => `<p><b>aluOS</b> is a fictional operating system that runs inside a web page and serves as the portfolio of <a data-ir="kezpedia.org/wiki/Aluisio">${esc(P.nome)}</a>. It was inspired by 2000s computers and old messenger games.</p>
      <h2>Components</h2><ul><li><b>Kez(i)avana</b>: the browser of the <a data-ir="kezpedia.org/wiki/Savana">savanna</a>.</li><li><b>Peep Studio</b>: an IDE that runs Python, JavaScript and pocket C#.</li><li><b>MessagerTale</b>: a messenger with a bot that learns phrases.</li><li><b>Zizi</b>: a blue-haired virtual assistant who lives on the desktop and guides visitors.</li></ul>
      <h2>Trivia</h2><p>There are achievements hidden throughout the system. The exact number is a state secret.<sup>[citation needed]</sup></p>`,
    Pato_roxo: () => `<p>The <b>purple duck</b> (<i>Anas peepstudiensis</i>) is the mascot of Peep Studio. It communicates exclusively in quacks.</p><h2>Evolution</h2><p>Reports indicate that after five code runs in a row, the duck evolves and starts reviewing pull requests.</p>`,
    Savana: () => `<p>The <b>savanna</b> is the biome where the aluOS internet lives. It is inhabited by giraffes who guard 404 pages, zebras, and a lion that roars when someone types its own name.</p>`,
  };
  if (EN) { Object.keys(WIKI_EN).forEach((k) => (WIKI[k].txt = WIKI_EN[k])); WIKI.Pato_roxo.t = "Purple duck"; WIKI.Savana.t = "Savanna"; }
  ALU.kezSites.push({
    re: /^kezpedia\.org\/wiki\/([\w-]+)\/?$/, titulo: (m) => ((WIKI[m[1]] || {}).t || T("Artigo", "Article")) + " – Kezpédia",
    html: (m) => {
      const a = WIKI[m[1]];
      const corpo = a ? a.txt() : T(`<p>A Kezpédia ainda não tem um artigo com este nome. <a data-ir="kezpedia.org/wiki/Aluisio">Que tal ler sobre o Aluísio?</a></p>`, `<p>Kezpédia does not have an article with this exact name yet. <a data-ir="kezpedia.org/wiki/Aluisio">How about reading about Aluísio?</a></p>`);
      return `<div class="wk">
        <aside class="wk-side">${icWk}<b>Kezpédia</b><small>${T("a enciclopédia livre da savana", "the free savanna encyclopedia")}</small>
          <a data-ir="kezpedia.org/wiki/Aluisio">${T("Página principal", "Main page")}</a><a data-ir="kezpedia.org/wiki/${Object.keys(WIKI)[Math.floor(Math.random() * 4)]}">${T("Artigo aleatório", "Random article")}</a><a data-ir="kezpedia.org/wiki/aluOS">aluOS</a><a data-ir="kezpedia.org/wiki/Savana">Savana</a></aside>
        <article class="wk-art"><div class="wk-abas"><span class="on">${T("Artigo", "Article")}</span><span>${T("Discussão", "Talk")}</span><span>${T("Editar", "Edit")}</span><span>${T("Ver histórico", "View history")}</span></div>
          <h1>${esc(a ? a.t : m[1].replace(/_/g, " "))}</h1><small class="muted">${T("Origem: Kezpédia, a enciclopédia livre da savana.", "From Kezpédia, the free savanna encyclopedia.")}</small>
          ${a && a.ib ? `<table class="wk-ib"><caption>${esc(P.nome)}</caption><tr><td colspan="2"><img src="${esc(P.foto)}" alt=""></td></tr><tr><th>${T("Ocupação", "Occupation")}</th><td>${esc(P.cargo)}</td></tr><tr><th>${T("Local", "Location")}</th><td>${esc(P.local)}</td></tr><tr><th>${T("Conhecido por", "Known for")}</th><td>aluOS, ${esc(PROJ.map((p) => p.curto).join(", "))}</td></tr><tr><th>${T("Mascote", "Mascot")}</th><td>${T("pato roxo", "purple duck")}</td></tr></table>` : ""}
          ${corpo}</article></div>`;
    },
  });
  ALU.kezSites.push({ re: /^kezpedia\.org\/?$/, titulo: () => "Kezpédia", html: () => `<div class="kz-404"><p>${T("Redirecionando…", "Redirecting…")}</p></div>`, init: (v, c, m, ir) => { setTimeout(() => ir("kezpedia.org/wiki/Aluisio"), 10); } });

  ALU.siteIcones = { alulugle: icAlu, musikzify: icMz, ebaa: icEb, clima: icCl, yakurt: icYk, kezpedia: icWk };
})();
