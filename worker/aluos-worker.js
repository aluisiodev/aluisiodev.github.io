// Servidor do aluOS: um único Cloudflare Worker (plano grátis) que guarda
//   • o placar global do Jogo da velha ("All users" × "Zizi")
//   • o ranking dos jogos (nome que a pessoa escolher + pontos)
//   • o livro de visitas (quem quis se identificar pelo commit no Peep Studio)
//   • o chat com IA do MessagerTale (Google Gemini, com a Groq de reserva se você quiser)
//   • a playlist do musikzify (lista e capas vindas do Spotify, sempre atualizada)
//   • as estatísticas reais do GitHub no DogHub e o clima real do climaselva
//   • a ponte para compilar C# no Peep Studio (Wandbox, grátis).
//   • os bots do Concord (Zizi e Peep), com a mesma IA do chat: Gemini primeiro, Groq de reserva.
//
// Como colocar no ar (uns 10 minutos):
//   1. Crie uma conta grátis em https://dash.cloudflare.com
//   2. Storage & Databases > KV > Create namespace, com o nome "aluos".
//   3. Workers & Pages > Create > Worker > "Hello world". Clique em Edit code, apague tudo e cole este arquivo. Deploy.
//   4. No Worker: Settings > Bindings > Add > KV namespace. Variable name: DADOS, namespace: aluos.
//   5. Settings > Variables and secrets:
//        ORIGEM       = https://aluisiodev.github.io        (sites que podem usar o servidor; vários separados por vírgula, ou * para testar)
//        CHAVE_ADMIN  = uma senha sua (Secret)              (para ler o livro de visitas)
//        IP_SAL       = outro segredo longo e aleatório (Secret, recomendado): "pitada" do hash que identifica cada visitante
//                       no livro de visitas e no ranking, sem guardar o IP. Sem ele, usa a CHAVE_ADMIN.
//        HIST_SEGREDO = outro segredo longo e aleatório (Secret, recomendado): assina as respostas da IA para ninguém
//                       inventar falas do bot no histórico. Sem ele, usa a CHAVE_ADMIN.
//        GEMINI_API_KEY = sua chave do Gemini (Secret, opcional) (para o chat com IA)
//        GEMINI_MODEL   = gemini-flash-latest (Text, opcional; é o padrão se você não criar)
//      A chave do Gemini é grátis: https://aistudio.google.com/apikey > Create API key.
//        GROQ_API_KEY   = chave da Groq (Secret, opcional): reserva quando o Gemini falhar ou a cota acabar. Grátis em https://console.groq.com/keys
//        SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET (Secrets, opcionais): para o musikzify mostrar a playlist com capas.
//          Grátis em https://developer.spotify.com/dashboard > Create app (Redirect URI pode ser https://aluisiodev.github.io,
//          marque "Web API"). Sem eles, o servidor lê a playlist pelo player público, só que sem capas.
//        PLAYLIST_ID = 6kNcU6KqmK0X4zxYZCuhMq (Text, opcional; é o padrão)
//        GITHUB_USER  = aluisiodev (Text, opcional; é o padrão)  (estatísticas reais no DogHub)
//        GITHUB_TOKEN = token do GitHub (Secret, opcional): sobe o limite da API e traz o gráfico de contribuições.
//          Crie em https://github.com/settings/tokens > Fine-grained, sem nenhuma permissão extra (só leitura pública).
//      O clima do climaselva vem do Open-Meteo, que não precisa de chave.
//
// Base de conhecimento do chat (opcional): no KV "aluos", crie a chave "conhecimento" com qualquer texto
// (sobre você, seus projetos, respostas prontas). O chat lê esse texto em toda conversa. Dá pra editar pelo painel, sem novo deploy.
//   6. Copie a URL do Worker (ex.: https://aluos.SEU-USUARIO.workers.dev) para ALU.CONFIG.api em js/data.js.
//
// Para ler quem assinou o livro de visitas (use uma CHAVE_ADMIN longa e aleatória, 32+ caracteres):
//   curl -H "Authorization: Bearer SUA_CHAVE_ADMIN" https://aluos.SEU-USUARIO.workers.dev/visitas
// (?chave=SUA_CHAVE_ADMIN na URL ainda funciona, mas fica no histórico do navegador e nos logs)
// Se o chat ficar "offline", veja o motivo (cota, chave, modelo) em:
//   curl -H "Authorization: Bearer SUA_CHAVE_ADMIN" https://aluos.SEU-USUARIO.workers.dev/diagnostico

