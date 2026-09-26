// Apply the saved preference before the page is painted. Storage is optional.
(() => {
  try {
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || theme === "light") document.documentElement.dataset.theme = theme;
  } catch { /* The site remains usable when browser storage is blocked. */ }
})();
