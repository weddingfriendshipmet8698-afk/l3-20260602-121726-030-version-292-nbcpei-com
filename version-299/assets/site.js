(function() {
  const toggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function() {
      mobileNav.classList.toggle("open");
    });
  }

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  let current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function(slide, i) {
      slide.classList.toggle("active", i === current);
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle("active", i === current);
    });
  }

  dots.forEach(function(dot, index) {
    dot.addEventListener("click", function() {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function() {
      showSlide(current + 1);
    }, 6200);
  }

  const searchInput = document.getElementById("siteSearchInput");
  const clearSearch = document.getElementById("clearSearch");
  const searchableCards = Array.from(document.querySelectorAll("#searchGrid .movie-card"));

  function applySearch() {
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
    searchableCards.forEach(function(card) {
      const text = card.innerText.toLowerCase() + " " + (card.getAttribute("data-title") || "").toLowerCase();
      card.classList.toggle("is-search-hidden", keyword !== "" && !text.includes(keyword));
    });
  }

  if (searchInput) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
      searchInput.value = query;
    }
    searchInput.addEventListener("input", applySearch);
    applySearch();
  }

  if (clearSearch && searchInput) {
    clearSearch.addEventListener("click", function() {
      searchInput.value = "";
      applySearch();
      searchInput.focus();
    });
  }

  document.querySelectorAll(".filter-bar").forEach(function(bar) {
    const group = bar.getAttribute("data-filter-group");
    const scope = bar.parentElement ? bar.parentElement.querySelector(".filter-scope") : null;
    const items = scope ? Array.from(scope.children) : [];

    bar.addEventListener("click", function(event) {
      const button = event.target.closest(".chip");
      if (!button) {
        return;
      }
      bar.querySelectorAll(".chip").forEach(function(chip) {
        chip.classList.remove("active");
      });
      button.classList.add("active");
      const value = button.getAttribute("data-filter-value");
      items.forEach(function(item) {
        if (value === "all") {
          item.classList.remove("is-filter-hidden");
          return;
        }
        if (group === "category") {
          item.classList.toggle("is-filter-hidden", item.getAttribute("data-category") !== value);
          return;
        }
        if (group === "region") {
          item.classList.toggle("is-filter-hidden", item.getAttribute("data-region") !== value);
        }
      });
    });
  });
}());
