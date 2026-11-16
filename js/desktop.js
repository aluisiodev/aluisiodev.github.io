// Modo desktop: ícones, janelas, barra de tarefas, menu iniciar e notificações.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s);
  const DESK = ["pasta:sobre", "pasta:projetos", "pasta:contatos", "pasta:skills", "chat", "kez", "peep", "terminal", "ajustes", "lixeira"];

  ALU.desktop = function (root) {
    const P = window.PERFIL;
    root.innerHTML = `
      <div class="desk">
        <div class="desk-icons"></div>
        <div class="windows"></div>
        <div class="toasts"></div>
        <div class="ctx-menu" hidden></div>
        <div class="launcher" hidden></div>
        <nav class="taskbar">
          <button class="tb-start" aria-label="Iniciar"><span class="orb"></span><span>iniciar</span></button>
          <div class="tb-quick">${["kez", "peep", "chat"].map((id) => `<button data-app="${id}" title="${esc(ALU.APPS[id].titulo)}">${ALU.pix(ALU.APPS[id].icone)}</button>`).join("")}</div>
          <div class="tb-apps"></div>
          <div class="tb-tray"><button class="tray-msg" title="MessagerTale">${ALU.pix("chat")}</button><span class="tb-clock"></span></div>
        </nav>
      </div>`;
    const desk = root.querySelector(".desk"), winLayer = root.querySelector(".windows"), tbApps = root.querySelector(".tb-apps"),
      launcher = root.querySelector(".launcher"), ctxMenu = root.querySelector(".ctx-menu"), toasts = root.querySelector(".toasts"), tray = root.querySelector(".tray-msg");
    const wins = new Map(); let z = 10, abertos = 0;
    const nomeDe = (id) => ALU.APPS[id].curto || ALU.APPS[id].titulo;

    // ---- ícones ----
    const iconsEl = root.querySelector(".desk-icons");
    function posicionar(b, i) {
      const linhas = Math.max(3, Math.floor((innerHeight - 40 - 16) / 92));
      b.style.left = 12 + Math.floor(i / linhas) * 92 + "px"; b.style.top = 12 + (i % linhas) * 92 + "px";
    }
    DESK.forEach((id, i) => {
      const b = document.createElement("button");
      b.className = "d-icon"; b.dataset.app = id;
      b.innerHTML = `${ALU.iconeHTML(id)}<span class="lbl">${esc(nomeDe(id))}</span>`;
      posicionar(b, i); iconsEl.appendChild(b);
      arrastavel(b, b, { onTap: () => selecionar(b), onDouble: () => abrir(id) });
      b.addEventListener("keydown", (e) => e.key === "Enter" && abrir(id));
    });
    function selecionar(b) { iconsEl.querySelectorAll(".d-icon.sel").forEach((x) => x.classList.remove("sel")); b && b.classList.add("sel"); }
    desk.addEventListener("pointerdown", (e) => {
      if (e.target === desk || e.target.classList.contains("desk-icons") || e.target.classList.contains("windows")) selecionar(null);
      if (!e.target.closest(".launcher,.tb-start")) launcher.hidden = true;
      if (!e.target.closest(".ctx-menu")) ctxMenu.hidden = true;
    });
    root.querySelectorAll(".tb-quick [data-app]").forEach((b) => (b.onclick = () => abrir(b.dataset.app)));
    tray.onclick = () => abrir("chat");

    // ---- janelas ----
    function abrir(id, arg) {
      launcher.hidden = true;
      if (id === "chat") { tray.classList.remove("pisca"); toasts.innerHTML = ""; }
      if (wins.has(id)) { const w = wins.get(id); w.el.hidden = false; focar(id); if (arg && w.api && w.api.ir) w.api.ir(arg); return; }
      const a = ALU.APPS[id]; if (!a) return;
      const vw = innerWidth, vh = innerHeight - 40;
      const w = Math.min(a.w, vw - 30), h = Math.min(a.h, vh - 30);
      const off = (abertos++ % 7) * 26;
      const el = document.createElement("section");
      el.className = "win abrindo"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", a.titulo);
      el.style.cssText = `width:${w}px;height:${h}px;left:${Math.round(Math.max(8, (vw - w) / 2 - 90 + off))}px;top:${Math.round(Math.max(8, (vh - h) / 2 - 40 + off))}px`;
      el.innerHTML = `
        <header class="win-bar">
          ${ALU.iconeHTML(id)}<span class="win-title">${esc(a.titulo)}</span>
          <div class="win-btns">
            <button data-b="min" aria-label="Minimizar"><i></i></button>
            <button data-b="max" aria-label="Maximizar"><i></i></button>
            <button data-b="close" aria-label="Fechar"><i></i></button>
          </div>
        </header>
        <div class="win-body"></div>
        <span class="win-resize" aria-hidden="true"></span>`;
      winLayer.appendChild(el);
      setTimeout(() => el.classList.remove("abrindo"), 200);
      const tb = document.createElement("button");
      tb.className = "tb-app"; tb.innerHTML = `${ALU.iconeHTML(id)}<span>${esc(nomeDe(id))}</span>`;
      tb.onclick = () => { const wi = wins.get(id); if (wi.el.hidden) { wi.el.hidden = false; focar(id); } else if (wi.el.classList.contains("focus")) minimizar(id); else focar(id); };
      tbApps.appendChild(tb);
      const reg = { el, tb, api: null };
      wins.set(id, reg);
      reg.api = ALU.render(id, el.querySelector(".win-body"), { abrir, fechar: () => fechar(id), mobile: false }, arg) || null;
      el.addEventListener("pointerdown", () => focar(id));
      el.querySelector('[data-b="close"]').onclick = () => fechar(id);
      el.querySelector('[data-b="min"]').onclick = (e) => { e.stopPropagation(); minimizar(id); };
      el.querySelector('[data-b="max"]').onclick = () => el.classList.toggle("max");
      const bar = el.querySelector(".win-bar");
      bar.addEventListener("dblclick", (e) => { if (!e.target.closest("button")) el.classList.toggle("max"); });
      arrastavel(el, bar, { ignora: "button", antes: () => !el.classList.contains("max") });
      redimensionavel(el, el.querySelector(".win-resize"));
      focar(id);
    }
    function focar(id) {
      wins.forEach((w, k) => { w.el.classList.toggle("focus", k === id); w.tb.classList.toggle("on", k === id); });
      wins.get(id).el.style.zIndex = ++z;
    }
    function minimizar(id) { const w = wins.get(id); w.el.hidden = true; w.el.classList.remove("focus"); w.tb.classList.remove("on"); }
    function fechar(id) {
      const w = wins.get(id); if (!w) return;
      w.el.classList.add("fechando"); w.tb.remove(); wins.delete(id);
      setTimeout(() => w.el.remove(), 150);
      if (id === "chat") ALU.chatAberto = false;
    }
    ALU.abrirApp = abrir;

    // ---- arrastar / redimensionar ----
    function arrastavel(el, handle, o = {}) {
      let ultimoTap = 0;
      handle.addEventListener("pointerdown", (e) => {
        if (e.button !== 0 || (o.ignora && e.target.closest(o.ignora))) return;
        if (o.antes && !o.antes()) return;
        const sx = e.clientX, sy = e.clientY, ox = el.offsetLeft, oy = el.offsetTop; let moveu = false;
        handle.setPointerCapture(e.pointerId);
        const mv = (ev) => {
          const dx = ev.clientX - sx, dy = ev.clientY - sy;
          if (!moveu && Math.hypot(dx, dy) < 4) return;
          moveu = true; el.classList.add("arrastando");
          el.style.left = Math.round(Math.min(innerWidth - 60, Math.max(-el.offsetWidth + 80, ox + dx))) + "px";
          el.style.top = Math.round(Math.min(innerHeight - 80, Math.max(0, oy + dy))) + "px";
        };
        const up = () => {
          handle.removeEventListener("pointermove", mv); handle.removeEventListener("pointerup", up); handle.removeEventListener("pointercancel", up);
          el.classList.remove("arrastando");
          if (!moveu) { const t = Date.now(); o.onTap && o.onTap(); if (o.onDouble && (t - ultimoTap < 450 || e.pointerType === "touch")) { o.onDouble(); ultimoTap = 0; } else ultimoTap = t; }
        };
        handle.addEventListener("pointermove", mv); handle.addEventListener("pointerup", up); handle.addEventListener("pointercancel", up);
      });
    }
    function redimensionavel(el, h) {
      h.addEventListener("pointerdown", (e) => {
        e.stopPropagation(); h.setPointerCapture(e.pointerId);
        const sx = e.clientX, sy = e.clientY, w = el.offsetWidth, ht = el.offsetHeight;
        const mv = (ev) => { el.style.width = Math.max(320, w + ev.clientX - sx) + "px"; el.style.height = Math.max(220, ht + ev.clientY - sy) + "px"; };
        const up = () => { h.removeEventListener("pointermove", mv); h.removeEventListener("pointerup", up); };
        h.addEventListener("pointermove", mv); h.addEventListener("pointerup", up);
      });
    }

    // ---- menu iniciar ----
    root.querySelector(".tb-start").addEventListener("click", () => { launcher.hidden = !launcher.hidden; if (!launcher.hidden) launcher.querySelector("input").focus(); });
    const todos = ["chat", "kez", "peep", "terminal", "quarto", "notas", "pasta:sobre", "pasta:projetos", "pasta:contatos", "pasta:skills", ...window.PROJETOS.map((p) => "proj:" + p.id), "ajustes"];
    launcher.innerHTML = `
      <div class="la-head"><img src="${esc(P.foto)}" alt=""><strong>${esc(P.nome)}</strong></div>
      <div class="la-body">
        <div class="la-list"></div>
        <div class="la-side">${["pasta:sobre", "pasta:projetos", "pasta:contatos", "pasta:skills", "ajustes"].map((id) => `<button data-app="${id}">${esc(ALU.APPS[id].titulo)}</button>`).join("")}</div>
      </div>
      <input class="la-search" placeholder="Iniciar pesquisa" aria-label="Pesquisar">
      <div class="la-foot"><button data-act="reboot">↻ Reiniciar</button><button data-act="desligar">⏻ Desligar</button></div>`;
    const laList = launcher.querySelector(".la-list");
    const desenhar = (q = "") => {
      const f = todos.filter((id) => ALU.APPS[id].titulo.toLowerCase().includes(q.toLowerCase()));
      laList.innerHTML = f.map((id) => `<button data-app="${id}">${ALU.iconeHTML(id)}<span>${esc(nomeDe(id))}</span></button>`).join("") || '<p class="muted">Nada encontrado.</p>';
      laList.querySelectorAll("button").forEach((b) => (b.onclick = () => abrir(b.dataset.app)));
    };
    desenhar();
    launcher.querySelectorAll(".la-side button").forEach((b) => (b.onclick = () => abrir(b.dataset.app)));
    const busca = launcher.querySelector("input");
    busca.addEventListener("input", (e) => desenhar(e.target.value));
    busca.addEventListener("keydown", (e) => { if (e.key === "Enter") { const b = laList.querySelector("button"); b && b.click(); } if (e.key === "Escape") launcher.hidden = true; });
    launcher.querySelector('[data-act="reboot"]').onclick = () => ALU.reboot();
    launcher.querySelector('[data-act="desligar"]').onclick = () => { launcher.hidden = true; ALU.desligar && ALU.desligar(); };

    // ---- menu de contexto ----
    desk.addEventListener("contextmenu", (e) => {
      if (e.target.closest(".win,.taskbar,.launcher,.toast")) return;
      e.preventDefault();
      ctxMenu.innerHTML = `<button data-c="kez">Abrir Kez(i)avana</button><button data-c="terminal">Abrir Terminal</button><hr>
        <button data-c="wall">Próximo papel de parede</button><button data-c="org">Organizar ícones</button><hr><button data-c="ajustes">Personalizar…</button>`;
      ctxMenu.style.left = Math.min(e.clientX, innerWidth - 200) + "px"; ctxMenu.style.top = Math.min(e.clientY, innerHeight - 200) + "px";
      ctxMenu.hidden = false;
      ctxMenu.querySelectorAll("button").forEach((b) => (b.onclick = () => {
        ctxMenu.hidden = true; const c = b.dataset.c;
        if (c === "wall") ALU.setWall((ALU.estado.wall + 1) % ALU.WALLPAPERS.length);
        else if (c === "org") iconsEl.querySelectorAll(".d-icon").forEach(posicionar);
        else abrir(c);
      }));
    });
    document.addEventListener("keydown", (e) => { if (document.body.dataset.modo === "desktop" && e.key === "Escape") { launcher.hidden = true; ctxMenu.hidden = true; } });

    // ---- relógio ----
    const clock = root.querySelector(".tb-clock");
    const tick = () => (clock.textContent = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    tick(); setInterval(tick, 10000);

    // ---- notificações do MessagerTale ----
    function toast(titulo, texto, foto) {
      const t = document.createElement("button");
      t.className = "toast";
      t.innerHTML = `<div class="toast-bar">${ALU.pix("chat")}<span>MessagerTale</span><i aria-hidden="true">✕</i></div>
        <div class="toast-body">${foto ? `<img src="${esc(P.foto)}" alt="">` : ""}<div><strong>${esc(titulo)}</strong><p>${esc(texto)}</p></div></div>`;
      t.onclick = (e) => { if (e.target.tagName === "I") { t.remove(); return; } abrir("chat"); };
      toasts.appendChild(t);
      ALU.bip && ALU.bip("in");
      setTimeout(() => { t.classList.add("sai"); setTimeout(() => t.remove(), 400); }, 9000);
    }
    ALU.chatPre = []; ALU.chatAberto = false;
    const hora = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const chegou = (txt) => { if (ALU.chatAberto) return; ALU.chatPre.push({ txt, hora: hora() }); tray.classList.add("pisca"); toast(P.usuario, txt, true); };
    setTimeout(() => { if (!ALU.chatAberto) toast(P.usuario + " acabou de entrar", "Status: online", true); }, 3500);
    setTimeout(() => chegou("oiii"), 6500);
    setTimeout(() => chegou("tá por aí? 👀"), 9000);
  };
})();
