(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        var menuButton = document.querySelector('[data-menu-toggle]');
        var mobileMenu = document.querySelector('[data-mobile-menu]');
        if (menuButton && mobileMenu) {
            menuButton.addEventListener('click', function () {
                mobileMenu.classList.toggle('open');
            });
        }

        var hero = document.querySelector('[data-hero]');
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
            var index = 0;
            var timer = null;

            function show(next) {
                if (!slides.length) {
                    return;
                }
                index = (next + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle('active', i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('active', i === index);
                });
            }

            function start() {
                if (slides.length < 2) {
                    return;
                }
                stop();
                timer = window.setInterval(function () {
                    show(index + 1);
                }, 5200);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            dots.forEach(function (dot) {
                dot.addEventListener('click', function () {
                    show(Number(dot.getAttribute('data-hero-dot')) || 0);
                    start();
                });
            });

            hero.addEventListener('mouseenter', stop);
            hero.addEventListener('mouseleave', start);
            start();
        }

        var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-grid]'));
        panels.forEach(function (grid) {
            var section = grid.closest('[data-filter-section]') || document;
            var input = section.querySelector('.js-search-input');
            var filters = Array.prototype.slice.call(section.querySelectorAll('.js-filter'));
            var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
            var empty = section.querySelector('[data-empty-state]');

            function normalize(value) {
                return String(value || '').trim().toLowerCase();
            }

            function apply() {
                var query = normalize(input ? input.value : '');
                var activeFilters = filters.map(function (select) {
                    return {
                        key: select.getAttribute('data-filter'),
                        value: normalize(select.value)
                    };
                });
                var visible = 0;

                cards.forEach(function (card) {
                    var text = normalize([
                        card.getAttribute('data-title'),
                        card.getAttribute('data-region'),
                        card.getAttribute('data-type'),
                        card.getAttribute('data-year'),
                        card.getAttribute('data-genre'),
                        card.getAttribute('data-tags')
                    ].join(' '));
                    var matchText = !query || text.indexOf(query) !== -1;
                    var matchFilters = activeFilters.every(function (item) {
                        if (!item.value) {
                            return true;
                        }
                        return normalize(card.getAttribute('data-' + item.key)).indexOf(item.value) !== -1;
                    });
                    var showCard = matchText && matchFilters;
                    card.hidden = !showCard;
                    if (showCard) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle('show', visible === 0);
                }
            }

            if (input) {
                input.addEventListener('input', apply);
            }
            filters.forEach(function (select) {
                select.addEventListener('change', apply);
            });
            apply();
        });
    });
})();
