/* =========================================================
   sentences.html 專用 — 造句 + 規則分類
   互動改用 Pointer Events：滑鼠 / 手指觸控 / 觸控筆 都能用
   ① 點一下選取 → 再點空格（或桶）落位
   ② 也可以直接用手指／滑鼠拖（不再依賴 HTML5 拖放，觸控屏才會動）
   ========================================================= */
(function () {

  /* ---------- 共用的「點選 + 拖曳」引擎 ---------- */
  const DRAG_MIN = 8;           // 移動超過這個距離才算拖曳，否則算「點選」
  let dragInProgress = false;   // 拖曳中：避免落點元素同時被當成點選

  /**
   * 讓一個元素同時支援「點選」與「拖曳」，滑鼠／觸控／觸控筆都吃。
   * opts.findTarget(node) 由座標下的元素回傳合法落點（空格或桶），不是就回傳 null
   * opts.onTap()          純點選
   * opts.onDrop(target)   拖曳到落點
   * opts.canDrag()        是否允許拖曳
   */
  function pickOrDrag(el, opts) {
    let pid = null, sx = 0, sy = 0, active = false, ghost = null, hover = null;

    function clearHover() {
      if (hover) { hover.classList.remove('over'); hover = null; }
    }
    function startGhost() {
      const r = el.getBoundingClientRect();
      ghost = el.cloneNode(true);
      ghost.classList.add('drag-ghost');
      ghost.classList.remove('picked');
      ghost.style.width = r.width + 'px';
      ghost.style.height = r.height + 'px';
      document.body.appendChild(ghost);
      el.classList.add('dragging');
      dragInProgress = true;
    }
    function moveGhost(e) {
      ghost.style.transform =
        'translate(' + (e.clientX - ghost.offsetWidth / 2) + 'px,' +
                       (e.clientY - ghost.offsetHeight / 2) + 'px)';
    }
    function targetAt(e) {
      const under = document.elementFromPoint(e.clientX, e.clientY);
      return under ? opts.findTarget(under) : null;
    }
    function cleanup() {
      if (ghost) { ghost.remove(); ghost = null; }
      el.classList.remove('dragging');
      clearHover();
      dragInProgress = false;
      active = false; pid = null;
    }

    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;   // 只吃滑鼠左鍵
      if (opts.canDrag && !opts.canDrag()) return;
      pid = e.pointerId; sx = e.clientX; sy = e.clientY; active = true;
      try { el.setPointerCapture(pid); } catch (err) {}
    });

    el.addEventListener('pointermove', function (e) {
      if (!active || e.pointerId !== pid) return;
      if (!ghost) {
        if (Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) < DRAG_MIN) return;
        startGhost();
      }
      e.preventDefault();          // 避免滑鼠拖曳時選到文字
      moveGhost(e);
      const t = targetAt(e);
      if (t !== hover) { clearHover(); hover = t; if (t) t.classList.add('over'); }
    });

    el.addEventListener('pointerup', function (e) {
      if (!active || e.pointerId !== pid) return;
      const wasDrag = !!ghost;
      const t = wasDrag ? targetAt(e) : null;
      cleanup();
      if (wasDrag) { if (t && opts.onDrop) opts.onDrop(t); }
      else if (opts.onTap) opts.onTap();
    });

    el.addEventListener('pointercancel', function () { if (active) cleanup(); });
    el.addEventListener('lostpointercapture', function () { if (ghost) cleanup(); });
  }

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
      pickOrDrag(el, {
        canDrag: () => true,
        onTap: () => pickTile(el),
        findTarget: n => n.closest('.slot'),
        onDrop: slot => placeInto(slot, el)
      });
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

    /* 空格只需要「點」，綁一次就夠（不能每次重抽都重綁，否則會觸發兩次） */
    slots.querySelectorAll('.slot').forEach(s => {
      s.addEventListener('pointerup', () => {
        if (dragInProgress) return;   // 正在拖曳，交給拖曳邏輯處理
        /* 手上已有選取的字 → 放進這一格（該格原本的字會先退回） */
        if (picked) { placeInto(s, picked); return; }
        /* 沒選字 → 點已填的格子＝把字退回 */
        if (s.classList.contains('filled')) { returnTile(s); return; }
        say('fb bad', 'Tap a word first, then tap a box.');
      });
    });

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

    function shuffle(a) { return a.sort(() => Math.random() - .5); }

    function init() {
      score = 0; tries = 0; pickedCard = null;
      sortFb.className = ''; sortFb.textContent = '';
      cardPool.innerHTML = shuffle([...SORT_CARDS]).map(c =>
        `<div class="tile verb" data-en="${esc(c.en)}" data-cn="${esc(c.cn)}" data-b="${c.bucket}">
           ${esc(c.en)}</div>`).join('');
      document.querySelectorAll('#bucketMust .drop-zone, #bucketMustNot .drop-zone').forEach(z => z.innerHTML = '');
      bindCards();   // 卡片每次重抽都重建，所以要重新綁（桶不用，只綁一次）
    }

    function pickCard(c) {
      if (c.classList.contains('done')) return;
      if (pickedCard === c) { c.classList.remove('picked'); pickedCard = null; return; }
      if (pickedCard) pickedCard.classList.remove('picked');
      pickedCard = c;
      c.classList.add('picked');
      sortFb.className = ''; sortFb.textContent = '';
    }

    function bindCards() {
      cardPool.querySelectorAll('.tile').forEach(t => {
        pickOrDrag(t, {
          canDrag: () => !t.classList.contains('done'),
          onTap: () => pickCard(t),
          findTarget: n => n.closest('.bucket'),
          onDrop: b => dropCard(t, b)
        });
      });
    }

    /* 桶只綁一次（重複綁會讓點一次觸發兩次，回饋被覆蓋） */
    [bMust, bMustNot].forEach(b => {
      b.addEventListener('pointerup', () => {
        if (dragInProgress) return;   // 正在拖曳，交給拖曳邏輯處理
        if (pickedCard) {
          const c = pickedCard; pickedCard = null;
          dropCard(c, b);
        } else {
          sortFb.className = 'fb bad';
          sortFb.textContent = 'Tap a card first, then tap a bucket.';
        }
      });
    });

    function dropCard(card, bucket) {
      tries++;
      const right = card.dataset.b === (bucket.id === 'bucketMust' ? 'must' : 'mustnot');
      if (right) {
        score++;
        card.classList.remove('picked', 'dragging');
        card.classList.add('done');
        bucket.querySelector('.drop-zone').appendChild(card);
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
