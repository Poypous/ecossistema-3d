/* Mundo 3D (Three.js r128), modelos detalhados e comportamento dos animais. */
const World = (() => {
  const rnd = (a, b) => a + Math.random() * (b - a);
  const M = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .9, flatShading: true }, o));
  const hsl = (h, s, l) => new THREE.Color().setHSL(h, s, l);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8fd0ff); scene.fog = new THREE.Fog(0x8fd0ff, 55, 130);
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 300);
  camera.position.set(28, 20, 28);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputEncoding = THREE.sRGBEncoding;
  document.getElementById('scene').appendChild(renderer.domElement);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.maxPolarAngle = Math.PI * .48;
  controls.minDistance = 5; controls.maxDistance = 70; controls.target.set(0, 1, 0);

  const hemi = new THREE.HemisphereLight(0xdff3ff, 0x4a6a3a, .75);
  const sun = new THREE.DirectionalLight(0xfff0cc, 1.1); sun.position.set(25, 40, 15); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004;
  Object.assign(sun.shadow.camera, { left: -50, right: 50, top: 50, bottom: -50, near: 1, far: 120 });
  scene.add(hemi, sun);

  const R = 36, POND = { x: 9, z: 7, r: 4.5 };
  const groundMat = M(0x5fa84a, { flatShading: false });
  const ground = new THREE.Mesh(new THREE.CircleGeometry(48, 64), groundMat);
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const pond = new THREE.Mesh(new THREE.CircleGeometry(POND.r, 40), M(0x2f86c6, { roughness: .15, metalness: .1, flatShading: false, transparent: true, opacity: .9 }));
  pond.rotation.x = -Math.PI / 2; pond.position.set(POND.x, .04, POND.z); scene.add(pond);
  const nearPond = (x, z, m) => Math.hypot(x - POND.x, z - POND.z) < POND.r + m;
  const shade = o => o.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });

  for (let i = 0; i < 14; i++) {   /* pedras da lagoa */
    const a = i / 14 * 6.28 + rnd(-.2, .2), s = rnd(.3, .6);
    const k = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), M(0x8a8f8c));
    k.scale.set(s, s * .7, s); k.position.set(POND.x + Math.cos(a) * (POND.r + .1), s * .3, POND.z + Math.sin(a) * (POND.r + .1)); shade(k); scene.add(k);
  }
  /* grama (instanciada) */
  const grass = new THREE.InstancedMesh(new THREE.ConeGeometry(.07, .5, 4), M(0xffffff), 3000), d = new THREE.Object3D();
  for (let i = 0, n = 0; i < 3000; i++) {
    const x = rnd(-R - 6, R + 6), z = rnd(-R - 6, R + 6);
    if (Math.hypot(x, z) > R + 6 || nearPond(x, z, 0)) { d.scale.setScalar(0); } else {
      d.position.set(x, .25, z); d.rotation.set(rnd(-.2, .2), rnd(0, 6), rnd(-.2, .2)); d.scale.setScalar(rnd(.7, 1.7));
    }
    d.updateMatrix(); grass.setMatrixAt(i, d.matrix); grass.setColorAt(i, hsl(rnd(.22, .32), .5, rnd(.26, .38)));
  }
  scene.add(grass);

  /* árvores: araucárias (copa em "taça") e árvores de folha larga */
  const trees = [];
  function broad(x, z) {
    const h = rnd(4, 7), t = new THREE.Group();
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(.25, .42, h, 7), M(0x6b4a2b)); tr.position.y = h / 2; t.add(tr);
    for (let i = 0; i < 4; i++) {
      const c = new THREE.Mesh(new THREE.IcosahedronGeometry(h * rnd(.28, .38), 1), M(hsl(rnd(.25, .36), .5, rnd(.24, .34))));
      c.position.set(rnd(-1.3, 1.3), h + rnd(-.5, 1), rnd(-1.3, 1.3)); t.add(c);
    }
    t.position.set(x, 0, z); shade(t); scene.add(t); trees.push({ x, z, top: h + 1.2 });
  }
  function arau(x, z) {
    const h = rnd(9, 13), t = new THREE.Group();
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(.2, .45, h, 7), M(0x5a3d26)); tr.position.y = h / 2; t.add(tr);
    for (let i = 0; i < 4; i++) {
      const c = new THREE.Mesh(new THREE.ConeGeometry(3.2 - i * .55, .9, 9), M(hsl(.33, .45, .2 + i * .02)));
      c.position.y = h - .3 + i * .55; t.add(c);
    }
    t.position.set(x, 0, z); shade(t); scene.add(t); trees.push({ x, z, top: h + .5 });
  }
  for (let n = 0; trees.length < 26 && n < 400; n++) {
    const x = rnd(-R, R), z = rnd(-R, R);
    if (Math.hypot(x, z) > R || Math.hypot(x, z) < 5 || nearPond(x, z, 3)) continue;
    (trees.length % 3 === 0 ? arau : broad)(x, z);
  }
  for (let i = 0; i < 30; i++) {   /* arbustos */
    const x = rnd(-R, R), z = rnd(-R, R); if (Math.hypot(x, z) > R || nearPond(x, z, 1.5)) continue;
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(rnd(.5, 1), 1), M(hsl(rnd(.25, .34), .5, rnd(.2, .3))));
    b.scale.y = .7; b.position.set(x, .4, z); shade(b); scene.add(b);
  }
  /* flores em canteiros (as abelhas pousam nelas) */
  const flowers = [], fc = [0xff6f91, 0xffd166, 0xffffff, 0xc77dff, 0xff8a3d];
  for (let p = 0; p < 8; p++) {
    const cx = rnd(-R + 4, R - 4), cz = rnd(-R + 4, R - 4); if (nearPond(cx, cz, 4)) continue;
    for (let i = 0; i < 16; i++) {
      const a = rnd(0, 6.28), rr = rnd(.3, 2.8), x = cx + Math.cos(a) * rr, z = cz + Math.sin(a) * rr, h = rnd(.35, .7);
      if (nearPond(x, z, .5)) continue;
      const f = new THREE.Group();
      const s = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, h, 5), M(0x3f8f3a)); s.position.y = h / 2; f.add(s);
      const pe = new THREE.Mesh(new THREE.CylinderGeometry(.2, .12, .05, 7), M(fc[i % 5])); pe.position.y = h; f.add(pe);
      const c = new THREE.Mesh(new THREE.IcosahedronGeometry(.07, 0), M(0xf5c518)); c.position.y = h + .05; f.add(c);
      f.position.set(x, 0, z); f.rotation.z = rnd(-.15, .15); scene.add(f); flowers.push({ x, y: h + .1, z });
    }
  }
  /* nuvens */
  const clouds = [];
  for (let i = 0; i < 7; i++) {
    const c = new THREE.Group();
    for (let j = 0; j < 5; j++) { const s = new THREE.Mesh(new THREE.IcosahedronGeometry(rnd(2, 3.5), 1), M(0xffffff, { roughness: 1 })); s.position.set(j * 2.4 - 5, rnd(-.5, .5), rnd(-1, 1)); s.scale.y = .6; c.add(s); }
    c.position.set(rnd(-60, 60), rnd(28, 40), rnd(-60, 60)); scene.add(c); clouds.push(c);
  }
  function update(dt) { clouds.forEach(c => { c.position.x += dt * .8; if (c.position.x > 70) c.position.x = -70; }); }

  function setNight(n) {
    const c = new THREE.Color(n ? 0x0b1530 : 0x8fd0ff); scene.background = c; scene.fog.color = c;
    hemi.intensity = n ? .25 : .75; sun.intensity = n ? .25 : 1.1; sun.color.set(n ? 0x8fa8ff : 0xfff0cc);
    groundMat.color.set(n ? 0x2c5a2e : 0x5fa84a);
  }
  addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
  return { scene, camera, renderer, controls, trees, flowers, POND, R, M, setNight, update };
})();

