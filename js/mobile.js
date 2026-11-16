// Modo celular: tela de bloqueio, tela inicial com apps e apps em tela cheia.
(function () {
  const ALU = window.ALU, esc = ALU.esc;
  const GRADE = ["chat", "pasta:sobre", "pasta:projetos", "pasta:contatos", "pasta:skills", "kez", "peep", "terminal", "quarto", "ajustes", "lixeira"];
  const DOCK = ["chat", "kez", "peep", "terminal"];

  ALU.mobile = function (root) {
    const P = window.PERFIL;
    const nomeCurto = (id) => (ALU.APPS[id].projeto ? ALU.APPS[id].projeto.curto : ALU.APPS[id].titulo);
    const iconBtn = (id) => `<button class="m-icon" data-app="${id}">${ALU.iconeHTML(id)}<span>${esc(nomeCurto(id))}</span></button>`;
    root.innerHTML = `
      <div class="phone">
        <div class="status"><span class="st-time"></span><span class="st-island"></span><span class="st-ic">
          <svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1" opacity=".4"/></svg>
          <span class="bat"><i></i></span></span></div>
        <div class="home">
          <div class="widget">
            <div class="w-clock"></div><div class="w-date"></div>
            <div class="w-card"><div class="avatar sm">${esc(P.nome[0])}</div><div><strong>${esc(P.nome)}</strong><small>${esc(P.cargo)}</small></div></div>
          </div>
          <div class="m-grid">${GRADE.filter((id) => !DOCK.includes(id)).map(iconBtn).join("")}</div>
          <div class="m-dock">${DOCK.map(iconBtn).join("")}</div>
        </div>
        <div class="m-apps"></div>
        <div class="lock">
          <div class="lk-time"></div><div class="lk-date"></div>
          <div class="lk-notif">${ALU.iconeHTML("chat", "xs")}
            <div><strong>AluMsg</strong><small>aluisio.dev: oiii, vem ver meus projetos 👀</small></div></div>
          <div class="lk-hint">deslize para cima para abrir</div>
        </div>
        <button class="home-bar" aria-label="Voltar para a tela inicial"></button>
      </div>`;
    const phone = root.querySelector(".phone"), appsEl = root.querySelector(".m-apps"), lock = root.querySelector(".lock");
    const pilha = []; // apps abertos (tela atual = último)

    // relógio
    const tick = () => {
      const d = new Date(), h = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      let dt = d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" }); dt = dt.charAt(0).toUpperCase() + dt.slice(1);
      root.querySelector(".st-time").textContent = h;
      root.querySelector(".w-clock").textContent = h; root.querySelector(".w-date").textContent = dt;
      root.querySelector(".lk-time").textContent = h; root.querySelector(".lk-date").textContent = dt;
    };
    tick(); setInterval(tick, 10000);

    // desbloquear: deslizar para cima ou tocar
    let ly = null;
    lock.addEventListener("pointerdown", (e) => { ly = e.clientY; lock.setPointerCapture(e.pointerId); lock.style.transition = "none"; });
    lock.addEventListener("pointermove", (e) => { if (ly === null) return; const dy = Math.min(0, e.clientY - ly); lock.style.transform = `translateY(${dy}px)`; lock.style.opacity = 1 + dy / 600; });
    const soltar = (e) => {
      if (ly === null) return; const dy = e.clientY - ly; ly = null; lock.style.transition = ""; lock.style.transform = ""; lock.style.opacity = "";
      if (dy < -80 || Math.abs(dy) < 6) desbloquear();
    };
    lock.addEventListener("pointerup", soltar); lock.addEventListener("pointercancel", soltar);
    function desbloquear() { lock.classList.add("aberto"); phone.classList.add("desbloqueado"); }

    // abrir apps
    root.querySelectorAll(".m-icon").forEach((b) => b.addEventListener("click", () => abrir(b.dataset.app, b)));
    function abrir(id, origem) {
      const a = ALU.APPS[id];
      const tela = document.createElement("section");
      tela.className = "m-app";
      tela.style.setProperty("--c1", a.cor[0]); tela.style.setProperty("--c2", a.cor[1]);
      if (origem) {
        const r = origem.querySelector(".app-icon").getBoundingClientRect(), pr = phone.getBoundingClientRect();
        tela.style.transformOrigin = `${r.left + r.width / 2 - pr.left}px ${r.top + r.height / 2 - pr.top}px`;
      }
      tela.innerHTML = `
        <header class="m-bar">${pilha.length ? `<button class="m-back">${ALU.ICON.voltar}<span>Voltar</span></button>` : "<span></span>"}
          <strong>${esc(a.projeto ? a.projeto.curto : a.titulo)}</strong><span></span></header>
        <div class="m-body ${id === "terminal" ? "dark" : ""}"></div>`;
      appsEl.appendChild(tela);
      pilha.push(tela);
      ALU.render(id, tela.querySelector(".m-body"), { abrir: (x) => abrir(x), fechar: voltar, mobile: true });
      const back = tela.querySelector(".m-back"); if (back) back.onclick = voltar;
      phone.classList.add("em-app");
      requestAnimationFrame(() => tela.classList.add("in"));
    }
    function voltar() {
      const t = pilha.pop(); if (!t) return;
      t.classList.remove("in"); t.classList.add("out");
      setTimeout(() => t.remove(), 320);
      if (!pilha.length) phone.classList.remove("em-app");
    }
    function irHome() { while (pilha.length) voltar(); }

    // barra inferior: toque volta para a tela inicial; deslizar também
    const hb = root.querySelector(".home-bar");
    hb.addEventListener("click", () => (lock.classList.contains("aberto") ? irHome() : desbloquear()));
    let hy = null;
    phone.addEventListener("pointerdown", (e) => { if (e.clientY > phone.getBoundingClientRect().bottom - 28) hy = e.clientY; });
    phone.addEventListener("pointerup", (e) => { if (hy !== null && hy - e.clientY > 60) irHome(); hy = null; });
  };
})();
