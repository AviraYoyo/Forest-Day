/* =========================================================
   quiz.html 專用 — 小測驗 + 證書
   ========================================================= */
(function () {
  const box = document.getElementById('quizBox');
  const scoreEl = document.getElementById('scoreBar');
  const certEl = document.getElementById('certBox');
  if (!box) return;

  let answers = [];

  function render() {
    box.innerHTML = QUIZ.map((q, i) => `
      <div class="card quiz-q" data-i="${i}">
        ${q.img ? `<div class="qimg"><img src="assets/img/book/${q.img}" alt=""></div>` : ''}
        <h4>${i + 1}. ${esc(q.q)}</h4>
        ${q.opts.map((o, j) => `<button class="opt" data-i="${i}" data-j="${j}">${esc(o)}</button>`).join('')}
      </div>`).join('');
    box.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => pick(b)));
    updateScore();
  }

  function pick(btn) {
    const i = +btn.dataset.i, j = +btn.dataset.j;
    const card = box.querySelector(`.card[data-i="${i}"]`);
    card.querySelectorAll('.opt').forEach(o => { o.disabled = true; o.classList.remove('sel-right', 'sel-wrong'); });
    const ok = j === QUIZ[i].a;
    answers[i] = ok;
    btn.classList.add(ok ? 'sel-right' : 'sel-wrong');
    card.querySelectorAll('.opt')[QUIZ[i].a].classList.add('sel-right');
    updateScore();
  }

  function updateScore() {
    const done = answers.filter(x => x !== undefined).length;
    const right = answers.filter(Boolean).length;
    scoreEl.textContent = done < QUIZ.length
      ? `Done ${done}/${QUIZ.length} — Correct: ${right}`
      : `Your score: ${right} / ${QUIZ.length}`;
    if (done === QUIZ.length) {
      const medal = right >= 10 ? { e: '🏆', t: 'Forest Champion 森林冠軍' }
                  : right >= 8  ? { e: '🥇', t: 'Growing Explorer 進階探險家' }
                  : right >= 6  ? { e: '🌱', t: 'Little Explorer 小小探險家' }
                  : null;
      if (medal && right >= 8) {
        const name = localStorage.getItem('explorerName') || '';
        certEl.style.display = '';
        certEl.innerHTML = `
          <div class="cert">
            <div style="font-size:12px;letter-spacing:2px;color:#8a7a3a">FOREST EXPLORER CERTIFICATE</div>
            <h3>Forest Explorer</h3>
            <div class="medal">${medal.e}</div>
            <div style="font-size:14px;color:#7a5600">${medal.t}</div>
            <input class="name-input" id="certName" placeholder="Your name 你的名字" value="${esc(name)}">
            <p>This is to certify that you are ready for our Forest Day at Tai Shui Hang.<br>
            ${SCHOOL_CONFIG.schoolName} ${SCHOOL_CONFIG.className} · ${SCHOOL_CONFIG.tripDate}</p>
            <button class="btn btn-primary no-print" onclick="window.print()">Print my certificate 🖨️</button>
          </div>`;
        const inp = document.getElementById('certName');
        inp.addEventListener('input', () => localStorage.setItem('explorerName', inp.value));
      } else {
        certEl.style.display = '';
        certEl.innerHTML = `
          <div class="notice warn"><b>Almost there!</b>
            <span class="cn-text">要拿到證書需要 8 題或以上正確。再試一次吧 —— 想想繪本裡的畫面。</span>
            <br><button class="btn btn-ghost" style="margin-top:10px" id="retryBtn">Try again 再試一次</button></div>`;
        document.getElementById('retryBtn').addEventListener('click', () => { answers = []; render(); certEl.style.display = 'none'; });
      }
    }
  }

  render();
})();
