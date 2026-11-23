// Terminal interativo do aluOS.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s);
  const EN = ALU.lang === "en", T = (pt, en) => (EN ? en : pt);
  const EU = EN ? "visitor@aluos:~$" : "visitante@aluos:~$";
  window.ALU.terminal = function (el, ctx) {
    const P = window.PERFIL, PROJ = window.PROJETOS;
    el.innerHTML = `<div class="term" tabindex="-1"><div class="term-out"></div>
      <div class="term-line"><span class="ps1">${EU}</span><input class="term-in" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="${T("Comando", "Command")}"></div></div>`;
    const out = el.querySelector(".term-out"), inp = el.querySelector(".term-in"), box = el.querySelector(".term");
    const hist = []; let hi = 0;
    const print = (html, cls = "") => { const d = document.createElement("div"); d.className = "tl " + cls; d.innerHTML = html; out.appendChild(d); box.scrollTop = box.scrollHeight; };

    const CMDS = {
      ajuda: () => print(
        (EN ? [["about", "who I am"], ["projects", "list the projects"], ["open &lt;project&gt;", "open a project (e.g. open deskmate)"], ["skills", "skills and courses"], ["open kez | peep | quarto", "open an app"],
         ["contact", "where to find me"], ["neofetch", "system info"], ["theme &lt;1-5&gt;", "change the wallpaper"], ["clear", "clear the screen"], ["achievements", "what you've found so far"], ["exit", "close the terminal"]]
        : [["sobre", "quem sou eu"], ["projetos", "lista os projetos"], ["abrir &lt;projeto&gt;", "abre um projeto (ex.: abrir deskmate)"], ["skills", "skills e cursos"], ["abrir kez | peep | quarto", "abre um app"],
         ["contato", "onde me encontrar"], ["neofetch", "informações do sistema"], ["tema &lt;1-5&gt;", "troca o papel de parede"], ["limpar", "limpa a tela"], ["conquistas", "o que você já achou"], ["sair", "fecha o terminal"]])
          .map(([c, d]) => `<span class="k">${c}</span> <span class="muted">— ${d}</span>`).join("<br>")),
      sobre: () => print(P.bio.map(esc).join("<br><br>")),
      whoami: () => print(T("visitante (mas pode ficar à vontade)", "visitor (but make yourself at home)")),
      projetos: () => print(PROJ.map((p) => `<span class="k">${p.id.padEnd(13, " ")}</span>${esc(p.resumo)}`).join("<br>"), "pre"),
      ls: () => CMDS.projetos(),
      abrir: (a) => {
        const p = PROJ.find((x) => a && (x.id.startsWith(a.toLowerCase()) || x.nome.toLowerCase().includes(a.toLowerCase())));
        if (p) { print(`${T("abrindo", "opening")} <span class="k">${esc(p.nome)}</span>…`); ctx.abrir("proj:" + p.id); }
        else if (window.ALU.APPS[a]) { print(`${T("abrindo", "opening")} ${esc(a)}…`); ctx.abrir(a); }
        else print(T(`projeto não encontrado: ${esc(a || "")}. Tente <span class="k">projetos</span>.`, `project not found: ${esc(a || "")}. Try <span class="k">projects</span>.`), "err");
      },
      stack: () => print([...window.SKILLS.map((s) => s.nome), ...window.CERTIFICADOS.map((c) => c.curto || c.emissor)].map((s) => `<span class="chip">${esc(s)}</span>`).join(" ")),
      skills: () => CMDS.stack(),
      contato: () => print(Object.entries(P.contatos).map(([k, v]) => `<span class="k">${k.padEnd(9, " ")}</span>${v ? `<a href="${esc(v.includes("@") && !v.startsWith("http") ? "mailto:" + v : v)}" target="_blank" rel="noopener">${esc(v)}</a>` : `<span class="muted">${T("em breve", "coming soon")}</span>`}`).join("<br>"), "pre"),
      neofetch: () => print(
`<span class="logo">   ▄▀▀▀▄
  █ ◆ ◆ █
  █  ▀  █
   ▀▄▄▄▀</span>
<span class="k">${EU.replace(":~$", "")}</span>
${T("SO ........", "OS ........")} aluOS 1.0
Kernel .... HTML + CSS + JS
Shell ..... alush
${T("Projetos ..", "Projects ..")} ${PROJ.length}
Uptime .... ${Math.round(performance.now() / 1000)}s
${T("Autor .....", "Author ....")} ${esc(P.nome)}`, "pre"),
      tema: (a) => { const n = parseInt(a, 10); if (n >= 1 && n <= window.ALU.WALLPAPERS.length) { window.ALU.setWall(n - 1); print(`${T("papel de parede", "wallpaper")}: ${esc(window.ALU.WALLPAPERS[n - 1].nome)}`); } else print(T(`use: tema 1 a ${window.ALU.WALLPAPERS.length}`, `usage: theme 1 to ${window.ALU.WALLPAPERS.length}`), "err"); },
      data: () => print(new Date().toLocaleString(T("pt-BR", "en-US"))),
      date: () => CMDS.data(),
      echo: (...a) => print(esc(a.join(" "))),
      sudo: () => print(T("visitante não está no arquivo sudoers. Este incidente será reportado. 🙂", "visitor is not in the sudoers file. This incident will be reported. 🙂"), "err"),
      rm: () => print(T("calma! nada de apagar o portfolio.", "easy there! no deleting the portfolio."), "err"),
      cafe: () => print(T("☕ preparando… pronto. Agora sim dá pra codar.", "☕ brewing… done. Now we can code.")),
      limpar: () => { out.innerHTML = ""; },
      clear: () => CMDS.limpar(),
      sair: () => ctx.fechar && ctx.fechar(),
      exit: () => CMDS.sair(),
      help: () => CMDS.ajuda(),
      quack: () => { print("🦆 quack."); ALU.conquista && ALU.conquista("terminal", T("Hacker de verdade", "Real hacker"), T("Achou um comando secreto no terminal.", "Found a secret terminal command.")); },
      hack: () => { const l = EN ? ["accessing the savanna mainframe…", "bypassing the duck firewall…", "downloading more RAM…", "done. you are now admin of nothing. 😎"] : ["acessando mainframe da savana…", "burlando o firewall do pato…", "baixando mais RAM…", "pronto. você agora é admin de nada. 😎"]; l.forEach((t, i) => setTimeout(() => print(t, i === 3 ? "" : "muted"), i * 450)); ALU.conquista && ALU.conquista("terminal", T("Hacker de verdade", "Real hacker"), T("Achou um comando secreto no terminal.", "Found a secret terminal command.")); },
      matrix: () => CMDS.hack(),
      girafa: () => print(`<span class="logo">   ▟▙
   ▐▌   ${T("oi.", "hi.")}
   ▐▌
  ▟██▙▄▄
  ▐▌▐▌▐▌</span>`, "pre"),
      conquistas: () => { const F = ALU.conquistasFeitas ? ALU.conquistasFeitas() : {}, C = ALU.CONQUISTAS || []; print(`${Object.keys(F).length}/${C.length} ${T("conquistas", "achievements")}<br>` + C.map(([id, n]) => F[id] ? `<span class="k">[x] ${esc(n)}</span>` : `<span class="muted">[ ] ???</span>`).join("<br>")); },
      desligar: () => ALU.desligar && ALU.desligar(),
      zizi: () => { if (ALU.zizi) { ALU.zizi.mostrar(); print(T("⚔️ Zizi voltou pra área de trabalho.", "⚔️ Zizi is back on the desktop.")); } else print(T("Zizi está em outro computador.", "Zizi is on another computer."), "err"); },
    };
    // nomes em inglês dos comandos (funcionam nas duas línguas)
    Object.assign(CMDS, { about: CMDS.sobre, projects: CMDS.projetos, open: CMDS.abrir, contact: CMDS.contato, theme: CMDS.tema, achievements: CMDS.conquistas, coffee: CMDS.cafe, shutdown: CMDS.desligar, cat: (a) => (/sobre|about/.test(a || "") ? CMDS.sobre() : print(T(`cat: ${esc(a || "")}: arquivo não encontrado`, `cat: ${esc(a || "")}: no such file`), "err")) });

    function run(line) {
      print(`<span class="ps1">${EU}</span> ${esc(line)}`);
      const [cmd, ...args] = line.trim().split(/\s+/);
      if (!cmd) return;
      const f = CMDS[cmd.toLowerCase()];
      if (f) f(...args); else print(T(`comando não encontrado: ${esc(cmd)}. Digite <span class="k">ajuda</span>.`, `command not found: ${esc(cmd)}. Type <span class="k">help</span>.`), "err");
    }

    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { const v = inp.value; if (v.trim()) hist.push(v); hi = hist.length; inp.value = ""; run(v); }
      else if (e.key === "ArrowUp") { if (hi > 0) inp.value = hist[--hi]; e.preventDefault(); }
      else if (e.key === "ArrowDown") { hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ""; e.preventDefault(); }
      else if (e.key === "Tab") {
        e.preventDefault();
        const parts = inp.value.split(" ");
        const pool = parts.length > 1 ? PROJ.map((p) => p.id) : Object.keys(CMDS).filter((c) => !["quack", "hack", "matrix", "girafa", "zizi", ...(EN ? ["sobre", "projetos", "abrir", "contato", "tema", "conquistas", "cafe", "desligar", "ajuda", "limpar", "sair", "data"] : ["about", "projects", "open", "contact", "theme", "achievements", "coffee", "shutdown", "help", "clear", "exit", "date"])].includes(c));
        const m = pool.filter((c) => c.startsWith(parts[parts.length - 1]));
        if (m.length === 1) { parts[parts.length - 1] = m[0]; inp.value = parts.join(" ") + (parts.length === 1 ? " " : ""); }
        else if (m.length > 1) print(m.join("  "), "muted");
      }
    });
    box.addEventListener("click", () => { if (!getSelection().toString()) inp.focus({ preventScroll: true }); });

    print(`aluOS 1.0 — terminal <span class="muted">(alush)</span>`);
    print(T(`Digite <span class="k">ajuda</span> para ver os comandos. Sugestão: <span class="k">neofetch</span>`, `Type <span class="k">help</span> to see the commands. Try: <span class="k">neofetch</span>`));
    if (!ctx.mobile) setTimeout(() => inp.focus({ preventScroll: true }), 50);
  };
})();
