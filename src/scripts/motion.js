/* ---------------------------------------------------------------
   BMES motion layer.

   No animation library. Reveals are plain CSS transitions that this
   file simply switches on when an element enters the viewport, and
   the parallax on media is a CSS scroll-driven animation that runs
   on the compositor without touching JS at all.

   Cross-document View Transitions mean every navigation is a real
   document load, so there is nothing to tear down between pages,
   which is exactly the cleanup problem that bites library-based
   setups on multi-page sites.

   Budget: ~1.5 KB. Everything degrades to "content is visible".
   --------------------------------------------------------------- */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

function revealAll() {
  document.querySelectorAll('[data-reveal], .reveal-lines').forEach((el) => {
    el.classList.add('is-in');
  });
  // A stat stuck on 0 reads as a broken number, so settle those too.
  document.querySelectorAll('[data-count]').forEach((el) => {
    if (el.textContent === '0') el.textContent = formatNum(Number(el.dataset.count));
  });
}

function initReveals() {
  if (reduced.matches) return revealAll();

  const targets = document.querySelectorAll('[data-reveal], .reveal-lines');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) return revealAll();

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );

  targets.forEach((el) => io.observe(el));
}

/* Give staggered children their index so CSS can offset the delay. */
function initStagger() {
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty('--i', String(i));
    });
  });
  document.querySelectorAll('.reveal-lines').forEach((group) => {
    group.querySelectorAll('.line > span').forEach((span, i) => {
      span.style.setProperty('--i', String(i));
    });
  });
}

/* Count-up for the stats band. Values come from data-count. */
function initCounters() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;

  if (reduced.matches || !('IntersectionObserver' in window)) {
    nums.forEach((el) => {
      el.textContent = formatNum(Number(el.dataset.count));
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        run(entry.target);
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.5 },
  );

  nums.forEach((el) => {
    el.textContent = formatNum(0);
    io.observe(el);
  });

  function run(el) {
    const target = Number(el.dataset.count);
    const dur = 1400;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      // easeOutExpo: fast start, long settle
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = formatNum(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

function formatNum(n) {
  // Non-breaking space as the thousands separator, per Latvian convention.
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/* Failsafe. IntersectionObserver does not fire while a tab is hidden,
   and an unexpected error elsewhere could leave elements mid-transition.
   If anything is still hidden after a few seconds of *visible* time,
   just show it. The timer is re-armed on visibility change so a page
   opened in a background tab still animates when it is first seen. */
function armFailsafe() {
  clearTimeout(armFailsafe.t);
  if (document.hidden) return;
  armFailsafe.t = setTimeout(revealAll, 4000);
}

function init() {
  initStagger();
  initReveals();
  initCounters();
  armFailsafe();
  document.addEventListener('visibilitychange', armFailsafe);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

// If the visitor turns reduced-motion on mid-session, stop hiding things.
reduced.addEventListener?.('change', (e) => {
  if (e.matches) revealAll();
});
