// Mais sites do Kez(i)avana: alulugle (busca e página inicial), musikzify, ebaa!, clima,
// yakurt e Kezpédia.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s);
  const P = window.PERFIL, PROJ = window.PROJETOS;
  const conq = (...a) => ALU.conquista && ALU.conquista(...a);
  const ls = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
  const repoDe = (p) => p.repo.replace("https://github.com/aluisiodev/", "");
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
    { url: "ligadin.com/feed", t: "Feed | LigadIn", d: "Posts de gratidão corporativa, vagas sênior por R$ 1.200 e um gato muito produtivo.", k: "linkedin ligadin feed posts vagas gratidao linkedisney gato bombom demitido" },
    { url: "ligadin.com/in/aluisio-alves", t: `${P.nome} | LigadIn`, d: "Perfil profissional, experiência e cursos.", k: "linkedin ligadin perfil curriculo certificado emprego vaga aluisio" },
    { url: "doghub.com/aluisiodev", t: "aluisiodev · DogHub", d: "Repositórios e código dos projetos.", k: "github doghub codigo repositorio projetos" },
    ...PROJ.map((p) => ({ url: "doghub.com/aluisiodev/" + repoDe(p), t: `${p.nome} · DogHub`, d: p.resumo, k: `${p.nome} ${p.id} ${p.stack.join(" ")} projeto` })),
    { url: "kezpedia.org/wiki/Aluisio", t: "Aluísio – Kezpédia, a enciclopédia da savana", d: "Desenvolvedor, criador do aluOS e domador de patos roxos.", k: "aluisio quem biografia wiki kezpedia" },
    { url: "kezpedia.org/wiki/aluOS", t: "aluOS – Kezpédia", d: "Sistema operacional feito em HTML, CSS e JavaScript para servir de portfolio.", k: "aluos sistema operacional portfolio desktop" },
    { url: "kezpedia.org/wiki/Pato_roxo", t: "Pato roxo – Kezpédia", d: "Mascote do Peep Studio. Revisa PRs desde que evoluiu.", k: "pato roxo peep studio quack" },
    { url: "musikzify.com", t: "musikzify · a playlist do Aluísio", d: "Ouça uma prévia das músicas que tocam enquanto ele programa.", k: "musica spotify musikzify playlist radio ouvir som" },
    { url: "ebaa.com.br", t: "ebaa! · o fórum da savana", d: "Dúvidas, códigos que só funcionam às 3h da manhã e discussões sobre patos.", k: "forum ebaa duvida discussao comunidade" },
    { url: "climaselva.com", t: "Clima da Terra da Garoa", d: "Previsão do tempo para a Terra da Garoa e todas as capitais do Brasil.", k: "clima tempo previsao chuva sol garoa sao paulo estado capital" },
    { url: "yakurt.com/perfil/aluisio", t: `${P.nome} · yakurt`, d: "Recados, depoimentos e as comunidades mais importantes da sua vida.", k: "yakurt orkut rede social recado comunidade depoimento" },
    { url: "yakurt.com/comunidade/segunda", t: "Eu odeio segunda-feira · yakurt", d: "Comunidade com 1.204.333 membros que concordam com você.", k: "segunda feira gato odeio comunidade" },
    { url: "youinthescreenofcomputerorphone.com", t: "YouInTheScreenOfComputerOrPhone", d: "Vídeos. Muitos vídeos. Alguns de 10 horas.", k: "video youtube you assistir" },
    { url: "imaiu.com", t: "imaíu · caixa de entrada", d: "E-mail grátis. Spam incluso sem custo adicional.", k: "email mail imaiu caixa" },
    { url: "clicajogos.com", t: "clicajogos · jogos grátis!!", d: "Cobrinha, Jogo da velha, Pato Clicker e Memória.", k: "jogo jogos game clicajogos cobrinha velha pato memoria" },
  ];
  const ATALHOS = () => [
    ["ligadin.com/in/aluisio-alves", ALU.pix("ligadin"), "LigadIn"], ["doghub.com/aluisiodev", ALU.pix("doghub"), "DogHub"],
    ["musikzify.com", icMz, "musikzify"], ["ebaa.com.br", icEb, "ebaa!"], ["climaselva.com", icCl, "Clima"], ["yakurt.com/perfil/aluisio", icYk, "yakurt"], ["kezpedia.org/wiki/Aluisio", icWk, "Kezpédia"],
    ...ALU.kezSites.filter((x) => x.atalho).map((x) => [x.atalho.url, x.atalho.icone, x.atalho.nome]),
  ];
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
        <form class="al-busca"><input placeholder="Pesquise na savana ou digite um endereço" aria-label="Pesquisar no Alulugle"><button class="btn" aria-label="Pesquisar">🔍</button></form>
        <div class="row"><button class="btn sec al-pesq" type="button">Pesquisar no Alulugle</button><button class="btn sec al-sorte" type="button">Estou com sorte</button></div>
        <div class="kz-atalhos">${ATALHOS().map(([u, ic, n]) => `<button data-ir="${u}">${ic}<span>${esc(n)}</span></button>`).join("")}
          ${PROJ.map((p) => `<button data-ir="doghub.com/aluisiodev/${repoDe(p)}">${ALU.iconeHTML("proj:" + p.id)}<span>${esc(p.curto)}</span></button>`).join("")}</div>
        <p class="al-rodape">Alulugle oferecido em: <b>Português</b> · <b>Savanês</b> · <b>Quack</b></p>
      </div>`,
    init: buscaInit,
  });
  ALU.kezSites.push({
    re: /^alulugle\.com\/busca\?q=(.*)$/, titulo: (m) => `${decodeURIComponent(m[1])} - Pesquisa Alulugle`,
    html: (m) => {
      const q = decodeURIComponent(m[1]), qs = sem(q);
      let extra = "", lista = resultados(q);
      if (/barrel roll|giro|gira/.test(qs)) extra = `<p class="al-dica">🌀 Uau.</p>`;
      if (qs === "alulugle" || qs === "recursao") extra = `<p class="al-dica">Você quis dizer: <button class="link" data-ir="alulugle.com/busca?q=${encodeURIComponent(q)}">${esc(q)}</button></p>`;
      if (/^(quack|pato)/.test(qs)) extra = `<p class="al-dica">🦆 Aproximadamente 9.999.999 quacks (0,01 segundo)</p>`;
      return `
      <div class="al-res">
        <header class="al-top">${logoAlu(true)}<form class="al-busca"><input value="${esc(q)}" aria-label="Pesquisar no Alulugle"><button class="btn">🔍</button></form></header>
        <p class="muted">Aproximadamente ${lista.length ? lista.length * 1337 : 0} resultados (0,42 segundo)</p>${extra}
        ${lista.length ? lista.map((r) => `<div class="al-item"><small>kez://${esc(r.url)}</small><button class="link" data-ir="${esc(r.url)}">${esc(r.t)}</button><p>${esc(r.d)}</p></div>`).join("")
          : `<div class="al-nada"><p>Sua pesquisa <b>${esc(q)}</b> não encontrou nenhum documento na savana.</p><p>Sugestões: tente <button class="link" data-ir="alulugle.com/busca?q=projetos">projetos</button>, <button class="link" data-ir="alulugle.com/busca?q=musica">música</button> ou pergunte no <button class="link" data-ir="ebaa.com.br">ebaa!</button></p></div>`}
      </div>`;
    },
    init: (view, ctx, m, ir) => {
      buscaInit(view, ctx, m, ir);
      const qs = sem(decodeURIComponent(m[1]));
      if (/barrel roll|giro|gira/.test(qs)) { view.classList.add("al-gira"); setTimeout(() => view.classList.remove("al-gira"), 1300); conq("barrel", "Deu um giro", "Pediu um giro pro Alulugle."); }
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
          <span>⌂ Início</span><span>🔍 Buscar</span><span>▤ Sua biblioteca</span>
          <hr><span class="on">♫ favs oat</span><span>♫ Rádio da savana</span><span>♫ Quack-fi beats to code to</span></aside>
        <section class="mz-main">
          <div class="mz-hero"><div class="mz-capa"><img src="${esc(P.foto)}" alt=""><i>♫</i></div>
            <div><small>PLAYLIST PÚBLICA</small><h1>favs oat</h1><p>O que toca no monitor esquerdo enquanto eu programo. De Cartola a Joji, de Terno Rei a System Of A Down.</p>
            <p class="mz-quem"><img src="${esc(P.foto)}" alt=""> <b>${esc(P.nome)}</b> · ${FAIXAS.length} músicas</p></div></div>
          <div class="mz-acoes"><button class="mz-play" aria-label="Tocar">▶</button><a class="btn real" href="https://open.spotify.com/playlist/${PLAYLIST}" target="_blank" rel="noopener">Sair da savana: ouvir no Spotify ↗</a></div>
          <div class="mz-player" hidden><iframe title="Prévia no Spotify" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe></div>
          <p class="mz-aviso" hidden>Nesta prévia o navegador não deixa o player do Spotify aparecer. Clique numa música para ouvir no Spotify, ou abra o site publicado.</p>
          <ol class="mz-lista">${FAIXAS.map((f, i) => `<li><button data-i="${i}"><span class="n">${i + 1}</span><span class="t"><b>${esc(f[0])}</b><small>${esc(f[1])}</small></span><span class="d">${f[2]}</span></button></li>`).join("")}</ol>
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
      view.querySelectorAll(".mz-lista button").forEach((b) => (b.onclick = () => {
        const f = FAIXAS[+b.dataset.i];
        view.querySelectorAll(".mz-lista button").forEach((x) => x.classList.toggle("on", x === b));
        if (bloqueado) { aviso.hidden = false; window.open(buscaSpotify(f), "_blank", "noopener"); return; }
        abrirPlayer();
        ALU.urso && ALU.urso.falar && ALU.urso.falar(`Boa! ${f[0]} é das boas.`);
      }));
      if (!bloqueado) abrirPlayer(); else aviso.hidden = false;
      conq("musikzify", "Trilha sonora", "Abriu a playlist no musikzify.");
    },
  });

  // ======================= ebaa! =======================
  const TOPICOS = [
    { id: "funciona", cat: "Programação", t: "[RESOLVIDO] meu código só funciona quando eu não estou olhando", autor: "dev_noturno", posts: [
      ["dev_noturno", "🦉", "Toda vez que eu chamo alguém pra ver o bug, ele some. Quando a pessoa vai embora, volta. Alguém?"],
      ["pato_roxo", "🦆", "quack. (tradução: explica o código linha por linha pra mim)"],
      ["dev_noturno", "🦉", "expliquei pro pato e achei o erro. era um ponto e vírgula. RESOLVIDO."]] },
    { id: "urso", cat: "Geral da savana", t: "tem alguém de cabelo azul com uma espada na minha área de trabalho??", autor: "visitante_2006", posts: [
      ["visitante_2006", "👀", "apareceu um mascote de cabelo azul e espada nas costas no meu desktop. é vírus???"],
      ["Zizi", "⚔️", "oi! não sou vírus, sou Zizi, mascote do aluOS. prometo não instalar barra de ferramentas."],
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
      ["seguranca_novato", "🔦", "primeiro dia de trabalho na pizzaria. alguma dica?"],
      ["urso_animatronico", "🐻", "har har har"],
      ["seguranca_novato", "🔦", "isso não ajudou em nada"]] },
    { id: "sekiro", cat: "Jogos", t: "zerei Sekiro e agora não sei o que fazer da vida", autor: "lobo_de_um_braco", posts: [
      ["lobo_de_um_braco", "🗡️", "200 horas. o Isshin me ensinou mais que a faculdade."],
      ["aluisio.dev", "🎧", "hesitation is defeat. bora pra NG+"]] },
  ];
  const meusPosts = () => ls.get("alu.ebaa", {});
  ALU.kezSites.push({
    re: /^ebaa\.com\.br\/?$/, titulo: () => "ebaa! · o fórum da savana",
    html: () => {
      const cats = [...new Set(TOPICOS.map((t) => t.cat))], mp = meusPosts();
      return `<div class="eb">
        <header class="eb-top">${icEb}<b>ebaa!</b><span>o fórum da savana desde 2004 · ${1337 + Object.values(mp).flat().length} membros online</span></header>
        ${cats.map((c) => `<table class="eb-tab"><thead><tr><th>${esc(c)}</th><th>Respostas</th><th>Autor</th></tr></thead><tbody>
          ${TOPICOS.filter((t) => t.cat === c).map((t) => `<tr><td><button class="link" data-ir="ebaa.com.br/t/${t.id}">${esc(t.t)}</button></td><td>${t.posts.length - 1 + (mp[t.id] || []).length}</td><td>${esc(t.autor)}</td></tr>`).join("")}</tbody></table>`).join("")}
        <p class="eb-rodape">Powered by ebaaBB 2.0.4 · Regras: não alimente os trolls nem os patos.</p></div>`;
    },
  });
  ALU.kezSites.push({
    re: /^ebaa\.com\.br\/t\/([\w-]+)\/?$/, titulo: (m) => ((TOPICOS.find((t) => t.id === m[1]) || {}).t || "Tópico") + " · ebaa!",
    html: (m) => {
      const t = TOPICOS.find((x) => x.id === m[1]); if (!t) return null;
      const extras = (meusPosts()[t.id] || []).map((x) => ["visitante", "🙂", x]);
      return `<div class="eb">
        <header class="eb-top">${icEb}<button class="link" data-ir="ebaa.com.br"><b>ebaa!</b></button><span>${esc(t.cat)} › ${esc(t.t)}</span></header>
        <h2 class="eb-h">${esc(t.t)}</h2>
        <div class="eb-posts">${[...t.posts, ...extras].map(([a, av, txt], i) => `<div class="eb-post"><aside><span>${av}</span><b>${esc(a)}</b><small>${i === 0 ? "autor do tópico" : "membro"}</small></aside><div><small>#${i + 1} · postado há ${i + 1} ${i ? "horas" : "dia"}</small><p>${esc(txt)}</p><em>— ${esc(a)} | ${a === "pato_roxo" ? "quack" : a === "aluisio.dev" ? "feito com HTML e café" : "minha assinatura é muito legal"}</em></div></div>`).join("")}</div>
        <form class="eb-resp"><b>Responder</b><textarea maxlength="400" placeholder="Seja gentil. O pato está de olho." aria-label="Sua resposta"></textarea><button class="btn real">Enviar resposta</button></form></div>`;
    },
    init: (view, ctx, m, ir) => {
      view.querySelector(".eb-resp").onsubmit = (e) => {
        e.preventDefault(); const v = view.querySelector(".eb-resp textarea").value.trim(); if (!v) return;
        const mp = meusPosts(); (mp[m[1]] = mp[m[1]] || []).push(v.slice(0, 400)); ls.set("alu.ebaa", mp);
        conq("ebaa", "Membro do fórum", "Respondeu um tópico no ebaa!.");
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
  const COND = (c) => c === 0 ? ["☀️", "Céu limpo (aproveite)"] : c <= 2 ? ["🌤️", "Sol entre nuvens"] : c === 3 ? ["☁️", "Nublado"] : c <= 48 ? ["🌫️", "Neblina"]
    : c <= 57 ? ["🌦️", "Garoa"] : c <= 67 ? ["🌧️", "Chuva: leve o guarda-chuva"] : c <= 77 ? ["❄️", "Neve?! Confira seu termômetro"] : c <= 82 ? ["🌧️", "Pancadas de chuva"] : ["⛈️", "Tempestade. Fique em casa programando"];
  const DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  ALU.kezSites.push({
    re: /^climaselva\.com(?:\/(\w\w))?\/?$/, titulo: (m) => { const c = CIDADES.find((x) => x[0] === (m[1] || "SP").toUpperCase()) || CIDADES[0]; return "Clima da " + c[1]; },
    html: (m) => {
      const c = CIDADES.find((x) => x[0] === (m[1] || "SP").toUpperCase()) || CIDADES[0];
      return `
      <div class="cl">
        <header class="cl-top">${icCl}<b>Clima da ${esc(c[1])}</b><label class="cl-sel">Estado: <select aria-label="Escolher estado">${CIDADES.map((x) => `<option value="${x[0]}" ${x === c ? "selected" : ""}>${x[0]} · ${esc(x[2])}</option>`).join("")}</select></label></header>
        <div class="cl-agora"><div class="cl-ic">⏳</div><div><small>${esc(c[1])} (${esc(c[2])}, ${c[0]}) · agora</small><h1 class="cl-t">--°C</h1><p class="cl-c">Consultando os pombos…</p></div>
          <ul class="cl-extra"><li>💧 Umidade: <b class="cl-u">--</b></li><li>💨 Vento: <b class="cl-v">--</b></li><li>✨ ${esc(c[5].split(":")[0])}:<b>${esc(c[5].split(":").slice(1).join(":") || "")}</b></li></ul></div>
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
        view.querySelector(".cl-fonte").textContent = real ? "Dados reais de Open-Meteo.com. As piadas são por nossa conta." : "Sem conexão com os satélites. Estes números foram chutados por um pombo experiente.";
      };
      const falso = () => { const h = new Date(); return { temp: 22, code: 51, umid: 81, vento: 9, dias: [0, 1, 2, 3, 4].map((i) => ({ dia: i ? DIAS[(h.getDay() + i) % 7] : "hoje", code: [51, 3, 61, 2, 80][i], max: [24, 26, 21, 27, 23][i], min: [16, 17, 15, 18, 16][i] })) }; };
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c[3]}&longitude=${c[4]}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`)
        .then((r) => r.ok ? r.json() : Promise.reject())
        .then((j) => pintar({ temp: j.current.temperature_2m, code: j.current.weather_code, umid: j.current.relative_humidity_2m, vento: j.current.wind_speed_10m,
          dias: j.daily.time.map((t, i) => ({ dia: i ? DIAS[new Date(t + "T12:00").getDay()] : "hoje", code: j.daily.weather_code[i], max: j.daily.temperature_2m_max[i], min: j.daily.temperature_2m_min[i] })) }, true))
        .catch(() => pintar(falso(), false));
      return () => { vivo = false; };
    },
  });

  // ======================= yakurt =======================
  const AMIGOS = [["pato_roxo", "🦆"], ["kez_e_olmo", "img:img/kez.jpg"], ["Zizi", "⚔️"], ["Gerente", "🎩"], ["Lobo", "🐺"], ["Marshall", "🧛"], ["Sonic", "💨"], ["visitante", "🙂"], ["leão", "🦁"]];
  const COMUNIDADES = [["segunda", "Eu odeio segunda-feira", GATO], ["csharp", "Eu amo C#", ALU.pix("csharp")], ["madrugada", "Programo de madrugada", "🌙"], ["abas", "Eu não fecho as abas do navegador", "🗂️"], ["sekiro", "Sekiro me humilhou", "🗡️"], ["aventura", "Hora de Aventura", "🍬"], ["pato", "Patos roxos existem", ALU.pix("peep")], ["cafe", "Café > sono", "☕"]];
  const recados = () => ls.get("alu.yakurt", []);
  const avYk = (e) => (e.startsWith("img:") ? `<img src="${esc(e.slice(4))}" alt="">` : e);
  const RECADOS_BASE = [["pato_roxo", "🦆", "quack quack! passando pra deixar um recado 🦆✨"], ["kez_e_olmo", "img:img/kez.jpg", "oiii!! passando pra deixar meu recado aqui 💙"], ["Zizi", "⚔️", "lembrete: beber água e commitar com mensagem decente"]];
  const topoYk = () => `<header class="yk-top"><b>yakurt</b><nav><button class="link" data-ir="yakurt.com/perfil/aluisio">Início</button> · <span>Recados</span> · <span>Comunidades</span></nav><small>visitante@kez.com · Sair</small></header>`;
  ALU.kezSites.push({
    re: /^yakurt\.com\/perfil\/aluisio\/?$/, titulo: () => `yakurt - ${P.nome}`,
    html: () => `
      <div class="yk">${topoYk()}
        <div class="yk-wrap">
          <aside class="yk-esq"><img src="${esc(P.foto)}" alt="Foto de ${esc(P.nome)}"><b>${esc(P.nome)}</b><small>${esc(P.local)}</small>
            <ul><li>📝 recados</li><li>📷 fotos (1)</li><li>🎬 vídeos</li><li>💬 depoimentos (3)</li></ul></aside>
          <section class="yk-meio">
            <div class="yk-box"><h1>${esc(P.nome)}</h1><p class="yk-sorte">sorte do dia: hoje é um bom dia para dar commit.</p>
              <div class="yk-notas"><span>confiável <i>😊😊😊</i></span><span>legal <i>🧊🧊🧊</i></span><span>nerd <i>🤓🤓🤓</i></span><span>fãs <i>⭐ 404</i></span></div>
              <dl><dt>quem sou eu:</dt><dd>${esc(P.bio[0])}</dd><dt>humor:</dt><dd>depende do build</dd><dt>estilo:</dt><dd>pixel art e café</dd><dt>músicas:</dt><dd>Arctic Monkeys, Radiohead, Joji</dd></dl></div>
            <div class="yk-box"><h2>recados (<span class="yk-n">0</span>)</h2>
              <form class="yk-form"><textarea maxlength="300" placeholder="deixe um recado pro ${esc(P.nome)}…" aria-label="Seu recado"></textarea><button class="btn">enviar recado</button></form>
              <div class="yk-recados"></div></div>
            <div class="yk-box"><h2>depoimentos</h2>
              <p><b>🦆 pato_roxo:</b> conheci o Aluísio quando ele ainda usava console.log pra tudo. hoje ele usa console.log pra tudo com mais confiança.</p>
              <p><b>⚔️ Zizi:</b> me deixou morar na área de trabalho dele. sem aluguel. recomendo.</p></div>
          </section>
          <aside class="yk-dir">
            <div class="yk-box"><h3>amigos (${AMIGOS.length})</h3><div class="yk-grade">${AMIGOS.map(([n, e]) => `<span><i>${avYk(e)}</i>${esc(n)}</span>`).join("")}</div></div>
            <div class="yk-box"><h3>comunidades (${COMUNIDADES.length})</h3><div class="yk-grade">${COMUNIDADES.map(([id, n, ic]) => `<button data-ir="yakurt.com/comunidade/${id}"><i>${ic}</i>${esc(n)}</button>`).join("")}</div></div>
          </aside>
        </div></div>`,
    init: (view) => {
      const lista = view.querySelector(".yk-recados"), n = view.querySelector(".yk-n");
      const pintar = () => { const r = [...recados().map((t) => ["visitante", "🙂", t]), ...RECADOS_BASE]; n.textContent = r.length; lista.innerHTML = r.map(([a, e, t]) => `<div class="yk-recado"><i>${avYk(e)}</i><div><b>${esc(a)}</b><p>${esc(t)}</p></div></div>`).join(""); };
      view.querySelector(".yk-form").onsubmit = (e) => { e.preventDefault(); const ta = view.querySelector(".yk-form textarea"), v = ta.value.trim(); if (!v) return; ls.set("alu.yakurt", [v.slice(0, 300), ...recados()].slice(0, 30)); ta.value = ""; pintar(); conq("recado", "Deixou recado", "Escreveu um recado no yakurt."); };
      pintar();
    },
  });
  const COM_TOPICOS = {
    segunda: ["segunda deveria ser opcional", "o despertador tocou e eu levei como ofensa pessoal", "lasanha resolve segunda-feira? (debate)", "contagem regressiva pra sexta: 4 dias"],
  };
  ALU.kezSites.push({
    re: /^yakurt\.com\/comunidade\/([\w-]+)\/?$/, titulo: (m) => ((COMUNIDADES.find((c) => c[0] === m[1]) || [])[1] || "Comunidade") + " · yakurt",
    html: (m) => {
      const c = COMUNIDADES.find((x) => x[0] === m[1]); if (!c) return null;
      const membros = c[0] === "segunda" ? "1.204.333" : (Math.abs([...c[1]].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7)) % 90000 + 1000).toLocaleString("pt-BR");
      const tops = COM_TOPICOS[c[0]] || ["apresente-se aqui", "o que te trouxe a esta comunidade?", "tópico oficial de memes"];
      const entrou = ls.get("alu.yakurt.com", []).includes(c[0]);
      return `<div class="yk">${topoYk()}
        <div class="yk-com">
          <aside class="yk-esq yk-com-img">${c[2].startsWith("<") ? c[2] : `<span class="yk-emoji">${c[2]}</span>`}<b>${esc(c[1])}</b><small>${membros} membros</small>
            <button class="btn yk-entrar">${entrou ? "✔ você participa" : "participar"}</button></aside>
          <section class="yk-meio"><div class="yk-box"><h1>${esc(c[1])}</h1>
            <dl><dt>descrição:</dt><dd>${c[0] === "segunda" ? "Para quem acorda na segunda já com saudade do domingo. Aqui a gente reclama junto, com um gato laranja como mascote e uma caneca de café na mão." : "Uma das comunidades favoritas do Aluísio. Entre e fique à vontade."}</dd>
              <dt>dono:</dt><dd>${c[0] === "segunda" ? "gato_de_caneca" : "aluisio.dev"}</dd><dt>categoria:</dt><dd>Estilo de vida</dd></dl></div>
            <div class="yk-box"><h2>fórum</h2>${tops.map((t, i) => `<p class="yk-top-f"><b>${esc(t)}</b><small>${(i + 2) * 17} posts</small></p>`).join("")}</div></section>
        </div></div>`;
    },
    init: (view, ctx, m) => {
      const b = view.querySelector(".yk-entrar");
      b.onclick = () => { const l = ls.get("alu.yakurt.com", []); if (!l.includes(m[1])) l.push(m[1]); ls.set("alu.yakurt.com", l); b.textContent = "✔ você participa"; if (m[1] === "segunda") conq("segunda", "Odeio segunda-feira", "Entrou na comunidade mais honesta do yakurt."); };
    },
  });

  // ======================= Kezpédia =======================
  const WIKI = {
    Aluisio: { t: P.nome, ib: true, txt: () => `<p><b>${esc(P.nome)}</b> é um ${esc(P.cargo.toLowerCase())} brasileiro, criador do <a data-ir="kezpedia.org/wiki/aluOS">aluOS</a> e tutor de pelo menos um <a data-ir="kezpedia.org/wiki/Pato_roxo">pato roxo</a>.</p>
      <h2>Carreira</h2><p>${esc(P.bio.join(" "))}</p>
      <h2>Projetos notáveis</h2><ul>${PROJ.map((p) => `<li><a data-ir="doghub.com/aluisiodev/${repoDe(p)}">${esc(p.nome)}</a>: ${esc(p.resumo)}</li>`).join("")}</ul>
      <h2>Vida pessoal</h2><p>Ama a Kézia. Mora num quarto rosa com luz de fim de tarde, um violão azul-esverdeado e uma estante com mais ninjas do que livros. Ouve Arctic Monkeys enquanto programa.<sup>[carece de fontes]</sup></p>` },
    aluOS: { t: "aluOS", txt: () => `<p>O <b>aluOS</b> é um sistema operacional fictício que roda dentro de uma página web e serve de portfolio para <a data-ir="kezpedia.org/wiki/Aluisio">${esc(P.nome)}</a>. Foi inspirado nos computadores dos anos 2000 e em jogos de mensageiro antigo.</p>
      <h2>Componentes</h2><ul><li><b>Kez(i)avana</b>: navegador da <a data-ir="kezpedia.org/wiki/Savana">savana</a>.</li><li><b>Peep Studio</b>: IDE que roda Python, JavaScript e C# de bolso.</li><li><b>MessagerTale</b>: mensageiro com um bot que aprende frases.</li><li><b>Zizi</b>: mascote de cabelo azul que mora na área de trabalho.</li></ul>
      <h2>Curiosidades</h2><p>Existem conquistas escondidas pelo sistema. O número exato é segredo de Estado.<sup>[citação necessária]</sup></p>` },
    Pato_roxo: { t: "Pato roxo", txt: () => `<p>O <b>pato roxo</b> (<i>Anas peepstudiensis</i>) é o mascote do Peep Studio. Comunica-se exclusivamente por quacks.</p><h2>Evolução</h2><p>Relatos indicam que, após cinco execuções seguidas de código, o pato evolui e passa a revisar pull requests.</p>` },
    Savana: { t: "Savana", txt: () => `<p>A <b>savana</b> é o bioma onde fica a internet do aluOS. Habitada por girafas que guardam páginas 404, zebras e um leão que ruge quando alguém digita o próprio nome dela.</p>` },
  };
  ALU.kezSites.push({
    re: /^kezpedia\.org\/wiki\/([\w-]+)\/?$/, titulo: (m) => ((WIKI[m[1]] || {}).t || "Artigo") + " – Kezpédia",
    html: (m) => {
      const a = WIKI[m[1]];
      const corpo = a ? a.txt() : `<p>A Kezpédia ainda não tem um artigo com este nome. <a data-ir="kezpedia.org/wiki/Aluisio">Que tal ler sobre o Aluísio?</a></p>`;
      return `<div class="wk">
        <aside class="wk-side">${icWk}<b>Kezpédia</b><small>a enciclopédia livre da savana</small>
          <a data-ir="kezpedia.org/wiki/Aluisio">Página principal</a><a data-ir="kezpedia.org/wiki/${Object.keys(WIKI)[Math.floor(Math.random() * 4)]}">Artigo aleatório</a><a data-ir="kezpedia.org/wiki/aluOS">aluOS</a><a data-ir="kezpedia.org/wiki/Savana">Savana</a></aside>
        <article class="wk-art"><div class="wk-abas"><span class="on">Artigo</span><span>Discussão</span><span>Editar</span><span>Ver histórico</span></div>
          <h1>${esc(a ? a.t : m[1].replace(/_/g, " "))}</h1><small class="muted">Origem: Kezpédia, a enciclopédia livre da savana.</small>
          ${a && a.ib ? `<table class="wk-ib"><caption>${esc(P.nome)}</caption><tr><td colspan="2"><img src="${esc(P.foto)}" alt=""></td></tr><tr><th>Ocupação</th><td>${esc(P.cargo)}</td></tr><tr><th>Local</th><td>${esc(P.local)}</td></tr><tr><th>Conhecido por</th><td>aluOS, ${esc(PROJ.map((p) => p.curto).join(", "))}</td></tr><tr><th>Mascote</th><td>pato roxo</td></tr></table>` : ""}
          ${corpo}</article></div>`;
    },
  });
  ALU.kezSites.push({ re: /^kezpedia\.org\/?$/, titulo: () => "Kezpédia", html: () => `<div class="kz-404"><p>Redirecionando…</p></div>`, init: (v, c, m, ir) => { setTimeout(() => ir("kezpedia.org/wiki/Aluisio"), 10); } });

  ALU.siteIcones = { alulugle: icAlu, musikzify: icMz, ebaa: icEb, clima: icCl, yakurt: icYk, kezpedia: icWk };
})();
