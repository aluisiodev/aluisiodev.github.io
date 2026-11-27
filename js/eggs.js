// Easter eggs e conquistas do aluOS. Shhh.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s);

  // ---------- conquistas ----------
  ALU.CONQUISTAS = [
    ["konami", "Código secreto"], ["quack", "Fala pato"], ["savana", "Rei da savana"], ["relogio", "Turno da noite"],
    ["lixeira", "Revirando o lixo"], ["terminal", "Hacker de verdade"], ["404", "Perdido na savana"], ["segredo", "Página secreta"],
    ["like10", "Fã número 1"], ["inscrito", "Inscrito na savana"], ["pato10h", "ASMR aquático"], ["spam", "Quase caiu"],
    ["freddy", "Turno da noite II"], ["cobra15", "Cobra criada"], ["velha", "Mais esperto que Zizi"], ["pato100", "Criador de patos"],
    ["memoria", "Memória de elefante"], ["pato-evoluiu", "O pato evoluiu"], ["nudge", "Chamando atenção"], ["luminaria", "Iluminado"],
    ["turista", "Turista do quarto"], ["desligar", "Pode desligar"], ["professor", "Professor de bot"], ["bonzinho", "Amizade com Zizi"],
    ["ebaa", "Membro do fórum"], ["recado", "Deixou recado"], ["segunda", "Odeio segunda-feira"], ["barrel", "Deu um giro"], ["musikzify", "Trilha sonora"],
    ["voador", "Asas de pato"], ["plantao", "Sobreviveu ao plantão"], ["ritmo", "Ritmo de batalha"], ["ligadin", "Engajamento orgânico"], ["commit", "Primeiro commit"], ["talentos", "Banco de talentos"], ["tema", "Nostalgia de 2009"], ["banco", "Rico de experiência"], ["ligacao", "Alô?"], ["toques", "Toque polifônico"], ["clima-local", "Previsão sob medida"], ["ritmo-coral", "Mergulhador"], ["concord-prompts", "Bastidores"], ["concord-bot", "Falou com um bot"], ["concord-voz", "Madrugada no Concord"]
  ];
  // títulos e descrições em inglês, por id (vale para qualquer lugar que chame ALU.conquista)
  const CONQ_EN = {
    konami: ["Secret code", "↑↑↓↓←→←→BA. A classic."], quack: ["Duck talk", "Typed quack out of nowhere."], savana: ["King of the savanna", "Typed savana and changed the wallpaper."],
    relogio: ["Night shift", "The clock hit 12 AM. Watch the door."], lixeira: ["Dumpster diving", "Opened a file from the Recycle Bin."], terminal: ["Real hacker", "Found a secret terminal command."],
    404: ["Lost in the savanna", "Found a page that doesn't exist."], segredo: ["Secret page", "Typed kez://segredo."], like10: ["Number 1 fan", "Liked a video 10 times."],
    inscrito: ["Savanna subscriber", "Subscribed to the channel."], pato10h: ["Aquatic ASMR", "Watched the 10-hour duck video."], spam: ["Almost fell for it", "Opened the savanna prince's email."],
    freddy: ["Night shift II", "Read the museum manager's email."], cobra15: ["Snake charmer", "Scored 15 in Snake."], velha: ["Smarter than Zizi", "Beat Zizi at tic-tac-toe."],
    pato100: ["Duck breeder", "Collected 100 quacks in Pato Clicker."], memoria: ["Elephant memory", "Completed Savanna Memory."], "pato-evoluiu": ["The duck evolved", "Ran code 5 times in Peep Studio."],
    nudge: ["Attention seeker", "Shook the MessagerTale window."], luminaria: ["Enlightened", "Found the hidden spot in the bedroom."], turista: ["Bedroom tourist", "Looked at every object in the bedroom."],
    desligar: ["Safe to turn off", "Shut down aluOS. It forgives you."], professor: ["Bot teacher", "Taught MessagerTale a new phrase."], bonzinho: ["Friends with Zizi", "Chatted with Zizi."],
    ebaa: ["Forum member", "Replied to a topic on ebaa!."], recado: ["Left a scrap", "Wrote a scrap on yakurt."], segunda: ["I hate Mondays", "Joined the most honest community on yakurt."],
    barrel: ["Do a barrel roll", "Asked Alulugle to spin."], musikzify: ["Soundtrack", "Opened the playlist on musikzify."], voador: ["Duck wings", "Scored 10 in Flappy Duck."],
    plantao: ["Survived the shift", "Made it to 6 AM in Night Watch."], ritmo: ["Battle rhythm", "Hit a 25 combo in Rhythm Battle."], ligadin: ["Organic engagement", "Interacted on LigadIn."],
    commit: ["First commit", "Signed the guestbook in Peep Studio."], talentos: ["Talent pool", "Read 5 identical rejections in imaíu's spam."], tema: ["2009 nostalgia", "Changed the aluOS theme."],
    banco: ["Rich in experience", "Opened the bank app."], ligacao: ["Hello?", "Made a call."], toques: ["Polyphonic ringtone", "Said YES to the carrier."], "concord-prompts": ["Behind the scenes", "Read the prompts behind aluOS."], "concord-bot": ["Talked to a bot", "Chatted with Zizi or Peep on Concord."], "concord-voz": ["Late night on Concord", "Joined the Concord voice channel."], "clima-local": ["Tailor-made forecast", "Checked the weather where you are on climaselva."], "ritmo-coral": ["Deep diver", "Beat Coral Reef on hard."],
  };
  const EM_EN = ALU.lang === "en";
  if (EM_EN) ALU.CONQUISTAS.forEach((c) => { if (CONQ_EN[c[0]]) c[1] = CONQ_EN[c[0]][0]; });
  const ler = () => { try { return JSON.parse(localStorage.getItem("alu.conquistas")) || {}; } catch { return {}; } };
  const salvar = (o) => { try { localStorage.setItem("alu.conquistas", JSON.stringify(o)); } catch {} };
  let feitas = ler();
  ALU.conquistasFeitas = () => feitas;

  ALU.conquista = function (id, titulo, desc) {
    if (feitas[id]) return;
    if (EM_EN && CONQ_EN[id]) [titulo, desc] = [CONQ_EN[id][0], desc && /[ãõçáéíóúâêô]|\b(de|do|da|no|na|um|uma|o|a)\b/i.test(desc) ? CONQ_EN[id][1] : desc || CONQ_EN[id][1]];
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
    t.innerHTML = `<div class="conq-ic">👑</div><div><strong>${EM_EN ? "You found EVERYTHING." : "Você achou TUDO."}</strong><p>${EM_EN ? "Ping me on LigadIn and tell me how it went. Seriously." : "Me chama no LigadIn e conta como foi. Sério."}</p></div>`;
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
    html: () => `<div class="kz-404"><div class="kz-girafa">🗝️</div>${EM_EN ? `<h1>You found the secret page</h1>
      <p>Few people type addresses by hand these days. Respect.</p>
      <p class="muted">Hint for the next secret: the taskbar clock doesn't like being poked 5 times.</p>` : `<h1>Você achou a página secreta</h1>
      <p>Pouca gente digita endereços à mão hoje em dia. Respeito.</p>
      <p class="muted">Dica para o próximo segredo: o relógio da barra de tarefas não gosta de ser cutucado 5 vezes.</p>`}</div>`,
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
