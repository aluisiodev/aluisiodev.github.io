// LigadIn: o feed da rede profissional da savana. Posts "Linkedisney" (gratidão corporativa
// em excesso) de perfis fictícios, mais os posts reais do Aluísio que estiverem em POSTS_LIGADIN (data.js).
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s), P = window.PERFIL;
  const LS = "alu.ligadin.curtidas";
  const ler = () => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; } };
  const gravar = (o) => { try { localStorage.setItem(LS, JSON.stringify(o)); } catch {} };

  // [id, autor, avatar, título, tempo, texto, reações, comentários, [comentários exibidos]]
  const FEED = [
    ["demitido", "Rodrigo Proativo", "🧑‍💼", "Ex-Analista Sênior de Sinergias | Open to Work | Grato", "2 h",
      "Hoje fui desligado da empresa sem aviso prévio, às 17h58 de uma sexta-feira, por uma chamada de vídeo de 3 minutos com a câmera desligada.\n\nE eu só tenho a AGRADECER. 🙏\n\nObrigado por me ensinar que estabilidade é uma ilusão. Obrigado por me mostrar que o crachá desativa antes de você chegar no elevador. Obrigado pela caneca de 5 anos de casa, que vou levar com orgulho (não deu tempo de pegar).\n\nO que essa demissão me ensinou sobre liderança? Tudo. 👇\n\n#gratidão #resiliência #opentowork #segue",
      4821, 612, [["Patrícia Mindset", "Que post inspirador!! Isso é ser protagonista da própria história 👏"], ["Seu Jorge do RH", "Estamos à disposição para o desligamento humanizado."]]],
    ["vaga", "Tech Talents Savana", "🏢", "Recrutamento & Seleção | Contratamos sonhos", "5 h",
      "🚀 VAGA: Desenvolvedor(a) Sênior Full Stack Pleno Júnior\n\n💰 R$ 1.200,00 (PJ)\n📍 100% presencial, 8h às 18h (com 1h de almoço flexível de 20 min)\n\nRequisitos:\n• 12 anos de experiência em React (lançado há 11)\n• Domínio de Java, C#, Python, Go, Rust, COBOL e Excel avançado\n• Inglês fluente, mandarim desejável\n• Saber trocar o toner da impressora\n• Ter perfil de dono (sem participação nos lucros)\n\nBenefícios: ambiente jovem, frutas às quartas, uma família. 🍌\n\n#vagas #oportunidade #somosumafamilia",
      312, 1987, [["Dev Cansado", "o salário é por ano?"], ["Tech Talents Savana", "@Dev Cansado oportunidade de crescimento não tem preço! 😊"]]],
    ["gato", "Bartolomeu Bigodes", "🐱", "Head of Pest Control | Caçador Sênior | Dorme 18h/dia", "8 h",
      "Tenho o prazer de anunciar que concluí com sucesso o projeto CAPTURA DE RATO Q4. 🐭✅\n\nForam 6 horas de espera estratégica atrás do sofá, 2 pivôs de abordagem e 1 entrega final no tapete da sala, às 4h da manhã, para máxima visibilidade com os stakeholders.\n\nAprendizados:\n1. Paciência é uma soft skill.\n2. Nunca subestime um MVP (Mínimo Vestígio de Presa).\n3. Feedback humano pode ser negativo no começo. Persista.\n\nAgradeço ao time (o outro gato, que não fez nada) e à minha liderança (a humana que gritou).\n\n#caça #resultados #felinos #entrega",
      15302, 874, [["Pato Roxo", "quack 👏"], ["Rato Anônimo", "isso é assédio"]]],
    ["bombom", "Camila Engajada", "👩‍💻", "Analista de Felicidade Corporativa | Vestindo a camisa desde 2019", "1 d",
      "Ontem fiquei 6 horas extras para entregar o relatório que ninguém abriu. 📊\n\nPerto da meia-noite, meu gestor passou na minha mesa e deixou… um BOMBOM. 🍫\n\nGente. Eu chorei.\n\nIsso é cultura. Isso é reconhecimento. Isso é saber valorizar pessoas. Em qual outra empresa você ganha um bombom (de doce de leite!!) por apenas 6 horas não remuneradas?\n\nHoje volto mais motivada do que nunca. Já até avisei em casa que vou chegar tarde de novo.\n\n#gratidão #reconhecimento #amoondetrabalho #bombom",
      9640, 1203, [["Gestor Inspirador", "Você merece, Camila! Semana que vem tem outro (talvez) 🍬"], ["Sindicato", "Camila, pisca duas vezes se precisar de ajuda."]]],
    ["4h", "Thiago Alta Performance", "🏋️", "CEO de mim mesmo | Coach de Coaches | 4h AM club", "1 d",
      "Acordei às 4h. Banho gelado. Meditei 2 horas. Li 3 livros. Corri 21 km. Fechei 4 contratos. Tudo isso antes das 7h.\n\nEnquanto você dormia, eu estava construindo o meu império.\n\nO que um banho gelado tem a ensinar sobre vendas B2B? Comenta EU QUERO que eu te mando o e-book (R$ 497).\n\n#mindset #disciplina #4am",
      2201, 3450, [["Vizinho do Thiago", "então era você correndo no corredor às 4h"]]],
    ["filho", "Fernanda Lideranças", "👩‍🏫", "Diretora de Pessoas e Culturas e Outras Pessoas", "2 d",
      "Meu filho de 5 anos me perguntou: \"mãe, por que você trabalha?\"\n\nRespondi com um silêncio. Depois chorei. Depois montei um framework.\n\nO que uma criança de 5 anos pode nos ensinar sobre gestão de stakeholders, OKRs e o futuro da inteligência artificial? Tudo. Leia nos comentários. 👇\n\n#liderança #maternidade #okrs #storytelling",
      7712, 455, [["Filho da Fernanda", "eu só perguntei se ia ter janta"]]],
    ["gerente", "Gerente da Pizzaria", "🍕", "Gerente de Turno Noturno | Segurança em primeiro lugar (quase)", "3 d",
      "Estamos contratando para o turno da noite! 🌙\n\n✅ Ambiente animado (MUITO animado)\n✅ Colegas que não dormem nunca\n✅ Vale-pizza\n✅ Treinamento rápido de 5 noites\n\nNão é necessário experiência. É necessário reflexo.\n\nInteressados: só aparecer à meia-noite. A porta vai estar aberta. 🚪\n\n#vagas #turnodanoite #pizzaria",
      666, 87, [["Ex-segurança", "não vá"], ["Gerente da Pizzaria", "@Ex-segurança comentário removido pela moderação"]]],
    ["zizi", "Zizi", "zizi", "Mascote do aluOS | Invicta no jogo da velha | Espadachim Pleno", "3 d",
      "Feliz em compartilhar que completei 1.000 partidas de jogo da velha sem perder. ⚔️\n\nO segredo? Começar pelo meio e intimidar o adversário com comentários estratégicos.\n\nAberta a desafios. Clique em mim na área de trabalho.\n\n#jogodavelha #invicta #softskills",
      1024, 256, [["kez_e_olmo", "ela perdeu ontem pra mim 🤭"], ["Zizi", "@kez_e_olmo isso foi um bug"]]],
    ["recusei", "Lucas Visionário", "🧔", "Founder @ 3 startups (todas em stealth) | Investidor-anjo de mim mesmo", "4 d",
      "Recusei uma proposta de R$ 40 mil por mês no Google.\n\nPor quê? Porque dinheiro não é tudo. Propósito é tudo.\n\nObs.: a proposta não existiu, mas o aprendizado sim.\n\n#propósito #empreendedorismo #fé",
      3089, 902, [["Recrutador do Google", "quem é você?"]]],
    ["pato", "Pato Roxo", "🦆", "Pair Programmer Sênior | Rubber Duck Debugging Specialist", "5 d",
      "Depois de anos ouvindo devs explicando o próprio código em voz alta, posso afirmar: 90% dos bugs se resolvem sozinhos no meio da explicação.\n\nOs outros 10% eram ponto e vírgula.\n\nQuack. 🦆\n\n#debugging #mentoria #quack",
      4404, 404, [["aluisio.dev", "melhor colega de trabalho que já tive"]]],
  ];
  const NOTICIAS = ["Pesquisa: 9 em 10 devs juram que \"funciona na minha máquina\"", "Empresa troca aumento por pufe colorido", "Bombom se valoriza 300% no mercado de RH", "Gato é promovido a Head após entrega noturna", "Segunda-feira continua sendo segunda-feira", "IA aprende a escrever posts de gratidão sozinha"];

  const avatar = (a) => (a === "zizi" ? (ALU.ziziSVG ? ALU.ziziSVG("ri") : "⚔️") : a === "eu" ? `<img src="${esc(P.foto)}" alt="">` : a.startsWith("img:") ? `<img src="${esc(a.slice(4))}" alt="">` : /^[A-Z]{1,2}$/.test(a) ? `<b class="lf-ini">${a}</b>` : a);
  const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1).replace(".0", "").replace(".", ",") + " mil" : String(n);
  const linkPerfil = (n) => n === "aluisio.dev" || n === P.nome || n === P.nomeCompleto || n.endsWith(" e " + P.nomeCompleto);

  function postHTML([id, autor, av, titulo, tempo, texto, reac, coments, cs], curt) {
    const curto = texto.length > 260;
    const corpo = esc(texto).replace(/#(\w+)/g, '<span class="lf-tag">#$1</span>').replace(/\n/g, "<br>");
    return `<article class="li-card lf-post" data-id="${esc(id)}">
      <header class="lf-autor"><span class="lf-av">${avatar(av)}</span><div>${linkPerfil(autor) ? `<button class="link" data-ir="ligadin.com/in/aluisio-alves"><b>${esc(autor)}</b></button>` : `<b>${esc(autor)}</b>`}<small>${esc(titulo)}</small><small>${esc(tempo)} · 🌐</small></div>${linkPerfil(autor) ? "" : `<button class="lf-seguir">+ Seguir</button>`}</header>
      <div class="lf-txt${curto ? " corta" : ""}">${corpo}</div>${curto ? `<button class="link lf-mais">…ver mais</button>` : ""}
      <div class="lf-cont"><span class="lf-n" data-b="${reac}">👍❤️👏 ${fmt(reac + (curt ? 1 : 0))}</span><span>${fmt(coments)} comentários</span></div>
      <div class="lf-acoes"><button class="lf-curtir${curt ? " on" : ""}">👍 ${curt ? "Gostei!" : "Gostei"}</button><button class="lf-com">💬 Comentar</button><button class="lf-comp">🔁 Compartilhar</button><button class="lf-env">✈️ Enviar</button></div>
      <div class="lf-coms" hidden>${(cs || []).map(([n, t]) => `<div class="lf-c"><b>${esc(n)}</b><p>${esc(t)}</p></div>`).join("")}</div>
    </article>`;
  }

  ALU.kezSites.push({
    re: /^ligadin\.com(?:\/feed)?\/?$/, titulo: () => "Feed | LigadIn",
    html: () => {
      const meus = (window.POSTS_LIGADIN || []).map((p, i) => ["meu" + i, p.autor ? p.autor + (p.colab ? " e " + p.colab : "") : P.nomeCompleto || P.nome, p.autor ? (p.autor.match(/\b\w/g) || []).slice(0, 2).join("") : "eu", p.titulo || P.headline || P.cargo, p.quando || "", p.texto, p.reacoes || 0, p.comentarios || 0, []]);
      const curt = ler();
      const lista = [...meus, ...FEED];
      return `<div class="li-page">
        <header class="li-top"><span class="li-logo">${ALU.pix("ligadin")}<b>LigadIn</b></span><span class="li-nav"><button class="link on" data-ir="ligadin.com/feed">Início</button> · Rede · Vagas · Mensagens · <button class="link" data-ir="ligadin.com/in/aluisio-alves">Eu</button></span></header>
        <div class="lf-wrap">
          <aside class="lf-lado"><div class="li-card lf-eu"><div class="li-capa"></div><img class="lf-foto" src="${esc(P.foto)}" alt=""><button class="link" data-ir="ligadin.com/in/aluisio-alves"><b>${esc(P.nomeCompleto || P.nome)}</b></button><small>${esc(P.headline || P.cargo)}</small><hr><small>Quem viu seu perfil: <b>muita gente</b></small><small>Impressões do post: <b>uma girafa</b></small></div></aside>
          <main class="lf-feed">
            <div class="li-card lf-novo"><span class="lf-av"><img src="${esc(P.foto)}" alt=""></span><button class="lf-comecar">Comece um post (sobre gratidão, de preferência)</button></div>
            ${lista.map((p) => postHTML(p, curt[p[0]])).join("")}
            <p class="muted lf-fim">Você chegou ao fim do feed. Vá tomar uma água. 💧</p>
          </main>
          <aside class="lf-lado"><div class="li-card lf-news"><h3>LigadIn Notícias</h3>${NOTICIAS.map((n, i) => `<p><b>• ${esc(n)}</b><small>há ${i + 1} h · ${fmt(1000 + i * 2371)} leitores</small></p>`).join("")}</div></aside>
        </div></div>`;
    },
    init: (view) => {
      view.querySelectorAll(".lf-post").forEach((post) => {
        const id = post.dataset.id;
        const mais = post.querySelector(".lf-mais");
        if (mais) mais.onclick = () => { post.querySelector(".lf-txt").classList.remove("corta"); mais.remove(); };
        post.querySelector(".lf-curtir").onclick = (e) => {
          const c = ler(); c[id] = !c[id]; if (!c[id]) delete c[id]; gravar(c);
          const b = e.currentTarget, on = !!c[id]; b.classList.toggle("on", on); b.textContent = on ? "👍 Gostei!" : "👍 Gostei";
          const span = post.querySelector(".lf-n"); span.textContent = "👍❤️👏 " + fmt(+span.dataset.b + (on ? 1 : 0));
          ALU.bip && ALU.bip("tec");
          if (Object.keys(c).length >= 5 && ALU.conquista) ALU.conquista("ligadin", "Engajamento orgânico", "Curtiu 5 posts no feed do LigadIn.");
        };
        post.querySelector(".lf-com").onclick = () => { const c = post.querySelector(".lf-coms"); c.hidden = !c.hidden; };
        post.querySelector(".lf-comp").onclick = (e) => { e.currentTarget.textContent = "🔁 Compartilhado (com ninguém)"; };
        post.querySelector(".lf-env").onclick = (e) => { e.currentTarget.textContent = "✈️ Enviado pro grupo da família"; };
        const seg = post.querySelector(".lf-seguir"); if (seg) seg.onclick = () => { seg.textContent = "✓ Seguindo"; seg.disabled = true; };
      });
      const comecar = view.querySelector(".lf-comecar");
      comecar.onclick = () => { comecar.textContent = "Rascunho salvo: \"Hoje acordei grato. #gratidão\" (melhor não postar)"; };
    },
  });
})();
