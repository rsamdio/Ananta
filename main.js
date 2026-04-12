(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function refreshIcons(root) {
    if (typeof lucide === 'undefined' || !lucide.createIcons || !lucide.icons) return;
    lucide.createIcons({ icons: lucide.icons, root: root || document });
  }

  if (typeof AOS !== 'undefined' && !prefersReducedMotion) {
    AOS.init({
      once: true,
      duration: 550,
      easing: 'ease-out-cubic',
      offset: 40,
      delay: 0,
    });
  }

  refreshIcons();

  function loadGtag() {
    if (window.__anantaGtagLoaded) return;
    window.__anantaGtagLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-34870P90W6';
    s.async = true;
    document.head.appendChild(s);
    s.onload = function () {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'G-34870P90W6');
    };
  }

  var scheduleGtag = window.requestIdleCallback || function (cb) {
    return setTimeout(cb, 2000);
  };
  scheduleGtag(function () {
    loadGtag();
  }, { timeout: 4500 });

  (function initIntroOverlay() {
    var overlay = document.getElementById('intro-overlay');
    var logo = document.getElementById('intro-logo');
    if (!overlay) return;

    var introSeen = sessionStorage.getItem('ananta_intro_seen') === '1';

    if (prefersReducedMotion || introSeen) {
      overlay.style.display = 'none';
      overlay.style.pointerEvents = 'none';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-busy', 'false');
      return;
    }

    var MAX_WAIT_MS = 2200;
    var MIN_VISIBLE_MS = 520;
    var FADE_MS = 300;
    var started = performance.now();
    var settled = false;

    function dismiss() {
      sessionStorage.setItem('ananta_intro_seen', '1');
      overlay.style.pointerEvents = 'none';
      overlay.style.opacity = '0';
      overlay.setAttribute('aria-busy', 'false');
      setTimeout(function () {
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
      }, FADE_MS);
    }

    function finish() {
      if (settled) return;
      settled = true;
      clearTimeout(safetyTimer);
      var elapsed = performance.now() - started;
      var hold = Math.max(0, MIN_VISIBLE_MS - elapsed);
      setTimeout(dismiss, hold);
    }

    var safetyTimer = setTimeout(finish, MAX_WAIT_MS);

    if (!logo) {
      finish();
      return;
    }

    function onLogoReady() {
      finish();
    }

    if (logo.complete && logo.naturalWidth > 0) {
      if (logo.decode) {
        logo.decode().then(onLogoReady).catch(onLogoReady);
      } else {
        onLogoReady();
      }
    } else {
      logo.addEventListener('load', onLogoReady, { once: true });
      logo.addEventListener('error', onLogoReady, { once: true });
    }
  })();

  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('bg-navy-deep/90', 'backdrop-blur-lg', 'py-4', 'shadow-xl');
        navbar.classList.remove('bg-transparent', 'py-6');
      } else {
        navbar.classList.remove('bg-navy-deep/90', 'backdrop-blur-lg', 'py-4', 'shadow-xl');
        navbar.classList.add('bg-transparent', 'py-6');
      }
    });
  }

  var menuToggle = document.getElementById('menu-toggle');
  var menuClose = document.getElementById('menu-close');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.remove('hidden');
      menuToggle.setAttribute('aria-expanded', 'true');
      setTimeout(function () {
        mobileMenu.classList.remove('translate-x-full');
      }, 10);
    });
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('translate-x-full');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    setTimeout(function () {
      mobileMenu.classList.add('hidden');
    }, 300);
  }

  if (menuClose) menuClose.addEventListener('click', closeMenu);
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  var navLinks = document.querySelectorAll('nav a[href^="#"], .mobile-link[href^="#"]');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var href = link.getAttribute('href');
      if (!href || href.length < 2) return;
      var targetId = href.substring(1);
      var targetElement = document.getElementById(targetId);
      if (!targetElement) return;
      var navbarHeight = navbar ? navbar.offsetHeight : 0;
      var elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
      var scrollTo = elementTop - navbarHeight - 16;
      window.scrollTo({
        top: scrollTo,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    });
  });

  var targetDate = new Date('May 30, 2026 15:00:00').getTime();
  function updateCountdown() {
    var now = new Date().getTime();
    var distance = targetDate - now;
    if (distance < 0) return;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var d = document.getElementById('days');
    var h = document.getElementById('hours');
    var m = document.getElementById('minutes');
    var s = document.getElementById('seconds');
    if (d) d.innerText = String(days);
    if (h) h.innerText = String(hours);
    if (m) m.innerText = String(minutes);
    if (s) s.innerText = String(seconds);
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  window.scrollGalleryTrack = function (direction) {
    var track = document.getElementById('gallery-carousel');
    if (!track) return;
    var slide = track.querySelector('.gallery-slide');
    if (!slide) return;
    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap) || 0;
    var amount = slide.offsetWidth + gap;
    track.scrollBy({ left: direction * amount, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxTitle = document.getElementById('lightbox-title');
  var lightboxDesc = document.getElementById('lightbox-desc');

  window.openLightbox = function (src, title, desc) {
    if (!lightbox || !lightboxImg || !lightboxTitle || !lightboxDesc) return;
    lightboxImg.src = src;
    lightboxTitle.innerText = title;
    lightboxDesc.innerText = desc;
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    refreshIcons(lightbox);
  };

  window.closeLightbox = function () {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    document.body.style.overflow = 'auto';
  };

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeLightbox();
  });
})();
