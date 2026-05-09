const chapters = [
  { id:'ch1', title:'Pelayanan Prima', slides:[
    { title:'Pengertian Pelayanan Prima', content:'Pelayanan prima (excellent service) adalah pelayanan terbaik yang bertujuan untuk memenuhi atau bahkan melampaui harapan pelanggan.' },
    { title:'Konsep A3', content:'<strong>Attitude (Sikap)</strong> — Ramah dan profesional.\n<strong>Attention (Perhatian)</strong> — Peduli kebutuhan pelanggan.\n<strong>Action (Tindakan)</strong> — Melayani dengan nyata.' }
  ]},
  { id:'ch2', title:'Standar Pelayanan', slides:[
    { title:'Komponen Standar', content:'• Produk Layanan\n• Waktu\n• Biaya\n• Sarana Prasarana\n• Kompetensi SDM' }
  ]}
];

const questions = [
  { q:'Apa kepanjangan dari konsep A3?', options:['Attitude, Attention, Action','Ability, Accuracy, Agility','Analysis, Approach, Achievement'], answer:0 },
  { q:'Prinsip memahami perasaan pelanggan disebut...', options:['Konsistensi','Empati','Efisiensi'], answer:1 }
];

const videos = [
  { id:1, title:'Pengenalan Pelayanan Prima', desc:'Konsep dasar pelayanan.', dur:'8:24', embedId:'dQw4w9WgXcQ' }
];

const facts = ["Semakin hitam batang semakin putih getahnya."];

// --- LOGIKA GLOBAL ---
let userData = JSON.parse(localStorage.getItem('hamaUser') || 'null');
let progress = JSON.parse(localStorage.getItem('hamaProgress') || '{"scores":[],"done":[]}');

// Cek Login: Jika bukan di index.html dan tidak ada user, tendang ke index.html
if (!userData && !window.location.href.includes('index.html')) {
    window.location.href = 'index.html';
} else if (userData) {
    const elName = document.getElementById('topbar-name');
    if(elName) elName.textContent = userData.name;
}

function logout() {
    localStorage.removeItem('hamaUser');
    localStorage.removeItem('hamaProgress');
  
  userData = null;
  // Reset variabel progress di memori agar state aplikasi bersih
  progress = { scores: [], done: [] };
    window.location.href = 'index.html';
}

// --- FUNGSI HALAMAN ---
function initDashboard() {
    document.getElementById('dash-name').textContent = userData.name;
    document.getElementById('kfact').textContent = facts[Math.floor(Math.random() * facts.length)];
    const scores = progress.scores || [];
    document.getElementById('stat-attempts').textContent = scores.length;
    if (scores.length) {
        document.getElementById('stat-best').textContent = Math.max(...scores.map(s => Math.round(s.score/s.total*100))) + '%';
        document.getElementById('stat-last').textContent = Math.round(scores[scores.length-1].score/scores[scores.length-1].total*100) + '%';
    }
}

// --- MATERI ---
let chapterIdx = 0, slideIdx = 0;
function renderMateri() {
    const wrap = document.getElementById('chapter-tabs');
    wrap.innerHTML = '';
    chapters.forEach((ch, i) => {
        const btn = document.createElement('button');
        btn.className = 'chapter-tab' + (i === chapterIdx ? ' active' : '');
        btn.innerHTML = `Bab ${i+1}`;
        btn.onclick = () => { chapterIdx = i; slideIdx = 0; renderMateri(); };
        wrap.appendChild(btn);
    });
    const ch = chapters[chapterIdx];
    const sl = ch.slides[slideIdx];
    document.getElementById('slide-title').textContent = sl.title;
    document.getElementById('slide-body').innerHTML = sl.content.replace(/\n/g, '<br>');
    document.getElementById('materi-prog').style.width = ((slideIdx+1)/ch.slides.length*100) + '%';
}
function nextSlide() { if(slideIdx < chapters[chapterIdx].slides.length - 1) { slideIdx++; renderMateri(); } }
function prevSlide() { if(slideIdx > 0) { slideIdx--; renderMateri(); } }

// --- LATIHAN ---
let qCur = 0, qScore = 0, qConfirmed = false;
function startQuiz() {
    const q = questions[qCur];
    document.getElementById('q-text').textContent = q.q;
    const optWrap = document.getElementById('options');
    optWrap.innerHTML = '';
    q.options.forEach((opt, i) => {
        const b = document.createElement('button');
        b.className = 'option-btn';
        b.textContent = opt;
        b.onclick = () => { document.querySelectorAll('.option-btn').forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); };
        optWrap.appendChild(b);
    });
}
function confirmAnswer() {
    const selected = document.querySelector('.option-btn.selected');
    if(!selected || qConfirmed) return;
    qConfirmed = true;
    const q = questions[qCur];
    const isCorrect = q.options.indexOf(selected.textContent) === q.answer;
    if(isCorrect) qScore++;
    selected.classList.add(isCorrect ? 'correct' : 'wrong');
    document.getElementById('btn-confirm').classList.add('hidden');
    document.getElementById('btn-next-q').classList.remove('hidden');
}
function nextQuestion() {
    if(qCur < questions.length - 1) {
        qCur++; qConfirmed = false;
        document.getElementById('btn-confirm').classList.remove('hidden');
        document.getElementById('btn-next-q').classList.add('hidden');
        startQuiz();
    } else {
        finishQuiz();
    }
}
function finishQuiz() {
    progress.scores.push({ score: qScore, total: questions.length });
    localStorage.setItem('hamaProgress', JSON.stringify(progress));
    document.getElementById('page-latihan').classList.add('hidden');
    document.getElementById('page-skor').classList.remove('hidden');
    document.getElementById('score-pct').textContent = Math.round(qScore/questions.length*100) + '%';
}

// --- VIDEO ---
function renderVideos() {
    const list = document.getElementById('video-list');
    videos.forEach(v => {
        const el = document.createElement('div');
        el.className = 'video-item';
        el.innerHTML = `<h3>${v.title}</h3><p>${v.desc}</p>`;
        el.onclick = () => {
            document.getElementById('video-player-wrap').classList.remove('hidden');
            document.getElementById('video-iframe').src = `https://www.youtube.com/embed/${v.embedId}`;
        };
        list.appendChild(el);
    });
}