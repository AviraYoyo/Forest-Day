/* =========================================================
   sentences.html 專用 — 拖曳造句 + 規則分類
   ========================================================= */
(function () {

  /* ---------- 遊戲一：造句（三行字卡：Who / be / verb-ing） ---------- */
  const poolSubj = document.getElementById('poolSubj');
  const poolBe = document.getElementById('poolBe');
  const poolVerb = document.getElementById('poolVerb');
  const slots = document.getElementById('slotRow');
  const fb = document.getElementById('sentFeedback');
  const checkBtn = document.getElementById('checkSentence');
  const newBtn = document.getElementById('newSentence');
  const clearBtn = document.getElementById('clearSentence');

  if (poolSubj && slots) {
    /* 每一種字卡只能放進對應的格子 */
    const SLOT_OF = { subj: 'WHO', be: 'is/am/are', verb: 'VERB-ing' };
    const POOL_OF = { subj: poolSubj, be: poolBe, verb: poolVerb };
    let dragged = null;

    const shuffle = a => a.slice().sort(() => Math.random() - .5);

    function makeTile(t, kind) {
      const el = document.createElement('div');
      el.className = 'tile ' + kind;
      el.textContent = t;
      el.dataset.t = t;
      el.dataset.kind = kind;
      el.draggable = true;
      el.addEventListener('click', () => place(el));
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

    function slotFor(kind) {
      return slots.querySelector(`.slot[data-slot="${SLOT_OF[kind]}"]`);
    }

    /* 把字卡放進它所屬的格子；同一格已有字就先退回 */
    function place(tile) {
      if (tile.classList.contains('used')) return;
      const kind = tile.dataset.kind;
      const slot = slotFor(kind);
      if (!slot) return;
      if (slot.classList.contains('filled')) returnTile(slot);
      slot.textContent = tile.dataset.t;
      slot.dataset.kind = kind;
      slot.classList.add('filled');
      tile.classList.add('used');
      slot.classList.remove('pop');
      void slot.offsetWidth;
      slot.classList.add('pop');
      fb.className = ''; fb.textContent = '';
    }

    /* 把格子裡的字退回字卡區 */
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
    }

    function clearAll() {
      slots.querySelectorAll('.slot').forEach(returnTile);
      fb.className = ''; fb.textContent = '';
    }

    function bindSlots() {
      slots.querySelectorAll('.slot').forEach(s => {
        s.addEventListener('click', () => { if (s.classList.contains('filled')) returnTile(s); });
        s.addEventListener('dragover', e => { e.preventDefault(); slots.classList.add('over'); });
        s.addEventListener('dragleave', () => slots.classList.remove('over'));
        s.addEventListener('drop', e => {
          e.preventDefault(); slots.classList.remove('over');
          if (dragged) place(dragged);
          dragged = null;
        });
      });
    }

    checkBtn.addEventListener('click', () => {
      const [who, be, verb] = [...slots.querySelectorAll('.slot')];
      if (!who.classList.contains('filled') || !be.classList.contains('filled') || !verb.classList.contains('filled')) {
        fb.className = 'fb bad';
        fb.textContent = 'Not finished yet! Tap one word from each row.';
        return;
      }
      const subj = SUBJECTS.find(x => x.s === who.textContent);
      const want = subj ? subj.be : null;

      if (!want) {
        fb.className = 'fb bad';
        fb.textContent = 'Tap a word from the "Who?" row first.';
        return;
      }
      if (be.textContent !== want) {
        fb.className = 'fb bad';
        fb.textContent = `✗ "${who.textContent}" goes with "${want}", not "${be.textContent}". Try again!`;
        return;
      }
      if (!verb.textContent.endsWith('ing')) {
        fb.className = 'fb bad';
        fb.textContent = '✗ The last word must end in -ing.';
        return;
      }
      fb.className = 'fb ok';
      fb.textContent = `✓ ${who.textContent} ${be.textContent} ${verb.textContent}. Perfect!`;
    });

    newBtn.addEventListener('click', pick);
    if (clearBtn) clearBtn.addEventListener('click', clearAll);
    pick();
  }

  /* ---------- 遊戲二：規則分類 ---------- */
  const cardPool = document.getElementById('sortPool');
  const bMust = document.getElementById('bucketMust');
  const bMustNot = document.getElementById('bucketMustNot');
  const sortFb = document.getElementById('sortFeedback');
  const sortReset = document.getElementById('sortReset');
  if (cardPool) {
    let score = 0, tries = 0;

    function init() {
      score = 0; tries = 0;
      sortFb.className = ''; sortFb.textContent = '';
      cardPool.innerHTML = shuffle([...SORT_CARDS]).map(c =>
        `<div class="tile verb" draggable="true" data-en="${esc(c.en)}" data-cn="${esc(c.cn)}" data-b="${c.bucket}">
           ${esc(c.en)}</div>`).join('');
      document.querySelectorAll('#bucketMust .drop-zone, #bucketMustNot .drop-zone').forEach(z => z.innerHTML = '');
      bindSort();
    }
    function shuffle(a) { return a.sort(() => Math.random() - .5); }

    function bindSort() {
      let dragged = null;
      cardPool.querySelectorAll('.tile').forEach(t => {
        t.addEventListener('dragstart', () => { dragged = t; t.classList.add('dragging'); });
        t.addEventListener('dragend', () => t.classList.remove('dragging'));
      });
      [bMust, bMustNot].forEach(b => {
        b.addEventListener('dragover', e => { e.preventDefault(); b.classList.add('over'); });
        b.addEventListener('dragleave', () => b.classList.remove('over'));
        b.addEventListener('drop', e => {
          e.preventDefault(); b.classList.remove('over');
          if (dragged) dropCard(dragged, b);
        });
      });
    }

    function dropCard(card, bucket) {
      tries++;
      const right = card.dataset.b === (bucket.id === 'bucketMust' ? 'must' : 'mustnot');
      if (right) {
        score++;
        bucket.querySelector('.drop-zone').appendChild(card);
        card.draggable = false; card.classList.remove('dragging');
        card.style.cursor = 'default';
        card.innerHTML = `${esc(card.dataset.en)}<span class="cn-text"> · ${esc(card.dataset.cn)}</span>`;
        sortFb.className = 'fb ok';
        sortFb.textContent = `✓ Right! You ${bucket.id === 'bucketMust' ? 'must' : 'must not'} ${card.dataset.en}.`;
      } else {
        card.classList.remove('dragging');
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
