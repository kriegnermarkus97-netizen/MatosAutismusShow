const PAGE_COUNT = 90;

const state = {
    pages: Array.from({ length: PAGE_COUNT }, (_, i) => `comic/${i + 1}.png`),
    index: 0,
    direction: 1
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const home = $('#home');
const reader = $('#reader');
const pageImg = $('#comicPage');
const loader = $('#loader');
const statusEl = $('#status');
const counter = $('#pageCounter');
const progress = $('#progressBar');
statusEl.textContent = `${PAGE_COUNT} Comicseiten bereit.`;

function showView(which) { home.classList.toggle('active-view', which === 'home'); reader.classList.toggle('active-view', which === 'reader'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function startComic() { state.index = 0; showView('reader'); renderPage(); }
function renderPage() {
    if (!state.pages.length) return;
    loader.style.display = 'block'; pageImg.classList.remove('show');
    const src = state.pages[state.index];
    pageImg.onload = () => { loader.style.display = 'none'; void pageImg.offsetWidth; pageImg.classList.add('show'); };
    pageImg.onerror = () => { loader.style.display = 'none'; console.error(`Comicseite konnte nicht geladen werden: ${src}`); };
    pageImg.src = src; pageImg.alt = `Comicseite ${state.index + 1}`;
    counter.textContent = `SEITE ${state.index + 1} / ${state.pages.length}`;
    progress.style.width = `${((state.index + 1) / state.pages.length) * 100}%`;
    localStorage.setItem('trucker-loenhard-last-page', String(state.index)); preload(state.index + 1); preload(state.index - 1);
}
function preload(i) { if (i >= 0 && i < state.pages.length) { const im = new Image(); im.src = state.pages[i]; } }
function move(delta) { const next = state.index + delta; if (next < 0) { showView('home'); return; } if (next >= state.pages.length) return; state.direction = delta; state.index = next; renderPage(); }
$$('[data-start]').forEach(button => button.addEventListener('click', startComic));
$('#backHome').addEventListener('click', () => showView('home'));
$('#prevBtn').addEventListener('click', () => move(-1)); $('#prevBottom').addEventListener('click', () => move(-1));
$('#nextBtn').addEventListener('click', () => move(1)); $('#nextBottom').addEventListener('click', () => move(1));
$('#fullscreenBtn').addEventListener('click', async () => { if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.(); else await document.exitFullscreen?.(); });
document.addEventListener('keydown', e => { if (!reader.classList.contains('active-view')) return; if (e.key === 'ArrowRight' || e.key === ' ') move(1); if (e.key === 'ArrowLeft') move(-1); if (e.key === 'Escape') showView('home'); });
let sx = 0;
$('#stage').addEventListener('touchstart', e => { sx = e.changedTouches[0].clientX; }, { passive: true });
$('#stage').addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 55) move(dx < 0 ? 1 : -1); }, { passive: true });
const poster = $('#poster'); const wrap = $('#posterWrap');
wrap.addEventListener('pointermove', e => { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; const r = wrap.getBoundingClientRect(); const x = (e.clientX-r.left)/r.width-.5; const y=(e.clientY-r.top)/r.height-.5; poster.style.transform=`scale(1.035) translate(${x*-9}px, ${y*-7}px)`; });
wrap.addEventListener('pointerleave', () => { poster.style.transform='scale(1.01)'; });
const dust=$('#dust'); for(let i=0;i<32;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.top=Math.random()*120+10+'%';p.style.animationDuration=8+Math.random()*15+'s';p.style.animationDelay=-Math.random()*16+'s';p.style.transform=`scale(${.4+Math.random()*1.7})`;dust.appendChild(p);}

/* TRUCKER-LÖNHARD CHAOS-BUTTON */
const chaosButton=document.getElementById('chaosButton'); const chaosEvent=document.getElementById('chaosEvent');
if(chaosButton&&chaosEvent){
 const chaosEvents=[
  ()=>showChaosText('🚛 BRUMM BRUMM!','chaos-purple'), ()=>showChaosText('🍺 TRUCKER LUL!','chaos-orange'),
  ()=>fridolinEvent(), ()=>elVikoEvent(), ()=>eloqueen500SubsEvent(), ()=>ochDiggiEvent(), ()=>truckerRageEvent(),
  ()=>showChaosText('🤠 GHETTOQUEENS SORGT FÜR RECHT UND ORDNUNG!','chaos-pink'), ()=>wolfJumpscare(),
  ()=>showChaosText('🐢 KRÖTE!','chaos-blue'), ()=>showChaosText('🛣️ ROUTE 69','chaos-purple')
 ];
 chaosButton.addEventListener('click',()=>chaosEvents[Math.floor(Math.random()*chaosEvents.length)]());
}
function showChaosText(text,className){const message=document.createElement('div');message.className=`chaos-message ${className}`;message.textContent=text;chaosEvent.appendChild(message);setTimeout(()=>message.remove(),2200);}
function fridolinEvent(){const f=document.createElement('img');f.src='schlange.png';f.alt='Fridolin';f.className='chaos-fridolin';chaosEvent.appendChild(f);setTimeout(()=>f.remove(),5000);}

