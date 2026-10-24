/* ============================================================
   Gralha-azul: tudo sobre este animal fica nesta pasta.
   Seções: 1) dados e card · 2) ícone · 3) modelo 3D · 4) comportamento
   ============================================================ */
registerAnimal('gralha', {

  /* 1) DADOS: card informativo, quantidade inicial/máxima, cor do destaque e área de clique */
  data: {
      name: "Gralha-azul",
      sci: "Cyanocorax caeruleus",
      diet: "Onívora",
      role: "Dispersora de araucárias",
      habitat: "Matas com araucária do Sul do Brasil.",
      desc: "Ave símbolo do Paraná. Enterra pinhões no chão e, ao esquecer alguns, ajuda a espalhar as araucárias.",
      fact: "É considerada a principal dispersora das sementes de araucária.",
      qty: 6,
      max: 24,
      color: "#7e57c2",
      hit: 0.7,
      hy: 0,
      top: 0.9,
      kind: "fly"
  },

  /* 2) ÍCONE (legenda e card) */
  icon: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 40l-6 4 14-4z" fill="#1a3a8f"/><ellipse cx="22" cy="29" rx="13" ry="11" fill="#2a56c7" transform="rotate(-15 22 29)"/><path d="M12 26c6-8 18-6 22 2-8-2-16-1-22-2z" fill="#1a3a8f"/><circle cx="31" cy="17" r="8" fill="#0f1a3d"/><path d="M26 10l2-8 5 8z" fill="#0f1a3d"/><path d="M37 16l8 3-8 2z" fill="#2b2b2b"/><circle cx="32" cy="15" r="1.8" fill="#fff"/><circle cx="32.4" cy="15" r=".9" fill="#000"/></svg>`,

  /* 3) MODELO 3D */
  build(sp) {
    const { E, CY, M } = Kit, u = sp.top, g = new THREE.Group(), rig = new THREE.Group(); g.add(rig);
    const A = 0x2a56c7, B = 0x0f1a3d;
    E(A, u * .42, u * .26, u * .26, 0, 0, 0, rig); E(B, u * .3, u * .2, u * .22, u * .1, -u * .06, 0, rig); E(A, u * .4, u * .04, u * .14, -u * .65, 0, 0, rig);
    const hp = new THREE.Group(); hp.position.set(u * .38, u * .12, 0); rig.add(hp);
    E(B, u * .2, u * .19, u * .18, u * .08, 0, 0, hp);
    const bk = new THREE.Mesh(new THREE.ConeGeometry(u * .06, u * .26, 6), M(0x2b2b2b));
    bk.rotation.z = -Math.PI / 2; bk.position.set(u * .32, -u * .02, 0); hp.add(bk);
    const cr = new THREE.Mesh(new THREE.ConeGeometry(u * .07, u * .25, 5), M(B)); cr.position.set(0, u * .22, 0); hp.add(cr);
    [1, -1].forEach(s => { E(0xffffff, u * .04, u * .04, u * .04, u * .16, u * .05, u * .13 * s, hp); CY(0x555555, u * .015, u * .2, 0, -u * .3, u * .08 * s, 0, 0, rig); });
    g.userData = { wings: Kit.wings(rig, u, A), head: hp, rig };
    return g;
  },

  /* 4) COMPORTAMENTO: pousa nas árvores, desce ao chão para bicar (enterrar pinhão) e voa. */
  decide(a, H) {
    const p = Math.random();
    if (p < .4) { const t = H.rt(); return H.go(a, H.V(t.x, t.top + .3, t.z), 'land', H.r(5, 10)); }
    if (p < .6) { const q = H.landPoint(); q.y = .3; return H.go(a, q, 'peck', H.r(4, 7)); }
    H.go(a, H.flyPoint('gralha'), 'fly', 0);
  }
});
