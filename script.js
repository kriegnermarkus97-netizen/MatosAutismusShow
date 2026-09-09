const MAX_PAGES = 90;
const EXTENSIONS = ['png','jpg','jpeg','webp'];
const PAD_WIDTHS = [0,2,3];
const state = { pages: [], index: 0, direction: 1 };
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const home = $('#home'), reader = $('#reader'), pageImg = $('#comicPage'), loader = $('#loader');
const statusEl = $('#status'), counter = $('#pageCounter'), progress = $('#progressBar');

function candidates(n){
    const names = [];

    for(const pad of PAD_WIDTHS){
        const base = pad ? String(n).padStart(pad,'0') : String(n);

        for(const ext of EXTENSIONS){
            names.push(`comic/${base}.${ext}`);
            names.push(`${base}.${ext}`);
        }


    return names;

}
function imageExists(url){
  return new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(url);img.onerror=()=>resolve(null);img.src=url+'?v=1';});
}
async function findOne(n){
  for(const url of candidates(n)){const ok=await imageExists(url);if(ok)return ok;}
  return null;
}
async function scanPages(){
  statusEl.textContent='Comicseiten werden gesucht …';
  const found=[]; let misses=0;
  for(let n=1;n<=MAX_PAGES;n++){
    const url=await findOne(n);
    if(url){found.push(url);misses=0;statusEl.textContent=`${found.length} Seite${found.length===1?'':'n'} gefunden …`;}
    else {misses++; if(n>3 && misses>=50) break;}
  }
  state.pages=found;
  statusEl.textContent=found.length?`${found.length} Comicseiten bereit.`:'Noch keine Comicseiten im Ordner „comic“ gefunden.';
  return found;
}
function showView(which){
  home.classList.toggle('active-view',which==='home');
  reader.classList.toggle('active-view',which==='reader');
  window.scrollTo({top:0,behavior:'smooth'});
}
async function startComic(){
  if(!state.pages.length) await scanPages();
  if(!state.pages.length){statusEl.animate([{transform:'translateX(0)'},{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(0)'}],{duration:350});return;}
  state.index=0; showView('reader'); renderPage();
}
function renderPage(){
  if(!state.pages.length)return;
  loader.style.display='block'; pageImg.classList.remove('show');
  const src=state.pages[state.index];
  pageImg.onload=()=>{loader.style.display='none'; void pageImg.offsetWidth; pageImg.classList.add('show');};
  pageImg.src=src; pageImg.alt=`Comicseite ${state.index+1}`;
  counter.textContent=`SEITE ${state.index+1} / ${state.pages.length}`;
  progress.style.width=`${((state.index+1)/state.pages.length)*100}%`;
  localStorage.setItem('trucker-loenhard-last-page',String(state.index));
  preload(state.index+1); preload(state.index-1);
}
function preload(i){if(i>=0&&i<state.pages.length){const im=new Image();im.src=state.pages[i];}}
function move(delta){
  const next=state.index+delta;
  if(next<0){showView('home');return;}
  if(next>=state.pages.length)return;
  state.direction=delta; state.index=next; renderPage();
}
$$('[data-start]').forEach(b=>b.addEventListener('click',startComic));
$('#backHome').addEventListener('click',()=>showView('home'));
$('#prevBtn').addEventListener('click',()=>move(-1)); $('#prevBottom').addEventListener('click',()=>move(-1));
$('#nextBtn').addEventListener('click',()=>move(1)); $('#nextBottom').addEventListener('click',()=>move(1));
$('#fullscreenBtn').addEventListener('click',async()=>{if(!document.fullscreenElement) await document.documentElement.requestFullscreen?.(); else await document.exitFullscreen?.();});
document.addEventListener('keydown',e=>{if(!reader.classList.contains('active-view'))return;if(e.key==='ArrowRight'||e.key===' ')move(1);if(e.key==='ArrowLeft')move(-1);if(e.key==='Escape')showView('home');});
let sx=0; $('#stage').addEventListener('touchstart',e=>sx=e.changedTouches[0].clientX,{passive:true}); $('#stage').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>55)move(dx<0?1:-1);},{passive:true});

// Parallax poster on pointer movement
const poster=$('#poster'); const wrap=$('#posterWrap');
wrap.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=wrap.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;poster.style.transform=`scale(1.035) translate(${x*-9}px,${y*-7}px)`;});
wrap.addEventListener('pointerleave',()=>poster.style.transform='scale(1.01)');

// Dust particles
const dust=$('#dust');
for(let i=0;i<32;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.top=(Math.random()*120+10)+'%';p.style.animationDuration=(8+Math.random()*15)+'s';p.style.animationDelay=(-Math.random()*16)+'s';p.style.transform=`scale(${.4+Math.random()*1.7})`;dust.appendChild(p);}

scanPages();
