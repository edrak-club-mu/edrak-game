/* نادي إدراك — أوجد الاختلافات | إصدار من مستويين */
const CONFIG = {
  totalTime: 60,
  pointsPerFind: 100,
  timeBonusPerSecond: 5,
  levels: 2
};

const LEVELS = [
  {
    name: 'المستوى الأول — قاعة المذاكرة',
    total: 8,
    diffs: [
      {id:'clock',label:'عقارب الساعة',xPct:12,yPct:19},
      {id:'poster',label:'ألوان الملصق',xPct:39,yPct:20},
      {id:'window',label:'الستارة',xPct:82,yPct:20},
      {id:'laptop',label:'شاشة اللابتوب',xPct:22,yPct:72},
      {id:'mug',label:'كوب القهوة',xPct:41,yPct:85},
      {id:'books',label:'لون الكتاب العلوي',xPct:59,yPct:85},
      {id:'plant',label:'ورقة النبتة',xPct:78,yPct:78},
      {id:'lamp',label:'إضاءة المصباح',xPct:92,yPct:58}
    ]
  },
  {
    name: 'المستوى الثاني — مساحة الابتكار',
    total: 8,
    diffs: [
      {id:'screen',label:'أيقونة الشاشة',xPct:50,yPct:22},
      {id:'board',label:'الملاحظة على اللوح',xPct:23,yPct:25},
      {id:'window2',label:'الجزء المفتوح من النافذة',xPct:82,yPct:18},
      {id:'tablet',label:'شاشة الجهاز اللوحي',xPct:69,yPct:67},
      {id:'chair',label:'وسادة الكرسي',xPct:35,yPct:75},
      {id:'coffee2',label:'كوب القهوة',xPct:56,yPct:83},
      {id:'plant2',label:'ورقة النبتة',xPct:90,yPct:70},
      {id:'book2',label:'لون الكتاب',xPct:16,yPct:88}
    ]
  }
];

let levelIndex = 0;
const state = {found:new Set(), score:0, timeLeft:CONFIG.totalTime, timerId:null, playing:false};
const el = id => document.getElementById(id);
const arNum = n => n.toLocaleString('ar-EG');
const currentLevel = () => LEVELS[levelIndex];
const DIFFS = () => currentLevel().diffs;

function showScreen(name){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  el('screen-'+name).classList.add('active');
}
function polar(cx,cy,a,len){const r=a*Math.PI/180;return{x:cx+len*Math.sin(r),y:cy-len*Math.cos(r)}}
function at(d){return{x:d.xPct/100*800,y:d.yPct/100*500}}

