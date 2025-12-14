(function () {
  const setYear = () => {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  };

  const bindContactForm = () => {
    const form = document.querySelector("form[data-formspree]");
    if (!form) return;

    const status = form.querySelector(".form-status");

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
        const res = await fetch(`partials/${name}.html`, { cache: "no-cache" });
        if (!res.ok) {
          node.innerHTML = "";
          return;
        }
        node.innerHTML = await res.text();
      })
    );

    // Post-includes hooks
    markActiveNav();
    setYear();
    bindContactForm();
  };

  document.addEventListener("DOMContentLoaded", () => {
    includePartials();
    // Fallback por si una página no usa partials:
    setYear();
    bindContactForm();
  });
})();
