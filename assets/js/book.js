/* =========================================================
   book.html 專用 — 電子繪本閱讀器（含全班朗讀自動翻頁）
   ========================================================= */
(function () {
  const stage = document.getElementById('bookStage');
  if (!stage) return;

  const img = document.getElementById('bookImg');
  const txt = document.getElementById('bookText');
  const pageNo = document.getElementById('bookPageNo');
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  const dots = document.getElementById('dots');
  const autoBtn = document.getElementById('autoBtn');
  const titleEl = document.getElementById('bookTitle');

  let i = 0, timer = null;

  function pageLabel(p) {
    const total = BOOK_PAGES.filter(x => x.n).length;
    return p.n ? `Page ${p.n} / ${total}` : (p.title || '');
  }

  /* ★ 每一句話獨立一行：英文按 . ! ? 切句，中文按 。！？ 切句 */
  function splitEn(s) {
    const out = []; let buf = '';
    for (let k = 0; k < s.length; k++) {
      buf += s[k];
      if (/[.!?]/.test(s[k])) {
        /* 標點後要先吃掉閉引號（"Check your bag!" I have...），
           引號留在前一句，下一行才不會出現多餘的 " */
        let j = k + 1;
        while (j < s.length && /["”’]/.test(s[j])) j++;
        const rest = s.slice(j);
        if (rest && /^\s+["“']?\s*[A-Z]/.test(rest)) {
          buf += s.slice(k + 1, j);
          out.push(buf.trim()); buf = '';
          k = j - 1;
        }
      }
    }
    if (buf.trim()) out.push(buf.trim());
    return out.length ? out : [s];
  }
  function splitCn(s) {
    const m = s.match(/[^。！？]+[。！？]|[^。！？]+$/g);
    return (m && m.length) ? m.map(x => x.trim()).filter(Boolean) : [s];
  }
  /* 詩頁：先按原本的換行拆，再按句子拆 */
  function linesOf(text, isCn, isPoem) {
    const chunks = isPoem ? text.split('\n') : [text];
    const sp = isCn ? splitCn : splitEn;
    return chunks.reduce((acc, c) => acc.concat(sp(c)), []).filter(Boolean);
  }
  function blockLines(text, cls, isCn, isPoem) {
    return linesOf(text, isCn, isPoem)
      .map(t => `<span class="sen${cls ? ' ' + cls : ''}">${esc(t)}</span>`).join('');
  }

  function render() {
    const p = BOOK_PAGES[i];
    img.src = 'assets/img/book/' + p.img;
    img.alt = p.title || ('Page ' + p.n);
    pageNo.textContent = pageLabel(p);
    if (titleEl) titleEl.textContent = p.title ? p.title : '';
    if (p.poem) {
      txt.classList.add('is-poem');
      stage.classList.add('is-poem');
      txt.innerHTML = `
        <span class="en-line poem-en">${blockLines(p.en, '', false, true)}</span>
        <span class="book-cn poem-cn">${blockLines(p.cn, '', true, true)}</span>`;
    } else {
      txt.classList.remove('is-poem');
      stage.classList.remove('is-poem');
      txt.classList.toggle('is-rules', !!p.rules);
      stage.classList.toggle('is-rules', !!p.rules);
      txt.innerHTML = `
        <span class="en-line">${blockLines(p.en, '', false, false)}</span>
        <span class="book-cn">${blockLines(p.cn, '', true, false)}</span>`;
    }
    prev.disabled = (i === 0);
    next.disabled = (i === BOOK_PAGES.length - 1);
    dots.querySelectorAll('button').forEach((d, k) => d.classList.toggle('on', k === i));
    stage.classList.remove('rise'); void stage.offsetWidth; stage.classList.add('rise');
  }

  dots.innerHTML = BOOK_PAGES.map((p, k) =>
    `<button title="${pageLabel(p)}" data-k="${k}"></button>`).join('');
  dots.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    i = +b.dataset.k; render();
  });

  prev.addEventListener('click', () => { if (i > 0) { i--; render(); } });
  next.addEventListener('click', () => { if (i < BOOK_PAGES.length - 1) { i++; render(); } });
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && i > 0) { i--; render(); }
    if (e.key === 'ArrowRight' && i < BOOK_PAGES.length - 1) { i++; render(); }
  });

  /* 全班朗讀模式：每 8 秒自動翻頁 */
  autoBtn.addEventListener('click', () => {
    if (timer) { clearInterval(timer); timer = null; autoBtn.textContent = '▶ Read together'; return; }
    autoBtn.textContent = '⏸ Stop';
    timer = setInterval(() => {
      if (i < BOOK_PAGES.length - 1) { i++; render(); }
      else { clearInterval(timer); timer = null; autoBtn.textContent = '▶ Read together'; }
    }, 8000);
  });

  /* 迷你讀本《I Can Try!》 */
  const tryBox = document.getElementById('tryBox');
  if (tryBox) {
    tryBox.innerHTML = TRY_PAGES.map(p => `
      <div class="card">
        <div class="qimg"><img src="assets/img/book/${p.img}" alt="Try page ${p.n}"></div>
        <div style="font-weight:600;font-size:15px;margin-top:9px">${esc(p.en)}</div>
        <div class="cn-text" style="font-size:13px;color:var(--ink-2);margin-top:3px">${esc(p.cn)}</div>
      </div>`).join('');
  }

  render();
})();
