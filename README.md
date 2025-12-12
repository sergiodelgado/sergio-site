# 🌐 Sergio Site — Portafolio Profesional 2025

Sitio web personal de **Sergio Delgado**, ingeniero civil industrial con foco en transformación digital, automatización, ciencia de datos y gobernanza cultural.  
Este proyecto funciona como mi portafolio técnico y creativo, integrando ingeniería, narrativa techno y sistemas vinculados a AG RBB.

---

## 🧭 Descripción general

Este sitio es un **portfolio estático optimizado y mantenible**, orientado a claridad, bajo acoplamiento y facilidad de despliegue.  
Reúne mi identidad profesional, proyectos estratégicos, investigación creativa y líneas de trabajo actuales como **QA Automation**, **DevOps**, **Data Science**, **transformación con IA** y el universo narrativo **Xexe Quantum**.

El desarrollo y la evolución del proyecto cuentan con apoyo de **ChatGPT 5.1 (Auto / Thinking)** y **Codex** como herramientas de asistencia para:

- refactor de HTML/CSS/JS  
- revisión de buenas prácticas SEO y accesibilidad  
- arquitectura simple y escalable  
- documentación técnica y narrativa  
- automatización del flujo de desarrollo  

---

## 🚀 Características principales

- **Páginas base:**  
  `index.html`, `about.html`, `projects.html`, `contact.html`
- **Diseño:**  
  minimalista, oscuro, responsivo, sin frameworks innecesarios
- **Accesibilidad:**  
  navegación clara, patrón válido de `label` envolvente, `aria-current`
- **Formulario funcional:**  
  conectado a **Formspree**
- **JS modular:**  
  `script.js` centraliza lógica del formulario y utilidades
- **SEO básico:**  
  meta descriptions, `robots.txt`, `sitemap.xml` (estructura OK)
- **CI + Deploy automático:**  
  validaciones y auditorías en GitHub Actions, despliegue automático en Vercel

---

## 🛠️ Tecnologías utilizadas

- **HTML5**: estructura semántica
- **CSS3**: estilos personalizados oscuros (`styles.css`)
- **JavaScript Vanilla**: lógica del formulario y utilidades
- **Formspree**: backend de contacto sin servidor propio
- **GitHub Actions**: validaciones y auditorías (CI)
- **Vercel**: hosting estático y despliegue automático
- **ChatGPT / Codex**: soporte para desarrollo, arquitectura y contenido

---

## 📦 Estructura del proyecto

~~~bash
├── index.html
├── about.html
├── projects.html
├── contact.html
├── styles.css
├── script.js
├── robots.txt
├── sitemap.xml
├── scripts/                 # utilidades (validación sitemap, etc.)
├── .github/workflows/       # CI (validaciones + Lighthouse)
├── package.json
└── package-lock.json
~~~

---

## ⚙️ Reglas de contribución con Codex y agentes

El flujo de trabajo asistido por IA se documenta en  
👉 `AGENTS.md`

Incluye:

- reglas para prompts estructurados  
- cómo invocar auditorías técnicas  
- cómo generar refactors seguros  

---

## 🚀 Deploy

El sitio se valida mediante **GitHub Actions** y se despliega automáticamente en **Vercel** con cada push a `main`.

Versión de producción:

👉 https://sergio-site-drab.vercel.app

### Ejecución local

~~~bash
git clone https://github.com/sergiodelgado/sergio-site.git
cd sergio-site

start index.html      # Windows
open index.html       # macOS
xdg-open index.html   # Linux
~~~

---

## 🗺️ Roadmap 2025

- Refactor general HTML/CSS/JS ✔
- Accesibilidad mínima (labels, aria-current) ✔
- SEO básico + sitemap (estructura OK, ajuste `lastmod` pendiente)
- Minificación automática de CSS/JS (opcional)
- Panel simple de analíticas
- Versión multilenguaje (ES/EN)
- Contenido dinámico (blog o micro-apps con APIs)
- Dominio propio: sergiodelgado.com
- Integraciones IA ligeras (resumen de proyectos, generador narrativo)

---

## 🌐 Presencia & Contacto

Sitio web: https://sergio-site-drab.vercel.app  
LinkedIn: https://cl.linkedin.com/in/sergiodelgadom  
Medium: https://medium.com/@sergiodelgadom  
GitHub: https://github.com/sergiodelgado  

Formulario de contacto:  
👉 `/contact.html`

---

## 📜 Licencia

Proyecto bajo licencia MIT.  
Consulta el archivo `LICENSE` para más detalles.

