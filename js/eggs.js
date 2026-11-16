// Easter eggs e conquistas do aluOS. Shhh.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s);

  // ---------- conquistas ----------
  ALU.CONQUISTAS = [
    ["konami", "Código secreto"], ["quack", "Fala pato"], ["savana", "Rei da savana"], ["relogio", "Turno da noite"],
    ["lixeira", "Revirando o lixo"], ["terminal", "Hacker de verdade"], ["404", "Perdido na savana"], ["segredo", "Página secreta"],
    ["like10", "Fã número 1"], ["inscrito", "Inscrito na savana"], ["pato10h", "ASMR aquático"], ["spam", "Quase caiu"],
    ["freddy", "Turno da noite II"], ["cobra15", "Cobra criada"], ["velha", "Mais esperto que o pato"], ["pato100", "Criador de patos"],
    ["memoria", "Memória de elefante"], ["pato-evoluiu", "O pato evoluiu"], ["nudge", "Chamando atenção"], ["luminaria", "Iluminado"],
    ["turista", "Turista do quarto"], ["desligar", "Pode desligar"],
  ];
  const ler = () => { try { return JSON.parse(localStorage.getItem("alu.conquistas")) || {}; } catch { return {}; } };
  const salvar = (o) => { try { localStorage.setItem("alu.conquistas", JSON.stringify(o)); } catch {} };
  let feitas = ler();
  ALU.conquistasFeitas = () => feitas;

  ALU.conquista = function (id, titulo, desc) {
    if (feitas[id]) return;
    feitas[id] = Date.now(); salvar(feitas);
    const t = document.createElement("div");
    t.className = "conq";
    const n = Object.keys(feitas).length;
    t.innerHTML = `<div class="conq-ic">🏆</div><div><small>Conquista desbloqueada · ${n}/${ALU.CONQUISTAS.length}</small><strong>${esc(titulo)}</strong><p>${esc(desc || "")}</p></div>`;
    t.style.top = 18 + document.querySelectorAll(".conq:not(.sai)").length * 84 + "px";
    document.body.appendChild(t);
    ALU.bip && ALU.bip("porta");
    setTimeout(() => t.classList.add("sai"), 4200);
    setTimeout(() => t.remove(), 4800);
    if (n === ALU.CONQUISTAS.length) setTimeout(() => ALU.conquista && alertaFinal(), 5000);
  };
  function alertaFinal() {
    const t = document.createElement("div"); t.className = "conq final";
    t.innerHTML = `<div class="conq-ic">👑</div><div><strong>Você achou TUDO.</strong><p>Me chama no LigadIn e conta como foi. Sério.</p></div>`;
    document.body.appendChild(t); setTimeout(() => t.remove(), 8000);
  }

  // ---------- desfiles pela tela ----------
  function desfile(conteudo, classe = "") {
    const d = document.createElement("div");
    d.className = "desfile " + classe; d.innerHTML = conteudo;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 6200);
  }
  ALU.desfile = desfile;

  // ---------- teclado: Konami e palavras mágicas ----------
  const KON = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let ki = 0, buf = "";
  document.addEventListener("keydown", (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    ki = k === KON[ki] ? ki + 1 : k === KON[0] ? 1 : 0;
    if (ki === KON.length) {
      ki = 0;
      desfile("🦒🦒🦒 &nbsp; 🦓 &nbsp; 🐘 &nbsp; 🦁", "savana");
      ALU.conquista("konami", "Código secreto", "↑↑↓↓←→←→BA. Clássico.");
    }
    if (e.target.closest && e.target.closest("input,textarea")) return;
    if (k.length === 1) buf = (buf + k).slice(-12);
    if (buf.endsWith("quack")) { buf = ""; desfile(`<span class="pato-desfile">${ALU.pix("peep")}</span>`, "pato"); ALU.bip && ALU.bip("in"); ALU.conquista("quack", "Fala pato", "Digitou quack no meio do nada."); }
    if (buf.endsWith("savana")) { buf = ""; ALU.setWall(1); desfile("ROAAAR 🦁", "rugido"); ALU.conquista("savana", "Rei da savana", "Digitou savana e mudou o papel de parede."); }
  });

  // ---------- relógio: 5 cliques ----------
  let cliques = 0, tc = null;
  document.addEventListener("click", (e) => {
    if (!e.target.closest || !e.target.closest(".tb-clock")) return;
    cliques++; clearTimeout(tc); tc = setTimeout(() => (cliques = 0), 1500);
    if (cliques === 5) {
      cliques = 0;
      const c = e.target.closest(".tb-clock"), antes = c.textContent;
      c.textContent = "12:00 AM"; c.classList.add("noite");
      setTimeout(() => { c.textContent = antes; c.classList.remove("noite"); }, 3500);
      ALU.conquista("relogio", "Turno da noite", "O relógio virou 12 AM. Cuidado com a porta.");
    }
  });

  // ---------- Kez: página secreta ----------
  (ALU.kezSites = ALU.kezSites || []).push({
    re: /^(kez:\/\/)?(segredo|secret|savana)$/, titulo: () => "🤫",
    html: () => `<div class="kz-404"><div class="kz-girafa">🗝️</div><h1>Você achou a página secreta</h1>
      <p>Pouca gente digita endereços à mão hoje em dia. Respeito.</p>
      <p class="muted">Dica para o próximo segredo: o relógio da barra de tarefas não gosta de ser cutucado 5 vezes.</p></div>`,
    init: () => { ALU.conquista("segredo", "Página secreta", "Digitou kez://segredo."); },
  });

  // ---------- desligar ----------
  ALU.desligar = function () {
    const d = document.createElement("div");
    d.className = "desligado";
    d.innerHTML = `<p>Agora é seguro desligar o computador.</p><small>(ou clique para ligar de novo)</small>`;
    document.body.appendChild(d);
    ALU.conquista("desligar", "Pode desligar", "Desligou o aluOS. Ele te perdoa.");
    d.onclick = () => { d.remove(); ALU.reboot(); };
  };
})();
