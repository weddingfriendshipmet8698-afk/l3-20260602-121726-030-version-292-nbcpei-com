(function () {
  var menuButton = document.querySelector('[data-mobile-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
      document.body.classList.toggle('menu-open', mobileMenu.classList.contains('is-open'));
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    var setSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    var start = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        setSlide(current + 1);
      }, 5200);
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = Number(dot.getAttribute('data-hero-dot'));
        setSlide(index);
        start();
      });
    });

    if (slides.length > 1) {
      start();
    }
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterGrid = document.querySelector('[data-filter-grid]');
  var emptyState = document.querySelector('[data-empty-state]');

  if (filterInput && filterGrid) {
    var urlParams = new URLSearchParams(window.location.search);
    var initialQuery = urlParams.get('q');

    if (initialQuery && filterInput.hasAttribute('data-query-sync')) {
      filterInput.value = initialQuery;
    }

    var cards = Array.prototype.slice.call(filterGrid.querySelectorAll('.movie-card'));

    var applyFilter = function () {
      var query = filterInput.value.trim().toLowerCase();
      var visibleCount = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-category')
        ].join(' ').toLowerCase();
        var matched = !query || haystack.indexOf(query) !== -1;
        card.style.display = matched ? '' : 'none';

        if (matched) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visibleCount === 0);
      }
    };

    filterInput.addEventListener('input', applyFilter);
    applyFilter();
  }

  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player-shell]'));

  players.forEach(function (shell) {
    var video = shell.querySelector('[data-video-player]');
    var button = shell.querySelector('[data-play-button]');
    var stream = shell.getAttribute('data-stream');
    var hasStarted = false;

    var startPlayer = function () {
      if (!video || !stream) {
        return;
      }

      if (!hasStarted) {
        hasStarted = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          video._hls = hls;
        } else {
          video.src = stream;
        }
      }

      shell.classList.add('is-playing');
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          shell.classList.remove('is-playing');
          hasStarted = false;
        });
      }
    };

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        startPlayer();
      });
    }

    shell.addEventListener('click', function (event) {
      if (event.target === shell) {
        startPlayer();
      }
    });
  });
})();
