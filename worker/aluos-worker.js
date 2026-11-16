// Servidor do aluOS: um único Cloudflare Worker (plano grátis) que guarda
//   • o placar global do Jogo da velha ("All users" × "Zizi")
//   • o ranking dos jogos (nome que a pessoa escolher + pontos)
//   • o livro de visitas (quem quis se identificar pelo commit no Peep Studio)
//   • e, se você quiser, o chat com IA do MessagerTale (Google Gemini, plano gratuito).
//
// Como colocar no ar (uns 10 minutos):
//   1. Crie uma conta grátis em https://dash.cloudflare.com
//   2. Storage & Databases > KV > Create namespace, com o nome "aluos".
//   3. Workers & Pages > Create > Worker > "Hello world". Clique em Edit code, apague tudo e cole este arquivo. Deploy.
//   4. No Worker: Settings > Bindings > Add > KV namespace. Variable name: DADOS, namespace: aluos.
//   5. Settings > Variables and secrets:
//        ORIGEM       = https://aluisiodev.github.io        (só esse site pode usar o servidor)
//        CHAVE_ADMIN  = uma senha sua (Secret)              (para ler o livro de visitas)
//        GEMINI_API_KEY = sua chave do Gemini (Secret, opcional) (para o chat com IA)
//        GEMINI_MODEL   = gemini-2.5-flash (Text, opcional; é o padrão se você não criar)
//      A chave do Gemini é grátis: https://aistudio.google.com/apikey > Create API key.
//   6. Copie a URL do Worker (ex.: https://aluos.SEU-USUARIO.workers.dev) para ALU.CONFIG.api em js/data.js.
//
// Para ler quem assinou o livro de visitas, abra no navegador:
//   https://aluos.SEU-USUARIO.workers.dev/visitas?chave=SUA_CHAVE_ADMIN

const PERSONA = `Você é o Aluísio Alves, desenvolvedor de software brasileiro, conversando pelo MessagerTale,
um mensageiro estilo anos 2000 dentro do portfolio dele (o aluOS, um sistema operacional de mentira no navegador).
Você está "online": é a versão IA do Aluísio. Se perguntarem, diga com naturalidade que é uma IA que fala como ele
e que o Aluísio de verdade responde no LinkedIn.

Jeito de falar: tom leve e simpático, mensagens curtas (no máximo 3 frases por resposta, cada frase numa linha),
letras minúsculas, sem markdown, emoji só de vez em quando. Responda no idioma da pessoa (português do Brasil por padrão).

Pode ajudar com qualquer coisa que um assistente ajudaria: dúvidas de programação, explicar um conceito, revisar um trecho
de código, dar ideia, conversar. Quando o assunto for o Aluísio, use só os fatos abaixo e não invente nada.

Sobre ele:
- headline: Software Developer | C# / .NET | TypeScript & React | Redis | Docker | REST APIs
- experiência: Back-end Developer na Intervalor (estágio, out/2025 a ago/2026); Telemarketing Operational Support na LBV - Legião da Boa Vontade (out/2024 a set/2025)
- certificações: Claude 101 (Anthropic), Introduction to Cybersecurity (Cisco), EF SET 55/100 (B2), Linux 100: Fundamentals, Formação Iniciante em Programação T6 - ONE
- foi instrutor na oficina "Programação e Eletrônica com Tinkercad" na Jornada Tecnológica Integrada da UNIP
- projetos: MiraV (site 3D do espelho inteligente VisaVision, Next.js + three.js + API em Go), Nexo Assist (agent de IA para service desk com Mastra, Gemini e Groq), Doce & Afeto (vitrine de confeitaria que fecha o pedido no WhatsApp, React), Contentstack Delivery App (ASP.NET Core + CMS headless)
- gosta de Arctic Monkeys, Radiohead e Joji, de Sekiro, de anime (Chainsaw Man, Jujutsu Kaisen, Berserk) e de Hora de Aventura
- contato: LinkedIn linkedin.com/in/aluisio-alves e GitHub github.com/aluisiodev
- no aluOS tem: pasta Projetos, Peep Studio (IDE que roda Python, JS e C#; dá pra assinar o livro de visitas com um commit), Kez(i)avana (navegador com jogos e paródias), quarto_360 e a Zizi, assistente virtual de cabelo azul
Se não souber algo sobre a vida dele, diga que prefere responder pessoalmente no LinkedIn.`;