function eloqueen500SubsEvent(){
 const w=document.createElement('div');w.setAttribute('role','status');w.setAttribute('aria-label','ELOQUEEN fragt: Schaffen wir heute noch die 500 Subs?');
 Object.assign(w.style,{position:'fixed',left:'50%',top:'50%',transform:'translate(-50%, -50%) scale(.7)',width:'min(94vw, 1100px)',zIndex:'99999',pointerEvents:'none',opacity:'0',filter:'drop-shadow(0 20px 35px rgba(0,0,0,.7))',transition:'opacity .28s ease, transform .38s cubic-bezier(.2,.9,.2,1.2)'});
 const image=document.createElement('img');image.src='eloqueen-500-subs.png';image.alt='ELOQUEEN: SCHAFFEN WIR HEUTE NOCH DIE 500 SUBS?';Object.assign(image.style,{display:'block',width:'100%',height:'auto',maxHeight:'78vh',objectFit:'contain'});
 image.onerror=()=>{image.remove();const f=document.createElement('div');f.textContent='SCHAFFEN WIR HEUTE NOCH DIE 500 SUBS?';Object.assign(f.style,{padding:'24px 30px',border:'5px solid #ff48b7',borderRadius:'28px',background:'#fff',color:'#111',textAlign:'center',font:'900 clamp(28px, 6vw, 64px)/1 Impact, system-ui, sans-serif',boxShadow:'0 0 35px rgba(255,40,180,.7)'});w.appendChild(f);};
 w.appendChild(image);chaosEvent.appendChild(w);requestAnimationFrame(()=>{w.style.opacity='1';w.style.transform='translate(-50%, -50%) scale(1)';});setTimeout(()=>{w.style.opacity='0';w.style.transform='translate(-50%, -50%) scale(.82)';},4200);setTimeout(()=>w.remove(),4700);
}

function ochDiggiEvent(){
 const w=document.createElement('div');w.setAttribute('role','status');w.setAttribute('aria-label','OCH DIGGI!');Object.assign(w.style,{position:'fixed',left:'50%',top:'50%',transform:'translate(-50%, -50%) rotate(-5deg) scale(.2)',width:'min(82vw, 900px)',zIndex:'100000',pointerEvents:'none',opacity:'0',filter:'drop-shadow(0 0 12px #ff2bd6) drop-shadow(0 0 25px #31e7ff) drop-shadow(0 0 45px #ffe63b)',transition:'opacity .18s ease, transform .45s cubic-bezier(.16,1.25,.3,1)'});
 const image=document.createElement('img');image.src='och-diggi.png';image.alt='OCH DIGGI!';Object.assign(image.style,{display:'block',width:'100%',height:'auto',maxHeight:'70vh',objectFit:'contain'});image.onerror=()=>{image.remove();const f=document.createElement('div');f.textContent='OCH DIGGI!';Object.assign(f.style,{color:'#fff',textAlign:'center',font:'900 clamp(54px, 12vw, 150px)/.9 Impact, system-ui, sans-serif',textShadow:'0 0 8px #fff, 0 0 18px #ff2bd6, 0 0 32px #31e7ff, 0 0 48px #ffe63b'});w.appendChild(f);};
 w.appendChild(image);chaosEvent.appendChild(w);requestAnimationFrame(()=>{w.style.opacity='1';w.style.transform='translate(-50%, -50%) rotate(2deg) scale(1.08)';setTimeout(()=>{w.style.transform='translate(-50%, -50%) rotate(-1deg) scale(1)'},420);});setTimeout(()=>{w.style.opacity='0';w.style.transform='translate(-50%, -50%) rotate(6deg) scale(1.35)'},2600);setTimeout(()=>w.remove(),3100);
}

