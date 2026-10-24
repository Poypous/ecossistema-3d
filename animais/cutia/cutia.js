/* ============================================================
   Cutia: tudo sobre este animal fica nesta pasta.
   Seções: 1) dados e card · 2) ícone · 3) modelo 3D · 4) comportamento
   ============================================================ */
registerAnimal('cutia', {

  /* 1) DADOS: card informativo, quantidade inicial/máxima, cor do destaque e área de clique */
  data: {
      name: "Cutia",
      sci: "Dasyprocta azarae",
      diet: "Herbívoro (frugívoro)",
      role: "Dispersora de sementes",
      habitat: "Chão da floresta, perto de árvores frutíferas.",
      desc: "Roedor que procura alimento no chão da mata. Enterra sementes e esquece parte delas, ajudando a floresta a se regenerar.",
      fact: "É uma das principais responsáveis por espalhar o pinhão da araucária.",
      qty: 7,
      max: 30,
      color: "#26c6da",
      hit: 0.65,
      hy: 0.4,
      top: 0.9,
      kind: "land"
  },

  /* 2) ÍCONE (legenda e card) */
  icon: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="11" cy="16" r="5" fill="#6b4423"/><circle cx="37" cy="16" r="5" fill="#6b4423"/><ellipse cx="24" cy="28" rx="16" ry="14" fill="#8a5a2b"/><path d="M12 22c4-6 20-6 24 0-4-2-20-2-24 0z" fill="#c98c3a"/><ellipse cx="24" cy="36" rx="8" ry="5.5" fill="#e0c9a0"/><circle cx="17" cy="27" r="2" fill="#1b1b1b"/><circle cx="31" cy="27" r="2" fill="#1b1b1b"/><ellipse cx="24" cy="33" rx="2.4" ry="1.7" fill="#1b1b1b"/></svg>`,

  /* 3) MODELO 3D (medidas em múltiplos da altura 'top'; c = cores [corpo, claro, escuro]) */
  build(sp) {
    return Kit.land({ body: [.5, .27, .22], lh: .26, neck: .06, head: [.19, .16, .13], snout: .09,
      ear: [.04, .06], tail: [.05, .05], legs: .05, c: [0x8a5a2b, 0xe0c9a0, 0x4a2f15] }, sp);
  },

  /* 4) COMPORTAMENTO: pasta, bebe água na lagoa ou caminha. Não foge de ninguém. */
  decide(a, H) {
    const p = Math.random();
    if (p < .5) return H.st(a, 'graze', H.r(5, 10));
    if (p < .68) return H.go(a, H.pondPt(), 'drink', H.r(3, 6));
    H.go(a, H.landPoint(), 'idle', H.r(1, 2));
  }
});
