// ============================================================
//  CONTEÚDO DO PORTFOLIO — edite aqui.
//  Tudo que aparece no desktop e no celular vem deste arquivo.
//  Campos marcados com "TODO" ainda precisam do seu texto.
// ============================================================
window.PERFIL = {
  nome: "Aluísio",
  nomeCompleto: "Aluísio Alves",     // aparece no LigadIn
  headline: ".NET Developer | Backend Developer | C# · ASP.NET Core · PostgreSQL · REST APIs · Microservices · Redis · Docker | LLM Integration & AI Agents",
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
  { cargo: "Dotnet Developer", empresa: "Intervalor", tipo: "Internship", periodo: "Oct 2025 - Aug 2026 · 11 mos" },
  { cargo: "Telemarketing Operational Support", empresa: "LBV - Legião da Boa Vontade", tipo: "1 yr 5 mos", periodo: "Oct 2024 - Sep 2025 · 1 yr" },
];

// "Sobre" do perfil do LigadIn. "## " vira subtítulo e "- " vira item de lista.
// A versão em inglês fica em i18n.js.
window.SOBRE_LIGADIN = `Desenvolvo sistemas backend com C#, .NET e ASP.NET Core: APIs REST, integrações e serviços que rodam em produção.

## Experiência
Na Intervalor, mantive e evoluí aplicações .NET em produção para vários clientes corporativos:
- Desenvolvi APIs REST e integrações numa arquitetura de microsserviços e middleware, incluindo integração com APIs de LLM
- Melhorei a performance com cache em Redis e desacoplei serviços com RabbitMQ para processamento assíncrono
- Depurei problemas em produção com Kibana e Grafana, reduzindo a recorrência de incidentes e o tempo de resolução
- Apoiei releases de serviços em containers com Docker e Kubernetes e participei de code reviews

## Projetos
Deskmate – agente de IA open source para service desks de TI. ASP.NET Core, PostgreSQL, EF Core e React, com um agent loop próprio, adaptadores para provedores de LLM (Gemini, Groq, Ollama) e para service desks, regras de negócio com testes unitários e CI com GitHub Actions.

Sistema vestível de baixo custo para detecção de quedas em idosos (TCC) – cinto IoT com ESP32, BLE e MQTT. Um modelo Random Forest detectou 98,8% das quedas com 95,3% de especificidade e envia alertas em tempo real.

## Formação
Bacharelado em Ciência da Computação – Universidade Paulista (UNIP)

Stack: C# · .NET · ASP.NET Core · REST APIs · PostgreSQL · Redis · EF Core · RabbitMQ · Docker · Kubernetes · Microservices · xUnit · GitHub Actions · React · TypeScript · LLM Integration`;

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