/* 30 SEKUNDEN TRUCKER RAGE */
function truckerRageEvent(){
 if(document.getElementById('trucker-rage-overlay'))return;
 const words=['ARSCHLOCH!','VOLLIDIOT!','DUMMKOPF!','PISSER!','WICHSER!','SPACKO!','DEPP!','VOLLPFOSTEN!','DUMMSCHWÄTZER!','ARSCHGEIGE!','KACKBRATZE!','PFEIFE!','FLACHZANGE!','DÖDEL!','LAPPEN!','DULLI!','KNALLKOPF!','HIRNI!','HOLZKOPF!','PAPPNASE!','SCHNARCHNASE!','DRECKSACK!','SCHEISSKERL!','VERDAMMTE SCHEISSE!','FICK DICH!','HALT DIE FRESSE!','LECK MICH AM ARSCH!','WAS ZUM FICK?!','DU GEHST MIR AUF DEN SACK!','SO EIN SCHEISSDRECK!'];
 const colors=['#ff1744','#ffea00','#00e5ff','#ff2bd6','#76ff03','#ff9100','#ffffff','#b388ff'];
 const overlay=document.createElement('div');overlay.id='trucker-rage-overlay';Object.assign(overlay.style,{position:'fixed',inset:'0',zIndex:'100500',pointerEvents:'none',overflow:'hidden',background:'rgba(20,0,0,.10)'});document.body.appendChild(overlay);
 const title=document.createElement('div');title.textContent='🔥 TRUCKER RAGE 🔥';Object.assign(title.style,{position:'absolute',left:'50%',top:'45%',transform:'translate(-50%,-50%) scale(.1)',font:'900 clamp(50px,11vw,150px)/.85 Impact,Arial Black,sans-serif',color:'#fff',whiteSpace:'nowrap',textShadow:'0 0 8px #fff,0 0 20px #ff1744,0 0 45px #ffea00',transition:'transform .35s cubic-bezier(.2,1.6,.3,1),opacity .3s'});overlay.appendChild(title);requestAnimationFrame(()=>title.style.transform='translate(-50%,-50%) scale(1)');setTimeout(()=>{title.style.opacity='0';title.style.transform='translate(-50%,-50%) scale(1.8)'},1300);setTimeout(()=>title.remove(),1700);
 const spawn=()=>{const el=document.createElement('div');el.textContent=words[Math.floor(Math.random()*words.length)];const c=colors[Math.floor(Math.random()*colors.length)];const rot=-25+Math.random()*50;Object.assign(el.style,{position:'absolute',left:(3+Math.random()*75)+'%',top:(3+Math.random()*82)+'%',maxWidth:'90vw',font:`900 clamp(28px,${4+Math.random()*5}vw,100px)/.9 Impact,Arial Black,sans-serif`,color:c,WebkitTextStroke:'2px #111',textShadow:`0 0 8px #fff,0 0 18px ${c},5px 6px 0 #111`,whiteSpace:'nowrap',opacity:'0',transform:`rotate(${rot}deg) scale(.15)`,transition:'transform .22s cubic-bezier(.15,1.5,.3,1),opacity .15s'});overlay.appendChild(el);requestAnimationFrame(()=>{el.style.opacity='1';el.style.transform=`rotate(${rot}deg) scale(1)`});setTimeout(()=>{el.style.opacity='0';el.style.transform=`rotate(${rot+(Math.random()>.5?15:-15)}deg) scale(1.6)`},650+Math.random()*450);setTimeout(()=>el.remove(),1300);};
 let elapsed=0;const interval=setInterval(()=>{elapsed+=260;spawn();if(elapsed>9000)spawn();if(elapsed>19000){spawn();spawn();}if(Math.random()<.28){document.documentElement.style.transform=`translate(${Math.random()*10-5}px,${Math.random()*8-4}px) rotate(${Math.random()*.5-.25}deg)`;setTimeout(()=>document.documentElement.style.transform='',80);}},260);
 const countdown=document.createElement('div');Object.assign(countdown.style,{position:'absolute',right:'18px',bottom:'16px',font:'900 20px Impact,sans-serif',color:'#fff',textShadow:'2px 2px #000'});overlay.appendChild(countdown);const started=Date.now();const timer=setInterval(()=>{countdown.textContent='RAGE '+Math.max(0,Math.ceil((30000-(Date.now()-started))/1000))+'s';},200);
 setTimeout(()=>{clearInterval(interval);clearInterval(timer);document.documentElement.style.transform='';overlay.style.transition='opacity .45s';overlay.style.opacity='0';setTimeout(()=>overlay.remove(),500);},30000);
}

function wolfJumpscare(){const scare=document.createElement('div');scare.className='wolf-jumpscare';const image=document.createElement('img');image.src='wolf-jumpscare.png';image.alt='Wolf Jumpscare';scare.appendChild(image);chaosEvent.appendChild(scare);const ac=new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator();const g=ac.createGain();o.type='sawtooth';o.frequency.setValueAtTime(130,ac.currentTime);o.frequency.exponentialRampToValueAtTime(55,ac.currentTime+.65);g.gain.setValueAtTime(.65,ac.currentTime);g.gain.exponentialRampToValueAtTime(.01,ac.currentTime+.8);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.8);setTimeout(()=>{scare.remove();ac.close()},1700);}
function elVikoEvent(){const music=new Audio('mariachi.mp3');music.volume=.6;music.currentTime=0;music.play().catch(error=>console.log('Musik konnte nicht gestartet werden:',error));const vc=document.createElement('div');vc.className='el-viko-container';const v=document.createElement('img');v.src='el-viko-tanz.png';v.alt='EL VIKO';v.className='el-viko-dancer';vc.appendChild(v);chaosEvent.appendChild(vc);const s=document.createElement('div');s.className='el-viko-salud';s.textContent='¡SALUD!';setTimeout(()=>chaosEvent.appendChild(s),1100);setTimeout(()=>s.remove(),4800);setTimeout(()=>{music.pause();music.currentTime=0;vc.remove()},6000);}
if(window.location.hash==='#reader')startComic();
