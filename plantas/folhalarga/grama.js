/* ============================================================
   Grama: tudo sobre o gramado fica nesta pasta.
   kind: 'ground' · tufos de grama espalhados pelo chão
   Arquivos desta pasta:
     modelo.js  os 23 tufos (stones_and_grass.glb otimizado e embutido; não precisa editar)
     grama.js   este arquivo: quantidade, tamanho e cor
   grow(ctx) é chamado uma vez pelo world.js e espalha os tufos pelo chão.
   ============================================================ */

/* Carrega o modelo uma única vez (só quando o mundo pedir a grama) e prepara as malhas dos tufos.
   Se o index.html não tiver o GLTFLoader, ele é baixado aqui mesmo; assim a ordem dos scripts não importa. */
const GramaModelo = (() => {
  let tufos = null, iniciou = false; const fila = [];
  const URL_GLTF = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
  const bytes = s => { const b = atob(s), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u.buffer; };
  const garantirLoader = cb => {
    if (THREE.GLTFLoader) return cb();
    const s = document.createElement('script'); s.src = URL_GLTF; s.onload = cb;
    s.onerror = () => console.error('Grama: não foi possível baixar o GLTFLoader (' + URL_GLTF + '). Verifique a internet ou adicione esse <script> no index.html.');
    document.head.appendChild(s);
  };
  const carregar = () => {
    if (iniciou) return; iniciou = true;
    if (typeof GRAMA_GLB === 'undefined') { console.error('Grama: GRAMA_GLB não encontrado. Confira se o modelo.js está no index.html.'); return; }
    garantirLoader(() => new THREE.GLTFLoader().parse(bytes(GRAMA_GLB), '', gltf => {
      const lista = [];
      gltf.scene.traverse(o => {
        if (!o.isMesh) return;
        const g = o.geometry, p = g.attributes.position, n = new Float32Array(p.count * 3);
        for (let i = 0; i < p.count; i++) {      /* normais apontando para cima (e um pouco para fora): sombreado suave */
          const x = p.getX(i) * 2, z = p.getZ(i) * 2, l = Math.hypot(x, 1, z);
          n[i * 3] = x / l; n[i * 3 + 1] = 1 / l; n[i * 3 + 2] = z / l;
        }
        g.setAttribute('normal', new THREE.BufferAttribute(n, 3));
        const m = o.material;
        m.side = THREE.DoubleSide; m.roughness = 1;
        m.emissive = new THREE.Color(0xffffff); m.emissiveMap = m.map; m.emissiveIntensity = .22;   /* evita lado escuro */
        lista.push({ geometry: g, material: m });
      });
      tufos = lista; fila.splice(0).forEach(f => f(lista));
    }, e => console.error('Não foi possível carregar a grama:', e)));
  };
  return { quando: f => { carregar(); tufos ? f(tufos) : fila.push(f); } };
})();

registerPlant('grama', {
  kind: 'ground',
  count: 1600,   /* quantidade total de tufos (cada um tem ~500 triângulos; reduza se o navegador ficar pesado) */

  grow(ctx) {
    const { scene, rnd } = ctx, R = ctx.R ?? 75, nearPond = ctx.nearPond || (() => false);   /* valores padrão se o world.js não fornecer */
    GramaModelo.quando(tufos => {
      const por = Math.ceil(this.count / tufos.length), d = new THREE.Object3D(), cor = new THREE.Color();
      tufos.forEach(t => {                      /* uma malha instanciada por modelo de tufo (23 no total) */
        const im = new THREE.InstancedMesh(t.geometry, t.material, por);
        for (let i = 0; i < por; i++) {
          let x, z;
          do { x = rnd(-R - 6, R + 6); z = rnd(-R - 6, R + 6); } while (Math.hypot(x, z) > R + 6 || nearPond(x, z, .3));
          d.position.set(x, 0, z);
          d.rotation.set(rnd(-.12, .12), rnd(0, 6.28), rnd(-.12, .12));
          d.scale.setScalar(rnd(2.6, 4.2));     /* tamanho do tufo (o modelo original é pequeno) */
          d.updateMatrix(); im.setMatrixAt(i, d.matrix);
          im.setColorAt(i, cor.setRGB(rnd(.8, 1.05), rnd(.85, 1.1), rnd(.7, .95)));   /* variação de tom */
        }
        im.frustumCulled = false; im.receiveShadow = true; scene.add(im);
      });
    });
  }
});
