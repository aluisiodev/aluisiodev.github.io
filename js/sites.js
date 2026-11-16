// Sites "bootleg" que só existem dentro do Kez(i)avana.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s);
  const P = window.PERFIL, PROJ = window.PROJETOS;
  const conq = (...a) => ALU.conquista && ALU.conquista(...a);

  // pequeno logo em pixel art: ▶ vermelho
  const logoYou = `<svg class="px" viewBox="0 0 12 8" shape-rendering="crispEdges"><rect x="0" y="1" width="12" height="6" fill="#e0261b"/><rect x="1" y="0" width="10" height="8" fill="#e0261b"/><rect x="5" y="2" width="1" height="4" fill="#fff"/><rect x="6" y="3" width="1" height="2" fill="#fff"/><rect x="6" y="2" width="1" height="1" fill="#fff"/><rect x="6" y="5" width="1" height="1" fill="#fff"/><rect x="7" y="3" width="1" height="2" fill="#fff"/></svg>`;
  const logoMail = `<svg class="px" viewBox="0 0 12 9" shape-rendering="crispEdges"><rect x="0" y="0" width="12" height="9" fill="#1b1426"/><rect x="1" y="1" width="10" height="7" fill="#fff"/><rect x="1" y="1" width="1" height="1" fill="#e0413a"/><rect x="2" y="2" width="1" height="1" fill="#e0413a"/><rect x="3" y="3" width="2" height="1" fill="#e0413a"/><rect x="5" y="4" width="2" height="1" fill="#e0413a"/><rect x="7" y="3" width="2" height="1" fill="#e0413a"/><rect x="9" y="2" width="1" height="1" fill="#e0413a"/><rect x="10" y="1" width="1" height="1" fill="#e0413a"/></svg>`;
  const logoJogos = `<svg class="px" viewBox="0 0 12 8" shape-rendering="crispEdges"><rect x="1" y="1" width="10" height="6" fill="#2fbf1f"/><rect x="0" y="2" width="12" height="4" fill="#2fbf1f"/><rect x="2" y="3" width="3" height="1" fill="#1b1426"/><rect x="3" y="2" width="1" height="3" fill="#1b1426"/><rect x="8" y="2" width="1" height="1" fill="#f2c230"/><rect x="9" y="4" width="1" height="1" fill="#e0413a"/></svg>`;

  // ======================= YouInTheScreenOfComputerOrPhone =======================
  const VIDEOS = [
    { id: "portfolio", titulo: "fiz meu portfolio virar um SISTEMA OPERACIONAL (deu ruim?)", canal: "aluisio.dev", views: "1,2 mi", dur: "0:24", cor: ["#2f6bff", "#7c3aed"], emoji: "🖥️",
      frames: ["um dia eu pensei:", "e se o portfolio fosse um computador?", "pastas. janelas. um pato roxo.", "um navegador da savana 🦒", "e um quarto 360°", "você está assistindo isso DENTRO dele.", "inscreva-se (não tem botão)"] },
    { id: "nexo", titulo: "Nexo Assist: um agent de IA que abre chamado sozinho", canal: "aluisio.dev", views: "48 mil", dur: "0:20", cor: ["#10B981", "#0EA5E9"], emoji: "🤖",
      frames: ["funcionário: \"minha VPN caiu\"", "agent: consulta os chamados", "agent: busca na central de ajuda", "agent: prepara um chamado", "funcionário: confirma ✅", "analista: vê o motivo de cada decisão"] },
    { id: "leet", titulo: "resolvi um LeetCode Easy em 0 ms (speedrun any%)", canal: "aluisio.dev", views: "3,4 mil", dur: "0:16", cor: ["#f59e0b", "#1b1426"], emoji: "⚡",
      frames: ["Q2. How Many Numbers Are Smaller...", "for i in range(len(nums)):", "for j in range(i+1, len(nums)):", "Accepted ✅", "Runtime: 0 ms", "GG"] },
    { id: "pato", titulo: "10 horas de pato quackando (Peep Studio ASMR)", canal: "Peep Studio", views: "9,9 mi", dur: "10:00:00", cor: ["#9b6bff", "#2b1060"], emoji: "🦆",
      frames: ["quack", "quack", "quack.", "QUACK", "quack?", "(compilação concluída: 1 pato)"] },
    { id: "violao", titulo: "violão azul tocando no fim de tarde 🌅", canal: "aluisio.dev", views: "812", dur: "0:18", cor: ["#1fa8a0", "#f2c230"], emoji: "🎸",
      frames: ["♪ ♫ ♪", "(luz de fim de tarde entrando pela janela)", "♫ ♪ ♫", "TODO: gravar um cover de verdade"] },
    { id: "doce", titulo: "um site que monta a encomenda e manda no WhatsApp", canal: "Doce & Afeto", views: "27 mil", dur: "0:15", cor: ["#F472B6", "#FB923C"], emoji: "🍰",
      frames: ["escolhe o bolo", "escolhe o sabor", "personaliza", "\"Oi, Ana! Vim pelo site...\"", "mensagem pronta no WhatsApp 💬"] },
  ];
  const COMENTARIOS = [
    ["pato_roxo_oficial", "primeiro 🦆"], ["girafa_da_404", "eu moro na página de erro e aprovo"], ["urso_animatronico", "har har har"],
    ["visitante_2006", "alguém em 2026?"], ["shinobi_sem_braço", "hesitation is defeat"], ["recrutador_curioso", "manda o currículo no imaíu"],
  ];
  function thumb(v) {
    return `<div class="yt-thumb" style="--c1:${v.cor[0]};--c2:${v.cor[1]}"><span>${v.emoji}</span><i>${esc(v.dur)}</i></div>`;
  }
  ALU.kezSites.push({
    re: /^(youinthescreenofcomputerorphone|yitsocop|youin)\.com\/?$/, titulo: () => "YouInTheScreenOfComputerOrPhone",
    atalho: { url: "youinthescreenofcomputerorphone.com", nome: "YouInTheScreen…", icone: logoYou },
    html: () => `
      <div class="yt">
        <header class="yt-top"><span class="yt-logo">${logoYou}<b>YouInTheScreen<small>OfComputerOrPhone</small></b></span><input placeholder="Pesquisar" aria-label="Pesquisar vídeos"><span class="yt-av"><img src="${esc(P.foto)}" alt=""></span></header>
        <div class="yt-grid">${VIDEOS.map((v) => `<button class="yt-card" data-ir="youinthescreenofcomputerorphone.com/watch/${v.id}">${thumb(v)}<strong>${esc(v.titulo)}</strong><small>${esc(v.canal)} · ${v.views} visualizações</small></button>`).join("")}</div>
      </div>`,
  });
  ALU.kezSites.push({
    re: /^(youinthescreenofcomputerorphone|yitsocop|youin)\.com\/watch\/([\w-]+)\/?$/, titulo: (m) => (VIDEOS.find((v) => v.id === m[2]) || {}).titulo || "Vídeo",
    html: (m) => {
      const v = VIDEOS.find((x) => x.id === m[2]); if (!v) return null;
      return `
      <div class="yt">
        <header class="yt-top"><button class="yt-logo" data-ir="youinthescreenofcomputerorphone.com">${logoYou}<b>YouInTheScreen<small>OfComputerOrPhone</small></b></button><input placeholder="Pesquisar" aria-label="Pesquisar vídeos"><span class="yt-av"><img src="${esc(P.foto)}" alt=""></span></header>
        <div class="yt-watch">
          <div>
            <div class="yt-player" style="--c1:${v.cor[0]};--c2:${v.cor[1]}"><div class="yt-frame"></div><div class="yt-ctrl"><button class="yt-pp">❚❚</button><div class="yt-bar"><i></i></div><span class="yt-t">0:00</span></div></div>
            <h2>${esc(v.titulo)}</h2>
            <div class="yt-canal"><img src="${esc(P.foto)}" alt=""><div><strong>${esc(v.canal)}</strong><small>${v.views} visualizações</small></div><button class="btn yt-like">👍 <span>0</span></button><button class="btn yt-sub">Inscrever-se</button></div>
            <div class="yt-coms"><h3>Comentários</h3>${COMENTARIOS.map(([n, t]) => `<p><b>@${esc(n)}</b> ${esc(t)}</p>`).join("")}</div>
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
      lk.onclick = () => { likes++; lk.querySelector("span").textContent = likes; if (likes === 10) conq("like10", "Fã número 1", "Deu 10 likes no mesmo vídeo."); };
      view.querySelector(".yt-sub").onclick = (e) => { e.target.textContent = "Inscrito ✓"; conq("inscrito", "Inscrito na savana", "Se inscreveu num canal que não existe."); };
      if (v.id === "pato") conq("pato10h", "ASMR aquático", "Abriu o vídeo de 10 horas de pato.");
      return () => clearInterval(passo);
    },
  });

  // ======================= imaíu =======================
  const celular = () => document.body.dataset.modo === "mobile";
  const EMAILS = [
    { de: P.usuario, quando: "agora",
      get assunto() { return celular() ? "bem-vindo ao meu celular :)" : "bem-vindo ao meu computador :)"; },
      get corpo() { return celular()
        ? `Oi!\n\nQue bom que você chegou até aqui. Este celular inteiro é o meu portfolio.\n\nDicas:\n- as pastas da tela inicial têm tudo sobre mim\n- o Quarto 360° gira com o dedo\n- deslize a tela inicial pro lado: tem mais apps lá\n- a Zizi flutuando te ajuda em tudo\n\nAbraço,\n${P.nome}`
        : `Oi!\n\nQue bom que você chegou até aqui. Este computador inteiro é o meu portfolio.\n\nDicas:\n- as pastas da área de trabalho têm tudo sobre mim\n- o quarto_360.png dá pra girar\n- tem vários segredos escondidos (tente o terminal)\n\nAbraço,\n${P.nome}`; } },
    { de: "DogHub", assunto: "[aluisiodev] 4 repositórios fixados no seu perfil", quando: "10:42", corpo: PROJ.map((p) => `• ${p.nome}: ${p.resumo}`).join("\n") + "\n\nAuau,\nequipe DogHub" },
    { de: "LigadIn", assunto: "Você apareceu em 3 pesquisas esta semana (na savana)", quando: "ontem", corpo: "Quem pesquisou você:\n- uma girafa (recrutadora)\n- um pato roxo (dev sênior)\n- você mesmo, 14 vezes\n\nLigue-se. LigadIn." },
    { de: "Príncipe da Savana", assunto: "URGENTE: herança de 1.000.000 de bananas", quando: "seg", spam: true, corpo: "Prezado amigo,\n\nSou o príncipe da savana e preciso da sua ajuda para transferir 1.000.000 de bananas.\nEnvie apenas sua senha do MessagerTale.\n\n(isto é spam. não faça isso. nunca.)" },
    { de: "Peep Studio", assunto: "Seu pato compilou com sucesso", quando: "dom", corpo: "Compilação concluída: 0 erro(s), 0 aviso(s), 1 pato.\n\nquack." },
    { de: "Gerente da Pizzaria", assunto: "turno da noite: 12AM às 6AM", quando: "sáb", corpo: "Olá, olá!\n\nSó lembrando que as câmeras precisam ser checadas.\nE a porta. Cuide da porta.\n\nhar har har" },
  ];
  // Enviados: a maratona de candidaturas. Spam: as respostas, todas com o MESMO texto (só muda a empresa).
  const VAGAS = [
    ["Girafa Labs", "Desenvolvedor Back-end Júnior (C#/.NET)", "13 nov"], ["Zebra Bank", "Estágio em Desenvolvimento .NET", "12 nov"],
    ["Pato Systems", "Desenvolvedor Full Stack Júnior", "12 nov"], ["Leão Cloud Solutions", "Desenvolvedor .NET Júnior", "11 nov"],
    ["Banana Pay", "Software Engineer I (Back-end)", "10 nov"], ["Capivara Digital", "Desenvolvedor React + Node Júnior", "8 nov"],
    ["Tucano Soft", "Programador C# Júnior", "7 nov"], ["Jacaré Data", "Desenvolvedor Back-end (APIs REST)", "5 nov"],
    ["Mico Mobile", "Desenvolvedor TypeScript Júnior", "4 nov"], ["Arara Analytics", "Estágio em Engenharia de Software", "1 nov"],
    ["Onça Logística", "Desenvolvedor .NET + Redis", "30 out"], ["Tamanduá Tech", "Desenvolvedor Júnior (Docker/APIs)", "28 out"],
  ];
  const nomeCompleto = P.nomeCompleto || P.nome;
  VAGAS.forEach(([emp, vaga, dia]) => EMAILS.push({ pasta: "enviados", de: `para: rh@${emp.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "")}.com.br`, assunto: `Candidatura: ${vaga} · ${nomeCompleto}`, quando: dia,
    corpo: `Olá, time da ${emp}!\n\nMeu nome é ${nomeCompleto} e gostaria de me candidatar à vaga de ${vaga}.\n\nTrabalho com C#/.NET, TypeScript e React, Redis, Docker e APIs REST. Meus projetos estão no meu portfolio (que, por acaso, é um sistema operacional inteiro).\n\nSegue meu currículo em anexo.\n\nFico à disposição!\n${nomeCompleto}\n\n📎 curriculo-aluisio-alves-FINAL-v7-agora-vai.pdf` }));
  const FEEDBACK = (emp) => `Olá, ${P.nome}!\n\nAgradecemos muito o seu interesse em fazer parte do time da ${emp}.\n\nApós uma análise cuidadosa do seu perfil, decidimos seguir com outros candidatos cujo perfil está mais alinhado às necessidades da vaga neste momento.\n\nSeu currículo ficará em nosso banco de talentos e, caso surja uma oportunidade compatível, entraremos em contato.\n\nDesejamos muito sucesso em sua jornada!\n\nAtenciosamente,\nEquipe de Talent Acquisition | ${emp}`;
  VAGAS.slice(0, 10).forEach(([emp, , dia]) => EMAILS.push({ pasta: "spam", feedback: true, de: `Talent Acquisition · ${emp}`, assunto: `Atualização sobre sua candidatura · ${emp}`, quando: dia, corpo: FEEDBACK(emp) }));
  EMAILS.forEach((e) => { e.pasta = e.pasta || (e.spam ? "spam" : "entrada"); });
  const PASTAS = [["entrada", "📥 Entrada"], ["enviados", "📤 Enviados"], ["spam", "🗑️ Spam"]];
  ALU.kezSites.push({
    re: /^(imaiu|imaíu)\.com\/?$/, titulo: () => "Caixa de entrada · imaíu",
    atalho: { url: "imaiu.com", nome: "imaíu", icone: logoMail },
    html: () => `
      <div class="im">
        <aside class="im-side"><div class="im-logo">${logoMail}<b>imaíu</b></div>
          <button class="btn im-novo">✎ Escrever</button>
          <div class="im-pastas">${PASTAS.map(([id, n]) => `<button data-p="${id}" class="${id === "entrada" ? "on" : ""}">${n} (${EMAILS.filter((e) => e.pasta === id).length})</button>`).join("")}<span>⭐ Favoritos</span></div></aside>
        <section class="im-lista"></section>
        <section class="im-ler"><p class="muted">Selecione um e-mail.</p></section>
      </div>`,
    init: (view, ctx) => {
      const ler = view.querySelector(".im-ler"), lista = view.querySelector(".im-lista"), lidos = new Set();
      const mostrarPasta = (pasta) => {
        view.querySelectorAll(".im-pastas button").forEach((b) => b.classList.toggle("on", b.dataset.p === pasta));
        lista.innerHTML = EMAILS.map((e, i) => (e.pasta === pasta ? `<button class="im-item ${i === 0 ? "nao-lido" : ""} ${e.pasta === "spam" ? "spam" : ""}" data-i="${i}"><b>${esc(e.de)}</b><span>${esc(e.assunto)}</span><small>${esc(e.quando)}</small></button>` : "")).join("");
        ler.innerHTML = `<p class="muted">${pasta === "spam" ? "O filtro de spam do imaíu aprendeu sozinho onde colocar estes e-mails." : pasta === "enviados" ? `${EMAILS.filter((e) => e.pasta === "enviados").length} candidaturas enviadas. Persistência é tudo.` : "Selecione um e-mail."}</p>`;
        ligar();
      };
      view.querySelectorAll(".im-pastas button").forEach((b) => (b.onclick = () => mostrarPasta(b.dataset.p)));
      const ligar = () => lista.querySelectorAll(".im-item").forEach((b) => (b.onclick = () => {
        const e = EMAILS[+b.dataset.i];
        view.querySelectorAll(".im-item").forEach((x) => x.classList.remove("on")); b.classList.add("on"); b.classList.remove("nao-lido");
        ler.innerHTML = `<h2>${esc(e.assunto)}</h2><p class="muted">De: <b>${esc(e.de)}</b> · ${esc(e.quando)}</p><pre>${esc(e.corpo)}</pre>${e.spam ? '<p class="im-alerta">⚠️ O imaíu acha que isto é golpe.</p>' : ""}`;
        if (e.spam) conq("spam", "Quase caiu", "Abriu o e-mail do príncipe da savana.");
        if (e.de.startsWith("Gerente")) conq("freddy", "Turno da noite II", "Leu o e-mail do gerente da pizzaria.");
        if (e.feedback) { lidos.add(e.de); if (lidos.size >= 3) ler.insertAdjacentHTML("beforeend", '<p class="im-alerta">🔁 Você já leu este e-mail ' + lidos.size + " vezes. Com empresas diferentes.</p>"); if (lidos.size >= 5) conq("talentos", "Banco de talentos", "Leu 5 feedbacks idênticos no spam do imaíu."); }
      }));
      mostrarPasta("entrada");
      view.querySelector(".im-novo").onclick = () => {
        ler.innerHTML = `<h2>Nova mensagem</h2>
          <label>Para<input value="${esc(P.contatos.email || P.usuario + "@imaiu.com")}" readonly></label>
          <label>Assunto<input class="im-as" placeholder="Oi, Aluísio!"></label>
          <textarea class="im-txt" placeholder="Escreva sua mensagem…"></textarea>
          <div class="row"><button class="btn real im-env">Enviar</button></div><p class="im-res muted"></p>`;
        ler.querySelector(".im-env").onclick = () => {
          const as = ler.querySelector(".im-as").value, txt = ler.querySelector(".im-txt").value;
          if (P.contatos.email) {
            location.href = `mailto:${P.contatos.email}?subject=${encodeURIComponent(as)}&body=${encodeURIComponent(txt)}`;
          } else {
            ler.querySelector(".im-res").textContent = "O pombo-correio voltou: o e-mail de verdade chega em breve. Enquanto isso, me chama no LigadIn ou no MessagerTale!";
          }
        };
      };
      view.querySelector(".im-item").click();
    },
  });

  // ======================= clicajogos =======================
  const JOGOS = [
    { id: "cobrinha", nome: "Cobrinha", desc: "Coma as frutinhas. Setas ou WASD.", cor: "#2fbf1f", emoji: "🐍" },
    { id: "velha", nome: "Jogo da velha", desc: "Você é o X. Zizi é a estrela ★ (e provoca).", cor: "#2f6bff", emoji: "⚔️" },
    { id: "pato", nome: "Pato Clicker", desc: "Clique no pato. Compre melhorias. Domine o mundo.", cor: "#9b6bff", emoji: "🦆" },
    { id: "memoria", nome: "Memória da savana", desc: "Ache os pares de ícones do aluOS.", cor: "#e07b12", emoji: "🧠" },
    { id: "voador", nome: "Pato Voador", desc: "Bata as asas entre os canos. Espaço ou toque.", cor: "#f2a25a", emoji: "🪽" },
    { id: "plantao", nome: "Plantão Noturno", desc: "Vigie o Museu da Savana até as 6h. Os robôs andam à noite.", cor: "#3a2a5a", emoji: "🔦" },
    { id: "ritmo", nome: "Batalha de Ritmo", desc: "Duelo musical contra Zizi. Setas no tempo certo.", cor: "#e0413a", emoji: "🎵" },
  ];
  ALU.kezSites.push({
    re: /^clicajogos\.com\/?$/, titulo: () => "clicajogos · jogos grátis!!",
    atalho: { url: "clicajogos.com", nome: "clicajogos", icone: logoJogos },
    html: () => `
      <div class="cj">
        <header class="cj-top">${logoJogos}<b>clica<span>jogos</span></b><small>jogos grátis!! sem vírus!! (confia)</small></header>
        <div class="cj-banner">★ NOVO ★ Pato Voador, Plantão Noturno e Batalha de Ritmo! ★ Recorde da semana na Cobrinha: ${(() => { try { return localStorage.getItem("alu.cobrinha") || 0; } catch { return 0; } })()} ★</div>
        <div class="cj-grid">${JOGOS.map((j) => `<button class="cj-card" data-ir="clicajogos.com/${j.id}" style="--c:${j.cor}"><span>${j.emoji}</span><strong>${esc(j.nome)}</strong><small>${esc(j.desc)}</small></button>`).join("")}</div>
      </div>`,
  });
  ALU.kezSites.push({
    re: /^clicajogos\.com\/([\w-]+)\/?$/, titulo: (m) => ((JOGOS.find((j) => j.id === m[1]) || {}).nome || "Jogo") + " · clicajogos",
    html: (m) => {
      const j = JOGOS.find((x) => x.id === m[1]); if (!j) return null;
      return `<div class="cj"><header class="cj-top">${logoJogos}<button class="link" data-ir="clicajogos.com"><b>clica<span>jogos</span></b></button><small>${esc(j.nome)}</small></header>
        <div class="cj-jogo"><h2>${j.emoji} ${esc(j.nome)}</h2><p class="muted">${esc(j.desc)}</p><div class="cj-area"></div></div></div>`;
    },
    init: (view, ctx, m) => ALU.JOGOS[m[1]](view.querySelector(".cj-area")),
  });
})();
