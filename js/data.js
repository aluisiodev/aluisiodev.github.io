// ============================================================
//  CONTEÚDO DO PORTFOLIO — edite aqui.
//  Tudo que aparece no desktop e no celular vem deste arquivo.
//  Campos marcados com "TODO" ainda precisam do seu texto.
// ============================================================
window.PERFIL = {
  nome: "Aluísio",
  nomeCompleto: "Aluísio Alves",     // aparece no LigadIn
  headline: "Software Developer | C# / .NET | TypeScript & React | Redis | Docker | REST APIs",
  usuario: "aluisio.dev",            // nome no MessagerTale
  foto: "img/aluisio.png",          // foto do MessagerTale e dos perfis
  cargo: "Desenvolvedor de software", // TODO: ajuste (ex.: "Desenvolvedor full stack")
  bio: [
    // TODO: troque por um texto seu, em 1ª pessoa. Aparece no sobre_mim.txt e no chat.
    "Oi! Eu sou o Aluísio. Gosto de construir produtos de ponta a ponta: da interface que a pessoa toca até a API e o banco que ficam por trás.",
    "Nos meus projetos você vai encontrar sites com 3D, agentes de IA para atendimento, integração com CMS headless e lojas que conversam direto pelo WhatsApp.",
  ],
  local: "Brasil", // TODO: cidade, se quiser
  contatos: {
    github: "https://github.com/aluisiodev",
    linkedin: "https://www.linkedin.com/in/aluisio-alves/",
    email: "", // TODO: seu e-mail público (some do site enquanto estiver vazio)
  },
  curriculo: "", // TODO: caminho do PDF, ex.: "cv/curriculo-aluisio.pdf"
};

// Pasta Skills. Adicione mais itens aqui quando quiser.
window.SKILLS = [
  { id: "csharp", nome: "C#", icone: "csharp", texto: "Linguagem que uso no back-end com .NET e ASP.NET Core. Exemplo no portfolio: Contentstack Delivery App (Razor Pages, injeção de dependência, consumo de API)." },
  { id: "typescript", nome: "TypeScript", icone: "typescript", texto: "JavaScript com tipos. Uso no front-end com React e Next.js e em APIs Node. Exemplo no portfolio: Mirav (Next.js 16 + three.js)." },
  { id: "javascript", nome: "JavaScript", icone: "javascript", texto: "A base de tudo na web. Este sistema operacional inteiro é JavaScript puro, sem framework e sem build." },
  { id: "docker", nome: "Docker", icone: "docker", texto: "Containers para subir APIs e bancos do mesmo jeito em qualquer máquina. Exemplo no portfolio: a API em Go do Mirav roda em Docker." },
  { id: "redis", nome: "Redis", icone: "redis", texto: "Cache e dados em memória para deixar APIs rápidas: sessões, filas e respostas guardadas por alguns segundos." },
  { id: "postgresql", nome: "PostgreSQL", icone: "postgresql", texto: "Banco relacional que uso com migrations e consultas SQL. Exemplo no portfolio: Mirav (PostgreSQL 16)." },
];

// Licenças e certificações (pasta Skills e perfil do LigadIn).
// "curto" é o nome que aparece embaixo do ícone na pasta Skills.
window.CERTIFICADOS = [
  { id: "claude101", nome: "Claude Academy: Claude 101", curto: "Claude 101", emissor: "Anthropic", detalhe: "Curso Claude 101 da Claude Academy (Anthropic)." },
  { id: "cyber", nome: "Introduction to Cybersecurity", curto: "Cybersecurity", emissor: "Cisco Networking Academy", detalhe: "Introdução à cibersegurança, pela Cisco Networking Academy." },
  { id: "efset", nome: "Certificado oficial EF SET 55/100 (B2 Independente)", curto: "EF SET B2", emissor: "EF SET", detalhe: "Inglês nível B2 (Independente), nota 55/100 no EF SET." },
  { id: "linux", nome: "Linux 100: Fundamentals", curto: "Linux 100", emissor: "TCM Security", detalhe: "Fundamentos de Linux, pela TCM Security." },
  { id: "one", nome: "Formação Iniciante em Programação T6 - ONE", curto: "ONE T6", emissor: "Oracle Next Education (Alura)", detalhe: "Formação Iniciante em Programação, turma 6 do programa ONE." },
];

// Experiência (perfil do LigadIn).
window.EXPERIENCIAS = [
  { cargo: "Back-end Developer", empresa: "Intervalor", tipo: "Internship", periodo: "Oct 2025 - Aug 2026 · 11 mos" },
  { cargo: "Telemarketing Operational Support", empresa: "LBV - Legião da Boa Vontade", tipo: "1 yr 5 mos", periodo: "Oct 2024 - Sep 2025 · 1 yr" },
];

