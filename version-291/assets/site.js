document.addEventListener('DOMContentLoaded', function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-main-nav]');

    if (menuButton && nav) {
        menuButton.addEventListener('click', function () {
            nav.classList.toggle('open');
        });
    }

    document.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('error', function () {
            var holder = img.closest('.poster-frame, .hero-poster, .detail-poster, .category-tile');
            if (holder) {
                holder.classList.add('missing');
            }
        });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var dotsWrap = hero.querySelector('[data-hero-dots]');
        var activeIndex = 0;
        var timer = null;

        function renderHero() {
            slides.forEach(function (slide, index) {
                slide.classList.toggle('active', index === activeIndex);
            });
            if (dotsWrap) {
                Array.prototype.slice.call(dotsWrap.children).forEach(function (dot, index) {
                    dot.classList.toggle('active', index === activeIndex);
                });
            }
        }

        function go(delta) {
            activeIndex = (activeIndex + delta + slides.length) % slides.length;
            renderHero();
        }

        function startTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                go(1);
            }, 5200);
        }

        if (dotsWrap) {
            slides.forEach(function (_, index) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.setAttribute('aria-label', '切换到第 ' + (index + 1) + ' 个推荐');
                dot.addEventListener('click', function () {
                    activeIndex = index;
                    renderHero();
                    startTimer();
                });
                dotsWrap.appendChild(dot);
            });
        }

        if (prev) {
            prev.addEventListener('click', function () {
                go(-1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                go(1);
                startTimer();
            });
        }

        renderHero();
        startTimer();
    }

    var grid = document.querySelector('[data-movie-grid]');
    var rankTable = document.querySelector('[data-rank-table]');
    var filterInput = document.querySelector('[data-filter-input]');
    var categorySelect = document.querySelector('[data-filter-category]');
    var regionSelect = document.querySelector('[data-filter-region]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var sortSelect = document.querySelector('[data-sort-select]');
    var countEl = document.querySelector('[data-filter-count]');

    if (filterInput) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q) {
            filterInput.value = q;
        }
    }

    function textOf(node) {
        return (node.textContent || '').toLowerCase();
    }

    function matchYear(item, selectedYear) {
        if (!selectedYear) {
            return true;
        }
        var year = Number(item.dataset.year || 0);
        var selected = Number(selectedYear);
        if (selected === 2010) {
            return year >= 2010 && year < 2020;
        }
        if (selected === 2000) {
            return year >= 2000 && year < 2010;
        }
        return year === selected;
    }

    function applyFilter() {
        var source = grid ? Array.prototype.slice.call(grid.querySelectorAll('.movie-card')) : Array.prototype.slice.call(document.querySelectorAll('.rank-row'));
        if (!source.length) {
            return;
        }

        var query = filterInput ? filterInput.value.trim().toLowerCase() : '';
        var category = categorySelect ? categorySelect.value : '';
        var region = regionSelect ? regionSelect.value : '';
        var year = yearSelect ? yearSelect.value : '';
        var visible = 0;

        source.forEach(function (item) {
            var haystack = textOf(item) + ' ' + Object.keys(item.dataset).map(function (key) {
                return item.dataset[key];
            }).join(' ').toLowerCase();
            var ok = true;
            ok = ok && (!query || haystack.indexOf(query) !== -1);
            ok = ok && (!category || item.dataset.category === category);
            ok = ok && (!region || item.dataset.region === region);
            ok = ok && matchYear(item, year);
            item.classList.toggle('is-hidden', !ok);
            if (ok) {
                visible += 1;
            }
        });

        if (countEl) {
            countEl.textContent = visible + ' 部';
        }
    }

    function sortCards() {
        if (!sortSelect) {
            return;
        }
        var mode = sortSelect.value;
        if (grid) {
            var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
            cards.sort(function (a, b) {
                if (mode === 'score-desc') {
                    return Number(b.dataset.score || 0) - Number(a.dataset.score || 0);
                }
                if (mode === 'title-asc') {
                    return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'zh-Hans-CN');
                }
                return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
            });
            cards.forEach(function (card) {
                grid.appendChild(card);
            });
        }

        if (rankTable) {
            var tbody = rankTable.querySelector('tbody');
            var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
            rows.sort(function (a, b) {
                if (mode === 'year-desc') {
                    return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                }
                if (mode === 'title-asc') {
                    return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'zh-Hans-CN');
                }
                return Number(b.dataset.score || 0) - Number(a.dataset.score || 0);
            });
            rows.forEach(function (row, index) {
                var num = row.querySelector('.rank-number');
                if (num) {
                    num.textContent = index + 1;
                }
                tbody.appendChild(row);
            });
        }

        applyFilter();
    }

    [filterInput, categorySelect, regionSelect, yearSelect].forEach(function (control) {
        if (control) {
            control.addEventListener('input', applyFilter);
            control.addEventListener('change', applyFilter);
        }
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', sortCards);
        sortCards();
    } else {
        applyFilter();
    }
});
