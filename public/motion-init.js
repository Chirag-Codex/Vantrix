/**
 * motion-init.js — runs before first paint (CSP: script-src 'self')
 * Sets html[data-motion] from localStorage so aurora starts in the right state.
 * Also applies OS reduced-motion immediately.
 */
(function () {
  try {
    var pref = localStorage.getItem('motion');
    var reducedMQ = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMQ && reducedMQ.matches) {
      document.documentElement.dataset.motion = 'reduce';
    } else if (pref === 'paused') {
      document.documentElement.dataset.motion = 'paused';
    }
    // 'running' is the default; no attribute needed.
  } catch (e) {
    /* ignore */
  }
})();
