// Sites "bootleg" que só existem dentro do Kez(i)avana.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s);
  const P = window.PERFIL, PROJ = window.PROJETOS;
  const conq = (...a) => ALU.conquista && ALU.conquista(...a);
  const T = (pt, en) => (ALU.lang === "en" ? en : pt), EN = ALU.lang === "en";

  // pequeno logo em pixel art: ▶ vermelho
  const logoYou = `<svg class="px" viewBox="0 0 12 8" shape-rendering="crispEdges"><rect x="0" y="1" width="12" height="6" fill="#e0261b"/><rect x="1" y="0" width="10" height="8" fill="#e0261b"/><rect x="5" y="2" width="1" height="4" fill="#fff"/><rect x="6" y="3" width="1" height="2" fill="#fff"/><rect x="6" y="2" width="1" height="1" fill="#fff"/><rect x="6" y="5" width="1" height="1" fill="#fff"/><rect x="7" y="3" width="1" height="2" fill="#fff"/></svg>`;
  const logoMail = `<svg class="px" viewBox="0 0 12 9" shape-rendering="crispEdges"><rect x="0" y="0" width="12" height="9" fill="#1b1426"/><rect x="1" y="1" width="10" height="7" fill="#fff"/><rect x="1" y="1" width="1" height="1" fill="#e0413a"/><rect x="2" y="2" width="1" height="1" fill="#e0413a"/><rect x="3" y="3" width="2" height="1" fill="#e0413a"/><rect x="5" y="4" width="2" height="1" fill="#e0413a"/><rect x="7" y="3" width="2" height="1" fill="#e0413a"/><rect x="9" y="2" width="1" height="1" fill="#e0413a"/><rect x="10" y="1" width="1" height="1" fill="#e0413a"/></svg>`;
  const logoJogos = `<svg class="px" viewBox="0 0 12 8" shape-rendering="crispEdges"><rect x="1" y="1" width="10" height="6" fill="#2fbf1f"/><rect x="0" y="2" width="12" height="4" fill="#2fbf1f"/><rect x="2" y="3" width="3" height="1" fill="#1b1426"/><rect x="3" y="2" width="1" height="3" fill="#1b1426"/><rect x="8" y="2" width="1" height="1" fill="#f2c230"/><rect x="9" y="4" width="1" height="1" fill="#e0413a"/></svg>`;

  // ======================= YouInTheScreenOfComputerOrPhone =======================
  const VIDEOS = [
    { id: "portfolio", titulo: T("fiz meu portfolio virar um SISTEMA OPERACIONAL (deu ruim?)", "I turned my portfolio into an OPERATING SYSTEM (did it go wrong?)"), canal: "aluisio.dev", views: T("1,2 mi", "1.2M"), dur: "0:24", cor: ["#2f6bff", "#7c3aed"], emoji: "🖥️",
      frames: EN ? ["one day I thought:", "what if the portfolio was a computer?", "folders. windows. a purple duck.", "a savanna browser 🦒", "and a 360° room", "you are watching this INSIDE it.", "subscribe (there's no button)"] : ["um dia eu pensei:", "e se o portfolio fosse um computador?", "pastas. janelas. um pato roxo.", "um navegador da savana 🦒", "e um quarto 360°", "você está assistindo isso DENTRO dele.", "inscreva-se (não tem botão)"] },
    { id: "deskmate", titulo: T("Deskmate: um agent de IA open-source que se pluga em qualquer service desk", "Deskmate: an open-source AI agent that plugs into any service desk"), canal: "aluisio.dev", views: T("48 mil", "48K"), dur: "0:20", cor: ["#0F766E", "#22D3EE"], emoji: "🤖",
      frames: EN ? ["employee: \"my VPN is down\"", "agent: sets the priority", "agent: looks for similar tickets", "agent: opens the ticket in GLPI", "employee: confirms ✅", "GLPI, Jira, Zammad… one adapter each"] : ["funcionário: \"minha VPN caiu\"", "agent: define a prioridade", "agent: procura chamados parecidos", "agent: abre o chamado no GLPI", "funcionário: confirma ✅", "GLPI, Jira, Zammad… um adaptador pra cada"] },
    { id: "leet", titulo: T("resolvi um LeetCode Easy em 0 ms (speedrun any%)", "I solved a LeetCode Easy in 0 ms (any% speedrun)"), canal: "aluisio.dev", views: T("3,4 mil", "3.4K"), dur: "0:16", cor: ["#f59e0b", "#1b1426"], emoji: "⚡",
      frames: ["Q2. How Many Numbers Are Smaller...", "for i in range(len(nums)):", "for j in range(i+1, len(nums)):", "Accepted ✅", "Runtime: 0 ms", "GG"] },
    { id: "pato", titulo: T("10 horas de pato quackando (Peep Studio ASMR)", "10 hours of a duck quacking (Peep Studio ASMR)"), canal: "Peep Studio", views: T("9,9 mi", "9.9M"), dur: "10:00:00", cor: ["#9b6bff", "#2b1060"], emoji: "🦆",
      frames: ["quack", "quack", "quack.", "QUACK", "quack?", T("(compilação concluída: 1 pato)", "(build succeeded: 1 duck)")] },
    { id: "violao", titulo: T("violão azul tocando no fim de tarde 🌅", "blue guitar playing at sunset 🌅"), canal: "aluisio.dev", views: "812", dur: "0:18", cor: ["#1fa8a0", "#f2c230"], emoji: "🎸",
      frames: ["♪ ♫ ♪", T("(luz de fim de tarde entrando pela janela)", "(late afternoon light coming through the window)"), "♫ ♪ ♫", T("TODO: gravar um cover de verdade", "TODO: record a real cover")] },
    { id: "doce", titulo: T("um site que monta a encomenda e manda no WhatsApp", "a site that builds your order and sends it on WhatsApp"), canal: "Doce & Afeto", views: T("27 mil", "27K"), dur: "0:15", cor: ["#F472B6", "#FB923C"], emoji: "🍰",
      frames: EN ? ["pick the cake", "pick the flavor", "customize it", "\"Hi, Ana! I came from the site...\"", "message ready on WhatsApp 💬"] : ["escolhe o bolo", "escolhe o sabor", "personaliza", "\"Oi, Ana! Vim pelo site...\"", "mensagem pronta no WhatsApp 💬"] },
  ];
  const COMENTARIOS = [
    ["pato_roxo_oficial", T("primeiro 🦆", "first 🦆")], ["girafa_da_404", T("eu moro na página de erro e aprovo", "i live on the error page and i approve")], ["urso_animatronico", "har har har"],
    ["visitante_2006", T("alguém em 2026?", "anyone in 2026?")], [T("shinobi_sem_braço", "one_armed_shinobi"), "hesitation is defeat"], ["recrutador_curioso", T("manda o currículo no imaíu", "send your resume on imaíu")],
  ];
  function thumb(v) {
    return `<div class="yt-thumb" style="--c1:${v.cor[0]};--c2:${v.cor[1]}"><span>${v.emoji}</span><i>${esc(v.dur)}</i></div>`;
  }
  ALU.kezSites.push({
    re: /^(youinthescreenofcomputerorphone|yitsocop|youin)\.com\/?$/, titulo: () => "YouInTheScreenOfComputerOrPhone",
    atalho: { url: "youinthescreenofcomputerorphone.com", nome: "YouInTheScreen…", icone: logoYou },
    html: () => `
      <div class="yt">
        <header class="yt-top"><span class="yt-logo">${logoYou}<b>YouInTheScreen<small>OfComputerOrPhone</small></b></span><input placeholder="${T("Pesquisar", "Search")}" aria-label="${T("Pesquisar vídeos", "Search videos")}"><span class="yt-av"><img src="${esc(P.foto)}" alt=""></span></header>
        <div class="yt-grid">${VIDEOS.map((v) => `<button class="yt-card" data-ir="youinthescreenofcomputerorphone.com/watch/${v.id}">${thumb(v)}<strong>${esc(v.titulo)}</strong><small>${esc(v.canal)} · ${v.views} ${T("visualizações", "views")}</small></button>`).join("")}</div>
      </div>`,
  });
  ALU.kezSites.push({
    re: /^(youinthescreenofcomputerorphone|yitsocop|youin)\.com\/watch\/([\w-]+)\/?$/, titulo: (m) => (VIDEOS.find((v) => v.id === m[2]) || {}).titulo || T("Vídeo", "Video"),
    html: (m) => {
      const v = VIDEOS.find((x) => x.id === m[2]); if (!v) return null;
      return `
      <div class="yt">
        <header class="yt-top"><button class="yt-logo" data-ir="youinthescreenofcomputerorphone.com">${logoYou}<b>YouInTheScreen<small>OfComputerOrPhone</small></b></button><input placeholder="${T("Pesquisar", "Search")}" aria-label="${T("Pesquisar vídeos", "Search videos")}"><span class="yt-av"><img src="${esc(P.foto)}" alt=""></span></header>
        <div class="yt-watch">
          <div>
            <div class="yt-player" style="--c1:${v.cor[0]};--c2:${v.cor[1]}"><div class="yt-frame"></div><div class="yt-ctrl"><button class="yt-pp">❚❚</button><div class="yt-bar"><i></i></div><span class="yt-t">0:00</span></div></div>
            <h2>${esc(v.titulo)}</h2>
            <div class="yt-canal"><img src="${esc(P.foto)}" alt=""><div><strong>${esc(v.canal)}</strong><small>${v.views} ${T("visualizações", "views")}</small></div><button class="btn yt-like">👍 <span>0</span></button><button class="btn yt-sub">${T("Inscrever-se", "Subscribe")}</button></div>
            <div class="yt-coms"><h3>${T("Comentários", "Comments")}</h3>${COMENTARIOS.map(([n, t]) => `<p><b>@${esc(n)}</b> ${esc(t)}</p>`).join("")}</div>
          </div>
          <aside class="yt-side">${VIDEOS.filter((x) => x !== v).map((x) => `<button data-ir="youinthescreenofcomputerorphone.com/watch/${x.id}">${thumb(x)}<span><strong>${esc(x.titulo)}</strong><small>${esc(x.canal)}</small></span></button>`).join("")}</aside>
        </div>
      </div>`;
    },
    init: (view, ctx, m) => {
      const v = VIDEOS.find((x) => x.id === m[2]);
      const fr = view.querySelector(".yt-frame"), bar = view.querySelector(".yt-bar i"), tt = view.querySelector(".yt-t"), pp = view.querySelector(".yt-pp");
      let k = 0, rodando = true, dt = 0;
      const total = v.frames.length * 2.5;
      const passo = setInterval(() => {
        if (!rodando) return;
        dt += 0.25; if (dt >= total) dt = 0;
        const i = Math.floor(dt / 2.5);
        if (i !== k || !fr.textContent) { k = i; fr.textContent = v.frames[i]; fr.classList.remove("in"); void fr.offsetWidth; fr.classList.add("in"); }
        bar.style.width = (dt / total) * 100 + "%"; tt.textContent = `0:${String(Math.floor(dt)).padStart(2, "0")}`;
      }, 250);
      pp.onclick = () => { rodando = !rodando; pp.textContent = rodando ? "❚❚" : "▶"; };
      let likes = 0; const lk = view.querySelector(".yt-like");
      lk.onclick = () => { likes++; lk.querySelector("span").textContent = likes; if (likes === 10) conq("like10", T("Fã número 1", "Number 1 fan"), T("Deu 10 likes no mesmo vídeo.", "Liked the same video 10 times.")); };
      view.querySelector(".yt-sub").onclick = (e) => { e.target.textContent = T("Inscrito ✓", "Subscribed ✓"); conq("inscrito", T("Inscrito na savana", "Subscribed in the savanna"), T("Se inscreveu num canal que não existe.", "Subscribed to a channel that doesn't exist.")); };
      if (v.id === "pato") conq("pato10h", T("ASMR aquático", "Aquatic ASMR"), T("Abriu o vídeo de 10 horas de pato.", "Opened the 10-hour duck video."));
      return () => clearInterval(passo);
    },
  });

  // ======================= imaíu =======================
  const celular = () => document.body.dataset.modo === "mobile";
  const EMAILS = [
    { de: P.usuario, quando: T("agora", "now"),
      get assunto() { return EN ? (celular() ? "welcome to my phone :)" : "welcome to my computer :)") : celular() ? "bem-vindo ao meu celular :)" : "bem-vindo ao meu computador :)"; },
      get corpo() { if (EN) return celular()
        ? `Hi!\n\nSo glad you made it here. This whole phone is my portfolio.\n\nTips:\n- the folders on the home screen have everything about me\n- Room 360° spins with your finger\n- swipe the home screen sideways: there are more apps there\n- floating Zizi helps you with everything\n\nCheers,\n${P.nome}`
        : `Hi!\n\nSo glad you made it here. This whole computer is my portfolio.\n\nTips:\n- the desktop folders have everything about me\n- you can spin quarto_360.png\n- there are lots of hidden secrets (try the terminal)\n\nCheers,\n${P.nome}`;
        return celular()
        ? `Oi!\n\nQue bom que você chegou até aqui. Este celular inteiro é o meu portfolio.\n\nDicas:\n- as pastas da tela inicial têm tudo sobre mim\n- o Quarto 360° gira com o dedo\n- deslize a tela inicial pro lado: tem mais apps lá\n- a Zizi flutuando te ajuda em tudo\n\nAbraço,\n${P.nome}`
        : `Oi!\n\nQue bom que você chegou até aqui. Este computador inteiro é o meu portfolio.\n\nDicas:\n- as pastas da área de trabalho têm tudo sobre mim\n- o quarto_360.png dá pra girar\n- tem vários segredos escondidos (tente o terminal)\n\nAbraço,\n${P.nome}`; } },
    { de: "DogHub", assunto: T("[aluisiodev] 4 repositórios fixados no seu perfil", "[aluisiodev] 4 repositories pinned on your profile"), quando: "10:42", get corpo() { return PROJ.map((p) => `• ${p.nome}: ${p.resumo}`).join("\n") + T("\n\nAuau,\nequipe DogHub", "\n\nWoof,\nthe DogHub team"); } },
    { de: "LigadIn", assunto: T("Você apareceu em 3 pesquisas esta semana (na savana)", "You appeared in 3 searches this week (in the savanna)"), quando: T("ontem", "yesterday"), corpo: T("Quem pesquisou você:\n- uma girafa (recrutadora)\n- um pato roxo (dev sênior)\n- você mesmo, 14 vezes\n\nLigue-se. LigadIn.", "Who searched for you:\n- a giraffe (recruiter)\n- a purple duck (senior dev)\n- yourself, 14 times\n\nStay plugged in. LigadIn.") },
    { de: T("Príncipe da Savana", "Prince of the Savanna"), assunto: T("URGENTE: herança de 1.000.000 de bananas", "URGENT: inheritance of 1,000,000 bananas"), quando: T("seg", "Mon"), spam: true, corpo: T("Prezado amigo,\n\nSou o príncipe da savana e preciso da sua ajuda para transferir 1.000.000 de bananas.\nEnvie apenas sua senha do MessagerTale.\n\n(isto é spam. não faça isso. nunca.)", "Dear friend,\n\nI am the prince of the savanna and I need your help to transfer 1,000,000 bananas.\nJust send me your MessagerTale password.\n\n(this is spam. don't do it. ever.)") },
    { de: "Peep Studio", assunto: T("Seu pato compilou com sucesso", "Your duck compiled successfully"), quando: T("dom", "Sun"), corpo: T("Compilação concluída: 0 erro(s), 0 aviso(s), 1 pato.\n\nquack.", "Build succeeded: 0 error(s), 0 warning(s), 1 duck.\n\nquack.") },
    { de: T("Gerente do Museu da Savana", "Savanna Museum Manager"), gerente: true, assunto: T("turno da noite: 12AM às 6AM", "night shift: 12AM to 6AM"), quando: T("sáb", "Sat"), corpo: T("Olá, olá!\n\nSó lembrando que as câmeras precisam ser checadas.\nE a porta. Cuide da porta.\nOs robôs das exposições às vezes passeiam à noite. É normal. Eu acho.\n\nhar har har", "Hello, hello!\n\nJust a reminder that the cameras need to be checked.\nAnd the door. Watch the door.\nThe exhibit robots sometimes wander at night. That's normal. I think.\n\nhar har har") },
  ];
  // Enviados: a maratona de candidaturas. Spam: as respostas, todas com o MESMO texto (só muda a empresa).
  const VAGAS = [
    ["Girafa Labs", T("Desenvolvedor Back-end Júnior (C#/.NET)", "Junior Back-end Developer (C#/.NET)"), T("13 nov", "Nov 13")], ["Zebra Bank", T("Estágio em Desenvolvimento .NET", ".NET Development Internship"), T("12 nov", "Nov 12")],
    ["Pato Systems", T("Desenvolvedor Full Stack Júnior", "Junior Full Stack Developer"), T("12 nov", "Nov 12")], ["Leão Cloud Solutions", T("Desenvolvedor .NET Júnior", "Junior .NET Developer"), T("11 nov", "Nov 11")],
    ["Banana Pay", "Software Engineer I (Back-end)", T("10 nov", "Nov 10")], ["Capivara Digital", T("Desenvolvedor React + Node Júnior", "Junior React + Node Developer"), T("8 nov", "Nov 8")],
    ["Tucano Soft", T("Programador C# Júnior", "Junior C# Programmer"), T("7 nov", "Nov 7")], ["Jacaré Data", T("Desenvolvedor Back-end (APIs REST)", "Back-end Developer (REST APIs)"), T("5 nov", "Nov 5")],
    ["Mico Mobile", T("Desenvolvedor TypeScript Júnior", "Junior TypeScript Developer"), T("4 nov", "Nov 4")], ["Arara Analytics", T("Estágio em Engenharia de Software", "Software Engineering Internship"), T("1 nov", "Nov 1")],
    ["Onça Logística", T("Desenvolvedor .NET + Redis", ".NET + Redis Developer"), T("30 out", "Oct 30")], ["Tamanduá Tech", T("Desenvolvedor Júnior (Docker/APIs)", "Junior Developer (Docker/APIs)"), T("28 out", "Oct 28")],
  ];
  const nomeCompleto = P.nomeCompleto || P.nome;
  VAGAS.forEach(([emp, vaga, dia]) => EMAILS.push({ pasta: "enviados", de: `${T("para", "to")}: rh@${emp.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "")}.com.br`, assunto: `${T("Candidatura", "Application")}: ${vaga} · ${nomeCompleto}`, quando: dia,
    corpo: EN ? `Hi, ${emp} team!\n\nMy name is ${nomeCompleto} and I would like to apply for the ${vaga} position.\n\nI work with C#/.NET, TypeScript and React, Redis, Docker and REST APIs. My projects are on my portfolio (which, as it happens, is an entire operating system).\n\nPlease find my resume attached.\n\nLooking forward to hearing from you!\n${nomeCompleto}\n\n📎 resume-aluisio-alves-FINAL-v7-for-real-this-time.pdf` : `Olá, time da ${emp}!\n\nMeu nome é ${nomeCompleto} e gostaria de me candidatar à vaga de ${vaga}.\n\nTrabalho com C#/.NET, TypeScript e React, Redis, Docker e APIs REST. Meus projetos estão no meu portfolio (que, por acaso, é um sistema operacional inteiro).\n\nSegue meu currículo em anexo.\n\nFico à disposição!\n${nomeCompleto}\n\n📎 curriculo-aluisio-alves-FINAL-v7-agora-vai.pdf` }));
  const FEEDBACK = (emp) => EN ? `Hi, ${P.nome}!\n\nThank you so much for your interest in joining the ${emp} team.\n\nAfter careful review of your profile, we have decided to move forward with other candidates whose profiles are more closely aligned with the needs of the role at this time.\n\nYour resume will remain in our talent pool and, should a suitable opportunity arise, we will get in touch.\n\nWe wish you every success in your journey!\n\nKind regards,\nTalent Acquisition Team | ${emp}` : `Olá, ${P.nome}!\n\nAgradecemos muito o seu interesse em fazer parte do time da ${emp}.\n\nApós uma análise cuidadosa do seu perfil, decidimos seguir com outros candidatos cujo perfil está mais alinhado às necessidades da vaga neste momento.\n\nSeu currículo ficará em nosso banco de talentos e, caso surja uma oportunidade compatível, entraremos em contato.\n\nDesejamos muito sucesso em sua jornada!\n\nAtenciosamente,\nEquipe de Talent Acquisition | ${emp}`;
  VAGAS.slice(0, 10).forEach(([emp, , dia]) => EMAILS.push({ pasta: "spam", feedback: true, de: `Talent Acquisition · ${emp}`, assunto: `${T("Atualização sobre sua candidatura", "Update on your application")} · ${emp}`, quando: dia, corpo: FEEDBACK(emp) }));
  EMAILS.forEach((e) => { e.pasta = e.pasta || (e.spam ? "spam" : "entrada"); });
  const PASTAS = [["entrada", T("📥 Entrada", "📥 Inbox")], ["enviados", T("📤 Enviados", "📤 Sent")], ["spam", "🗑️ Spam"]];
  ALU.kezSites.push({
    re: /^(imaiu|imaíu)\.com\/?$/, titulo: () => T("Caixa de entrada · imaíu", "Inbox · imaíu"),
    atalho: { url: "imaiu.com", nome: "imaíu", icone: logoMail },
    html: () => `
      <div class="im">
        <aside class="im-side"><div class="im-logo">${logoMail}<b>imaíu</b></div>
          <button class="btn im-novo">✎ ${T("Escrever", "Compose")}</button>
          <div class="im-pastas">${PASTAS.map(([id, n]) => `<button data-p="${id}" class="${id === "entrada" ? "on" : ""}">${n} (${EMAILS.filter((e) => e.pasta === id).length})</button>`).join("")}<span>⭐ ${T("Favoritos", "Starred")}</span></div></aside>
        <section class="im-lista"></section>
        <section class="im-ler"><p class="muted">${T("Selecione um e-mail.", "Select an email.")}</p></section>
      </div>`,
    init: (view, ctx) => {
      const ler = view.querySelector(".im-ler"), lista = view.querySelector(".im-lista"), lidos = new Set();
      const mostrarPasta = (pasta) => {
        view.querySelectorAll(".im-pastas button").forEach((b) => b.classList.toggle("on", b.dataset.p === pasta));
        lista.innerHTML = EMAILS.map((e, i) => (e.pasta === pasta ? `<button class="im-item ${i === 0 ? "nao-lido" : ""} ${e.pasta === "spam" ? "spam" : ""}" data-i="${i}"><b>${esc(e.de)}</b><span>${esc(e.assunto)}</span><small>${esc(e.quando)}</small></button>` : "")).join("");
        ler.innerHTML = `<p class="muted">${pasta === "spam" ? T("O filtro de spam do imaíu aprendeu sozinho onde colocar estes e-mails.", "imaíu's spam filter learned all by itself where these emails belong.") : pasta === "enviados" ? `${EMAILS.filter((e) => e.pasta === "enviados").length} ${T("candidaturas enviadas. Persistência é tudo.", "applications sent. Persistence is everything.")}` : T("Selecione um e-mail.", "Select an email.")}</p>`;
        ligar();
      };
      view.querySelectorAll(".im-pastas button").forEach((b) => (b.onclick = () => mostrarPasta(b.dataset.p)));
      const ligar = () => lista.querySelectorAll(".im-item").forEach((b) => (b.onclick = () => {
        const e = EMAILS[+b.dataset.i];
        view.querySelectorAll(".im-item").forEach((x) => x.classList.remove("on")); b.classList.add("on"); b.classList.remove("nao-lido");
        ler.innerHTML = `<h2>${esc(e.assunto)}</h2><p class="muted">${T("De", "From")}: <b>${esc(e.de)}</b> · ${esc(e.quando)}</p><pre>${esc(e.corpo)}</pre>${e.spam ? `<p class="im-alerta">⚠️ ${T("O imaíu acha que isto é golpe.", "imaíu thinks this is a scam.")}</p>` : ""}`;
        if (e.spam) conq("spam", T("Quase caiu", "Almost fell for it"), T("Abriu o e-mail do príncipe da savana.", "Opened the savanna prince's email."));
        if (e.gerente) conq("freddy", T("Turno da noite II", "Night shift II"), T("Leu o e-mail do gerente do museu.", "Read the museum manager's email."));
        if (e.feedback) { lidos.add(e.de); if (lidos.size >= 3) ler.insertAdjacentHTML("beforeend", `<p class="im-alerta">🔁 ${T(`Você já leu este e-mail ${lidos.size} vezes. Com empresas diferentes.`, `You have read this email ${lidos.size} times now. From different companies.`)}</p>`); if (lidos.size >= 5) conq("talentos", T("Banco de talentos", "Talent pool"), T("Leu 5 feedbacks idênticos no spam do imaíu.", "Read 5 identical rejections in imaíu's spam.")); }
      }));
      mostrarPasta("entrada");
      view.querySelector(".im-novo").onclick = () => {
        ler.innerHTML = `<h2>${T("Nova mensagem", "New message")}</h2>
          <label>${T("Para", "To")}<input value="${esc(P.contatos.email || P.usuario + "@imaiu.com")}" readonly></label>
          <label>${T("Assunto", "Subject")}<input class="im-as" placeholder="${T("Oi, Aluísio!", "Hi, Aluísio!")}"></label>
          <textarea class="im-txt" placeholder="${T("Escreva sua mensagem…", "Write your message…")}"></textarea>
          <div class="row"><button class="btn real im-env">${T("Enviar", "Send")}</button></div><p class="im-res muted"></p>`;
        ler.querySelector(".im-env").onclick = () => {
          const as = ler.querySelector(".im-as").value, txt = ler.querySelector(".im-txt").value;
          if (P.contatos.email) {
            location.href = `mailto:${P.contatos.email}?subject=${encodeURIComponent(as)}&body=${encodeURIComponent(txt)}`;
          } else {
            ler.querySelector(".im-res").textContent = T("O pombo-correio voltou: o e-mail de verdade chega em breve. Enquanto isso, me chama no LigadIn ou no MessagerTale!", "The carrier pigeon came back: real email is coming soon. In the meantime, ping me on LigadIn or MessagerTale!");
          }
        };
      };
      view.querySelector(".im-item").click();
    },
  });

  // ======================= clicajogos =======================
  const JOGOS = [
    { id: "cobrinha", nome: T("Cobrinha", "Snake"), desc: T("Coma as frutinhas. Setas ou WASD.", "Eat the fruit. Arrow keys or WASD."), cor: "#2fbf1f", emoji: "🐍" },
    { id: "velha", nome: T("Jogo da velha", "Tic-tac-toe"), desc: T("Você é o X. Zizi é a estrela ★ (e provoca).", "You are X. Zizi is the star ★ (and trash-talks)."), cor: "#2f6bff", emoji: "⚔️" },
    { id: "pato", nome: "Pato Clicker", desc: T("Clique no pato. Compre melhorias. Domine o mundo.", "Click the duck. Buy upgrades. Rule the world."), cor: "#9b6bff", emoji: "🦆" },
    { id: "memoria", nome: T("Memória da savana", "Savanna Memory"), desc: T("Ache os pares de ícones do aluOS.", "Find the matching aluOS icon pairs."), cor: "#e07b12", emoji: "🧠" },
    { id: "voador", nome: T("Pato Voador", "Flappy Duck"), desc: T("Bata as asas entre os canos. Espaço ou toque.", "Flap between the pipes. Space or tap."), cor: "#f2a25a", emoji: "🪽" },
    { id: "plantao", nome: T("Plantão Noturno", "Night Watch"), desc: T("Vigie o Museu da Savana até as 6h. Os robôs andam à noite.", "Guard the Savanna Museum until 6 AM. The robots move at night."), cor: "#3a2a5a", emoji: "🔦" },
    { id: "ritmo", nome: T("Batalha de Ritmo", "Rhythm Battle"), desc: T("Duelo musical contra Zizi. Setas no tempo certo.", "A music duel against Zizi. Hit the arrows on beat."), cor: "#e0413a", emoji: "🎵" },
  ];
  ALU.kezSites.push({
    re: /^clicajogos\.com\/?$/, titulo: () => T("clicajogos · jogos grátis!!", "clicajogos · free games!!"),
    atalho: { url: "clicajogos.com", nome: "clicajogos", icone: logoJogos },
    html: () => `
      <div class="cj">
        <header class="cj-top">${logoJogos}<b>clica<span>jogos</span></b><small>${T("jogos grátis!! sem vírus!! (confia)", "free games!! no viruses!! (trust me)")}</small></header>
        <div class="cj-banner">${T("★ NOVO ★ Pato Voador, Plantão Noturno e Batalha de Ritmo! ★ Recorde da semana na Cobrinha:", "★ NEW ★ Flappy Duck, Night Watch and Rhythm Battle! ★ Snake high score of the week:")} ${(() => { try { return localStorage.getItem("alu.cobrinha") || 0; } catch { return 0; } })()} ★</div>
        <div class="cj-grid">${JOGOS.map((j) => `<button class="cj-card" data-ir="clicajogos.com/${j.id}" style="--c:${j.cor}"><span>${j.emoji}</span><strong>${esc(j.nome)}</strong><small>${esc(j.desc)}</small></button>`).join("")}</div>
      </div>`,
  });
  ALU.kezSites.push({
    re: /^clicajogos\.com\/([\w-]+)\/?$/, titulo: (m) => ((JOGOS.find((j) => j.id === m[1]) || {}).nome || T("Jogo", "Game")) + " · clicajogos",
    html: (m) => {
      const j = JOGOS.find((x) => x.id === m[1]); if (!j) return null;
      return `<div class="cj"><header class="cj-top">${logoJogos}<button class="link" data-ir="clicajogos.com"><b>clica<span>jogos</span></b></button><small>${esc(j.nome)}</small></header>
        <div class="cj-jogo"><h2>${j.emoji} ${esc(j.nome)}</h2><p class="muted">${esc(j.desc)}</p><div class="cj-area"></div></div></div>`;
    },
    init: (view, ctx, m) => ALU.JOGOS[m[1]](view.querySelector(".cj-area")),
  });
})();
