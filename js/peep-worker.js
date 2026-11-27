// Roda o código do Peep Studio fora da página, para um loop infinito não travar o aluOS.
// Python usa o Pyodide (CPython em WebAssembly), JavaScript roda direto e C# passa pelo tradutor de bolso.
let py = null;
const out = (t, tipo = "out") => postMessage({ tipo, t });

async function carregarPython() {
  if (py) return py;
  out("Carregando Python (só na primeira vez, uns segundos)…\n", "info");
  importScripts("vendor/pyodide/pyodide.js");
  const base = new URL("vendor/pyodide/", location.href).href;
  // a biblioteca padrão é um .zip; está com extensão .wasm só para qualquer servidor estático entregar sem frescura
  py = await loadPyodide({ indexURL: base, stdLibURL: base + "python_stdlib.wasm" });
  return py;
}

function linhasDe(stdin) { const l = String(stdin || "").split("\n"); let i = 0; return () => (i < l.length ? l[i++] : null); }

async function rodarJS(codigo, stdin) {
  const ler = linhasDe(stdin);
  const fmt = (v) => typeof v === "string" ? v : (() => { try { return JSON.stringify(v); } catch { return String(v); } })();
  const con = {
    log: (...a) => out(a.map(fmt).join(" ") + "\n"), info: (...a) => out(a.map(fmt).join(" ") + "\n"),
    warn: (...a) => out(a.map(fmt).join(" ") + "\n", "aviso"), error: (...a) => out(a.map(fmt).join(" ") + "\n", "erro"),
    table: (x) => out(fmt(x) + "\n"), clear: () => {},
  };
  const prompt = (msg) => { if (msg) out(String(msg)); const r = ler(); if (msg) out((r ?? "") + "\n"); return r; };
  const f = new Function("console", "prompt", "__out", "__readLine", `"use strict"; return (async () => {\n${codigo}\n})();`);
  await f(con, prompt, (t) => out(t), ler);
}

async function rodarPython(codigo, stdin) {
  const p = await carregarPython();
  postMessage({ tipo: "iniciou" });
  const ler = linhasDe(stdin);
  const dec = new TextDecoder(); let buf = [];
  const flush = () => { if (buf.length) { out(dec.decode(new Uint8Array(buf))); buf = []; } };
  p.setStdout({ raw: (c) => { buf.push(c); if (c === 10) flush(); } });
  p.setStderr({ batched: (t) => { flush(); out(t + "\n", "erro"); } });
  p.setStdin({ stdin: () => { flush(); const r = ler(); if (r !== null) out(r + "\n", "eco"); return r === null ? undefined : r; } });
  try { await p.runPythonAsync(codigo); } finally { flush(); }
}

async function rodarCSharp(codigo, stdin) {
  importScripts("peep-csharp.js");
  const js = self.CSharpBolso.traduzir(codigo);
  const ler = linhasDe(stdin);
  const f = new Function("__out", "__readLine", `"use strict";\n${self.CSharpBolso.PRELUDIO}\n${js}`);
  try { f((t) => out(t), ler); }
  catch (e) { e.traduzido = js; throw e; }
}

// Tira do traceback os quadros internos do Pyodide (cada quadro é a linha "File ..." mais as linhas de código
// e de ^^^ embaixo dela) e troca o "<exec>" pelo nome do arquivo, para o erro ficar igual ao do Python normal.
function limparTraceback(msg, arquivo) {
  const ls = msg.split("\n"), res = [];
  let pulando = false;
  for (const l of ls) {
    const quadro = /^\s+File "/.test(l);
    if (quadro) pulando = !/^\s+File "<exec>"/.test(l);
    else if (!/^\s{4}/.test(l)) pulando = false;      // linha sem recuo: "Traceback…" ou "TipoDeErro: …"
    if (!pulando && !/_pyodide|pyodide\.ffi/.test(l)) res.push(l);
  }
  return res.join("\n").replace(/File "<exec>"/g, `File "${arquivo || "main.py"}"`);
}

onmessage = async (e) => {
  const { lang, codigo, stdin } = e.data;
  const t0 = performance.now();
  try {
    if (lang === "py") await rodarPython(codigo, stdin);
    else if (lang === "js") await rodarJS(codigo, stdin);
    else if (lang === "cs") await rodarCSharp(codigo, stdin);
    postMessage({ tipo: "fim", ok: true, ms: Math.round(performance.now() - t0) });
  } catch (err) {
    let msg = String(err && err.message || err);
    if (lang === "py") msg = limparTraceback(msg, e.data.arquivo);
    out(msg.trim() + "\n", "erro");
    if (/EOFError|EOF when reading/.test(msg)) out("Dica: o input() leu tudo que tinha em ENTRADA (stdin). Escreva uma resposta por linha lá do lado. →\n", "aviso");
    postMessage({ tipo: "fim", ok: false, ms: Math.round(performance.now() - t0), traduzido: err && err.traduzido });
  }
};
