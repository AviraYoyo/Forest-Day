/* =========================================================
   words.html 專用 — 詞語翻卡
   ========================================================= */
(function () {
  const grid = document.getElementById('flipGrid');
  const tabs = document.getElementById('wordTabs');
  if (!grid || !tabs) return;

  const state = { grp: 'all' };

  function renderTabs() {
    tabs.innerHTML =
      `<button class="${state.grp === 'all' ? 'on' : ''}" data-g="all">All · 全部</button>` +
      WORD_GROUPS.map(g =>
        `<button class="${state.grp === g.key ? 'on' : ''}" data-g="${g.key}">
           ${g.emoji} ${g.en}<span class="cn-text"> · ${g.cn}</span></button>`).join('');
    tabs.querySelectorAll('button').forEach(b =>
      b.addEventListener('click', () => { state.grp = b.dataset.g; renderTabs(); renderCards(); }));
  }

  function renderCards() {
    const list = WORDS.filter(w => state.grp === 'all' || w.grp === state.grp);
    grid.innerHTML = list.map(w => `
      <div class="flip" tabindex="0">
        <div class="flip-inner">
          <div class="flip-face flip-front">
            <div class="ic">${w.icon}</div>
            <div class="w">${esc(w.en)}</div>
            <div class="pos">${w.pos}</div>
          </div>
          <div class="flip-face flip-back">
            <div class="cn-w">${esc(w.cn)}</div>
            ${w.ing ? `<div style="font-size:12px;opacity:.85">-ing: ${w.ing}</div>` : ''}
            <div class="sent">${esc(w.sent)}</div>
          </div>
        </div>
      </div>`).join('');
    grid.querySelectorAll('.flip').forEach(f => {
      const toggle = () => f.classList.toggle('flipped');
      f.addEventListener('click', toggle);
      f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    });
  }

  renderTabs();
  renderCards();
})();
