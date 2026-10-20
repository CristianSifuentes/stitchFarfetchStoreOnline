// Applies the saved theme (or the system's) before the first paint, so a
// dark visitor never sees the light page flash. It runs from <head> as a
// file, not inline, because the Content-Security-Policy only allows 'self'
// scripts. ThemeService takes over once Angular boots; the storage key
// matches THEME_STORAGE_KEY in src/app/core/theme/theme.model.ts.
(function () {
  var theme = null;
  try {
    theme = localStorage.getItem('vestra.theme.v1');
  } catch (e) {
    // Blocked storage: fall back to the system theme.
  }
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', theme);
})();
