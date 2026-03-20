// 数据层
// ============================================================
// data.js — 数据层，localStorage 持久化
// ============================================================
const DB = {
    LEVEL_TABLE: [
      {lv:1,  xp:0,      title:'迷途的学者'},
      {lv:5,  xp:500,    title:'初入江湖'},
      {lv:10, xp:2000,   title:'定理猎手'},
      {lv:15, xp:5000,   title:'证明剑客'},
      {lv:20, xp:10000,  title:'证明大师'},
      {lv:30, xp:25000,  title:'数学领主'},
      {lv:40, xp:60000,  title:'无穷维行者'},
      {lv:50, xp:120000, title:'无限维存在'},
    ],
    XP_BY_DIFF: [0, 50, 120, 250, 500, 1000],
  
    _k(k){ return 'ms_' + k; },
    _g(k){ try{ return JSON.parse(localStorage.getItem(this._k(k))); }catch(e){ return null; } },
    _s(k,v){ try{ localStorage.setItem(this._k(k), JSON.stringify(v)); }catch(e){} },
  
    getPlayer(){
      return this._g('player') || {
        level:1, xp:0, title:'迷途的学者',
        worldPos:{x:-42,z:0},
        stats:{killed:0,independent:0,hinted:0,cheated:0,attempts:0}
      };
    },
    savePlayer(p){ this._s('player',p); },
  
    addXP(amount){
      const p = this.getPlayer();
      p.xp += amount;
      let lv=1, title=this.LEVEL_TABLE[0].title;
      for(const r of this.LEVEL_TABLE){ if(p.xp>=r.xp){lv=r.lv;title=r.title;} }
      const leveled = lv > p.level;
      p.level=lv; p.title=title;
      this.savePlayer(p);
      return {player:p, leveled, title};
    },
  
    getXPBar(xp){
      const T = this.LEVEL_TABLE;
      for(let i=0;i<T.length-1;i++){
        if(xp < T[i+1].xp) return {
          cur: xp - T[i].xp,
          need: T[i+1].xp - T[i].xp,
          pct: (xp - T[i].xp)/(T[i+1].xp - T[i].xp)*100
        };
      }
      return {cur:0, need:0, pct:100};
    },
  
    getMonsters(){ return this._g('monsters') || []; },
    saveMonsters(list){ this._s('monsters',list); },
    getMonster(id){ return this.getMonsters().find(m=>m.id===id)||null; },
  
    saveMonster(m){
      const list = this.getMonsters();
      const i = list.findIndex(x=>x.id===m.id);
      if(i>=0) list[i]=m; else list.push(m);
      this.saveMonsters(list);
    },
  
    createMonster(d){
      const m = {
        id: 'M_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),
        meta:{
          name:       d.name||'未命名怪物',
          domain:     d.domain||'algebra',
          difficulty: d.difficulty||1,
          tags:       d.tags||[],
          lore:       d.lore||'',
          created_at: new Date().toISOString()
        },
        world:{
          position:     {x:d.x||0, z:d.z||0},
          area:         d.domain||'algebra',
          patrol:       d.patrol!==undefined ? d.patrol : true,
          patrol_radius:d.patrol_radius||3
        },
        problem:{latex:d.latex||'', context:d.context||'', hints:d.hints||[]},
        attempts:[],
        kill:null,
        extensions:{}
      };
      this.saveMonster(m);
      return m;
    },
  
    addAttempt(mid, ad){
      const m = this.getMonster(mid);
      if(!m) return null;
      const a = {
        id:'A_'+Date.now(),
        timestamp: new Date().toISOString(),
        weapons_used: ad.weapons_used||[],
        approach:     ad.approach||'',
        failure_reason: ad.failure_reason||'',
        status:'failed'
      };
      m.attempts.push(a);
      const p=this.getPlayer(); p.stats.attempts++;
      this.savePlayer(p); this.saveMonster(m);
      return a;
    },
  
    killMonster(mid, kd){
      const m = this.getMonster(mid);
      if(!m) return null;
      const xpBase = this.XP_BY_DIFF[m.meta.difficulty]||50;
      const mult   = kd.method==='independent'?1:kd.method==='hinted'?0.5:0;
      const xp     = Math.floor(xpBase*mult);
      m.kill = {
        timestamp: new Date().toISOString(),
        method:    kd.method||'independent',
        solution_summary: kd.solution_summary||'',
        weapons_used: kd.weapons_used||[],
        xp_granted: xp,
        ng_plus:[]
      };
      const p=this.getPlayer();
      p.stats.killed++;
      if(kd.method==='independent') p.stats.independent++;
      else if(kd.method==='hinted') p.stats.hinted++;
      else p.stats.cheated++;
      this.savePlayer(p); this.saveMonster(m);
      const xpRes = this.addXP(xp);
      return {monster:m, xp, xpRes};
    },
  
    getWeapons(){ return this._g('weapons')||[]; },
    saveWeapons(list){ this._s('weapons',list); },
  
    createWeapon(d){
      const w = {
        id:'W_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),
        name:        d.name||'未命名武器',
        description: d.description||'',
        domain:      d.domain||'algebra',
        tags:        d.tags||[],
        icon:        {type:d.icon_type||'emoji', value:d.icon_value||'⚔️'},
        synthesized_from: d.synthesized_from||[],
        note_link:   d.note_link || '',
        kill_count:  0,
        created_at:  new Date().toISOString(),
        extensions:  {}
      };
      const list=this.getWeapons(); list.push(w);
      this.saveWeapons(list); return w;
    },
  
    exportAll(){
      return JSON.stringify({
        player:   this.getPlayer(),
        monsters: this.getMonsters(),
        weapons:  this.getWeapons(),
        exported_at: new Date().toISOString()
      }, null, 2);
    },
  
    importAll(str){
      try{
        const d=JSON.parse(str);
        if(d.player)   this.savePlayer(d.player);
        if(d.monsters) this.saveMonsters(d.monsters);
        if(d.weapons)  this.saveWeapons(d.weapons);
        return true;
      }catch(e){ return false; }
    }
  };