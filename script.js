/* ============================================================
   PALAK JAIN — PORTFOLIO SCRIPT
   Vanilla JS · No external dependencies
   Features:
     1. Design randomisation (theme, layout, animation)
     2. Scroll-aware navigation
     3. Mobile menu toggle
     4. Scroll-triggered fade-in animations
     5. Typewriter effect
     6. Active nav link highlighting
   ============================================================ */

'use strict';

// ============================================================
// 1. FIXED DESIGN — no randomisation (warm cream theme)
// ============================================================
// Design inspired by curious.pm — warm cream, pastel cards, dark borders.


// ============================================================
// 2. NAVIGATION — scroll shadow
// ============================================================

const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


// ============================================================
// 3. MOBILE MENU TOGGLE
// ============================================================

const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle && navLinks) {
  function setMenuOpen(open) {
    navLinks.classList.toggle('open', open);
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  }

  navToggle.addEventListener('click', () => {
    setMenuOpen(!navLinks.classList.contains('open'));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      setMenuOpen(false);
      navToggle.focus();
    }
  });
}


// ============================================================
// 4. SCROLL-TRIGGERED FADE-IN ANIMATIONS
// ============================================================

const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold:   0.12,
  rootMargin: '0px 0px -40px 0px',
});

fadeElements.forEach(el => fadeObserver.observe(el));


// ============================================================
// 5. TYPEWRITER EFFECT
// ============================================================

const typewriterEl = document.getElementById('typewriter');

if (!typewriterEl) {
  // Not on the main page — skip typewriter entirely
} else {

const PHRASES = [
  'AI Strategy Leader',
  'AI Platform Builder',
  'Product Org Influencer',
  '30 Under 30 Honoree',
  'Enterprise SaaS Expert',
  'Agentic Systems PM',
  'Growth & Data PM',
  'IIT Kharagpur Alumni',
  'Global Product Leader',
  'AI Copilot Architect',
  'From 0→1 to Millions',
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;

function getTypingSpeed() {
  if (isDeleting)              return 42;
  if (charIndex === 0)         return 180; // pause at start
  return 80 + Math.random() * 25;          // slight variation feels natural
}

function typeStep() {
  const phrase = PHRASES[phraseIndex];

  if (isDeleting) {
    charIndex--;
    typewriterEl.textContent = phrase.slice(0, charIndex);
    if (charIndex === 0) {
      isDeleting   = false;
      phraseIndex  = (phraseIndex + 1) % PHRASES.length;
    }
  } else {
    charIndex++;
    typewriterEl.textContent = phrase.slice(0, charIndex);
    if (charIndex === phrase.length) {
      // Pause at full phrase before deleting
      setTimeout(() => {
        isDeleting = true;
        setTimeout(typeStep, getTypingSpeed());
      }, 2200);
      return;
    }
  }

  setTimeout(typeStep, getTypingSpeed());
}

// Start after a short delay so the page has settled
setTimeout(typeStep, 900);

} // end typewriter guard


// ============================================================
// 6. ACTIVE NAV LINK HIGHLIGHTING
// ============================================================

const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const currentId = entry.target.id;
      navAnchors.forEach(anchor => {
        const isActive = anchor.getAttribute('href') === `#${currentId}`;
        anchor.classList.toggle('active', isActive);
      });
    }
  });
}, {
  threshold: 0.35,
});

sections.forEach(s => sectionObserver.observe(s));


// ============================================================
// 7. SMOOTH SCROLL POLYFILL (for older Safari)
// ============================================================


// ============================================================
// 8. WORK CARD TILT EFFECT
// ============================================================

document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transition = 'box-shadow 0.3s ease';
    card.style.transform  = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.45s ease, box-shadow 0.35s ease';
    card.style.transform  = '';
  });
});


// ============================================================
// 9. SMOOTH SCROLL POLYFILL (for older Safari)
// ============================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// ============================================================
// 10. MOBILE ACCORDION — EXPERIENCE TIMELINE
// ============================================================

function initTimelineAccordion() {
  if (window.innerWidth > 960) return;
  document.querySelectorAll('.timeline-item').forEach(item => {
    if (item.querySelector('.timeline-toggle-btn')) return; // already initialised
    const btn = document.createElement('button');
    btn.className = 'timeline-toggle-btn';
    btn.innerHTML = 'Show details <span class="toggle-arrow">&#8595;</span>';
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('expanded');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.innerHTML = open
        ? 'Hide details <span class="toggle-arrow">&#8595;</span>'
        : 'Show details <span class="toggle-arrow">&#8595;</span>';
    });
    const tags = item.querySelector('.timeline-tags');
    if (tags) tags.after(btn);
    else item.querySelector('.timeline-card').appendChild(btn);
  });
}

initTimelineAccordion();
window.addEventListener('resize', () => {
  if (window.innerWidth <= 960) initTimelineAccordion();
});


// ============================================================
// 11. AUTO-SCROLL — WORK CARDS & THOUGHTS (mobile only)
// ============================================================

function initAutoScroll(container, intervalMs) {
  if (!container) return;
  let timer = null;
  let paused = false;

  function getCardWidth() {
    const card = container.firstElementChild;
    if (!card) return 300;
    return card.offsetWidth + parseInt(getComputedStyle(container).gap || '14');
  }

  function step() {
    if (paused) return;
    const max = container.scrollWidth - container.clientWidth;
    if (container.scrollLeft >= max - 4) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
    }
  }

  function start() {
    if (timer) return;
    timer = setInterval(step, intervalMs);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  // Pause on user interaction, resume after 4s idle
  container.addEventListener('touchstart', () => {
    paused = true;
    stop();
  }, { passive: true });

  container.addEventListener('touchend', () => {
    setTimeout(() => {
      paused = false;
      start();
    }, 4000);
  }, { passive: true });

  // Start/stop based on visibility
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? start() : stop());
  }, { threshold: 0.4 });

  observer.observe(container);
}

// Thoughts: snap-based auto-scroll on mobile
if (window.innerWidth <= 600) {
  initAutoScroll(document.querySelector('.thoughts-list'), 3800);
}

// ============================================================
// 12. CONTINUOUS SCROLL — WORK CARDS (mobile only)
// ============================================================

(function () {
  if (window.innerWidth > 600) return;
  const grid = document.querySelector('.work-grid');
  if (!grid) return;

  const SPEED = 0.5; // px per frame — adjust for faster/slower
  let raf = null;
  let paused = false;

  function tick() {
    if (!paused) {
      const max = grid.scrollWidth - grid.clientWidth;
      if (grid.scrollLeft >= max) {
        grid.scrollLeft = 0; // seamless loop
      } else {
        grid.scrollLeft += SPEED;
      }
    }
    raf = requestAnimationFrame(tick);
  }

  // Pause on touch, resume after finger lifts
  grid.addEventListener('touchstart', () => { paused = true; }, { passive: true });
  grid.addEventListener('touchend',   () => {
    setTimeout(() => { paused = false; }, 2000);
  }, { passive: true });

  // Only run while section is visible
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !raf) {
        raf = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    });
  }, { threshold: 0.2 });

  obs.observe(grid);
}());