/* Modelos articulados: pernas, cabeça e asas são pivôs que o comportamento anima. */
const Models = (() => {
  const M = World.M;
  const E = (c, sx, sy, sz, x, y, z, p) => { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), M(c)); m.scale.set(sx, sy, sz); m.position.set(x, y, z); p.add(m); return m; };
  const CY = (c, r, l, x, y, z, rx, rz, p) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r * .7, r, l, 5), M(c)); m.position.set(x, y, z); m.rotation.set(rx, 0, rz); p.add(m); return m; };
  /* body[x,y,z] lh=altura das pernas neck head[x,y,z] snout ear[larg,alt] tail[comp,raio] legs cores[corpo,claro,escuro] */
  const L = {
    lobo:   { body: [.55,.22,.17], lh: .36, neck: .16, head: [.15,.12,.1], snout: .16, ear: [.04,.11], tail: [.45,.07], legs: .04, c: [0x7f8c8d, 0xecf0f1, 0x4a5457] },
    cervo:  { body: [.5,.2,.15], lh: .6, neck: .42, head: [.13,.1,.08], snout: .13, ear: [.05,.1], tail: [.08,.06], legs: .03, antlers: 1, c: [0xb07a4a, 0xe9d3b4, 0x5a3d26] },
    coelho: { body: [.42,.28,.24], lh: .2, neck: .08, head: [.2,.17,.13], snout: .05, ear: [.045,.42], tail: [.14,.12], legs: .06, puff: 1, c: [0xd7ccc8, 0xf4ece8, 0x8a7a72] },
    cutia:  { body: [.5,.27,.22], lh: .26, neck: .06, head: [.19,.16,.13], snout: .09, ear: [.04,.06], tail: [.05,.05], legs: .05, c: [0x8a5a2b, 0xe0c9a0, 0x4a2f15] },
    bugio:  { body: [.32,.3,.2], lh: .38, neck: .12, head: [.17,.17,.15], snout: .05, ear: [.04,.05], tail: [.8,.045], legs: .05, beard: 1, c: [0xa8420e, 0x6b2f0b, 0x3a1a08] }
  };
  function land(key, sp) {
    const c = L[key], u = sp.top, [A, B, C] = c.c, g = new THREE.Group(), rig = new THREE.Group(); g.add(rig);
    const [bx, by, bz] = c.body.map(v => v * u), lh = c.lh * u, yb = lh + by, ls = lh + by * .3;
    E(A, bx, by, bz, 0, yb, 0, rig); E(B, bx * .75, by * .6, bz * .9, bx * .1, yb - by * .35, 0, rig);
    const legs = [];
    [[.6, 1], [.6, -1], [-.6, 1], [-.6, -1]].forEach(([fx, s]) => {
      const p = new THREE.Group(); p.position.set(bx * fx, ls, bz * .6 * s);
      CY(C, c.legs * u, ls, 0, -ls / 2, 0, 0, 0, p); E(C, c.legs * u * 1.4, c.legs * u * .7, c.legs * u * 1.5, c.legs * u * .6, -ls, 0, p);
      rig.add(p); legs.push(p);
    });
    const nk = c.neck * u;
    CY(A, by * .6, nk * 1.4, bx * .8 + nk * .2, yb + by * .4 + nk * .45, 0, 0, -.5, rig);
    const hp = new THREE.Group(); hp.position.set(bx * .8 + nk * .45, yb + by * .5 + nk * .85, 0); rig;
    rig.add(hp);
    const [hx, hy, hz] = c.head.map(v => v * u), sn = c.snout * u;
    E(A, hx, hy, hz, hx * .5, 0, 0, hp); E(B, sn + hx * .4, hy * .55, hz * .6, hx + sn * .3, -hy * .2, 0, hp);
    E(0x151515, hx * .16, hx * .13, hx * .15, hx + sn * 1.1, -hy * .1, 0, hp);
    [1, -1].forEach(s => {
      E(0x111111, hx * .13, hx * .13, hx * .13, hx * .8, hy * .3, hz * .85 * s, hp);
      E(A, c.ear[0] * u, c.ear[1] * u, c.ear[0] * u * .5, hx * .1, hy + c.ear[1] * u * .6, hz * .6 * s, hp);
      if (c.antlers) {
        CY(0xe6d5a8, .012 * u, .5 * u, 0, hy + .22 * u, hz * .5 * s, s * .35, 0, hp);
        CY(0xe6d5a8, .01 * u, .22 * u, hx * .15, hy + .2 * u, hz * .8 * s, s * .35, -.9, hp);
        CY(0xe6d5a8, .01 * u, .22 * u, hx * .15, hy + .38 * u, hz * 1.1 * s, s * .5, -.9, hp);
      }
    });
    if (c.beard) E(C, hx * .7, hy * .6, hz * .7, hx * .6, -hy * .8, 0, hp);
    const [tl, tr] = c.tail.map(v => v * u);
    E(c.puff ? 0xffffff : (key === 'bugio' ? A : B), tl * .5, tr * 1.4, tr * 1.4, -bx - tl * .35, yb + by * .3, 0, rig);
    g.userData = { legs, head: hp, rig, lh };
    return g;
  }
  function fly(key, sp) {
    const u = sp.top, bee = key === 'abelha', tou = key === 'tucano', g = new THREE.Group(), rig = new THREE.Group(); g.add(rig);
    const A = bee ? 0xf1c40f : tou ? 0x1a1a22 : 0x2a56c7, B = bee ? 0x1b1b1b : tou ? 0xffffff : 0x0f1a3d;
    E(A, u * .42, u * .26, u * .26, 0, 0, 0, rig);
    let hp = null;
    if (bee) {
      E(0x1b1b1b, u * .12, u * .27, u * .27, -u * .05, 0, 0, rig); E(0x1b1b1b, u * .1, u * .26, u * .26, -u * .28, 0, 0, rig);
      E(0x2b2b2b, u * .2, u * .2, u * .2, u * .45, u * .03, 0, rig);
      [1, -1].forEach(s => E(0xffffff, u * .05, u * .06, u * .06, u * .55, u * .1, u * .14 * s, rig));
    } else {
      E(B, u * .3, u * .2, u * .22, u * .1, -u * .06, 0, rig);
      E(A, u * .4, u * .04, u * .14, -u * .65, 0, 0, rig);
      hp = new THREE.Group(); hp.position.set(u * .38, u * .12, 0); rig.add(hp);
      E(tou ? 0x1a1a22 : B, u * .2, u * .19, u * .18, u * .08, 0, 0, hp);
      if (tou) E(0xffffff, u * .12, u * .1, u * .18, u * .05, -u * .12, 0, hp);
      const bk = new THREE.Mesh(new THREE.ConeGeometry(u * (tou ? .12 : .06), u * (tou ? .6 : .26), 6), M(tou ? 0xff8c00 : 0x2b2b2b));
      bk.rotation.z = -Math.PI / 2; bk.position.set(u * (tou ? .5 : .32), -u * .02, 0); hp.add(bk);
      if (!tou) { const cr = new THREE.Mesh(new THREE.ConeGeometry(u * .07, u * .25, 5), M(B)); cr.position.set(0, u * .22, 0); hp.add(cr); }
      [1, -1].forEach(s => E(0xffffff, u * .04, u * .04, u * .04, u * .16, u * .05, u * .13 * s, hp));
      [1, -1].forEach(s => CY(0x555555, u * .015, u * .2, 0, -u * .3, u * .08 * s, 0, 0, rig));
    }
    const wings = [];
    [1, -1].forEach(s => {
      const p = new THREE.Group(); p.position.set(0, u * .12, u * .12 * s);
      const wc = bee ? 0xcfe9ff : A, o = { transparent: bee, opacity: bee ? .6 : 1 };
      [[.28, .18, .2], [.22, .42, .17]].forEach(([w, z, l]) => {
        const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), M(wc, o)); m.scale.set(u * w, u * .025, u * l); m.position.set(0, 0, u * z * s); p.add(m);
      });
      rig.add(p); wings.push(p);
    });
    g.userData = { wings, head: hp, rig };
    return g;
  }
  return { build: (key) => SPECIES[key].kind === 'fly' ? fly(key, SPECIES[key]) : land(key, SPECIES[key]) };
})();

