// === Repàs PAF M0487 — Lògica compartida ===

// --- Tabs ---
function showTab(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Tracker (puntuació estil IOC: +0,5 / -0,125 / 0 en blanc) ---
const STORAGE_KEY = 'paf_m0487_score';

function getScore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { ok: 0, ko: 0, blank: 0, points: 0 };
  } catch { return { ok: 0, ko: 0, blank: 0, points: 0 }; }
}
function saveScore(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
function renderTracker() {
  const t = document.getElementById('tracker');
  if (!t) return;
  const s = getScore();
  const total = s.ok + s.ko + s.blank;
  t.innerHTML = `
    <div class="label">Puntuació PAF</div>
    <div class="score">${s.points.toFixed(2)} pts</div>
    <div class="stats">✓ ${s.ok} · ✗ ${s.ko} · — ${s.blank} (${total} resp.)</div>
    <button class="reset" onclick="resetScore()">Reiniciar</button>
  `;
}
function resetScore() {
  if (confirm('Reiniciar la puntuació?')) {
    saveScore({ ok: 0, ko: 0, blank: 0, points: 0 });
    renderTracker();
    document.querySelectorAll('.opt').forEach(b => {
      b.disabled = false;
      b.classList.remove('correct', 'wrong');
    });
    document.querySelectorAll('.explain').forEach(e => e.classList.remove('show'));
  }
}

// --- Quiz: respondre pregunta ---
function answer(btn, correct, qId, exam) {
  const opts = btn.parentElement.querySelectorAll('.opt');
  if ([...opts].some(o => o.disabled)) return; // ja respost

  const isCorrect = btn.dataset.opt === correct;
  opts.forEach(o => {
    o.disabled = true;
    if (o.dataset.opt === correct) o.classList.add('correct');
    else if (o === btn) o.classList.add('wrong');
  });
  const explain = document.getElementById('exp_' + qId);
  if (explain) explain.classList.add('show');

  // Si és quiz d'examen (exam=true), aplica fórmula IOC
  if (exam) {
    const s = getScore();
    if (isCorrect) { s.ok++; s.points += 0.5; }
    else { s.ko++; s.points -= 0.125; }
    saveScore(s);
    renderTracker();
  }
}

// --- Quiz: deixar en blanc ---
function blank(btn, correct, qId) {
  const opts = btn.parentElement.querySelectorAll('.opt');
  if ([...opts].some(o => o.disabled)) return;
  opts.forEach(o => {
    o.disabled = true;
    if (o.dataset.opt === correct) o.classList.add('correct');
  });
  const explain = document.getElementById('exp_' + qId);
  if (explain) explain.classList.add('show');

  const s = getScore();
  s.blank++;
  saveScore(s);
  renderTracker();
}

// --- Inicialització ---
document.addEventListener('DOMContentLoaded', () => {
  renderTracker();
  // Activar primer tab si n'hi ha
  const firstTab = document.querySelector('.tab');
  if (firstTab && !document.querySelector('.tab.active')) {
    firstTab.click();
  }
});

// --- Utils per simulacre: random ---
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
