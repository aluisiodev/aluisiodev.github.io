// Servidor do aluOS: um único Cloudflare Worker (plano grátis) que guarda
//   • o placar global do Jogo da velha ("All users" × "Zizi")
//   • o ranking dos jogos (nome que a pessoa escolher + pontos)
//   • o livro de visitas (quem quis se identificar pelo commit no Peep Studio)
//   • o chat com IA do MessagerTale (Google Gemini, com a Groq de reserva se você quiser)
//   • e a playlist do musikzify (lista e capas vindas do Spotify, sempre atualizada).
//
// Como colocar no ar (uns 10 minutos):
//   1. Crie uma conta grátis em https://dash.cloudflare.com
//   2. Storage & Databases > KV > Create namespace, com o nome "aluos".
//   3. Workers & Pages > Create > Worker > "Hello world". Clique em Edit code, apague tudo e cole este arquivo. Deploy.
//   4. No Worker: Settings > Bindings > Add > KV namespace. Variable name: DADOS, namespace: aluos.
//   5. Settings > Variables and secrets:
//        ORIGEM       = https://aluisiodev.github.io        (sites que podem usar o servidor; vários separados por vírgula, ou * para testar)
//        CHAVE_ADMIN  = uma senha sua (Secret)              (para ler o livro de visitas)
//        GEMINI_API_KEY = sua chave do Gemini (Secret, opcional) (para o chat com IA)
//        GEMINI_MODEL   = gemini-2.5-flash (Text, opcional; é o padrão se você não criar)
//      A chave do Gemini é grátis: https://aistudio.google.com/apikey > Create API key.
//        GROQ_API_KEY   = chave da Groq (Secret, opcional): reserva quando o Gemini falhar ou a cota acabar. Grátis em https://console.groq.com/keys
//        SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET (Secrets, opcionais): para o musikzify mostrar a playlist com capas.
//          Grátis em https://developer.spotify.com/dashboard > Create app (Redirect URI pode ser https://aluisiodev.github.io,
//          marque "Web API"). Sem eles, o servidor lê a playlist pelo player público, só que sem capas.
//        PLAYLIST_ID = 6kNcU6KqmK0X4zxYZCuhMq (Text, opcional; é o padrão)
//
// Base de conhecimento do chat (opcional): no KV "aluos", crie a chave "conhecimento" com qualquer texto
// (sobre você, seus projetos, respostas prontas). O chat lê esse texto em toda conversa. Dá pra editar pelo painel, sem novo deploy.
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
de código, dar ideia, conversar. Seja útil de verdade: responda a pergunta, não fuja dela.
Em dúvidas de programação pode passar das 3 frases (até umas 8 linhas) e mostrar um exemplo curto de código,
uma instrução por linha, sem cercas de markdown. Exemplo:
pessoa: como crio uma classe em c#?
você: é só usar a palavra class:
public class Pessoa {
    public string Nome { get; set; }
}
depois é só fazer: var p = new Pessoa { Nome = "Ana" };
Quando o assunto for o Aluísio, use só os fatos abaixo e a base de conhecimento, e não invente nada.

Sobre ele:
- headline: Software Developer | C# / .NET | TypeScript & React | Redis | Docker | REST APIs
- experiência: Back-end Developer na Intervalor (estágio, out/2025 a ago/2026); Telemarketing Operational Support na LBV - Legião da Boa Vontade (out/2024 a set/2025)
- certificações: Claude 101 (Anthropic), Introduction to Cybersecurity (Cisco), EF SET 55/100 (B2), Linux 100: Fundamentals (TCM Security), Formação Iniciante em Programação T6 - ONE
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
    const origens = String(env.ORIGEM || "*").split(",").map((x) => x.trim()).filter(Boolean), quem = req.headers.get("Origin") || "";
    const permitida = origens.includes("*") ? "*" : origens.includes(quem) ? quem : origens[0];
    const cors = { "Access-Control-Allow-Origin": permitida, "Vary": "Origin", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
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

    // ---------- chat com IA: Gemini primeiro, Groq de reserva ----------
    if ((rota === "/" || rota === "/chat") && req.method === "POST") {
      const msg = limpa(corpo.mensagem, 800);
      const hist = (Array.isArray(corpo.historico) ? corpo.historico : []).slice(-12)
        .map((m) => ({ de: m.de === "visitante" ? "user" : "model", texto: limpa(m.texto, 800) })).filter((m) => m.texto);
      while (hist.length && hist[0].de !== "user") hist.shift();
      const extra = db ? (await db.get("conhecimento")) || "" : "";
      const sistema = PERSONA + (extra ? "\n\nBase de conhecimento (escrita pelo Aluísio, use como verdade):\n" + extra.slice(0, 12000) : "")
        + (corpo.idioma === "en" ? "\n\nThe visitor is using the English version: answer in English." : "");
      let resposta = "", via = "";
      if (env.GEMINI_API_KEY) {
        const modelo = env.GEMINI_MODEL || "gemini-2.5-flash";
        const config = { maxOutputTokens: 400, temperature: 0.7 };
        if (modelo.startsWith("gemini-2.5")) config.thinkingConfig = { thinkingBudget: 0 }; // sem "pensar": resposta rápida e não gasta a cota
        try {
          const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`, {
            method: "POST", headers: { "x-goog-api-key": env.GEMINI_API_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({ systemInstruction: { parts: [{ text: sistema }] }, contents: [...hist.map((m) => ({ role: m.de, parts: [{ text: m.texto }] })), { role: "user", parts: [{ text: msg }] }], generationConfig: config }),
          });
          if (r.ok) { const j = await r.json(); resposta = (j.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("").trim(); via = "gemini"; }
        } catch {}
      }
      if (!resposta && env.GROQ_API_KEY) {
        try {
          const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST", headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ model: env.GROQ_MODEL || "llama-3.3-70b-versatile", max_tokens: 400, temperature: 0.7,
              messages: [{ role: "system", content: sistema }, ...hist.map((m) => ({ role: m.de === "user" ? "user" : "assistant", content: m.texto })), { role: "user", content: msg }] }),
          });
          if (r.ok) { const j = await r.json(); resposta = j.choices?.[0]?.message?.content?.trim() || ""; via = "groq"; }
        } catch {}
      }
      return resposta ? json({ resposta, via }) : json({ resposta: "" }, 502);
    }

    // ---------- musikzify: playlist do Spotify com capas, guardada por 1 hora ----------
    if (rota === "/musicas") {
      const id = env.PLAYLIST_ID || "6kNcU6KqmK0X4zxYZCuhMq";
      const cache = await ler("musicas:" + id, null);
      if (cache && Date.now() - cache.quando < 3600e3 && !url.searchParams.has("atualizar")) return json(cache);
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
      await gravar("musicas:" + id, res);
      return json(res);
    }

    return json({ ok: true, servico: "aluOS" });
  },
};