/* Comportamento: herbívoros pastam e bebem, lobos patrulham, descansam deitados e uivam (sem caçar),
   abelhas pousam nas flores, tucanos e gralhas pousam nas árvores, bugios comem nas copas. */
const Animals = (() => {
  const list = [], hits = [], hl = new Set();
  const { scene, trees, flowers, POND: P, R } = World;
  const r = (a, b) => a + Math.random() * (b - a), V = (x, y, z) => new THREE.Vector3(x, y, z);
  const ok = (x, z) => Math.hypot(x, z) < R && Math.hypot(x - P.x, z - P.z) > P.r + .6;
  function landPoint() { let x, z; do { x = r(-R, R); z = r(-R, R); } while (!ok(x, z)); return V(x, 0, z); }
  const flyPoint = k => V(r(-R, R), k === 'abelha' ? r(1, 3.5) : r(3, 9), r(-R, R));
  const pondPt = () => { const t = r(0, 6.28); return V(P.x + Math.cos(t) * (P.r + 1), 0, P.z + Math.sin(t) * (P.r + 1)); };
  const rt = () => trees[Math.floor(Math.random() * trees.length)];
  const treePos = t => V(t.x, t.top, t.z);

  function spawn(key) {
    const sp = SPECIES[key], g = Models.build(key);
    g.traverse(o => { if (o.isMesh) o.castShadow = true; });
    const hit = new THREE.Mesh(new THREE.SphereGeometry(sp.hit * .6, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.y = sp.hy; hit.userData.fx = true; g.add(hit);
    const mat = new THREE.MeshBasicMaterial({ color: sp.color, transparent: true, depthTest: false });
    const white = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthTest: false });
    const halo = new THREE.Group();
    const cone = new THREE.Mesh(new THREE.ConeGeometry(.4, 1, 14), mat); cone.rotation.x = Math.PI;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(.28, 12, 8), white); ball.position.y = .75;
    [cone, ball].forEach(m => { m.renderOrder = 999; m.userData.fx = true; halo.add(m); });
    halo.userData.baseY = sp.hy + sp.top * .75 + .9; halo.position.y = halo.userData.baseY; halo.visible = hl.has(key); g.add(halo);
    const a = { key, sp, g, hit, halo, u: g.userData, t: Math.random() * 10, timer: r(0, 3), state: 'idle', pose: { head: 0, lie: 0, fold: 0 }, mv: 0, tree: null };
    hit.userData.animal = a;
    if (sp.kind === 'land') { g.position.copy(landPoint()); decide(a); }
    else if (sp.kind === 'fly') { g.position.copy(flyPoint(key)); go(a, flyPoint(key), 'fly', 0); }
    else { a.tree = rt(); g.position.copy(treePos(a.tree)); a.state = 'sit'; a.timer = r(2, 8); }
    g.rotation.y = r(0, 6.28);
    dim(a); scene.add(g); list.push(a); hits.push(hit);
  }
  function remove(key) {
    for (let i = list.length - 1; i >= 0; i--) if (list[i].key === key) {
      const a = list.splice(i, 1)[0]; scene.remove(a.g); hits.splice(hits.indexOf(a.hit), 1); return;
    }
  }
  const count = key => list.filter(a => a.key === key).length;
  function dim(a) {
    const d = hl.size > 0 && !hl.has(a.key);
    a.g.traverse(o => {
      if (!o.isMesh || o.userData.fx) return;
      if (o.userData.op === undefined) o.userData.op = o.material.opacity;
      o.material.transparent = d || o.userData.op < 1; o.material.opacity = d ? o.userData.op * .3 : o.userData.op; o.material.needsUpdate = true;
    });
  }
  function setHighlight(set) { hl.clear(); set.forEach(k => hl.add(k)); list.forEach(a => { a.halo.visible = hl.has(a.key); dim(a); }); }

  const go = (a, pt, then, dur) => { a.target = pt; a.then = then; a.dur = dur; a.state = a.sp.kind === 'fly' ? 'fly' : 'walk'; };
  const st = (a, s, t) => { a.state = s; a.timer = t; };
  function decide(a) {
    const k = a.key, p = Math.random();
    if (a.sp.kind === 'land') {
      if (k === 'lobo') {
        if (p < .4) return st(a, 'rest', r(10, 18));
        if (p < .55) return go(a, pondPt(), 'drink', r(3, 5));
        if (p < .7) return st(a, 'howl', 3);
      } else {
        if (p < .5) return st(a, 'graze', r(5, 10));
        if (p < .68) return go(a, pondPt(), 'drink', r(3, 6));
      }
      return go(a, landPoint(), 'idle', r(1, 2));
    }
    if (k === 'abelha' && p < .75) { const f = flowers[Math.floor(Math.random() * flowers.length)]; return go(a, V(f.x, f.y + .12, f.z), 'land', r(3, 6)); }
    if (k !== 'abelha' && p < .4) { const t = rt(); return go(a, V(t.x, t.top + .3, t.z), 'land', r(5, 10)); }
    if (k === 'gralha' && p < .6) { const q = landPoint(); q.y = .3; return go(a, q, 'peck', r(4, 7)); }
    go(a, flyPoint(k), 'fly', 0);
  }
  function face(a, dx, dz, dt) {
    const ty = Math.atan2(-dz, dx);
    const da = ((ty - a.g.rotation.y + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    a.g.rotation.y += da * Math.min(1, dt * 5);
  }
  const lerp = (o, k, v, dt, s) => { o[k] += (v - o[k]) * Math.min(1, dt * s); };

  function update(dt) {
    for (const a of list) {
      const sp = a.sp, g = a.g, u = a.u, s = a.state; a.t += dt;
      if (hl.has(a.key)) {
        const sc = Math.max(1, World.camera.position.distanceTo(g.position) / 16);
        a.halo.scale.setScalar(sc); a.halo.position.y = a.halo.userData.baseY + Math.sin(a.t * 4) * .2 * sc;
      }
      /* ---- bugio: come na copa e pula entre árvores ---- */
      if (sp.kind === 'tree') {
        if (s === 'hop') {
          a.k = Math.min(1, a.k + dt / 3);
          g.position.lerpVectors(a.from, a.to, a.k); g.position.y += Math.sin(a.k * Math.PI) * 2;
          face(a, a.to.x - a.from.x, a.to.z - a.from.z, dt);
          if (a.k >= 1) st(a, 'sit', r(5, 10));
        } else {
          u.head.rotation.z = Math.sin(a.t * 3) * .12 - .15;
          if ((a.timer -= dt) < 0) { const n = rt(); a.from = g.position.clone(); a.to = treePos(n); a.k = 0; a.state = 'hop'; }
        }
        lerp(a, 'mv', s === 'hop' ? 1 : 0, dt, 5);
        u.legs.forEach((l, i) => { l.rotation.z = Math.sin(a.t * 8 + (i % 3 ? Math.PI : 0)) * .7 * a.mv; });
        continue;
      }
      let moving = false;
      if (s === 'walk' || s === 'fly') {
        const fly = sp.kind === 'fly', d = a.target.clone().sub(g.position); if (!fly) d.y = 0;
        if (d.length() < .5) { if (!a.then || a.then === 'fly') decide(a); else { a.state = a.then; a.timer = a.dur; } }
        else { d.normalize(); moving = true; g.position.addScaledVector(d, (fly ? (a.key === 'abelha' ? 3 : 3.2) : .8 + sp.top * .6) * dt); face(a, d.x, d.z, dt); }
      } else {
        if (sp.kind === 'fly' && (s === 'land' || s === 'peck')) g.position.lerp(a.target, Math.min(1, dt * 3));
        if (s === 'drink') face(a, P.x - g.position.x, P.z - g.position.z, dt);
        if ((a.timer -= dt) < 0) decide(a);
      }
      /* pose suave conforme o estado */
      const T = { graze: [1, 0], drink: [1, 0], peck: [1, 0], howl: [-.7, 0], rest: [.3, 1] }[a.state] || [0, 0];
      lerp(a.pose, 'head', T[0], dt, 4); lerp(a.pose, 'lie', T[1], dt, 2);
      lerp(a, 'mv', moving ? 1 : 0, dt, 6);
      if (u.head) u.head.rotation.z = -a.pose.head * .9 + (s === 'graze' ? Math.sin(a.t * 9) * .05 : s === 'drink' ? Math.sin(a.t * 6) * .04 : s === 'peck' ? Math.sin(a.t * 10) * .15 : 0);
      if (sp.kind === 'land') {
        u.rig.position.y = -u.lh * .78 * a.pose.lie; u.rig.scale.y = 1 + (s === 'rest' ? Math.sin(a.t * 2) * .02 : 0);
        u.legs.forEach((l, i) => { l.scale.y = 1 - .7 * a.pose.lie; l.rotation.z = Math.sin(a.t * (5 + sp.top * 2) + (i % 3 ? Math.PI : 0)) * .6 * a.mv; });
        g.position.y = sp.top < 1 ? Math.abs(Math.sin(a.t * 10)) * .25 * a.mv : Math.abs(Math.sin(a.t * 6)) * .05 * a.mv;
      } else {
        const folded = s === 'land' || s === 'peck'; lerp(a.pose, 'fold', folded ? 1 : 0, dt, 6);
        const f = a.pose.fold, fq = a.key === 'abelha' ? 40 : 14;
        u.wings.forEach((w, i) => { w.rotation.x = (i ? 1 : -1) * Math.sin(a.t * fq) * .7 * (1 - f) + (i ? -1 : 1) * 1.3 * f; });
        if (a.key === 'abelha' && !folded) g.position.y += Math.sin(a.t * 8) * .008;
      }
    }
    World.update(dt);
  }
  return { spawn, remove, count, setHighlight, update, hits };
})();
