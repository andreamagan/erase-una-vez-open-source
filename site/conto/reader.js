// Visor do libro: dobre páxina en escritorio, unha páxina no móbil.
// Ao pasar folla, unha "folla" xira arredor do lombo coma nun libro de verdade.
// Pódese ler a pantalla completa.
(() => {
  const total = 36;
  const pageUrl = n => '/conto/pages/page-' + String(n).padStart(2, '0') + '.webp';
  const left = document.querySelector('#left-page');
  const right = document.querySelector('#right-page');
  const prev = document.querySelector('#prev');
  const next = document.querySelector('#next');
  const position = document.querySelector('#position');
  const book = document.querySelector('#reader-book');
  const stage = document.querySelector('#reader-stage');
  const fullButton = document.querySelector('#full');
  const fullClose = document.querySelector('#full-close');
  const mobileQuery = matchMedia('(max-width:720px)');
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const TURN_MS = 750;
  let page = 1;
  let touchStartX = null;
  let swiped = false;
  let moving = false;
  const ready = new Map();

  function preload(number) {
    if (number < 1 || number > total) return Promise.resolve();
    if (!ready.has(number)) {
      const image = new Image();
      image.src = pageUrl(number);
      ready.set(number, image.decode().catch(() => {}));
    }
    return ready.get(number);
  }

  function primeNeighbours() {
    // Keep the next and previous spreads warm without loading the whole book.
    [page - 2, page - 1, page + 1, page + 2, page + 3, page + 4, page + 5].forEach(preload);
    for (const number of ready.keys()) {
      if (number < page - 4 || number > page + 7) ready.delete(number);
    }
  }

  function fill(node, number) {
    const blank = number < 1 || number > total;
    node.classList.toggle('is-blank', blank);
    node.setAttribute('aria-hidden', blank ? 'true' : 'false');
    const button = node.querySelector('button');
    if (blank) { button.hidden = true; button.dataset.page = ''; return; }
    button.hidden = false;
    const img = node.querySelector('img');
    img.src = pageUrl(number);
    img.loading = 'eager';
    img.alt = 'Páxina ' + number + ' do conto';
    button.setAttribute('aria-label', 'Páxina ' + number);
    button.dataset.page = number;
  }

  const spreadStart = n => n === 1 ? 1 : (n % 2 === 0 ? n : n - 1);
  // Páxinas visibles dunha dobre páxina: [esquerda, dereita]; 0 ou 37 = baleira.
  const spread = n => n === 1 ? [0, 1] : [n, n + 1];

  function render() {
    page = Math.max(1, Math.min(total, page));
    book.classList.toggle('is-single', mobileQuery.matches);
    book.classList.toggle('is-cover', !mobileQuery.matches && page === 1);
    book.classList.toggle('is-back', !mobileQuery.matches && page === total);
    if (mobileQuery.matches) {
      fill(left, page);
      right.hidden = true;
      position.textContent = page + ' / ' + total;
    } else {
      page = spreadStart(page);
      right.hidden = false;
      const [l, r] = spread(page);
      fill(left, l);
      fill(right, r);
      position.textContent = page === 1 ? 'Portada · 1 / 36' : page === total ? 'Contraportada · 36 / 36' : page + '–' + (page + 1) + ' / ' + total;
    }
    prev.disabled = page === 1;
    next.disabled = page === total;
    primeNeighbours();
  }

  function face(number, cls) {
    const div = document.createElement('div');
    div.className = 'leaf-face ' + cls + (number < 1 || number > total ? ' is-blank' : '');
    if (number >= 1 && number <= total) {
      const img = document.createElement('img');
      img.src = pageUrl(number);
      img.alt = '';
      div.append(img);
    }
    const shade = document.createElement('i');
    shade.className = 'leaf-shade';
    div.append(shade);
    return div;
  }

  // Unha folla que xira 180° arredor do lombo. side: 'right' (cara adiante) ou 'left' (cara atrás).
  function turnLeaf(side, frontPage, backPage) {
    return new Promise(resolve => {
      const leaf = document.createElement('div');
      leaf.className = 'reader-leaf from-' + side;
      leaf.append(face(frontPage, 'front'), face(backPage, 'back'));
      book.append(leaf);
      leaf.getBoundingClientRect();
      requestAnimationFrame(() => leaf.classList.add('is-turned'));
      setTimeout(() => { leaf.remove(); resolve(); }, TURN_MS + 30);
    });
  }

  // No móbil: a páxina actual levántase cara á esquerda (ou volve) coma unha folla.
  function liftPage(frontPage, direction) {
    return new Promise(resolve => {
      const leaf = document.createElement('div');
      leaf.className = 'reader-leaf single ' + (direction > 0 ? 'lift-out' : 'lift-in');
      leaf.append(face(frontPage, 'front'));
      book.append(leaf);
      leaf.getBoundingClientRect();
      requestAnimationFrame(() => leaf.classList.add('is-turned'));
      setTimeout(() => { leaf.remove(); resolve(); }, TURN_MS + 30);
    });
  }

  async function move(direction) {
    if (moving) return;
    const single = mobileQuery.matches;
    const step = single || (page === 1 && direction > 0) || (page === 2 && direction < 0) ? 1 : 2;
    const target = Math.max(1, Math.min(total, page + direction * step));
    if (target === page) return;
    moving = true;
    book.setAttribute('aria-busy', 'true');
    const wanted = single ? [target] : spread(target);
    await Promise.all(wanted.map(preload));

    if (calm.matches) {
      page = target; render();
    } else if (single) {
      if (direction > 0) {
        const old = page; page = target; render();
        await liftPage(old, 1);
      } else {
        await liftPage(target, -1);
        page = target; render();
      }
    } else {
      const [ol, or] = spread(page);
      const [nl, nr] = spread(target);
      // O libro desprázase mentres xira a folla: pechado, a portada e a contraportada quedan no centro.
      book.classList.toggle('is-cover', target === 1);
      book.classList.toggle('is-back', target === total);
      if (direction > 0) {
        // A folla dereita (or) xira e mostra no seu reverso a nova esquerda (nl).
        fill(right, nr);
        await turnLeaf('right', or, nl);
      } else {
        // A folla esquerda (ol) volve á dereita e mostra a anterior dereita (nr).
        fill(left, nl);
        await turnLeaf('left', ol, nr);
      }
      page = target; render();
    }
    book.removeAttribute('aria-busy');
    moving = false;
  }

  // Pantalla completa: usa a API do navegador se existe; se non (iPhone), un modo a toda a ventá.
  function setFull(on) {
    stage.classList.toggle('is-full', on);
    document.documentElement.classList.toggle('reading-full', on);
    fullButton.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (on && stage.requestFullscreen && !document.fullscreenElement) stage.requestFullscreen().catch(() => {});
    if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }
  fullButton.addEventListener('click', () => setFull(!stage.classList.contains('is-full')));
  fullClose.addEventListener('click', () => setFull(false));
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement) setFull(false); });

  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') move(1);
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'Escape' && stage.classList.contains('is-full')) setFull(false);
  });
  // Tocar unha páxina pasa folla: a dereita (ou a única) avanza, a esquerda retrocede.
  book.addEventListener('click', event => {
    if (swiped) { event.preventDefault(); swiped = false; return; }
    const figure = event.target.closest('.reader-page');
    if (!figure) return;
    move(figure === left && !mobileQuery.matches ? -1 : 1);
  });
  book.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
  book.addEventListener('touchend', event => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].screenX - touchStartX;
    touchStartX = null;
    if (Math.abs(delta) < 55) return;
    swiped = true;
    move(delta < 0 ? 1 : -1);
    setTimeout(() => { swiped = false; }, 500);
  }, { passive: true });
  mobileQuery.addEventListener('change', render);
  render();
})();
