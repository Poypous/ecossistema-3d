/* Motor dos animais: criar, remover, destacar e animar. O comportamento de cada espécie vem de animais/<nome>/<nome>.js */
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
    const sp = SPECIES[key], def = Registry[key], g = def.build(sp);
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
    const a = { key, sp, def, g, hit, halo, u: g.userData, t: Math.random() * 10, timer: r(0, 3), state: 'idle', pose: { head: 0, lie: 0, fold: 0 }, mv: 0, tree: null };
    hit.userData.animal = a;
    if (def.init) def.init(a, H);
    else if (sp.kind === 'land') { g.position.copy(landPoint()); decide(a); }
    else { g.position.copy(flyPoint(key)); go(a, flyPoint(key), 'fly', 0); }
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
  const decide = a => Registry[a.key].decide(a, H);   /* cada animal decide o que fazer em animais/<nome>/<nome>.js */
  function face(a, dx, dz, dt) {
    const ty = Math.atan2(-dz, dx);
    const da = ((ty - a.g.rotation.y + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    a.g.rotation.y += da * Math.min(1, dt * 5);
  }
  const lerp = (o, k, v, dt, s) => { o[k] += (v - o[k]) * Math.min(1, dt * s); };
  const H = { go, st, r, V, face, lerp, decide, landPoint, flyPoint, pondPt, rt, treePos, trees, flowers, POND: P, R };

  function update(dt) {
    for (const a of list) {
      const sp = a.sp, def = a.def, g = a.g, u = a.u, s = a.state; a.t += dt;
      if (hl.has(a.key)) {
        const sc = Math.max(1, World.camera.position.distanceTo(g.position) / 16);
        a.halo.scale.setScalar(sc); a.halo.position.y = a.halo.userData.baseY + Math.sin(a.t * 4) * .2 * sc;
      }
      if (def.update) { def.update(a, dt, H); continue; }   /* animal com movimento próprio (ex.: bugio) */
      let moving = false;
      if (s === 'walk' || s === 'fly') {
        const fly = sp.kind === 'fly', d = a.target.clone().sub(g.position); if (!fly) d.y = 0;
        if (d.length() < .5) { if (!a.then || a.then === 'fly') decide(a); else { a.state = a.then; a.timer = a.dur; } }
        else { d.normalize(); moving = true; g.position.addScaledVector(d, (def.speed || (fly ? 3.2 : .8 + sp.top * .6)) * dt); face(a, d.x, d.z, dt); }
      } else {
        if (sp.kind === 'fly' && (s === 'land' || s === 'peck')) g.position.lerp(a.target, Math.min(1, dt * 3));
        if (s === 'drink') face(a, P.x - g.position.x, P.z - g.position.z, dt);
        if ((a.timer -= dt) < 0) decide(a);
      }
      /* pose suave conforme o estado */
      const T = Object.assign({ graze: [1, 0], drink: [1, 0], peck: [1, 0], howl: [-.7, 0], rest: [.3, 1] }, def.poses)[a.state] || [0, 0];
      lerp(a.pose, 'head', T[0], dt, 4); lerp(a.pose, 'lie', T[1], dt, 2);
      lerp(a, 'mv', moving ? 1 : 0, dt, 6);
      if (u.head) u.head.rotation.z = -a.pose.head * .9 + (s === 'graze' ? Math.sin(a.t * 9) * .05 : s === 'drink' ? Math.sin(a.t * 6) * .04 : s === 'peck' ? Math.sin(a.t * 10) * .15 : 0);
      if (sp.kind === 'land') {
        u.rig.position.y = -u.lh * .78 * a.pose.lie; u.rig.scale.y = 1 + (s === 'rest' ? Math.sin(a.t * 2) * .02 : 0);
        u.legs.forEach((l, i) => { l.scale.y = 1 - .7 * a.pose.lie; l.rotation.z = Math.sin(a.t * (5 + sp.top * 2) + (i % 3 ? Math.PI : 0)) * .6 * a.mv; });
        g.position.y = sp.top < 1 ? Math.abs(Math.sin(a.t * 10)) * .25 * a.mv : Math.abs(Math.sin(a.t * 6)) * .05 * a.mv;
      } else {
        const folded = s === 'land' || s === 'peck'; lerp(a.pose, 'fold', folded ? 1 : 0, dt, 6);
        const f = a.pose.fold, fq = def.flap || 14;
        u.wings.forEach((w, i) => { w.rotation.x = (i ? 1 : -1) * Math.sin(a.t * fq) * .7 * (1 - f) + (i ? -1 : 1) * 1.3 * f; });
        if (def.hover && !folded) g.position.y += Math.sin(a.t * 8) * .008;
      }
    }
    World.update(dt);
  }
  return { spawn, remove, count, setHighlight, update, hits };
})();
