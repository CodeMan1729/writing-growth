// ============================================================
// game.js — Three.js 场景引擎
// ============================================================
const Game = (() => {
  const SPEED      = 0.13;
  const CAM_LERP   = 0.09;
  const INTER_DIST = 5.5;

  const AREAS = [
    {id:'algebra',  name:'近世代数', color:0xA855F7, hi:0xE9D5FF, ground:0x1a0a35, cx:-42, cz:0,   w:38, d:32},
    {id:'calculus', name:'高等代数', color:0xFBBF24, hi:0xFEF08A, ground:0x2a1800, cx:22,  cz:-18, w:36, d:30},
    {id:'analysis', name:'数学分析', color:0x10B981, hi:0x6EE7B7, ground:0x002a1a, cx:22,  cz:22,  w:36, d:30},
  ];

  let renderer, scene, camera, clock;
  let playerObj = {mesh:null, x:-42, z:0};
  let keys = {};
  let monsters = [];
  let nearId = null;
  let onInteractCb = null;
  let paused = false;

  const lerp = (a,b,t) => a+(b-a)*t;
  const d2   = (x1,z1,x2,z2) => Math.sqrt((x1-x2)**2+(z1-z2)**2);
  const rr   = (a,b) => a+Math.random()*(b-a);
  const pm   = (c, op) => new THREE.MeshPhongMaterial({
    color:c, flatShading:true, shininess:80,
    transparent: op !== undefined && op < 1,
    opacity: op === undefined ? 1 : op
  });

  function init(canvas, onInteract) {
    onInteractCb = onInteract;
    renderer = new THREE.WebGLRenderer({canvas, antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = (THREE.ACESFilmicToneMapping !== undefined)
      ? THREE.ACESFilmicToneMapping : THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1.4;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08081a);
    scene.fog = new THREE.FogExp2(0x08081a, 0.007);
    clock = new THREE.Clock();

    const fr = 10, asp = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(-fr*asp, fr*asp, fr, -fr, 0.1, 600);
    camera.position.set(0, 45, 34);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0x3a2a6a, 5));
    const sun = new THREE.DirectionalLight(0xfff0c0, 3.5);
    sun.position.set(30, 60, 30); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = sun.shadow.camera.bottom = -100;
    sun.shadow.camera.right = sun.shadow.camera.top = 100;
    sun.shadow.camera.far = 300;
    scene.add(sun);
    const fillL = new THREE.DirectionalLight(0x8844ff, 1.8);
    fillL.position.set(-40, 30, -20); scene.add(fillL);
    const backL = new THREE.DirectionalLight(0x0066ff, 1.2);
    backL.position.set(0, 10, -60); scene.add(backL);

    _buildStars();
    AREAS.forEach(a => _buildContinent(a));
    _buildBridge(-42, 0, 22, -18);
    _buildBridge(22, -18, 22, 22);
    _buildPlayer();

    window.addEventListener('keydown', e => {
      keys[e.code] = true;
      if (e.code === 'KeyE' && nearId && !paused) onInteractCb && onInteractCb(nearId);
    });
    window.addEventListener('keyup', e => keys[e.code] = false);
    window.addEventListener('resize', _onResize);
    DB.getMonsters().forEach(m => spawnMonster(m));
    _loop();
  }

  function _onResize() {
    const fr = 10, asp = window.innerWidth / window.innerHeight;
    camera.left = -fr*asp; camera.right = fr*asp;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function _buildStars() {
    const N = 2500, pos = new Float32Array(N*3), cols = new Float32Array(N*3);
    const starColors = [0xffffff, 0xaaccff, 0xffddaa, 0xffaaff, 0xaaffee];
    for (let i = 0; i < N; i++) {
      pos[i*3] = rr(-300,300); pos[i*3+1] = rr(10,150); pos[i*3+2] = rr(-300,300);
      const c = new THREE.Color(starColors[Math.floor(Math.random()*starColors.length)]);
      cols[i*3] = c.r; cols[i*3+1] = c.g; cols[i*3+2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(cols, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({vertexColors:true, size:0.45, transparent:true, opacity:0.9})));
  }

  function _buildContinent(a) {
    const geo = new THREE.PlaneGeometry(a.w, a.d, 12, 10);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const ex = Math.abs(pos.getX(i)) > a.w*0.44 || Math.abs(pos.getZ(i)) > a.d*0.44;
      pos.setY(i, ex ? rr(-1,0) : rr(0,1.1));
    }
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({color:a.ground, flatShading:true, shininess:20}));
    mesh.rotation.x = -Math.PI/2; mesh.position.set(a.cx, 0, a.cz); mesh.receiveShadow = true;
    scene.add(mesh);
    const side = new THREE.Mesh(new THREE.BoxGeometry(a.w, 4, a.d), new THREE.MeshPhongMaterial({color:0x08080f, shininess:0}));
    side.position.set(a.cx, -2.1, a.cz); scene.add(side);
    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(a.w, 0.1, a.d)),
      new THREE.LineBasicMaterial({color:a.color, transparent:true, opacity:0.7})
    );
    edge.position.set(a.cx, 0.05, a.cz); scene.add(edge);
    _areaLabel(a.cx, a.cz, a);
  }

  function _areaLabel(cx, cz, a) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 60;
    const ctx = c.getContext('2d'); ctx.clearRect(0,0,256,60);
    ctx.fillStyle = '#'+a.hi.toString(16).padStart(6,'0');
    ctx.font = 'bold 26px serif'; ctx.textAlign = 'center';
    ctx.fillText(a.name, 128, 42);
    const tex = new THREE.CanvasTexture(c);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({map:tex, transparent:true, depthWrite:false}));
    sp.scale.set(8,2,1); sp.position.set(cx, 7, cz); scene.add(sp);
  }

  function _buildBridge(x1, z1, x2, z2) {
    const dx = x2-x1, dz = z2-z1;
    const len = Math.sqrt(dx*dx+dz*dz), ang = Math.atan2(dz,dx);
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(len,0.2,2.8), new THREE.MeshPhongMaterial({color:0x2a2a45, shininess:40}));
    bridge.position.set((x1+x2)/2, -0.06, (z1+z2)/2);
    bridge.rotation.y = -ang; bridge.receiveShadow = true; scene.add(bridge);
    [-1.2, 1.2].forEach(s => {
      const rg = new THREE.BufferGeometry();
      rg.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-len/2,0.35,s, len/2,0.35,s]), 3));
      bridge.add(new THREE.Line(rg, new THREE.LineBasicMaterial({color:0x5555aa})));
    });
  }

  function _buildPlayer() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.38,1.1,7), pm(0xF5C518)); body.position.y = 0.65; g.add(body);
    const head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.34,0), pm(0xFFE082)); head.position.y = 1.52; g.add(head);
    const cape = new THREE.Mesh(new THREE.ConeGeometry(0.38,0.75,5), pm(0x7C3AED)); cape.position.set(0,0.38,0.1); cape.rotation.x = 0.3; g.add(cape);
    [-0.2, 0.2].forEach(sx => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.08,0.55,5), pm(0xD97706)); leg.position.set(sx,0.1,0); g.add(leg);
    });
    const glow = new THREE.PointLight(0xF5C518,2.5,9); glow.position.y = 1; g.add(glow);
    const glow2 = new THREE.PointLight(0xFF6600,1.2,5); glow2.position.y = 0.3; g.add(glow2);
    g.position.set(playerObj.x, 0, playerObj.z); g.castShadow = true;
    scene.add(g); playerObj.mesh = g; playerObj.glow = glow;
  }

  function _monsterBody(group, diff, color, dead) {
    const op = dead ? 0.5 : 1.0;
    const lm = (c) => new THREE.MeshPhongMaterial({color:c, flatShading:true, shininess:90, transparent:dead, opacity:op});
    if (diff === 1) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.44,6,5), lm(color)); b.position.y = 0.7; group.add(b);
      [-0.38, 0.38].forEach(sx => {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.05,0.55,4), lm(color));
        arm.position.set(sx,0.6,0); arm.rotation.z = sx>0?0.5:-0.5; group.add(arm);
      });
    } else if (diff === 2) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.7,0.8,0.5), lm(color)); b.position.y = 0.65; group.add(b);
      const h = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.5), lm(color)); h.position.y = 1.28; group.add(h);
      [-0.22, 0.22].forEach(sx => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2,0.5,0.2), lm(color)); leg.position.set(sx,0.15,0); group.add(leg);
      });
    } else if (diff === 3) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.36,0.42,1.1,6), lm(color)); b.position.y = 0.8; group.add(b);
      const h = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38,0), lm(color)); h.position.y = 1.7; group.add(h);
      [-0.58, 0.58].forEach(sx => {
        const sh = new THREE.Mesh(new THREE.SphereGeometry(0.22,5,4), lm(color)); sh.position.set(sx,1.15,0); group.add(sh);
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.08,0.65,5), lm(color));
        arm.position.set(sx*1.1,0.72,0); arm.rotation.z = sx>0?0.4:-0.4; group.add(arm);
      });
    } else if (diff === 4) {
      const b = new THREE.Mesh(new THREE.OctahedronGeometry(0.65,0), lm(color)); b.position.y = 1.05; group.add(b);
      const h = new THREE.Mesh(new THREE.TetrahedronGeometry(0.4,0), lm(color)); h.position.y = 2.05; group.add(h);
      [[-0.72,0.92],[0.72,0.92],[-0.42,0.12],[0.42,0.12]].forEach(([sx,sy]) => {
        const limb = new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.07,0.78,4), lm(color));
        limb.position.set(sx,sy,0); limb.rotation.z = sx>0?0.6:-0.6; group.add(limb);
      });
    } else {
      const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.78,0), lm(color)); b.position.y = 1.25; group.add(b);
      const crown = new THREE.Mesh(new THREE.ConeGeometry(0.55,0.65,5), lm(color)); crown.position.y = 2.3; group.add(crown);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.52,0.68,0.5,6), lm(color)); base.position.y = 0.32; group.add(base);
      const orbits = [];
      for (let i = 0; i < 4; i++) {
        const ang = (i/4)*Math.PI*2;
        const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.18,0), lm(color));
        orb.position.set(Math.cos(ang)*1.25, 1.25, Math.sin(ang)*1.25);
        orb.userData = {orbitAngle:ang, orbitR:1.25, orbitSpeed:0.9};
        group.add(orb); orbits.push(orb);
      }
      group.userData.orbits = orbits;
    }
  }

  function spawnMonster(data) {
    const {id, meta, world, kill} = data;
    const old = monsters.find(m => m.id === id);
    if (old) { scene.remove(old.group); monsters = monsters.filter(m => m.id !== id); }
    const area = AREAS.find(a => a.id === meta.domain) || AREAS[0];
    const dead = !!kill;
    const cursed = dead && kill.method === 'cheated';
    const baseColor = dead ? (cursed ? 0x7f1d1d : 0x14532d) : area.color;
    const group = new THREE.Group();
    _monsterBody(group, meta.difficulty, baseColor, dead);
    const nc = document.createElement('canvas'); nc.width = 340; nc.height = 76;
    const nctx = nc.getContext('2d'); nctx.clearRect(0,0,340,76);
    const labelColor = dead ? (cursed?'#EF4444':'#22C55E') : '#'+area.hi.toString(16).padStart(6,'0');
    nctx.fillStyle = labelColor; nctx.font = 'bold 22px serif'; nctx.textAlign = 'center';
    nctx.fillText(meta.name.slice(0,16), 170, 30);
    nctx.fillStyle = '#64748B'; nctx.font = '18px monospace';
    nctx.fillText('★'.repeat(meta.difficulty)+'☆'.repeat(5-meta.difficulty), 170, 58);
    const ntex = new THREE.CanvasTexture(nc);
    const nsp = new THREE.Sprite(new THREE.SpriteMaterial({map:ntex, transparent:true, depthWrite:false}));
    const lh = 1.4 + meta.difficulty * 0.38;
    nsp.scale.set(5.5, 1.15, 1);
    nsp.position.y = lh + 1.3;
    // 已击杀怪物不显示名字标牌
    if (!dead) group.add(nsp);

    if (!dead) {
      const pl = new THREE.PointLight(area.color, 2.0, 10); pl.position.y = 1.2; group.add(pl);
      const pl2 = new THREE.PointLight(area.hi || area.color, 0.8, 6); pl2.position.set(0, 2.5, 0); group.add(pl2);
    }

    if (dead) { group.rotation.z = Math.PI/2.1; group.position.y = -0.2; }
    group.position.set(world.position.x, dead ? -0.2 : 0, world.position.z);
    scene.add(group);

    monsters.push({
      id, group,
      bx: world.position.x, bz: world.position.z,
      x:  world.position.x, z:  world.position.z,
      patrol: world.patrol && !dead,   // 已击杀强制静止
      pr: world.patrol_radius || 3,
      ptimer: 0,
      ptarget: {x: world.position.x, z: world.position.z},
      orbits: group.userData.orbits || [],
      dead: dead   // 死亡标记，loop 中禁止自转
    });
  }

  function _updatePatrol(m, dt) {
    if (!m.patrol) return;
    m.ptimer -= dt;
    if (m.ptimer <= 0) {
      const ang = Math.random() * Math.PI * 2;
      const r = Math.random() * m.pr;
      m.ptarget = {x: m.bx + Math.cos(ang)*r, z: m.bz + Math.sin(ang)*r};
      m.ptimer = 2 + Math.random() * 3;
    }
    const dx = m.ptarget.x - m.x, dz = m.ptarget.z - m.z;
    const dist = Math.sqrt(dx*dx + dz*dz);
    if (dist > 0.1) {
      m.x += dx/dist * 0.04; m.z += dz/dist * 0.04;
      m.group.position.set(m.x, 0, m.z);
      m.group.rotation.y = Math.atan2(dx, dz);
    }
  }

  function _loop() {
    requestAnimationFrame(_loop);
    if (paused) return;
    const dt = clock.getDelta();
    const t  = clock.getElapsedTime();

    let dx = 0, dz = 0;
    if (keys['KeyW'] || keys['ArrowUp'])    dz -= SPEED;
    if (keys['KeyS'] || keys['ArrowDown'])  dz += SPEED;
    if (keys['KeyA'] || keys['ArrowLeft'])  dx -= SPEED;
    if (keys['KeyD'] || keys['ArrowRight']) dx += SPEED;

    if (dx !== 0 || dz !== 0) {
      const len = Math.sqrt(dx*dx + dz*dz);
      dx /= len; dz /= len;
      playerObj.x += dx * SPEED;
      playerObj.z += dz * SPEED;
      playerObj.mesh.position.set(playerObj.x, Math.sin(t*8)*0.04, playerObj.z);
      playerObj.mesh.rotation.y = Math.atan2(dx, dz);
    }

    if (playerObj.glow) playerObj.glow.intensity = 2.0 + Math.sin(t*2) * 0.8;

    const camOffX = playerObj.x;
    const camOffZ = playerObj.z + 34;
    camera.position.x = lerp(camera.position.x, camOffX, CAM_LERP);
    camera.position.z = lerp(camera.position.z, camOffZ, CAM_LERP);
    camera.lookAt(playerObj.x, 0, playerObj.z);

    nearId = null;
    monsters.forEach(m => {
      _updatePatrol(m, dt);
      m.orbits.forEach(orb => {
        orb.userData.orbitAngle += orb.userData.orbitSpeed * dt;
        orb.position.x = Math.cos(orb.userData.orbitAngle) * orb.userData.orbitR;
        orb.position.z = Math.sin(orb.userData.orbitAngle) * orb.userData.orbitR;
      });
      if (!m.patrol && !m.dead) m.group.rotation.y = t * 0.5;
      const dist = d2(playerObj.x, playerObj.z, m.x, m.z);
      if (dist < INTER_DIST) {
        const md = DB.getMonster(m.id);
        if (md && !md.kill) nearId = m.id;
      }
    });

    const prompt = document.getElementById('interact-prompt');
    if (nearId) {
      const md = DB.getMonster(nearId);
      if (md) { prompt.querySelector('.pname').textContent = md.meta.name; prompt.classList.add('show'); }
    } else {
      prompt.classList.remove('show');
    }

    let curArea = null;
    for (const a of AREAS) {
      if (Math.abs(playerObj.x - a.cx) < a.w/2+2 && Math.abs(playerObj.z - a.cz) < a.d/2+2) { curArea = a; break; }
    }
    const areaEl = document.getElementById('hud-area');
    if (areaEl) areaEl.textContent = curArea ? curArea.name : '虚空';

    renderer.render(scene, camera);
    drawMinimap();
  }

  function drawMinimap() {
    const mc = document.getElementById('minimap-canvas');
    if (!mc) return;
    const ctx = mc.getContext('2d');
    const W = mc.width, H = mc.height, SCALE = 0.9;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(5,5,8,0.85)'; ctx.fillRect(0, 0, W, H);
    const wx = (x) => W/2 + (x - playerObj.x) * SCALE;
    const wz = (z) => H/2 + (z - playerObj.z) * SCALE;
    AREAS.forEach(a => {
      ctx.fillStyle   = '#' + a.color.toString(16).padStart(6,'0') + '33';
      ctx.strokeStyle = '#' + a.color.toString(16).padStart(6,'0') + '88';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.rect(wx(a.cx-a.w/2), wz(a.cz-a.d/2), a.w*SCALE, a.d*SCALE);
      ctx.fill(); ctx.stroke();
    });
    monsters.forEach(m => {
      const md = DB.getMonster(m.id);
      ctx.beginPath(); ctx.arc(wx(m.x), wz(m.z), 2.5, 0, Math.PI*2);
      ctx.fillStyle = (md && md.kill) ? '#334155' : '#EF4444'; ctx.fill();
    });
    ctx.beginPath(); ctx.arc(W/2, H/2, 4, 0, Math.PI*2);
    ctx.fillStyle = '#F5C518'; ctx.fill();
  }

  function setPaused(v) { paused = v; }
  function refreshMonster(id) { const md = DB.getMonster(id); if (md) spawnMonster(md); }
  function getPlayerPos() { return {x: playerObj.x, z: playerObj.z}; }
  function getAreas() { return AREAS; }

  return { init, spawnMonster, refreshMonster, setPaused, getPlayerPos, getAreas };
})();