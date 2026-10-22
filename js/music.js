/* =========================================================
   music.html 專用 — 歌曲區（轉動唱片 + 原生播放器 + 歌詞）
   歌詞資料與第 13 頁共用 data.js 的 poem 頁
   ========================================================= */
(function () {
  const block = document.getElementById('songBlock');
  const textEl = document.getElementById('songText');
  if (!block || !textEl) return;
  const poem = (typeof BOOK_PAGES !== 'undefined') && BOOK_PAGES.find(p => p.poem);
  if (!poem) return;

  /* 詩頁（歌詞）：嚴格按原本換行顯示，[Verse]/[Chorus] 整行作段落標題 */
  function blockLines(text, isCn) {
    return text.split('\n')
      .map(s => s.trim()).filter(Boolean)
      .map(t => {
        const vlabel = /^\[.+\]$/.test(t.trim());
        return `<span class="sen${vlabel ? ' verse-label' : ''}">${esc(t)}</span>`;
      }).join('');
  }

  textEl.innerHTML = `
    <div class="song-player">
      <audio id="songAudio" controls preload="metadata" src="${poem.song}"></audio>
    </div>
    <span class="en-line poem-en">${blockLines(poem.en, false)}</span>
    <span class="book-cn poem-cn">${blockLines(poem.cn, true)}</span>`;

  /* 唱片跟著音頻轉動：播放時轉、暫停/結束時停 */
  const audio = document.getElementById('songAudio');
  audio.addEventListener('play',  () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    block.classList.add('song-playing');
  });
  audio.addEventListener('pause', () => block.classList.remove('song-playing'));
  audio.addEventListener('ended', () => block.classList.remove('song-playing'));
})();
