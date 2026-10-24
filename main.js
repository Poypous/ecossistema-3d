/* Interface, seleção, noite/dia e loop principal. */
(() => {
  const $ = id => document.getElementById(id), ic = n => ICONS[n] || '';
  const { scene, camera, renderer, controls } = World;

  Object.keys(SPECIES).forEach(k => { for (let i = 0; i < SPECIES[k].qty; i++) Animals.spawn(k); });

  const sel = new Set(); let cur = null;
  const rows = {}, listEl = $('legend-list');

  /* ---------- legenda ---------- */
  Object.entries(SPECIES).forEach(([k, sp]) => {
    const row = document.createElement('div');
    row.className = 'row'; row.tabIndex = 0; row.style.setProperty('--c', sp.color);
    row.innerHTML = `<span class="sw">${ic(k)}</span><span class="nm">${sp.name}</span>
      <span class="qty"><button class="qb" type="button" data-d="-1" aria-label="Diminuir ${sp.name}">${ic('minus')}</button>
      <input class="n" type="number" min="0" max="${sp.max}" inputmode="numeric" aria-label="Quantidade de ${sp.name}"><button class="qb" type="button" data-d="1" aria-label="Aumentar ${sp.name}">${ic('plus')}</button></span>`;
    row.onclick = e => {
      const b = e.target.closest('.qb');
      if (e.target.closest('.n')) return;
      if (b) { if (e.detail === 0) change(k, +b.dataset.d); return; }   /* detail 0 = teclado */
      toggle(k);
    };
    row.onkeydown = e => { if (e.key === 'Enter' && e.target === row) toggle(k); };
    const inp = row.querySelector('.n');
    inp.onchange = () => setCount(k, inp.value);
    inp.onkeydown = e => { if (e.key === 'Enter') inp.blur(); e.stopPropagation(); };
    /* segurar o botão repete a ação */
    row.querySelectorAll('.qb').forEach(b => {
      let t1, t2; const stop = () => { clearTimeout(t1); clearInterval(t2); };
      b.addEventListener('pointerdown', () => { change(k, +b.dataset.d); t1 = setTimeout(() => { t2 = setInterval(() => change(k, +b.dataset.d), 90); }, 400); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, stop));
    });
    listEl.appendChild(row); rows[k] = row;
  });

  function change(k, d) {
    const n = Animals.count(k);
    if (d > 0 && n < SPECIES[k].max) Animals.spawn(k);
    if (d < 0 && n > 0) Animals.remove(k);
    refresh();
  }
  function setCount(k, v) {
    v = Math.max(0, Math.min(SPECIES[k].max, Math.round(+v) || 0));
    while (Animals.count(k) < v) Animals.spawn(k);
    while (Animals.count(k) > v) Animals.remove(k);
    refresh();
  }
  function refresh() {
    let tot = 0;
    Object.keys(SPECIES).forEach(k => {
      const n = Animals.count(k), row = rows[k]; tot += n;
      const inp = row.querySelector('.n'); if (document.activeElement !== inp) inp.value = n;
      row.querySelector('[data-d="-1"]').disabled = n <= 0;
      row.querySelector('[data-d="1"]').disabled = n >= SPECIES[k].max;
      row.classList.toggle('on', sel.has(k));
    });
    $('total').textContent = tot;
    $('btn-clear').hidden = sel.size === 0;
    if (cur) $('card-qty').textContent = Animals.count(cur) + ' na simulação';
  }
  function toggle(k) {
    if (sel.has(k)) { sel.delete(k); if (cur === k) closeCard(); } else { sel.add(k); showCard(k); }
    Animals.setHighlight(sel); refresh();
  }
  $('btn-clear').onclick = () => { sel.clear(); Animals.setHighlight(sel); closeCard(); refresh(); };
  $('btn-reset').onclick = () => {
    Object.keys(SPECIES).forEach(k => { while (Animals.count(k) > SPECIES[k].qty) Animals.remove(k); while (Animals.count(k) < SPECIES[k].qty) Animals.spawn(k); });
    refresh();
  };
  $('legend-head').onclick = () => {
    const c = $('legend').classList.toggle('collapsed');
    $('legend-head').setAttribute('aria-expanded', String(!c));
  };

  /* ---------- card ---------- */
  function showCard(k) {
    const s = SPECIES[k]; cur = k;
    $('card-ico').innerHTML = ic(k);
    $('card-name').textContent = s.name; $('card-sci').textContent = s.sci;
    $('card-diet').textContent = s.diet; $('card-role').textContent = s.role;
    $('card-desc').textContent = s.desc; $('card-hab').textContent = s.habitat; $('card-fact').textContent = s.fact;
    $('card').hidden = false; refresh();
  }
  function closeCard() { cur = null; $('card').hidden = true; }
  $('card-x').onclick = () => { closeCard(); };

  /* ---------- clique no animal (ignora arrastos) ---------- */
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2(); let down = null;
  const cv = renderer.domElement;
  cv.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
  cv.addEventListener('pointerup', e => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
    mouse.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    ray.setFromCamera(mouse, camera);
    const h = ray.intersectObjects(Animals.hits, false)[0];
    if (h) { const k = h.object.userData.animal.key; sel.add(k); Animals.setHighlight(sel); showCard(k); refresh(); }
  });

  /* ---------- dia / noite ---------- */
  let night = false;
  $('btn-night').onclick = () => {
    night = !night; World.setNight(night);
    $('btn-night').firstElementChild.innerHTML = ic(night ? 'sun' : 'moon');
  };

  /* ---------- loop: Clock.scale = 0 quando pausado ---------- */
  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), .1) * Clock.scale;
    Animals.update(dt);
    controls.update();
    renderer.render(scene, camera);
  })();

  /* ícones da interface que ainda estiverem vazios */
  document.querySelectorAll('[data-icon]').forEach(el => { if (!el.firstElementChild) el.innerHTML = ic(el.dataset.icon); });
  refresh();
})();
