/* ============================================================
   Árvore de folha larga: tudo sobre esta planta fica nesta pasta.
   kind: 'tree' · copa redonda feita de várias bolas de folhagem
   grow(ctx, x, z) cria o modelo na posição (x, z) e devolve { top } (altura para pouso/bugios)
   ============================================================ */
registerPlant('folhalarga', {
  kind: 'tree',
  weight: 2,   /* chance relativa de aparecer */

  grow(ctx, x, z) {
    const { scene, M, hsl, rnd, shade } = ctx;
    const h = rnd(4, 7), t = new THREE.Group();   /* altura do tronco */
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(.25, .42, h, 7), M(0x6b4a2b)); tr.position.y = h / 2; t.add(tr);
    for (let i = 0; i < 4; i++) {   /* bolas de folhagem */
      const c = new THREE.Mesh(new THREE.IcosahedronGeometry(h * rnd(.28, .38), 1), M(hsl(rnd(.25, .36), .5, rnd(.24, .34))));
      c.position.set(rnd(-1.3, 1.3), h + rnd(-.5, 1), rnd(-1.3, 1.3)); t.add(c);
    }
    t.position.set(x, 0, z); shade(t); scene.add(t);
    return { top: h + 1.2 };
  }
});
