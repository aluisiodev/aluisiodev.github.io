// Peep Studio: a IDE do patinho roxo.
// A pasta "aluisio" é o "código-fonte" do Aluísio (só leitura). A pasta "meus-codigos" é sua:
// crie arquivos .py, .js ou .cs e rode de verdade no navegador.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s);
  const P = window.PERFIL, PROJ = window.PROJETOS;
  const q = (s) => `"${s.replace(/"/g, '\\"')}"`;
  const LS = "alu.peep.arquivos", LS_LIVRO = "alu.peep.livro", LIVRO = "LivroDeVisitas.cs";
  const T = (pt, en) => (ALU.lang === "en" ? en : pt);
  // O único arquivo do repositório do Aluísio que o visitante pode editar: serve para se identificar, se quiser.
  const MODELO_LIVRO = () => T(`// Livro de visitas do aluOS ✍️
// Quer que o Aluísio saiba que você passou por aqui? Preencha e faça um commit (botão ⎇ Commit lá em cima).
// Tudo é opcional e só vai se você fizer o commit. Ninguém é identificado sem querer.

var visita = new Visita
{
    Nome    = "",   // seu nome ou apelido
    Contato = "",   // LinkedIn, e-mail, site… (opcional)
    Recado  = "",   // um recado para o Aluísio (opcional)
};
`, `// aluOS guestbook ✍️
// Want Aluísio to know you stopped by? Fill this in and make a commit (⎇ Commit button at the top).
// Everything is optional and only gets sent if you commit. Nobody is identified without wanting to.

var visita = new Visita
{
    Nome    = "",   // your name or nickname
    Contato = "",   // LinkedIn, e-mail, website… (optional)
    Recado  = "",   // a message for Aluísio (optional)
};
`);
  const campo = (txt, k) => ((txt.match(new RegExp(k + '\\s*=\\s*"((?:[^"\\\\]|\\\\.)*)"')) || [])[1] || "").trim();
  ALU.lerLivro = (txt) => ({ nome: campo(txt, "Nome"), contato: campo(txt, "Contato"), recado: campo(txt, "Recado") });

  const LINGUAS = {
    py: { nome: "Python", rot: "PY", cor: "py" },
    js: { nome: "JavaScript", rot: "JS", cor: "js" },
    cs: { nome: "C#", rot: "C#", cor: "cs" },
  };
  const extDe = (n) => (n.match(/\.(\w+)$/) || [])[1] || "";
  const MODELOS = {
    py: (n) => T(`# ${n}.py\nnome = input("Qual é o seu nome? ")\nprint(f"Olá, {nome or 'visitante'}!")\n`, `# ${n}.py\nname = input("What's your name? ")\nprint(f"Hi, {name or 'visitor'}!")\n`),
    js: (n) => T(`// ${n}.js\nconst nome = prompt("Qual é o seu nome?") || "visitante";\nconsole.log(\`Olá, \${nome}!\`);\n`, `// ${n}.js\nconst name = prompt("What's your name?") || "visitor";\nconsole.log(\`Hi, \${name}!\`);\n`),
    cs: (n) => `// ${n}.cs\nusing System;\n\nclass Programa\n{\n    static void Main()\n    {\n        Console.Write("Qual é o seu nome? ");\n        string nome = Console.ReadLine();\n        Console.WriteLine($"Olá, {nome}!");\n    }\n}\n`.replace(/Programa|Qual é o seu nome\? |nome|Olá/g, (x) => (ALU.lang === "en" ? { Programa: "Program", "Qual é o seu nome? ": "What's your name? ", nome: "name", "Olá": "Hi" }[x] : x)),
  };
  const EXEMPLOS = {
    "ola.py": T(`# Python de verdade, rodando no seu navegador (Pyodide).
nome = input("Qual é o seu nome? ")
print(f"Olá, {nome or 'visitante'}! Bem-vindo à savana 🦒")

for i in range(1, 4):
    print("quack " * i)

bichos = {"girafa": 3, "zebra": 5, "pato roxo": 1}
maior = max(bichos, key=bichos.get)
print(f"Tem mais {maior} do que qualquer outro bicho.")
`, `# Real Python, running in your browser (Pyodide).
name = input("What's your name? ")
print(f"Hi, {name or 'visitor'}! Welcome to the savanna 🦒")

for i in range(1, 4):
    print("quack " * i)

animals = {"giraffe": 3, "zebra": 5, "purple duck": 1}
most = max(animals, key=animals.get)
print(f"There are more of the {most} than any other animal.")
`),
    "ola.js": T(`// JavaScript rodando num worker isolado (um loop infinito não trava o aluOS).
const bichos = ["girafa", "zebra", "leão", "pato roxo"];
bichos.forEach((b, i) => console.log(\`\${i + 1}. \${b}\`));

const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));
console.log("fib(20) =", fib(20));
`, `// JavaScript running in an isolated worker (an infinite loop won't freeze aluOS).
const animals = ["giraffe", "zebra", "lion", "purple duck"];
animals.forEach((a, i) => console.log(\`\${i + 1}. \${a}\`));

const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));
console.log("fib(20) =", fib(20));
`),
    "Ola.cs": T(`using System;
using System.Collections.Generic;

class Programa
{
    static void Main()
    {
        Console.WriteLine("Olá do C#!");
        var bichos = new List<string> { "girafa", "zebra", "pato" };
        bichos.Add("leão");
        foreach (var b in bichos)
            Console.WriteLine($"- {b.ToUpper()}");
        Console.WriteLine($"Soma de 1 a 10: {Soma(10)}");
    }

    static int Soma(int n)
    {
        int total = 0;
        for (int i = 1; i <= n; i++) total += i;
        return total;
    }
}
`, `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello from C#!");
        var animals = new List<string> { "giraffe", "zebra", "duck" };
        animals.Add("lion");
        foreach (var a in animals)
            Console.WriteLine($"- {a.ToUpper()}");
        Console.WriteLine($"Sum from 1 to 10: {Sum(10)}");
    }

    static int Sum(int n)
    {
        int total = 0;
        for (int i = 1; i <= n; i++) total += i;
        return total;
    }
}
`),
  };

  function arquivosAluisio() {
    const cs = [
      "using Savana.Dev;", "", "namespace Portfolio;", "",
      T("// O arquivo mais importante deste computador.", "// The most important file on this computer."),
      "public class Aluisio : Desenvolvedor", "{",
      `    public string Nome => ${q(P.nome)};`, `    public string Cargo => ${q(P.cargo)};`, `    public string Local => ${q(P.local)};`, "",
      "    public string[] Skills =>", `        [${window.SKILLS.map((s) => q(s.nome)).join(", ")}];`, "",
      "    public string[] Cursos =>", "    [", ...window.CERTIFICADOS.map((c) => `        ${q(c.nome)},`), "    ];", "",
      "    public Projeto[] Projetos =>", "    [", ...PROJ.map((p) => `        new(${q(p.nome)}, ${q(p.stack[0])}),`), "    ];", "",
      "    public static void Main()", "    {", "        var eu = new Aluisio();",
      T('        Console.WriteLine($"Olá! Eu sou o {eu.Nome}.");', '        Console.WriteLine($"Hi! I\'m {eu.Nome}.");'),
      T('        Console.WriteLine($"{eu.Projetos.Length} projetos na pasta, e contando.");', '        Console.WriteLine($"{eu.Projetos.Length} projects in the folder, and counting.");'),
      T('        Console.WriteLine("Me chama no MessagerTale! :)");', '        Console.WriteLine("Ping me on MessagerTale! :)");'), "    }", "}",
    ].join("\n");
    const readme = [`# ${P.nome}`, "", `> ${P.cargo}`, "", ...P.bio.flatMap((b) => [b, ""]), T("## Projetos", "## Projects"), ...PROJ.map((p) => `- [${p.nome}](projetos/${p.id}.md): ${p.resumo}`)].join("\n");
    const files = { "Aluisio.cs": cs, [LIVRO]: "", "README.md": readme };
    PROJ.forEach((p) => {
      files[`projetos/${p.id}.md`] = [`# ${p.nome}`, "", p.descricao, "", T("## Destaques", "## Highlights"), ...p.destaques.map((d) => `- ${d}`), "", "## Stack", p.stack.join(" · "), "", `${T("Repositório", "Repository")}: ${p.repo}`].join("\n");
    });
    return files;
  }

  // ---------- realce de sintaxe ----------
  const KW = {
    py: "False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield|print|input|range|len|int|str|float|list|dict|set|tuple",
    js: "const|let|var|function|return|if|else|for|while|do|of|in|new|class|extends|this|null|undefined|true|false|async|await|try|catch|finally|throw|typeof|instanceof|switch|case|break|continue|default|console",
    cs: "using|namespace|public|private|protected|internal|class|struct|static|void|int|long|double|float|decimal|string|bool|char|var|new|return|if|else|for|foreach|in|while|do|switch|case|break|continue|true|false|null|try|catch|finally|throw|readonly|const|override|virtual|async|await|Console|List|Dictionary|Math",
  };
  function realce(nome, txt) {
    const ext = extDe(nome);
    if (ext === "md") return esc(txt).replace(/^(#+ .*)$/gm, '<span class="k">$1</span>').replace(/^(&gt; .*)$/gm, '<span class="c">$1</span>').replace(/^(- )/gm, '<span class="t">$1</span>');
    if (!KW[ext]) return esc(txt);
    const com = ext === "py" ? "#[^\\n]*" : "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/";
    const str = ext === "py" ? `[fbru]{0,2}"""[\\s\\S]*?"""|[fbru]{0,2}'''[\\s\\S]*?'''|[fbru]{0,2}"(?:[^"\\\\\\n]|\\\\.)*"|[fbru]{0,2}'(?:[^'\\\\\\n]|\\\\.)*'`
      : ext === "js" ? "`(?:[^`\\\\]|\\\\.)*`|\"(?:[^\"\\\\\\n]|\\\\.)*\"|'(?:[^'\\\\\\n]|\\\\.)*'"
      : `\\$?@?"(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*'`;
    const re = new RegExp(`(${com})|(${str})|\\b(${KW[ext]})\\b|\\b(\\d+(?:\\.\\d+)?)\\b|\\b([A-Za-z_]\\w*)(?=\\s*\\()`, "g");
    let o = "", last = 0, m;
    while ((m = re.exec(txt))) {
      if (!m[0]) { re.lastIndex++; continue; }
      const cls = m[1] ? "c" : m[2] ? "s" : m[3] ? "k" : m[4] ? "n" : "f";
      o += esc(txt.slice(last, m.index)) + `<span class="${cls}">${esc(m[0])}</span>`; last = m.index + m[0].length;
    }
    return o + esc(txt.slice(last));
  }

  // ---------- execução ----------
  let worker = null;
  function novoWorker() { if (worker) worker.terminate(); worker = new Worker("js/peep-worker.js"); return worker; }

  // C# de verdade: compila no Wandbox (grátis e sem chave). Tenta primeiro o .NET 8; se o .NET do Wandbox
  // estiver quebrado (já aconteceu: o "dotnet new" estoura o limite de arquivo deles e não compila nada),
  // cai no Mono (C# 7). Se o navegador não alcançar o Wandbox, tenta pelo servidor do aluOS (rota /csharp).
  // Se nada responder, o C# de bolso assume.
  const WANDBOX = "https://wandbox.org/api/compile.json";
  const MOTORES = [{ id: "dotnetcore-8.0.402", nome: ".NET 8" }, { id: "mono-6.12.0.199", nome: "Mono · C# 7" }];
  let motorQuebrado = {}; // motores que falharam por problema do Wandbox nesta visita
  const linhasCS = (txt) => String(txt || "").split("\n").filter((l) => /error CS\d+/.test(l));
  const limparErro = (txt, arq) => [...new Set(String(txt || "").split("\n").filter((l) => l.trim() && !/^Compilation failed:/.test(l))
    .map((l) => l.replace(/^.*?prog\.cs/, arq).replace(/\s*\[[^\]]*\.csproj\]\s*$/, "")))].join("\n");
  // o Mono repete a exceção num bloco "[ERROR] FATAL…" e põe lixo tipo "[0x00011] in <hash>:0" na pilha
  const limparRun = (txt) => String(txt || "").split(/^\[ERROR\] FATAL UNHANDLED EXCEPTION/m)[0]
    .replace(/ \[0x[0-9a-f]+\] in <[0-9a-f]+>:0/g, "").replace(/^\n+/, "").replace(/\s+$/, "");
  async function csharpServidor(codigo, stdin, arq, aviso) {
    arq = arq || "Program.cs";
    const proprio = ALU.CONFIG && ALU.CONFIG.csharpApi, api = ALU.CONFIG && ALU.CONFIG.api;
    const urls = [proprio, WANDBOX, api && String(api).replace(/\/+$/, "") + "/csharp"].filter(Boolean);
    // devolve: resultado | "quebrado" (o Wandbox respondeu, mas o compilador deles falhou) | null (não alcançou)
    const tentar = async (url, motor) => {
      const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 30000);
      try {
        const r = await fetch(url, { method: "POST", signal: ctl.signal, headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ compiler: motor.id, code: codigo, stdin: stdin || "", save: false }) });
        if (!r.ok) return null;
        const w = await r.json();
        if (!w || w.status === undefined) return null;
        if (w.compiler && w.compiler !== motor.id) return null; // servidor antigo que ignora o compilador pedido
        const status = Number(w.status) || 0, textoComp = [w.compiler_error, w.compiler_output].join("\n");
        if (status && !w.program_output && !w.program_error) {
          // não rodou nada: ou é erro de compilação do aluno (error CSxxxx), ou é o Wandbox que quebrou,
          // ou o programa só saiu com código diferente de 0 (Environment.Exit) sem escrever nada
          if (linhasCS(textoComp).length) return { motor, compile: { code: 1, stderr: limparErro(linhasCS(textoComp).join("\n"), arq) }, run: { stdout: "", stderr: "", code: 1 } };
          const resto = String(w.compiler_error || "").split("\n").filter((l) => l.trim() && !/warning CS\d+|^Compilation succeeded/.test(l));
          if (resto.length || w.signal) return { quebrado: true, motivo: limparErro(resto.join("\n") || w.signal, arq) };
        }
        return { motor, compile: { code: 0 }, run: { stdout: w.program_output || "", stderr: limparRun(w.program_error), code: status } };
      } catch { return null; } finally { clearTimeout(t); }
    };
    let ultimaFalha = "";
    for (const motor of MOTORES) {
      if (motorQuebrado[motor.id]) continue;
      let alcancou = false;
      for (const url of urls) {
        const r = await tentar(url, motor);
        if (!r) continue;               // não alcançou: tenta a próxima rota
        alcancou = true;
        if (r.quebrado) {               // alcançou, mas o compilador do Wandbox está com defeito: troca de motor
          motorQuebrado[motor.id] = true; ultimaFalha = r.motivo;
          const prox = MOTORES[MOTORES.indexOf(motor) + 1];
          if (prox && aviso) aviso(T(`O ${motor.nome} do Wandbox está com defeito agora. Tentando com ${prox.nome}…\n`, `Wandbox's ${motor.nome} is broken right now. Trying ${prox.nome}…\n`));
          break;
        }
        return r;
      }
      if (!alcancou) return null;       // nenhuma rota respondeu: é rede, não compilador. O C# de bolso assume.
    }
    // todos os motores quebrados: mostra o que o Wandbox disse em vez de falhar calado
    if (ultimaFalha) { motorQuebrado = {}; return { motor: { nome: "Wandbox" }, compile: { code: 1, stderr: T("O Wandbox não conseguiu compilar (problema do lado deles):\n", "Wandbox couldn't compile (a problem on their side):\n") + ultimaFalha }, run: { stdout: "", stderr: "", code: 1 } }; }
    return null;
  }

  ALU.peep = function (el, ctx, inicial) {
    const RO = arquivosAluisio();
    let meus;
    try { meus = JSON.parse(localStorage.getItem(LS)); } catch {}
    if (!meus || typeof meus !== "object") meus = { ...EXEMPLOS };
    let livro = null;
    try { livro = localStorage.getItem(LS_LIVRO); } catch {}
    if (!livro) livro = MODELO_LIVRO();
    const salvar = () => { try { localStorage.setItem(LS, JSON.stringify(meus)); localStorage.setItem(LS_LIVRO, livro); } catch {} };
    const caminho = (n) => "meus-codigos/" + n;

    el.innerHTML = `
      <div class="peep">
        <div class="menubar"><span>Arquivo</span><span>Editar</span><span>Exibir</span><span>Projeto</span><span>Depurar</span><span>Ajuda</span>
          <button class="peep-commit" title="Commit e push do LivroDeVisitas.cs">⎇ Commit</button><button class="peep-stop" hidden>■ Parar</button><button class="peep-run">▶ Executar</button></div>
        <div class="peep-main">
          <aside class="peep-tree"></aside>
          <section class="peep-ed">
            <div class="peep-tabs"></div>
            <div class="peep-code"><pre class="ln"></pre><div class="ed"><pre class="src"></pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="${T("Editor de código", "Code editor")}"></textarea></div></div>
            <div class="peep-out">
              <div class="po-h"><span>SAÍDA</span><button class="po-limpar" title="Limpar saída">limpar</button></div>
              <div class="po-body"><pre class="po-txt"></pre><label class="po-in"><span>ENTRADA (stdin) · uma linha por input()</span><textarea spellcheck="false" placeholder="ex.: Ana"></textarea></label></div>
            </div>
          </section>
        </div>
        <div class="peep-modal" hidden><form class="pm-box"><b>⎇ Commit e push</b><small class="pm-quem"></small>
          <label>${T("Mensagem do commit", "Commit message")}<input class="pm-msg" maxlength="100"></label>
          <div class="pm-b"><button class="btn real">${T("Commit e push", "Commit & push")}</button><button type="button" class="btn sec pm-x">${T("Cancelar", "Cancel")}</button></div></form></div>
        <div class="peep-status"><span>${ALU.pix("peep")} Peep Studio</span><span class="ps-f"></span><span class="ps-l">UTF-8 · quack</span></div>
      </div>`;
    const $ = (s) => el.querySelector(s);
    const tree = $(".peep-tree"), tabs = $(".peep-tabs"), ln = $(".ln"), src = $(".src"), ta = $(".ed textarea"),
      out = $(".po-txt"), stdinEl = $(".po-in textarea"), psf = $(".ps-f"), btnRun = $(".peep-run"), btnStop = $(".peep-stop");
    const abertos = []; let atual = null, rodando = false, timerParar = null, runs = 0;

    // ---------- versão celular: arquivos numa gaveta, teclas de símbolos e saída que sobe ----------
    const MOBILE = !!(ctx && ctx.mobile), pe = $(".peep");
    if (MOBILE) {
      pe.classList.add("mob");
      $(".menubar").insertAdjacentHTML("afterbegin", `<button class="peep-arqs" type="button">☰ ${T("Arquivos", "Files")}</button>`);
      $(".peep-arqs").onclick = () => pe.classList.toggle("arv");
      $(".peep-main").insertAdjacentHTML("beforeend", `<button class="peep-veu" type="button" aria-label="${T("Fechar arquivos", "Close files")}"></button>`);
      $(".peep-veu").onclick = () => pe.classList.remove("arv");
      const TECLAS = [["⇥", "    "], ["{"], ["}"], ["("], [")"], ["["], ["]"], [";"], ['"'], ["="], ["<"], [">"], ["."], [","], [":"], ["_"], ["+"], ["-"], ["*"], ["/"], ["!"], ["&"], ["|"], ["↶", null]];
      $(".peep-code").insertAdjacentHTML("afterend", `<div class="peep-teclas">${TECLAS.map(([k], i) => `<button type="button" data-i="${i}">${esc(k)}</button>`).join("")}</div>`);
      $(".peep-teclas").querySelectorAll("button").forEach((b) => {
        b.addEventListener("pointerdown", (e) => e.preventDefault()); // mantém o teclado aberto
        b.onclick = () => {
          const [k, ins] = TECLAS[+b.dataset.i];
          if (!editavel(atual)) return;
          if (ins === null) { cm ? cm.undo() : document.execCommand("undo"); return; }
          const txt = ins || k;
          if (cm) { cm.replaceSelection(txt, "end"); cm.focus(); }
          else { ta.setRangeText(txt, ta.selectionStart, ta.selectionEnd, "end"); ta.dispatchEvent(new Event("input")); ta.focus(); }
        };
      });
      $(".po-h span").insertAdjacentHTML("beforeend", " ▴");
      $(".po-h span").onclick = () => pe.classList.toggle("saida");
      [".peep-run", ".peep-commit"].forEach((sel) => $(sel).addEventListener("click", () => pe.classList.add("saida")));
    }

    const conteudo = (id) => (id === LIVRO ? livro : id.startsWith("meus-codigos/") ? meus[id.slice(13)] : RO[id]);
    const editavel = (id) => id === LIVRO || id.startsWith("meus-codigos/");

    function pintarArvore() {
      const nomesRO = Object.keys(RO);
      const linha = (id, rotulo, extra = "") => {
        const ext = extDe(id), L = LINGUAS[ext];
        const ic = L ? `<i class="${L.cor}">${L.rot}</i>` : '<i class="md">M↓</i>';
        return `<div class="pt-row ${id === atual ? "on" : ""}"><button data-f="${esc(id)}" class="pt-f ${extra}">${ic}${esc(rotulo)}</button>${editavel(id) ? `<button class="pt-x" data-del="${esc(id)}" title="Apagar">✕</button>` : ""}</div>`;
      };
      tree.innerHTML = `
        <div class="pt-h">GERENCIADOR DE SOLUÇÕES</div>
        <div class="pt-root">${ALU.pix("peep")} aluisio <small>só leitura</small></div>
        ${nomesRO.filter((n) => !n.includes("/")).map((n) => linha(n, n)).join("")}
        <div class="pt-dir">▾ projetos</div>
        ${nomesRO.filter((n) => n.includes("/")).map((n) => linha(n, n.split("/")[1], "sub")).join("")}
        <div class="pt-root meus">📂 meus-codigos <button class="pt-novo" title="Novo arquivo">+ arquivo</button></div>
        <form class="pt-form" hidden>
          <input class="pt-nome" placeholder="nome" maxlength="40" aria-label="Nome do arquivo">
          <select class="pt-ext" aria-label="Linguagem">${Object.entries(LINGUAS).map(([e, L]) => `<option value="${e}">.${e} · ${L.nome}</option>`).join("")}</select>
          <div class="pt-form-b"><button class="btn">Criar</button><button type="button" class="btn sec pt-cancel">Cancelar</button></div>
          <small class="pt-erro"></small>
        </form>
        ${Object.keys(meus).sort().map((n) => linha(caminho(n), n)).join("") || '<p class="pt-vazio">Nenhum arquivo. Crie um!</p>'}`;
      tree.querySelectorAll(".pt-f").forEach((b) => (b.onclick = () => abrir(b.dataset.f)));
      tree.querySelectorAll(".pt-x").forEach((b) => (b.onclick = () => {
        if (b.dataset.certeza) {
          const n = b.dataset.del.slice(13); delete meus[n]; salvar();
          const i = abertos.indexOf(b.dataset.del); if (i >= 0) abertos.splice(i, 1);
          if (atual === b.dataset.del) atual = null;
          abrir(abertos[abertos.length - 1] || "Aluisio.cs");
        } else { b.dataset.certeza = "1"; b.textContent = "apagar?"; setTimeout(() => { if (b.isConnected) { delete b.dataset.certeza; b.textContent = "✕"; } }, 2500); }
      }));
      const form = tree.querySelector(".pt-form"), nome = tree.querySelector(".pt-nome"), erro = tree.querySelector(".pt-erro");
      tree.querySelector(".pt-novo").onclick = () => { form.hidden = false; nome.focus(); };
      tree.querySelector(".pt-cancel").onclick = () => { form.hidden = true; erro.textContent = ""; };
      form.onsubmit = (e) => {
        e.preventDefault();
        const n = nome.value.trim().replace(/\.(py|js|cs)$/i, ""), ext = tree.querySelector(".pt-ext").value;
        if (!/^[\w\-À-ú]{1,40}$/.test(n)) { erro.textContent = T("Use letras, números, - ou _ (sem espaços).", "Use letters, numbers, - or _ (no spaces)."); return; }
        const arq = `${n}.${ext}`;
        if (meus[arq] != null) { erro.textContent = T("Já existe um arquivo com esse nome.", "A file with that name already exists."); return; }
        meus[arq] = MODELOS[ext](n); salvar(); abrir(caminho(arq));
      };
    }

    // Editor: CodeMirror (mede o texto que está de fato na tela, então o clique cai sempre no lugar certo).
    // Se o CodeMirror não carregar (sem internet), volta para o editor simples de textarea.
    let cm = null;
    const MODOS = { py: "python", js: "javascript", cs: "text/x-csharp", md: "markdown" };
    function ligarCM() {
      if (cm || !window.CodeMirror || !el.isConnected) return;
      const caixa = $(".peep-code"); caixa.innerHTML = ""; caixa.classList.add("cm");
      cm = window.CodeMirror(caixa, {
        lineNumbers: true, indentUnit: 4, tabSize: 4, indentWithTabs: false, smartIndent: true, lineWrapping: MOBILE, theme: "peep",
        extraKeys: {
          "Ctrl-Enter": () => executar(), "Cmd-Enter": () => executar(),
          "Ctrl-S": () => salvarAtalho(), "Cmd-S": () => salvarAtalho(),
          Tab: (c) => (c.somethingSelected() ? c.indentSelection("add") : c.replaceSelection("    ", "end")),
        },
      });
      cm.on("change", (c, ch) => { if (ch.origin !== "setValue") editou(); });
      new ResizeObserver(() => cm.refresh()).observe(caixa);
      // a janela abre com animação de escala e a fonte pixel pode chegar depois: remede quando tudo assentar
      [250, 600].forEach((ms) => setTimeout(() => cm.refresh(), ms));
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => cm.refresh());
      el.addEventListener("pointerdown", () => { if (!cm.__ok) { cm.__ok = 1; cm.refresh(); } }, true);
      if (atual) abrir(atual);
    }
    // o CodeMirror (≈500 KB) só é baixado quando o Peep Studio abre pela primeira vez
    if (window.CodeMirror) setTimeout(ligarCM, 0);
    else if (!document.querySelector("script[data-cm]")) {
      const css = document.createElement("link"); css.rel = "stylesheet"; css.href = "js/vendor/codemirror/codemirror.css"; document.head.appendChild(css);
      const sc = document.createElement("script"); sc.src = "js/vendor/codemirror/codemirror.js"; sc.dataset.cm = "1"; sc.onload = ligarCM; document.head.appendChild(sc);
    } else document.querySelector("script[data-cm]").addEventListener("load", ligarCM);
    const valor = () => (cm ? cm.getValue() : ta.value);
    function salvarAtalho() { salvar(); psf.textContent = psf.textContent.replace(/ · salvo$/, "") + " · salvo"; }

    function pintarCodigo() {
      if (cm) return;
      const txt = ta.value;
      src.innerHTML = realce(atual, txt) + "\n ";
      ln.textContent = txt.split("\n").map((_, i) => i + 1).join("\n");
    }

    function abrir(id) {
      if (conteudo(id) == null) id = "Aluisio.cs";
      pe.classList.remove("arv");
      atual = id;
      if (!abertos.includes(id)) abertos.push(id);
      tabs.innerHTML = abertos.map((n) => `<button class="pt-tab ${n === id ? "on" : ""}" data-f="${esc(n)}">${esc(n.split("/").pop())}</button>`).join("");
      tabs.querySelectorAll("[data-f]").forEach((b) => (b.onclick = () => abrir(b.dataset.f)));
      if (cm) { cm.setOption("mode", MODOS[extDe(id)] || null); cm.setOption("readOnly", !editavel(id)); cm.setValue(conteudo(id)); cm.clearHistory(); setTimeout(() => cm.refresh(), 0); }
      else { ta.value = conteudo(id); ta.readOnly = !editavel(id); }
      pintarCodigo(); pintarArvore();
      const ext = extDe(id), L = LINGUAS[ext];
      psf.textContent = id + " · " + (L ? L.nome : ext === "md" ? "Markdown" : ext.toUpperCase()) + (editavel(id) ? "" : T(" · só leitura", " · read-only"));
      btnRun.disabled = !(L || id === "Aluisio.cs") || id === LIVRO || rodando;
      btnRun.title = btnRun.disabled ? "Nada para executar aqui" : "Executar (Ctrl+Enter)";
    }

    // ---------- edição ----------
    let tSalvar = null;
    let avisouNome = false;
    function editou() {
      if (!editavel(atual)) return;
      if (atual === LIVRO) {
        livro = valor();
        const n = ALU.lerLivro(livro).nome;
        if (n && !avisouNome) { avisouNome = true; ALU.zizi && ALU.zizi.guia && setTimeout(() => ALU.zizi.guia("nome", n), 900); }
      } else meus[atual.slice(13)] = valor();
      pintarCodigo();
      clearTimeout(tSalvar); tSalvar = setTimeout(salvar, 400);
    }
    ta.addEventListener("input", editou);
    ta.addEventListener("scroll", () => { ta.scrollTop = 0; ta.scrollLeft = 0; });
    ta.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); executar(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); salvarAtalho(); return; }
      if (ta.readOnly) return;
      const ini = ta.selectionStart, fim = ta.selectionEnd, v = ta.value;
      if (e.key === "Tab") {
        e.preventDefault();
        ta.setRangeText("    ", ini, fim, "end"); ta.dispatchEvent(new Event("input"));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const inicioLinha = v.lastIndexOf("\n", ini - 1) + 1, linhaAtual = v.slice(inicioLinha, ini);
        let ind = (linhaAtual.match(/^\s*/) || [""])[0];
        if (/[:{(\[]\s*$/.test(linhaAtual)) ind += "    ";
        ta.setRangeText("\n" + ind, ini, fim, "end"); ta.dispatchEvent(new Event("input"));
      }
    });

    // ---------- saída ----------
    const escrever = (t, tipo = "out") => { const s = document.createElement("span"); s.className = "po-" + tipo; s.textContent = t; out.appendChild(s); out.parentElement.scrollTop = out.parentElement.scrollHeight; out.scrollTop = out.scrollHeight; };
    $(".po-limpar").onclick = () => { out.textContent = ""; };

    function terminou(ok, ms, extra) {
      rodando = false; clearTimeout(timerParar);
      btnStop.hidden = true; btnRun.disabled = false;
      escrever(`\n${ok ? "✔" : "✖"} ${ok ? "terminou" : "parou com erro"} em ${ms} ms${extra ? " · " + extra : ""}\n`, "info");
    }
    function parar(motivo) {
      if (!rodando) return;
      if (worker) { worker.terminate(); worker = null; }
      rodando = false; clearTimeout(timerParar); btnStop.hidden = true; btnRun.disabled = false;
      escrever(`\n■ ${motivo}\n`, "erro");
    }
    btnStop.onclick = () => parar(T("Execução interrompida.", "Execution stopped."));

    async function executar() {
      if (rodando || btnRun.disabled) return;
      runs++;
      if (runs === 5) setTimeout(() => { escrever(T("\n⚠ Aviso PEEP0005: o pato evoluiu. 🦆 → 🦢\nEle agora revisa seus PRs.\n", "\n⚠ Warning PEEP0005: the duck evolved. 🦆 → 🦢\nIt now reviews your PRs.\n"), "aviso"); ALU.conquista && ALU.conquista("pato-evoluiu", "O pato evoluiu", "Executou o código 5 vezes no Peep Studio."); }, 700);
      out.textContent = "";
      if (atual === "Aluisio.cs") {
        escrever(T("Compilando Aluisio.cs…\n", "Compiling Aluisio.cs…\n"), "info");
        setTimeout(() => escrever(T(`Compilação concluída: 0 erro(s), 0 aviso(s), 1 pato.\n\nOlá! Eu sou o ${P.nome}.\n${PROJ.length} projetos na pasta, e contando.\nMe chama no MessagerTale! :)\n`, `Build succeeded: 0 error(s), 0 warning(s), 1 duck.\n\nHi! I\'m ${P.nome}.\n${PROJ.length} projects in the folder, and counting.\nPing me on MessagerTale! :)\n`)), 600);
        return;
      }
      const ext = extDe(atual), codigo = valor(), stdin = stdinEl.value;
      if (!LINGUAS[ext]) return;
      rodando = true; btnRun.disabled = true; btnStop.hidden = false;
      escrever(`▶ ${atual.split("/").pop()} · ${LINGUAS[ext].nome}\n`, "info");

      if (ext === "cs") {
        escrever(T("Compilando C# no Wandbox… (a primeira vez demora uns segundos)\n", "Compiling C# on Wandbox… (the first run takes a few seconds)\n"), "info");
        const t0 = performance.now(), r = await csharpServidor(codigo, stdin, atual.split("/").pop(), (m) => rodando && escrever(m, "aviso"));
        if (!rodando) return;
        if (r) {
          const rotulo = "C# real (" + r.motor.nome + ")";
          if (r.compile && r.compile.code) {
            let msg = r.compile.stderr || r.compile.output || T("Erro de compilação sem mensagem.", "Compile error with no message.");
            if (r.motor.id && r.motor.id.startsWith("mono") && /CS1525|CS1519|CS1002|CS8025/.test(msg)) msg += T("\n\n(dica: o Mono só entende até C# 7. Sem records, switch expression, top-level statements ou new() sem tipo.)", "\n\n(tip: Mono only understands up to C# 7. No records, switch expressions, top-level statements or target-typed new().)");
            escrever(msg + "\n", "erro"); return terminou(false, Math.round(performance.now() - t0), rotulo);
          }
          if (r.run.stdout) escrever(r.run.stdout);
          if (r.run.stderr) escrever((r.run.stdout && !r.run.stdout.endsWith("\n") ? "\n" : "") + r.run.stderr + "\n", "erro");
          else if (r.run.code) escrever(T(`O programa saiu com código ${r.run.code}.\n`, `The program exited with code ${r.run.code}.\n`), "erro");
          return terminou(!r.run.code, Math.round(performance.now() - t0), rotulo);
        }
        escrever(T("Servidor indisponível. Usando o C# de bolso (tradução para JS, só o básico).\n\n", "Server unavailable. Using pocket C# (translated to JS, basics only).\n\n"), "aviso");
      }

      const w = worker || novoWorker();
      const iniciarTimer = () => { clearTimeout(timerParar); timerParar = setTimeout(() => parar(T("Tempo esgotado (10 s). Tem um loop infinito aí?", "Time's up (10 s). Is there an infinite loop in there?")), 10000); };
      if (ext !== "py") iniciarTimer();
      let jaCarregou = false;
      w.onmessage = (e) => {
        const d = e.data;
        if (d.tipo === "fim") return terminou(d.ok, d.ms, ext === "cs" ? "C# de bolso" : "");
        if (d.tipo === "iniciou") { jaCarregou = true; iniciarTimer(); return; }
        escrever(d.t, d.tipo);
      };
      w.onerror = (e) => { escrever((e.message || "Erro ao iniciar o executor.") + "\n", "erro"); worker = null; terminou(false, 0); };
      if (ext === "py") setTimeout(() => { if (rodando && !jaCarregou) { jaCarregou = true; iniciarTimer(); } }, 15000);
      w.postMessage({ lang: ext, codigo, stdin, arquivo: atual.split("/").pop() });
    }
    btnRun.onclick = executar;

    // ---------- commit do livro de visitas ----------
    const modal = $(".peep-modal"), pmMsg = $(".pm-msg");
    $(".peep-commit").onclick = () => {
      if (atual !== LIVRO) { abrir(LIVRO); escrever(T("Só o LivroDeVisitas.cs vai para o repositório do Aluísio. Abri ele pra você. ✍️\n", "Only LivroDeVisitas.cs goes to Aluísio's repository. I opened it for you. ✍️\n"), "info"); ALU.zizi && ALU.zizi.guia && ALU.zizi.guia("abrir"); return; }
      const d = ALU.lerLivro(livro);
      if (!d.nome) { out.textContent = ""; escrever(T("✖ Nada para commitar: o campo Nome está vazio.\n  Escreva seu nome entre as aspas em Nome = \"\" e tente de novo.\n", "✖ Nothing to commit: the Nome field is empty.\n  Type your name between the quotes in Nome = \"\" and try again.\n"), "erro"); ALU.zizi && ALU.zizi.guia && ALU.zizi.guia("vazio"); return; }
      $(".pm-quem").textContent = T(`Assinando como ${d.nome}`, `Signing as ${d.nome}`) + (d.contato ? ` · ${d.contato}` : "");
      pmMsg.value = T(`assina o livro de visitas: ${d.nome}`, `signs the guestbook: ${d.nome}`).slice(0, 100);
      modal.hidden = false; pmMsg.focus(); pmMsg.select();
    };
    $(".pm-x").onclick = () => { modal.hidden = true; };
    $(".pm-box").onsubmit = async (e) => {
      e.preventDefault(); modal.hidden = true; salvar();
      const d = ALU.lerLivro(livro), msgC = pmMsg.value.trim() || "assina o livro de visitas";
      const hash = Math.random().toString(16).slice(2, 9), linhas = livro.split("\n").filter((l) => /=\s*"[^"]+"/.test(l)).length;
      out.textContent = "";
      const passos = [
        ["$ git add LivroDeVisitas.cs\n", "info"], [`$ git commit -m "${msgC}"\n`, "info"],
        [`[main ${hash}] ${msgC}\n 1 file changed, ${linhas} insertion${linhas === 1 ? "" : "s"}(+)\n`, "out"],
        ["$ git push origin main\n", "info"], [T("Enviando para aluisiodev/livro-de-visitas…\n", "Pushing to aluisiodev/livro-de-visitas…\n"), "out"],
      ];
      passos.forEach(([t, k], i) => setTimeout(() => escrever(t, k), i * 350));
      const ok = ALU.api ? await ALU.api.assinar({ ...d, commit: msgC }) : false;
      setTimeout(() => {
        escrever(ok ? T(`✔ push concluído. O Aluísio vai ver que ${d.nome} passou por aqui. Valeu! 💙\n`, `✔ push done. Aluísio will see that ${d.nome} stopped by. Thanks! 💙\n`)
          : T(`✔ commit salvo neste navegador. (O envio para o Aluísio liga quando o servidor do aluOS estiver no ar.)\n`, `✔ commit saved in this browser. (Sending to Aluísio turns on once the aluOS server is live.)\n`), ok ? "info" : "aviso");
        ALU.conquista && ALU.conquista("commit", T("Primeiro commit", "First commit"), T("Assinou o livro de visitas pelo Peep Studio.", "Signed the guestbook in Peep Studio."));
        ALU.zizi && ALU.zizi.guia && ALU.zizi.guia("commitou", d.nome);
      }, passos.length * 350 + 200);
    };

    const obs = new MutationObserver(() => { if (!el.isConnected) { obs.disconnect(); salvar(); if (rodando && worker) { worker.terminate(); worker = null; } } });
    obs.observe(document.body, { childList: true, subtree: true });

    abrir(inicial || "Aluisio.cs");
    return { ir: abrir };
  };
})();
