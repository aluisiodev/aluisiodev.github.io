// ============================================================
//  CONTEÚDO DO PORTFOLIO — edite aqui.
//  Tudo que aparece no desktop e no celular vem deste arquivo.
//  Campos marcados com "TODO" ainda precisam do seu texto.
// ============================================================
window.PERFIL = {
  nome: "Aluísio",
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
];

// Certificações (aparecem na pasta Skills e no perfil do LigadIn).
// TODO: confirme nome exato, nível e ano de cada uma.
window.CERTIFICADOS = [
  { id: "efset", nome: "Certificado de proficiência em inglês B2", emissor: "EF SET", detalhe: "Proficiência em inglês, nível B2 (EF SET)." },
  { id: "cisco", nome: "Certificação Cisco", emissor: "Cisco Networking Academy", detalhe: "Curso da Cisco Networking Academy." },
  { id: "anthropic", nome: "Certificação Anthropic", emissor: "Anthropic", detalhe: "Curso da Anthropic sobre Claude e IA." },
];

// Quarto 360° ("Sobre mim"). A imagem é equirretangular (2:1).
// u e v são a posição do objeto na imagem, de 0 a 1 (u = horizontal, v = vertical).
// Se trocar a imagem, abra-a num editor, veja a posição do objeto e divida pela largura/altura.
window.QUARTO = {
  imagem: "img/quarto.jpg",
  pontos: [
    { id: "spotify", u: 0.4655, v: 0.5105, titulo: "Monitor esquerdo · Spotify", texto: "A trilha sonora de tudo que eu programo. Essa é a minha playlist.", link: "https://open.spotify.com/playlist/6kNcU6KqmK0X4zxYZCuhMq?si=a1e287b503e148f4", linkTexto: "Ouvir no Spotify" },
    { id: "leetcode", u: 0.5345, v: 0.5105, titulo: "Monitor direito · LeetCode", texto: "Onde eu treino lógica e algoritmos, um problema por vez.", link: "https://leetcode.com/u/aluisios/", linkTexto: "Ver meu LeetCode" },
    { id: "violao", u: 0.3961, v: 0.5611, titulo: "Violão", texto: "Meu violão azul-esverdeado. TODO: o que você gosta de tocar?" },
    { id: "luminaria", u: 0.621, v: 0.4608, titulo: "Luminária · achou!", texto: "Luminária de papel. Quase ninguém repara nela, mas é ela que deixa o quarto com essa cor à noite.", escondido: true },
    { id: "janela", u: 0.3078, v: 0.4527, titulo: "Janela · fim de tarde", texto: "O melhor horário do dia. Moro no Brasil e trabalho remoto." },
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
    id: "nexo",
    nome: "Nexo Assist",
    curto: "Nexo Assist",
    cor: ["#10B981", "#0EA5E9"],
    sigla: "Nx",
    resumo: "Agent de IA para o service desk de TI: chat do funcionário e console do analista.",
    descricao:
      "O funcionário descreve o problema num chat; o agent consulta os chamados dele, busca na central de ajuda, prepara chamados para ele confirmar e chama um analista quando precisa. O analista acompanha tudo num console, com o motivo de cada decisão do agent. Sem chave de IA, um modo básico por regras assume.",
    destaques: [
      "Agent com Mastra usando Gemini e Groq, com plano B",
      "Prazos em horas úteis, prioridade e máquina de estados testados",
      "Cliente HTTP com timeout, retry com backoff e idempotência",
      "Evals das decisões do agent e testes de ponta a ponta",
    ],
    stack: ["Next.js", "TypeScript", "Mastra", "Gemini", "Groq", "Hono", "SQLite", "Vitest", "Playwright"],
    repo: "https://github.com/aluisiodev/nexo-assist",
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
// chatApi: URL de um Cloudflare Worker que responde { resposta } (veja worker/chat-worker.js).
// csharpApi: URL compatível com a API do Piston para compilar C# de verdade. Vazio = tenta o Piston público e,
//            se não der, usa o "C# de bolso" (tradução para JavaScript).
window.ALU = window.ALU || {};
window.ALU.CONFIG = {
  chatApi: "",
  csharpApi: "",
};
