// Quarto panorâmico: imagem equirretangular por dentro de uma esfera (three.js),
// câmera girando no centro e objetos clicáveis.
(function () {
  const ALU = window.ALU, esc = (s) => ALU.esc(s);
  const THREE_URL = "js/vendor/three.min.js"; // three.js r128 (licença MIT em js/vendor)
  let carregando = null;
  const carregarThree = () => carregando || (carregando = new Promise((ok, erro) => {
    if (window.THREE) return ok();
    const s = document.createElement("script"); s.src = THREE_URL; s.onload = ok; s.onerror = erro; document.head.appendChild(s);
  }));

  ALU.quarto = function (el, ctx) {
    const Q = window.QUARTO;
    el.innerHTML = `
      <div class="qt">
        <div class="qt-view"><div class="qt-msg">Carregando o quarto…</div></div>
        <div class="qt-hint">Arraste para olhar em volta · role para aproximar · clique nos <b>!</b></div>
        <div class="qt-lista">${Q.pontos.filter((p) => !p.escondido).map((p) => `<button data-p="${p.id}">${esc(p.titulo.split("·")[0].trim())}</button>`).join("")}</div>
        <div class="qt-card" hidden><div class="qt-card-bar"><span></span><button aria-label="Fechar">✕</button></div><p></p><a class="btn real qt-link" target="_blank" rel="noopener" hidden></a></div>
      </div>`;
    const view = el.querySelector(".qt-view"), card = el.querySelector(".qt-card");
    let vivo = true, api = {};
    const obs = new MutationObserver(() => { if (!el.isConnected) { vivo = false; obs.disconnect(); api.destruir && api.destruir(); } });
    obs.observe(document.body, { childList: true, subtree: true });

    function mostrarCard(p) {
      card.hidden = false;
      card.querySelector("span").textContent = p.titulo;
      card.querySelector("p").textContent = p.texto;
      const lk = card.querySelector(".qt-link"); lk.hidden = !p.link;
      if (p.link) { lk.href = p.link; lk.textContent = (p.linkTexto || "Abrir") + " ↗"; }
      el.querySelectorAll(".qt-lista button").forEach((b) => b.classList.toggle("on", b.dataset.p === p.id));
      vistos.add(p.id);
      if (p.id === "luminaria") ALU.conquista && ALU.conquista("luminaria", "Iluminado", "Achou o ponto escondido do quarto.");
      if (Q.pontos.filter((x) => !x.escondido).every((x) => vistos.has(x.id))) ALU.conquista && ALU.conquista("turista", "Turista do quarto", "Olhou todos os objetos do quarto.");
    }
    const vistos = new Set();
    card.querySelector("button").onclick = () => { card.hidden = true; el.querySelectorAll(".qt-lista button").forEach((b) => b.classList.remove("on")); };
    el.querySelectorAll(".qt-lista button").forEach((b) => (b.onclick = () => { const p = Q.pontos.find((x) => x.id === b.dataset.p); api.olhar && api.olhar(p); mostrarCard(p); }));

    carregarThree().then(() => {
      if (!vivo) return;
      const T = window.THREE;
      view.querySelector(".qt-msg").remove();
      const renderer = new T.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      view.appendChild(renderer.domElement);
      const scene = new T.Scene();
      const cam = new T.PerspectiveCamera(75, 1, 0.1, 1000);
      const geo = new T.SphereGeometry(500, 64, 40); geo.scale(-1, 1, 1);
      const tex = new T.TextureLoader().load(Q.imagem, () => render());
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      scene.add(new T.Mesh(geo, new T.MeshBasicMaterial({ map: tex })));

      // posição 3D de um ponto (u, v) da imagem, igual ao mapeamento da esfera
      const pos3 = (u, v) => new T.Vector3(Math.cos(2 * Math.PI * u) * Math.sin(Math.PI * v), Math.cos(Math.PI * v), Math.sin(2 * Math.PI * u) * Math.sin(Math.PI * v)).multiplyScalar(400);
      const pinos = Q.pontos.map((p) => {
        const b = document.createElement("button");
        b.className = "qt-pin" + (p.escondido ? " escondido" : ""); b.innerHTML = `<i>${p.escondido ? "?" : "!"}</i><span>${esc(p.titulo)}</span>`;
        b.onclick = (e) => { e.stopPropagation(); mostrarCard(p); };
        view.appendChild(b);
        return { p, b, v: pos3(p.u, p.v) };
      });

      // começa olhando para o PC
      const inicio = Q.pontos[0];
      const angDe = (vec) => ({ lon: Math.atan2(vec.x, -vec.z) * 180 / Math.PI, lat: Math.asin(vec.y / vec.length()) * 180 / Math.PI });
      let { lon, lat } = angDe(pos3(inicio.u, inicio.v)); lat = 0;
      let alvo = null, mexeu = false;
      api.olhar = (p) => { const a = angDe(pos3(p.u, p.v)); let d = a.lon - lon; d = ((d + 540) % 360) - 180; alvo = { lon: lon + d, lat: Math.max(-30, Math.min(30, a.lat)) }; mexeu = true; };

      function tamanho() {
        const w = view.clientWidth, h = view.clientHeight; if (!w || !h) return;
        renderer.setSize(w, h, false); renderer.domElement.style.width = w + "px"; renderer.domElement.style.height = h + "px";
        cam.aspect = w / h; cam.updateProjectionMatrix();
      }
      const ro = new ResizeObserver(() => { tamanho(); render(); }); ro.observe(view);

      let drag = null;
      renderer.domElement.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY, lon, lat }; mexeu = true; alvo = null; renderer.domElement.setPointerCapture(e.pointerId); view.classList.add("drag"); });
      renderer.domElement.addEventListener("pointermove", (e) => { if (!drag) return; const k = cam.fov / view.clientHeight; lon = drag.lon - (e.clientX - drag.x) * k; lat = Math.max(-80, Math.min(80, drag.lat + (e.clientY - drag.y) * k)); });
      const solta = () => { drag = null; view.classList.remove("drag"); };
      renderer.domElement.addEventListener("pointerup", solta); renderer.domElement.addEventListener("pointercancel", solta);
      view.addEventListener("wheel", (e) => { e.preventDefault(); cam.fov = Math.max(35, Math.min(95, cam.fov + e.deltaY * 0.04)); cam.updateProjectionMatrix(); }, { passive: false });

      const v = new T.Vector3();
      function render() {
        if (!vivo) return;
        const phi = T.MathUtils.degToRad(90 - lat), th = T.MathUtils.degToRad(lon);
        cam.lookAt(Math.sin(phi) * Math.sin(th), Math.cos(phi), -Math.sin(phi) * Math.cos(th));
        renderer.render(scene, cam);
        const w = view.clientWidth, h = view.clientHeight;
        pinos.forEach((pn) => {
          v.copy(pn.v).project(cam);
          const vis = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
          pn.b.style.display = vis ? "" : "none";
          if (vis) pn.b.style.transform = `translate(${Math.round((v.x + 1) / 2 * w)}px, ${Math.round((1 - v.y) / 2 * h)}px)`;
        });
      }
      let raf;
      (function loop() {
        if (!vivo) return;
        if (alvo) { lon += (alvo.lon - lon) * 0.12; lat += (alvo.lat - lat) * 0.12; if (Math.abs(alvo.lon - lon) < 0.1 && Math.abs(alvo.lat - lat) < 0.1) alvo = null; }
        else if (!mexeu) lon += 0.03;
        const win = el.closest(".win");
        if (!win || !win.hidden) render();
        raf = requestAnimationFrame(loop);
      })();
      tamanho();
      api.destruir = () => { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); geo.dispose(); tex.dispose(); };
    }).catch(() => { const m = view.querySelector(".qt-msg"); if (m) m.textContent = "Não consegui carregar o visualizador 3D. Verifique a conexão."; });
  };
})();
