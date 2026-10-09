// Gallery lightbox
(function () {
  var cells = Array.prototype.slice.call(document.querySelectorAll('.ph'));
  var box = document.getElementById('lightbox');
  if (!cells.length || !box) return;
  var img = document.getElementById('lb-img'), count = document.getElementById('lb-count');
  var cur = 0, lastFocus = null;
  function show(i) {
    cur = (i + cells.length) % cells.length;
    var src = cells[cur].querySelector('img');
    img.src = src.src; img.alt = src.alt;
    count.textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(cells.length).padStart(2, '0');
  }
  function open(i) { lastFocus = document.activeElement; show(i); box.hidden = false; document.body.style.overflow = 'hidden'; document.getElementById('lb-next').focus(); }
  function close() { box.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  cells.forEach(function (c, i) { c.addEventListener('click', function () { open(i); }); });
  document.getElementById('lb-prev').addEventListener('click', function () { show(cur - 1); });
  document.getElementById('lb-next').addEventListener('click', function () { show(cur + 1); });
  document.getElementById('lb-close').addEventListener('click', close);
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(cur + 1);
    if (e.key === 'ArrowLeft') show(cur - 1);
  });
})();
