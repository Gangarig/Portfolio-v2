const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  toggle.textContent = theme === "dark" ? "☀" : "☾";
}

const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme || "light");

toggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});
