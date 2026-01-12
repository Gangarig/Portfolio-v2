const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  toggle.textContent = theme === "dark" ? "☀" : "☾";
}

applyTheme(localStorage.getItem("theme") || "light");

toggle.addEventListener("click", () => {
  applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});
