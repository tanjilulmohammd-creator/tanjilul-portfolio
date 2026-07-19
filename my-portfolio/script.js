// ============ CURSOR ============
const cMain = document.getElementById('cursorMain');
const cTrail = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cMain.style.left = (mx - 5) + 'px';
    cMain.style.top = (my - 5) + 'px';
});

function trail() {
    tx += (mx - tx) * 0.1;
    ty += (my - ty) * 0.1;
    cTrail.style.left = (tx - 17.5) + 'px';
    cTrail.style.top = (ty - 17.5) + 'px';
    requestAnimationFrame(trail);
}
trail();

document.querySelectorAll('a, button, .s-btn, .play-btn, .progress-bar').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cMain.style.transform = 'scale(2.2)';
        cMain.style.background = '#c084fc';
        cTrail.style.transform = 'scale(1.6)';
        cTrail.style.borderColor = 'rgba(192,132,252,0.6)';
    });
    el.addEventListener('mouseleave', () => {
        cMain.style.transform = 'scale(1)';
        cMain.style.background = '#fff';
        cTrail.style.transform = 'scale(1)';
        cTrail.style.borderColor = 'rgba(255,255,255,0.3)';
    });
});

document.addEventListener('mouseleave', () => { cMain.style.opacity = '0'; cTrail.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cMain.style.opacity = '1'; cTrail.style.opacity = '1'; });

// ============ BACKGROUND ============
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let w, h, t = 0;

function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

function bgAnimate() {
    ctx.clearRect(0, 0, w, h);
    t += 0.008;
    
    const colors = [
        'rgba(168, 85, 247, 0.06)',
        'rgba(236, 72, 153, 0.05)',
        'rgba(59, 130, 246, 0.05)',
        'rgba(16, 185, 129, 0.04)',
        'rgba(245, 158, 11, 0.04)'
    ];
    
    for (let c = 0; c < colors.length; c++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 15) {
            const y = h * 0.35 + c * 60 + 
                Math.sin(x * 0.006 + t + c * 0.8) * 35 + 
                Math.cos(x * 0.003 + t * 0.6 + c) * 25 +
                Math.sin(x * 0.01 - t * 0.4 + c * 1.5) * 20;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = colors[c];
        ctx.lineWidth = 2.5;
        ctx.stroke();
    }
    
    for (let i = 0; i < 30; i++) {
        const x = (Math.sin(i * 73 + t * 0.5) * 0.5 + 0.5) * w;
        const y = (Math.cos(i * 47 + t * 0.7) * 0.5 + 0.5) * h;
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180, 170, 220, 0.35)';
        ctx.fill();
    }
    
    requestAnimationFrame(bgAnimate);
}
bgAnimate();

// ============ AUDIO + SPLASH ============
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const eq = document.getElementById('musicEq');
const songStatus = document.getElementById('songStatus');
const splash = document.getElementById('splashScreen');
const card = document.getElementById('mainCard');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');

let playing = false;
audio.volume = 1.0;

// Format time
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return min + ':' + (sec < 10 ? '0' : '') + sec;
}

// Update progress bar
function updateProgress() {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + '%';
        progressThumb.style.left = percent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalTimeEl.textContent = formatTime(audio.duration);
    }
}

// Seek when clicking progress bar
progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
});

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', updateProgress);

function updateMusicUI() {
    if (playing) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        eq.classList.add('playing');
        songStatus.textContent = 'Playing...';
    } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        eq.classList.remove('playing');
        songStatus.textContent = 'Paused';
    }
}

// 🎯 Splash tap = start music + show card
splash.addEventListener('click', () => {
    audio.play().then(() => {
        playing = true;
        updateMusicUI();
    }).catch(() => {});
    
    splash.classList.add('hidden');
    setTimeout(() => card.classList.add('visible'), 300);
    setTimeout(() => splash.style.display = 'none', 800);
});

// Play/Pause
playBtn.addEventListener('click', () => {
    if (playing) {
        audio.pause();
        playing = false;
    } else {
        audio.play().then(() => { playing = true; }).catch(() => {});
        playing = true;
    }
    updateMusicUI();
});

audio.addEventListener('play', () => { playing = true; updateMusicUI(); });
audio.addEventListener('pause', () => { playing = false; updateMusicUI(); });
audio.addEventListener('ended', () => { playing = false; updateMusicUI(); });

updateMusicUI();

// ============ TITLE ============
const titles = ['🎓 Student', '🎮 Gamer', '🎖️ BNCC'];
const titleEl = document.getElementById('titleWord');
let idx = 0;
function changeTitle() {
    titleEl.classList.add('exit');
    setTimeout(() => {
        idx = (idx + 1) % titles.length;
        titleEl.textContent = titles[idx];
        titleEl.classList.remove('exit');
        titleEl.classList.add('enter');
        requestAnimationFrame(() => titleEl.classList.remove('enter'));
    }, 400);
}
let titleTimer;
splash.addEventListener('click', () => {
    setTimeout(() => { titleTimer = setInterval(changeTitle, 3000); }, 1500);
});

console.log('🎵 TANJILUL | Full Music Player Ready!');