/**
 * Kontra AI - Interactive Logic & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initScrollTextReveal();
  initTestimonialsSlider();
  initFaqAccordion();
  initBackToTop();
  highlightActiveNavLink();
});

/* ==========================================================================
   1. Header Sticky & Mobile Menu
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.mobile-toggle');
  const overlay = document.querySelector('.mobile-menu-overlay');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (toggle && overlay) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle.classList.toggle('open');
      overlay.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (overlay.classList.contains('show') && !overlay.contains(e.target) && !toggle.contains(e.target)) {
        toggle.classList.remove('open');
        overlay.classList.remove('show');
      }
    });

    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        overlay.classList.remove('show');
      });
    });
  }
}

/* ==========================================================================
   2. Scroll-Linked Text Fill Reveal Animation
   ========================================================================== */
function initScrollTextReveal() {
  const container = document.querySelector('.scroll-reveal-text');
  if (!container) return;

  // Split text into individual span words if not already split
  const originalText = container.textContent.trim();
  const words = originalText.split(/\s+/);
  container.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');

  const wordSpans = container.querySelectorAll('.word');

  function updateReveal() {
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate progress through viewport
    // Starts revealing when top of container hits 75% of viewport, finishes when it reaches 25%
    const startY = windowHeight * 0.75;
    const endY = windowHeight * 0.25;

    const progress = Math.min(Math.max((startY - rect.top) / (startY - endY), 0), 1);
    const wordsToFill = Math.floor(progress * wordSpans.length);

    wordSpans.forEach((span, index) => {
      if (index <= wordsToFill) {
        span.classList.add('filled');
      } else {
        span.classList.remove('filled');
      }
    });
  }

  window.addEventListener('scroll', updateReveal, { passive: true });
  window.addEventListener('resize', updateReveal, { passive: true });
  updateReveal();
}

/* ==========================================================================
   3. Testimonials Carousel Slider
   ========================================================================== */
function initTestimonialsSlider() {
  const track = document.querySelector('.testimonials-track');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  const cards = document.querySelectorAll('.testimonial-card');

  if (!track || cards.length === 0 || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  function getVisibleCardsCount() {
    return window.innerWidth < 810 ? 1 : 2;
  }

  function getMaxIndex() {
    const visible = getVisibleCardsCount();
    return Math.max(0, cards.length - visible);
  }

  function updateSlider() {
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const cardWidth = cards[0].offsetWidth;
    const gap = 24;
    const offset = currentIndex * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < getMaxIndex()) {
      currentIndex++;
      updateSlider();
    }
  });

  window.addEventListener('resize', updateSlider, { passive: true });
  updateSlider();
}

/* ==========================================================================
   4. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      items.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. Active Nav Link
   ========================================================================== */
function highlightActiveNavLink() {
  const path = window.location.pathname.toLowerCase();
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('#')[0].toLowerCase();
    
    if ((path === '/' || path === '/index.html' || path === '') && (linkPath === '/' || linkPath === './' || linkPath === 'index.html')) {
      link.classList.add('active');
    } else if (linkPath && path.includes(linkPath.replace('.html', '')) && linkPath !== '/' && linkPath !== './') {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   6. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
