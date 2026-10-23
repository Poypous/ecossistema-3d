/* Relógio da simulação: pausa + velocidade. Use Clock.scale no loop do main.js. */
const Clock = (() => {
  let speed = 1, paused = false;
  const subs = [];
  const emit = () => subs.forEach(fn => fn({ speed, paused }));
  return {
    get speed() { return speed; },
    get paused() { return paused; },
    get scale() { return paused ? 0 : speed; },
    setSpeed(v) { speed = Math.min(3, Math.max(0.25, Math.round(v * 100) / 100)); emit(); },
    setPaused(p) { paused = !!p; emit(); },
    toggle() { paused = !paused; emit(); },
    onChange(fn) { subs.push(fn); }
  };
})();

(() => {
  const $ = id => document.getElementById(id);
  const ic = n => ICONS[n] || '';

  document.querySelectorAll('[data-icon]').forEach(el => { if (!el.firstElementChild) el.innerHTML = ic(el.dataset.icon); });

  const btnPlay = $('btn-play'), pill = $('speed-label'), gear = $('btn-gear'), menu = $('speed-menu');
  const main = $('menu-main'), sub = $('menu-speed'), list = $('speed-list'), range = $('speed-range'), val = $('speed-val'), flash = $('flash');
  const fmt = s => (s === 1 ? 'Normal' : s + 'x');

  /* lista de velocidades */
  list.innerHTML = '';
  SPEEDS.forEach(s => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'mi'; b.setAttribute('role', 'menuitemradio'); b.dataset.speed = s;
    b.innerHTML = `<span class="ck">${ic('check')}</span><span class="grow">${fmt(s)}</span>`;
    b.onclick = () => { Clock.setSpeed(s); showFlash(s + 'x'); };
    list.appendChild(b);
  });

  /* menu em dois níveis */
  function showLevel(n) { main.hidden = n !== 1; sub.hidden = n !== 2; }
  function openMenu(open) {
    menu.hidden = !open;
    gear.setAttribute('aria-expanded', String(open));
    if (open) { showLevel(1); $('open-speed').focus(); }
  }
  gear.onclick = e => { e.stopPropagation(); openMenu(menu.hidden); };
  $('open-speed').onclick = () => { showLevel(2); (list.querySelector('[aria-checked="true"]') || list.firstChild).focus(); };
  $('back-main').onclick = () => { showLevel(1); $('open-speed').focus(); };
  menu.onclick = e => e.stopPropagation();
  document.addEventListener('click', () => { if (!menu.hidden) openMenu(false); });

  /* play / pause */
  btnPlay.onclick = () => { Clock.toggle(); showFlash(null, Clock.paused ? 'pause' : 'play'); };
  pill.onclick = () => { Clock.setSpeed(1); showFlash('1x'); };
  range.oninput = () => Clock.setSpeed(parseFloat(range.value));

  /* feedback no centro da tela */
  let ft;
  function showFlash(text, icon) {
    flash.innerHTML = icon ? ic(icon) : text;
    flash.classList.remove('show'); void flash.offsetWidth; flash.classList.add('show');
    clearTimeout(ft); ft = setTimeout(() => flash.classList.remove('show'), 700);
  }

  /* sincroniza a interface com o relógio */
  Clock.onChange(({ speed, paused }) => {
    btnPlay.innerHTML = ic(paused ? 'play' : 'pause');
    btnPlay.title = paused ? 'Reproduzir (espaço)' : 'Pausar (espaço)';
    btnPlay.setAttribute('aria-label', paused ? 'Reproduzir' : 'Pausar');
    pill.textContent = speed + 'x'; pill.classList.toggle('paused', paused);
    val.textContent = fmt(speed);
    range.value = speed;
    list.querySelectorAll('.mi').forEach(b => b.setAttribute('aria-checked', String(parseFloat(b.dataset.speed) === speed)));
  });
  Clock.setSpeed(1);

  /* atalhos */
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' && e.target.type !== 'range') return;
    if (e.code === 'Space' || e.key === 'k' || e.key === 'K') {
      e.preventDefault(); Clock.toggle(); showFlash(null, Clock.paused ? 'pause' : 'play');
    } else if (e.key === '>' || e.key === '<') {
      const i = SPEEDS.findIndex(s => s >= Clock.speed - 1e-6);
      const j = Math.min(SPEEDS.length - 1, Math.max(0, (i < 0 ? SPEEDS.length - 1 : i) + (e.key === '>' ? 1 : -1)));
      Clock.setSpeed(SPEEDS[j]); showFlash(SPEEDS[j] + 'x');
    } else if (e.key === 'Escape' && !menu.hidden) { openMenu(false); gear.focus(); }
  });
})();
