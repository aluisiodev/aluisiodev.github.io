// "aluisio.dev de bolso": um bot no estilo SimSimi para o MessagerTale.
// Funciona sem servidor (regras + coisas que o visitante ensina). Se ALU.CONFIG.chatApi
// apontar para um Worker (worker/aluos-worker.js, com Gemini), ele usa a IA e cai nas regras se falhar.
(function () {
  const ALU = window.ALU;
  const P = window.PERFIL, PROJ = window.PROJETOS;
  const LS = "alu.bot.ensinado";
  const sem = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s?!]/g, " ").replace(/\s+/g, " ").trim();
  const um = (a) => a[Math.floor(Math.random() * a.length)];
  const ler = () => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; } };
  const gravar = (o) => { try { localStorage.setItem(LS, JSON.stringify(o)); } catch {} };

  const hora = () => new Date().getHours();
  const REGRAS = [
    [/tudo (bem|bom|certo|tranquilo)|como (voce|vc|cê) (esta|ta)|como vai/, () => [um(["tudo ótimo! programando, como sempre", "tô bem! e você?", "de boa, ouvindo um Arctic Monkeys aqui"])]],
    [/^(to bem|estou bem|tudo sim|bem e voce|bem e vc|suave|de boa)/, () => [um(["que bom!! :)", "aí sim", "boa demais"])]],
    [/(voce|vc) (e|eh) (um )?(bot|robo|ia|real)|e (um )?bot|ta falando com bot/, () => ["sou a versão de bolso do Aluísio 🤖", "o de verdade responde no LigadIn ou no DogHub. eu fico aqui cuidando do desktop"]],
    [/quem (e|eh) (voce|vc)|seu nome|como (voce|vc) se chama/, () => [`sou o ${P.nome}!`, P.cargo.toLowerCase()]],
    [/(onde|de onde).*(mora|vive|e voce|vc e)|cidade/, () => [`moro em: ${P.local}`, "aqui do quartinho de fim de tarde (dá pra ver no quarto_360 😉)"]],
    [/idade|quantos anos/, () => ["idade é só um número… de commits 😅", "mas sou jovem o bastante pra achar que dá pra fazer um SO no navegador"]],
    [/projet|portfolio|o que (voce|vc) (fez|faz)|trabalhos/, () => ["meus favoritos:", ...PROJ.map((p) => `• ${p.curto}: ${p.resumo}`), "tem tudo na pasta Projetos da área de trabalho"]],
    ...PROJ.map((p) => [new RegExp(sem(p.curto) + "|" + p.id), () => [`${p.curto}! ${p.descricao.split(". ")[0].toLowerCase()}.`, `feito com ${p.stack.slice(0, 4).join(", ")}`]]),
    [/skill|habilidade|stack|tecnologia|linguage|sabe programar/, () => [`na pasta Skills: ${window.SKILLS.map((s) => s.nome).join(", ")}`, `cursos: ${window.CERTIFICADOS.map((c) => c.curto || c.emissor).join(", ")}`]],
    [/c#|csharp|dotnet|\.net/, () => ["C# é meu xodó", "inclusive dá pra rodar C# no Peep Studio, testa lá"]],
    [/python|javascript|\bjs\b/, () => ["abre o Peep Studio e cria um arquivo na pasta meus-codigos. roda de verdade!"]],
    [/contato|email|e-mail|falar com voce|linkedin|ligadin|github|doghub|achar voce/, () => [`DogHub: ${P.contatos.github.replace("https://github.com", "doghub.com")}`, `LigadIn: ${P.contatos.linkedin.replace(/^https?:\/\/(www\.)?/, "")}`]],
    [/vaga|contrat|emprego|freela|trabalhar (com|junto)/, () => ["opa!! fico feliz 😄", "me chama no LigadIn que eu respondo rapidinho"]],
    [/musica|banda|ouve|spotify|cancao|playlist/, () => [um(["Arctic Monkeys, Radiohead e Joji no repeat", "tem minha playlist no musikzify, lá no Kez(i)avana 🎧"])]],
    [/jogo|game|joga|ps5|sekiro|fnaf/, () => [um(["Sekiro me ensinou que hesitation is defeat", "tenta o clicajogos no Kez(i)avana, tem até Pato Clicker", "FNAF é tradição. cuidado com a porta"])]],
    [/anime|manga|chainsaw|jujutsu|berserk|hora de aventura|adventure time/, () => [um(["Chainsaw Man, Jujutsu Kaisen e Berserk tão na estante", "Hora de Aventura é eterno. Marshall Lee na TV do quarto"])]],
    [/pato|quack|peep/, () => [um(["quack", "QUACK", "o pato roxo do Peep Studio manda um oi 🦆"])]],
    [/girafa|savana|leao|zebra/, () => [um(["🦒", "a savana agradece a visita", "já tentou digitar savana em algum lugar?"])]],
    [/zizi|mascote|assistente/, () => ["Zizi é a assistente virtual do aluOS. mora na área de trabalho, te mostra o sistema e te ajuda a deixar seu nome com um commit", "e jura que é invencível no jogo da velha"]],
    [/segredo|easter|conquista|dica/, () => [um(["tenta o terminal e digita algo que um hacker digitaria", "o relógio da barra de tarefas não gosta de ser cutucado", "a lixeira tem mais coisa do que parece", "tem uma luminária no quarto que quase ninguém acha"])]],
    [/piada|me faz rir|conta uma/, () => [um([["por que o programador foi ao médico?", "porque estava com um bug no sistema 🥁"], ["quantos devs são precisos pra trocar uma lâmpada?", "nenhum, é problema de hardware"], ["o que o pato disse pro dev?", "quack quack (tradução: você esqueceu o ponto e vírgula)"]])]],
    [/hora|que horas/, () => [`aqui são ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`]],
    [/fome|comida|cafe/, () => [hora() < 12 ? "café da manhã é sagrado ☕" : "agora bateu vontade de um café ☕"]],
    [/te amo|amo voce|lindo|gato|fofo/, () => [um(["hehe 😳", "para que eu fico sem graça", "own <3"])]],
    [/obrigad|valeu|vlw|brigad/, () => [um(["de nada!!", "tamo junto", "por nada :)"])]],
    [/tchau|ate mais|flw|fui|bye/, () => [um(["valeu pela visita! 👋", "até mais!!", "fui tomar um café, volta sempre"])]],
    [/(kkk|haha|rsrs|lol|kkkk)/, () => [um(["kkkkkkk", "hahaha", "rindo de nervoso aqui"])]],
    [/^(oi+|ola|eae|eai|e ai|opa|salve|hey|hello|hi|bom dia|boa tarde|boa noite|fala)\b/, () => [um(["oiii", "eae!", "opa, salve", "olá olá"]), um(["tudo certo?", "como cê tá?", "chegou na hora certa"])]],
    [/\?$/, () => [um(["boa pergunta… vou pensar e te respondo no próximo commit", "hmm, essa eu não sei. me ensina? escreve: ensina: pergunta = resposta", "pergunta isso pro alulugle 😅"])]],
  ];
  const GENERICO = ["hmmm, conta mais", "interessante 👀", "não entendi muito bem, mas concordo", "quack?", "isso aí eu ainda não aprendi. me ensina? escreve: ensina: frase = resposta", "eita", "kkkk sério?"];

  // regras em inglês (versão EN do site); o bot aprende frases nos dois idiomas
  const REGRAS_EN = [
    [/how are you|how( s| is)? it going|whats? s? up|sup\b/, () => [um(["doing great! coding, as always", "i'm good! and you?", "all good, listening to some Arctic Monkeys"])]],
    [/(are you|you re|youre) (a )?(bot|robot|ai|real)/, () => ["i'm the pocket version of Aluísio 🤖", "the real one answers on LigadIn or DogHub. i stay here looking after the desktop"]],
    [/who are you|your name/, () => [`i'm ${P.nome}!`, P.cargo.toLowerCase()]],
    [/where.*(live|from)|city|country/, () => [`i live in ${P.local}`, "in a late-afternoon little room (you can see it in quarto_360 😉)"]],
    [/project|portfolio|what (have )?you (do|built|made)|work/, () => ["my favorites:", ...PROJ.map((p) => `• ${p.curto}: ${p.resumo}`), "everything is in the Projects folder on the desktop"]],
    ...PROJ.map((p) => [new RegExp(sem(p.curto) + "|" + p.id), () => [`${p.curto}! ${p.descricao.split(". ")[0].toLowerCase()}.`, `built with ${p.stack.slice(0, 4).join(", ")}`]]),
    [/skill|stack|tech|language|program/, () => [`in the Skills folder: ${window.SKILLS.map((s) => s.nome).join(", ")}`, `courses: ${window.CERTIFICADOS.map((c) => c.curto || c.emissor).join(", ")}`]],
    [/contact|email|linkedin|ligadin|github|doghub|reach you|find you/, () => [`DogHub: ${P.contatos.github.replace("https://github.com", "doghub.com")}`, `LigadIn: ${P.contatos.linkedin.replace(/^https?:\/\/(www\.)?/, "")}`]],
    [/job|hire|hiring|freelance|work (with|together)|opportunit/, () => ["oh nice!! 😄", "message me on LigadIn and i'll get back to you quickly"]],
    [/music|band|listen|spotify|playlist/, () => [um(["Arctic Monkeys, Radiohead and Joji on repeat", "my playlist is on musikzify, in Kez(i)avana 🎧"])]],
    [/game|play/, () => [um(["try clicajogos in Kez(i)avana, there's even a Duck Clicker", "challenge Zizi at tic-tac-toe. good luck"])]],
    [/duck|quack|peep/, () => [um(["quack", "QUACK", "the purple duck from Peep Studio says hi 🦆"])]],
    [/zizi|mascot|assistant/, () => ["Zizi is the aluOS virtual assistant. lives on the desktop, shows you around and helps you leave your name with a commit", "and swears to be unbeatable at tic-tac-toe"]],
    [/secret|easter|achievement|hint|tip/, () => [um(["try the terminal and type something a hacker would type", "the taskbar clock doesn't like being poked", "the recycle bin holds more than it seems"])]],
    [/joke|make me laugh/, () => [um([["why do programmers wear glasses?", "because they can't C# 🤓"], ["how many devs does it take to change a light bulb?", "none, that's a hardware problem"]])]],
    [/thank|thx|ty\b/, () => [um(["you're welcome!!", "anytime", "no problem :)"])]],
    [/bye|see you|later|cya/, () => [um(["thanks for visiting! 👋", "see you!!", "going for a coffee, come back anytime"])]],
    [/(haha|lol|lmao|kkk)/, () => [um(["hahaha", "lol", "kkkkk (that's how we laugh in Brazil)"])]],
    [/^(hi+|hello|hey|yo|good (morning|afternoon|evening)|howdy)\b/, () => [um(["hiii", "hey!", "hello hello"]), um(["how's it going?", "you arrived at the right time", "what's up?"])]],
    [/\?$/, () => [um(["good question… i'll answer in the next commit", "hmm, i don't know that one. teach me? type: teach: question = answer", "ask alulugle 😅"])]],
  ];
  const GENERICO_EN = ["hmmm, tell me more", "interesting 👀", "didn't quite get it, but i agree", "quack?", "i haven't learned that yet. teach me? type: teach: phrase = answer", "whoa", "lol really?"];

  function regras(texto) {
    const t = sem(texto), ens = ler(), EN = ALU.lang === "en";
    const m = String(texto).match(/^\s*(?:ensina|aprende|teach|learn)\s*:\s*(.+?)\s*=\s*(.+)$/i);
    if (m) { ens[sem(m[1])] = m[2].slice(0, 200); gravar(ens); ALU.conquista && ALU.conquista("professor", "Professor de bot", "Ensinou uma frase nova ao MessagerTale."); return EN ? ["noted! 📝", `when you say "${m[1]}", i'll answer "${m[2].slice(0, 200)}"`] : ["anotado! 📝", `quando você disser "${m[1]}", eu respondo "${m[2].slice(0, 200)}"`]; }
    if (ens[t]) return [ens[t]];
    for (const [re, f] of EN ? REGRAS_EN : REGRAS) if (re.test(t)) { const r = f(); return Array.isArray(r[0]) ? r[0] : r; }
    return [um(EN ? GENERICO_EN : GENERICO)];
  }

  // Com o servidor no ar, quem responde é o Gemini falando como o Aluísio ("online").
  // Se a IA falhar ou a cota acabar, ele fica "offline" pelo resto da visita e entra o algoritmo dele (as regras acima).
  const urlIA = () => { const C = ALU.CONFIG || {}; return C.chatApi || (C.api ? String(C.api).replace(/\/+$/, "") + "/chat" : ""); };
  let offline = false;
  try { offline = sessionStorage.getItem("alu.bot.offline") === "1"; } catch {}
  const avisos = [];
  const iaLigada = () => !!urlIA() && !offline;
  function cair() {
    if (offline) return; offline = true;
    try { sessionStorage.setItem("alu.bot.offline", "1"); } catch {}
    avisos.forEach((f) => { try { f(); } catch {} });
  }
  async function perguntarIA(texto, historico) {
    if (!iaLigada()) return null;
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 12000);
      const r = await fetch(urlIA(), { method: "POST", signal: ctl.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mensagem: texto, historico: (historico || []).slice(-10), idioma: ALU.lang || "pt" }) });
      clearTimeout(t);
      if (r.ok) {
        const j = await r.json();
        let linhas = String(j.resposta || "").replace(/```\w*/g, "").split(/\n+/).map((x) => x.replace(/\s+$/, "")).filter(Boolean);
        // se a IA tentar continuar a conversa sozinha ("pessoa: ..."), fica só a fala dela
        const QUEM = /^\s*(pessoa|visitante|voc[eê]|user|usu[aá]rio|alu[ií]sio(\.dev)?)\s*:/i;
        const corte = linhas.findIndex((l, i) => i > 0 && QUEM.test(l));
        if (corte > 0) linhas = linhas.slice(0, corte);
        linhas = linhas.map((l) => l.replace(QUEM, "").trim() ? l.replace(/^\s*(alu[ií]sio(\.dev)?|voc[eê])\s*:\s*/i, "") : l).filter((l) => l.trim());
        if (linhas.length) return linhas.slice(0, 8);
      }
    } catch {}
    cair();
    return null;
  }
  async function responder(texto, historico) {
    const ia = await perguntarIA(texto, historico);
    if (ia) { ia.ia = true; return ia; }
    return regras(texto);
  }
  const INICIO = { pt: "(a pessoa acabou de abrir o MessagerTale no aluOS. puxe conversa você: cumprimente, se apresente em uma frase e pergunte no que pode ajudar)", en: "(the visitor just opened MessagerTale in aluOS. start the conversation: say hi, introduce yourself in one sentence and ask how you can help. answer in english)" };
  const iniciar = () => perguntarIA(INICIO[ALU.lang === "en" ? "en" : "pt"], []);

  ALU.bot = { responder, regras, iniciar, iaLigada, estaOffline: () => offline, aoFicarOffline: (f) => avisos.push(f) };
})();
