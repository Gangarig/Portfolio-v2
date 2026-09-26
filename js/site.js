(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const updateLabel = () => toggle.setAttribute("aria-label", `Switch to ${root.dataset.theme === "dark" ? "light" : "dark"} theme`);
  toggle.hidden = false;
  updateLabel();
  toggle.addEventListener("click", () => {
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = theme;
    updateLabel();
    try { localStorage.setItem("theme", theme); } catch { /* Keep the in-session choice. */ }
  });
  document.getElementById("year").textContent = new Date().getFullYear();
  const copyButton = document.getElementById("copy-email");
  const status = document.getElementById("copy-toast");
  let messageTimeout;
  if (navigator.clipboard && window.isSecureContext) {
    copyButton.hidden = false;
    copyButton.addEventListener("click", async () => {
      clearTimeout(messageTimeout);
      try {
        await navigator.clipboard.writeText("gangarign@gmail.com");
        status.textContent = "Email address copied.";
      } catch { status.textContent = "Couldn't copy. You can select the address above."; }
      messageTimeout = setTimeout(() => { status.textContent = ""; }, 5000);
    });
  }
})();
