# 🌐 sergio-site — Professional Portfolio (Well-Architected)

Repositorio del sitio web personal de **Sergio Delgado**, ingeniero civil industrial
con foco en **QA Automation, Data, CI/CD y transformación digital**.

Este proyecto funciona como un **portafolio técnico profesional**, diseñado y
mantenido bajo principios de **simplicidad, claridad y calidad sostenida**.

---

## 🧭 What is this?

`sergio-site` es un **sitio web estático** (HTML/CSS/JS) que presenta:

- Proyectos técnicos reales (QA, Data, Digital Ops)
- Experiencia en automatización y calidad
- Un laboratorio narrativo/conceptual (**Xexe Quantum**) como diferenciador

El sitio prioriza **señal profesional clara en menos de 60 segundos** para
reclutadores y revisores técnicos.

---

## 🧱 Architecture overview

- **Stack:** HTML + CSS + JavaScript (sin framework)
- **Runtime:** sitio estático
- **Node.js:** solo para tooling de calidad (CI, linting, auditorías)
- **Hosting:** Vercel (deploy automático desde `main`)

Las decisiones de diseño y trade-offs están documentados en:

👉 `ARCHITECTURE.md`

---

## ✅ Quality & Well-Architected baseline

Este repositorio sigue un baseline **Well-Architected** con foco en:

- Simplicidad antes que sofisticación
- Automatización mínima pero efectiva
- Gobernanza visible
- Mejora continua consciente

Checklist y criterios de mantenimiento:

👉 `docs/well-architected.md`

### Automatización incluida

- Validación HTML
- Chequeo de sitemap
- Auditorías Lighthouse
- CI obligatorio en Pull Requests

---

## 🛠️ Tooling & technologies

- **HTML5** — estructura semántica
- **CSS3** — estilos personalizados (dark / minimal)
- **JavaScript Vanilla** — lógica del formulario y carga de parciales
- **Formspree** — backend de contacto
- **GitHub Actions** — CI (quality gates)
- **Vercel** — hosting y deploy automático
- **ChatGPT / Codex** — asistencia en arquitectura, refactor y documentación

---

## 📁 Project structure

~~~text
├── index.html
├── about.html
├── projects.html
├── contact.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── partials/              # nav / footer reutilizables
├── assets/                # imágenes e íconos
├── scripts/               # utilidades (sitemap checks, etc.)
├── docs/                  # checklist Well-Architected
├── .github/workflows/     # CI (quality + Lighthouse)
├── ARCHITECTURE.md
├── AGENTS.md
├── package.json
└── package-lock.json
~~~

---

## ⚙️ Local usage

Este proyecto **no requiere servidor** para ejecutarse.

~~~bash
git clone https://github.com/sergiodelgado/sergio-site.git
cd sergio-site
~~~

Abrir directamente:

~~~bash
start index.html      # Windows
open index.html       # macOS
xdg-open index.html   # Linux
~~~

### Tooling de calidad (opcional)

~~~bash
npm install
npm run ci:test
npm run ci:lighthouse
~~~

Nota sobre Windows (`spawn EPERM`):
- En algunos entornos Windows, `npm run ci:lighthouse` puede fallar localmente al lanzar Chrome en modo headless (`spawn EPERM`).
- El flujo soportado y estable para Lighthouse es CI en GitHub Actions (`ubuntu-latest`), donde se levanta servidor local (`serve . -l 3000`) y se ejecuta LHCI contra `http://localhost:3000`.
- Si aparece `EPERM` local, úsalo como señal de entorno local y valida Lighthouse en el job de CI.

---

## 🤝 Governance & collaboration

Aunque es un proyecto personal, el repositorio incluye:

- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- Templates de Issues y Pull Requests

Esto documenta **cómo trabajo y tomo decisiones**, incluso en contextos individuales.

---

## 🚀 Deployment

- Deploy automático en **Vercel**
- Trigger: push a `main`
- CI obligatorio antes del deploy

🌐 Producción:  
👉 https://sergio-site-drab.vercel.app

---

## 🗺️ Roadmap (alto nivel)

- Baseline Well-Architected ✔
- Arquitectura de contenidos clara ✔
- Métricas explícitas por proyecto (opcional)
- Versión multilenguaje (ES / EN)
- Dominio propio
- Extensiones IA ligeras (bajo criterio)

---

## 📜 License

MIT License  
Ver archivo `LICENSE` para más detalles.
