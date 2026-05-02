(function () {
  // Base path del sitio (p.ej. "/" o "/mi-subpath/"), robusto para Vercel y otros hosts
  const BASE_PATH = (document.querySelector('meta[name="site-base"]')?.content || "/").replace(/\/?$/, "/");

  // Construye URLs absolutas al origen + base (evita problemas de rutas relativas)
  const urlFromBase = (path) => new URL(path.replace(/^\//, ""), location.origin + BASE_PATH).toString();

  const setYear = () => {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  };

  const bindContactForm = () => {
    const form = document.querySelector('form[data-formspree]');
    if (!form) return;

    const status = form.querySelector(".form-status");
    if (!status) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      status.textContent = "";

      const data = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: data,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          form.reset();
          status.textContent = "Gracias, tu mensaje fue enviado.";
        } else {
          status.textContent = "Hubo un error. Intenta de nuevo.";
        }
      } catch (error) {
        status.textContent = "Hubo un error. Intenta de nuevo.";
      }
    });
  };

  const getPageKey = () => {
    const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (file === "" || file === "index.html") return "index";
    if (file === "about.html") return "about";
    if (file === "projects.html") return "projects";
    if (file === "contact.html") return "contact";
    return "";
  };

  const markActiveNav = () => {
    const key = getPageKey();
    if (!key) return;

    const active = document.querySelector(`[data-nav="${key}"]`);
    if (active) active.setAttribute("aria-current", "page");
  };

  const includePartials = async () => {
    const nodes = document.querySelectorAll("[data-include]");
    if (!nodes.length) return;

    await Promise.all(
      Array.from(nodes).map(async (node) => {
        const name = node.getAttribute("data-include");
        if (!name) return;

        const fallbackHtml = node.innerHTML;
        const partialUrl = urlFromBase(`partials/${name}.html`);

        try {
          const res = await fetch(partialUrl, { cache: "no-cache" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          const html = await res.text();
          if (!html.trim()) throw new Error("partial vacio");

          node.innerHTML = html;
        } catch (error) {
          node.innerHTML = fallbackHtml;
        }
      })
    );

    // Post-includes hooks
    markActiveNav();
    setYear();
    bindContactForm();
  };

  document.addEventListener("DOMContentLoaded", () => {
    includePartials();

    // Fallback por si una pagina no usa partials:
    setYear();
    bindContactForm();
  });
})();
