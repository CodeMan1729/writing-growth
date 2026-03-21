// ============================================================
// ui.js — 战斗面板、武器库、创建怪物、HUD更新
// ============================================================
const UI = (() => {

  // ── 击杀音效 (Web Audio API) ──
  let _audioCtx = null;
  function _getAudio(){
    if(!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return _audioCtx;
  }
  function _playTone(freq, type, dur, vol, freqEnd){
    try{
      var ctx = _getAudio(), osc = ctx.createOscillator(), g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if(freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + dur);
      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + dur);
    }catch(e){}
  }

  // 独立击杀：胜利号角，三音上升
  function _soundKillIndependent(){
    _playTone(440, 'sine', 0.12, 0.3, 660);
    setTimeout(function(){ _playTone(660, 'sine', 0.15, 0.28, 880); }, 120);
    setTimeout(function(){ _playTone(880, 'sine', 0.08, 0.22, 1100); }, 250);
    setTimeout(function(){ _playTone(1100, 'sine', 0.3, 0.35); }, 350);
    setTimeout(function(){ _playTone(523, 'triangle', 0.4, 0.18); }, 420);
  }

  // 提示击杀：柔和双音
  function _soundKillHinted(){
    _playTone(392, 'sine', 0.18, 0.22, 523);
    setTimeout(function(){ _playTone(523, 'sine', 0.25, 0.2, 659); }, 200);
    setTimeout(function(){ _playTone(659, 'sine', 0.2, 0.15); }, 400);
  }

  // 外挂击杀：低沉压抑的不和谐音
  function _soundKillCheated(){
    _playTone(220, 'sawtooth', 0.15, 0.25, 160);
    setTimeout(function(){ _playTone(180, 'sawtooth', 0.2, 0.2, 100); }, 130);
    setTimeout(function(){ _playTone(130, 'square', 0.3, 0.15, 80); }, 280);
  }

  // ── 击杀特效浮层 ──
  var KILL_FX = {
    independent: { icon:'⚔', label:'独立击杀', color:'#00FF99', bg:'rgba(0,255,153,0.13)', border:'rgba(0,255,153,0.6)' },
    hinted:      { icon:'💡', label:'提示击杀', color:'#FFD700', bg:'rgba(255,215,0,0.11)',  border:'rgba(255,215,0,0.5)'  },
    cheated:     { icon:'☠',  label:'外挂击杀', color:'#FF4466', bg:'rgba(255,68,102,0.11)', border:'rgba(255,68,102,0.5)' }
  };

  function _showKillFX(method, xp){
    var fx = KILL_FX[method] || KILL_FX.independent;
    var el = document.createElement('div');
    el.style.cssText = [
      'position:fixed','top:50%','left:50%',
      'transform:translate(-50%,-50%) scale(0.4)',
      'z-index:700','pointer-events:none','text-align:center',
      'background:' + fx.bg,
      'border:2px solid ' + fx.border,
      'border-radius:16px','padding:32px 48px',
      'box-shadow:0 0 60px ' + fx.border + ',0 0 120px ' + fx.bg,
      'animation:killFxIn 0.45s cubic-bezier(.17,.67,.35,1.3) forwards'
    ].join(';');
    el.innerHTML = '<div style="font-size:3.5rem;line-height:1;margin-bottom:10px">' + fx.icon + '</div>'
      + '<div style="font-family:var(--font-title);font-size:1.6rem;color:' + fx.color + ';letter-spacing:.15em;text-shadow:0 0 20px ' + fx.color + '">' + fx.label + '</div>'
      + (xp > 0 ? '<div style="font-family:var(--font-mono);font-size:1rem;color:' + fx.color + ';margin-top:8px;opacity:.9">+' + xp + ' XP</div>' : '<div style="font-family:var(--font-mono);font-size:.85rem;color:' + fx.color + ';margin-top:8px;opacity:.7">0 XP · 诅咒标记</div>');
    // 注入关键帧
    if(!document.getElementById('kill-fx-style')){
      var s = document.createElement('style');
      s.id = 'kill-fx-style';
      s.textContent = '@keyframes killFxIn{0%{opacity:0;transform:translate(-50%,-50%) scale(0.4)}60%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}80%{transform:translate(-50%,-50%) scale(0.96)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}'
        + '@keyframes killFxOut{from{opacity:1}to{opacity:0;transform:translate(-50%,-60%) scale(1.05)}}';
      document.head.appendChild(s);
    }
    document.body.appendChild(el);
    setTimeout(function(){
      el.style.animation = 'killFxOut 0.4s ease forwards';
      setTimeout(function(){ el.remove(); }, 420);
    }, 1600);
  }

  // ================================================================
  // 📖 笔记库 — 在这里用代码添加你的笔记/武器
  // 字段说明：
  //   icon    : emoji 图标
  //   name    : 武器/笔记名称
  //   domain  : 'algebra' | 'calculus' | 'analysis'
  //   desc    : 一句话描述
  //   link    : 指向你自己写的 HTML 笔记文件的路径（相对或绝对）
  //             留空则不显示跳转按钮
  // ================================================================
  var NOTES = [
    // ── 近世代数 ────────────────────────────────────────────────
    // { icon:'🔗', name:'群同态基本定理', domain:'algebra', desc:'Im(φ) ≅ G/Ker(φ)，连接商群与同态像', link:'../../数学笔记/群同态基本定理.html' },

    // ── 高等数学 ────────────────────────────────────────────────
    // { icon:'∮',  name:'Green 公式',   domain:'calculus', desc:'将二重积分与曲线积分联系起来', link:'../../数学笔记/green.html' },

    // ── 数学分析 ────────────────────────────────────────────────
    // { icon:'📐', name:'Cauchy-Schwarz 不等式', domain:'analysis', desc:'|⟨u,v⟩|² ≤ ⟨u,u⟩·⟨v,v⟩，内积空间的基础工具', link:'../../数学笔记/cauchy-schwarz.html' },
  ];

    let currentMonsterId = null;
    let currentTab = 'problem';
  
    // ── HUD 更新 ──
    function updateHUD(){
      const p = DB.getPlayer();
      document.getElementById('hud-level').textContent = 'Lv.' + p.level;
    const titleEl = document.getElementById('hud-title-text');
    if(titleEl) titleEl.textContent = p.title;
      document.getElementById('hud-killed').textContent = p.stats.killed;
      const bar = DB.getXPBar(p.xp);
      document.getElementById('hud-xp-fill').style.width = bar.pct.toFixed(1) + '%';
      document.getElementById('hud-xp-cur').textContent = bar.cur;
    document.getElementById('hud-xp-need').textContent = bar.need || 'MAX';
    }
  
    // ── 通知 ──
  function notify(msg, type){
    type = type || '';
      const c = document.getElementById('notif-container');
      const el = document.createElement('div');
      el.className = 'notif ' + type;
      el.textContent = msg;
      c.appendChild(el);
    setTimeout(function(){ el.remove(); }, 3100);
    }
  
    // ── 战斗面板：打开 ──
    function openBattle(monsterId){
      currentMonsterId = monsterId;
      currentTab = 'problem';
      const overlay = document.getElementById('battle-overlay');
      overlay.style.display = 'flex';
    requestAnimationFrame(function(){ overlay.style.opacity = '1'; });
      Game.setPaused(true);
      _renderBattle();
    }
  
    // ── 战斗面板：关闭 ──
    function closeBattle(){
    // 停止预览动画
    const previewCanvas = document.getElementById('monster-preview-canvas');
    if(previewCanvas && previewCanvas._rafId){
      cancelAnimationFrame(previewCanvas._rafId);
      previewCanvas._rafId = null;
    }
    if(previewCanvas && previewCanvas._pRenderer){
      previewCanvas._pRenderer.dispose();
      previewCanvas._pRenderer = null;
    }
      const overlay = document.getElementById('battle-overlay');
    overlay.style.opacity = '0';
    setTimeout(function(){ overlay.style.display = 'none'; }, 300);
      Game.setPaused(false);
      currentMonsterId = null;
    }
  
    // ── 渲染战斗面板 ──
    function _renderBattle(){
      const m = DB.getMonster(currentMonsterId);
      if(!m) return;
  
    document.getElementById('b-name').textContent  = m.meta.name;
    document.getElementById('b-stars').textContent = '★'.repeat(m.meta.difficulty) + '☆'.repeat(5 - m.meta.difficulty);
      const badge = document.getElementById('b-domain');
    var domainMap = {algebra:'近世代数', calculus:'高等代数', analysis:'数学分析'};
    badge.textContent = domainMap[m.meta.domain] || m.meta.domain;
    badge.className   = 'b-badge badge-' + m.meta.domain;
    document.getElementById('b-lore').textContent = m.meta.lore || '这只怪物静静地存在着，等待着挑战者。';

      const chip = document.getElementById('b-status');
      if(m.kill){
      var cursed = m.kill.method === 'cheated';
      chip.textContent = cursed ? '☠ 外挂击杀（诅咒中）' : '⚔ 已击杀';
      chip.className   = 'b-status ' + (cursed ? 'chip-cursed' : 'chip-killed');
    } else if(m.attempts.length > 0){
        chip.textContent = '⚔ 战斗中';
        chip.className   = 'b-status chip-battle';
      } else {
        chip.textContent = '◎ 未曾交手';
        chip.className   = 'b-status chip-unseen';
      }

      const tagsEl = document.getElementById('b-tags');
    tagsEl.innerHTML = m.meta.tags.map(function(t){ return '<span class="b-tag">' + t + '</span>'; }).join('');

    // 所有怪物：按领域色为左侧面板着色，已击杀用灰调
    var battleLeft = document.getElementById('battle-left');
    var bName = document.getElementById('b-name');
    var bStars = document.getElementById('b-stars');
    if(!m.kill){
      var areaGlow   = {algebra:'rgba(168,85,247,0.12)', calculus:'rgba(251,191,36,0.12)', analysis:'rgba(16,185,129,0.12)'}[m.meta.domain] || 'rgba(168,85,247,0.12)';
      var areaAccent = {algebra:'#D8B4FE', calculus:'#FDE68A', analysis:'#A7F3D0'}[m.meta.domain] || '#D8B4FE';
      var areaBorder = {algebra:'rgba(168,85,247,0.35)', calculus:'rgba(251,191,36,0.35)', analysis:'rgba(16,185,129,0.35)'}[m.meta.domain] || 'rgba(168,85,247,0.35)';
      battleLeft.style.background = 'linear-gradient(180deg,' + areaGlow + ' 0%,var(--surface) 55%,var(--bg-deep) 100%)';
      battleLeft.style.borderRight = '1px solid ' + areaBorder;
      bName.style.color = areaAccent;
      bName.style.textShadow = '0 0 14px ' + areaAccent + '55';
      bStars.style.color = areaAccent;
      bStars.style.fontSize = '';
      bStars.style.textShadow = '';
    } else {
      battleLeft.style.background = '';
      battleLeft.style.borderRight = '';
      bName.style.color = '';
      bName.style.textShadow = '';
      bStars.style.color = '';
      bStars.style.fontSize = '';
      bStars.style.textShadow = '';
    }
  
      _renderMonsterPreview(m);
      _renderTab();
    }
  
    // ── 小预览渲染 ──
    function _renderMonsterPreview(m){
      const canvas = document.getElementById('monster-preview-canvas');
    if(canvas._rafId){ cancelAnimationFrame(canvas._rafId); canvas._rafId = null; }
    if(canvas._pRenderer){ canvas._pRenderer.dispose(); canvas._pRenderer = null; }

    const W = canvas.width  = canvas.offsetWidth  || 260;
    const H = canvas.height = canvas.offsetHeight || 170;
    const pRenderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true});
    pRenderer.setSize(W, H);
    pRenderer.setClearColor(0x000000, 0);
    canvas._pRenderer = pRenderer;

      const pScene = new THREE.Scene();
    const pCam   = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    pCam.position.set(0, 2.5, 5);
    pCam.lookAt(0, 1, 0);
    pScene.add(new THREE.AmbientLight(0xffffff, 2));
    const dl = new THREE.DirectionalLight(0xffffff, 2);
    dl.position.set(3, 5, 3);
    pScene.add(dl);
  
    const areas  = Game.getAreas();
    const area   = areas.find(function(a){ return a.id === m.meta.domain; }) || areas[0];
    const dead   = !!m.kill;
    const cursed = dead && m.kill.method === 'cheated';
    const color  = dead ? (cursed ? 0x7f1d1d : 0x14532d) : area.color;
      const pg = new THREE.Group();
      _buildPreviewBody(pg, m.meta.difficulty, color, dead);
      pScene.add(pg);
  
    var angle = 0;
      function pLoop(){
      canvas._rafId = requestAnimationFrame(pLoop);
      angle += 0.015;
      pg.rotation.y = angle;
      pRenderer.render(pScene, pCam);
      }
      pLoop();
    }
  
    function _buildPreviewBody(group, diff, color, dead){
    var op = dead ? 0.6 : 1;
    // MeshLambertMaterial 不支持 flatShading，改用 MeshPhongMaterial
    function lm(c){ return new THREE.MeshPhongMaterial({color: c, flatShading: true, shininess: 60, transparent: dead, opacity: op}); }
    var b, h, c;
    if(diff === 1){
      b = new THREE.Mesh(new THREE.SphereGeometry(0.44, 6, 5), lm(color)); b.position.y = 0.7; group.add(b);
    } else if(diff === 2){
      b = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.5), lm(color)); b.position.y = 0.65; group.add(b);
      h = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), lm(color)); h.position.y = 1.28; group.add(h);
    } else if(diff === 3){
      b = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 1.1, 6), lm(color)); b.position.y = 0.8; group.add(b);
      h = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38, 0), lm(color)); h.position.y = 1.7; group.add(h);
    } else if(diff === 4){
      b = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), lm(color)); b.position.y = 1.05; group.add(b);
      h = new THREE.Mesh(new THREE.TetrahedronGeometry(0.4, 0),  lm(color)); h.position.y = 2.05; group.add(h);
      } else {
      b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.78, 0), lm(color)); b.position.y = 1.25; group.add(b);
      c = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.65, 5),  lm(color)); c.position.y = 2.3;  group.add(c);
      }
  }

  // ── Tab 切换（暴露给 index.html）──
  function _switchTab(tab){
    currentTab = tab;
    _renderTab();
    }
  
    // ── Tab 渲染 ──
    function _renderTab(){
    document.querySelectorAll('.b-tab').forEach(function(t){
      t.classList.toggle('active', t.dataset.tab === currentTab);
      });
      const content = document.getElementById('battle-content');
      const m = DB.getMonster(currentMonsterId);
      if(!m) return;
  
    if(currentTab === 'problem')      content.innerHTML = _tplProblem(m);
    else if(currentTab === 'log')     content.innerHTML = _tplLog(m);
    else if(currentTab === 'weapons') content.innerHTML = _tplWeapons();
  
    if(currentTab === 'problem'){
      document.querySelectorAll('.katex-render').forEach(function(el){
        try{
          // 剥离外层定界符：$$...$$  或  \[...\]  或  $...$
          var tex = el.dataset.tex || '';
          var displayMode = true;
          if(/^\$\$[\s\S]+\$\$$/.test(tex)){
            tex = tex.slice(2, tex.length - 2);
          } else if(/^\\\[[\s\S]+\\\]$/.test(tex)){
            tex = tex.slice(2, tex.length - 2);
          } else if(/^\$[^$]+\$$/.test(tex)){
            tex = tex.slice(1, tex.length - 1);
            displayMode = false;
          }
          // 将中文字符自动包裹进 \text{} 避免 unicodeTextInMathMode 警告
          tex = tex.replace(/([\u4e00-\u9fff\u3000-\u303f\uff00-\uffef，。！？；：、《》【】「」]+)/g, function(s){ return '\\text{' + s + '}'; });
          katex.render(tex, el, {throwOnError: false, displayMode: displayMode, strict: false});
        }
        catch(e){ el.textContent = el.dataset.tex; }
        });
      }
  
      _bindTabEvents();
    }
  
    // ── Template: Problem ──
    function _tplProblem(m){
    var hintHtml;
    if(m.problem.hints.length === 0){
      hintHtml = '<p style="color:var(--text-muted);font-size:.8rem">暂无提示</p>';
    } else {
      hintHtml = m.problem.hints.map(function(h, i){
        return '<div class="hint-item">'
          + '<div class="hint-hd" onclick="this.nextElementSibling.classList.toggle(\'open\');this.querySelector(\'.hint-arr\').textContent=this.nextElementSibling.classList.contains(\'open\')?\' ▲\':\'▼\'">'
          + '<span>提示 ' + (i+1) + '</span><span class="hint-arr">▼</span>'
          + '</div>'
          + '<div class="hint-bd">' + h + '</div>'
          + '</div>';
      }).join('');
    }

    var killBanner = '';
    if(m.kill){
      var methodLabel = {independent:'独立击杀', hinted:'提示击杀', cheated:'外挂击杀'}[m.kill.method];
      killBanner = '<div class="killed-banner">'
        + '<div class="kb-title">' + (m.kill.method==='cheated' ? '☠ 外挂击杀（诅咒）' : '⚔ 已击杀') + '</div>'
        + '<div class="kb-method">方式：' + methodLabel + ' · 获得 ' + m.kill.xp_granted + ' XP · ' + m.kill.timestamp.slice(0,10) + '</div>'
        + (m.kill.solution_summary ? '<div class="kb-story">' + m.kill.solution_summary + '</div>' : '')
        + '</div>';
    }

    var killBtns = '';
    if(!m.kill){
      killBtns = '<div class="section-title" style="margin-top:24px">击杀操作</div>'
        + '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">'
        + '<button class="kill-btn" data-method="independent" style="flex:1;padding:12px;background:rgba(34,197,94,.1);border:1px solid var(--green);border-radius:8px;color:var(--green);font-family:var(--font-mono);font-size:.75rem;cursor:pointer">⚔ 独立击杀<br><span style="font-size:.62rem;opacity:.7">全额XP</span></button>'
        + '<button class="kill-btn" data-method="hinted" style="flex:1;padding:12px;background:rgba(245,197,24,.08);border:1px solid var(--gold);border-radius:8px;color:var(--gold);font-family:var(--font-mono);font-size:.75rem;cursor:pointer">💡 提示击杀<br><span style="font-size:.62rem;opacity:.7">50% XP</span></button>'
        + '<button class="kill-btn" data-method="cheated" style="flex:1;padding:12px;background:rgba(239,68,68,.08);border:1px solid var(--red);border-radius:8px;color:var(--red);font-family:var(--font-mono);font-size:.75rem;cursor:pointer">☠ 外挂击杀<br><span style="font-size:.62rem;opacity:.7">0 XP · 诅咒</span></button>'
        + '</div>';
    }

    var editBtn = '<div style="margin-top:18px;padding-top:14px;border-top:1px solid var(--border)">'
      + '<button id="edit-monster-btn" style="width:100%;padding:10px;background:transparent;border:1px dashed var(--border-bright);border-radius:8px;color:var(--text-dim);font-family:var(--font-mono);font-size:.7rem;cursor:pointer;letter-spacing:.06em;transition:all .2s" onmouseover="this.style.borderColor=\'var(--gold)\';this.style.color=\'var(--gold)\';" onmouseout="this.style.borderColor=\'var(--border-bright)\';this.style.color=\'var(--text-dim)\'">✏ 编辑题目</button>'
      + '</div>';

    return killBanner
      + '<div class="prob-ctx">' + (m.problem.context || '') + '</div>'
      + '<div class="prob-box"><div class="katex-render" data-tex="' + _escAttr(m.problem.latex) + '"></div></div>'
      + '<div class="section-title">提示</div>'
      + hintHtml
      + killBtns
      + editBtn;
    }
  
    // ── Template: Log ──
    function _tplLog(m){
    var reversed = m.attempts.slice().reverse();
    var entries = reversed.map(function(a, i){
      var wUsed = '';
      if(a.weapons_used && a.weapons_used.length > 0){
        var chips = a.weapons_used.map(function(wid){
          var w = DB.getWeapons().find(function(x){ return x.id === wid; });
          return w ? '<span class="log-chip">' + w.icon.value + ' ' + w.name + '</span>' : '';
        }).join('');
        wUsed = '<div class="log-fl">使用武器</div><div class="log-chips">' + chips + '</div>';
      }
      return '<div class="log-entry">'
        + '<div class="log-hd"><span class="log-num">第 ' + (m.attempts.length - i) + ' 次尝试</span><span class="log-date">' + a.timestamp.slice(0,10) + '</span></div>'
        + (a.approach ? '<div class="log-fl">思路</div><div class="log-fv">' + a.approach + '</div>' : '')
        + (a.failure_reason ? '<div class="log-fl">不通原因</div><div class="log-fv">' + a.failure_reason + '</div>' : '')
        + wUsed
        + '</div>';
    }).join('');

    var weapons = DB.getWeapons();
    var wpickHtml = weapons.map(function(w){
      return '<span class="wpick" data-wid="' + w.id + '" style="font-family:var(--font-mono);font-size:.65rem;padding:4px 10px;border:1px solid var(--border);border-radius:4px;cursor:pointer;transition:all .2s">'
        + w.icon.value + ' ' + w.name + '</span>';
    }).join('');

    var form = '';
    if(!m.kill){
      form = '<button id="add-attempt-btn" style="width:100%;padding:12px;background:transparent;border:1px dashed var(--border-bright);border-radius:8px;color:var(--text-dim);font-family:var(--font-mono);font-size:.72rem;cursor:pointer">+ 记录新的尝试</button>'
        + '<div id="attempt-form" style="display:none;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px;margin-top:8px">'
        + '<div style="margin-bottom:8px"><div style="font-family:var(--font-mono);font-size:.62rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">使用的武器（可多选）</div>'
        + '<div id="attempt-weapon-picker" style="display:flex;flex-wrap:wrap;gap:6px">' + wpickHtml + '</div></div>'
        + '<textarea id="f-approach" rows="3" placeholder="这次尝试的方向和思路..." style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-body);font-size:.85rem;padding:10px;resize:vertical;margin-bottom:8px"></textarea>'
        + '<textarea id="f-reason" rows="2" placeholder="哪里卡住了，为何没能突破..." style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-body);font-size:.85rem;padding:10px;resize:vertical;margin-bottom:10px"></textarea>'
        + '<button id="f-submit" style="padding:10px 24px;background:var(--algebra);color:#fff;border:none;border-radius:8px;font-family:var(--font-mono);font-size:.75rem;cursor:pointer">记录不通</button>'
        + ' <button id="f-cancel" style="padding:10px 16px;background:transparent;border:1px solid var(--border);border-radius:8px;color:var(--text-dim);font-family:var(--font-mono);font-size:.75rem;cursor:pointer">取消</button>'
        + '</div>';
    }

    var empty = entries ? '' : '<p style="color:var(--text-muted);font-size:.8rem;text-align:center;padding:40px 0">还没有战斗记录</p>';
    return '<div style="display:flex;flex-direction:column;gap:12px">' + empty + entries + '</div>' + form;
  }

  // ── Template: Weapons ──
  function _tplWeapons(){
    var weapons = DB.getWeapons();
    if(weapons.length === 0){
      return '<p style="color:var(--text-muted);font-size:.85rem;text-align:center;padding:60px 0">武器库为空<br><span style="font-size:.75rem">击杀怪物后在结算页添加武器</span></p>';
    }
    var cards = weapons.map(function(w){
      return '<div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px">'
        + '<div style="font-size:1.3rem;margin-bottom:6px">' + w.icon.value + '</div>'
        + '<div style="font-family:var(--font-mono);font-size:.72rem;color:var(--text);font-weight:700;margin-bottom:3px">' + w.name + '</div>'
        + '<div style="font-size:.72rem;color:var(--text-dim);line-height:1.5">' + (w.description||'') + '</div>'
        + '<div style="font-family:var(--font-mono);font-size:.58rem;color:var(--text-muted);margin-top:6px">' + ({algebra:'近世代数',calculus:'高等数学',analysis:'数学分析'}[w.domain]||w.domain) + '</div>'
        + (w.synthesized_from.length > 0 ? '<div style="font-family:var(--font-mono);font-size:.58rem;color:var(--algebra);margin-top:3px">⚗ 合成武器</div>' : '')
        + (w.note_link ? '<a href="' + w.note_link + '" target="_blank" style="display:inline-block;margin-top:6px;font-family:var(--font-mono);font-size:.62rem;color:var(--algebra);text-decoration:none;border:1px solid rgba(168,85,247,.4);border-radius:4px;padding:2px 8px;">📖 打开笔记</a>' : '')
        + '</div>';
    }).join('');
    return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' + cards + '</div>';
  }

  // ── 绑定 Tab 内事件 ──
  function _bindTabEvents(){
    // 编辑题目按钮
    var editBtn = document.getElementById('edit-monster-btn');
    if(editBtn) editBtn.addEventListener('click', function(){ _showEditMonster(currentMonsterId); });
    // 击杀按钮
    document.querySelectorAll('.kill-btn').forEach(function(btn){
      btn.addEventListener('click', function(){ _showKillModal(btn.dataset.method); });
    });
    // 记录尝试
    var addBtn = document.getElementById('add-attempt-btn');
    if(addBtn) addBtn.addEventListener('click', function(){
      document.getElementById('attempt-form').style.display = 'block';
      addBtn.style.display = 'none';
    });
    var cancelBtn = document.getElementById('f-cancel');
    if(cancelBtn) cancelBtn.addEventListener('click', function(){
      document.getElementById('attempt-form').style.display = 'none';
      document.getElementById('add-attempt-btn').style.display = 'block';
    });
    // 武器多选
    var pickedWeapons = [];
    document.querySelectorAll('.wpick').forEach(function(el){
      el.addEventListener('click', function(){
        var wid = el.dataset.wid;
        if(pickedWeapons.indexOf(wid) >= 0){
          pickedWeapons = pickedWeapons.filter(function(x){ return x !== wid; });
          el.style.borderColor = 'var(--border)'; el.style.background = '';
        } else {
          pickedWeapons.push(wid);
          el.style.borderColor = 'var(--algebra)'; el.style.background = 'rgba(139,92,246,.15)';
        }
      });
    });
    var submitBtn = document.getElementById('f-submit');
    if(submitBtn) submitBtn.addEventListener('click', function(){
      var approach = document.getElementById('f-approach').value.trim();
      var reason   = document.getElementById('f-reason').value.trim();
      DB.addAttempt(currentMonsterId, {weapons_used: pickedWeapons, approach: approach, failure_reason: reason});
      notify('战斗日志已记录', 'gold');
      _renderTab();
    });
  }

  // ── 击杀确认弹窗 ──
  function _showKillModal(method){
    var methodLabel = {independent:'⚔ 独立击杀', hinted:'💡 提示击杀', cheated:'☠ 外挂击杀'}[method];
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(5,5,8,.92);z-index:600;display:flex;align-items:center;justify-content:center';
    modal.innerHTML = '<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:28px;width:480px;max-width:95vw">'
      + '<div style="font-family:var(--font-title);font-size:1.1rem;color:var(--gold);margin-bottom:16px">' + methodLabel + '</div>'
      + '<textarea id="kill-story" rows="3" placeholder="解题故事（选填）..." style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-body);font-size:.85rem;padding:10px;resize:vertical;margin-bottom:12px"></textarea>'
      + '<input id="new-weapon-name" placeholder="获得武器名称（选填）" style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-body);font-size:.82rem;padding:8px 10px;margin-bottom:8px">'
      + '<select id="new-weapon-domain" style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-mono);font-size:.78rem;padding:8px;margin-bottom:8px"><option value="algebra">近世代数</option><option value="calculus">高等数学</option><option value="analysis">数学分析</option></select>'
      + '<textarea id="new-weapon-desc" rows="2" placeholder="这个方法/定理的要点..." style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-body);font-size:.82rem;padding:8px 10px;resize:vertical;margin-bottom:8px"></textarea>'
      + '<input id="new-weapon-link" placeholder="笔记HTML文件路径（选填，如 ../notes/cauchy.html）" style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-mono);font-size:.78rem;padding:8px 10px;margin-bottom:12px">'      + '<div style="display:flex;gap:10px">'
      + '<button id="kill-confirm" style="flex:1;padding:12px;background:rgba(34,197,94,.15);border:1px solid var(--green);border-radius:8px;color:var(--green);font-family:var(--font-mono);font-size:.78rem;cursor:pointer">确认击杀</button>'
      + '<button id="kill-cancel" style="padding:12px 20px;background:transparent;border:1px solid var(--border);border-radius:8px;color:var(--text-dim);font-family:var(--font-mono);font-size:.78rem;cursor:pointer">取消</button>'
      + '</div></div>';
    document.body.appendChild(modal);

    document.getElementById('kill-cancel').addEventListener('click', function(){ modal.remove(); });
    document.getElementById('kill-confirm').addEventListener('click', function(){
      var story = document.getElementById('kill-story').value.trim();
      var wname = document.getElementById('new-weapon-name').value.trim();
      var wdesc = document.getElementById('new-weapon-desc').value.trim();
      var wdom  = document.getElementById('new-weapon-domain').value;
      var newWeaponIds = [];
      if(wname){
        var wlink = document.getElementById('new-weapon-link').value.trim();
        var w = DB.createWeapon({name:wname, description:wdesc, domain:wdom, icon_value:'⚔️', note_link:wlink});
        newWeaponIds = [w.id];
        notify('新武器已加入武器库：' + wname, 'green');
      }
      var res = DB.killMonster(currentMonsterId, {method:method, solution_summary:story, weapons_used:newWeaponIds});
      if(res){
        // 播放对应击杀音效
        if(method === 'independent')      _soundKillIndependent();
        else if(method === 'hinted')      _soundKillHinted();
        else                              _soundKillCheated();
        // 显示击杀特效
        modal.remove();
        _showKillFX(method, res.xp);
        notify('怪物已击杀！获得 ' + res.xp + ' XP', 'green');
        if(res.xpRes.leveled) notify('升级！Lv.' + res.xpRes.player.level + ' · ' + res.xpRes.title, 'gold');
        updateHUD();
        Game.refreshMonster(currentMonsterId);
        _renderBattle();
      }
    });
  }

  // ── 编辑怪物弹窗 ──
  function _showEditMonster(monsterId){
    var m = DB.getMonster(monsterId);
    if(!m) return;
    var areas = Game.getAreas();
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(5,5,8,.94);z-index:700;display:flex;align-items:center;justify-content:center;overflow-y:auto';
    var hintsVal = (m.problem.hints || []).join('\n');
    var tagsVal  = (m.meta.tags || []).join(',');
    var domainOptions = areas.map(function(a){
      return '<option value="' + a.id + '"' + (a.id === m.meta.domain ? ' selected' : '') + '>' + a.name + '</option>';
    }).join('');
    modal.innerHTML = '<div style="background:var(--surface);border:1px solid var(--border-bright);border-radius:12px;padding:28px;width:560px;max-width:95vw;margin:20px auto">'
      + '<div style="font-family:var(--font-title);font-size:1.1rem;color:var(--gold);margin-bottom:20px">✏ 编辑怪物</div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">'
      + '<div><label style="font-family:var(--font-mono);font-size:.63rem;color:var(--text-dim);display:block;margin-bottom:5px">怪物名称</label><input id="em-name" value="' + _escAttr(m.meta.name) + '" style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-body);font-size:.85rem;padding:9px 11px"></div>'
      + '<div><label style="font-family:var(--font-mono);font-size:.63rem;color:var(--text-dim);display:block;margin-bottom:5px">所属领域</label><select id="em-domain" style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-mono);font-size:.78rem;padding:9px 11px">' + domainOptions + '</select></div>'
      + '</div>'
      + '<div style="margin-bottom:12px"><label style="font-family:var(--font-mono);font-size:.63rem;color:var(--text-dim);display:block;margin-bottom:5px">难度（1-5星）</label>'
      + '<div style="display:flex;gap:8px">' + [1,2,3,4,5].map(function(n){ return '<button class="em-diff-btn" data-d="' + n + '" style="flex:1;padding:8px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text-dim);font-family:var(--font-mono);font-size:.75rem;cursor:pointer">' + '★'.repeat(n) + '</button>'; }).join('') + '</div></div>'
      + '<div style="margin-bottom:12px"><label style="font-family:var(--font-mono);font-size:.63rem;color:var(--text-dim);display:block;margin-bottom:5px">题目（LaTeX）</label><textarea id="em-latex" rows="4" style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-mono);font-size:.82rem;padding:10px;resize:vertical">' + _escAttr(m.problem.latex) + '</textarea></div>'
      + '<div style="margin-bottom:12px"><label style="font-family:var(--font-mono);font-size:.63rem;color:var(--text-dim);display:block;margin-bottom:5px">来源（选填）</label><input id="em-ctx" value="' + _escAttr(m.problem.context||'') + '" style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-body);font-size:.85rem;padding:9px 11px"></div>'
      + '<div style="margin-bottom:12px"><label style="font-family:var(--font-mono);font-size:.63rem;color:var(--text-dim);display:block;margin-bottom:5px">怪物故事（选填）</label><textarea id="em-lore" rows="2" style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-body);font-size:.85rem;padding:10px;resize:vertical">' + _escAttr(m.meta.lore||'') + '</textarea></div>'
      + '<div style="margin-bottom:12px"><label style="font-family:var(--font-mono);font-size:.63rem;color:var(--text-dim);display:block;margin-bottom:5px">提示（每行一条）</label><textarea id="em-hints" rows="3" style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-body);font-size:.85rem;padding:10px;resize:vertical">' + _escAttr(hintsVal) + '</textarea></div>'
      + '<div style="margin-bottom:20px"><label style="font-family:var(--font-mono);font-size:.63rem;color:var(--text-dim);display:block;margin-bottom:5px">标签（逗号分隔）</label><input id="em-tags" value="' + _escAttr(tagsVal) + '" style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-body);font-size:.85rem;padding:9px 11px"></div>'
      + '<div style="display:flex;gap:10px"><button id="em-confirm" style="flex:1;padding:12px;background:rgba(245,197,24,.12);border:1px solid var(--gold);border-radius:8px;color:var(--gold);font-family:var(--font-mono);font-size:.78rem;cursor:pointer">保存修改</button><button id="em-cancel" style="padding:12px 20px;background:transparent;border:1px solid var(--border);border-radius:8px;color:var(--text-dim);font-family:var(--font-mono);font-size:.78rem;cursor:pointer">取消</button></div>'
      + '</div>';
    document.body.appendChild(modal);

    var selectedDiff = m.meta.difficulty || 1;
    document.querySelectorAll('.em-diff-btn').forEach(function(btn){
      var highlight = function(){
        document.querySelectorAll('.em-diff-btn').forEach(function(b){
          b.style.borderColor = b.dataset.d == selectedDiff ? 'var(--gold)' : 'var(--border)';
          b.style.color       = b.dataset.d == selectedDiff ? 'var(--gold)' : 'var(--text-dim)';
          b.style.background  = b.dataset.d == selectedDiff ? 'rgba(245,197,24,.1)' : 'var(--surface2)';
        });
      };
      btn.addEventListener('click', function(){ selectedDiff = parseInt(btn.dataset.d); highlight(); });
      highlight();
    });

    document.getElementById('em-cancel').addEventListener('click', function(){ modal.remove(); });
    document.getElementById('em-confirm').addEventListener('click', function(){
      var name   = document.getElementById('em-name').value.trim();
      var domain = document.getElementById('em-domain').value;
      var latex  = document.getElementById('em-latex').value.trim();
      var ctx    = document.getElementById('em-ctx').value.trim();
      var lore   = document.getElementById('em-lore').value.trim();
      var hints  = document.getElementById('em-hints').value.split('\n').map(function(s){ return s.trim(); }).filter(Boolean);
      var tags   = document.getElementById('em-tags').value.split(',').map(function(s){ return s.trim(); }).filter(Boolean);
      if(!name)  { notify('请填写怪物名称', 'red'); return; }
      if(!latex) { notify('请填写题目LaTeX', 'red'); return; }
      // 更新怪物数据
      var updated = DB.getMonster(monsterId);
      updated.meta.name       = name;
      updated.meta.domain     = domain;
      updated.meta.difficulty = selectedDiff;
      updated.meta.lore       = lore;
      updated.meta.tags       = tags;
      updated.world.area      = domain;
      updated.problem.latex   = latex;
      updated.problem.context = ctx;
      updated.problem.hints   = hints;
      DB.saveMonster(updated);
      Game.refreshMonster(monsterId);
      notify('怪物已更新：' + name, 'gold');
      modal.remove();
      _renderBattle();
    });
    modal.addEventListener('click', function(e){ if(e.target === modal) modal.remove(); });
  }

  // ── 创建怪物弹窗 ──
  function showCreateMonster(){
    var areas = Game.getAreas();
    var pos   = Game.getPlayerPos();
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(5,5,8,.92);z-index:600;display:flex;align-items:center;justify-content:center;overflow-y:auto';
    modal.innerHTML = '<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:28px;width:560px;max-width:95vw;margin:20px auto">'
      + '<div style="font-family:var(--font-title);font-size:1.1rem;color:var(--gold);margin-bottom:20px">⚔ 召唤新怪物</div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">'
      + '<div><label style="font-family:var(--font-mono);font-size:.63rem;color:var(--text-dim);display:block;margin-bottom:5px">怪物名称</label><input id="cm-name" placeholder="给这道题起个名字..." style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-body);font-size:.85rem;padding:9px 11px"></div>'
      + '<div><label style="font-family:var(--font-mono);font-size:.63rem;color:var(--text-dim);display:block;margin-bottom:5px">所属领域</label><select id="cm-domain" style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-mono);font-size:.78rem;padding:9px 11px">'
      + areas.map(function(a){ return '<option value="' + a.id + '">' + a.name + '</option>'; }).join('') + '</select></div>'
      + '</div>'
      + '<div style="margin-bottom:12px"><label style="font-family:var(--font-mono);font-size:.63rem;color:var(--text-dim);display:block;margin-bottom:5px">难度（1-5星）</label>'
      + '<div style="display:flex;gap:8px">' + [1,2,3,4,5].map(function(n){ return '<button class="diff-btn" data-d="' + n + '" style="flex:1;padding:8px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text-dim);font-family:var(--font-mono);font-size:.75rem;cursor:pointer">' + '★'.repeat(n) + '</button>'; }).join('') + '</div></div>'
      + '<div style="margin-bottom:12px"><label style="font-family:var(--font-mono);font-size:.63rem;color:var(--text-dim);display:block;margin-bottom:5px">题目（LaTeX）</label><textarea id="cm-latex" rows="3" placeholder="\int_0^1 f(x)dx = ..." style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-mono);font-size:.82rem;padding:10px;resize:vertical"></textarea></div>'
      + '<div style="margin-bottom:12px"><label style="font-family:var(--font-mono);font-size:.63rem;color:var(--text-dim);display:block;margin-bottom:5px">来源（选填）</label><input id="cm-ctx" placeholder="Rudin 第6章 习题3..." style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-body);font-size:.85rem;padding:9px 11px"></div>'
      + '<div style="margin-bottom:12px"><label style="font-family:var(--font-mono);font-size:.63rem;color:var(--text-dim);display:block;margin-bottom:5px">怪物故事（选填）</label><textarea id="cm-lore" rows="2" placeholder="传说这只怪物..." style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-body);font-size:.85rem;padding:10px;resize:vertical"></textarea></div>'
      + '<div style="margin-bottom:12px"><label style="font-family:var(--font-mono);font-size:.63rem;color:var(--text-dim);display:block;margin-bottom:5px">提示（每行一条，选填）</label><textarea id="cm-hints" rows="2" placeholder="提示1&#10;提示2" style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-body);font-size:.85rem;padding:10px;resize:vertical"></textarea></div>'
      + '<div style="margin-bottom:12px"><label style="font-family:var(--font-mono);font-size:.63rem;color:var(--text-dim);display:block;margin-bottom:5px">标签（逗号分隔）</label><input id="cm-tags" placeholder="积分,实分析,连续性" style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--font-body);font-size:.85rem;padding:9px 11px"></div>'
      + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:20px"><input type="checkbox" id="cm-patrol" checked style="accent-color:var(--algebra)"><label for="cm-patrol" style="font-family:var(--font-mono);font-size:.72rem;color:var(--text-dim);cursor:pointer">怪物会巡逻移动</label></div>'
      + '<div style="display:flex;gap:10px"><button id="cm-confirm" style="flex:1;padding:12px;background:rgba(139,92,246,.15);border:1px solid var(--algebra);border-radius:8px;color:#C4B5FD;font-family:var(--font-mono);font-size:.78rem;cursor:pointer">召唤怪物</button><button id="cm-cancel" style="padding:12px 20px;background:transparent;border:1px solid var(--border);border-radius:8px;color:var(--text-dim);font-family:var(--font-mono);font-size:.78rem;cursor:pointer">取消</button></div>'
      + '</div>';
    document.body.appendChild(modal);

    var selectedDiff = 1;
    document.querySelectorAll('.diff-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        selectedDiff = parseInt(btn.dataset.d);
        document.querySelectorAll('.diff-btn').forEach(function(b){
          b.style.borderColor = b.dataset.d == selectedDiff ? 'var(--gold)' : 'var(--border)';
          b.style.color       = b.dataset.d == selectedDiff ? 'var(--gold)' : 'var(--text-dim)';
          b.style.background  = b.dataset.d == selectedDiff ? 'rgba(245,197,24,.1)' : 'var(--surface2)';
        });
      });
    });
    document.querySelector('.diff-btn[data-d="1"]').click();

    document.getElementById('cm-cancel').addEventListener('click', function(){ modal.remove(); });
    document.getElementById('cm-confirm').addEventListener('click', function(){
      var name   = document.getElementById('cm-name').value.trim();
      var domain = document.getElementById('cm-domain').value;
      var latex  = document.getElementById('cm-latex').value.trim();
      var ctx    = document.getElementById('cm-ctx').value.trim();
      var lore   = document.getElementById('cm-lore').value.trim();
      var hints  = document.getElementById('cm-hints').value.split('\n').map(function(s){ return s.trim(); }).filter(Boolean);
      var tags   = document.getElementById('cm-tags').value.split(',').map(function(s){ return s.trim(); }).filter(Boolean);
      var patrol = document.getElementById('cm-patrol').checked;
      if(!name)  { notify('请填写怪物名称', 'red'); return; }
      if(!latex) { notify('请填写题目LaTeX', 'red'); return; }
      var area   = Game.getAreas().find(function(a){ return a.id === domain; });
      var spawnX = area ? area.cx + (Math.random() - 0.5) * area.w * 0.7 : pos.x;
      var spawnZ = area ? area.cz + (Math.random() - 0.5) * area.d * 0.7 : pos.z;
      var m = DB.createMonster({
        name:name, domain:domain, difficulty:selectedDiff,
        latex:latex, context:ctx, lore:lore, hints:hints, tags:tags,
        patrol:patrol, patrol_radius:3, x:spawnX, z:spawnZ
      });
      Game.spawnMonster(m);
      notify('怪物已召唤：' + name, 'green');
      modal.remove();
    });
  }

  // ── 笔记库弹窗（静态，从 NOTES 数组读取）──
  function showWeaponLibrary(){
    var domainLabel = {algebra:'近世代数', calculus:'高等数学', analysis:'数学分析'};
    var domainColor = {algebra:'var(--algebra)', calculus:'var(--calculus)', analysis:'var(--analysis)'};

    // 按领域分组
    var groups = {};
    NOTES.forEach(function(n){
      var d = n.domain || 'algebra';
      if(!groups[d]) groups[d] = [];
      groups[d].push(n);
    });

    var bodyHtml = '';
    if(NOTES.length === 0){
      bodyHtml = '<div style="text-align:center;padding:48px 0;color:var(--text-muted);font-size:.85rem">'
        + '<div style="font-size:2rem;margin-bottom:12px">📖</div>'
        + '笔记库为空<br>'
        + '<span style="font-size:.75rem">在 ui.js 顶部的 <code style="color:var(--gold)">NOTES</code> 数组中添加条目</span>'
        + '</div>';
    } else {
      ['algebra','calculus','analysis'].forEach(function(domain){
        if(!groups[domain] || groups[domain].length === 0) return;
        bodyHtml += '<div style="margin-bottom:18px">'
          + '<div style="font-family:var(--font-mono);font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:' + domainColor[domain] + ';margin-bottom:8px;border-bottom:1px solid var(--border);padding-bottom:5px">'
          + domainLabel[domain] + '</div>'
          + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px">';
        groups[domain].forEach(function(n){
          var hasLink = n.link && n.link.trim() !== '';
          bodyHtml += '<div onclick="' + (hasLink ? 'window.open(\'' + n.link + '\',\'_blank\')' : '') + '"'
            + ' style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:6px'
            + (hasLink ? ';cursor:pointer;transition:border-color .2s' : '') + '"'
            + (hasLink ? ' onmouseover="this.style.borderColor=\'var(--gold)\'" onmouseout="this.style.borderColor=\'var(--border)\'"' : '') + '>';
          bodyHtml += '<div style="font-size:1.6rem;line-height:1">' + (n.icon || '📄') + '</div>';
          bodyHtml += '<div style="font-family:var(--font-mono);font-size:.72rem;color:var(--text);font-weight:700">' + n.name + '</div>';
          bodyHtml += '<div style="font-size:.72rem;color:var(--text-dim);line-height:1.5">' + (n.desc || '') + '</div>';
          if(hasLink){
            bodyHtml += '<div style="font-family:var(--font-mono);font-size:.6rem;color:var(--gold);margin-top:auto;padding-top:4px">📖 打开笔记 →</div>';
          }
          bodyHtml += '</div>';
        });
        bodyHtml += '</div></div>';
      });
    }

    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(5,5,8,.92);z-index:600;display:flex;align-items:center;justify-content:center;overflow-y:auto';
    modal.innerHTML = '<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:28px;width:640px;max-width:95vw;margin:20px auto;max-height:85vh;overflow-y:auto">'
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">'
      + '<div style="font-family:var(--font-title);font-size:1.1rem;color:var(--gold)">📖 笔记库</div>'
      + '<div style="font-family:var(--font-mono);font-size:.6rem;color:var(--text-muted)">在 ui.js 的 NOTES 数组中添加条目</div>'
      + '</div>'
      + bodyHtml
      + '<button id="wlib-close" style="width:100%;padding:10px;background:transparent;border:1px solid var(--border);border-radius:8px;color:var(--text-dim);font-family:var(--font-mono);font-size:.72rem;cursor:pointer;margin-top:8px">关闭</button>'
      + '</div>';
    document.body.appendChild(modal);
    document.getElementById('wlib-close').addEventListener('click', function(){ modal.remove(); });
    modal.addEventListener('click', function(e){ if(e.target === modal) modal.remove(); });
  }

  // ── 导出 ──
  function exportData(){
    var json = DB.exportAll();
    var blob = new Blob([json], {type:'application/json'});
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href = url;
    a.download = 'mathsouls_save_' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
    notify('存档已导出', 'green');
  }

  // ── 导入 ──
  function importData(){
    var input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.addEventListener('change', function(e){
      var file = e.target.files[0];
      if(!file) return;
      var reader = new FileReader();
      reader.onload = function(ev){
        if(DB.importAll(ev.target.result)){
          notify('存档导入成功，刷新页面生效', 'green');
        } else {
          notify('导入失败，文件格式错误', 'red');
        }
      };
      reader.readAsText(file);
    });
    input.click();
  }

  // ── 工具 ──
  function _escAttr(str){
    return (str||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  return {
    updateHUD: updateHUD,
    notify: notify,
    openBattle: openBattle,
    closeBattle: closeBattle,
    showCreateMonster: showCreateMonster,
    showWeaponLibrary: showWeaponLibrary,
    exportData: exportData,
    importData: importData,
    _switchTab: _switchTab
  };
})();  