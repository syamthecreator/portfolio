/* ==========================================================================
   Syam Kumar S — Portfolio
   script.js — vanilla JS interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading Screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('is-hidden'), 500);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => loader && loader.classList.add('is-hidden'), 2500);

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky Navbar ---------- */
  const nav = document.getElementById('nav');
  const onScrollNav = () => {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  document.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile Menu / Drawer ---------- */
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');

  const openDrawer = () => {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    burger.classList.add('is-active');
    burger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
  });
  backdrop.addEventListener('click', closeDrawer);
  document.querySelectorAll('[data-nav-mobile]').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ---------- Smooth Scroll (native CSS handles most; JS ensures header offset accuracy) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('nav').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Scroll Spy / Active Navigation ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('[data-nav]');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => spyObserver.observe(section));

  /* ---------- Scroll Reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-reveal-delay') || 0;
        setTimeout(() => entry.target.classList.add('is-visible'), Number(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated Counters ---------- */
  const counters = document.querySelectorAll('.stat-card__num[data-count]');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const staticEls = document.querySelectorAll('.stat-card__num[data-static]');
  staticEls.forEach(el => { el.textContent = el.getAttribute('data-static'); });

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(el => counterObserver.observe(el));

  /* ---------- Cursor Glow ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  /* ---------- Floating Background Particles ---------- */
  const particleContainer = document.getElementById('particles');
  const particleCount = window.innerWidth < 640 ? 14 : 28;
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = `${Math.random() * 100}%`;
    p.style.bottom = `-10px`;
    p.style.animationDuration = `${12 + Math.random() * 14}s`;
    p.style.animationDelay = `${Math.random() * 12}s`;
    p.style.opacity = (0.3 + Math.random() * 0.4).toFixed(2);
    particleContainer.appendChild(p);
  }

  /* ---------- Ripple Button Effect ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- Typing Effect (hero name accent already static; type the summary role badge) ---------- */
  const badgeDot = document.querySelector('.badge');
  // Typing effect applied to hero role words for subtle motion without altering resume content
  const roles = ['Flutter Developer', 'Cross-Platform Engineer', 'Mobile App Builder'];
  const badgeTextEl = badgeDot ? badgeDot.childNodes[badgeDot.childNodes.length - 1] : null;

  if (badgeDot) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeLoop = () => {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        if (charIndex > current.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      badgeDot.lastChild.textContent = ' ' + current.slice(0, charIndex);
      setTimeout(typeLoop, deleting ? 45 : 80);
    };

    setTimeout(typeLoop, 1600);
  }

  /* ---------- Back to Top ---------- */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Contact Form Validation ---------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Please enter your name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
    subject: (v) => v.trim().length >= 3 || 'Please add a short subject.',
    message: (v) => v.trim().length >= 10 || 'Message should be at least 10 characters.'
  };

  const setError = (field, message) => {
    const row = form.querySelector(`#${field}`).closest('.form-row');
    const errorEl = form.querySelector(`[data-error-for="${field}"]`);
    if (message) {
      row.classList.add('has-error');
      errorEl.textContent = message;
    } else {
      row.classList.remove('has-error');
      errorEl.textContent = '';
    }
  };

  Object.keys(validators).forEach(field => {
    const input = form.querySelector(`#${field}`);
    input.addEventListener('input', () => {
      const result = validators[field](input.value);
      setError(field, result === true ? '' : result);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    Object.keys(validators).forEach(field => {
      const input = form.querySelector(`#${field}`);
      const result = validators[field](input.value);
      if (result !== true) {
        setError(field, result);
        isValid = false;
      } else {
        setError(field, '');
      }
    });

    if (!isValid) {
      successMsg.textContent = '';
      return;
    }

    // No backend wired up — acknowledge submission locally.
    successMsg.textContent = "Thanks! Your message has been noted — I'll get back to you soon.";
    form.reset();
    setTimeout(() => { successMsg.textContent = ''; }, 6000);
  });

});