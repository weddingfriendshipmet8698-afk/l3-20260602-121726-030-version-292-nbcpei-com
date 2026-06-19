(function () {
  var menuButton = document.querySelector('[data-menu-button]');
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

    function showHero(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, currentIndex) {
        slide.classList.toggle('active', currentIndex === index);
      });
      dots.forEach(function (dot, currentIndex) {
        dot.classList.toggle('active', currentIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showHero(dotIndex);
      });
    });

    setInterval(function () {
      showHero(index + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterYear = document.querySelector('[data-filter-year]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

  function applyFilter() {
    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var year = filterYear ? filterYear.value : '';

    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.textContent
      ].join(' ').toLowerCase();
      var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchesYear = !year || card.getAttribute('data-year') === year;
      card.style.display = matchesKeyword && matchesYear ? '' : 'none';
    });
  }

  if (filterInput) {
    filterInput.addEventListener('input', applyFilter);
  }

  if (filterYear) {
    filterYear.addEventListener('change', applyFilter);
  }

  var query = new URLSearchParams(window.location.search).get('q');
  if (query && filterInput) {
    filterInput.value = query;
    applyFilter();
  }

  var video = document.getElementById('movie-player');
  var config = document.getElementById('player-config');
  var playButton = document.querySelector('[data-play-button]');
  var hlsInstance = null;
  var streamReady = false;

  function readPlayerConfig() {
    if (!config) {
      return null;
    }

    try {
      return JSON.parse(config.textContent || '{}');
    } catch (error) {
      return null;
    }
  }

  function loadHlsLibrary(callback) {
    if (window.Hls) {
      callback();
      return;
    }

    var existing = document.querySelector('script[data-hls-library]');
    if (existing) {
      existing.addEventListener('load', callback, { once: true });
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js';
    script.async = true;
    script.setAttribute('data-hls-library', 'true');
    script.addEventListener('load', callback, { once: true });
    document.head.appendChild(script);
  }

  function attachStream(callback) {
    if (!video || streamReady) {
      if (callback) {
        callback();
      }
      return;
    }

    var playerConfig = readPlayerConfig();
    var streamUrl = playerConfig && playerConfig.src;

    if (!streamUrl) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      streamReady = true;
      if (callback) {
        callback();
      }
      return;
    }

    loadHlsLibrary(function () {
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        streamReady = true;
        if (callback) {
          callback();
        }
      } else {
        video.src = streamUrl;
        streamReady = true;
        if (callback) {
          callback();
        }
      }
    });
  }

  function playMovie() {
    attachStream(function () {
      var playTask = video.play();
      if (playTask && typeof playTask.catch === 'function') {
        playTask.catch(function () {});
      }
      if (playButton) {
        playButton.classList.add('is-hidden');
      }
    });
  }

  if (video) {
    attachStream();
    video.addEventListener('play', function () {
      if (playButton) {
        playButton.classList.add('is-hidden');
      }
    });
    video.addEventListener('click', function () {
      if (video.paused) {
        playMovie();
      }
    });
  }

  if (playButton) {
    playButton.addEventListener('click', playMovie);
  }

  window.addEventListener('beforeunload', function () {
    if (hlsInstance && typeof hlsInstance.destroy === 'function') {
      hlsInstance.destroy();
    }
  });
})();
