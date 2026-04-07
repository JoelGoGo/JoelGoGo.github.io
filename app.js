/* ═══════════════════════════════════════════
   JOWLAB — App Logic
   Premium interactions, scroll animations,
   custom cursor, navigation, preloader
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── PRELOADER ───
  const preloader = document.getElementById('preloader');
  const progressBar = preloader?.querySelector('.preloader__progress');
  let loadProgress = 0;

  function simulateProgress() {
    const interval = setInterval(() => {
      loadProgress += Math.random() * 15 + 5;
      if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(interval);
        if (progressBar) progressBar.style.width = '100%';
        setTimeout(() => {
          preloader?.classList.add('done');
          initAnimations();
        }, 400);
        return;
      }
      if (progressBar) progressBar.style.width = loadProgress + '%';
    }, 80);
  }

  window.addEventListener('load', simulateProgress);

  // ─── CUSTOM CURSOR ───
  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor__dot');
  const cursorRing = document.querySelector('.cursor__ring');

  if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) {
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
      }
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (cursorRing) {
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
      }
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover detection for interactive elements
    const hoverTargets = document.querySelectorAll('a, button, [data-magnetic]');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
    });
  }

  // ─── MAGNETIC BUTTONS ───
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const magneticEls = document.querySelectorAll('[data-magnetic]');
    magneticEls.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      });
      el.addEventListener('mouseenter', () => {
        el.style.transition = 'none';
      });
    });
  }

  // ─── NAVIGATION ───
  const nav = document.getElementById('nav');
  let lastScrollY = 0;
  let ticking = false;

  function updateNav() {
    const scrollY = window.scrollY;
    if (scrollY > 100) {
      if (scrollY > lastScrollY) {
        nav?.classList.remove('nav--visible');
        nav?.classList.add('nav--hidden');
      } else {
        nav?.classList.add('nav--visible');
        nav?.classList.remove('nav--hidden');
      }
    } else {
      nav?.classList.remove('nav--visible');
      nav?.classList.remove('nav--hidden');
    }
    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // ─── MOBILE MENU ───
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu?.querySelectorAll('.mobile-menu__link');

  menuBtn?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.contains('mobile-menu--open');
    menuBtn.classList.toggle('active');
    menuBtn.setAttribute('aria-expanded', !isOpen);
    mobileMenu?.classList.toggle('mobile-menu--open');
    mobileMenu?.setAttribute('aria-hidden', isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  mobileLinks?.forEach((link) => {
    link.addEventListener('click', () => {
      menuBtn?.classList.remove('active');
      menuBtn?.setAttribute('aria-expanded', 'false');
      mobileMenu?.classList.remove('mobile-menu--open');
      mobileMenu?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ───
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── SCROLL REVEAL ANIMATIONS ───
  function initAnimations() {
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-up');

    if ('IntersectionObserver' in window &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add('revealed');
              }, i * 100);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );

      revealElements.forEach((el) => observer.observe(el));
    } else {
      // Fallback: show everything immediately
      revealElements.forEach((el) => el.classList.add('revealed'));
    }

    // ─── GSAP PARALLAX (if available) ───
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Parallax glow orbs
      gsap.to('.hero__glow--1', {
        y: -80,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to('.hero__glow--2', {
        y: -50,
        x: 30,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Staggered card reveals using GSAP
      gsap.utils.toArray('.expertise__card').forEach((card, i) => {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        });
      });

      gsap.utils.toArray('.ideas__card').forEach((card, i) => {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        });
      });
    }
  }

  // ─── TILT EFFECT ON CARDS ───
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  }
})();
