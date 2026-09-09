const COMIC = {
  title: 'The Adventure of Trucker Lönhard',
  chapterSize: 20,
  maxPages: 250,
  stopAfterMissingNumbers: 3,
  extensions: ['png','jpg','jpeg','webp'],
  numberFormats: [n => String(n), n => String(n).padStart(2,'0'), n => String(n).padStart(3,'0')]
};

let pages = [];
let currentPage = 0;
const views = [...document.querySelectorAll('.view')];
const img = document.getElementById('comicImage');
const counter = document.getElementById('pageCounter');
const progress = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const gallery = document.getElementById('galleryGrid');
const chapterGrid = document.getElementById('chapterGrid');
const startComicBtn = document.getElementById('startComic');
const resumeHint = document.getElementById('resumeHint');
const loadingStatus = document.getElementById('loadingStatus');

function showView(id){
  views.forEach(v => v.classList.toggle('active', v.id === id));
  window.scrollTo({top:0, behavior:'instant'});
}

function imageExists(src){
  return new Promise(resolve => {
    const test = new Image();
    test.onload = () => resolve(true);
    test.onerror = () => resolve(false);
    test.src = src + '?v=' + encodeURIComponent(document.lastModified || '1');
  });
}

async function findPage(number){
  for (const format of COMIC.numberFormats){
    const base = format(number);
    for (const ext of COMIC.extensions){
      const src = `comic/${base}.${ext}`;
      if (await imageExists(src)) return src;
    }
  }
  return null;
}

async function discoverPages(){
  pages = [];
  let misses = 0;
  for(let n=1; n<=COMIC.maxPages && misses<COMIC.stopAfterMissingNumbers; n++){
    if (loadingStatus) loadingStatus.textContent = `Suche Comicseite ${n} …`;
    const found = await findPage(n);
    if(found){ pages.push(found); misses = 0; }
    else misses++;
  }

  if(!pages.length){
    pages = ['comic/1.svg','comic/2.svg','comic/3.svg'];
    if (loadingStatus) loadingStatus.textContent = 'Demo-Seiten geladen – ersetze sie später durch deine nummerierten Bilder.';
  } else if (loadingStatus){
    loadingStatus.textContent = `${pages.length} Comicseiten gefunden.`;
  }

  buildChapters();
  buildGallery();
  setupResume();
  renderPage();
}

function savedPage(){
  const n = Number(localStorage.getItem('truckerLoenhardPage'));
  return Number.isInteger(n) && n >= 0 && n < pages.length ? n : 0;
}

function setupResume(){
  const saved = savedPage();
  if(saved > 0){
    startComicBtn.textContent = `WEITERLESEN · SEITE ${saved + 1}`;
    if(resumeHint) resumeHint.textContent = `Dein Lesefortschritt wurde gespeichert: Seite ${saved + 1} von ${pages.length}.`;
  } else {
    startComicBtn.textContent = 'COMIC STARTEN';
    if(resumeHint) resumeHint.textContent = `${pages.length} Seiten verfügbar.`;
  }
}

function renderPage(){
  if(!pages.length) return;
  currentPage = Math.max(0, Math.min(currentPage, pages.length - 1));
  img.src = pages[currentPage];
  img.alt = `Comicseite ${currentPage + 1}`;
  counter.textContent = `Seite ${currentPage + 1} / ${pages.length}`;
  progress.style.width = `${((currentPage + 1) / pages.length) * 100}%`;
  prevBtn.disabled = currentPage === 0;
  prevBtn.style.opacity = currentPage === 0 ? '.45' : '1';
  nextBtn.textContent = currentPage === pages.length - 1 ? 'ENDE ✓' : 'WEITER →';
  localStorage.setItem('truckerLoenhardPage', String(currentPage));
  const chapter = Math.floor(currentPage / COMIC.chapterSize) + 1;
  document.getElementById('readerTitle').textContent = `Kapitel ${chapter} · Trucker Lönhard`;
}

function openReader(index=0){
  currentPage = Math.max(0, Math.min(index, pages.length - 1));
  renderPage();
  showView('reader');
}
function next(){ if(currentPage < pages.length - 1){ currentPage++; renderPage(); } else { showView('chapters'); } }
function prev(){ if(currentPage > 0){ currentPage--; renderPage(); } }

function buildChapters(){
  chapterGrid.innerHTML = '';
  const count = Math.ceil(pages.length / COMIC.chapterSize);
  for(let c=0; c<count; c++){
    const start = c * COMIC.chapterSize;
    const end = Math.min(start + COMIC.chapterSize, pages.length);
    const card = document.createElement('article');
    card.className = 'chapter-card featured';
    card.innerHTML = `<div class="chapter-number">${String(c+1).padStart(2,'0')}</div><div><p class="smallcaps">KAPITEL ${c+1}</p><h3>${c === 0 ? 'Die Reise beginnt' : 'Weiter auf der Route'}</h3><p>Comicseiten ${start+1}–${end}</p><button class="text-button">Kapitel lesen →</button></div>`;
    card.addEventListener('click', () => openReader(start));
    chapterGrid.appendChild(card);
  }
}

function buildGallery(){
  gallery.innerHTML = '';
  pages.forEach((src,i)=>{
    const el=document.createElement('article');
    el.className='gallery-item';
    el.innerHTML=`<div class="gallery-thumb"><img loading="lazy" src="${src}" alt="Comicseite ${i+1}"></div><p>Seite ${i+1}</p>`;
    el.addEventListener('click',()=>openReader(i));
    gallery.appendChild(el);
  });
}

document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click',()=>showView(b.dataset.go)));
startComicBtn.addEventListener('click',()=>openReader(savedPage()));
document.getElementById('startFromBeginning').addEventListener('click',()=>openReader(0));
prevBtn.addEventListener('click',prev); nextBtn.addEventListener('click',next);
document.getElementById('prevSide').addEventListener('click',prev);
document.getElementById('nextSide').addEventListener('click',next);
document.getElementById('fullscreenBtn').addEventListener('click',()=>{
  const stage=document.getElementById('comicStage');
  if(!document.fullscreenElement) stage.requestFullscreen?.(); else document.exitFullscreen?.();
});

document.addEventListener('keydown',e=>{
  if(!document.getElementById('reader').classList.contains('active')) return;
  if(e.key==='ArrowRight') next();
  if(e.key==='ArrowLeft') prev();
  if(e.key==='Escape' && document.fullscreenElement) document.exitFullscreen?.();
});
let touchStart=0;
document.getElementById('comicStage').addEventListener('touchstart',e=>touchStart=e.changedTouches[0].screenX,{passive:true});
document.getElementById('comicStage').addEventListener('touchend',e=>{ const d=e.changedTouches[0].screenX-touchStart; if(Math.abs(d)>55) d<0?next():prev(); },{passive:true});

discoverPages();
