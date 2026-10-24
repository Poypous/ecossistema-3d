/* Peças reutilizáveis: E=elipsoide, CY=cilindro, land=corpo de quadrúpede, wings=asas. */
const Kit = (() => {
  const M = World.M;
  const E = (c, sx, sy, sz, x, y, z, p) => { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), M(c)); m.scale.set(sx, sy, sz); m.position.set(x, y, z); p.add(m); return m; };
  const CY = (c, r, l, x, y, z, rx, rz, p) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r * .7, r, l, 5), M(c)); m.position.set(x, y, z); m.rotation.set(rx, 0, rz); p.add(m); return m; };
  function land(c, sp) {
    const u = sp.top, [A, B, C] = c.c, g = new THREE.Group(), rig = new THREE.Group(); g.add(rig);
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
    E(c.puff ? 0xffffff : (c.tailA ? A : B), tl * .5, tr * 1.4, tr * 1.4, -bx - tl * .35, yb + by * .3, 0, rig);
    g.userData = { legs, head: hp, rig, lh };
    return g;
  }
  /* asas articuladas (par de pivôs) para animais que voam */
  function wings(rig, u, color, o) {
    o = o || {}; const arr = [];
    [1, -1].forEach(s => {
      const p = new THREE.Group(); p.position.set(0, u * .12, u * .12 * s);
      [[.28, .18, .2], [.22, .42, .17]].forEach(([w, z, l]) => {
        const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), M(color, { transparent: !!o.glass, opacity: o.glass ? .6 : 1 }));
        m.scale.set(u * w, u * .025, u * l); m.position.set(0, 0, u * z * s); p.add(m);
      });
      rig.add(p); arr.push(p);
    });
    return arr;
  }
  return { M, E, CY, land, wings };
})();