const JOGOS = ["velha", "voador", "ritmo"];
const limpa = (s, n) => String(s ?? "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, n);

export default {
  async fetch(req, env) {
    const cors = { "Access-Control-Allow-Origin": env.ORIGEM || "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
    const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json; charset=utf-8" } });
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    const url = new URL(req.url), rota = url.pathname.replace(/\/+$/, "") || "/";
    const corpo = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const db = env.DADOS;
    const ler = async (k, d) => (db ? (await db.get(k, "json")) ?? d : d);
    const gravar = (k, v) => db && db.put(k, JSON.stringify(v));

    // limite simples: no máximo 30 escritas por minuto por IP
    if (req.method === "POST" && db && rota !== "/" && rota !== "/chat") {
      const ip = req.headers.get("CF-Connecting-IP") || "?", k = "lim:" + ip + ":" + Math.floor(Date.now() / 60000);
      const n = Number(await db.get(k)) || 0;
      if (n > 30) return json({ erro: "devagar 🙂" }, 429);
      await db.put(k, String(n + 1), { expirationTtl: 120 });
    }

    // ---------- placar global do jogo da velha ----------
    if (rota === "/placar") {
      const p = await ler("placar:velha", { todos: 0, zizi: 0, velha: 0 });
      if (req.method === "POST") {
        const q = { todos: "todos", zizi: "zizi", velha: "velha" }[corpo.vencedor];
        if (!q) return json({ erro: "vencedor inválido" }, 400);
        p[q] = (p[q] || 0) + 1; await gravar("placar:velha", p);
      }
      return json(p);
    }

    // ---------- ranking ----------
    if (rota === "/ranking") {
      const jogo = JOGOS.includes(url.searchParams.get("jogo") || corpo.jogo) ? (url.searchParams.get("jogo") || corpo.jogo) : "velha";
      let r = await ler("ranking:" + jogo, []);
      if (req.method === "POST") {
        const nome = limpa(corpo.nome, 20), pontos = Math.max(0, Math.min(1e6, Math.floor(Number(corpo.pontos) || 0)));
        if (!nome) return json({ erro: "nome vazio" }, 400);
        const i = r.findIndex((x) => x.nome.toLowerCase() === nome.toLowerCase());
        if (i >= 0) r[i].pontos = Math.max(r[i].pontos, pontos); else r.push({ nome, pontos, quando: Date.now() });
        r = r.sort((a, b) => b.pontos - a.pontos).slice(0, 50);
        await gravar("ranking:" + jogo, r);
      }
      return json(r.slice(0, 20));
    }

    // ---------- livro de visitas ----------
    if (rota === "/visitas") {
      if (req.method === "POST") {
        const v = { nome: limpa(corpo.nome, 60), contato: limpa(corpo.contato, 120), recado: limpa(corpo.recado, 500), commit: limpa(corpo.commit, 120), idioma: limpa(corpo.idioma, 5), quando: new Date().toISOString() };
        if (!v.nome) return json({ erro: "nome vazio" }, 400);
        const lista = await ler("visitas", []); lista.unshift(v); await gravar("visitas", lista.slice(0, 1000));
        return json({ ok: true, total: lista.length });
      }
      if (!env.CHAVE_ADMIN || url.searchParams.get("chave") !== env.CHAVE_ADMIN) return json({ erro: "só o Aluísio pode ler 🙂" }, 403);
      return json(await ler("visitas", []));
    }

    // ---------- chat com IA (opcional, Google Gemini) ----------
    if ((rota === "/" || rota === "/chat") && req.method === "POST") {
      if (!env.GEMINI_API_KEY) return json({ resposta: "" }, 501);
      const modelo = env.GEMINI_MODEL || "gemini-2.5-flash";
      const msg = limpa(corpo.mensagem, 500);
      const hist = (Array.isArray(corpo.historico) ? corpo.historico : []).slice(-10)
        .map((m) => ({ role: m.de === "visitante" ? "user" : "model", parts: [{ text: limpa(m.texto, 500) }] }))
        .filter((m) => m.parts[0].text);
      // o Gemini exige que a conversa comece com "user"
      while (hist.length && hist[0].role !== "user") hist.shift();
      const config = { maxOutputTokens: 300, temperature: 0.8 };
      if (modelo.startsWith("gemini-2.5")) config.thinkingConfig = { thinkingBudget: 0 }; // sem "pensar": resposta rápida e não gasta a cota
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`, {
        method: "POST", headers: { "x-goog-api-key": env.GEMINI_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: PERSONA }] },
          contents: [...hist, { role: "user", parts: [{ text: msg }] }],
          generationConfig: config,
        }),
      });
      if (!r.ok) return json({ resposta: "", erro: r.status }, 502);
      const j = await r.json();
      const resposta = (j.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("").trim();
      return json({ resposta });
    }
    return json({ ok: true, servico: "aluOS" });
  },
};