/* رسومات أكثر واقعية: تدرجات، ظلال، تفاصيل أثاث وإضاءة، مع ألوان الهوية */
function realisticStudyScene(variant){
  const alt=variant==='B', N='#1B2A4A', G='#E8B84B', S='#93B4A6', W='#F8F6F0', D='#D8DDD9';
  const ds=DIFFS(), p=id=>at(ds.find(d=>d.id===id));
  const c=p('clock'), po=p('poster'), wi=p('window'), la=p('laptop'), mu=p('mug'), bo=p('books'), pl=p('plant'), lm=p('lamp');
  const clockHands=alt?[[100,16],[230,25]]:[[300,16],[55,25]];
  const hand1=polar(c.x,c.y,clockHands[0][0],clockHands[0][1]), hand2=polar(c.x,c.y,clockHands[1][0],clockHands[1][1]);
  return `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fffdf8"/><stop offset="1" stop-color="#eef2ef"/></linearGradient>
      <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b98a5a"/><stop offset="1" stop-color="#7c5738"/></linearGradient>
      <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${alt?'#9da8ae':N}"/><stop offset="1" stop-color="${alt?'#dfe5e5': '#30466f'}"/></linearGradient>
      <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-opacity=".18"/></filter>
      <filter id="soft"><feGaussianBlur stdDeviation="14"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#wall)"/>
    <circle cx="610" cy="115" r="110" fill="#E8B84B" opacity=".10" filter="url(#soft)"/>
    <rect y="330" width="800" height="170" fill="#dfe6e1"/>
    <path d="M0 365 Q180 350 360 370 T800 355 V500 H0Z" fill="#cdd8d2" opacity=".6"/>
    <!-- نافذة -->
    <g filter="url(#shadow)"><rect x="640" y="38" width="115" height="145" rx="8" fill="#b9d9dc" stroke="${N}" stroke-width="7"/><path d="M697 38v145M640 110h115" stroke="${N}" stroke-width="5"/><path d="M650 52 Q675 85 650 170" fill="none" stroke="${S}" stroke-width="16" opacity=".65"/>${alt?'<path d="M742 42v137" stroke="#E8B84B" stroke-width="14" opacity=".55"/>':''}</g>
    <!-- ساعة -->
    <g filter="url(#shadow)"><circle cx="${c.x}" cy="${c.y}" r="34" fill="#fff" stroke="${N}" stroke-width="6"/><circle cx="${c.x}" cy="${c.y}" r="27" fill="none" stroke="#ddd"/><line x1="${c.x}" y1="${c.y}" x2="${hand1.x}" y2="${hand1.y}" stroke="${N}" stroke-width="5" stroke-linecap="round"/><line x1="${c.x}" y1="${c.y}" x2="${hand2.x}" y2="${hand2.y}" stroke="${N}" stroke-width="3" stroke-linecap="round"/><circle cx="${c.x}" cy="${c.y}" r="4" fill="${G}"/></g>
    <!-- لوحة -->
    <g filter="url(#shadow)"><rect x="${po.x-45}" y="${po.y-42}" width="90" height="86" rx="5" fill="${N}"/><rect x="${po.x-32}" y="${po.y-24}" width="64" height="14" rx="2" fill="${alt?S:G}"/><rect x="${po.x-32}" y="${po.y+1}" width="48" height="10" fill="${alt?G:S}"/><circle cx="${po.x+25}" cy="${po.y+24}" r="7" fill="#fff" opacity=".8"/></g>
    <!-- مكتب -->
    <rect x="45" y="350" width="710" height="18" rx="9" fill="url(#wood)"/><rect x="70" y="368" width="660" height="115" rx="7" fill="url(#wood)" filter="url(#shadow)"/><path d="M95 378v95M705 378v95" stroke="#5d402a" stroke-width="7" opacity=".45"/>
    <!-- لابتوب -->
    <g filter="url(#shadow)"><rect x="${la.x-52}" y="${la.y-40}" width="104" height="70" rx="7" fill="#25334b"/><rect x="${la.x-45}" y="${la.y-33}" width="90" height="56" rx="4" fill="url(#screen)"/><rect x="${la.x-65}" y="${la.y+30}" width="130" height="12" rx="6" fill="#202b3b"/>${alt?'':'<circle cx="'+la.x+'" cy="'+(la.y-5)+'" r="9" fill="#E8B84B" opacity=".85"/>'}</g>
    <!-- كوب -->
    <g filter="url(#shadow)">${alt?'':'<path d="M'+(mu.x-18)+' '+(mu.y-12)+'h36v25q0 10-18 10t-18-10z" fill="#fff" stroke="'+N+'" stroke-width="3"/><path d="M'+(mu.x+18)+' '+mu.y+'q20 0 14 15q-3 8-14 5" fill="none" stroke="'+N+'" stroke-width="4"/><path d="M'+(mu.x-5)+' '+(mu.y-17)+'q-3-10 2-16M'+(mu.x+7)+' '+(mu.y-17)+'q-3-9 2-15" stroke="'+S+'" stroke-width="3" fill="none" stroke-linecap="round"/>'}</g>
    <!-- كتب -->
    <g filter="url(#shadow)"><rect x="${bo.x-34}" y="${bo.y+4}" width="68" height="16" rx="2" fill="${N}"/><rect x="${bo.x-29}" y="${bo.y-13}" width="58" height="15" fill="#f4f0e7" stroke="${N}" stroke-width="2"/><rect x="${bo.x-23}" y="${bo.y-28}" width="46" height="14" fill="${alt?S:G}"/><line x1="${bo.x-17}" y1="${bo.y-25}" x2="${bo.x+17}" y2="${bo.y-25}" stroke="#fff" stroke-width="2" opacity=".5"/></g>
    <!-- نبتة -->
    <g filter="url(#shadow)"><path d="M${pl.x-25} ${pl.y+25}h50l-7-34h-36z" fill="${N}"/><path d="M${pl.x} ${pl.y}q-4-42-26-50M${pl.x} ${pl.y}q4-45 27-56M${pl.x} ${pl.y}q18-32 35-28" stroke="${S}" stroke-width="8" fill="none" stroke-linecap="round"/><ellipse cx="${pl.x-27}" cy="${pl.y-48}" rx="11" ry="21" fill="${S}" transform="rotate(-25 ${pl.x-27} ${pl.y-48})"/>${alt?'':'<ellipse cx="'+(pl.x+27)+'" cy="'+(pl.y-54)+'" rx="11" ry="22" fill="'+S+'" transform="rotate(30 '+(pl.x+27)+' '+(pl.y-54)+')"/>'}</g>
    <!-- مصباح -->
    <g filter="url(#shadow)"><line x1="${lm.x}" y1="${lm.y+60}" x2="${lm.x}" y2="${lm.y-12}" stroke="${N}" stroke-width="7"/><path d="M${lm.x-23} ${lm.y-12}q23-18 46 0l-9 18h-28z" fill="${alt?'#b8bec2':G}" stroke="${N}" stroke-width="4"/>${alt?'':'<circle cx="'+lm.x+'" cy="'+(lm.y+2)+'" r="32" fill="#E8B84B" opacity=".18"/>'}</g>
  </svg>`;
}

