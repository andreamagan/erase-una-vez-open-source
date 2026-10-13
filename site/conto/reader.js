(() => {
  const total = 36;
  const pageUrl = n => '/conto/pages/page-' + String(n).padStart(2, '0') + '.webp';
  const left = document.querySelector('#left-page');
  const right = document.querySelector('#right-page');
  const prev = document.querySelector('#prev');
  const next = document.querySelector('#next');
  const position = document.querySelector('#position');
  const book = document.querySelector('#reader-book');
  const dialog = document.querySelector('#page-dialog');
  const zoomImage = dialog.querySelector('img');
  const mobileQuery = matchMedia('(max-width:720px)');
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
    // Keep the next spread warm without loading the entire book at once.
    const forward = mobileQuery.matches ? [page + 1, page + 2] : page === 1 ? [2, 3, 4, 5] : [page + 2, page + 3, page + 4, page + 5];
    forward.forEach(preload);
    for (const number of ready.keys()) {
      if (number < page - 4 || number > page + 6) ready.delete(number);
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
    button.setAttribute('aria-label', 'Ampliar a páxina ' + number);
    button.dataset.page = number;
  }

  function spreadStart(number) {
    return number === 1 ? 1 : (number % 2 === 0 ? number : number - 1);
  }

  function render() {
    page = Math.max(1, Math.min(total, page));
    if (mobileQuery.matches) {
      fill(left, page);
      right.hidden = true;
      position.textContent = page + ' / ' + total;
    } else {
      page = spreadStart(page);
      right.hidden = false;
      fill(left, page === 1 ? 0 : page);
      fill(right, page === 1 ? 1 : page + 1);
      position.textContent = page === 1 ? 'Portada · 1 / 36' : page === total ? 'Contraportada · 36 / 36' : page + '–' + (page + 1) + ' / ' + total;
    }
    prev.disabled = page === 1;
    next.disabled = page === total;
    primeNeighbours();
  }

  async function move(direction) {
    if (moving) return;
    const target = Math.max(1, Math.min(total, page + direction * (mobileQuery.matches || page === 1 && direction > 0 || page === 2 && direction < 0 ? 1 : 2)));
    if (target === page) return;
    moving = true;
    book.setAttribute('aria-busy', 'true');
    const pages = mobileQuery.matches ? [target] : target === 1 ? [1] : [target, target + 1];
    await Promise.all(pages.map(preload));
    page = target;
    render();
    book.removeAttribute('aria-busy');
    moving = false;
  }

  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  document.addEventListener('keydown', event => {
    if (dialog.open || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') move(1);
    if (event.key === 'ArrowLeft') move(-1);
  });
  book.addEventListener('click', event => {
    if (swiped) { event.preventDefault(); swiped = false; return; }
    const button = event.target.closest('.page-zoom');
    if (!button || !button.dataset.page) return;
    const number = Number(button.dataset.page);
    zoomImage.src = pageUrl(number);
    zoomImage.alt = 'Páxina ' + number + ' ampliada';
    dialog.showModal();
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
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  mobileQuery.addEventListener('change', render);
  render();
})();
