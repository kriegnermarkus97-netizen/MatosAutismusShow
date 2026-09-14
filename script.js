const PAGE_COUNT = 90;

const state = {
    pages: Array.from(
        { length: PAGE_COUNT },
        (_, i) => `comic/${i + 1}.png`
    ),
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

function showView(which) {
    home.classList.toggle('active-view', which === 'home');
    reader.classList.toggle('active-view', which === 'reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startComic() {
    state.index = 0;
    showView('reader');
    renderPage();
}

function renderPage() {
    if (!state.pages.length) return;
    loader.style.display = 'block';
    pageImg.classList.remove('show');
    const src = state.pages[state.index];
    pageImg.onload = () => {
        loader.style.display = 'none';
        void pageImg.offsetWidth;
        pageImg.classList.add('show');
    };
    pageImg.onerror = () => {
        loader.style.display = 'none';
        console.error(`Comicseite konnte nicht geladen werden: ${src}`);
    };
    pageImg.src = src;
    pageImg.alt = `Comicseite ${state.index + 1}`;
    counter.textContent = `SEITE ${state.index + 1} / ${state.pages.length}`;
    progress.style.width = `${((state.index + 1) / state.pages.length) * 100}%`;
    localStorage.setItem('trucker-loenhard-last-page', String(state.index));
    preload(state.index + 1);
    preload(state.index - 1);
}

function preload(i) {
    if (i >= 0 && i < state.pages.length) {
        const im = new Image();
        im.src = state.pages[i];
    }
}

function move(delta) {
    const next = state.index + delta;
    if (next < 0) {
        showView('home');
        return;
    }
    if (next >= state.pages.length) return;
    state.direction = delta;
    state.index = next;
    renderPage();
}

$$('[data-start]').forEach(button => button.addEventListener('click', startComic));
$('#backHome').addEventListener('click', () => showView('home'));
$('#prevBtn').addEventListener('click', () => move(-1));
$('#prevBottom').addEventListener('click', () => move(-1));
$('#nextBtn').addEventListener('click', () => move(1));
$('#nextBottom').addEventListener('click', () => move(1));
$('#fullscreenBtn').addEventListener('click', async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    else await document.exitFullscreen?.();
});

document.addEventListener('keydown', e => {
    if (!reader.classList.contains('active-view')) return;
    if (e.key === 'ArrowRight' || e.key === ' ') move(1);
    if (e.key === 'ArrowLeft') move(-1);
    if (e.key === 'Escape') showView('home');
});

let sx = 0;
$('#stage').addEventListener('touchstart', e => { sx = e.changedTouches[0].clientX; }, { passive: true });
$('#stage').addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 55) move(dx < 0 ? 1 : -1);
}, { passive: true });

const poster = $('#poster');
const wrap = $('#posterWrap');
wrap.addEventListener('pointermove', e => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    poster.style.transform = `scale(1.035) translate(${x * -9}px, ${y * -7}px)`;
});
wrap.addEventListener('pointerleave', () => { poster.style.transform = 'scale(1.01)'; });

const dust = $('#dust');
for (let i = 0; i < 32; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 120 + 10 + '%';
    p.style.animationDuration = 8 + Math.random() * 15 + 's';
    p.style.animationDelay = -Math.random() * 16 + 's';
    p.style.transform = `scale(${0.4 + Math.random() * 1.7})`;
    dust.appendChild(p);
}

/* TRUCKER-LÖNHARD CHAOS-BUTTON */
const chaosButton = document.getElementById('chaosButton');
const chaosEvent = document.getElementById('chaosEvent');

if (chaosButton && chaosEvent) {
    const chaosEvents = [
        () => showChaosText('🚛 BRUMM BRUMM!', 'chaos-purple'),
        () => showChaosText('🍺 TRUCKER LUL!', 'chaos-orange'),
        () => fridolinEvent(),
        () => elVikoEvent(),
        () => eloqueen500SubsEvent(),
        () => ochDiggiEvent(),
        () => showChaosText('🤠 GHETTOQUEENS SORGT FÜR RECHT UND ORDNUNG!', 'chaos-pink'),
        () => wolfJumpscare(),
        () => showChaosText('🐢 KRÖTE!', 'chaos-blue'),
        () => showChaosText('🛣️ ROUTE 69', 'chaos-purple')
    ];
    chaosButton.addEventListener('click', () => {
        const randomEvent = chaosEvents[Math.floor(Math.random() * chaosEvents.length)];
        randomEvent();
    });
}

function showChaosText(text, className) {
    const message = document.createElement('div');
    message.className = `chaos-message ${className}`;
    message.textContent = text;
    chaosEvent.appendChild(message);
    setTimeout(() => message.remove(), 2200);
}

function fridolinEvent() {
    const fridolin = document.createElement('img');
    fridolin.src = 'schlange.png';
    fridolin.alt = 'Fridolin';
    fridolin.className = 'chaos-fridolin';
    chaosEvent.appendChild(fridolin);
    setTimeout(() => fridolin.remove(), 5000);
}