// Quarto 360° ("Sobre mim"). A imagem é equirretangular (2:1).
// u e v são a posição do objeto na imagem, de 0 a 1 (u = horizontal, v = vertical).
// Se trocar a imagem, abra-a num editor, veja a posição do objeto e divida pela largura/altura.
window.QUARTO = {
  imagem: "img/quarto.jpg",
  pontos: [
    { id: "spotify", u: 0.4655, v: 0.5105, titulo: "Monitor esquerdo · Spotify", texto: "A trilha sonora de tudo que eu programo. Essa é a minha playlist.", link: "https://open.spotify.com/playlist/6kNcU6KqmK0X4zxYZCuhMq?si=a1e287b503e148f4", linkTexto: "Ouvir no Spotify" },
    { id: "leetcode", u: 0.5345, v: 0.5105, titulo: "Monitor direito · LeetCode", texto: "Onde eu treino lógica e algoritmos, um problema por vez.", link: "https://leetcode.com/u/aluisios/", linkTexto: "Ver meu LeetCode" },
    { id: "luminaria", u: 0.621, v: 0.4608, titulo: "Luminária · achou!", texto: "Luminária de papel. Quase ninguém repara nela, mas é ela que deixa o quarto com essa cor à noite.", escondido: true },
  ],
};

window.PROJETOS = [
  {
    id: "mirav",
    nome: "MiraV · VisaVision",
    curto: "MiraV",
    cor: ["#0C67F1", "#01A9DB"],
    sigla: "Mv",
    resumo: "Site de divulgação do VisaVision, o espelho inteligente da MiraV.",
    descricao:
      "Site institucional com um espelho interativo em 3D na home, páginas de produtos, sobre, contato e vagas, além de uma tela de QR code para o telão. Os formulários de contato e candidatura vão para uma API própria em Go, com validação, limite de envios por visitante e IP anonimizado.",
    destaques: [
      "Espelho interativo em three.js e mascote na home",
      "Tema claro e escuro marinho",
      "API em Go só com a biblioteca padrão, com testes",
      "Exportado como site estático; API em Docker",
    ],
    stack: ["Next.js 16", "TypeScript", "Tailwind 4", "three.js", "Go 1.24", "PostgreSQL 16", "Docker"],
    repo: "https://github.com/aluisiodev/MiraV",
    demo: "",
  },
  {
    id: "deskmate",
    nome: "Deskmate",
    curto: "Deskmate",
    cor: ["#0F766E", "#22D3EE"],
    sigla: "Dm",
    resumo: "Agent de IA open-source que se pluga em qualquer service desk: atende o usuário e ajuda o analista.",
    descricao:
      "Um agent de IA auto-hospedável e de código aberto (MIT) para service desks de TI. O funcionário descreve o problema num chat; o agent classifica a prioridade, procura chamados parecidos e abre ou acompanha o chamado. O analista vê tudo num painel. O agent não depende de um sistema específico: conversa com uma interface ITicketSystem, e cada service desk (GLPI, Jira, Zammad ou um sistema próprio) ganha um adaptador. Em construção, com o domínio escrito primeiro e coberto por testes.",
    destaques: [
      "Back-end em ASP.NET Core (.NET 10) reescrito do zero, com regras de domínio testadas em xUnit",
      "Adaptadores por service desk atrás da interface ITicketSystem; o primeiro é o GLPI",
      "Provedores de IA trocáveis (Gemini, Groq e Ollama) atrás de IChatModel, mais um modo básico sem IA",
      "PostgreSQL com EF Core e migrações, Docker Compose para quem quiser contribuir",
    ],
    stack: ["C#", ".NET 10", "ASP.NET Core", "xUnit", "React", "TypeScript", "Vite", "PostgreSQL", "EF Core", "Docker"],
    repo: "https://github.com/aluisiodev/Deskmate",
    demo: "",
  },
  {
    id: "doce",
    nome: "Doce & Afeto",
    curto: "Doce & Afeto",
    cor: ["#F472B6", "#FB923C"],
    sigla: "D&",
    resumo: "Vitrine de confeitaria em que a encomenda termina pronta no WhatsApp.",
    descricao:
      "A pessoa navega pelo cardápio, monta a encomenda (quantidade, sabor, personalização) e finaliza conversando com a confeiteira no WhatsApp, com a mensagem já escrita. Sem carrinho, login nem pagamento: o site apresenta o trabalho e entrega a conversa pronta.",
    destaques: [
      "Cardápio guiado por dados: cada produto define suas perguntas",
      "Campos de quantidade, escolha única, múltipla e texto livre",
      "Link wa.me montado a partir das escolhas do modal",
      "Testes com Vitest e Playwright",
    ],
    stack: ["React", "Vite", "TypeScript", "Tailwind", "shadcn/ui", "Vitest", "Playwright"],
    repo: "https://github.com/aluisiodev/doce-e-afeto",
    demo: "",
  },
  {
    id: "contentstack",
    nome: "Contentstack Delivery App",
    curto: "Contentstack",
    cor: ["#8B5CF6", "#6366F1"],
    sigla: "Cs",
    resumo: "Aplicação ASP.NET Core que renderiza conteúdo de um CMS headless.",
    descricao:
      "Aplicação Razor Pages que consome conteúdo estruturado do Contentstack pela Content Delivery API e renderiza no servidor. Nenhum conteúdo fica fixo no código. O cliente é registrado uma vez por injeção de dependência, o que mantém a apresentação separada do acesso a dados.",
    destaques: [
      "Modelo de conteúdo com referência (autor) e global field (SEO)",
      "Cliente do Contentstack injetado via DI como singleton",
      "Credenciais fora do repositório com User Secrets",
      "Renderização server-side em C#",
    ],
    stack: ["ASP.NET Core 10", "C#", "Razor Pages", "Contentstack", "Newtonsoft.Json"],
    repo: "https://github.com/aluisiodev/contentstack-delivery-app",
    demo: "",
  },
];

