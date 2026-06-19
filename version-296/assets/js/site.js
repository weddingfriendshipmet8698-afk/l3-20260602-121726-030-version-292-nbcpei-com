(() => {
  const ready = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  };

  const resolvePath = (path) => {
    const base = document.body.dataset.base || "./";
    return `${base}${path}`;
  };

  const initMenu = () => {
    const button = document.querySelector("[data-menu-button]");
    const panel = document.querySelector("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", () => {
      panel.classList.toggle("is-open");
    });
  };

  const initHero = () => {
    const hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    if (slides.length <= 1) {
      return;
    }
    let index = 0;
    let timer = null;
    const show = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, idx) => slide.classList.toggle("is-active", idx === index));
      dots.forEach((dot, idx) => dot.classList.toggle("is-active", idx === index));
    };
    const start = () => {
      stop();
      timer = window.setInterval(() => show(index + 1), 5200);
    };
    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        show(Number(dot.dataset.heroDot || 0));
        start();
      });
    });
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    start();
  };

  const initSearch = () => {
    const layer = document.querySelector("[data-search-layer]");
    const input = document.querySelector("[data-search-input]");
    const results = document.querySelector("[data-search-results]");
    const openers = Array.from(document.querySelectorAll("[data-open-search]"));
    const close = document.querySelector("[data-close-search]");
    const index = Array.isArray(window.SEARCH_INDEX) ? window.SEARCH_INDEX : [];
    if (!layer || !input || !results) {
      return;
    }
    const openLayer = () => {
      layer.classList.add("is-open");
      layer.setAttribute("aria-hidden", "false");
      document.body.classList.add("is-locked");
      window.setTimeout(() => input.focus(), 30);
    };
    const closeLayer = () => {
      layer.classList.remove("is-open");
      layer.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-locked");
    };
    const paint = (items) => {
      if (!items.length) {
        results.innerHTML = '<p class="empty-result">未找到匹配影片</p>';
        return;
      }
      results.innerHTML = items.map((item) => {
        const url = resolvePath(item.path);
        const img = resolvePath(`${item.image}.jpg`);
        const meta = `${item.year} · ${item.region} · ${item.type}`;
        return `<a class="search-result" href="${url}"><img src="${img}" alt="${item.title}海报" loading="lazy"><span><strong>${item.title}</strong><span>${meta}</span></span></a>`;
      }).join("");
    };
    const run = () => {
      const query = input.value.trim().toLowerCase();
      if (!query) {
        paint(index.slice(0, 10));
        return;
      }
      const tokens = query.split(/\s+/).filter(Boolean);
      const matched = index.filter((item) => {
        const haystack = `${item.title} ${item.year} ${item.region} ${item.type} ${item.genre} ${item.tags}`.toLowerCase();
        return tokens.every((token) => haystack.includes(token));
      }).slice(0, 18);
      paint(matched);
    };
    openers.forEach((button) => button.addEventListener("click", openLayer));
    if (close) {
      close.addEventListener("click", closeLayer);
    }
    layer.addEventListener("click", (event) => {
      if (event.target === layer) {
        closeLayer();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeLayer();
      }
    });
    input.addEventListener("input", run);
    paint(index.slice(0, 10));
  };

  ready(() => {
    initMenu();
    initHero();
    initSearch();
  });
})();
