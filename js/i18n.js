// Versão em inglês do aluOS.
// O idioma vem de localStorage ("alu.lang"); na primeira visita segue o idioma do navegador.
// 1) Troca o conteúdo do data.js (perfil, projetos, cursos, quarto) pela versão em inglês.
// 2) Traduz os textos fixos da interface (menus, janelas, botões) por um dicionário.
// Os sites parodiados do Kez(i)avana continuam em português de propósito: são piadas locais.
(function () {
  const ALU = (window.ALU = window.ALU || {});
  let lang = null;
  try { lang = localStorage.getItem("alu.lang"); } catch {}
  if (lang !== "pt" && lang !== "en") lang = /^pt/i.test(navigator.language || "pt") ? "pt" : "en";
  ALU.lang = lang;
  ALU.T = (pt, en) => (lang === "en" ? en : pt);
  ALU.setLang = (l) => { try { localStorage.setItem("alu.lang", l); } catch {} location.reload(); };
  document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
  if (lang !== "en") return;

  // ---------- conteúdo (data.js) ----------
  const P = window.PERFIL;
  Object.assign(P, {
    cargo: "Software developer",
    local: "Brazil",
    bio: [
      "Hi! I'm Aluísio. I like building products end to end: from the interface people touch to the API and database behind it.",
      "In my projects you'll find sites with 3D, AI agents for customer support, headless CMS integrations and shops that talk straight through WhatsApp.",
    ],
  });
  const SK = { csharp: "The language I use on the back end with .NET and ASP.NET Core. Example in this portfolio: Contentstack Delivery App (Razor Pages, dependency injection, API consumption)." };
  (window.SKILLS || []).forEach((s) => { if (SK[s.id]) s.texto = SK[s.id]; });
  const CE = {
    claude101: [null, "Claude 101 course from Claude Academy (Anthropic)."],
    cyber: [null, "Introduction to cybersecurity, by Cisco Networking Academy."],
    efset: ["EF SET official certificate 55/100 (B2 Upper Intermediate)", "English level B2, score 55/100 on EF SET."],
    linux: [null, "Linux fundamentals, by TCM Security."],
    one: ["Beginner Programming Program T6 - ONE", "Beginner Programming Program, class 6 of the ONE program (Oracle Next Education)."],
  };
  (window.CERTIFICADOS || []).forEach((c) => { const t = CE[c.id]; if (t) { if (t[0]) c.nome = t[0]; c.detalhe = t[1]; } });
  const QT = {
    spotify: ["Left monitor · Spotify", "The soundtrack of everything I code. This is my playlist.", "Listen on Spotify"],
    leetcode: ["Right monitor · LeetCode", "Where I practice logic and algorithms, one problem at a time.", "See my LeetCode"],
    luminaria: ["Lamp · found it!", "Paper lamp. Almost nobody notices it, but it's what gives the room this color at night."],
    janela: ["Window · late afternoon", "The best time of the day. I live in Brazil and work remotely."],
  };
  ((window.QUARTO || {}).pontos || []).forEach((p) => { const t = QT[p.id]; if (t) { p.titulo = t[0]; p.texto = t[1]; if (t[2]) p.linkTexto = t[2]; } });
  const PJ = {
    mirav: ["Marketing site for VisaVision, MiraV's smart mirror.",
      "Company site with an interactive 3D mirror on the home page, product, about, contact and careers pages, plus a QR code screen for the big display. Contact and application forms go to a custom Go API, with validation, per-visitor rate limiting and anonymized IPs.",
      ["Interactive mirror in three.js and a mascot on the home page", "Light theme and navy dark theme", "Go API using only the standard library, with tests", "Exported as a static site; API in Docker"]],
    nexo: ["AI agent for the IT service desk: employee chat and analyst console.",
      "The employee describes the problem in a chat; the agent checks their tickets, searches the help center, drafts tickets for them to confirm and calls an analyst when needed. The analyst follows everything in a console, with the reason behind each agent decision. Without an AI key, a rule-based mode takes over.",
      ["Agent built with Mastra using Gemini and Groq, with a fallback", "Business-hours SLAs, priority and state machine, all tested", "HTTP client with timeout, retry with backoff and idempotency", "Evals of the agent's decisions and end-to-end tests"]],
    doce: ["Bakery showcase where the order ends up ready on WhatsApp.",
      "People browse the menu, build their order (quantity, flavor, customization) and finish by chatting with the baker on WhatsApp, with the message already written. No cart, login or payment: the site presents the work and hands over a ready conversation.",
      ["Data-driven menu: each product defines its own questions", "Quantity, single choice, multiple choice and free text fields", "wa.me link built from the modal's choices", "Tests with Vitest and Playwright"]],
    contentstack: ["ASP.NET Core app that renders content from a headless CMS.",
      "Razor Pages app that consumes structured content from Contentstack through the Content Delivery API and renders it on the server. No content is hardcoded. The client is registered once through dependency injection, which keeps presentation separate from data access.",
      ["Content model with a reference (author) and a global field (SEO)", "Contentstack client injected via DI as a singleton", "Credentials kept out of the repo with User Secrets", "Server-side rendering in C#"]],
  };
  (window.PROJETOS || []).forEach((p) => { const t = PJ[p.id]; if (t) [p.resumo, p.descricao, p.destaques] = t; });

  // ---------- interface ----------
  const D = {
    "Sobre mim": "About me", "Projetos": "Projects", "Contatos": "Contacts", "Skills": "Skills", "Painel de controle": "Control panel", "Lixeira": "Recycle bin",
    "↻ Reiniciar": "↻ Restart", "⏻ Desligar": "⏻ Shut down", "iniciar": "start", "Iniciar": "Start", "Iniciar pesquisa": "Start search", "Pesquisar": "Search",
    "Reiniciar": "Restart", "Desligar": "Shut down", "Nada encontrado.": "Nothing found.",
    "aluOS 2.0 — carregando": "aluOS 2.0 — loading", "verificando memória .............. ok": "checking memory ................. ok",
    "abrindo a savana (Kez(i)avana) ... ok": "opening the savanna (Kez(i)avana) ok", "carregando projetos (4) ........... ok": "loading projects (4) .............. ok",
    "alimentando o pato do Peep Studio . ok": "feeding the Peep Studio duck .... ok", "conectando ao MessagerTale ....... ok": "connecting to MessagerTale ....... ok",
    "clique para pular": "click to skip",
    "Arquivo": "File", "Editar": "Edit", "Exibir": "View", "Favoritos": "Favorites", "Ajuda": "Help", "Endereço": "Address", "Formatar": "Format",
    "Tarefas": "Tasks", "Outros locais": "Other places", "Clique duas vezes para abrir.": "Double-click to open.",
    "Minimizar": "Minimize", "Maximizar": "Maximize", "Fechar": "Close", "Voltar": "Back", "Avançar": "Forward", "Ir": "Go", "Pronto": "Done",
    "Papel de parede": "Wallpaper", "Tema": "Theme", "Cor das janelas": "Window color", "Sistema": "System", "Conquistas": "Achievements", "Noite": "Night", "Savana": "Savanna",
    "aluOS 2.0 · pixel por pixel, em HTML, CSS e JavaScript.": "aluOS 2.0 · pixel by pixel, in HTML, CSS and JavaScript.",
    "4 itens · clique para espiar": "4 items · click to peek", "Esvaziar? Melhor não. Eles me ensinaram muito.": "Empty it? Better not. They taught me a lot.",
    "quarto_360.png - Visualizador 360°": "quarto_360.png - 360° Viewer", "sobre_mim.txt - Bloco de notas": "sobre_mim.txt - Notepad",
    "Monitor esquerdo": "Left monitor", "Monitor direito": "Right monitor", "Janela": "Window", "Luminária": "Lamp", "Carregando o quarto…": "Loading the room…",
    "Arraste para olhar em volta · role para aproximar · clique nos": "Drag to look around · scroll to zoom · click the",
    "Não consegui carregar o visualizador 3D. Verifique a conexão.": "Couldn't load the 3D viewer. Check your connection.",
    "Projeto": "Project", "Depurar": "Debug", "■ Parar": "■ Stop", "▶ Executar": "▶ Run", "GERENCIADOR DE SOLUÇÕES": "SOLUTION EXPLORER", "só leitura": "read-only",
    "+ arquivo": "+ file", "Criar": "Create", "Cancelar": "Cancel", "SAÍDA": "OUTPUT", "limpar": "clear", "ENTRADA (stdin) · uma linha por input()": "INPUT (stdin) · one line per input()",
    "Aluisio.cs · C# · só leitura": "Aluisio.cs · C# · read-only", "Executar (Ctrl+Enter)": "Run (Ctrl+Enter)", "Novo arquivo": "New file", "nome": "name",
    "Nome do arquivo": "File name", "Linguagem": "Language", "Apagar": "Delete", "Editor de código": "Code editor", "Limpar saída": "Clear output", "ex.: Ana": "e.g. Ana",
    "Início": "Home", "· Rede · Vagas · Mensagens ·": "· Network · Jobs · Messaging ·", "Eu": "Me", "500+ conexões (na savana)": "500+ connections (in the savanna)",
    "Sair da savana: abrir perfil real ↗": "Leave the savanna: open real profile ↗", "Mandar mensagem": "Message", "Sobre": "About", "Cursos": "Courses",
    "Competências": "Skills", "Licenças e certificações": "Licenses & certifications", "Experiência": "Experience", "Atividade": "Activity", "Abrir Kez(i)avana": "Open Kez(i)avana", "Abrir Terminal": "Open Terminal", "Abrir no Peep Studio": "Open in Peep Studio",
    "Abrir site": "Open site", "Ver no LigadIn": "See on LigadIn", "Ver no DogHub": "See on DogHub", "Abrir projeto": "Open project", "Ver código": "See code", "Descrição:": "Description:", "Destaques": "Highlights", "Stack": "Stack", "Emissor:": "Issuer:", "Tipo:": "Type:",
    "Geral": "General", "Organizar ícones": "Arrange icons", "Personalizar…": "Customize…", "Próximo papel de parede": "Next wallpaper", "em breve": "coming soon",
    "Agora é seguro desligar o computador.": "It's now safe to turn off your computer.", "(ou clique para ligar de novo)": "(or click to turn it back on)",
    "Status: online": "Status: online", "aluisio.dev acabou de entrar": "aluisio.dev just signed in", "tá por aí? 👀": "you there? 👀", "oiii": "hiii",
    "Zizi, o mascote do aluOS": "Zizi, the aluOS mascot", "Moro aqui na área de trabalho. Clique em mim se precisar de alguma coisa!": "I live here on the desktop. Click me if you need anything!",
    "Oi! Em que posso ajudar?": "Hi! How can I help?", "Me dá uma dica": "Give me a tip", "Conta uma piada": "Tell me a joke", "Bora jogar da velha": "Let's play tic-tac-toe",
    "Dança!": "Dance!", "Falar com o Aluísio": "Talk to Aluísio", "Vai descansar": "Go rest", "Outra!": "Another!", "Valeu": "Thanks", "Voltar! ⚔️": "I'm back! ⚔️", "Voltei! ⚔️": "I'm back! ⚔️",
    "Tá bom! Se sentir saudade, clique no meu ícone ao lado do relógio. 💤": "Okay! If you miss me, click my icon next to the clock. 💤",
    "Clique duas vezes numa pasta para abrir. Clássico.": "Double-click a folder to open it. Classic.",
    "O Peep Studio roda Python, JavaScript e C# de verdade. Crie um arquivo na pasta meus-codigos!": "Peep Studio runs real Python, JavaScript and C#. Create a file in the meus-codigos folder!",
    "No MessagerTale dá pra escrever o que quiser. E até ensinar frases novas.": "In MessagerTale you can type anything. You can even teach it new phrases.",
    "O quarto_360 dá pra girar com o mouse. Os monitores têm links.": "You can spin quarto_360 with the mouse. The monitors have links.",
    "A playlist inteira está no musikzify, lá no Kez(i)avana.": "The whole playlist is on musikzify, in Kez(i)avana.",
    "O Painel de controle mostra quantas conquistas você já achou.": "The Control panel shows how many achievements you've found.",
    "Dica secreta: o terminal conhece mais comandos do que o 'ajuda' mostra.": "Secret tip: the terminal knows more commands than 'ajuda' shows.",
    "Me desafia no Jogo da velha do clicajogos. Eu não perco fácil. 😏": "Challenge me at tic-tac-toe on clicajogos. I don't lose easily. 😏",
    "Conquista desbloqueada": "Achievement unlocked", "Idioma": "Language",
    "Pesquise na savana ou digite um endereço": "Search the savanna or type an address",
  };
  const RX = [
    [/^C:\\Usuários\\Aluísio\\(.*)$/, (m, x) => "C:\\Users\\Aluísio\\" + (D[x] || x)],
    [/^(\d+) itens$/, (m, n) => n + " items"], [/^(\d+) objeto\(s\)$/, (m, n) => n + " object(s)"],
    [/^(\d+) de (\d+) encontradas$/, (m, a, b) => `${a} of ${b} found`],
    [/^Conquista desbloqueada · (.*)$/, (m, x) => "Achievement unlocked · " + x],
    [/^Propriedades de (.*)$/, (m, x) => "Properties of " + x],
  ];
  const tr = (t) => {
    const k = t.trim(); if (!k) return null;
    if (D[k]) return t.replace(k, D[k]);
    for (const [re, f] of RX) { const m = k.match(re); if (m) return t.replace(k, f(...m)); }
    return null;
  };
  const PULA = ".cj,.al,.mz,.eb,.cl,.yk,.wk,.lf-wrap,.chat-log,.term-out,.peep-code,.src,textarea,script,style";
  function traduzir(raiz) {
    if (raiz.nodeType === 3) { if (raiz.parentElement && raiz.parentElement.closest(PULA)) return; const r = tr(raiz.nodeValue); if (r !== null && r !== raiz.nodeValue) raiz.nodeValue = r; return; }
    if (raiz.nodeType !== 1 || (raiz.closest && raiz.closest(PULA))) return;
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, { acceptNode: (n) => (n.nodeType === 1 && n.matches(PULA) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
    let n = raiz;
    do {
      if (n.nodeType === 3) { const r = tr(n.nodeValue); if (r !== null && r !== n.nodeValue) n.nodeValue = r; }
      else for (const a of ["placeholder", "title", "aria-label"]) { const v = n.getAttribute(a); if (v) { const r = tr(v); if (r !== null && r !== v) n.setAttribute(a, r); } }
    } while ((n = w.nextNode()));
  }
  ALU.traduzir = traduzir;
  const obs = new MutationObserver((ms) => ms.forEach((m) => {
    if (m.type === "characterData") traduzir(m.target);
    else m.addedNodes.forEach(traduzir);
  }));
  const ligar = () => { traduzir(document.body); obs.observe(document.body, { childList: true, subtree: true, characterData: true }); };
  if (document.body) ligar(); else document.addEventListener("DOMContentLoaded", ligar);
  document.title = "aluOS · Aluísio's portfolio";
})();
