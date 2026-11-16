// "aluisio.dev de bolso": um bot no estilo SimSimi para o MessagerTale.
// Funciona sem servidor (regras + coisas que o visitante ensina). Se ALU.CONFIG.chatApi
// apontar para um Worker (Cloudflare + Groq/Gemini, por exemplo), ele usa a IA e cai nas regras se falhar.
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
    [/skill|habilidade|stack|tecnologia|linguage|sabe programar/, () => [`na pasta Skills: ${window.SKILLS.map((s) => s.nome).join(", ")}`, `certificações: ${window.CERTIFICADOS.map((c) => c.emissor).join(", ")}`]],
    [/c#|csharp|dotnet|\.net/, () => ["C# é meu xodó", "inclusive dá pra rodar C# no Peep Studio, testa lá"]],
    [/python|javascript|\bjs\b/, () => ["abre o Peep Studio e cria um arquivo na pasta meus-codigos. roda de verdade!"]],
    [/contato|email|e-mail|falar com voce|linkedin|ligadin|github|doghub|achar voce/, () => [`DogHub: ${P.contatos.github.replace("https://github.com", "doghub.com")}`, `LigadIn: ${P.contatos.linkedin.replace(/^https?:\/\/(www\.)?/, "")}`]],
    [/vaga|contrat|emprego|freela|trabalhar (com|junto)/, () => ["opa!! fico feliz 😄", "me chama no LigadIn que eu respondo rapidinho"]],
    [/musica|banda|ouve|spotify|cancao|playlist/, () => [um(["Arctic Monkeys, Radiohead e Joji no repeat", "tem minha playlist no musikzify, lá no Kez(i)avana 🎧"])]],
    [/jogo|game|joga|ps5|sekiro|fnaf/, () => [um(["Sekiro me ensinou que hesitation is defeat", "tenta o clicajogos no Kez(i)avana, tem até Pato Clicker", "FNAF é tradição. cuidado com a porta"])]],
    [/anime|manga|chainsaw|jujutsu|berserk|hora de aventura|adventure time/, () => [um(["Chainsaw Man, Jujutsu Kaisen e Berserk tão na estante", "Hora de Aventura é eterno. Marshall Lee na TV do quarto"])]],
    [/pato|quack|peep/, () => [um(["quack", "QUACK", "o pato roxo do Peep Studio manda um oi 🦆"])]],
    [/girafa|savana|leao|zebra/, () => [um(["🦒", "a savana agradece a visita", "já tentou digitar savana em algum lugar?"])]],
    [/urso|bonzinho/, () => ["o Bonzinho é gente boa. não instala nada, só dá dica"]],
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

  function regras(texto) {
    const t = sem(texto), ens = ler();
    const m = String(texto).match(/^\s*(?:ensina|aprende)\s*:\s*(.+?)\s*=\s*(.+)$/i);
    if (m) { ens[sem(m[1])] = m[2].slice(0, 200); gravar(ens); ALU.conquista && ALU.conquista("professor", "Professor de bot", "Ensinou uma frase nova ao MessagerTale."); return ["anotado! 📝", `quando você disser "${m[1]}", eu respondo "${m[2].slice(0, 200)}"`]; }
    if (ens[t]) return [ens[t]];
    for (const [re, f] of REGRAS) if (re.test(t)) { const r = f(); return Array.isArray(r[0]) ? r[0] : r; }
    return [um(GENERICO)];
  }

  async function responder(texto, historico) {
    const api = ALU.CONFIG && ALU.CONFIG.chatApi;
    if (api) {
      try {
        const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 9000);
        const r = await fetch(api, { method: "POST", signal: ctl.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mensagem: texto, historico: (historico || []).slice(-10) }) });
        clearTimeout(t);
        if (r.ok) { const j = await r.json(); const linhas = String(j.resposta || "").split(/\n+/).map((x) => x.trim()).filter(Boolean); if (linhas.length) return linhas.slice(0, 4); }
      } catch {}
    }
    return regras(texto);
  }

  ALU.bot = { responder, regras };
})();
