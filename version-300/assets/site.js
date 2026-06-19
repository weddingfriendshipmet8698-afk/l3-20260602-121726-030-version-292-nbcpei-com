function setMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-mobile-panel]');
  if (!toggle || !panel) return;
  toggle.addEventListener('click', () => {
    panel.classList.toggle('is-open');
  });
}

function setHero() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const slides = Array.from(hero.querySelectorAll('.hero-slide'));
  const dots = Array.from(hero.querySelectorAll('.hero-dots button'));
  if (slides.length < 2) return;
  let index = 0;
  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  };
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  window.setInterval(() => show(index + 1), 5200);
}

function setFilters() {
  const input = document.querySelector('[data-filter-input]');
  const select = document.querySelector('[data-filter-select]');
  const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
  const empty = document.querySelector('[data-empty]');
  if (!input || !cards.length) return;
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q && !input.value) input.value = q;
  const run = () => {
    const keyword = input.value.trim().toLowerCase();
    const genre = select ? select.value : '';
    let visible = 0;
    cards.forEach((card) => {
      const hay = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-meta')).toLowerCase();
      const cardGenre = card.getAttribute('data-genre');
      const matchedText = !keyword || hay.includes(keyword);
      const matchedGenre = !genre || cardGenre.includes(genre);
      const ok = matchedText && matchedGenre;
      card.style.display = ok ? '' : 'none';
      if (ok) visible += 1;
    });
    if (empty) empty.style.display = visible ? 'none' : 'block';
  };
  input.addEventListener('input', run);
  if (select) select.addEventListener('change', run);
  run();
}

document.addEventListener('DOMContentLoaded', () => {
  setMobileMenu();
  setHero();
  setFilters();
});
