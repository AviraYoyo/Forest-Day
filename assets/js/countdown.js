/* =========================================================
   index.html 專用 — 倒數器
   目標：SCHOOL_CONFIG.tripDate 早上 9:30
   到點後顯示 "It's today!"
   ========================================================= */
(function () {
  const el = document.getElementById('countdown');
  if (!el) return;

  const TICK = 30000; // 30 秒刷一次

  function render(msg, cls) {
    el.innerHTML = `<div class="cd-box cd-today ${cls || ''}"><div class="today-msg">${msg}</div></div>`;
  }

  function tick() {
    const target = new Date(SCHOOL_CONFIG.tripDate + 'T09:30:00');
    const diff = target - new Date();

    if (diff <= 0) { render("It's today! 🎉"); return; }

    const days = Math.floor(diff / 86400000);
    const h = Math.floor(diff % 86400000 / 3600000);
    const m = Math.floor(diff % 3600000 / 60000); // ← 之前誤除以 60，才會出現五位數

    el.innerHTML = `
      <div class="cd-box"><div class="n">${days}</div><div class="l">Days</div></div>
      <div class="cd-box"><div class="n">${h}</div><div class="l">Hours</div></div>
      <div class="cd-box"><div class="n">${m}</div><div class="l">Minutes</div></div>`;
  }

  tick();
  setInterval(tick, TICK);
})();
