/* ═══════════════════════════════════════════
   JOWLAB — Application Logic
   Multi-purpose Personal Hub
   Joel González · Technical Analyst
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── PRELOADER ─── */
  const preloader = document.getElementById('preloader');
  const progress = document.querySelector('.preloader__progress');
  let loaded = 0;

  function tick() {
    loaded += Math.random() * 18 + 4;
    if (loaded > 100) loaded = 100;
    if (progress) progress.style.width = loaded + '%';
    if (loaded < 100) {
      setTimeout(tick, 120 + Math.random() * 100);
    } else {
      setTimeout(() => {
        if (preloader) preloader.classList.add('done');
        document.body.style.overflow = '';
      }, 400);
    }
  }

  document.body.style.overflow = 'hidden';
  tick();

  /* ─── MAGNETIC BUTTONS ─── */
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + x * 0.2 + 'px, ' + y * 0.2 + 'px)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ─── NAVIGATION SHOW/HIDE ─── */
  const nav = document.getElementById('nav');
  let lastScrollY = 0;
  let scrollThreshold = 100;

  function handleNavScroll() {
    const currentY = window.scrollY;
    if (currentY <= scrollThreshold) {
      nav.classList.remove('nav--hidden');
    } else if (currentY > lastScrollY + 5) {
      nav.classList.add('nav--hidden');
    } else if (currentY < lastScrollY - 5) {
      nav.classList.remove('nav--hidden');
    }
    lastScrollY = currentY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  /* ─── MOBILE MENU ─── */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('mobile-menu--open');
      menuBtn.classList.toggle('active', isOpen);
      menuBtn.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('mobile-menu--open');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── SMOOTH SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── SCROLL REVEAL ─── */
  const revealElements = document.querySelectorAll('.reveal-text, .reveal-up');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '-40px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ─── METRICS COUNTER ANIMATION ─── */
  function animateCounters() {
    var counters = document.querySelectorAll('[data-target]');
    counters.forEach(function(counter) {
      var target = parseInt(counter.dataset.target, 10);
      var duration = 2000;
      var startTime = performance.now();

      function update(now) {
        var elapsed = now - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }

  var metricsSection = document.querySelector('.metrics');
  if (metricsSection && 'IntersectionObserver' in window) {
    var metricsObserver = new IntersectionObserver(
      function(entries) {
        if (entries[0].isIntersecting) {
          animateCounters();
          metricsObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    metricsObserver.observe(metricsSection);
  }

  /* ─── TILT EFFECT ─── */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        'perspective(800px) rotateX(' + (y * -6) + 'deg) rotateY(' + (x * 6) + 'deg) translateY(-4px)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── GSAP ANIMATIONS ─── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    /* Hero glow parallax */
    gsap.to('.hero__glow--1', {
      y: -80,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    gsap.to('.hero__glow--2', {
      y: -50,
      x: 30,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    /* Parallax showcase — move elements at different speeds */
    document.querySelectorAll('[data-parallax-speed]').forEach(function(el) {
      var speed = parseFloat(el.dataset.parallaxSpeed);
      gsap.to(el, {
        y: -100 * speed,
        scrollTrigger: {
          trigger: '.parallax-showcase',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    /* Card stagger entrance — Expertise */
    gsap.utils.toArray('.expertise__card').forEach(function(card) {
      card.classList.remove('reveal-up');
    });
    gsap.fromTo('.expertise__card',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.expertise__grid', start: 'top 80%' }
      }
    );

    /* Horizontal scroll — Projects */
    var scrollEl = document.querySelector('.projects__scroll');
    var trackEl = document.querySelector('.projects__track');
    if (scrollEl && trackEl) {
      var scrollWidth = function () {
        return trackEl.scrollWidth - scrollEl.offsetWidth;
      };
      gsap.to(trackEl, {
        x: function () { return -scrollWidth(); },
        ease: 'none',
        scrollTrigger: {
          trigger: scrollEl,
          pin: true,
          start: 'center center',
          scrub: 0.8,
          end: function () { return '+=' + scrollWidth(); },
          invalidateOnRefresh: true
        }
      });

      trackEl.addEventListener('mousemove', function(e) {
        var cards = trackEl.querySelectorAll('.projects__card:not(.projects__card--ghost)');
        cards.forEach(function(card) {
          var rect = card.getBoundingClientRect();
          card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
          card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
        });
      });
    }

    /* Stack cards stagger */
    gsap.utils.toArray('.stack-card').forEach(function(card, i) {
      gsap.from(card, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: (i % 6) * 0.06,
        ease: 'expo.out',
        scrollTrigger: { trigger: card, start: 'top 90%' }
      });
    });

    /* Toolkit items stagger */
    gsap.utils.toArray('.toolkit__item').forEach(function(item) {
      item.classList.remove('reveal-up');
    });
    gsap.fromTo('.toolkit__item',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.06,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.toolkit__grid', start: 'top 80%' }
      }
    );

    /* Tool cards stagger */
    gsap.utils.toArray('.tools__card').forEach(function(card) {
      card.classList.remove('reveal-up');
    });
    gsap.fromTo('.tools__card',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.tools__grid', start: 'top 80%' }
      }
    );

    gsap.utils.toArray('.timeline__item').forEach(function(item) {
      item.classList.remove('reveal-up');
    });
    gsap.utils.toArray('.timeline__item').forEach(function(item, i) {
      gsap.fromTo(item,
        { x: i % 2 === 0 ? -30 : 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: { trigger: item, start: 'top 85%' }
        }
      );
    });

    /* Timeline scroll progress bar */
    var timelineTrack = document.querySelector('.timeline__track');
    var timelineProgress = document.querySelector('.timeline__progress');
    var timelineDots = document.querySelectorAll('.timeline__dot');
    if (timelineTrack && timelineProgress) {
      gsap.to(timelineProgress, {
        height: function () { return timelineTrack.scrollHeight + 'px'; },
        ease: 'none',
        scrollTrigger: {
          trigger: timelineTrack,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.3,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            var progressH = self.progress * timelineTrack.scrollHeight;
            timelineDots.forEach(function (dot) {
              var item = dot.closest('.timeline__item');
              var dotTop = item ? item.offsetTop : 0;
              if (progressH >= dotTop) {
                dot.classList.add('reached');
              } else {
                dot.classList.remove('reached');
              }
            });
          }
        }
      });
    }

    /* Ambient orbs scroll response */
    gsap.to('.ambient__orb--1', {
      y: -150,
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2
      }
    });

    gsap.to('.ambient__orb--2', {
      y: 100,
      x: -50,
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 3
      }
    });

    gsap.to('.ambient__orb--3', {
      y: -80,
      x: 80,
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2.5
      }
    });

    window.addEventListener('load', function () {
      ScrollTrigger.refresh();
    });
  }

  /* ══════════════════════════════════════════
     TOOLS — Functional Logic
     ══════════════════════════════════════════ */

  /* ─── JSON Formatter ─── */
  function handleJsonFormat() {
    var input = document.querySelector('[data-tool="json-input"]');
    var output = document.querySelector('[data-tool="json-output"]');
    if (!input || !output) return;
    try {
      var parsed = JSON.parse(input.value);
      output.textContent = JSON.stringify(parsed, null, 2);
      output.style.color = 'var(--c-accent)';
    } catch (e) {
      output.textContent = 'Error: ' + e.message;
      output.style.color = 'var(--c-error)';
    }
  }

  function handleJsonMinify() {
    var input = document.querySelector('[data-tool="json-input"]');
    var output = document.querySelector('[data-tool="json-output"]');
    if (!input || !output) return;
    try {
      var parsed = JSON.parse(input.value);
      output.textContent = JSON.stringify(parsed);
      output.style.color = 'var(--c-accent)';
    } catch (e) {
      output.textContent = 'Error: ' + e.message;
      output.style.color = 'var(--c-error)';
    }
  }

  /* ─── Base64 Codec ─── */
  function handleBase64Encode() {
    var input = document.querySelector('[data-tool="base64-input"]');
    var output = document.querySelector('[data-tool="base64-output"]');
    if (!input || !output) return;
    try {
      output.textContent = btoa(unescape(encodeURIComponent(input.value)));
      output.style.color = 'var(--c-accent)';
    } catch (e) {
      output.textContent = 'Error: ' + e.message;
      output.style.color = 'var(--c-error)';
    }
  }

  function handleBase64Decode() {
    var input = document.querySelector('[data-tool="base64-input"]');
    var output = document.querySelector('[data-tool="base64-output"]');
    if (!input || !output) return;
    try {
      output.textContent = decodeURIComponent(escape(atob(input.value.trim())));
      output.style.color = 'var(--c-accent)';
    } catch (e) {
      output.textContent = 'Error: cadena Base64 inválida';
      output.style.color = 'var(--c-error)';
    }
  }

  /* ─── Color Converter ─── */
  function handleColorInput() {
    var input = document.querySelector('[data-tool="color-input"]');
    var picker = document.querySelector('[data-tool="color-picker"]');
    var swatch = document.querySelector('[data-tool="color-swatch"]');
    var hexEl = document.querySelector('[data-tool="color-hex"]');
    var rgbEl = document.querySelector('[data-tool="color-rgb"]');
    var hslEl = document.querySelector('[data-tool="color-hsl"]');
    if (!input || !swatch) return;

    var val = input.value.trim();
    var r, g, b;

    /* Parse HEX */
    if (/^#?[0-9a-fA-F]{3,6}$/.test(val)) {
      var hex = val.startsWith('#') ? val : '#' + val;
      if (hex.length === 4) {
        hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
      }
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
    /* Parse RGB */
    else if (/^rgb/i.test(val)) {
      var m = val.match(/(\d+)/g);
      if (m && m.length >= 3) {
        r = parseInt(m[0], 10);
        g = parseInt(m[1], 10);
        b = parseInt(m[2], 10);
      } else return;
    } else return;

    var hexOut = '#' + [r, g, b].map(function(v) {
      return v.toString(16).padStart(2, '0');
    }).join('');

    /* RGB ➝ HSL */
    var rn = r / 255, gn = g / 255, bn = b / 255;
    var max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    var h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
        case gn: h = ((bn - rn) / d + 2) / 6; break;
        case bn: h = ((rn - gn) / d + 4) / 6; break;
      }
    }

    swatch.style.background = hexOut;
    if (picker) picker.value = hexOut;
    if (hexEl) hexEl.textContent = 'HEX: ' + hexOut.toUpperCase();
    if (rgbEl) rgbEl.textContent = 'RGB: ' + r + ', ' + g + ', ' + b;
    if (hslEl) hslEl.textContent = 'HSL: ' + Math.round(h * 360) + '\u00B0, ' + Math.round(s * 100) + '%, ' + Math.round(l * 100) + '%';
  }

  /* ─── Timestamp Converter ─── */
  function handleTimestampConvert() {
    var input = document.querySelector('[data-tool="timestamp-input"]');
    var output = document.querySelector('[data-tool="timestamp-output"]');
    if (!input || !output) return;
    var val = input.value.trim();

    var num = Number(val);
    if (!isNaN(num) && val !== '') {
      var ms = num > 1e12 ? num : num * 1000;
      var date = new Date(ms);
      output.textContent =
        'UTC:   ' + date.toUTCString() + '\n' +
        'Local: ' + date.toLocaleString('es-ES') + '\n' +
        'ISO:   ' + date.toISOString();
      output.style.color = 'var(--c-accent)';
    } else {
      var d = new Date(val);
      if (!isNaN(d.getTime())) {
        output.textContent =
          'Unix (s):  ' + Math.floor(d.getTime() / 1000) + '\n' +
          'Unix (ms): ' + d.getTime();
        output.style.color = 'var(--c-accent)';
      } else {
        output.textContent = 'Formato no reconocido. Usa un timestamp o una fecha válida.';
        output.style.color = 'var(--c-error)';
      }
    }
  }

  function handleTimestampNow() {
    var input = document.querySelector('[data-tool="timestamp-input"]');
    if (input) {
      input.value = Math.floor(Date.now() / 1000);
      handleTimestampConvert();
    }
  }

  /* ─── Password Generator ─── */
  function handleGeneratePassword() {
    var lengthInput = document.querySelector('[data-tool="pwd-length"]');
    var output = document.querySelector('[data-tool="password-output"]');
    if (!lengthInput || !output) return;

    var length = parseInt(lengthInput.value, 10);
    var upper = document.querySelector('[data-tool="pwd-upper"]');
    var lower = document.querySelector('[data-tool="pwd-lower"]');
    var numbers = document.querySelector('[data-tool="pwd-numbers"]');
    var symbols = document.querySelector('[data-tool="pwd-symbols"]');

    var chars = '';
    if (upper && upper.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower && lower.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers && numbers.checked) chars += '0123456789';
    if (symbols && symbols.checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      output.textContent = 'Selecciona al menos un tipo de carácter.';
      output.style.color = 'var(--c-error)';
      return;
    }

    var array = new Uint32Array(length);
    crypto.getRandomValues(array);
    var password = '';
    for (var i = 0; i < length; i++) {
      password += chars[array[i] % chars.length];
    }

    output.textContent = password;
    output.style.color = 'var(--c-accent)';
  }

  function handleCopyPassword() {
    var output = document.querySelector('[data-tool="password-output"]');
    if (!output || !output.textContent) return;
    navigator.clipboard.writeText(output.textContent).then(function() {
      var orig = output.style.color;
      output.style.color = 'var(--c-success)';
      setTimeout(function() { output.style.color = orig; }, 600);
    });
  }

  /* ─── URL Encoder/Decoder ─── */
  function handleUrlEncode() {
    var input = document.querySelector('[data-tool="url-input"]');
    var output = document.querySelector('[data-tool="url-output"]');
    if (!input || !output) return;
    output.textContent = encodeURIComponent(input.value);
    output.style.color = 'var(--c-accent)';
  }

  function handleUrlDecode() {
    var input = document.querySelector('[data-tool="url-input"]');
    var output = document.querySelector('[data-tool="url-output"]');
    if (!input || !output) return;
    try {
      output.textContent = decodeURIComponent(input.value);
      output.style.color = 'var(--c-accent)';
    } catch (e) {
      output.textContent = 'Error: URL malformada';
      output.style.color = 'var(--c-error)';
    }
  }

  /* ─── Tool Action Dispatcher ─── */
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.dataset.action;

    switch (action) {
      case 'format-json':       handleJsonFormat(); break;
      case 'minify-json':       handleJsonMinify(); break;
      case 'encode-base64':     handleBase64Encode(); break;
      case 'decode-base64':     handleBase64Decode(); break;
      case 'convert-timestamp': handleTimestampConvert(); break;
      case 'timestamp-now':     handleTimestampNow(); break;
      case 'generate-password': handleGeneratePassword(); break;
      case 'copy-password':     handleCopyPassword(); break;
      case 'encode-url':        handleUrlEncode(); break;
      case 'decode-url':        handleUrlDecode(); break;
    }
  });

  /* Color tool — live input sync */
  var colorInput = document.querySelector('[data-tool="color-input"]');
  var colorPicker = document.querySelector('[data-tool="color-picker"]');

  if (colorInput) {
    colorInput.addEventListener('input', handleColorInput);
  }
  if (colorPicker) {
    colorPicker.addEventListener('input', function(e) {
      if (colorInput) {
        colorInput.value = e.target.value;
        handleColorInput();
      }
    });
  }

  /* Password length display */
  var pwdLength = document.querySelector('[data-tool="pwd-length"]');
  var pwdDisplay = document.querySelector('[data-tool="pwd-length-display"]');
  if (pwdLength && pwdDisplay) {
    pwdLength.addEventListener('input', function(e) {
      pwdDisplay.textContent = e.target.value;
    });
  }

  /* Initialize color swatch with default */
  if (colorInput && colorInput.value) {
    handleColorInput();
  }

})();
