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

  let i = 0;

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
  /* 詩頁（歌詞）：嚴格按原本換行顯示，不按句號再切 */
  function linesOf(text, isCn, isPoem) {
    if (isPoem) return text.split('\n').map(s => s.trim()).filter(Boolean);
    const sp = isCn ? splitCn : splitEn;
    return sp(text).filter(Boolean);
  }
  function blockLines(text, cls, isCn, isPoem) {
    return linesOf(text, isCn, isPoem)
      .map(t => {
        const vlabel = isPoem && /^\[.+\]$/.test(t.trim());
        return `<span class="sen${cls ? ' ' + cls : ''}${vlabel ? ' verse-label' : ''}">${esc(t)}</span>`;
      }).join('');
  }

  function render() {
    if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); setReadBtn(true); }
    const p = BOOK_PAGES[i];
    pageNo.textContent = pageLabel(p);
    if (titleEl) titleEl.textContent = p.title ? p.title : '';
    if (p.poem) {
      stage.classList.add('is-poem');
      txt.classList.add('is-poem');
      stage.classList.remove('song-playing');
      img.style.display = 'none';
      txt.innerHTML = `
        <div class="song-player">
          <audio id="forestAudio" controls preload="metadata" src="${p.song}"></audio>
        </div>
        <span class="en-line poem-en">${blockLines(p.en, '', false, true)}</span>
        <span class="book-cn poem-cn">${blockLines(p.cn, '', true, true)}</span>`;
      bindSong();
    } else {
      stage.classList.remove('is-poem');
      txt.classList.remove('is-poem');
      stage.classList.remove('song-playing');
      img.style.display = '';
      img.src = 'assets/img/book/' + p.img;
      img.alt = p.title || ('Page ' + p.n);
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

  /* 詩頁：唱片跟著音頻轉動（播放時轉、暫停/結束時停） */
  function bindSong() {
    const audio = document.getElementById('forestAudio');
    if (!audio) return;
    audio.addEventListener('play',  () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      stage.classList.add('song-playing');
    });
    audio.addEventListener('pause', () => stage.classList.remove('song-playing'));
    audio.addEventListener('ended', () => stage.classList.remove('song-playing'));
  }

  /* 朗讀本頁：用瀏覽器內建語音念書本英文內容（不含任何按鈕） */
  function setReadBtn(idle) {
    autoBtn.innerHTML = idle
      ? '🔊 Read this page <span class="cn-text">朗讀本頁</span>'
      : '⏹ Stop <span class="cn-text">停止</span>';
  }
  /* 挑最「正常/自然」的英音（en-GB）語音；挑不到就交給系統預設英音 */
  function pickGbVoice() {
    if (!('speechSynthesis' in window)) return null;
    const vs = window.speechSynthesis.getVoices() || [];
    if (!vs.length) return null;
    const gb = vs.filter(v => /^en[-_]GB/i.test(v.lang));
    if (!gb.length) return null;
    const prefer = ['Daniel', 'UK English', 'Libby', 'George', 'Google UK', 'Arthur', 'Maisie', 'Serena', 'Emma', 'Natasha', 'Rosie'];
    for (const key of prefer) {
      const hit = gb.find(v => v.name.indexOf(key) !== -1);
      if (hit) return hit;
    }
    return gb[0];
  }
  function speakPage() {
    const p = BOOK_PAGES[i];
    let text;
    if (p.poem) {
      text = [...txt.querySelectorAll('.poem-en .sen')]
        .filter(s => !s.classList.contains('verse-label'))
        .map(s => s.textContent.trim()).join(' ');
    } else {
      text = [...txt.querySelectorAll('.en-line .sen')]
        .map(s => s.textContent.trim()).join(' ');
    }
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB';                 // 英音
    u.rate = 1; u.pitch = 1;          // 不變速，用最正常的預設語速
    const v = pickGbVoice();
    if (v) u.voice = v;
    u.onend = () => setReadBtn(true);
    u.onerror = () => setReadBtn(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
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

  /* 「朗讀本頁」：點一下念出目前這頁的書本英文（不朗讀任何按鈕）；再點一下停止 */
  autoBtn.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
      alert('Your browser does not support reading aloud.');
      return;
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setReadBtn(true);
      return;
    }
    const fa = document.getElementById('forestAudio');
    if (fa && !fa.paused) fa.pause();   // 與第 13 頁歌曲播放互斥，避免兩個聲音同時出
    setReadBtn(false);
    speakPage();
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