function innovationScene(variant){
  const alt=variant==='B', N='#1B2A4A',G='#E8B84B',S='#93B4A6',W='#f7f7f2';
  const ds=DIFFS(), p=id=>at(ds.find(d=>d.id===id));
  const sc=p('screen'), bd=p('board'), wi=p('window2'), tb=p('tablet'), ch=p('chair'), co=p('coffee2'), pl=p('plant2'), bk=p('book2');
  return `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fdfcf8"/><stop offset="1" stop-color="#e6efeb"/></linearGradient><linearGradient id="desk2"><stop stop-color="#b88959"/><stop offset="1" stop-color="#765137"/></linearGradient><filter id="sh2"><feDropShadow dx="0" dy="7" stdDeviation="7" flood-opacity=".18"/></filter></defs>
    <rect width="800" height="500" fill="url(#bg2)"/><rect y="340" width="800" height="160" fill="#d6e0db"/>
    <rect x="250" y="30" width="300" height="210" rx="12" fill="#eef2ef" stroke="${N}" stroke-width="6" filter="url(#sh2)"/><rect x="275" y="55" width="250" height="160" rx="8" fill="${N}"/><rect x="292" y="72" width="216" height="126" rx="5" fill="#30466f"/><circle cx="${sc.x}" cy="${sc.y}" r="18" fill="${alt?'#c5ced1':G}"/><path d="M${sc.x-9} ${sc.y}l7 7 13-16" stroke="${N}" stroke-width="4" fill="none"/>
    <g filter="url(#sh2)"><rect x="55" y="55" width="190" height="150" rx="8" fill="#fff" stroke="${N}" stroke-width="5"/><line x1="75" y1="95" x2="220" y2="95" stroke="${G}" stroke-width="8"/><path d="M80 125h70M80 150h115M80 175h50" stroke="${S}" stroke-width="7" stroke-linecap="round"/>${alt?'':'<circle cx="200" cy="145" r="12" fill="'+G+'"/>'}</g>
    <g filter="url(#sh2)"><rect x="650" y="35" width="105" height="150" rx="7" fill="#b8d9dc" stroke="${N}" stroke-width="6"/><path d="M702 35v150" stroke="${N}" stroke-width="5"/>${alt?'':'<path d="M710 48v125" stroke="'+G+'" stroke-width="14" opacity=".45"/>'}</g>
    <rect x="60" y="345" width="680" height="22" rx="10" fill="url(#desk2)"/><rect x="85" y="367" width="630" height="115" rx="8" fill="url(#desk2)" filter="url(#sh2)"/>
    <g filter="url(#sh2)"><rect x="${tb.x-55}" y="${tb.y-28}" width="110" height="70" rx="10" fill="#29364d"/><rect x="${tb.x-46}" y="${tb.y-19}" width="92" height="52" rx="5" fill="${alt?'#adb7bd':'#526a91'}"/><circle cx="${tb.x+27}" cy="${tb.y-10}" r="5" fill="${S}"/></g>
    <g filter="url(#sh2)"><path d="M${ch.x-45} ${ch.y+45}v-60q0-35 45-35t45 35v60" fill="#6f8790" stroke="${N}" stroke-width="6"/><rect x="${ch.x-45}" y="${ch.y+5}" width="90" height="20" rx="10" fill="${alt?'#6f8790':G}"/></g>
    <g filter="url(#sh2)"><path d="M${co.x-16} ${co.y-12}h32v28q0 9-16 9t-16-9z" fill="#fff" stroke="${N}" stroke-width="3"/><path d="M${co.x+16} ${co.y-2}q18 0 12 13q-3 7-12 5" fill="none" stroke="${N}" stroke-width="4"/>${alt?'':'<path d="M'+(co.x-4)+' '+(co.y-17)+'q-3-9 2-14M'+(co.x+7)+' '+(co.y-17)+'q-3-8 2-13" stroke="'+S+'" stroke-width="3" fill="none"/>'}</g>
    <g filter="url(#sh2)"><path d="M${pl.x-28} ${pl.y+28}h56l-8-35h-40z" fill="${N}"/><path d="M${pl.x} ${pl.y}q-5-48-28-62M${pl.x} ${pl.y}q7-46 28-61M${pl.x} ${pl.y}q25-33 42-28" stroke="${S}" stroke-width="8" fill="none" stroke-linecap="round"/>${alt?'':'<ellipse cx="'+(pl.x+27)+'" cy="'+(pl.y-57)+'" rx="11" ry="22" fill="'+S+'" transform="rotate(30 '+(pl.x+27)+' '+(pl.y-57)+')"/>'}</g>
    <g filter="url(#sh2)"><rect x="${bk.x-32}" y="${bk.y-4}" width="64" height="17" fill="${N}"/><rect x="${bk.x-26}" y="${bk.y-21}" width="52" height="16" fill="${alt?G:'#f0e8d7'}"/><rect x="${bk.x-20}" y="${bk.y-37}" width="40" height="15" fill="${S}"/></g>
  </svg>`;
}