// Cada projeto vira uma janela em Projetos. Campos:
//   contexto: { tipo, texto }  de onde veio o projeto (cliente, curso, APS, pessoal)
//   problema: o problema que ele resolve
//   aprendizados: o que eu aprendi fazendo
//   imagens: capturas em img/projetos/ ({ src, legenda }); mockup: true marca imagens de design
//   equipe: integrantes, quando foi trabalho em grupo
window.PROJETOS = [
  {
    id: "mirav",
    nome: "MiraV · VisaVision",
    curto: "MiraV",
    cor: ["#0C67F1", "#01A9DB"],
    sigla: "Mv",
    contexto: { tipo: "Trabalho de curso", texto: "Projeto em equipe: a turma criou a MiraV, uma startup de beleza e tecnologia. Eu fui o CTO e desenvolvi o site e a API." },
    resumo: "Site de divulgação do VisaVision, o espelho inteligente da MiraV.",
    problema: "Em salões e barbearias, o cliente fica em dúvida e desiste do serviço porque não consegue imaginar o resultado. O VisaVision mostra o corte, a cor ou a barba no reflexo dele antes do atendimento, e o site precisava vender essa ideia para donos de salão.",
    descricao:
      "Site institucional com um espelho interativo na home, páginas de produtos, sobre, contato e vagas, além de uma tela de QR code para o telão. Os formulários de contato e candidatura vão para uma API própria em Go, com validação, limite de envios por visitante e IP anonimizado.",
    destaques: [
      "Espelho interativo na home: troque entre corte, cor, barba e estética",
      "O Miro, robozinho em pixel art que explica cada seção",
      "Tema claro e escuro marinho, em português, inglês e espanhol",
      "API em Go só com a biblioteca padrão, com testes; site exportado como estático",
    ],
    aprendizados: [
      "Escrever uma API em Go sem framework, com limite de envios e CORS feitos à mão",
      "Publicar o site estático no Cloudflare e deixar a API em Docker, cada um no seu plano gratuito",
      "Traduzir um site inteiro em três idiomas sem duplicar páginas",
    ],
    imagens: [
      { src: "img/projetos/mirav-home.webp", legenda: "Home com o espelho interativo e o Miro" },
      { src: "img/projetos/mirav-home-escuro.webp", legenda: "Tema escuro marinho" },
      { src: "img/projetos/mirav-produtos.webp", legenda: "Os cinco formatos de espelho" },
      { src: "img/projetos/mirav-vagas.webp", legenda: "Trabalhe Conosco, com 17 vagas" },
      { src: "img/projetos/mirav-mobile.webp", legenda: "No celular", celular: true },
    ],
    stack: ["Next.js 16", "TypeScript", "Tailwind 4", "three.js", "Go 1.24", "PostgreSQL 16", "Docker", "Cloudflare Workers"],
    repo: "https://github.com/aluisiodev/MiraV",
    demo: "https://mirav.aluisioalves6.workers.dev/",
  },
  {
    id: "tcc",
    nome: "Cinto Inteligente · detecção de quedas",
    curto: "Cinto Inteligente",
    cor: ["#047857", "#10B981"],
    sigla: "Ci",
    contexto: { tipo: "TCC em equipe", texto: "Trabalho de Conclusão de Curso em Ciência da Computação na UNIP (2026), orientado pelo Prof. Marco Gomes. Eu fui o pesquisador e redator, e apresentei o problema, a hipótese e o pipeline de IA." },
    equipe: ["Aluísio Alves · pesquisa e redação", "Enzo Orlandi · sistema embarcado", "Erick Carvalho · arquitetura e software", "Kayky Crespo · PO e gestão"],
    resumo: "Cinto vestível que detecta quedas de idosos com IA, estima o cômodo e avisa no Telegram.",
    problema: "Depois de uma queda, o que mais pesa é o tempo até alguém perceber. Botões de emergência dependem de quem caiu, GPS falha dentro de casa e câmeras invadem a privacidade. O projeto busca um alerta automático, sem câmera e com peças baratas (inovação frugal).",
    descricao:
      "O cinto (ESP32-C3 com acelerômetro MPU6050 e ECG AD8232) envia leituras a 100 Hz por Bluetooth para antenas, que repassam por MQTT. No computador, um painel em Streamlit monta janelas de 2,5 s, calcula 8 atributos de movimento e roda um Random Forest treinado no dataset público SisFall. Se detecta uma queda, estima o quadrante do ambiente pela força do sinal das antenas e manda o alerta no Telegram.",
    destaques: [
      "Random Forest validado por voluntário: 98,8% das quedas detectadas e 95,3% de acerto nas atividades normais",
      "Localização indoor por RSSI de 3 antenas BLE, com confiança e histerese",
      "Hardware de baixo custo em cases impressos em 3D",
      "Alerta automático no Telegram e histórico em SQLite",
    ],
    aprendizados: [
      "Adaptar um dataset público ao nosso sensor (de 200 para 100 Hz, mesmas faixas do MPU6050)",
      "Validar por voluntário, para o modelo não decorar as pessoas do treino",
      "Escrever e documentar um trabalho científico em equipe, dizendo também o que ainda não foi comprovado",
    ],
    imagens: [
      { src: "img/projetos/tcc-painel.webp", legenda: "Painel de monitoramento em Streamlit" },
      { src: "img/projetos/tcc-telegram.webp", legenda: "Alerta de queda no Telegram", celular: true },
      { src: "img/projetos/tcc-cinto.webp", legenda: "O cinto montado no case impresso em 3D", celular: true },
      { src: "img/projetos/tcc-esquema.webp", legenda: "Esquema do cinto: ESP32-C3, MPU6050, AD8232 e baterias", celular: true },
      { src: "img/projetos/tcc-arquitetura.webp", legenda: "Arquitetura em cinco camadas", celular: true },
      { src: "img/projetos/tcc-matriz.webp", legenda: "Matriz de confusão do detector", celular: true },
    ],
    stack: ["Python", "scikit-learn", "Streamlit", "ESP32-C3", "MPU6050", "BLE", "MQTT", "SQLite", "Telegram Bot"],
    repo: "https://github.com/KaykyCrespo/cinto-inteligente-deteccao-quedas",
    demo: "",
  },
  {
    id: "doce",
    nome: "Doce & Afeto",
    curto: "Doce & Afeto",
    cor: ["#F472B6", "#FB923C"],
    sigla: "D&",
    contexto: { tipo: "Cliente", texto: "Site feito para a Ana Beatriz, confeiteira, e publicado na Vercel." },
    resumo: "Vitrine de confeitaria em que a encomenda termina pronta no WhatsApp.",
    problema: "As encomendas chegavam por mensagem e cada uma exigia as mesmas perguntas: tamanho, sabor, quantidade, entrega. O site faz essas perguntas antes e entrega a conversa pronta, sem mudar o jeito como a Ana já vende.",
    descricao:
      "A pessoa navega pelo cardápio, monta a encomenda (quantidade, sabor, personalização) e finaliza conversando com a confeiteira no WhatsApp, com a mensagem já escrita. Sem carrinho, login nem pagamento: o site apresenta o trabalho e entrega a conversa pronta.",
    destaques: [
      "Cardápio guiado por dados: cada produto define suas perguntas",
      "Campos de quantidade, escolha única, múltipla e texto livre",
      "Link wa.me montado a partir das escolhas do modal",
      "Testes com Vitest e Playwright",
    ],
    aprendizados: [
      "Ouvir a cliente e cortar o que ela não precisava (carrinho, login, pagamento)",
      "Deixar o conteúdo editável por quem não programa: contato e cardápio em dois arquivos",
      "Publicar e manter um site que uma pessoa usa para trabalhar",
    ],
    imagens: [
      { src: "img/projetos/doce-home.webp", legenda: "Página inicial" },
      { src: "img/projetos/doce-produtos.webp", legenda: "Cardápio com filtro por categoria" },
      { src: "img/projetos/doce-modal.webp", legenda: "Montando a encomenda de um bolo" },
      { src: "img/projetos/doce-mobile.webp", legenda: "No celular", celular: true },
    ],
    stack: ["React", "Vite", "TypeScript", "Tailwind", "shadcn/ui", "Vitest", "Playwright", "Vercel"],
    repo: "https://github.com/aluisiodev/doce-e-afeto",
    demo: "https://doce-e-afeto.vercel.app/",
  },
  {
    id: "deskmate",
    nome: "Deskmate",
    curto: "Deskmate",
    cor: ["#C9349B", "#3B146B"],
    sigla: "Dm",
    contexto: { tipo: "Projeto pessoal · em construção", texto: "Ideia, design e código meus, do zero. Open source (MIT). As imagens são mockups do design da v0.1, não o app rodando." },
    resumo: "Agent de IA open-source que se pluga em qualquer service desk: atende o usuário e ajuda o analista.",
    problema: "Boa parte dos chamados de TI são perguntas repetidas (\"qual o status do meu chamado?\", \"a VPN não conecta\"). O funcionário espera e o analista perde tempo com o que uma consulta resolveria. O Deskmate automatiza isso para qualquer empresa: auto-hospedado, sem custo para rodar e plugável no service desk que ela já usa (GLPI, Jira, Zammad ou um sistema próprio).",
    descricao:
      "Um agent de IA auto-hospedável e de código aberto (MIT) para service desks de TI. O funcionário descreve o problema num chat; o agent classifica a prioridade, procura chamados parecidos e abre ou acompanha o chamado. O analista vê tudo num painel. O agent não depende de um sistema específico: conversa com uma interface ITicketSystem, e cada service desk ganha um adaptador. Em construção, com o domínio escrito primeiro e coberto por testes.",
    destaques: [
      "Back-end em ASP.NET Core (.NET 10) reescrito do zero, com regras de domínio testadas em xUnit",
      "Adaptadores por service desk atrás da interface ITicketSystem; o primeiro é o GLPI",
      "Provedores de IA trocáveis (Gemini, Groq e Ollama) atrás de IChatModel, mais um modo básico sem IA",
      "Loop do agent próprio, em vez de framework, para não ter comportamento escondido",
    ],
    aprendizados: [
      "Desenhar para quem vai contribuir: CI, Conventional Commits e arquivos de comunidade desde o início",
      "Inversão de dependência na prática: trocar Gemini por Ollama ou GLPI por Jira sem tocar no agent",
      "Planejar uma v0.1 pequena e dizer não (YAGNI) para filas, Redis e microsserviços",
    ],
    imagens: [
      { src: "img/projetos/deskmate-chat.webp", legenda: "Mockup: chat do funcionário", mockup: true },
      { src: "img/projetos/deskmate-console.webp", legenda: "Mockup: console do analista", mockup: true },
      { src: "img/projetos/deskmate-login.webp", legenda: "Mockup: login", mockup: true },
    ],
    stack: ["C#", ".NET 10", "ASP.NET Core", "xUnit", "React", "TypeScript", "Vite", "PostgreSQL", "EF Core", "Docker"],
    repo: "https://github.com/aluisiodev/Deskmate",
    demo: "",
  },
  {
    id: "pedidos",
    nome: "Pedido Já",
    curto: "Pedido Já",
    cor: ["#EA580C", "#F97316"],
    sigla: "PJ",
    contexto: { tipo: "APS em equipe", texto: "Atividade da disciplina de Desenvolvimento de Sistemas Distribuídos (Ciência da Computação, 8º semestre)." },
    equipe: ["Aluísio Alves", "Enzo Orlandi", "Erick Carvalho", "Kayky Crespo"],
    resumo: "API de pedidos em FastAPI com PostgreSQL e uma interface React para cliente e admin.",
    problema: "A entrega pedia uma API de pedidos com persistência de verdade, rodando em containers e reproduzível com um único comando, mais uma interface web que a consumisse.",
    descricao:
      "O cliente escolhe o produto no catálogo e faz o pedido; a área administrativa lista, filtra e muda o status dos pedidos. A API em FastAPI segue camadas (API, Service, Repository), calcula o valor total com Decimal e grava no PostgreSQL com schema versionado pelo Alembic. O frontend compilado é servido pela própria API, então tudo sobe com docker compose up.",
    destaques: [
      "Camadas API → Service → Repository, com regras de negócio testadas",
      "Valores monetários em Decimal e NUMERIC, nunca float",
      "Migrations com Alembic rodando sozinhas na subida do container",
      "Testes de integração que só rodam num banco terminado em _test",
    ],
    aprendizados: [
      "Persistência que sobrevive a reinício de container (volume e API stateless)",
      "Servir SPA e API na mesma origem sem o fallback engolir as rotas da API",
      "Dividir o trabalho em equipe com escopo fechado e uma tag para a versão entregue",
    ],
    imagens: [
      { src: "img/projetos/ped-catalogo.webp", legenda: "Catálogo do cliente" },
      { src: "img/projetos/ped-admin-visao.webp", legenda: "Admin: visão geral" },
      { src: "img/projetos/ped-admin-pedidos.webp", legenda: "Admin: lista de pedidos com filtros" },
      { src: "img/projetos/ped-arquitetura.webp", legenda: "Página que explica a arquitetura" },
    ],
    stack: ["Python 3.12", "FastAPI", "SQLAlchemy 2", "Alembic", "PostgreSQL 16", "React 19", "TypeScript", "TanStack Query", "Docker Compose"],
    repo: "https://github.com/aluisiodev/pedidos-ja",
    demo: "",
  },
  {
    id: "contentstack",
    nome: "Contentstack Delivery App",
    curto: "Contentstack",
    cor: ["#8B5CF6", "#6366F1"],
    sigla: "Cs",
    contexto: { tipo: "Estudo", texto: "Projeto para aprender a trabalhar com um CMS headless no .NET." },
    resumo: "Aplicação ASP.NET Core que renderiza conteúdo de um CMS headless.",
    problema: "Num CMS headless, quem escreve publica o conteúdo sem depender de deploy. A aplicação precisa buscar esse conteúdo e montar as páginas, sem nada fixo no código.",
    descricao:
      "Aplicação Razor Pages que consome conteúdo estruturado do Contentstack pela Content Delivery API e renderiza no servidor. Nenhum conteúdo fica fixo no código. O cliente é registrado uma vez por injeção de dependência, o que mantém a apresentação separada do acesso a dados.",
    destaques: [
      "Modelo de conteúdo com referência (autor) e global field (SEO)",
      "Cliente do Contentstack injetado via DI como singleton",
      "Credenciais fora do repositório com User Secrets",
      "Renderização server-side em C#, com falhas tratadas sem derrubar a página",
    ],
    aprendizados: [
      "Quando usar referência (compartilha dados) e quando usar global field (compartilha schema)",
      "Injeção de dependência no ASP.NET Core e por que o cliente é singleton",
      "Manter segredos fora do Git desde o primeiro commit",
    ],
    imagens: [],
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
    quando: "nov 2026", reacoes: 0, comentarios: 0,
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7532223019910402048/",
    // comentários exibidos no LigadIn: [nome, texto em PT, texto em EN]
    comentariosLista: [
      ["Kayky Crespo", "Brabo demais! O clicajogos já virou meu site favorito 😂", "Way too good! clicajogos is already my favorite site 😂"],
      ["Phelip Logan", "Fiquei um tempão caçando os easter eggs. Que projeto absurdo, mano!", "I spent ages hunting for the easter eggs. What an insane project, man!"],
      ["Kaique Araujo", "Muito criativo! O LigadIn me pegou de surpresa 🤣", "So creative! LigadIn caught me off guard 🤣"],
      ["Gustavo Souza", "Conversei com o \"você\" do app de mensagens e ele respondeu melhor que muita gente kkkk. Ficou sensacional!", "I chatted with the \"you\" in the messaging app and it answers better than most people lol. It turned out amazing!"],
      ["Erick Carvalho", "Parabéns, Aluísio! Dá pra ver o capricho em cada detalhe 👏", "Congrats, Aluísio! You can see the care in every detail 👏"],
      ["Bruno Novais", "Que ideia boa transformar o portfólio num sistema operacional. Já mandei pros amigos 🚀", "Great idea turning the portfolio into an operating system. Already sent it to my friends 🚀"],
    ],
    video: "img/posts/portfolio-aluos.mp4", capa: "img/posts/portfolio-aluos.jpg",
    texto: `Opa galera, tranquilo?

Já tem um bom tempo que quero criar um portfólio onde possa atualizar e divulgar meus projetos. Tive um insight numa segunda a noite e decidi que iria fazer um portfólio com o máximo de funcionalidades e novidades que eu conseguisse pensar.

O Portfólio conta com:
- Pasta com meus projetos, skills, sobre mim e contatos
- Terminal com (alguns) comandos funcionais
- IDE Funcional
- Um app de mensagens parecido com o MSN Messenger, onde você conversa "comigo". O "eu" do app de mensagens é um agente de IA
- O Concord, um app com servidores (e onde você pode ver como eu fiz para dar vida à este projeto)
- Um navegador com vários sites e redes sociais, incluíndo o LigadIn e o clicajogos (não aceitar imitações)
- VÁRIOS Easter Eggs espalhados que geram conquistas ao encontrá-los

O portfólio foi feito com desenvolvimento assistido por IA (eu não escrevi uma única linha de código) e a stack é apenas JavaScript, HTML e CSS. Fiz isso para provar que, com uma boa ideia, você pode criar coisas incríveis e originais e deixar todo o espaço para sua criatividade trabalhar.

Pra quem quiser acessar e explorar meu portfolio, o link é esse: https://lnkd.in/dTHSkp2n`,
    // o post original é bilíngue: aqui vai a parte [EN], escrita pelo próprio Aluísio
    quandoEn: "Nov 2026",
    textoEn: `Hey everyone, how's it going?

I've wanted to build a portfolio where I could update and showcase my projects for a long time. One Monday night I had an insight and decided to make a portfolio with as many features and surprises as I could think.

The portfolio includes:
- Folders with my projects, skills, about me and contacts
- A terminal with (some) working commands
- A working IDE
- A messaging app inspired by MSN Messenger, where you chat "with me". The "me" in the app is an AI agent
- Concord, an app with servers (where you can also see how I brought this project to life)
- A browser with several sites and social networks, including LigadIn and clicajogos (accept no imitations)
- LOTS of hidden Easter eggs that unlock achievements when you find them

The portfolio was built with AI-assisted development (I didn't write a single line of code), and the stack is just JavaScript, HTML and CSS. I did it to prove that with a good idea you can create amazing, original things and leave plenty of room for your creativity.

If you want to check it out and explore my portfolio, here's the link: https://lnkd.in/dTHSkp2n`,
  },
  {
    autor: "Kayky Crespo", colab: "Aluísio Alves", titulo: "Estudante de tecnologia · UNIP", quando: "set 2025", reacoes: 87, comentarios: 9,
    comentariosLista: [
      ["Erick Carvalho", "Foram três dias muito bons! Valeu pela parceria, pessoal 🤝", "Three really good days! Thanks for the partnership, everyone 🤝"],
      ["Phelip Logan", "Parabéns pela iniciativa, pessoal! 👏", "Congrats on the initiative, everyone! 👏"],
    ],
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
