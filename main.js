(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof AOS !== 'undefined' && !prefersReducedMotion) {
    AOS.init({
      once: true,
      duration: 550,
      easing: 'ease-out-cubic',
      offset: 40,
      delay: 0,
    });
  }

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
      var scrolled = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (scrolled > 50) {
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

  // Venue Slideshow Logic
  var currentVenueSlideIndex = 0;
  var venueSlideTimer = null;
  var venueSlideshowContainer = document.getElementById('venue-slideshow-container');

  function showVenueSlide(index) {
    var slides = document.querySelectorAll('.venue-slide');
    var dots = document.querySelectorAll('.venue-dot');
    if (!slides.length) return;

    if (index >= slides.length) currentVenueSlideIndex = 0;
    else if (index < 0) currentVenueSlideIndex = slides.length - 1;
    else currentVenueSlideIndex = index;

    slides.forEach(function (slide, i) {
      if (i === currentVenueSlideIndex) {
        slide.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
        slide.classList.add('opacity-100', 'scale-100');
      } else {
        slide.classList.remove('opacity-100', 'scale-100');
        slide.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
      }
    });

    dots.forEach(function (dot, i) {
      if (i === currentVenueSlideIndex) {
        dot.classList.add('active', 'bg-white');
        dot.classList.remove('bg-white/40');
      } else {
        dot.classList.remove('active', 'bg-white');
        dot.classList.add('bg-white/40');
      }
    });
  }

  window.changeVenueSlide = function (direction) {
    resetVenueTimer();
    showVenueSlide(currentVenueSlideIndex + direction);
  };

  window.setVenueSlide = function (index) {
    resetVenueTimer();
    showVenueSlide(index);
  };

  function startVenueTimer() {
    if (prefersReducedMotion) return;
    resetVenueTimer();
    venueSlideTimer = setInterval(function () {
      showVenueSlide(currentVenueSlideIndex + 1);
    }, 4000);
  }

  function resetVenueTimer() {
    if (venueSlideTimer) {
      clearInterval(venueSlideTimer);
      venueSlideTimer = null;
    }
  }

  if (venueSlideshowContainer) {
    venueSlideshowContainer.addEventListener('mouseenter', resetVenueTimer);
    venueSlideshowContainer.addEventListener('mouseleave', startVenueTimer);

    // Touch Swipe Gesture Support
    var touchStartX = 0;
    var touchEndX = 0;

    venueSlideshowContainer.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    venueSlideshowContainer.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diffX = touchEndX - touchStartX;
      if (Math.abs(diffX) > 50) {
        if (diffX < 0) {
          window.changeVenueSlide(1);
        } else {
          window.changeVenueSlide(-1);
        }
      }
    }, { passive: true });

    startVenueTimer();
  }

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
  };

  window.closeLightbox = function () {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    document.body.style.overflow = 'auto';
  };

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeLightbox();
  });

  // Scroll to Top Button Logic
  var scrollTopBtn = document.getElementById('scroll-to-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      var scrolled = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (scrolled > 400) {
        scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        scrollTopBtn.classList.add('opacity-100');
      } else {
        scrollTopBtn.classList.remove('opacity-100');
        scrollTopBtn.classList.add('opacity-0', 'pointer-events-none');
      }
    });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    });
  }

  // FAQ Accordion Toggling Logic
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var trigger = item.querySelector('.faq-trigger');
    var content = item.querySelector('.faq-content');
    if (trigger && content) {
      trigger.addEventListener('click', function () {
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        
        // Close other open accordions
        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            var otherTrigger = otherItem.querySelector('.faq-trigger');
            var otherContent = otherItem.querySelector('.faq-content');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherContent) otherContent.style.maxHeight = '0px';
          }
        });

        // Toggle current accordion
        item.classList.toggle('active');
        trigger.setAttribute('aria-expanded', !expanded ? 'true' : 'false');
        if (!expanded) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = '0px';
        }
      });
    }
  });

  // Schedule Tab Selection Logic
  var tabDay1 = document.getElementById('tab-day1');
  var tabDay2 = document.getElementById('tab-day2');
  var panelDay1 = document.getElementById('panel-day1');
  var panelDay2 = document.getElementById('panel-day2');

  if (tabDay1 && tabDay2 && panelDay1 && panelDay2) {
    tabDay1.addEventListener('click', function () {
      // Activate Day 1 Tab
      tabDay1.setAttribute('aria-selected', 'true');
      tabDay1.classList.remove('bg-white/5', 'text-white/60', 'hover:text-white', 'border', 'border-white/10');
      tabDay1.classList.add('bg-gold-royal', 'text-navy-deep', 'shadow-lg');

      // Deactivate Day 2 Tab
      tabDay2.setAttribute('aria-selected', 'false');
      tabDay2.classList.remove('bg-gold-royal', 'text-navy-deep', 'shadow-lg');
      tabDay2.classList.add('bg-white/5', 'text-white/60', 'hover:text-white', 'border', 'border-white/10');

      // Toggle Panels
      panelDay1.classList.remove('hidden');
      panelDay2.classList.add('hidden');
    });

    tabDay2.addEventListener('click', function () {
      // Activate Day 2 Tab
      tabDay2.setAttribute('aria-selected', 'true');
      tabDay2.classList.remove('bg-white/5', 'text-white/60', 'hover:text-white', 'border', 'border-white/10');
      tabDay2.classList.add('bg-gold-royal', 'text-navy-deep', 'shadow-lg');

      // Deactivate Day 1 Tab
      tabDay1.setAttribute('aria-selected', 'false');
      tabDay1.classList.remove('bg-gold-royal', 'text-navy-deep', 'shadow-lg');
      tabDay1.classList.add('bg-white/5', 'text-white/60', 'hover:text-white', 'border', 'border-white/10');

      // Toggle Panels
      panelDay2.classList.remove('hidden');
      panelDay1.classList.add('hidden');
    });
  }
})();
