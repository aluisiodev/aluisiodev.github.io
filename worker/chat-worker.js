// Cloudflare Worker para o MessagerTale conversar com uma IA gratuita (Groq).
// Como usar:
//   1. Crie uma conta grátis em https://console.groq.com e gere uma API key.
//   2. No painel da Cloudflare: Workers & Pages > Create > Worker. Cole este arquivo.
//   3. Em Settings > Variables, adicione o secret GROQ_API_KEY e a variável ORIGEM
//      com o endereço do site (ex.: https://aluisiodev.github.io).
//   4. Copie a URL do Worker para ALU.CONFIG.chatApi em js/data.js.
// A chave fica só no Worker; o navegador nunca vê.

const PERSONA = `Você é o Aluísio, desenvolvedor de software brasileiro, conversando pelo MessagerTale,
um mensageiro dentro do portfolio dele (o aluOS). Responda em português do Brasil, em tom leve,
com mensagens curtas (no máximo 3 frases), letras minúsculas e sem markdown.
Fale dos projetos (MiraV, Nexo Assist, Doce & Afeto, Contentstack Delivery App) quando fizer sentido.
Se não souber algo sobre a vida dele, diga que prefere responder pessoalmente no LinkedIn.`;

export default {
  async fetch(req, env) {
    const cors = { "Access-Control-Allow-Origin": env.ORIGEM || "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return new Response("Método não permitido", { status: 405, headers: cors });
    let corpo;
    try { corpo = await req.json(); } catch { return new Response("JSON inválido", { status: 400, headers: cors }); }
    const msg = String(corpo.mensagem || "").slice(0, 500);
    const hist = (Array.isArray(corpo.historico) ? corpo.historico : []).slice(-10).map((m) => ({
      role: m.de === "visitante" ? "user" : "assistant", content: String(m.texto || "").slice(0, 500),
    }));
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama-3.1-8b-instant", max_tokens: 200, temperature: 0.8,
        messages: [{ role: "system", content: PERSONA }, ...hist, { role: "user", content: msg }] }),
    });
    if (!r.ok) return new Response(JSON.stringify({ resposta: "" }), { status: 502, headers: { ...cors, "Content-Type": "application/json" } });
    const j = await r.json();
    const resposta = j.choices?.[0]?.message?.content?.trim() || "";
    return new Response(JSON.stringify({ resposta }), { headers: { ...cors, "Content-Type": "application/json" } });
  },
};