// Serviços opcionais. Deixe vazio para tudo funcionar só no navegador.
// csharpApi: URL compatível com a API do Wandbox (/api/compile.json) para compilar C# de verdade. Vazio = usa o Wandbox público e,
//            se não der, usa o "C# de bolso" (tradução para JavaScript).
window.ALU = window.ALU || {};
// Seus posts do LinkedIn, para aparecerem no LigadIn (perfil e topo do feed).
// Cole cada post como { quando: "2 sem", texto: "texto do post", reacoes: 42, comentarios: 3 }.
// Post de outra pessoa com você marcado: adicione autor, titulo e colab.
window.POSTS_LIGADIN = [
  {
    autor: "Kayky Crespo", colab: "Aluísio Alves", titulo: "Estudante de tecnologia · UNIP", quando: "set 2025", reacoes: 87, comentarios: 9,
    texto: `🚀 Compartilhando conhecimento e promovendo a inovação na Jornada Tecnológica Integrada da UNIP!

Nos dias 28, 29 e 30 de setembro, tive a oportunidade de atuar como instrutor na oficina “Programação e Eletrônica com Tinkercad”, durante a Jornada Tecnológica Integrada da UNIP, ao lado de Aluísio Alves, Erick Carvalho e Enzo Orlandi.

🤖 A oficina teve uma abordagem totalmente prática, combinando explicações teóricas na lousa com demonstrações no Tinkercad e atividades individuais nos computadores. Dessa forma, os participantes puderam acompanhar os conceitos apresentados e aplicá-los na prática, explorando recursos de programação e eletrônica em um ambiente de simulação.

💡 Participar dessa experiência foi uma oportunidade de desenvolver ainda mais minhas habilidades de comunicação, colaboração e compartilhamento de conhecimento técnico, além de contribuir para o aprendizado de outros estudantes e incentivar o interesse pela tecnologia.

Agradeço à UNIP pela oportunidade, aos meus colegas pela parceria e a todos os participantes pelo envolvimento ao longo dos três dias de oficina. Ensinar também é uma forma de aprender, evoluir e transformar conhecimento em novas possibilidades!`,
    // versão em inglês do site (tradução do post)
    tituloEn: "Technology student · UNIP", quandoEn: "Sep 2025",
    textoEn: `🚀 Sharing knowledge and fostering innovation at UNIP's Integrated Technology Week!

On September 28, 29 and 30, I had the opportunity to work as an instructor in the workshop “Programming and Electronics with Tinkercad”, during UNIP's Integrated Technology Week, alongside Aluísio Alves, Erick Carvalho and Enzo Orlandi.

🤖 The workshop was fully hands-on, combining theory on the whiteboard with demos in Tinkercad and individual activities on the computers. That way, participants could follow the concepts presented and apply them in practice, exploring programming and electronics features in a simulation environment.

💡 Being part of this experience was a chance to further develop my communication, collaboration and technical knowledge-sharing skills, while also helping other students learn and sparking their interest in technology.

Thanks to UNIP for the opportunity, to my colleagues for the partnership and to all participants for their engagement throughout the three days of the workshop. Teaching is also a way to learn, grow and turn knowledge into new possibilities!`,
  },
];

// api: URL do servidor do aluOS (worker/aluos-worker.js). Liga o placar global, o ranking,
//      o livro de visitas e o chat com IA. Vazio = tudo funciona, mas só no navegador de cada pessoa.
// goatcounter: o código do seu site no GoatCounter (ex.: "aluisio" para aluisio.goatcounter.com).
//      Crie a conta grátis em https://www.goatcounter.com/signup e cole o código aqui.
window.ALU.CONFIG = {
  api: "https://aluos.aluisioalves6.workers.dev",
  goatcounter: "aluisio",
  chatApi: "",   // opcional: URL só do chat (se vazio e api estiver preenchida, usa api + "/chat")
  csharpApi: "",
};
