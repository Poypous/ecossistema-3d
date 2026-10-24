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

  /* árvores e arbustos: cada tipo vive em plantas/<nome>/<nome>.js */
  const ctx = { scene, M, hsl, rnd, shade };
  const ofKind = k => Object.values(PlantRegistry).filter(p => p.kind === k);
  const trees = [], treeTypes = ofKind('tree'), wsum = treeTypes.reduce((s, p) => s + p.weight, 0);
  function pickTree() { let v = Math.random() * wsum; for (const p of treeTypes) if ((v -= p.weight) < 0) return p; return treeTypes[0]; }
  for (let n = 0; trees.length < 26 && n < 400; n++) {
    const x = rnd(-R, R), z = rnd(-R, R);
    if (Math.hypot(x, z) > R || Math.hypot(x, z) < 5 || nearPond(x, z, 3)) continue;
    trees.push({ x, z, top: pickTree().grow(ctx, x, z).top });
  }
  ofKind('bush').forEach(def => {
    for (let i = 0; i < def.count; i++) {
      const x = rnd(-R, R), z = rnd(-R, R); if (Math.hypot(x, z) > R || nearPond(x, z, 1.5)) continue;
      def.grow(ctx, x, z);
    }
  });
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

