(function () {
  var body = document.body;
  var toggle = document.querySelector('[data-menu-toggle]');

  if (toggle) {
    toggle.addEventListener('click', function () {
      body.classList.toggle('menu-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function setSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        setSlide(i);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        setSlide(current + 1);
      }, 5200);
    }
  }

  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  var searchInput = document.querySelector('[data-search]');
  var yearFilter = document.querySelector('[data-filter-year]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card, .rank-item'));

  function applyFilter() {
    var query = normalize(searchInput ? searchInput.value : '');
    var year = yearFilter ? yearFilter.value : '';

    cards.forEach(function (card) {
      var text = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year')
      ].join(' '));
      var cardYear = card.getAttribute('data-year') || '';
      var numericYear = parseInt(cardYear.replace(/\D/g, '').slice(0, 4), 10) || 0;
      var queryMatch = !query || text.indexOf(query) !== -1;
      var yearMatch = !year || cardYear.indexOf(year) !== -1 || (year === 'older' && numericYear > 0 && numericYear < 2020);
      card.classList.toggle('is-hidden', !(queryMatch && yearMatch));
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', applyFilter);
  }

  var playerBox = document.querySelector('[data-player]');
  if (playerBox) {
    var video = playerBox.querySelector('video[data-src]');
    var button = playerBox.querySelector('[data-play-button]');
    var hlsInstance = null;
    var loaded = false;

    function loadVideo() {
      if (!video || loaded) {
        return;
      }

      var src = video.getAttribute('data-src');
      if (!src) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else {
        video.src = src;
      }

      loaded = true;
    }

    function playVideo() {
      loadVideo();
      if (button) {
        button.classList.add('is-hidden');
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          if (button) {
            button.classList.remove('is-hidden');
          }
        });
      }
    }

    if (button) {
      button.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (button && video.currentTime === 0) {
        button.classList.remove('is-hidden');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }
})();
