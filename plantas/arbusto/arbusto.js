/* ============================================================
   Arbusto: tudo sobre esta planta fica nesta pasta.
   kind: 'bush' · moita baixa espalhada pelo chão
   grow(ctx, x, z) cria o modelo na posição (x, z) e devolve nada
   ============================================================ */
registerPlant('arbusto', {
  kind: 'bush',
  count: 30,   /* quantos tentar espalhar */

  grow(ctx, x, z) {
    const { scene, M, hsl, rnd, shade } = ctx;
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(rnd(.5, 1), 1), M(hsl(rnd(.25, .34), .5, rnd(.2, .3))));
    b.scale.y = .7; b.position.set(x, .4, z); shade(b); scene.add(b);
  }
});
