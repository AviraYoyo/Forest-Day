/* =========================================================
   index.html 專用 — 倒數器
   ========================================================= */
(function () {
  const el = document.getElementById('countdown');
  if (!el) return;

  function tick() {
    const target = new Date(SCHOOL_CONFIG.tripDate + 'T09:00:00');
    const now = new Date();
    let days = Math.ceil((target - now) / 86400000);
    if (days < 0) days = 0;
    const h = Math.max(0, Math.floor((target - now) % 86400000 / 3600000));
    const m = Math.max(0, Math.floor((target - now) % 3600000 / 60));
    el.innerHTML = `
      <div class="cd-box"><div class="n">${days}</div><div class="l">Days</div></div>
      <div class="cd-box"><div class="n">${h}</div><div class="l">Hours</div></div>
      <div class="cd-box"><div class="n">${m}</div><div class="l">Minutes</div></div>`;
  }
  tick();
  setInterval(tick, 30000);
})();