function renderBoards(){
  const sceneA=el('scene-a'),sceneB=el('scene-b');
  const builder=levelIndex===0?realisticStudyScene:innovationScene;
  sceneA.innerHTML=builder('A');sceneB.innerHTML=builder('B');
  ['board-a','board-b'].forEach(boardId=>{
    const board=el(boardId);board.querySelectorAll('.hotspot,.found-ring').forEach(n=>n.remove());
    DIFFS().forEach(d=>{const b=document.createElement('button');b.className='hotspot';b.style.left=d.xPct+'%';b.style.top=d.yPct+'%';b.dataset.id=d.id;b.setAttribute('aria-label','اختلاف');b.addEventListener('click',onHotspotClick);board.appendChild(b)});
    if(!board.dataset.missBound){board.addEventListener('click',onBoardMissClick);board.dataset.missBound='1'}
  });
  el('level-name').textContent=currentLevel().name;
}

function onHotspotClick(e){
  e.stopPropagation();const id=e.currentTarget.dataset.id;if(state.found.has(id))return;
  state.found.add(id);state.score+=CONFIG.pointsPerFind;
  ['board-a','board-b'].forEach(idBoard=>{const board=el(idBoard),btn=board.querySelector(`.hotspot[data-id="${id}"]`);if(btn){btn.classList.add('found');const ring=document.createElement('div');ring.className='found-ring';ring.style.left=btn.style.left;ring.style.top=btn.style.top;ring.style.width=btn.offsetWidth+'px';ring.style.height=btn.offsetHeight+'px';board.appendChild(ring)}});
  updateHud();flashToast('أحسنت! اكتشفت اختلافًا ✨');if(state.found.size===DIFFS().length)endGame(true);
}
function onBoardMissClick(e){
  if(!state.playing||e.target.classList.contains('hotspot'))return;const rect=e.currentTarget.getBoundingClientRect();
  const x=((e.clientX-rect.left)/rect.width)*100,y=((e.clientY-rect.top)/rect.height)*100;const mark=document.createElement('div');mark.className='miss-mark';mark.style.left=x+'%';mark.style.top=y+'%';e.currentTarget.appendChild(mark);setTimeout(()=>mark.remove(),600);
}
function updateHud(){el('stat-found').innerHTML=`${arNum(state.found.size)}<span class="stat-slash">/</span>${arNum(DIFFS().length)}`;el('stat-score').textContent=arNum(state.score);el('stat-time').textContent=arNum(state.timeLeft);el('timer-fill').style.width=(state.timeLeft/CONFIG.totalTime*100)+'%';el('stat-time').classList.toggle('low',state.timeLeft<=10)}
let toastTimer;function flashToast(msg,duration=1200){const t=el('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),duration)}
function startTimer(){clearInterval(state.timerId);state.timerId=setInterval(()=>{state.timeLeft--;updateHud();if(state.timeLeft<=0)endGame(false)},1000)}
function startLevel(index){levelIndex=index;state.found=new Set();state.timeLeft=CONFIG.totalTime;state.playing=true;renderBoards();updateHud();showScreen('game');startTimer()}
function startGame(){state.score=0;startLevel(0)}
function endGame(won){state.playing=false;clearInterval(state.timerId);if(won){const bonus=state.timeLeft*CONFIG.timeBonusPerSecond;state.score+=bonus;if(levelIndex===0){el('win-badge').textContent='⭐';el('end-title').textContent='ممتاز! أنهيت المستوى الأول';el('end-sub').textContent='جاهز للتحدي الثاني؟ المستوى القادم أصعب قليلًا.';el('win-time').textContent=arNum(state.timeLeft);el('win-score').textContent=arNum(state.score);el('btn-next').style.display='inline-block';el('btn-restart-final').style.display='none';showScreen('win')}else{el('win-badge').textContent='🏆';el('end-title').textContent='رائع! أنهيت اللعبة كاملة';el('end-sub').textContent='اكتشفت جميع الاختلافات بعين إدراك الثاقبة.';el('win-time').textContent=arNum(state.timeLeft);el('win-score').textContent=arNum(state.score);el('btn-next').style.display='none';el('btn-restart-final').style.display='inline-block';showScreen('win')}}else{el('lose-found').textContent=`${arNum(state.found.size)}/${arNum(DIFFS().length)}`;el('lose-score').textContent=arNum(state.score);showScreen('lose')}}


el('btn-start').addEventListener('click',startGame);
el('btn-next').addEventListener('click',()=>startLevel(1));
el('btn-restart-final').addEventListener('click',startGame);
el('btn-retry-lose').addEventListener('click',()=>startLevel(levelIndex));
