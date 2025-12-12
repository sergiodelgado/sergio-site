(function() {
  const setYear = () => {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  };

  const bindContactForm = () => {
    const form = document.querySelector('form[data-formspree]');
    if (!form) return;

    const status = form.querySelector('.form-status');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.textContent = '';

      const data = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.reset();
          status.textContent = 'Gracias, tu mensaje fue enviado.';
        } else {
          status.textContent = 'Hubo un error. Intenta de nuevo.';
        }
      } catch (error) {
        status.textContent = 'Hubo un error. Intenta de nuevo.';
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    setYear();
    bindContactForm();
  });
})();
