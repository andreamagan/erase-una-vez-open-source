// O libro da portada pasa follas ao facer scroll.
// Cada folla (.fb-leaf) xira arredor do lombo segundo canto avanzou o libro na pantalla.
(function () {
  var leaf = document.querySelector('.book-leaf');
  if (!leaf || !leaf.querySelector('.flipbook')) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  leaf.classList.add('is-flip');
  var leaves = [].slice.call(leaf.querySelectorAll('.fb-leaf'));
  var n = leaves.length;
  var ticking = false;
  function clamp(v) { return Math.max(0, Math.min(1, v)); }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function update() {
    ticking = false;
    var r = leaf.getBoundingClientRect();
    var vh = window.innerHeight;
    // 0 cando o libro asoma por abaixo; 1 cando o seu centro chega ao terzo superior.
    var p = clamp((vh * 0.92 - r.top) / (vh * 0.92 - vh * 0.33 + r.height * 0.5));
    leaves.forEach(function (el, k) {
      var t = ease(clamp((p * n - k - 0.1) / 0.8));
      el.style.transform = 'rotateY(' + (-180 * t) + 'deg)';
      el.style.zIndex = t < 0.5 ? (n - k) : (n + k + 1);
      var s = el.querySelector('.fb-shade');
      if (s) s.style.opacity = (Math.sin(t * Math.PI) * 0.9).toFixed(3);
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
