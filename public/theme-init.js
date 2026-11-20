(function () {
  try {
    localStorage.removeItem('theme');
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.colorScheme = 'dark';
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
