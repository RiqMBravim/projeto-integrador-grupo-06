(function () {
  const STORAGE_KEY = "tema";
  const TRANSICAO_MS = 420;

  function temaAtual() {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "escuro"
      : "claro";
  }

  function aplicarTema(tema, comAnimacao) {
    const root = document.documentElement;

    if (comAnimacao) {
      root.classList.add("tema-transicao");
    }

    if (tema === "escuro") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }

    localStorage.setItem(STORAGE_KEY, tema);

    const toggle = document.getElementById("temaToggle");
    if (toggle) {
      toggle.checked = tema === "escuro";
    }

    if (comAnimacao) {
      window.setTimeout(() => {
        root.classList.remove("tema-transicao");
      }, TRANSICAO_MS);
    }
  }

  function iniciarToggle() {
    const toggle = document.getElementById("temaToggle");
    if (!toggle) return;

    toggle.checked = temaAtual() === "escuro";

    toggle.addEventListener("change", () => {
      aplicarTema(toggle.checked ? "escuro" : "claro", true);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarToggle);
  } else {
    iniciarToggle();
  }
})();
