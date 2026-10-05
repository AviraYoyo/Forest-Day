/* =========================================================
   main.js — 導覽、中文開關、共用工具
   ========================================================= */

/* --- 中文解釋開關（全站，localStorage 記住） --- */
(function () {
  const saved = localStorage.getItem('cnOn');
  if (saved === '1') document.documentElement.classList.add('cn-on');

  window.initCnToggle = function () {
    const btn = document.getElementById('cnToggle');
    if (!btn) return;
    const sync = () => btn.classList.toggle('on', document.documentElement.classList.contains('cn-on'));
    sync();
    btn.addEventListener('click', () => {
      document.documentElement.classList.toggle('cn-on');
      const on = document.documentElement.classList.contains('cn-on');
      localStorage.setItem('cnOn', on ? '1' : '0');
      sync();
    });
  };
})();

/* --- 產生導覽列 --- */
function buildNav() {
  const here = location.pathname.split('/').pop() || 'index.html';
  const el = document.getElementById('topbar');
  if (!el) return;
  el.innerHTML = `
    <div class="topbar-inner">
      <a class="brand" href="index.html"><span class="leaf">🌳</span> Forest Day</a>
      <nav class="nav-links">
        ${NAV.map(n => `<a href="${n.href}" class="${n.href === here ? 'active' : ''}">
            <span class="en-text">${n.icon} ${n.en}</span><span class="cn-text">${n.cn}</span>
          </a>`).join('')}
      </nav>
      <button class="cn-toggle" id="cnToggle" title="Show Chinese / 顯示中文">中文</button>
    </div>`;
  initCnToggle();
}

/* --- 產生頁尾 --- */
function buildFooter() {
  const el = document.getElementById('footer');
  if (!el) return;
  el.innerHTML = `
    <div><b>${SCHOOL_CONFIG.schoolName} ${SCHOOL_CONFIG.className}</b> ·
      Forest Adventures Reading Unit</div>
    <div style="margin-top:4px">Made for our P.2 Forest Day 🌳 — illustrations AI-generated, text original.</div>`;
}

/* --- 小工具：安全取字 --- */
const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* --- 依詞彙表把繪本文字裡的目標詞上色（不做，太複雜；改為點擊詞卡） --- */
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  buildFooter();
});