function eloqueen500SubsEvent() {
    const wrap = document.createElement('div');
    wrap.setAttribute('role', 'status');
    wrap.setAttribute('aria-label', 'ELOQUEEN fragt: Schaffen wir heute noch die 500 Subs?');
    Object.assign(wrap.style, {
        position: 'fixed', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%) scale(.7)',
        width: 'min(94vw, 1100px)', zIndex: '99999', pointerEvents: 'none', opacity: '0',
        filter: 'drop-shadow(0 20px 35px rgba(0,0,0,.7))',
        transition: 'opacity .28s ease, transform .38s cubic-bezier(.2,.9,.2,1.2)'
    });
    const image = document.createElement('img');
    image.src = 'eloqueen-500-subs.png';
    image.alt = 'ELOQUEEN: SCHAFFEN WIR HEUTE NOCH DIE 500 SUBS?';
    Object.assign(image.style, { display: 'block', width: '100%', height: 'auto', maxHeight: '78vh', objectFit: 'contain' });
    image.onerror = () => {
        image.remove();
        const fallback = document.createElement('div');
        fallback.textContent = 'SCHAFFEN WIR HEUTE NOCH DIE 500 SUBS?';
        Object.assign(fallback.style, {
            padding: '24px 30px', border: '5px solid #ff48b7', borderRadius: '28px', background: '#fff', color: '#111',
            textAlign: 'center', font: '900 clamp(28px, 6vw, 64px)/1 Impact, system-ui, sans-serif',
            boxShadow: '0 0 35px rgba(255,40,180,.7)'
        });
        wrap.appendChild(fallback);
    };
    wrap.appendChild(image);
    chaosEvent.appendChild(wrap);
    requestAnimationFrame(() => {
        wrap.style.opacity = '1';
        wrap.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    setTimeout(() => {
        wrap.style.opacity = '0';
        wrap.style.transform = 'translate(-50%, -50%) scale(.82)';
    }, 4200);
    setTimeout(() => wrap.remove(), 4700);
}

/* OCH DIGGI – Neon Fiesta Banner */
function ochDiggiEvent() {
    const wrap = document.createElement('div');
    wrap.setAttribute('role', 'status');
    wrap.setAttribute('aria-label', 'OCH DIGGI!');
    Object.assign(wrap.style, {
        position: 'fixed', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%) rotate(-5deg) scale(.2)',
        width: 'min(82vw, 900px)', zIndex: '100000', pointerEvents: 'none', opacity: '0',
        filter: 'drop-shadow(0 0 12px #ff2bd6) drop-shadow(0 0 25px #31e7ff) drop-shadow(0 0 45px #ffe63b)',
        transition: 'opacity .18s ease, transform .45s cubic-bezier(.16,1.25,.3,1)'
    });
    const image = document.createElement('img');
    image.src = 'och-diggi.png';
    image.alt = 'OCH DIGGI!';
    Object.assign(image.style, { display: 'block', width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain' });
    image.onerror = () => {
        image.remove();
        const fallback = document.createElement('div');
        fallback.textContent = 'OCH DIGGI!';
        Object.assign(fallback.style, {
            color: '#fff', textAlign: 'center', font: '900 clamp(54px, 12vw, 150px)/.9 Impact, system-ui, sans-serif',
            textShadow: '0 0 8px #fff, 0 0 18px #ff2bd6, 0 0 32px #31e7ff, 0 0 48px #ffe63b'
        });
        wrap.appendChild(fallback);
    };
    wrap.appendChild(image);
    chaosEvent.appendChild(wrap);
    requestAnimationFrame(() => {
        wrap.style.opacity = '1';
        wrap.style.transform = 'translate(-50%, -50%) rotate(2deg) scale(1.08)';
        setTimeout(() => { wrap.style.transform = 'translate(-50%, -50%) rotate(-1deg) scale(1)'; }, 420);
    });
    setTimeout(() => {
        wrap.style.opacity = '0';
        wrap.style.transform = 'translate(-50%, -50%) rotate(6deg) scale(1.35)';
    }, 2600);
    setTimeout(() => wrap.remove(), 3100);
}

function wolfJumpscare() {
    const scare = document.createElement('div');
    scare.className = 'wolf-jumpscare';
    const image = document.createElement('img');
    image.src = 'wolf-jumpscare.png';
    image.alt = 'Wolf Jumpscare';
    scare.appendChild(image);
    chaosEvent.appendChild(scare);
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(130, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(55, audioContext.currentTime + 0.65);
    gain.gain.setValueAtTime(0.65, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.8);
    setTimeout(() => {
        scare.remove();
        audioContext.close();
    }, 1700);
}

function elVikoEvent() {
    const music = new Audio('mariachi.mp3');
    music.volume = 0.6;
    music.currentTime = 0;
    music.play().catch(error => console.log('Musik konnte nicht gestartet werden:', error));
    const vikoContainer = document.createElement('div');
    vikoContainer.className = 'el-viko-container';
    const viko = document.createElement('img');
    viko.src = 'el-viko-tanz.png';
    viko.alt = 'EL VIKO';
    viko.className = 'el-viko-dancer';
    vikoContainer.appendChild(viko);
    chaosEvent.appendChild(vikoContainer);
    const salud = document.createElement('div');
    salud.className = 'el-viko-salud';
    salud.textContent = '¡SALUD!';
    setTimeout(() => chaosEvent.appendChild(salud), 1100);
    setTimeout(() => salud.remove(), 4800);
    setTimeout(() => {
        music.pause();
        music.currentTime = 0;
        vikoContainer.remove();
    }, 6000);
}

if (window.location.hash === '#reader') startComic();