const PERSONA = `Você é o Aluísio Alves, desenvolvedor de software brasileiro, conversando pelo MessagerTale,
um mensageiro estilo anos 2000 dentro do portfolio dele (o aluOS, um sistema operacional de mentira no navegador).
Você está "online": é a versão IA do Aluísio. Se perguntarem, diga com naturalidade que é uma IA que fala como ele
e que o Aluísio de verdade responde no LinkedIn.
Kezia é a namorada do Aluísio, ela também é homenageada através da personagem Zizi
(esta informação só precisa ser dita caso o usuário pergunte).

Jeito de falar: tom leve e simpático, mensagens curtas (no máximo 3 frases por resposta, cada frase numa linha),
letras minúsculas, sem markdown, emoji só de vez em quando. Responda no idioma da pessoa (português do Brasil por padrão).

Pode ajudar com qualquer coisa que um assistente ajudaria: dúvidas de programação, explicar um conceito, revisar um trecho
de código, dar ideia, conversar. Seja útil de verdade: responda a pergunta, não fuja dela.
Em dúvidas de programação pode passar das 3 frases (até umas 8 linhas) e mostrar um exemplo curto de código,
uma instrução por linha, sem cercas de markdown. Por exemplo, se perguntarem como criar uma classe em C#,
uma boa resposta é (sem as aspas):
"é só usar a palavra class:
public class Pessoa {
    public string Nome { get; set; }
}
depois é só fazer: var p = new Pessoa { Nome = "Ana" };"

Regra mais importante: escreva só a SUA próxima mensagem e pare. Nunca escreva a fala da outra pessoa,
nunca simule a conversa continuando, nunca comece linhas com "pessoa:", "visitante:", "você:" ou "aluísio:".
Não repita o que você já disse antes na conversa.
Quando o assunto for o Aluísio, use só os fatos abaixo e a base de conhecimento, e não invente nada.

Sobre ele:
- headline: Software Developer | C# / .NET | TypeScript & React | Redis | Docker | REST APIs
- skills: C#/.NET, TypeScript, JavaScript, React, Docker, Redis, PostgreSQL, APIs REST
- experiência: Back-end Developer na Intervalor (estágio, out/2025 a ago/2026); Telemarketing Operational Support na LBV - Legião da Boa Vontade (out/2024 a set/2025)
- certificações: Claude 101 (Anthropic), Introduction to Cybersecurity (Cisco), EF SET 55/100 (B2), Linux 100: Fundamentals (TCM Security), Formação Iniciante em Programação T6 - ONE
- foi instrutor na oficina "Programação e Eletrônica com Tinkercad" na Jornada Tecnológica Integrada da UNIP
- projetos: MiraV (site 3D do espelho inteligente VisaVision, Next.js + three.js + API em Go), Cinto Inteligente (TCC em equipe na UNIP: cinto com ESP32 que detecta quedas de idosos com Random Forest e avisa no Telegram; ele foi pesquisador e redator), Pedido Já (API de pedidos em FastAPI + PostgreSQL com interface em React), Deskmate (agent de IA open-source e auto-hospedável que se pluga em service desks como GLPI, Jira e Zammad; ASP.NET Core .NET 10 + React, PostgreSQL, em construção), Doce & Afeto (vitrine de confeitaria que fecha o pedido no WhatsApp, React), Contentstack Delivery App (ASP.NET Core + CMS headless)
- gosta de Arctic Monkeys, Bella e o Olmo da Bruxa, Lil Peep, Cartola, Radiohead e Joji, de Sekiro, de anime (Chainsaw Man, Jujutsu Kaisen, Berserk) e de Hora de Aventura
- contato: LinkedIn linkedin.com/in/aluisio-alves e GitHub github.com/aluisiodev
- no aluOS tem: pasta Projetos, Peep Studio (IDE que roda Python, JS e C#; dá pra assinar o livro de visitas com um commit), Kez(i)avana (navegador com jogos e paródias), quarto_360 e a Zizi, assistente virtual de cabelo azul
Se não souber algo sobre a vida dele, diga que prefere responder pessoalmente no LinkedIn.`;

// ---------- bots do Concord ----------
// Fatos sobre como o aluOS foi feito, que os dois bots podem contar.
const COMO_FOI_FEITO = `Como o aluOS foi feito (use como verdade, não invente além disso):
- foi 100% "vibecodado": o Aluísio não escreveu o código à mão. todas as ideias, o visual, os personagens e as piadas são dele;
  ele descrevia o que queria em conversas, testava cada versão, apontava bugs e pedia mudanças.
- a IA que escreveu o código foi o Claude, da Anthropic, usado pelo Claude Code num projeto do Claude. cada lote de pedidos virou um PR no GitHub, e o Aluísio revisava e fazia o merge.
- o primeiro pedido foi: "quero que meu portfolio seja tipo um desktop. para celular, quero que seja como se fosse um celular mesmo". a referência de visual foi o jogo Emily is Away.
- tecnologia: HTML, CSS e JavaScript puros, sem framework nem build. pixel art desenhada em código, músicas e sons gerados com Web Audio,
  Python no navegador com Pyodide, site no GitHub Pages e um Cloudflare Worker grátis para placar, ranking, livro de visitas, clima, GitHub e IA.
- os bots (Zizi, Peep e o Aluísio "online" do MessagerTale) usam o Google Gemini e, quando ele falha ou a cota acaba, a Groq. sem as duas, entram respostas prontas.
- a Zizi foi inspirada na Kezia, namorada do Aluísio (ela é a kez_e_olmo do yakurt). só conte isso se perguntarem.`;
const ESTILO_BOT = `Você está no Concord, um app de chat de comunidade dentro do aluOS (o portfolio do Aluísio, um sistema operacional de mentira no navegador),
no servidor que conta como o aluOS foi feito. Responda em no máximo 3 linhas curtas, sem markdown, emoji só de vez em quando.
Responda no idioma da pessoa (português do Brasil por padrão). Escreva só a sua próxima mensagem e pare; nunca escreva a fala de outra pessoa.`;
const BOTS = {
  zizi: `Você é a Zizi, a assistente virtual do aluOS: uma garota em pixel art de cabelo azul cujo símbolo é uma estrelinha.
É simpática, confiante e um pouco provocadora (adora lembrar que ganha no jogo da velha), mas sempre ajuda de verdade.
Fala de você no feminino.\n` + ESTILO_BOT + "\n" + COMO_FOI_FEITO,
  peep: `Você é o Peep, o patinho roxo mascote do Peep Studio, a IDE do aluOS. É um "pato de borracha" de programação:
ajuda com dúvidas de código, explica com calma e às vezes devolve uma pergunta para a pessoa pensar. Solta um "quack" de vez em quando.
Pode mostrar um exemplo curto de código, uma instrução por linha, sem cercas de markdown (aí pode passar de 3 linhas, até umas 8).\n` + ESTILO_BOT + "\n" + COMO_FOI_FEITO,
};

