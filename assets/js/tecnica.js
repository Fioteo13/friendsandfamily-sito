// Tecnica: 3D frame built with CSS transforms. Tap a part to rotate to it, highlight it and play its animation.
(function () {
  var D = window.FF_TECH, scene = document.getElementById('scene'), stage = document.getElementById('stage');
  if (!D || !scene || !stage) return;
  var $ = function (id) { return document.getElementById(id); };
  var st = { part: null, pins: false, folded: false, straight: false, rx: D.view.none[0], ry: D.view.none[1] };
  var timer = null;

  function apply() {
    var v = D.vars[st.part || 'none'];
    Object.keys(v).forEach(function (k) { scene.style.setProperty(k, v[k]); });
    scene.style.setProperty('--rx', st.rx + 'deg');
    scene.style.setProperty('--ry', st.ry + 'deg');
    scene.style.setProperty('--foldR', st.folded ? '172deg' : '90deg');
    scene.style.setProperty('--foldL', st.folded ? '8deg' : '90deg');
    scene.style.setProperty('--tip', st.straight ? '0deg' : '30deg');
    scene.style.setProperty('--pin', st.pins ? '64px' : '0px');
    scene.style.setProperty('--stem', st.pins ? '1' : '0');
    var i = st.part ? D.parts.indexOf(st.part) : -1, T = st.part ? D.txt[st.part] : null;
    $('t-num').textContent = String(i + 1).padStart(2, '0') + ' / ' + String(D.parts.length).padStart(2, '0');
    $('t-name').textContent = T ? T.name : D.h;
    $('t-text').textContent = T ? T.text : D.intro;
    var act = $('t-act');
    if (T && T.act) {
      var on = st.part === 'pins' ? st.pins : st.part === 'hinge' ? st.folded : !st.straight;
      act.hidden = false; act.textContent = on ? T.act[1] : T.act[0];
    } else act.hidden = true;
    document.querySelectorAll('.tech-parts [data-part]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-part') === st.part ? 'true' : 'false'); });
  }
  function pick(p) {
    clearTimeout(timer);
    st.part = p; st.pins = false; st.folded = false; st.straight = false;
    st.rx = D.view[p][0]; st.ry = D.view[p][1];
    if (p === 'pins') timer = setTimeout(function () { st.pins = true; apply(); }, 700);
    if (p === 'temple') { st.straight = true; timer = setTimeout(function () { st.straight = false; apply(); }, 1100); }
    if (p === 'hinge') timer = setTimeout(function () { st.folded = true; apply(); }, 900);
    apply();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-part]');
    if (b && document.querySelector('.tech').contains(b)) { pick(b.getAttribute('data-part')); return; }
    if (e.target.closest('#t-act')) {
      clearTimeout(timer);
      if (st.part === 'pins') st.pins = !st.pins;
      if (st.part === 'hinge') st.folded = !st.folded;
      if (st.part === 'temple') st.straight = !st.straight;
      apply(); return;
    }
    if (e.target.closest('#reset')) { clearTimeout(timer); st.part = null; st.pins = st.folded = st.straight = false; st.rx = D.view.none[0]; st.ry = D.view.none[1]; apply(); }
  });

  // drag to rotate
  var drag = null;
  stage.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button')) return;
    drag = { x: e.clientX, y: e.clientY, rx: st.rx, ry: st.ry, moved: false };
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
    if (!drag.moved) { drag.moved = true; scene.style.setProperty('--tr', '0s'); stage.classList.add('dragging'); }
    st.ry = drag.ry + dx * 0.4;
    st.rx = Math.max(-60, Math.min(40, drag.rx - dy * 0.3));
    scene.style.setProperty('--rx', st.rx + 'deg');
    scene.style.setProperty('--ry', st.ry + 'deg');
  });
  function end() { if (!drag) return; drag = null; scene.style.setProperty('--tr', '.9s'); stage.classList.remove('dragging'); }
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);

  // scale to the stage
  function fit() { var w = stage.clientWidth; scene.style.setProperty('--s', Math.min(1, w / 700).toFixed(3)); }
  window.addEventListener('resize', fit); fit();
  apply();
})();
