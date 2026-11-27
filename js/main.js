// aluOS: estado global, papéis de parede, boot e escolha entre desktop e celular.
(function () {
  const ALU = window.ALU;
  const ls = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };

  ALU.WALLPAPERS = [
    { nome: "Aurora", cls: "wp-aurora" },
    { nome: "Savana", cls: "wp-savana" },
    { nome: "Noite", cls: "wp-noite" },
    { nome: "Céu Aero", cls: "wp-aero" },
    { nome: "Metro", cls: "wp-metro" },
    { nome: "Estrada 57", cls: "wp-estrada" },
  ];
  ALU.CORES = ["#2f6bff", "#7c3aed", "#0e9f6e", "#d9468f", "#e07b12", "#4b5563"];
  ALU.estado = { wall: Math.min(+(ls.get("alu.v2.wall") || 0), ALU.WALLPAPERS.length - 1) || 0, accent: ls.get("alu.v2.accent") || "#2f6bff" };

  ALU.setWall = (i) => {
    ALU.estado.wall = i; ls.set("alu.v2.wall", i);
    const wp = document.getElementById("wallpaper");
    wp.className = "wallpaper " + ALU.WALLPAPERS[i].cls;
    document.documentElement.dataset.wall = ALU.WALLPAPERS[i].cls; // o celular e o js/estrada.js leem daqui
  };
  // temas: pixel (padrão), aero (Frutiger Aero), metro (Frutiger Metro) e estrada ("Retrowave": pixel art neon; o papel de parede dele é a Estrada 57)
  ALU.TEMAS = [["pixel", "Pixel 2006"], ["aero", "Frutiger Aero"], ["metro", "Frutiger Metro"], ["estrada", "Retrowave"]];
  ALU.estado.tema = ALU.TEMAS.some(([t]) => t === ls.get("alu.tema")) ? ls.get("alu.tema") : "pixel";
  // cada tema vem com o seu papel de parede; depois dá pra trocar por qualquer outro
  const WALL_DO_TEMA = { pixel: "wp-aurora", aero: "wp-aero", metro: "wp-metro", estrada: "wp-estrada" };
  const wallDoTema = (t) => Math.max(0, ALU.WALLPAPERS.findIndex((w) => w.cls === WALL_DO_TEMA[t]));
  ALU.setTema = (t) => { const mudou = t !== ALU.estado.tema; ALU.estado.tema = t; ls.set("alu.tema", t); document.documentElement.dataset.tema = t; if (mudou) ALU.setWall(wallDoTema(t)); };
  document.documentElement.dataset.tema = ALU.estado.tema;
  // antes o Aero e o Metro ignoravam o papel de parede: quem já usava um deles continua vendo o fundo do tema
  if (!ls.get("alu.v3.wall")) { ls.set("alu.v3.wall", "1"); if (ALU.estado.tema !== "pixel") ALU.estado.wall = wallDoTema(ALU.estado.tema); }
  ALU.setAccent = (c) => { ALU.estado.accent = c; ls.set("alu.v2.accent", c); document.documentElement.style.setProperty("--accent", c); };

  const isMobile = () => matchMedia("(max-width: 760px), (pointer: coarse) and (max-width: 1024px)").matches;
  let modo = null;
  function montar() {
    const m = isMobile() ? "mobile" : "desktop";
    if (m === modo) return;
    modo = m;
    document.body.dataset.modo = m;
    document.getElementById("os").innerHTML = "";
    (m === "mobile" ? ALU.mobile : ALU.desktop)(document.getElementById("os"));
  }

  // ----- boot -----
  function boot(rapido) {
    const b = document.getElementById("boot");
    b.hidden = false; b.classList.remove("fim");
    const linhas = [
      "aluOS 2.0 — carregando",
      "verificando memória .............. ok",
      "abrindo a savana (Kez(i)avana) ... ok",
      `carregando projetos (${window.PROJETOS.length}) ........... ok`,
      "alimentando o pato do Peep Studio . ok",
      "conectando ao MessagerTale ....... ok",
    ];
    const log = b.querySelector(".boot-log"); log.textContent = "";
    let i = 0, acabou = false;
    const fim = () => {
      if (acabou) return; acabou = true;
      b.classList.add("fim");
      setTimeout(() => { b.hidden = true; }, 600);
      try { sessionStorage.setItem("alu.booted", "1"); } catch {}
    };
    const passo = () => {
      if (acabou) return;
      if (i < linhas.length) { log.textContent += linhas[i++] + "\n"; setTimeout(passo, rapido ? 60 : 230); }
      else { b.classList.add("logo"); setTimeout(fim, rapido ? 300 : 900); }
    };
    b.classList.remove("logo");
    passo();
    b.onclick = fim;
    document.addEventListener("keydown", fim, { once: true });
  }
  ALU.reboot = () => { modo = null; boot(false); setTimeout(montar, 400); };

  document.addEventListener("DOMContentLoaded", () => {
    ALU.setWall(ALU.estado.wall);
    ALU.setAccent(ALU.estado.accent);
    let jaBootou = false; try { jaBootou = sessionStorage.getItem("alu.booted") === "1"; } catch {}
    montar();
    boot(jaBootou);
    let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(montar, 200); });
  });
})();
