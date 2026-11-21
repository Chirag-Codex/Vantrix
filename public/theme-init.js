/**
 * theme-init.js — legacy file, now a no-op.
 * The design is light-only. No dark class applied.
 * Motion preference is handled by motion-init.js.
 */
(function () {
  try {
    // Remove any stale dark class / theme attributes
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.colorScheme = 'light';
  } catch (e) {
    /* ignore */
  }
})();