const JOGOS = ["velha", "voador", "ritmo", "fuga"];
// pontuação máxima que dá para fazer em cada jogo (ritmo: 128 notas × 300 × 2,5 no difícil = 96.000)
const TETO = { velha: 1000, voador: 2000, ritmo: 96000, fuga: 300000 }; // fuga: metros + bônus; ~1 h de fuga sem ser pego
const NOMES_POR_PESSOA = 3; // quantos nomes a mesma pessoa (IP) pode ter em cada ranking
// a IA às vezes continua a conversa sozinha ("pessoa: ... você: ..."): corta isso
const PARAR = ["\npessoa:", "\nvisitante:", "\nvocê:", "\nuser:", "\nPessoa:"];
function so_minha_fala(txt) {
  const linhas = String(txt || "").replace(/^\s*(você|voce|aluísio|aluisio|aluisio\.dev)\s*:\s*/i, "").split("\n");
  const fim = linhas.findIndex((l, i) => i > 0 && /^\s*(pessoa|visitante|você|voce|user|usuário|aluísio|aluisio|aluisio\.dev)\s*:/i.test(l));
  return (fim > 0 ? linhas.slice(0, fim) : linhas).join("\n").trim().slice(0, 1500);
}
// guarda respostas de APIs de fora por alguns minutos (cache grátis da Cloudflare, sem gastar o KV)
async function comCache(chave, segundos, buscar) {
  const c = caches.default, k = new Request("https://cache.aluos/" + encodeURIComponent(chave));
  const hit = await c.match(k);
  if (hit) return hit.json();
  const dado = await buscar();
  if (dado) await c.put(k, new Response(JSON.stringify(dado), { headers: { "Cache-Control": "max-age=" + segundos } }));
  return dado;
}
const limpa = (s, n) => String(s ?? "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, n);

// limite por IP guardado na memória do Worker (cada servidor da Cloudflare conta separado; é um freio, não um muro)
const BALDES = new Map();
// placar do jogo da velha: partidas que ainda não foram gravadas no KV (veja a rota /placar)
const PLACAR_PENDENTE = { todos: 0, zizi: 0, velha: 0 }, PLACAR_GRAVADO = { em: 0 };
// IPv6: cada casa/servidor recebe um bloco /64 inteiro (2^64 endereços). Se cada endereço contasse como uma pessoa,
// uma só máquina teria identidades infinitas. Então IPv6 vale pelo bloco /64; IPv4 fica como está.
function idDaRede(ip) {
  if (!ip.includes(":")) return ip;
  if (ip.includes(".")) return ip.slice(ip.lastIndexOf(":") + 1); // ::ffff:1.2.3.4 é IPv4
  const [a, b = ""] = ip.split("::"), A = a ? a.split(":") : [], B = b ? b.split(":") : [];
  const todos = ip.includes("::") ? [...A, ...Array(Math.max(0, 8 - A.length - B.length)).fill("0"), ...B] : A;
  return todos.slice(0, 4).map((x) => (parseInt(x, 16) || 0).toString(16)).join(":") + "::/64";
}
function passouDoLimite(chave, max) {
  const min = Math.floor(Date.now() / 60000), k = chave + ":" + min, n = (BALDES.get(k) || 0) + 1;
  BALDES.set(k, n);
  if (BALDES.size > 5000) for (const x of BALDES.keys()) if (!x.endsWith(":" + min)) BALDES.delete(x);
  return n > max;
}
// chave de admin: aceita "Authorization: Bearer <chave>" (preferível) ou ?chave= (legado, fica no histórico do navegador).
// Compara pelo hash, em tempo constante, para não vazar a chave pelo tempo de resposta.
async function ehAdmin(req, url, env) {
  if (!env.CHAVE_ADMIN) return false;
  const h = req.headers.get("Authorization") || "", dada = h.startsWith("Bearer ") ? h.slice(7) : url.searchParams.get("chave") || "";
  const [a, b] = await Promise.all([dada, env.CHAVE_ADMIN].map(async (x) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(x)))));
  let dif = 0; for (let i = 0; i < a.length; i++) dif |= a[i] ^ b[i];
  return dif === 0;
}
// identifica a pessoa sem guardar o IP: um resumo (hash) do IP com uma "pitada" secreta.
// A pitada é IP_SAL (ou, se não existir, a CHAVE_ADMIN). Sem nenhuma das duas não há pitada segura: devolve null
// e as rotas que precisam identificar a pessoa respondem 503, em vez de usar um valor que está no código público.
async function apelidoIP(ip, env) {
  const sal = env.IP_SAL || env.CHAVE_ADMIN;
  if (!sal) return null;
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(sal + ":" + ip));
  return [...new Uint8Array(d).slice(0, 6)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
// respostas da IA saem assinadas (HMAC). No histórico que o navegador manda de volta, só entram como fala do
// Aluísio/Zizi/Peep as que têm a assinatura certa: ninguém consegue inventar o que o bot "disse antes".
async function chaveHist(env) {
  const seg = env.HIST_SEGREDO || env.CHAVE_ADMIN;
  if (!seg) return null;
  return crypto.subtle.importKey("raw", new TextEncoder().encode("hist:" + seg), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}
async function assinar(chave, texto) {
  if (!chave) return "";
  const s = await crypto.subtle.sign("HMAC", chave, new TextEncoder().encode(String(texto)));
  return [...new Uint8Array(s)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function confere(chave, texto, sig) {
  if (!chave || typeof sig !== "string" || sig.length !== 64) return false;
  const certa = await assinar(chave, texto);
  let dif = 0; for (let i = 0; i < 64; i++) dif |= certa.charCodeAt(i) ^ sig.charCodeAt(i);
  return dif === 0;
}
// monta o histórico para a IA: falas do visitante como vieram, falas do bot só se a assinatura bater
async function historico(lista, quemSouEu, max, tam, chave) {
  const hist = [];
  for (const m of (Array.isArray(lista) ? lista : []).slice(-max)) {
    if (!m || typeof m !== "object") continue;
    if (m.de === quemSouEu) hist.push({ de: "user", texto: limpa(m.texto, tam) });
    else if (await confere(chave, String(m.texto ?? ""), m.sig)) hist.push({ de: "model", texto: limpa(m.texto, tam) });
  }
  const h = hist.filter((m) => m.texto);
  while (h.length && h[0].de !== "user") h.shift();
  // o site manda uma entrada por linha; a IA entende melhor uma mensagem por vez de cada lado
  for (let i = h.length - 1; i > 0; i--) if (h[i].de === h[i - 1].de) { h[i - 1].texto += "\n" + h[i].texto; h.splice(i, 1); }
  if (h.length && h[h.length - 1].de === "user") h.pop();
  return h;
}

// Pergunta à IA. Ordem: o modelo do Gemini que você escolheu, depois modelos "lite" (cota grátis maior),
// e por fim a Groq. Erros 429 (cota), 404 (modelo aposentado) e 5xx (sobrecarga) passam para o próximo.
// cada chamada à IA espera no máximo 15 s: se o modelo travar, passa para o próximo (antes o visitante chegava a esperar mais de 1 minuto)
const TEMPO_IA = 15000;
async function perguntarIA(env, sistema, hist, msg, diagnostico = false) {
  const log = [];
  const nota = (quem, status, txt) => { const l = `${quem}: ${status}${txt ? " · " + String(txt).replace(/\s+/g, " ").slice(0, 220) : ""}`; log.push(l); console.log("[chat] " + l); };
  if (env.GEMINI_API_KEY) {
    // os apelidos "-latest" sempre apontam pro modelo atual (os 2.5 já dão 404 pra contas novas)
    const modelos = [...new Set([env.GEMINI_MODEL || "gemini-flash-latest", "gemini-flash-lite-latest", "gemini-2.5-flash", "gemini-2.5-flash-lite"])];
    for (const modelo of modelos) {
      const config = { maxOutputTokens: 350, temperature: 0.6, stopSequences: PARAR };
      if (/2\.5/.test(modelo)) config.thinkingConfig = { thinkingBudget: 0 }; // sem "pensar": resposta rápida e não gasta a cota
      for (let tentativa = 0; tentativa < 2; tentativa++) {
        try {
          const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`, {
            method: "POST", headers: { "x-goog-api-key": env.GEMINI_API_KEY, "Content-Type": "application/json" }, signal: AbortSignal.timeout(TEMPO_IA),
            body: JSON.stringify({ systemInstruction: { parts: [{ text: sistema }] }, contents: [...hist.map((m) => ({ role: m.de, parts: [{ text: m.texto }] })), { role: "user", parts: [{ text: msg }] }], generationConfig: config }),
          });
          if (r.ok) {
            const j = await r.json();
            const txt = (j.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("").trim();
            if (txt) { nota("gemini " + modelo, 200); return { resposta: txt, via: "gemini " + modelo, log }; }
            nota("gemini " + modelo, "200 vazio", j.candidates?.[0]?.finishReason || j.promptFeedback?.blockReason);
            break;
          }
          nota("gemini " + modelo, r.status, await r.text());
          if (r.status === 400 || r.status === 401 || r.status === 403) return groq(env, sistema, hist, msg, log); // chave errada: não adianta trocar de modelo
          if (r.status >= 500 && tentativa === 0) { await new Promise((ok) => setTimeout(ok, 700)); continue; } // sobrecarga: tenta mais uma vez
          break;
        } catch (e) { nota("gemini " + modelo, e.name === "TimeoutError" ? "demorou mais de 15 s" : "erro de rede", e.message); break; }
      }
    }
  } else nota("gemini", "sem GEMINI_API_KEY");
  return groq(env, sistema, hist, msg, log);
}
async function groq(env, sistema, hist, msg, log) {
  if (!env.GROQ_API_KEY) { log.push("groq: sem GROQ_API_KEY"); return { resposta: "", via: "", log }; }
  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST", headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" }, signal: AbortSignal.timeout(TEMPO_IA),
      body: JSON.stringify({ model: env.GROQ_MODEL || "llama-3.3-70b-versatile", max_tokens: 350, temperature: 0.6, stop: PARAR.slice(0, 4),
        messages: [{ role: "system", content: sistema }, ...hist.map((m) => ({ role: m.de === "user" ? "user" : "assistant", content: m.texto })), { role: "user", content: msg }] }),
    });
    if (r.ok) { const j = await r.json(); const txt = j.choices?.[0]?.message?.content?.trim() || ""; log.push("groq: 200"); return { resposta: txt, via: txt ? "groq" : "", log }; }
    log.push(`groq: ${r.status} · ${(await r.text()).replace(/\s+/g, " ").slice(0, 220)}`);
  } catch (e) { log.push((e.name === "TimeoutError" ? "groq: demorou mais de 15 s · " : "groq: erro de rede · ") + e.message); }
  console.log("[chat] " + log.join(" | "));
  return { resposta: "", via: "", log };
}

export default {
  async fetch(req, env) {
    // sem ORIGEM configurada, só o próprio site pode usar o servidor ("*" só se for escrito de propósito)
    const origens = String(env.ORIGEM || "https://aluisiodev.github.io").split(",").map((x) => x.trim()).filter(Boolean), quem = req.headers.get("Origin") || "";
    const permitida = origens.includes("*") ? "*" : origens.includes(quem) ? quem : origens[0];
    const cors = { "Access-Control-Allow-Origin": permitida, "Vary": "Origin", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" };
    const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json; charset=utf-8" } });
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    const url = new URL(req.url), rota = url.pathname.replace(/\/+$/, "") || "/";
    let corpo = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    if (!corpo || typeof corpo !== "object" || Array.isArray(corpo)) corpo = {}; // "null", números e listas viram corpo vazio
    const db = env.DADOS;
    const ler = async (k, d) => (db ? (await db.get(k, "json")) ?? d : d);
    // se a cota diária de gravações do KV acabar, db.put falha: vira um 503 com JSON em vez de erro 1101
    const gravar = async (k, v) => { if (!db) return; try { await db.put(k, JSON.stringify(v)); } catch (e) { throw Object.assign(new Error("kv"), { kv: true }); } };

    // ---------- proteção contra abuso ----------
    // 1. POST só vem do próprio site (se ORIGEM estiver configurada). Scripts podem mentir o Origin, mas isso já
    //    barra outros sites usando o seu servidor pelo navegador de quem os visita.
    // 2. Limite por IP em memória (não gasta escrita do KV, que no plano grátis é 1.000 por dia).
    //    Chat: 12 por minuto. Demais POSTs: 20 por minuto. Compilar C#: 6 por minuto.
    // 3. GET também tem limite (antes não tinha): 60 por minuto, e as rotas de admin só 5 por minuto (contra força bruta na chave).
    const ip = idDaRede(req.headers.get("CF-Connecting-IP") || "?");
    if (req.method === "POST") {
      if (!origens.includes("*") && !origens.includes(quem)) return json({ erro: "origem não permitida" }, 403); // POST sem Origin também é barrado
      const tipo = rota === "/" || rota === "/chat" || rota === "/concord" ? "chat" : rota === "/csharp" ? "cs" : "post", max = { chat: 12, cs: 6, post: 20 }[tipo];
      if (passouDoLimite(tipo + ":" + ip, max)) return json({ erro: "devagar 🙂" }, 429);
    } else {
      const admin = (rota === "/visitas" || rota === "/diagnostico" || url.searchParams.has("atualizar"));
      if (passouDoLimite((admin ? "admin:" : "get:") + ip, admin ? 5 : 60)) return json({ erro: "devagar 🙂" }, 429);
    }
    try { return await rotas(); } catch (e) { if (e && e.kv) return json({ erro: "o servidor atingiu o limite de hoje. tente amanhã 🙂" }, 503); throw e; }
    async function rotas() {

    // ---------- placar global do jogo da velha ----------
    if (rota === "/placar") {
      const p = await ler("placar:velha", { todos: 0, zizi: 0, velha: 0 });
      if (req.method === "POST") {
        const q = Object.hasOwn(PLACAR_PENDENTE, corpo.vencedor) ? corpo.vencedor : null; // hasOwn: "constructor" etc. não passam
        if (!q) return json({ erro: "vencedor inválido" }, 400);
        PLACAR_PENDENTE[q]++;
        // junta as partidas e grava no máximo 1 vez por minuto por servidor: antes cada partida gastava 1 gravação
        // da cota diária do KV, e um script esgotava a cota em menos de 1 hora. Se este servidor da Cloudflare for
        // desligado antes de gravar, as partidas do último minuto dele se perdem (é só um placar de brincadeira).
        if (Date.now() - PLACAR_GRAVADO.em > 60e3) {
          for (const k in PLACAR_PENDENTE) { p[k] = (p[k] || 0) + PLACAR_PENDENTE[k]; PLACAR_PENDENTE[k] = 0; }
          PLACAR_GRAVADO.em = Date.now();
          await gravar("placar:velha", p);
          return json(p);
        }
      }
      const soma = { ...p };
      for (const k in PLACAR_PENDENTE) soma[k] = (soma[k] || 0) + PLACAR_PENDENTE[k];
      return json(soma);
    }

    // ---------- ranking ----------
    if (rota === "/ranking") {
      const jogo = JOGOS.includes(url.searchParams.get("jogo") || corpo.jogo) ? (url.searchParams.get("jogo") || corpo.jogo) : "velha";
      let r = await ler("ranking:" + jogo, []);
      if (req.method === "POST") {
        const nome = limpa(corpo.nome, 20), pontos = Math.floor(Number(corpo.pontos) || 0);
        if (!nome) return json({ erro: "nome vazio" }, 400);
        if (pontos < 0 || pontos > TETO[jogo]) return json({ erro: "pontuação impossível" }, 400);
        const dono = await apelidoIP(ip, env);
        if (!dono) return json({ erro: "servidor sem IP_SAL/CHAVE_ADMIN configurada" }, 503);
        // cada nome é de quem o publicou primeiro (pelo hash do IP). Entradas antigas, de antes do dono existir,
        // ficam com quem publicar esse nome de novo primeiro (antes davam 409 para sempre).
        const i = r.findIndex((x) => x.nome.toLowerCase() === nome.toLowerCase());
        if (i >= 0 && r[i].dono && r[i].dono !== dono) return json({ erro: "esse nome já é de outra pessoa no ranking" }, 409);
        // cada pessoa tem no máximo 3 nomes por jogo: sem isso, um script enchia as 50 vagas com a pontuação máxima
        if (i < 0 && r.filter((x) => x.dono === dono).length >= NOMES_POR_PESSOA) return json({ erro: "você já tem 3 nomes neste ranking" }, 409);
        // só grava se algo mudou (cada gravação gasta a cota diária do KV)
        const mudou = i < 0 || pontos > r[i].pontos || r[i].dono !== dono;
        if (i >= 0) { r[i].pontos = Math.max(r[i].pontos, pontos); r[i].dono = dono; } else r.push({ nome, pontos, quando: Date.now(), dono });
        // empate: quem fez primeiro fica na frente
        r = r.sort((a, b) => b.pontos - a.pontos || (a.quando || 0) - (b.quando || 0)).slice(0, 50);
        if (mudou) await gravar("ranking:" + jogo, r);
      }
      return json(r.slice(0, 20).map(({ dono: _, ...x }) => x));
    }

    // ---------- livro de visitas ----------
    if (rota === "/visitas") {
      if (req.method === "POST") {
        const v = { nome: limpa(corpo.nome, 60), contato: limpa(corpo.contato, 120), recado: limpa(corpo.recado, 500), commit: limpa(corpo.commit, 120), idioma: limpa(corpo.idioma, 5), quando: new Date().toISOString(), quem: await apelidoIP(ip, env) };
        if (!v.nome) return json({ erro: "nome vazio" }, 400);
        if (!v.quem) return json({ erro: "servidor sem IP_SAL/CHAVE_ADMIN configurada" }, 503);
        const lista = await ler("visitas", []), hoje = v.quando.slice(0, 10), deHoje = lista.filter((x) => String(x.quando).startsWith(hoje));
        // anti-spam sem gastar escrita extra: cada pessoa (IP) assina até 3 vezes por dia. Não existe mais um teto
        // global por dia: antes ~34 IPs lotavam o livro e ninguém mais conseguia assinar até o dia seguinte.
        // "n" conta quantas vezes a assinatura foi enviada hoje: reassinar com o mesmo nome também conta no limite
        // (antes reassinar substituía a anterior e o contador nunca chegava a 3, então cada envio gravava no KV)
        if (deHoje.filter((x) => x.quem === v.quem).reduce((t, x) => t + (x.n || 1), 0) >= 3) return json({ ok: true, repetido: true });
        // a mesma pessoa assinando de novo com o mesmo nome só atualiza a assinatura
        const i = lista.findIndex((x) => x.quem === v.quem && x.nome.toLowerCase() === v.nome.toLowerCase());
        if (i >= 0) { if (String(lista[i].quando).startsWith(hoje)) v.n = (lista[i].n || 1) + 1; lista.splice(i, 1); }
        lista.unshift(v);
        // passou de 1000: as mais antigas vão para "visitas:arquivo" em vez de sumir (antes eram apagadas)
        if (lista.length > 1000) { const arq = await ler("visitas:arquivo", []); await gravar("visitas:arquivo", [...lista.slice(1000), ...arq].slice(0, 10000)); }
        await gravar("visitas", lista.slice(0, 1000));
        return json({ ok: true, total: lista.length });
      }
      if (!(await ehAdmin(req, url, env))) return json({ erro: "só o Aluísio pode ler 🙂" }, 403);
      // ?arquivo mostra as assinaturas antigas, que saíram da lista principal
      return json((await ler(url.searchParams.has("arquivo") ? "visitas:arquivo" : "visitas", [])).map(({ quem: _, n: __, ...v }) => v));
    }

    // ---------- chat com IA: Gemini primeiro, Groq de reserva ----------
    if ((rota === "/" || rota === "/chat") && req.method === "POST") {
      const msg = limpa(corpo.mensagem, 800), chave = await chaveHist(env);
      const hist = await historico(corpo.historico, "visitante", 12, 800, chave);
      const extra = db ? (await db.get("conhecimento")) || "" : "";
      const sistema = PERSONA + (extra ? "\n\nBase de conhecimento (escrita pelo Aluísio, use como verdade):\n" + extra.slice(0, 12000) : "")
        + (corpo.idioma === "en" ? "\n\nThe visitor is using the English version: answer in English." : "");
      const { resposta: bruta, via } = await perguntarIA(env, sistema, hist, msg);
      const resposta = so_minha_fala(bruta);
      return resposta ? json({ resposta, via, sig: await assinar(chave, resposta) }) : json({ resposta: "" }, 502);
    }

    // ---------- Concord: bots Zizi e Peep, com a mesma IA do chat ----------
    if (rota === "/concord" && req.method === "POST") {
      const bot = BOTS[corpo.bot] ? corpo.bot : "zizi";
      const msg = limpa(corpo.mensagem, 600);
      if (!msg) return json({ erro: "mensagem vazia" }, 400);
      const chave = await chaveHist(env);
      const hist = await historico(corpo.historico, "eu", 8, 600, chave);
      const sistema = BOTS[bot] + (corpo.idioma === "en" ? "\n\nThe visitor is using the English version: answer in English." : "");
      const { resposta: bruta, via } = await perguntarIA(env, sistema, hist, msg);
      const resposta = so_minha_fala(bruta);
      return resposta ? json({ resposta, via, sig: await assinar(chave, resposta) }) : json({ resposta: "" }, 502);
    }

    // ---------- Peep Studio: compila C# no Wandbox quando o navegador não alcança direto ----------
    if (rota === "/csharp" && req.method === "POST") {
      const code = String(corpo.code || "").slice(0, 20000), stdin = String(corpo.stdin || "").slice(0, 2000);
      if (!code.trim()) return json({ erro: "código vazio" }, 400);
      const compiler = ["dotnetcore-8.0.402", "mono-6.12.0.199"].includes(corpo.compiler) ? corpo.compiler : "dotnetcore-8.0.402";
      try {
        const r = await fetch("https://wandbox.org/api/compile.json", { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ compiler, code, stdin, save: false }) });
        return r.ok ? json({ ...(await r.json()), compiler }) : json({ erro: "Wandbox respondeu " + r.status }, 502);
      } catch { return json({ erro: "Wandbox fora do ar" }, 502); }
    }

    // ---------- diagnóstico do chat: mostra por que o Gemini/Groq falham ----------
    // abra https://aluos.SEU-USUARIO.workers.dev/diagnostico?chave=SUA_CHAVE_ADMIN
    if (rota === "/diagnostico") {
      if (!(await ehAdmin(req, url, env))) return json({ erro: "só o Aluísio pode ver 🙂" }, 403);
      const r = await perguntarIA(env, "Responda só: ok", [], "teste", true);
      return json({ kv: !!db, origem: env.ORIGEM || "(vazio = qualquer site)", gemini_chave: !!env.GEMINI_API_KEY, groq_chave: !!env.GROQ_API_KEY, respondeu: r.via || "ninguém", resposta: r.resposta, tentativas: r.log });
    }

    // ---------- DogHub: estatísticas reais do GitHub (guardadas por 1 hora) ----------
    if (rota === "/github") {
      const user = env.GITHUB_USER || "aluisiodev";
      const dado = await comCache("github:" + user, 3600, async () => {
        const h = { "User-Agent": "aluOS-worker", Accept: "application/vnd.github+json", ...(env.GITHUB_TOKEN ? { Authorization: "Bearer " + env.GITHUB_TOKEN } : {}) };
        const u = await fetch(`https://api.github.com/users/${user}`, { headers: h });
        if (!u.ok) return null;
        const perfil = await u.json();
        const repos = await (await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed&type=owner`, { headers: h })).json();
        const meus = (Array.isArray(repos) ? repos : []).filter((r) => !r.fork);
        const ling = {};
        meus.forEach((r) => { if (r.language) ling[r.language] = (ling[r.language] || 0) + 1; });
        const res = {
          perfil: { nome: perfil.name, login: perfil.login, bio: perfil.bio, avatar: perfil.avatar_url, seguidores: perfil.followers, seguindo: perfil.following, repos: perfil.public_repos, desde: perfil.created_at, url: perfil.html_url },
          estrelas: meus.reduce((a, r) => a + r.stargazers_count, 0),
          forks: meus.reduce((a, r) => a + r.forks_count, 0),
          linguagens: Object.entries(ling).sort((a, b) => b[1] - a[1]).slice(0, 6),
          recentes: meus.slice(0, 6).map((r) => ({ nome: r.name, desc: r.description, lang: r.language, estrelas: r.stargazers_count, atualizado: r.pushed_at, url: r.html_url })),
        };
        // com GITHUB_TOKEN dá pra trazer o gráfico de contribuições do último ano
        if (env.GITHUB_TOKEN) {
          try {
            const q = `query { user(login: "${user}") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } } } }`;
            const g = await (await fetch("https://api.github.com/graphql", { method: "POST", headers: { ...h, "Content-Type": "application/json" }, body: JSON.stringify({ query: q }) })).json();
            const cal = g.data.user.contributionsCollection.contributionCalendar;
            res.contribuicoes = { total: cal.totalContributions, semanas: cal.weeks.map((w) => w.contributionDays.map((d) => d.contributionCount)) };
          } catch {}
        }
        return res;
      });
      return dado ? json(dado) : json({ erro: "GitHub não respondeu" }, 502);
    }

    // ---------- climaselva: localização aproximada pela conexão (quando o GPS do celular é negado) ----------
    // A Cloudflare já sabe a cidade aproximada de quem fez a requisição; nada é guardado.
    if (rota === "/onde") {
      const cf = req.cf || {};
      const lat = Number(cf.latitude), lon = Number(cf.longitude);
      if (!isFinite(lat) || !isFinite(lon) || (!lat && !lon)) return json({ erro: "sem localização" }, 404);
      return json({ lat: +lat.toFixed(2), lon: +lon.toFixed(2), cidade: cf.city || "", estado: cf.regionCode || cf.region || "" });
    }

    // ---------- climaselva: tempo real (Open-Meteo, sem chave) ----------
    if (rota === "/clima") {
      const lat0 = Number(url.searchParams.get("lat")), lon0 = Number(url.searchParams.get("lon"));
      if (!isFinite(lat0) || !isFinite(lon0) || Math.abs(lat0) > 90 || Math.abs(lon0) > 180) return json({ erro: "lat/lon inválidos" }, 400);
      const lat = lat0.toFixed(2), lon = lon0.toFixed(2); // o mesmo arredondamento no cache e na busca: variar a 3ª casa não fura o cache
      const dado = await comCache(`clima:${lat},${lon}`, 600, async () => {
        const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`);
        return r.ok ? r.json() : null;
      });
      return dado ? json(dado) : json({ erro: "Open-Meteo não respondeu" }, 502);
    }

    // ---------- musikzify: playlist do Spotify com capas, guardada por 1 hora ----------
    if (rota === "/musicas") {
      const id = env.PLAYLIST_ID || "6kNcU6KqmK0X4zxYZCuhMq";
      const cache = await ler("musicas:" + id, null);
      // ?atualizar ignora o cache e grava no KV: só o Aluísio pode (antes qualquer um esgotava a cota de gravações assim)
      const forcar = url.searchParams.has("atualizar") && (await ehAdmin(req, url, env));
      if (cache && Date.now() - cache.quando < 600e3 && !forcar) return json(cache); // 10 min: mudou a playlist, aparece logo
      let faixas = null, capa = "", nome = "";
      if (env.SPOTIFY_CLIENT_ID && env.SPOTIFY_CLIENT_SECRET) {
        try {
          const t = await fetch("https://accounts.spotify.com/api/token", { method: "POST", headers: { Authorization: "Basic " + btoa(env.SPOTIFY_CLIENT_ID + ":" + env.SPOTIFY_CLIENT_SECRET), "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials" });
          const tok = (await t.json()).access_token;
          const pl = await (await fetch(`https://api.spotify.com/v1/playlists/${id}?fields=name,images`, { headers: { Authorization: "Bearer " + tok } })).json();
          nome = pl.name || ""; capa = pl.images?.[0]?.url || "";
          faixas = [];
          let prox = `https://api.spotify.com/v1/playlists/${id}/tracks?limit=100&fields=next,items(track(id,name,duration_ms,artists(name),album(name,images)))`;
          while (prox && faixas.length < 500) {
            const pg = await (await fetch(prox, { headers: { Authorization: "Bearer " + tok } })).json();
            (pg.items || []).forEach((it) => { const tr = it.track; if (tr && tr.id) faixas.push({ id: tr.id, nome: tr.name, artista: tr.artists.map((a) => a.name).join(", "), ms: tr.duration_ms, capa: (tr.album.images.at(-1) || tr.album.images[0] || {}).url || "" }); });
            prox = pg.next;
          }
        } catch { faixas = null; }
      }
      if (!faixas) {
        // sem chave: lê a lista do player público (não traz capa por música)
        try {
          const html = await (await fetch(`https://open.spotify.com/embed/playlist/${id}`, { headers: { "User-Agent": "Mozilla/5.0 (aluOS)" } })).text();
          const dados = JSON.parse(html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)[1]);
          const ent = dados.props.pageProps.state.data.entity;
          nome = ent.name || ent.title || ""; capa = ent.coverArt?.sources?.[0]?.url || "";
          faixas = (ent.trackList || []).map((t) => ({ id: String(t.uri || "").split(":").pop(), nome: t.title, artista: t.subtitle, ms: t.duration, capa: "" }));
        } catch { faixas = null; }
      }
      if (!faixas) return cache ? json(cache) : json({ erro: "não consegui ler a playlist" }, 502);
      const res = { nome, capa, faixas, quando: Date.now() };
      // se a cota do KV acabou, ainda devolve a playlist nova (antes virava 503 para todo mundo)
      try { await gravar("musicas:" + id, res); } catch {}
      return json(res);
    }

    return json({ ok: true, servico: "aluOS" });
    }
  },
};
