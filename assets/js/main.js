/* Am'India — homepage concept scripts (nav toggle, header state, subtle reveal). */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ----- Mobile navigation ----- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-menu");

  function setMenu(open) {
    if (nav) nav.classList.toggle("is-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    }
    /* Open panel covers the viewport on mobile: stop the page scrolling behind it. */
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
  }

  /* ----- Header shadow on scroll ----- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----- Gallery filter chips ----- */
  var filterBar = document.querySelector("[data-filter-bar]");
  if (filterBar) {
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-group]"));
    filterBar.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-filter]");
      if (!chip) return;
      var f = chip.getAttribute("data-filter");
      filterBar.querySelectorAll("[data-filter]").forEach(function (c) {
        c.setAttribute("aria-pressed", c === chip ? "true" : "false");
      });
      items.forEach(function (it) {
        var show = f === "toutes" || it.getAttribute("data-group") === f;
        it.hidden = !show;
      });
    });
  }

  /* ----- Lightbox ----- */
  var lb = document.querySelector(".lightbox");
  if (lb) {
    var lbImg = lb.querySelector(".lightbox__img");
    var lbCap = lb.querySelector(".lightbox__caption");
    var lbCount = lb.querySelector(".lightbox__count");
    var lbBtnClose = lb.querySelector(".lightbox__close");
    var lbBtnPrev = lb.querySelector(".lightbox__prev");
    var lbBtnNext = lb.querySelector(".lightbox__next");
    var group = [];
    var index = 0;
    var lastTrigger = null;

    function captionFor(anchor) {
      var img = anchor.querySelector("img");
      if (img && img.alt) return img.alt;
      var fig = anchor.closest("figure");
      var fc = fig && fig.querySelector("figcaption");
      return fc ? fc.textContent : "";
    }

    /* A gallery filter hides items via [hidden]; the lightbox walks only
       what the visitor can currently see, never the filtered-out rest. */
    function visibleGroup(anchor) {
      var selector = '[data-lightbox="' + anchor.getAttribute("data-lightbox") + '"]';
      return Array.prototype.slice.call(document.querySelectorAll(selector)).filter(function (a) {
        return !a.hidden && !a.closest("[hidden]");
      });
    }

    function render() {
      var item = group[index];
      lbImg.src = item.href;
      lbImg.alt = captionFor(item);
      lbCap.textContent = captionFor(item);
      var many = group.length > 1;
      lbBtnPrev.hidden = lbBtnNext.hidden = !many;
      if (lbCount) lbCount.textContent = many ? (index + 1) + " / " + group.length : "";
    }

    function open(anchor) {
      group = visibleGroup(anchor);
      if (!group.length) return;
      index = Math.max(0, group.indexOf(anchor));
      lastTrigger = anchor;
      render();
      lb.hidden = false;
      lbBtnClose.focus();
      document.body.style.overflow = "hidden";
    }

    function close() {
      lb.hidden = true;
      lbImg.src = "";
      document.body.style.overflow = "";
      if (lastTrigger) lastTrigger.focus();
    }

    function move(step) {
      index = (index + step + group.length) % group.length;
      render();
    }

    document.addEventListener("click", function (e) {
      var anchor = e.target.closest("a[data-lightbox]");
      if (!anchor) return;
      e.preventDefault();
      open(anchor);
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lightbox__backdrop")) close();
    });
    lbBtnClose.addEventListener("click", close);
    lbBtnPrev.addEventListener("click", function () { move(-1); });
    lbBtnNext.addEventListener("click", function () { move(1); });
    /* ----- Lightbox: keep the keyboard inside the dialog ----- */
    function trapFocus(e) {
      if (e.key !== "Tab" || lb.hidden) return;
      var focusables = lb.querySelectorAll("button:not([hidden])");
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", trapFocus);

    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") move(-1);
      else if (e.key === "ArrowRight") move(1);
    });

    /* Touch: swipe left/right to move through the visible group. */
    var touchX = null, touchY = null;
    lb.addEventListener("touchstart", function (e) {
      if (lb.hidden || e.touches.length !== 1) return;
      touchX = e.touches[0].clientX; touchY = e.touches[0].clientY;
    }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (lb.hidden || touchX === null || group.length < 2) { touchX = null; return; }
      var dx = e.changedTouches[0].clientX - touchX;
      var dy = e.changedTouches[0].clientY - touchY;
      touchX = null;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ----- Journal: year-chip scrollspy -----
     Highlights the chip of the year currently being read. */
  var yearBar = document.querySelector(".year-bar");
  if (yearBar) {
    var chips = Array.prototype.slice.call(yearBar.querySelectorAll('a[href^="#"]'));
    var headings = chips.map(function (c) {
      return document.getElementById(c.getAttribute("href").slice(1));
    }).filter(Boolean);
    var spy = function () {
      var line = window.scrollY + window.innerHeight * 0.35;
      var current = null;
      headings.forEach(function (h) {
        if (h.getBoundingClientRect().top + window.scrollY <= line) current = h.id;
      });
      chips.forEach(function (c) {
        c.classList.toggle("is-active", current !== null && c.getAttribute("href") === "#" + current);
      });
    };
    window.addEventListener("scroll", spy, { passive: true });
    window.addEventListener("resize", spy);
    spy();
  }

  /* ----- Subtle reveal (3 feature blocks only) ----- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (revealables.length) {
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });
      revealables.forEach(function (el) { io.observe(el); });

      /* Safety net: a fast scroll (scrollbar drag, anchor jump, trackpad
         fling) can step over an element before the observer reports it.
         Sweep on every scroll so content is never left permanently hidden. */
      var sweep = function () {
        for (var i = 0; i < revealables.length; i++) {
          var el = revealables[i];
          if (el.classList.contains("visible")) continue;
          if (el.getBoundingClientRect().top < window.innerHeight * 0.96) {
            el.classList.add("visible");
            io.unobserve(el);
          }
        }
      };
      window.addEventListener("scroll", sweep, { passive: true });
      window.addEventListener("resize", sweep);
      sweep();
    }
  }
})();
