// Menú da cabeceira no móbil: abre e pecha a navegación, e péchaa ao escoller unha sección.
(function () {
  var header = document.querySelector('.site-header');
  var toggle = header && header.querySelector('.nav-toggle');
  if (!toggle) return;
  header.classList.add('has-toggle');
  function set(open) {
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  toggle.addEventListener('click', function () { set(!header.classList.contains('nav-open')); });
  header.querySelectorAll('nav a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  // A cabeceira colle sombra cando a páxina xa baixou.
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { ticking = false; header.classList.toggle('is-scrolled', window.scrollY > 8); });
  }, { passive: true });
})();
