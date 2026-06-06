# Architecture & Design Decisions — sergio-site

Este documento describe las principales decisiones de arquitectura y diseño
tomadas en el proyecto `sergio-site`, junto con su motivación y trade-offs.

El objetivo no es justificar todas las elecciones,
sino hacer explícito **el criterio detrás de ellas**.

---

## 1. Stack tecnológico

### Decisión
Usar **HTML + CSS + JavaScript sin framework**.

### Motivo
- El sitio es estático y de alcance acotado.
- No se requiere estado complejo ni renderizado dinámico.
- Reduce dependencia, complejidad y mantenimiento.

### Trade-offs aceptados
- No hay componentes reactivos avanzados.
- Modularidad lograda mediante parciales HTML y JS liviano.

---

## 2. Uso de Node.js

### Decisión
Usar Node.js **solo como tooling**, no como runtime de la aplicación.

### Motivo
- Permite linting, checks y CI reproducible.
- Mantiene el sitio desacoplado de un backend innecesario.

### Trade-offs aceptados
- Requiere `npm install` para desarrollo local.
- No hay servidor de desarrollo con hot reload (no necesario).

---

## 3. Arquitectura del sitio

### Decisión
Mantener una estructura simple, con archivos en la raíz y
componentes reutilizables mediante `partials/`.

### Motivo
- Facilita comprensión inmediata del proyecto.
- Elimina duplicación (nav / footer).
- Cambios globales controlados desde un solo lugar.

### Trade-offs aceptados
- No hay sistema de templates avanzado.
- Carga de parciales se resuelve en el navegador.

### Alcance actual
- Páginas base: `index.html`, `about.html`, `projects.html`, `contact.html`.
- Casos CRBB: `case-crbb-pipeline.html` y `case-crbb-participantes.html`.
- Mapa operativo completo: `docs/site-technical-map.md`.

---

## 4. Organización por intención (css / js)

### Decisión
Separar estilos y scripts en carpetas dedicadas (`css/`, `js/`).

### Motivo
- Facilitar la ubicación rápida de responsabilidades.
- Reducir carga cognitiva al editar o auditar el proyecto.
- Mantener URLs estables sin introducir build steps.
- Mantener separado el sitio base del dashboard CRBB.

### Trade-offs aceptados
- Requiere actualización explícita de rutas en HTML.
- No existe bundling ni optimización automática (no necesario).

### Alcance actual
- `css/styles.css`: estilos globales del sitio.
- `css/crbb-dashboard.css`: estilos específicos de `case-crbb-participantes.html`.
- `js/script.js`: comportamiento global, parciales, navegación, footer y Formspree.
- `js/crbb-dashboard.js`: carga de data pública CRBB, filtros, tabla, KPIs y gráficos.

---

## 5. Reutilización de layout con parciales HTML

### Decisión
Implementar `nav` y `footer` como parciales HTML cargados vía `fetch` desde
`partials/nav.html` y `partials/footer.html`.

### Motivo
- Eliminar duplicación de markup entre páginas.
- Mantener consistencia visual sin introducir frameworks.
- Preservar arquitectura estática y control total del runtime.

### Trade-offs aceptados
- El contenido se inyecta tras `DOMContentLoaded`.
- Requiere manejo cuidadoso de rutas relativas.

---

## 6. Data pública CRBB

### Decisión
Consumir JSON públicos en `data/` para el dashboard CRBB, sin depender de
fuentes sensibles en runtime.

### Motivo
- Mantener el sitio como estático revisable.
- Separar publicación pública de insumos privados o restringidos.
- Permitir visualización territorial sin exponer PII ni texto sensible completo.

### Trade-offs aceptados
- Los payloads deben regenerarse y revisarse fuera del runtime.
- La seguridad de publicación depende del proceso previo, no solo del frontend.

### Alcance actual
- `data/modulo_00_participantes_dashboard.json`
- `data/modulo_00_participantes_hybrid_clusters.json`
- `data/modulo_00_activation_opportunities.json`

Detalle operativo: `docs/crbb-public-data.md`.

---

## 7. Dependencias externas

### Decisión
Usar dependencias externas solo donde reducen complejidad operativa.

### Motivo
- ECharts vía CDN evita incorporar un build step para el dashboard.
- Formspree resuelve contacto sin backend propio.
- Vercel resuelve hosting, deploys y previews para sitio estático.

### Trade-offs aceptados
- `case-crbb-participantes.html` depende de disponibilidad de CDN para gráficos.
- El formulario depende del endpoint externo de Formspree.
- El estado final de deploy se valida en Vercel Preview.

---

## 8. Calidad y automatización

### Decisión
Implementar CI liviano con validaciones automáticas y Lighthouse como señal
non-blocking.

### Motivo
- Detectar errores temprano (HTML, links, sitemap).
- Mantener calidad constante sin carga manual.
- Alinear el repo con prácticas profesionales reales.

### Trade-offs aceptados
- Checks limitados a lo esencial.
- No se persigue cobertura total ni métricas artificiales.
- Lighthouse puede advertir regresiones sin bloquear mientras el workflow use
  `continue-on-error: true`.

### Alcance actual
- `npm run ci:test`: validación HTML y chequeo de sitemap.
- `.github/workflows/ci.yml`: job `quality` bloqueante y job `lighthouse`
  non-blocking.
- Guía de validación: `docs/qa-deploy.md`.

---

## 9. Gobernanza y colaboración

### Decisión
Incluir archivos de gobernanza y templates
aunque el proyecto sea principalmente individual.

### Motivo
- Documentar el proceso de trabajo.
- Mostrar criterio de colaboración y orden.
- Facilitar contribuciones futuras si ocurren.

### Trade-offs aceptados
- Overhead mínimo de documentación.
- Posible infrautilización en el corto plazo.

---

## Principio rector

Todas las decisiones anteriores están guiadas por un único principio:

> **Keep it Simple**  
> Resolver el problema actual con la menor complejidad posible,
> manteniendo claridad, trazabilidad y calidad sostenida.

Si una decisión deja de cumplir este principio,
debe revisarse o revertirse.

---

## Estado

Este documento refleja el estado del proyecto
al cierre de la versión **Well-Architected Baseline v1.0**.
