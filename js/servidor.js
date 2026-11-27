// Fala com o servidor do aluOS (worker/aluos-worker.js) e com o GoatCounter.
// Sem ALU.CONFIG.api, tudo continua funcionando, mas só neste navegador.
(function () {
  const ALU = window.ALU, CFG = () => ALU.CONFIG || {};
  const ls = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
  const base = () => String(CFG().api || "").replace(/\/+$/, "");
  async function chamar(rota, corpo) {
    if (!base()) return null;
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 7000);
    try {
      const r = await fetch(base() + rota, corpo ? { method: "POST", signal: ctl.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo) } : { signal: ctl.signal });
      if (r.ok) return await r.json();
      // 400/409 de propósito (nome de outra pessoa, pontuação impossível): devolve o motivo para o site mostrar
      if (corpo && (r.status === 400 || r.status === 409)) { const j = await r.json().catch(() => null); if (j && j.erro) return { erro: j.erro, status: r.status }; }
      return null;
    } catch { return null; } finally { clearTimeout(t); }
  }
  const online = () => !!base();

  // ---------- placar global do jogo da velha ----------
  async function placar() { return (await chamar("/placar")) || ls.get("alu.placar.local", { todos: 0, zizi: 0, velha: 0 }); }
  async function somarPlacar(vencedor) {
    const r = await chamar("/placar", { vencedor });
    if (r && !r.erro) return r;
    const p = ls.get("alu.placar.local", { todos: 0, zizi: 0, velha: 0 }); p[vencedor] = (p[vencedor] || 0) + 1; ls.set("alu.placar.local", p); return p;
  }

  // ---------- ranking ----------
  const ordenar = (r) => r.sort((a, b) => b.pontos - a.pontos).slice(0, 20);
  async function ranking(jogo) { return (await chamar("/ranking?jogo=" + jogo)) || ordenar(ls.get("alu.ranking." + jogo, [])); }
  async function enviarRanking(jogo, nome, pontos) {
    const r = await chamar("/ranking", { jogo, nome, pontos });
    if (r) return r; // ranking novo ou { erro } quando o servidor recusa
    const l = ls.get("alu.ranking." + jogo, []), i = l.findIndex((x) => x.nome.toLowerCase() === nome.toLowerCase());
    if (i >= 0) l[i].pontos = Math.max(l[i].pontos, pontos); else l.push({ nome, pontos });
    ls.set("alu.ranking." + jogo, l); return ordenar(l);
  }

  // ---------- livro de visitas ----------
  async function assinar(dados) {
    ls.set("alu.visitante", dados);
    const r = await chamar("/visitas", { ...dados, idioma: ALU.lang });
    // o GoatCounter só conta que alguém assinou; o nome fica no servidor, protegido pela CHAVE_ADMIN
    evento("livro-de-visitas", "Assinou o livro de visitas");
    return !!r && !r.erro;
  }

  // ---------- GoatCounter (estatística de visitas, sem cookies) ----------
  const preview = /claude|anthropic|usercontent/.test(location.hostname) || location.hostname === "localhost" || location.protocol === "file:";
  function evento(caminho, titulo) {
    if (preview || !CFG().goatcounter || !window.goatcounter || !window.goatcounter.count) return;
    try { window.goatcounter.count({ path: caminho, title: titulo, event: true }); } catch {}
  }
  function iniciarGoat() {
    const codigo = CFG().goatcounter;
    if (preview || !codigo) return;
    window.goatcounter = { no_onload: false, allow_local: false };
    const s = document.createElement("script");
    s.async = true; s.src = "https://gc.zgo.at/count.js";
    s.dataset.goatcounter = /^https?:/.test(codigo) ? codigo : `https://${codigo}.goatcounter.com/count`;
    document.head.appendChild(s);
  }
  // abrir apps vira evento no GoatCounter (dá pra ver quais janelas as pessoas mais abrem)
  ALU.contarApp = (id) => evento("app/" + id, "Abriu " + id);

  ALU.api = { online, placar, somarPlacar, ranking, enviarRanking, assinar, evento };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciarGoat); else iniciarGoat();
})();
