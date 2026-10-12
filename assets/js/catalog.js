// Catalogue: choose a world (Optical / Sun), filter by collection, editorial grid, detail sheet
(function () {
  var root = document.querySelector('.catalog');
  if (!root || !window.FF_MODELS) return;
  var LANG = root.getAttribute('data-lang') || 'it';
  var IMG = (document.documentElement.lang === 'en' ? '../' : '') + 'assets/img/';

  var T = LANG === 'it'
    ? { all: 'Tutti', friends: 'Friends', family: 'Family', vista: 'Vista', sole: 'Sole', side: 'Lato', front: 'Fronte', col: 'Col.', colours: 'colori', view: 'Vista foto', grey: 'lenti grigie', blue: 'lenti azzurre', eyewear: 'Occhiale', open: 'Apri', models: 'modelli', collection: 'Collection',
        game: 'Meglio 1… o 2?', round: 'Lente', of: 'di', yours: 'La tua montatura', openCard: 'Vedi la montatura', again: 'Rifai il test',
        names: { 1: 'Nero', 2: 'Havana scuro', 3: 'Grigio cristallo', 4: 'Blu cristallo', 5: 'Verde cristallo', 6: 'Cristallo', 7: 'Havana', 8: 'Bordeaux', 9: 'Miele cristallo', 10: 'Rosa cristallo', 11: 'Rosso vino' } }
    : { all: 'All', friends: 'Friends', family: 'Family', vista: 'Optical', sole: 'Sun', side: 'Side', front: 'Front', col: 'Col.', colours: 'colours', view: 'Photo view', grey: 'grey lenses', blue: 'light blue lenses', eyewear: 'Eyewear', open: 'Open', models: 'frames', collection: 'Collection',
        game: 'Better 1… or 2?', round: 'Lens', of: 'of', yours: 'Your frame', openCard: 'See the frame', again: 'Take it again',
        names: { 1: 'Black', 2: 'Dark tortoise', 3: 'Crystal grey', 4: 'Crystal blue', 5: 'Crystal green', 6: 'Crystal clear', 7: 'Tortoise', 8: 'Burgundy', 9: 'Crystal honey', 10: 'Crystal pink', 11: 'Wine red' } };
  var HEX = { 1: '#111111', 2: '#3A2717', 3: '#A3A8AC', 4: '#5F7F9E', 5: '#5E7A66', 6: '#E4EAEE', 7: '#8E4F20', 8: '#6A1B31', 9: '#C08A52', 10: '#F2C4CC', 11: '#7A1F24' };
  var LENS = { grey: '#3B3D42', blue: '#8FB8E0' };

  var ALL = window.FF_MODELS;
  var st = { mode: 'vista', coll: 'all', open: null, sel: {}, view: {} };
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var pad = function (n) { return String(n).padStart(2, '0'); };

  function inMode(mode) {
    var dark = mode === 'sole';
    return ALL.map(function (m) {
      return Object.assign({}, m, { colors: m.colors.filter(function (c) { return dark ? !!c.lens : !c.lens; }) });
    }).filter(function (m) { return m.colors.length; });
  }
  function list() {
    var src = inMode(st.mode);
    return { src: src, items: src.filter(function (m) { return st.coll === 'all' || m.coll === st.coll; }) };
  }
  function colourOf(m) { return Math.min(st.sel[m.id + ':' + st.mode] || 0, m.colors.length - 1); }

  // ---------- grid ----------
  function renderGrid() {
    root.classList.toggle('dark', st.mode === 'sole');
    root.querySelectorAll('.world').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === st.mode ? 'true' : 'false'); });
    root.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = pad(inMode(el.getAttribute('data-count')).length) + ' ' + T.models; });
    $('mode-label').textContent = '· ' + T[st.mode];
    var L = list();
    $('count').textContent = pad(L.items.length) + ' ' + T.models;
    root.querySelector('.tabs').innerHTML = ['all', 'friends', 'family'].map(function (k) {
      var cnt = k === 'all' ? L.src.length : L.src.filter(function (x) { return x.coll === k; }).length;
      return '<button type="button" data-coll="' + k + '" aria-pressed="' + (st.coll === k) + '">' + T[k] + ' <i>' + pad(cnt) + '</i></button>';
    }).join('');
    $('grid').innerHTML = L.items.map(function (m, i) {
      var c = m.colors[colourOf(m)];
      var a = c.front || c.side, b = c.side || c.front;
      var dots = m.colors.map(function (cc) { return '<span style="background:' + HEX[cc.c] + '"></span>'; }).join('');
      return '<button type="button" class="tile" data-open="' + m.id + '" aria-label="' + esc(T.open + ' ' + m.name) + '" style="--d:' + (i * 40) + 'ms">' +
        '<span class="t-img"><img class="t-a" src="' + IMG + a + '" alt="' + esc(T.eyewear + ' ' + m.name) + '" loading="lazy"><img class="t-b" src="' + IMG + b + '" alt="" loading="lazy"></span>' +
        '<span class="t-row"><span class="t-num mono">' + pad(i + 1) + '</span><span class="t-name">' + esc(m.name) + '</span><span class="t-dots" aria-hidden="true">' + dots + '</span></span>' +
        '<span class="t-meta mono">' + T.collection + ' ' + T[m.coll] + ' · ' + m.colors.length + ' ' + T.colours + '</span></button>';
    }).join('');
  }

  // ---------- detail ----------
  var lastFocus = null;
  function renderDetail(animate) {
    var items = list().items, n = items.length;
    var i = Math.max(0, items.findIndex(function (m) { return m.id === st.open; }));
    var m = items[i], ci = colourOf(m), c = m.colors[ci];
    var v = st.view[m.id] || (c.front ? 'front' : 'side');
    var img = (v === 'front' && c.front) ? c.front : c.side;
    var cname = T.names[c.c] + (c.lens ? ' · ' + T[c.lens] : '');
    var di = $('d-img'); di.src = IMG + img; di.alt = T.eyewear + ' ' + m.name + ', ' + cname;
    if (animate) { di.classList.remove('in'); void di.offsetWidth; di.classList.add('in'); }
    $('counter').textContent = 'N° ' + pad(i + 1) + ' / ' + pad(n);
    $('d-coll').textContent = T.collection + ' ' + T[m.coll] + ' · ' + T[st.mode];
    $('d-name').textContent = m.name;
    $('d-meta').textContent = m.size;
    $('colour').textContent = T.col + ' ' + c.code + ' — ' + cname;
    var views = $('views');
    views.setAttribute('aria-label', T.view + ' ' + m.name);
    views.innerHTML = ['side', 'front'].filter(function (k) { return c[k]; }).map(function (k) {
      var on = v === k || (k === 'front' && !c.side) || (k === 'side' && !c.front);
      return '<button type="button" data-view="' + k + '" aria-pressed="' + on + '">' + T[k] + '</button>';
    }).join('');
    $('swatches').innerHTML = m.colors.map(function (cc, j) {
      var label = T.col + ' ' + cc.code + ' ' + T.names[cc.c] + (cc.lens ? ', ' + T[cc.lens] : '');
      return '<button type="button" data-sw="' + j + '" aria-label="' + esc(label) + '" aria-pressed="' + (j === ci) + '"><span class="sw" style="background:' + HEX[cc.c] + '"><span class="lens" style="background:' + (cc.lens ? LENS[cc.lens] : 'transparent') + '"></span></span></button>';
    }).join('');
    st._items = items; st._i = i; st._m = m;
  }
  function openDetail(id) {
    st.open = id; lastFocus = document.activeElement;
    $('detail').hidden = false; document.body.style.overflow = 'hidden';
    renderDetail(true); $('d-close').focus();
  }
  function closeDetail() {
    $('detail').hidden = true; document.body.style.overflow = '';
    renderGrid(); if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || !root.contains(b)) return;
    if (b.hasAttribute('data-mode')) {
      if (st.mode !== b.getAttribute('data-mode')) { st.mode = b.getAttribute('data-mode'); renderGrid(); }
      $('cat-bar').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (b.hasAttribute('data-coll')) { st.coll = b.getAttribute('data-coll'); renderGrid(); return; }
    if (b.hasAttribute('data-open')) { openDetail(b.getAttribute('data-open')); return; }
    if (b.hasAttribute('data-view')) { st.view[st._m.id] = b.getAttribute('data-view'); renderDetail(true); return; }
    if (b.hasAttribute('data-sw')) { st.sel[st._m.id + ':' + st.mode] = +b.getAttribute('data-sw'); renderDetail(true); return; }
    if (b.id === 'prev' || b.id === 'next') {
      var n = st._items.length; st.open = st._items[(st._i + (b.id === 'next' ? 1 : -1) + n) % n].id; renderDetail(true); return;
    }
    if (b.id === 'd-close') { closeDetail(); return; }
  });
  $('detail').addEventListener('click', function (e) { if (e.target === $('detail')) closeDetail(); });
  document.addEventListener('keydown', function (e) {
    if ($('detail').hidden) return;
    if (e.key === 'Escape') closeDetail();
    if (e.key === 'ArrowRight') $('next').click();
    if (e.key === 'ArrowLeft') $('prev').click();
  });

  // deep links: ?c=friends|family  ·  ?m=vista|sole
  var q = new URLSearchParams(location.search);
  if (q.get('c') === 'friends' || q.get('c') === 'family') st.coll = q.get('c');
  if (q.get('m') === 'sole' || q.get('m') === 'vista') st.mode = q.get('m');
  renderGrid();
  if (q.get('c') || q.get('m')) setTimeout(function () { $('cat-bar').scrollIntoView({ block: 'start' }); }, 60);
})();
