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
// 1. DESIGN RANDOMISATION
// ============================================================

const THEMES = [
  { id: 'dark',  label: 'Dark Mode'          },
  { id: 'blue',  label: 'Blue Tech'          },
  { id: 'warm',  label: 'Warm Professional'  },
  { id: 'green', label: 'Minimalist Green'   },
];

const LAYOUTS = ['left', 'center', 'split'];

const ANIMATIONS = ['slide', 'scale', 'fade'];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const selectedTheme  = pick(THEMES);
const selectedLayout = pick(LAYOUTS);
const selectedAnim   = pick(ANIMATIONS);

// Apply classes to body
document.body.classList.add(
  `theme-${selectedTheme.id}`,
  `layout-${selectedLayout}`,
  `anim-${selectedAnim}`
);

// Brief theme indicator pill
(function showThemeIndicator() {
  const el = document.createElement('div');
  el.className = 'theme-indicator';
  el.setAttribute('aria-hidden', 'true');
  el.textContent = `Theme: ${selectedTheme.label}`;
  document.body.appendChild(el);

  // Fade out after 3 s, remove after 4 s
  setTimeout(() => { el.style.opacity = '0'; }, 3000);
  setTimeout(() => { el.remove(); },            4000);
})();


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

function setMenuOpen(open) {
  navLinks.classList.toggle('open', open);
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
}

navToggle.addEventListener('click', () => {
  setMenuOpen(!navLinks.classList.contains('open'));
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenuOpen(false));
});

// Close menu on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    setMenuOpen(false);
    navToggle.focus();
  }
});


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

const PHRASES = [
  'AI Innovation Leader',
  '30 Under 30 Honoree',
  'Enterprise SaaS Expert',
  'Data-Led Strategist',
  'IIT Kharagpur Alumni',
  'Global Product Leader',
  'AI-First PM',
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
