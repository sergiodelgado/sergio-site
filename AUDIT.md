# Auditoría técnica del sitio

## 1. Exploración del repositorio
- **Carpetas**: solo la raíz del proyecto (sin subdirectorios).
- **Archivos relevantes**: `index.html`, `about.html`, `projects.html`, `contact.html`, `styles.css`, `script.js`, `robots.txt`, `sitemap.xml`, `README.md`, `AGENTS.md`.
- **Extensiones encontradas**: `.html`, `.css`, `.js`, `.txt`, `.xml`, `.md`.
- **Dependencias/recursos externos**: Google Fonts (Inter) en todas las páginas; uso de Formspree (`https://formspree.io/f/mzzjzlyy`) en `contact.html`. No frameworks ni build tools.
- **Posibles archivos/estilos sin uso**: clase `.muted` declarada en `styles.css` sin referencia en HTML; `script.js` solo actualiza el año y carece de salto de línea final.

## 2. Arquitectura actual
- Stack: sitio estático HTML5 + CSS3 + JavaScript vanilla, sin empaquetador. Hosting esperado en Vercel.
- Buenas prácticas básicas:
  - Estructura: archivos por página, CSS y JS compartidos, navegación coherente.
  - Accesibilidad: uso parcial de `aria-label` en enlaces sociales; falta de `lang` ya configurado (`es`). Formularios usan `label` asociado por contenedor pero sin `for`/`id` explícitos.
  - SEO: títulos y meta descripciones por página, `robots.txt` y `sitemap.xml` presentes; fechas de `lastmod` futuras (2025-10-18) pueden ser inconsistentes.
  - Seguridad: enlaces externos con `rel="noopener noreferrer"` excepto redes en `index.html` (placeholder `#`); script inline en `contact.html` evita CSP estricta.

## 3. Mapa de funcionalidades
- Páginas: `index.html` (hero y tarjetas), `about.html` (bio), `projects.html` (tarjetas de proyectos), `contact.html` (formulario).
- Formulario de contacto: `contact.html` envía a Formspree mediante `fetch` asincrónico; reemplaza el contenido del formulario con mensaje de éxito o error.
- Scripts por página: `script.js` en todas para actualizar año del footer; `contact.html` incluye script inline adicional para manejar envío del formulario.

## 4. Diagnóstico de calidad
- HTML: semántica básica correcta (`header`, `main`, `footer`); falta de atributos `alt` en futuros assets, navegación sin resaltar foco, enlaces sociales de `index.html` apuntan a `#`. Falta `for`/`id` en inputs.
- CSS: hoja única con variables; selector `.muted` no se usa; podría modularse por página; no hay reset de enfoque para accesibilidad; mix de unidades coherente.
- JS: `script.js` minimal y sin modularidad; `contact.html` tiene JS inline sin manejo de errores detallado ni estados de carga; no hay validación adicional.
- Performance estimada: sitio ligero (sin imágenes ni bundles). Google Fonts carga externa; falta `preload`/`font-display`. CSS/JS sin minificar pero pequeños; no hay cache busting.

## 5. Checklist del estado actual
- **Bien**: estructura simple por página; meta descripciones; sitemap y robots presentes; uso de `rel="noopener noreferrer"` en la mayoría de enlaces externos; formulario con `fetch` y estado de usuario.
- **Mal o incompleto**: enlaces sociales del home apuntan a `#`; fechas de `lastmod` futuras; script inline que complica CSP; falta `for`/`id` en inputs; `.muted` sin uso; `script.js` sin newline final.
- **Obsoleto**: sin elementos claramente obsoletos, pero sitemap con fechas futuras es cuestionable.
- **A reescribir/migrar**: mover JS inline a archivo externo; normalizar enlaces sociales reales; revisar accesibilidad del formulario; considerar modularización de estilos y minificación ligera.

## 6. ENTREGAR A CHATGPT 5.1
- Stack: HTML5 + CSS3 + JS vanilla; sin bundler; fuentes desde Google Fonts; Formspree para contacto.
- Archivos clave: `index.html`, `about.html`, `projects.html`, `contact.html`, `styles.css`, `script.js`, `robots.txt`, `sitemap.xml`, `README.md`, `AGENTS.md`.
- Hallazgos: enlaces sociales en `index.html` usan `#`; `contact.html` incluye JS inline para Formspree; inputs sin `for`/`id`; `.muted` no se usa; `lastmod` del sitemap en 2025-10-18 (futuro); `script.js` solo actualiza año y carece de salto de línea final.
