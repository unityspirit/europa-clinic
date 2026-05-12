/* ======================================================
   EUROPA CLINIC — App Engine
   Scroll-snap + IntersectionObserver reveal + Navigation
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- REVEAL ON SCROLL ----
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger animation
        const delay = Array.from(entry.target.parentElement.querySelectorAll('.reveal'))
          .indexOf(entry.target) * 80;
        setTimeout(() => entry.target.classList.add('visible'), delay);
      }
    });
  }, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));

  // ---- NAVBAR SCROLL EFFECT ----
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (sy > 80) {
      navbar.style.background = 'rgba(10, 10, 20, 0.95)';
      navbar.style.borderColor = 'rgba(201, 169, 110, 0.3)';
    } else {
      navbar.style.background = 'rgba(10, 10, 20, 0.8)';
      navbar.style.borderColor = 'rgba(201, 169, 110, 0.2)';
    }
    lastScroll = sy;
  }, { passive: true });

  // ---- ACTIVE SECTION HIGHLIGHT ----
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = entry.target.dataset.index;
        navLinks.forEach(link => {
          const ds = link.dataset.scroll;
          link.style.color = ds === idx ? '#c9a96e' : '';
        });
      }
    });
  }, { root: null, rootMargin: '-40% 0px -40% 0px' });

  pages.forEach(p => sectionObserver.observe(p));

  // ---- SMOOTH SCROLL NAV ----
  document.querySelectorAll('[data-scroll]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = link.dataset.scroll;
      const target = document.querySelector(`.page[data-index="${idx}"]`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        closeMobileDrawer();
      }
    });
  });

  // Brand link scroll to top
  const brandLink = document.querySelector('.nav-brand');
  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('#hero').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ---- MOBILE DRAWER ----
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('mobileDrawer');

  function closeMobileDrawer() {
    drawer.classList.remove('open');
    burger.classList.remove('active');
  }

  burger.addEventListener('click', () => {
    drawer.classList.toggle('open');
    burger.classList.toggle('active');
  });

  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMobileDrawer);
  });

  // ---- HERO PARALLAX EFFECT ----
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      const heroHeight = window.innerHeight;
      if (sy < heroHeight) {
        heroBg.style.transform = `translateY(${sy * 0.3}px) scale(${1 + sy * 0.0003})`;
        heroBg.style.opacity = 1 - (sy / heroHeight) * 0.5;
      }
    }, { passive: true });
  }

  // ---- ANIMATED COUNTERS ----
  const countEls = document.querySelectorAll('.result-num, .stat-num');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCount(entry.target);
      }
    });
  }, { threshold: 0.5 });

  countEls.forEach(el => countObserver.observe(el));

  function animateCount(el) {
    const text = el.textContent.trim();
    const match = text.match(/^([\d,.\s]+)/);
    if (!match) return;

    const numStr = match[1].replace(/\s/g, '').replace(/,/g, '');
    const target = parseInt(numStr, 10);
    if (isNaN(target)) return;

    const suffix = text.replace(match[0], '');
    const prefix = text.match(/^[^\d]*/)?.[0] || '';
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      let display = current.toLocaleString('ru-RU');
      el.textContent = prefix + display + suffix;

      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---- FORM SUBMIT FEEDBACK ----
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const originalText = btn.textContent;
      btn.textContent = '✓ Заявка отправлена!';
      btn.style.background = 'linear-gradient(135deg, #5bbfb5, #2dd4a8)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }
});
