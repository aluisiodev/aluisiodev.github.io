// Peep Studio: a IDE do patinho roxo. Mostra o "código-fonte" do Aluísio.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s);
  const P = window.PERFIL, PROJ = window.PROJETOS;
  const q = (s) => `"${s.replace(/"/g, '\\"')}"`;

  function arquivos() {
    const cs = [
      "using Savana.Dev;",
      "",
      "namespace Portfolio;",
      "",
      "// O arquivo mais importante deste computador.",
      "public class Aluisio : Desenvolvedor",
      "{",
      `    public string Nome => ${q(P.nome)};`,
      `    public string Cargo => ${q(P.cargo)};`,
      `    public string Local => ${q(P.local)};`,
      "",
      "    public string[] Skills =>",
      `        [${window.SKILLS.map((s) => q(s.nome)).join(", ")}];`,
      "",
      "    public string[] Certificacoes =>",
      "    [",
      ...window.CERTIFICADOS.map((c) => `        ${q(c.nome)},`),
      "    ];",
      "",
      "    public Projeto[] Projetos =>",
      "    [",
      ...PROJ.map((p) => `        new(${q(p.nome)}, ${q(p.stack[0])}),`),
      "    ];",
      "",
      "    public static void Main()",
      "    {",
      "        var eu = new Aluisio();",
      '        Console.WriteLine($"Olá! Eu sou o {eu.Nome}.");',
      '        Console.WriteLine($"{eu.Projetos.Length} projetos na pasta, e contando.");',
      '        Console.WriteLine("Me chama no MessagerTale! :)");',
      "    }",
      "}",
    ].join("\n");
    const readme = [
      `# ${P.nome}`, "", `> ${P.cargo}`, "", ...P.bio.flatMap((b) => [b, ""]),
      "## Projetos", ...PROJ.map((p) => `- [${p.nome}](projetos/${p.id}.md): ${p.resumo}`),
    ].join("\n");
    const files = { "Aluisio.cs": cs, "README.md": readme };
    PROJ.forEach((p) => {
      files[`projetos/${p.id}.md`] = [`# ${p.nome}`, "", p.descricao, "", "## Destaques", ...p.destaques.map((d) => `- ${d}`), "", "## Stack", p.stack.join(" · "), "", `Repositório: ${p.repo}`].join("\n");
    });
    return files;
  }

  function realce(nome, txt) {
    let h = esc(txt);
    if (nome.endsWith(".cs")) {
      const re = /(\/\/.*$)|(\$?"(?:[^"\\]|\\.)*")|\b(using|namespace|public|class|string|var|new|static|void|return)\b|\b(Aluisio|Desenvolvedor|Projeto|Console)\b/gm;
      let o = "", last = 0;
      txt.replace(re, (m, c, s, k, t, off) => { o += esc(txt.slice(last, off)) + `<span class="${c ? "c" : s ? "s" : k ? "k" : "t"}">${esc(m)}</span>`; last = off + m.length; return m; });
      h = o + esc(txt.slice(last));
    } else {
      h = h.replace(/^(#+ .*)$/gm, '<span class="k">$1</span>').replace(/^(&gt; .*)$/gm, '<span class="c">$1</span>').replace(/^(- )/gm, '<span class="t">$1</span>');
    }
    return h;
  }

  ALU.peep = function (el, ctx, inicial) {
    const F = arquivos();
    const nomes = Object.keys(F);
    el.innerHTML = `
      <div class="peep">
        <div class="menubar"><span>Arquivo</span><span>Editar</span><span>Exibir</span><span>Projeto</span><span>Depurar</span><span>Ajuda</span>
          <button class="peep-run">▶ Executar</button></div>
        <div class="peep-main">
          <aside class="peep-tree">
            <div class="pt-h">GERENCIADOR DE SOLUÇÕES</div>
            <div class="pt-root">${ALU.pix("peep")} aluisio</div>
            ${nomes.filter((n) => !n.includes("/")).map((n) => `<button data-f="${n}" class="pt-f">${n.endsWith(".cs") ? '<i class="cs">C#</i>' : '<i class="md">M↓</i>'}${n}</button>`).join("")}
            <div class="pt-dir">▾ projetos</div>
            ${nomes.filter((n) => n.includes("/")).map((n) => `<button data-f="${n}" class="pt-f sub"><i class="md">M↓</i>${n.split("/")[1]}</button>`).join("")}
          </aside>
          <section class="peep-ed">
            <div class="peep-tabs"></div>
            <div class="peep-code"><pre class="ln"></pre><pre class="src"></pre></div>
            <div class="peep-out"><div class="po-h">SAÍDA</div><pre></pre></div>
          </section>
        </div>
        <div class="peep-status"><span>${ALU.pix("peep")} Peep Studio</span><span class="ps-f"></span><span>UTF-8 · quack</span></div>
      </div>`;
    const tabs = el.querySelector(".peep-tabs"), ln = el.querySelector(".ln"), src = el.querySelector(".src"), out = el.querySelector(".peep-out pre"), psf = el.querySelector(".ps-f");
    const abertos = [];
    function abrir(nome) {
      if (!F[nome]) nome = "Aluisio.cs";
      if (!abertos.includes(nome)) abertos.push(nome);
      tabs.innerHTML = abertos.map((n) => `<button class="pt-tab ${n === nome ? "on" : ""}" data-f="${n}">${n.split("/").pop()}</button>`).join("");
      tabs.querySelectorAll("[data-f]").forEach((b) => (b.onclick = () => abrir(b.dataset.f)));
      el.querySelectorAll(".pt-f").forEach((b) => b.classList.toggle("on", b.dataset.f === nome));
      const txt = F[nome];
      src.innerHTML = realce(nome, txt);
      ln.textContent = txt.split("\n").map((_, i) => i + 1).join("\n");
      psf.textContent = nome + (nome.endsWith(".cs") ? " · C#" : " · Markdown");
    }
    el.querySelectorAll(".pt-f").forEach((b) => (b.onclick = () => abrir(b.dataset.f)));
    el.querySelector(".peep-run").onclick = () => {
      out.textContent = "Compilando Aluisio.cs…";
      setTimeout(() => {
        out.textContent += `\nCompilação concluída: 0 erro(s), 0 aviso(s), 1 pato.\n\nOlá! Eu sou o ${P.nome}.\n${PROJ.length} projetos na pasta, e contando.\nMe chama no MessagerTale! :)`;
      }, 600);
    };
    abrir(inicial || "Aluisio.cs");
    return { ir: abrir };
  };
})();
