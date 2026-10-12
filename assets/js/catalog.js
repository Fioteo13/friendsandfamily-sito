// Catalogue: photochromic optical/sun switch, collection filter, stage, strip, "Better 1 or 2?" test
(function () {
  var root = document.querySelector('.catalog');
  if (!root || !window.FF_MODELS) return;
  var LANG = root.getAttribute('data-lang') || 'it';
  var IMG = (document.documentElement.lang === 'en' ? '../' : '') + 'assets/img/';

  var T = LANG === 'it'
    ? { all: 'Tutti', friends: 'Friends', family: 'Family', vista: 'Vista', sole: 'Sole', side: 'Lato', front: 'Fronte', col: 'Col.', colours: 'Colori', view: 'Vista foto', grey: 'lenti grigie', blue: 'lenti azzurre', eyewear: 'Occhiale', show: 'Mostra', models: 'modelli',
        hint: { vista: 'Luce piena. Occhiali da vista.', sole: 'Lenti scure. Occhiali da sole.' },
        game: 'Meglio 1… o 2?', round: 'Lente', of: 'di', yours: 'La tua montatura', openCard: 'Vedi la montatura', again: 'Rifai il test',
        names: { 1: 'Nero', 2: 'Havana scuro', 3: 'Grigio cristallo', 4: 'Blu cristallo', 5: 'Verde cristallo', 6: 'Cristallo', 7: 'Havana', 8: 'Bordeaux', 9: 'Miele cristallo', 10: 'Rosa cristallo', 11: 'Rosso vino' } }
    : { all: 'All', friends: 'Friends', family: 'Family', vista: 'Optical', sole: 'Sun', side: 'Side', front: 'Front', col: 'Col.', colours: 'Colours', view: 'Photo view', grey: 'grey lenses', blue: 'light blue lenses', eyewear: 'Eyewear', show: 'Show', models: 'frames',
        hint: { vista: 'Full light. Optical frames.', sole: 'Dark lenses. Sunglasses.' },
        game: 'Better 1… or 2?', round: 'Lens', of: 'of', yours: 'Your frame', openCard: 'See the frame', again: 'Take it again',
        names: { 1: 'Black', 2: 'Dark tortoise', 3: 'Crystal grey', 4: 'Crystal blue', 5: 'Crystal green', 6: 'Crystal clear', 7: 'Tortoise', 8: 'Burgundy', 9: 'Crystal honey', 10: 'Crystal pink', 11: 'Wine red' } };
  var HEX = { 1: '#111111', 2: '#3A2717', 3: '#A3A8AC', 4: '#5F7F9E', 5: '#5E7A66', 6: '#E4EAEE', 7: '#8E4F20', 8: '#6A1B31', 9: '#C08A52', 10: '#F2C4CC', 11: '#7A1F24' };
  var LENS = { grey: '#3B3D42', blue: '#8FB8E0' };

  var ALL = window.FF_MODELS;
  var st = { mode: 'vista', coll: 'all', active: null, sel: {}, view: {} };
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var pad = function (n) { return String(n).padStart(2, '0'); };

  function inMode() {
    var dark = st.mode === 'sole';
    return ALL.map(function (m) {
      return Object.assign({}, m, { colors: m.colors.filter(function (c) { return dark ? !!c.lens : !c.lens; }) });
    }).filter(function (m) { return m.colors.length; });
  }
  function list() {
    var src = inMode();
    var l = src.filter(function (m) { return st.coll === 'all' || m.coll === st.coll; });
    return { src: src, list: l.length ? l : src };
  }

  function render(animate) {
    var dark = st.mode === 'sole';
    root.classList.toggle('dark', dark);
    var L = list(), items = L.list, n = items.length;
    var ai = Math.max(0, items.findIndex(function (m) { return m.id === st.active; }));
    var m = items[ai];
    var key = m.id + ':' + st.mode;
    var ci = Math.min(st.sel[key] || 0, m.colors.length - 1);
    var c = m.colors[ci];
    var v = st.view[m.id] || (c.front ? 'front' : 'side');
    var img = (v === 'front' && c.front) ? c.front : c.side;
    var cname = T.names[c.c] + (c.lens ? ' · ' + T[c.lens] : '');

    // switch
    root.querySelectorAll('.switch button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === st.mode ? 'true' : 'false'); });
    $('mode-hint').textContent = T.hint[st.mode];
    // tabs
    var tabs = root.querySelector('.tabs');
    tabs.innerHTML = ['all', 'friends', 'family'].map(function (k) {
      var cnt = k === 'all' ? L.src.length : L.src.filter(function (x) { return x.coll === k; }).length;
      return '<button type="button" data-coll="' + k + '" aria-pressed="' + (st.coll === k) + '">' + T[k] + ' ' + pad(cnt) + '</button>';
    }).join('');
    $('count').textContent = pad(n) + ' ' + T.models;
    // stage
    var hi = $('hero-img');
    hi.src = IMG + img; hi.alt = T.eyewear + ' ' + m.name + ', ' + cname;
    if (animate) { hi.classList.remove('in'); void hi.offsetWidth; hi.classList.add('in'); }
    $('counter').textContent = 'N° ' + pad(ai + 1) + ' / ' + pad(n);
    $('giant').textContent = m.name;
    var views = $('views');
    views.setAttribute('aria-label', T.view + ' ' + m.name);
    views.innerHTML = ['side', 'front'].filter(function (k) { return c[k]; }).map(function (k) {
      var on = v === k || (k === 'front' && !c.side) || (k === 'side' && !c.front);
      return '<button type="button" data-view="' + k + '" aria-pressed="' + on + '">' + T[k] + '</button>';
    }).join('');
    // info
    $('name').textContent = m.name;
    $('meta').textContent = 'Collection ' + T[m.coll] + ' · ' + m.size;
    $('colour').textContent = T.col + ' ' + c.code + ' — ' + cname;
    var sw = $('swatches');
    sw.setAttribute('aria-label', T.colours + ' ' + m.name);
    sw.innerHTML = m.colors.map(function (cc, j) {
      var label = T.col + ' ' + cc.code + ' ' + T.names[cc.c] + (cc.lens ? ', ' + T[cc.lens] : '');
      return '<button type="button" data-sw="' + j + '" aria-label="' + esc(label) + '" aria-pressed="' + (j === ci) + '"><span class="sw" style="background:' + HEX[cc.c] + '"><span class="lens" style="background:' + (cc.lens ? LENS[cc.lens] : 'transparent') + '"></span></span></button>';
    }).join('');
    // strip
    $('strip').innerHTML = items.map(function (x, i) {
      var cc = x.colors[Math.min(st.sel[x.id + ':' + st.mode] || 0, x.colors.length - 1)];
      return '<button type="button" data-id="' + x.id + '" aria-label="' + esc(T.show + ' ' + x.name) + '" aria-current="' + (i === ai) + '"><span class="th"><img src="' + IMG + (cc.front || cc.side) + '" alt="" loading="lazy"></span><span class="nm"><i>' + pad(i + 1) + '</i>' + esc(x.name) + '</span></button>';
    }).join('');
    st._items = items; st._ai = ai; st._key = key; st._id = m.id;
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || !root.contains(b)) return;
    if (b.hasAttribute('data-mode')) { if (st.mode !== b.getAttribute('data-mode')) { st.mode = b.getAttribute('data-mode'); st.active = null; render(true); } return; }
    if (b.hasAttribute('data-coll')) { st.coll = b.getAttribute('data-coll'); st.active = null; render(true); return; }
    if (b.hasAttribute('data-view')) { st.view[st._id] = b.getAttribute('data-view'); render(true); return; }
    if (b.hasAttribute('data-sw')) { st.sel[st._key] = +b.getAttribute('data-sw'); render(true); return; }
    if (b.hasAttribute('data-id')) { st.active = b.getAttribute('data-id'); render(true); return; }
    if (b.id === 'prev' || b.id === 'next') {
      var n = st._items.length, i = (st._ai + (b.id === 'next' ? 1 : -1) + n) % n;
      st.active = st._items[i].id; render(true); return;
    }
  });
  document.addEventListener('keydown', function (e) {
    if (!$('game').hidden) { if (e.key === 'Escape') closeGame(); return; }
    if (e.target.closest('input,textarea')) return;
    if (e.key === 'ArrowRight') $('next').click();
    if (e.key === 'ArrowLeft') $('prev').click();
  });

  // ---- Better 1 or 2? ----
  var ROUNDS = 6, g = null, lastFocus = null;
  function ticks() {
    var D = 400, r1 = 198, s = '';
    for (var i = 0; i < 72; i++) {
      var a = i * 5 * Math.PI / 180, L = i % 9 === 0 ? 12 : 6.6;
      s += '<line x1="' + (200 + Math.cos(a) * r1).toFixed(1) + '" y1="' + (200 + Math.sin(a) * r1).toFixed(1) + '" x2="' + (200 + Math.cos(a) * (r1 - L)).toFixed(1) + '" y2="' + (200 + Math.sin(a) * (r1 - L)).toFixed(1) + '"/>';
    }
    return '<svg class="ticks" viewBox="0 0 400 400" aria-hidden="true">' + s + '</svg>';
  }
  function lens(m, d, label) {
    var c = m.colors[0];
    return '<span class="lensc" style="--d:' + d + ';--r:calc(' + d + ' * .055)">' + ticks() + '<span class="glass"><img src="' + IMG + (c.front || c.side) + '" alt="' + esc(T.eyewear + ' ' + m.name) + '"></span>' + (label ? '<span class="lbl">' + label + '</span>' : '') + '</span>';
  }
  var byId = {}; ALL.forEach(function (m) { byId[m.id] = m; });
  function drawGame() {
    $('game-round').textContent = g.done ? T.yours : (T.round + ' ' + g.round + ' ' + T.of + ' ' + ROUNDS);
    $('game-title').textContent = g.done ? '' : T.game;
    $('game-title').hidden = !!g.done;
    var body = $('game-body');
    if (!g.done) {
      var d = 'min(400px, 40vw)';
      body.innerHTML = '<div class="pair">' +
        '<button type="button" class="pick" data-pick="a">' + lens(byId[g.a], d, '1') + '<span class="pn">' + esc(byId[g.a].name) + '</span></button>' +
        '<button type="button" class="pick" data-pick="b">' + lens(byId[g.b], d, '2') + '<span class="pn">' + esc(byId[g.b].name) + '</span></button></div>';
    } else {
      var w = byId[g.done];
      body.innerHTML = lens(w, 'min(440px, 70vw)', '') + '<p class="winner">' + esc(w.name) + '</p><div class="row"><button type="button" class="solid" data-act="open">' + T.openCard + ' →</button><button type="button" data-act="again">' + T.again + '</button></div>';
    }
    var first = body.querySelector('button'); if (first) first.focus();
  }
  function startGame() {
    var ids = ALL.map(function (m) { return m.id; }).sort(function () { return Math.random() - 0.5; });
    g = { pool: ids, a: ids[0], b: ids[1], next: 2, round: 1, done: null };
    lastFocus = document.activeElement;
    $('game').hidden = false; document.body.style.overflow = 'hidden';
    drawGame();
  }
  function closeGame() {
    $('game').hidden = true; document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  $('test').addEventListener('click', startGame);
  $('game-close').addEventListener('click', closeGame);
  $('game-body').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var p = b.getAttribute('data-pick'), act = b.getAttribute('data-act');
    if (p) {
      var win = p === 'a' ? g.a : g.b;
      if (g.round >= ROUNDS) g.done = win;
      else { g.a = win; g.b = g.pool[g.next]; g.next++; g.round++; }
      drawGame();
    } else if (act === 'again') startGame();
    else if (act === 'open') {
      var m = byId[g.done], hasV = m.colors.some(function (c) { return !c.lens; });
      st.mode = hasV ? 'vista' : 'sole'; st.coll = 'all'; st.active = m.id;
      closeGame(); render(true);
      root.scrollIntoView({ behavior: 'smooth' });
    }
  });
  var qc = new URLSearchParams(location.search).get('c');
  if (qc === 'friends' || qc === 'family') st.coll = qc;
  if (location.hash === '#test') setTimeout(startGame, 300);

  render(false);
})();
