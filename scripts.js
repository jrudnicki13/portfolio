/* ═══════════════════════════════════════════════
   JESSICA RUDNICKI | PORTFOLIO INTERACTIONS
   ═══════════════════════════════════════════════ */

/* ── PAGE TRANSITION FADE ────────────────────── */
document.documentElement.classList.add('page-ready');

document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http') || link.target === '_blank') return;
  e.preventDefault();
  document.documentElement.classList.remove('page-ready');
  setTimeout(() => { window.location.href = href; }, 320);
});

window.addEventListener('pageshow', function(e) {
  if (e.persisted) document.documentElement.classList.add('page-ready');
});

/* ── STAT COUNTERS ───────────────────────────── */
function animateCounter(el) {
  const raw = el.dataset.target || el.textContent.trim();
  const prefix = raw.match(/^[^\d]*/)[0];
  const suffix = raw.match(/[^\d.KMk→:]*$/)[0];
  const text = raw;

  // Handle arrow format: "53K → 93K"
  if (text.includes('→')) {
    const parts = text.split('→').map(s => s.trim());
    el.textContent = text; // already correct, just animate the final value
    const endPart = parts[1];
    const endNum = parseFloat(endPart.replace(/[^0-9.]/g, ''));
    const endSuffix = endPart.replace(/[0-9.]/g, '').trim();
    const startNum = parseFloat(parts[0].replace(/[^0-9.]/g, ''));
    const startSuffix = parts[0].replace(/[0-9.]/g, '').trim();
    let start = null;
    const duration = 1800;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentStart = Math.round(startNum + (endNum - startNum) * 0 * ease);
      const currentEnd = Math.round(startNum + (endNum - startNum) * ease);
      el.textContent = `${Math.round(startNum)}${startSuffix} → ${currentEnd}${endSuffix}`;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = text;
    }
    requestAnimationFrame(step);
    return;
  }

  // Handle time format: "2:36"
  if (text.includes(':')) {
    el.textContent = text;
    return;
  }

  // Handle dollar + number: "$18K"
  const numStr = text.replace(/[^0-9.]/g, '');
  if (!numStr) return;
  const target = parseFloat(numStr);
  const hasK = text.includes('K');
  const hasM = text.includes('M');
  const pre = text.match(/^\D*/)[0];
  const post = text.replace(/^\D*[\d.]+/, '');
  let start = null;
  const duration = 1600;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * ease);
    el.textContent = `${pre}${current}${post}`;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = text;
  }
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = '1';
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(function(el) {
  el.dataset.target = el.textContent.trim();
  statObserver.observe(el);
});


/* ── COPY EMAIL BUTTON ───────────────────────── */
document.querySelectorAll('.copy-email-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    const email = btn.dataset.email || 'jessica.rudnicki@syspro.com';
    navigator.clipboard.writeText(email).then(function() {
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(function() {
        btn.textContent = orig;
        btn.classList.remove('copied');
      }, 2000);
    });
  });
});

/* ── TIMELINE ANIMATION ──────────────────────── */
const timelineObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('tl-visible');
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.tl-item').forEach(function(item, i) {
  item.style.transitionDelay = (i * 120) + 'ms';
  timelineObserver.observe(item);
});

/* ── HORIZONTAL SCROLL GALLERY ───────────────── */
document.querySelectorAll('.h-scroll-track').forEach(function(track) {
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', function(e) {
    isDown = true; track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  track.addEventListener('mouseleave', function() { isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mouseup', function() { isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mousemove', function(e) {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.4;
  });
});

/* ── FADE-IN OBSERVER (existing enhancement) ─── */
const fadeObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-in').forEach(function(el) {
  fadeObserver.observe(el);
});


/* ── RECRUITER POPUP ─────────────────────────── */
(function() {
  var popup   = document.getElementById('recruiterPopup');
  var closeBtn = document.getElementById('recruiterClose');
  if (!popup) return;

  // Don't show again if dismissed this session
  if (sessionStorage.getItem('recruiterPopupDismissed')) return;

  // Slide in after 2.8 seconds
  var showTimer = setTimeout(function() {
    popup.classList.add('popup-visible');
  }, 2800);

  function dismiss() {
    clearTimeout(showTimer);
    popup.classList.remove('popup-visible');
    popup.classList.add('popup-out');
    sessionStorage.setItem('recruiterPopupDismissed', '1');
  }

  if (closeBtn) closeBtn.addEventListener('click', dismiss);

  // Also close if user clicks anywhere outside the popup
  document.addEventListener('click', function(e) {
    if (popup.classList.contains('popup-visible') && !popup.contains(e.target)) {
      dismiss();
    }
  });
})();

/* ── TESTIMONIAL CAROUSELS ───────────────────── */
document.querySelectorAll('.testimonial-carousel').forEach(function(carousel) {
  const slides = Array.from(carousel.querySelectorAll('.testimonial-slide'));
  const dots   = Array.from(carousel.querySelectorAll('.t-dot'));
  let current = 0, timer;

  if (!slides.length) return;

  function goTo(n) {
    slides[current].classList.remove('t-active');
    if (dots[current]) dots[current].classList.remove('t-active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('t-active');
    if (dots[current]) dots[current].classList.add('t-active');
  }

  function start() {
    if (slides.length < 2) return;
    timer = setInterval(function() { goTo(current + 1); }, 5500);
  }

  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() { clearInterval(timer); goTo(i); start(); });
  });

  goTo(0);
  start();
});
