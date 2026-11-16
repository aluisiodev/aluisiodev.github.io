// Terminal interativo do aluOS.
(function () {
  const esc = (s) => window.ALU.esc(s);
  window.ALU.terminal = function (el, ctx) {
    const P = window.PERFIL, PROJ = window.PROJETOS;
    el.innerHTML = `<div class="term" tabindex="-1"><div class="term-out"></div>
      <div class="term-line"><span class="ps1">visitante@aluos:~$</span><input class="term-in" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Comando"></div></div>`;
    const out = el.querySelector(".term-out"), inp = el.querySelector(".term-in"), box = el.querySelector(".term");
    const hist = []; let hi = 0;
    const print = (html, cls = "") => { const d = document.createElement("div"); d.className = "tl " + cls; d.innerHTML = html; out.appendChild(d); box.scrollTop = box.scrollHeight; };

    const CMDS = {
      ajuda: () => print(
        [["sobre", "quem sou eu"], ["projetos", "lista os projetos"], ["abrir &lt;projeto&gt;", "abre um projeto (ex.: abrir nexo)"], ["skills", "skills e certificações"], ["abrir kez | peep | quarto", "abre um app"],
         ["contato", "onde me encontrar"], ["neofetch", "informações do sistema"], ["tema &lt;1-5&gt;", "troca o papel de parede"], ["limpar", "limpa a tela"], ["sair", "fecha o terminal"]]
          .map(([c, d]) => `<span class="k">${c}</span> <span class="muted">— ${d}</span>`).join("<br>")),
      sobre: () => print(P.bio.map(esc).join("<br><br>")),
      whoami: () => print("visitante (mas pode ficar à vontade)"),
      projetos: () => print(PROJ.map((p) => `<span class="k">${p.id.padEnd(13, " ")}</span>${esc(p.resumo)}`).join("<br>"), "pre"),
      ls: () => CMDS.projetos(),
      abrir: (a) => {
        const p = PROJ.find((x) => a && (x.id.startsWith(a.toLowerCase()) || x.nome.toLowerCase().includes(a.toLowerCase())));
        if (p) { print(`abrindo <span class="k">${esc(p.nome)}</span>…`); ctx.abrir("proj:" + p.id); }
        else if (window.ALU.APPS[a]) { print(`abrindo ${esc(a)}…`); ctx.abrir(a); }
        else print(`projeto não encontrado: ${esc(a || "")}. Tente <span class="k">projetos</span>.`, "err");
      },
      stack: () => print([...window.SKILLS.map((s) => s.nome), ...window.CERTIFICADOS.map((c) => c.emissor)].map((s) => `<span class="chip">${esc(s)}</span>`).join(" ")),
      skills: () => CMDS.stack(),
      contato: () => print(Object.entries(P.contatos).map(([k, v]) => `<span class="k">${k.padEnd(9, " ")}</span>${v ? `<a href="${esc(v.includes("@") && !v.startsWith("http") ? "mailto:" + v : v)}" target="_blank" rel="noopener">${esc(v)}</a>` : '<span class="muted">em breve</span>'}`).join("<br>"), "pre"),
      neofetch: () => print(
`<span class="logo">   ▄▀▀▀▄
  █ ◆ ◆ █
  █  ▀  █
   ▀▄▄▄▀</span>
<span class="k">visitante@aluos</span>
SO ........ aluOS 1.0
Kernel .... HTML + CSS + JS
Shell ..... alush
Projetos .. ${PROJ.length}
Uptime .... ${Math.round(performance.now() / 1000)}s
Autor ..... ${esc(P.nome)}`, "pre"),
      tema: (a) => { const n = parseInt(a, 10); if (n >= 1 && n <= window.ALU.WALLPAPERS.length) { window.ALU.setWall(n - 1); print(`papel de parede: ${esc(window.ALU.WALLPAPERS[n - 1].nome)}`); } else print(`use: tema 1 a ${window.ALU.WALLPAPERS.length}`, "err"); },
      data: () => print(new Date().toLocaleString("pt-BR")),
      date: () => CMDS.data(),
      echo: (...a) => print(esc(a.join(" "))),
      sudo: () => print("visitante não está no arquivo sudoers. Este incidente será reportado. 🙂", "err"),
      rm: () => print("calma! nada de apagar o portfolio.", "err"),
      cafe: () => print("☕ preparando… pronto. Agora sim dá pra codar."),
      limpar: () => { out.innerHTML = ""; },
      clear: () => CMDS.limpar(),
      sair: () => ctx.fechar && ctx.fechar(),
      exit: () => CMDS.sair(),
      help: () => CMDS.ajuda(),
    };

    function run(line) {
      print(`<span class="ps1">visitante@aluos:~$</span> ${esc(line)}`);
      const [cmd, ...args] = line.trim().split(/\s+/);
      if (!cmd) return;
      const f = CMDS[cmd.toLowerCase()];
      if (f) f(...args); else print(`comando não encontrado: ${esc(cmd)}. Digite <span class="k">ajuda</span>.`, "err");
    }

    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { const v = inp.value; if (v.trim()) hist.push(v); hi = hist.length; inp.value = ""; run(v); }
      else if (e.key === "ArrowUp") { if (hi > 0) inp.value = hist[--hi]; e.preventDefault(); }
      else if (e.key === "ArrowDown") { hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ""; e.preventDefault(); }
      else if (e.key === "Tab") {
        e.preventDefault();
        const parts = inp.value.split(" ");
        const pool = parts.length > 1 ? PROJ.map((p) => p.id) : Object.keys(CMDS);
        const m = pool.filter((c) => c.startsWith(parts[parts.length - 1]));
        if (m.length === 1) { parts[parts.length - 1] = m[0]; inp.value = parts.join(" ") + (parts.length === 1 ? " " : ""); }
        else if (m.length > 1) print(m.join("  "), "muted");
      }
    });
    box.addEventListener("click", () => { if (!getSelection().toString()) inp.focus({ preventScroll: true }); });

    print(`aluOS 1.0 — terminal <span class="muted">(alush)</span>`);
    print(`Digite <span class="k">ajuda</span> para ver os comandos. Sugestão: <span class="k">neofetch</span>`);
    if (!ctx.mobile) setTimeout(() => inp.focus({ preventScroll: true }), 50);
  };
})();
