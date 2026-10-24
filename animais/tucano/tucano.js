/* ============================================================
   Tucano: tudo sobre este animal fica nesta pasta.
   Seções: 1) dados e card · 2) ícone · 3) modelo 3D · 4) comportamento
   ============================================================ */
registerAnimal('tucano', {

  /* 1) DADOS: card informativo, quantidade inicial/máxima, cor do destaque e área de clique */
  data: {
      name: "Tucano",
      sci: "Ramphastos toco",
      diet: "Frugívoro",
      role: "Dispersor de sementes",
      habitat: "Copas das árvores e bordas de floresta.",
      desc: "Ave de grande bico colorido que engole frutos inteiros e espalha as sementes por onde voa.",
      fact: "O bico é leve e ajuda a controlar a temperatura do corpo da ave.",
      qty: 7,
      max: 24,
      color: "#42a5f5",
      hit: 0.9,
      hy: 0,
      top: 1.1,
      kind: "fly"
  },

  /* 2) ÍCONE (legenda e card) */
  icon: `<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="18" cy="28" rx="11" ry="14" fill="#1a1a22"/><path d="M12 36l-4 9 8-4z" fill="#1a1a22"/><circle cx="21" cy="14" r="8" fill="#1a1a22"/><ellipse cx="22" cy="21" rx="6" ry="5" fill="#fff"/><path d="M26 10c10-1 19 3 20 8-1 4-10 6-20 4z" fill="#ff8c00"/><path d="M26 17c8 1 15 0 19 0-3 3-11 5-19 3z" fill="#ffd23f"/><circle cx="22" cy="12" r="2.4" fill="#fff"/><circle cx="22.6" cy="12" r="1.1" fill="#111"/><path d="M13 36c2 5 7 5 9 5" stroke="#d64045" stroke-width="2.4" fill="none"/></svg>`,

  /* 3) MODELO 3D */
  build(sp) {
    const { E, CY, M } = Kit, u = sp.top, g = new THREE.Group(), rig = new THREE.Group(); g.add(rig);
    const A = 0x1a1a22, B = 0xffffff;
    E(A, u * .42, u * .26, u * .26, 0, 0, 0, rig); E(B, u * .3, u * .2, u * .22, u * .1, -u * .06, 0, rig); E(A, u * .4, u * .04, u * .14, -u * .65, 0, 0, rig);
    const hp = new THREE.Group(); hp.position.set(u * .38, u * .12, 0); rig.add(hp);
    E(A, u * .2, u * .19, u * .18, u * .08, 0, 0, hp); E(B, u * .12, u * .1, u * .18, u * .05, -u * .12, 0, hp);
    const bk = new THREE.Mesh(new THREE.ConeGeometry(u * .12, u * .6, 6), M(0xff8c00));
    bk.rotation.z = -Math.PI / 2; bk.position.set(u * .5, -u * .02, 0); hp.add(bk);
    [1, -1].forEach(s => { E(0xffffff, u * .04, u * .04, u * .04, u * .16, u * .05, u * .13 * s, hp); CY(0x555555, u * .015, u * .2, 0, -u * .3, u * .08 * s, 0, 0, rig); });
    g.userData = { wings: Kit.wings(rig, u, A), head: hp, rig };
    return g;
  },

  /* 4) COMPORTAMENTO: voa e pousa no topo das árvores. */
  decide(a, H) {
    if (Math.random() < .4) { const t = H.rt(); return H.go(a, H.V(t.x, t.top + .3, t.z), 'land', H.r(5, 10)); }
    H.go(a, H.flyPoint('tucano'), 'fly', 0);
  }
});
