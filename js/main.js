/**
 * BEYOND THE BEGINNING - Interactive Personal Introduction
 * Client: Hazeera Hameed
 * Course: Hat Innovations Digital Marketing Course Assignment
 * Pure Vanilla JavaScript (Zero Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initScrollProgress();
  initStickyHeader();
  initMobileMenu();
  initScrollReveals();
  initAmbientCanvas();
  initSmoothScroll();
  initTimelineInteractivity();
});

/* ==========================================================================
   1. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercentage))}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ==========================================================================
   2. STICKY HEADER & ACTIVE NAV TRACKING
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header shadow & background
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Tracking
    let currentSectionId = '';
    const scrollPosition = scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        if (targetId === currentSectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   3. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    mobileToggle.classList.toggle('active', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    navMenu.classList.remove('open');
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  mobileToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   4. SCROLL-TRIGGERED REVEAL ANIMATIONS (IntersectionObserver)
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-element');
  if (!revealElements.length) return;

  // Check if browser supports IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay');

        if (delay) {
          setTimeout(() => {
            el.classList.add('is-visible');
          }, parseInt(delay, 10));
        } else {
          el.classList.add('is-visible');
        }

        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   5. AMBIENT GOLD PARTICLES CANVAS (High-Performance & Lightweight)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;
  let particles = [];
  let isCanvasVisible = true;

  // Particle configuration
  const PARTICLE_COUNT = 38;
  const colors = [
    'rgba(229, 203, 135, 0.45)', // Soft gold
    'rgba(197, 160, 89, 0.35)',  // Warm gold
    'rgba(244, 229, 184, 0.5)',  // Pale gold sparkle
    'rgba(16, 85, 65, 0.3)'      // Deep emerald subtle dust
  ];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = -Math.random() * 0.45 - 0.15; // Float gently upwards
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.6 + 0.2;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulseVal = Math.random() * Math.PI;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulseVal += this.pulseSpeed;

      // Wrap around edges
      if (this.y < -10) this.y = height + 10;
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
    }

    draw() {
      const currentAlpha = Math.max(0.1, this.alpha + Math.sin(this.pulseVal) * 0.25);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color.replace(/[\d\.]+\)$/, `${currentAlpha})`);
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(229, 203, 135, 0.3)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function resizeCanvas() {
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function render() {
    if (!isCanvasVisible) return;

    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  // Observer to pause canvas rendering when hero is scrolled out of view
  const heroSection = document.getElementById('hero');
  if ('IntersectionObserver' in window && heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isCanvasVisible = entry.isIntersecting;
        if (isCanvasVisible) {
          cancelAnimationFrame(animationFrameId);
          render();
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      });
    }, { threshold: 0.05 });

    heroObserver.observe(heroSection);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  resizeCanvas();
  initParticles();
  render();
}

/* ==========================================================================
   6. SMOOTH SCROLLING & ACCESSIBLE JUMPS
   ========================================================================== */
function initSmoothScroll() {
  const scrollButtons = document.querySelectorAll('a[href^="#"]');

  scrollButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const targetId = button.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL hash smoothly without jump
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // Revisit Top button micro-interaction
  const revisitBtn = document.getElementById('revisit-btn');
  if (revisitBtn) {
    revisitBtn.addEventListener('click', () => {
      // Temporary glow pulse on the brand monogram
      const brandLogo = document.querySelector('.monogram-emblem');
      if (brandLogo) {
        brandLogo.style.boxShadow = '0 0 30px rgba(229, 203, 135, 0.9)';
        setTimeout(() => {
          brandLogo.style.boxShadow = '';
        }, 1500);
      }
    });
  }
}

/* ==========================================================================
   7. INTERACTIVE JOURNEY TIMELINE
   ========================================================================== */
function initTimelineInteractivity() {
  const timelineItems = document.querySelectorAll('.timeline-item');

  timelineItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      // Dim siblings slightly to spotlight active milestone
      timelineItems.forEach(other => {
        if (other !== item) {
          other.style.opacity = '0.65';
        }
      });
    });

    item.addEventListener('mouseleave', () => {
      timelineItems.forEach(other => {
        other.style.opacity = '1';
      });
    });

    // Keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.addEventListener('focus', () => {
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}
