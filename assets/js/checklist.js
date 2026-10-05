/* =========================================================
   bring.html 專用 — 行李清單（localStorage 持久化）
   ========================================================= */
(function () {
  const list = document.getElementById('bringList');
  if (!list) return;
  const KEY = 'forestBringList';

  const saved = JSON.parse(localStorage.getItem(KEY) || '{}');

  function render() {
    list.innerHTML = BRING_LIST.map((b, i) => `
      <label class="bring-item ${saved[i] ? 'done' : ''}">
        <input type="checkbox" data-i="${i}" ${saved[i] ? 'checked' : ''}>
        <span class="ic">${b.icon}</span>
        <span class="tx">
          <span class="en">${esc(b.en)}</span>
        </span>
      </label>`).join('');
    list.querySelectorAll('input').forEach(cb => cb.addEventListener('change', () => {
      saved[cb.dataset.i] = cb.checked;
      localStorage.setItem(KEY, JSON.stringify(saved));
      cb.closest('.bring-item').classList.toggle('done', cb.checked);
    }));
  }

  const resetBtn = document.getElementById('resetBring');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    if (confirm('Clear all ticks?')) { localStorage.removeItem(KEY); Object.keys(saved).forEach(k => delete saved[k]); render(); }
  });

  render();
})();
