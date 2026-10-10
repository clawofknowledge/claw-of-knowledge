/* The Claw of Knowledge — site behavior. No need to edit. */
(function () {
  'use strict';
  var BASE = document.body.getAttribute('data-baseurl') || '';

  /* ---------- Copy link / native share ---------- */
  var share = document.querySelector('.share-row');
  if (share) {
    var url = share.getAttribute('data-share-url');
    var title = share.getAttribute('data-share-title');
    var copyBtn = share.querySelector('[data-copy-link]');
    copyBtn.addEventListener('click', function () {
      function done() {
        var orig = copyBtn.innerHTML;
        copyBtn.innerHTML = '&#10003; Copied!';
        setTimeout(function () { copyBtn.innerHTML = orig; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { fallbackCopy(url); done(); });
      } else { fallbackCopy(url); done(); }
    });
    var nativeBtn = share.querySelector('[data-native-share]');
    if (navigator.share) {
      nativeBtn.hidden = false;
      nativeBtn.addEventListener('click', function () {
        navigator.share({ title: title, url: url }).catch(function () {});
      });
    }
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy'); ta.remove();
  }

  /* ---------- Random comic ---------- */
  var randomBtn = document.querySelector('[data-random]');
  if (randomBtn) {
    randomBtn.addEventListener('click', function () {
      fetch(BASE + '/comics.json').then(function (r) { return r.json(); }).then(function (urls) {
        var here = location.pathname, pick;
        do { pick = urls[Math.floor(Math.random() * urls.length)]; }
        while (urls.length > 1 && pick === here);
        location.href = pick;
      });
    });
  }

  /* ---------- Keyboard: left/right arrows = previous/next comic ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
    var link = null;
    if (e.key === 'ArrowLeft')  link = document.querySelector('a[rel="prev"]');
    if (e.key === 'ArrowRight') link = document.querySelector('a[rel="next"]');
    if (link) location.href = link.href;
  });

  /* ---------- Archive: filters, search, tag dropdown ---------- */
  var grid = document.getElementById('archive-grid');
  if (!grid) return;

  // Tags that should stay uppercase in the dropdown. Add more as needed.
  var TAG_ACRONYMS = { uscg: 'USCG', lotr: 'LOTR', wwii: 'WWII', wwiii: 'WWIII', usaf: 'USAF', ai: 'AI', uk: 'UK', nasa: 'NASA', uscga: 'USCGA' };
  function tagLabel(t) {
    return t.split(' ').map(function (w) {
      return TAG_ACRONYMS[w] || w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' ');
  }

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.archive-card'));
  var state = { type: 'all', tag: '', q: '' };

  // Build the tag dropdown from every tag used on any comic
  var counts = {};
  cards.forEach(function (c) {
    var tags = c.getAttribute('data-tags');
    if (!tags) return;
    tags.split('|').forEach(function (t) { if (t) counts[t] = (counts[t] || 0) + 1; });
  });
  var tagNames = Object.keys(counts).sort();
  var select = null;
  if (tagNames.length) {
    select = document.createElement('select');
    select.className = 'tag-select';
    select.setAttribute('aria-label', 'Filter by tag');
    var opt = document.createElement('option');
    opt.value = ''; opt.textContent = 'All tags';
    select.appendChild(opt);
    tagNames.forEach(function (t) {
      var o = document.createElement('option');
      o.value = t; o.textContent = tagLabel(t) + ' (' + counts[t] + ')';
      select.appendChild(o);
    });
    var searchBox = document.getElementById('archive-search');
    searchBox.parentNode.insertBefore(select, searchBox);
    select.addEventListener('change', function () {
      state.tag = select.value;
      if (state.tag) state.type = 'all';
      setActiveButton(state.tag ? null : state.type);
      apply();
    });
  }

  var buttons = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
  function setActiveButton(type) {
    buttons.forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-filter') === type); });
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      state.type = b.getAttribute('data-filter');
      state.tag = '';
      if (select) select.value = '';
      setActiveButton(state.type);
      apply();
    });
  });

  document.getElementById('archive-search').addEventListener('input', function (e) {
    state.q = e.target.value.trim().toLowerCase();
    apply();
  });

  function apply() {
    var nComics = 0, nArticles = 0;
    cards.forEach(function (c) {
      var type = c.getAttribute('data-type');
      var show = true;
      if (state.type !== 'all' && type !== state.type) show = false;
      if (state.tag) {
        var tags = (c.getAttribute('data-tags') || '').split('|');
        if (type !== 'comic' || tags.indexOf(state.tag) === -1) show = false;
      }
      if (state.q && c.getAttribute('data-search').indexOf(state.q) === -1) show = false;
      c.hidden = !show;
      if (show) { if (type === 'comic') nComics++; else nArticles++; }
    });
    document.getElementById('archive-count').textContent =
      nComics + ' comic' + (nComics !== 1 ? 's' : '') + ' · ' + nArticles + ' article' + (nArticles !== 1 ? 's' : '');
    var empty = document.getElementById('archive-empty');
    empty.hidden = (nComics + nArticles) > 0;
    empty.textContent = state.q ? 'No comics or articles match "' + state.q + '".' : 'Nothing matches that filter.';
  }

  // Tag links on comic pages go to /archive/?tag=navy
  var params = new URLSearchParams(location.search);
  var startTag = params.get('tag');
  if (startTag && select && counts[startTag]) {
    select.value = startTag; state.tag = startTag; setActiveButton(null); apply();
  }
})();
