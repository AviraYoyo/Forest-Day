/* =========================================================
   sentences.html 專用 — 造句 + 規則分類
   手機可玩：字卡／卡片「點一下選取 → 點空格／桶落位」
   電腦仍可拖曳，且可拖進任意一格
   ========================================================= */
(function () {

  /* ---------- 遊戲一：造句（三個空格，位置自由） ---------- */
  const poolSubj = document.getElementById('poolSubj');
  const poolBe = document.getElementById('poolBe');
  const poolVerb = document.getElementById('poolVerb');
  const slots = document.getElementById('slotRow');
  const fb = document.getElementById('sentFeedback');
  const checkBtn = document.getElementById('checkSentence');
  const newBtn = document.getElementById('newSentence');
  const clearBtn = document.getElementById('clearSentence');

  if (poolSubj && slots) {
    const POOL_OF = { subj: poolSubj, be: poolBe, verb: poolVerb };
    let dragged = null;   // 電腦拖曳中的字卡
    let picked = null;    // 已選取（等待點空格）的字卡

    const shuffle = a => a.slice().sort(() => Math.random() - .5);

    /* 提示列 */
    function say(cls, msg) { fb.className = cls; fb.textContent = msg; }
    function clearMsg() { say('', ''); }

    function makeTile(t, kind) {
      const el = document.createElement('div');
      el.className = 'tile ' + kind;
      el.textContent = t;
      el.dataset.t = t;
      el.dataset.kind = kind;
      el.draggable = true;
      el.addEventListener('click', () => pickTile(el));
      el.addEventListener('dragstart', () => { dragged = el; el.classList.add('dragging'); });
      el.addEventListener('dragend', () => el.classList.remove('dragging'));
      return el;
    }

    function renderPool(container, items, kind) {
      container.innerHTML = '';
      items.forEach(t => container.appendChild(makeTile(t, kind)));
    }

    function pick() {
      renderPool(poolSubj, SUBJECTS.map(x => x.s), 'subj');
      renderPool(poolBe, ['is', 'am', 'are'], 'be');
      renderPool(poolVerb, shuffle(ACTION_VERBS), 'verb');
      clearAll();
      bindSlots();
    }

    /* 選取字卡（再點一次取消） */
    function pickTile(el) {
      if (el.classList.contains('used')) return;
      if (picked === el) { clearPick(); return; }
      clearPick();
      picked = el;
      el.classList.add('picked');
      slots.classList.add('choosing');
      clearMsg();
    }

    function clearPick() {
      if (picked) picked.classList.remove('picked');
      picked = null;
      slots.classList.remove('choosing');
    }

    /* 放進學生自己點／拖的那一格 */
    function placeInto(slot, tile) {
      if (!slot || !tile || tile.classList.contains('used')) return;
      if (slot.classList.contains('filled')) returnTile(slot); // 該格已有字就先退回
      slot.textContent = tile.dataset.t;
      slot.dataset.kind = tile.dataset.kind;
      slot.classList.add('filled');
      tile.classList.add('used');
      clearPick();
      clearMsg();
      slot.classList.remove('pop');
      void slot.offsetWidth;
      slot.classList.add('pop');
    }

    /* 退回字卡區：空位留在原地，不補位 */
    function returnTile(slot) {
      const kind = slot.dataset.kind;
      if (!kind) return;
      const word = slot.textContent;
      const tile = [...POOL_OF[kind].querySelectorAll('.tile')]
        .find(t => t.dataset.t === word);
      if (tile) tile.classList.remove('used');
      slot.textContent = slot.dataset.slot;
      slot.classList.remove('filled');
      delete slot.dataset.kind;
      clearMsg();
    }

    function clearAll() {
      slots.querySelectorAll('.slot').forEach(returnTile);
      clearPick();
      clearMsg();
    }

    function bindSlots() {
      slots.querySelectorAll('.slot').forEach(s => {
        s.addEventListener('click', () => {
          /* 手上已有選取的字 → 放進這一格（該格原本的字會先退回） */
          if (picked) { placeInto(s, picked); return; }
          /* 沒選字 → 點已填的格子＝把字退回（空位留在原地） */
          if (s.classList.contains('filled')) { returnTile(s); return; }
          say('fb bad', 'Tap a word first, then tap a box.');
        });
        s.addEventListener('dragover', e => { e.preventDefault(); s.classList.add('over'); });
        s.addEventListener('dragleave', () => s.classList.remove('over'));
        s.addEventListener('drop', e => {
          e.preventDefault(); s.classList.remove('over');
          if (dragged) placeInto(s, dragged);
          dragged = null;
        });
      });
    }

    checkBtn.addEventListener('click', () => {
      const [s1, s2, s3] = [...slots.querySelectorAll('.slot')];
      if (![s1, s2, s3].every(s => s.classList.contains('filled'))) {
        say('fb bad', 'Not finished yet! Tap three words.');
        return;
      }
      /* 1) 語序：Who + is/am/are + verb-ing */
      const kinds = [s1.dataset.kind, s2.dataset.kind, s3.dataset.kind];
      if (kinds[0] !== 'subj' || kinds[1] !== 'be' || kinds[2] !== 'verb') {
        say('fb bad', '✗ Order matters! Use: Who + is/am/are + verb-ing. Try again!');
        return;
      }
      /* 2) 主詞與 be 動詞的搭配 */
      const subj = SUBJECTS.find(x => x.s === s1.textContent);
      const want = subj ? subj.be : null;
      if (!want) {
        say('fb bad', 'Tap a word from the "Who?" row first.');
        return;
      }
      if (s2.textContent !== want) {
        say('fb bad', `✗ "${s1.textContent}" goes with "${want}", not "${s2.textContent}". Try again!`);
        return;
      }
      /* 3) 最後一個字要是 -ing */
      if (!s3.textContent.endsWith('ing')) {
        say('fb bad', '✗ The last word must end in -ing.');
        return;
      }
      say('fb ok', `✓ ${s1.textContent} ${s2.textContent} ${s3.textContent}. Perfect!`);
    });

    newBtn.addEventListener('click', pick);
    if (clearBtn) clearBtn.addEventListener('click', clearAll);
    pick();
  }

  /* ---------- 遊戲二：規則分類（點選卡片 → 點桶） ---------- */
  const cardPool = document.getElementById('sortPool');
  const bMust = document.getElementById('bucketMust');
  const bMustNot = document.getElementById('bucketMustNot');
  const sortFb = document.getElementById('sortFeedback');
  const sortReset = document.getElementById('sortReset');
  if (cardPool) {
    let score = 0, tries = 0, pickedCard = null;

    function init() {
      score = 0; tries = 0; pickedCard = null;
      sortFb.className = ''; sortFb.textContent = '';
      cardPool.innerHTML = shuffle([...SORT_CARDS]).map(c =>
        `<div class="tile verb" draggable="true" data-en="${esc(c.en)}" data-cn="${esc(c.cn)}" data-b="${c.bucket}">
           ${esc(c.en)}</div>`).join('');
      document.querySelectorAll('#bucketMust .drop-zone, #bucketMustNot .drop-zone').forEach(z => z.innerHTML = '');
      bindSort();
    }
    function shuffle(a) { return a.sort(() => Math.random() - .5); }

    function pickCard(c) {
      if (c.classList.contains('done')) return;
      if (pickedCard === c) { c.classList.remove('picked'); pickedCard = null; return; }
      if (pickedCard) pickedCard.classList.remove('picked');
      pickedCard = c;
      c.classList.add('picked');
      sortFb.className = ''; sortFb.textContent = '';
    }

    function bindSort() {
      let dragged = null;
      cardPool.querySelectorAll('.tile').forEach(t => {
        t.addEventListener('click', () => pickCard(t));
        t.addEventListener('dragstart', () => { dragged = t; t.classList.add('dragging'); });
        t.addEventListener('dragend', () => t.classList.remove('dragging'));
      });
      [bMust, bMustNot].forEach(b => {
        b.addEventListener('click', () => {
          if (pickedCard) { const c = pickedCard; pickedCard = null; dropCard(c, b); }
          else { sortFb.className = 'fb bad'; sortFb.textContent = 'Tap a card first, then tap a bucket.'; }
        });
        b.addEventListener('dragover', e => { e.preventDefault(); b.classList.add('over'); });
        b.addEventListener('dragleave', () => b.classList.remove('over'));
        b.addEventListener('drop', e => {
          e.preventDefault(); b.classList.remove('over');
          if (dragged) dropCard(dragged, b);
          dragged = null;
        });
      });
    }

    function dropCard(card, bucket) {
      tries++;
      const right = card.dataset.b === (bucket.id === 'bucketMust' ? 'must' : 'mustnot');
      if (right) {
        score++;
        card.classList.remove('picked', 'dragging');
        card.classList.add('done');
        bucket.querySelector('.drop-zone').appendChild(card);
        card.draggable = false;
        card.style.cursor = 'default';
        card.innerHTML = `${esc(card.dataset.en)}<span class="cn-text"> · ${esc(card.dataset.cn)}</span>`;
        sortFb.className = 'fb ok';
        sortFb.textContent = `✓ Right! You ${bucket.id === 'bucketMust' ? 'must' : 'must not'} ${card.dataset.en}.`;
      } else {
        card.classList.remove('dragging', 'picked');
        sortFb.className = 'fb bad';
        sortFb.textContent = `✗ Think again. Look at the picture in the book. 再想想看。`;
      }
      if (score === SORT_CARDS.length) {
        sortFb.className = 'fb ok';
        sortFb.textContent = `🎉 All done! ${score}/${SORT_CARDS.length}. You know the Forest Rules!`;
      }
    }

    sortReset.addEventListener('click', init);
    init();
  }
})();
