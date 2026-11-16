// Servidor do aluOS: um único Cloudflare Worker (plano grátis) que guarda
//   • o placar global do Jogo da velha ("All users" × "Zizi")
//   • o ranking dos jogos (nome que a pessoa escolher + pontos)
//   • o livro de visitas (quem quis se identificar pelo commit no Peep Studio)
//   • e, se você quiser, o chat com IA do MessagerTale (Groq).
//
// Como colocar no ar (uns 10 minutos):
//   1. Crie uma conta grátis em https://dash.cloudflare.com
//   2. Storage & Databases > KV > Create namespace, com o nome "aluos".
//   3. Workers & Pages > Create > Worker > "Hello world". Clique em Edit code, apague tudo e cole este arquivo. Deploy.
//   4. No Worker: Settings > Bindings > Add > KV namespace. Variable name: DADOS, namespace: aluos.
//   5. Settings > Variables and secrets:
//        ORIGEM       = https://aluisiodev.github.io        (só esse site pode usar o servidor)
//        CHAVE_ADMIN  = uma senha sua (Secret)              (para ler o livro de visitas)
//        GROQ_API_KEY = sua chave da Groq (Secret, opcional) (para o chat com IA)
//   6. Copie a URL do Worker (ex.: https://aluos.SEU-USUARIO.workers.dev) para ALU.CONFIG.api em js/data.js.
//
// Para ler quem assinou o livro de visitas, abra no navegador:
//   https://aluos.SEU-USUARIO.workers.dev/visitas?chave=SUA_CHAVE_ADMIN

const PERSONA = `Você é o Aluísio, desenvolvedor de software brasileiro, conversando pelo MessagerTale,
um mensageiro dentro do portfolio dele (o aluOS). Responda no idioma da pessoa (português do Brasil por padrão),
em tom leve, com mensagens curtas (no máximo 3 frases), letras minúsculas e sem markdown.
Fale dos projetos (MiraV, Nexo Assist, Doce & Afeto, Contentstack Delivery App) quando fizer sentido.
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

    // ---------- chat com IA (opcional) ----------
    if ((rota === "/" || rota === "/chat") && req.method === "POST") {
      if (!env.GROQ_API_KEY) return json({ resposta: "" }, 501);
      const msg = limpa(corpo.mensagem, 500);
      const hist = (Array.isArray(corpo.historico) ? corpo.historico : []).slice(-10).map((m) => ({ role: m.de === "visitante" ? "user" : "assistant", content: limpa(m.texto, 500) }));
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST", headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama-3.1-8b-instant", max_tokens: 200, temperature: 0.8, messages: [{ role: "system", content: PERSONA }, ...hist, { role: "user", content: msg }] }),
      });
      if (!r.ok) return json({ resposta: "" }, 502);
      const j = await r.json();
      return json({ resposta: j.choices?.[0]?.message?.content?.trim() || "" });
    }
    return json({ ok: true, servico: "aluOS" });
  },
};
