# Auditoría técnica del sitio

Auditoría viva del repositorio `sergio-site`.

## Alcance

Se revisa el estado actual del código fuente mantenido en el repo, excluyendo
dependencias generadas como `node_modules/`.

Archivos y áreas cubiertas:

- HTML:
  - `index.html`
  - `about.html`
  - `projects.html`
  - `contact.html`
  - `case-crbb-pipeline.html`
  - `case-crbb-participantes.html`
- CSS:
  - `css/styles.css`
  - `css/crbb-dashboard.css`
- JavaScript:
  - `js/script.js`
  - `js/crbb-dashboard.js`
- Parciales:
  - `partials/nav.html`
  - `partials/footer.html`
- Data pública:
  - `data/modulo_00_participantes_dashboard.json`
  - `data/modulo_00_participantes_hybrid_clusters.json`
  - `data/modulo_00_activation_opportunities.json`
- Tooling y configuración:
  - `package.json`
  - `package-lock.json`
  - `lighthouserc.json`
  - `scripts/check-sitemap.mjs`
  - `.github/workflows/ci.yml`
  - `robots.txt`
  - `sitemap.xml`

No se audita `data/raw`.

## Estado validado

Validación local confirmada:

```bash
npm run ci:test
```

Resultado: pasa correctamente.

El comando ejecuta validación HTML, chequeo de sitemap y validación anti-PII de
JSON públicos. En el estado actual, no hay deuda vigente asociada a fechas
futuras en `<lastmod>`.

## Estado actual

### Stack

- Sitio estático con HTML, CSS y JavaScript vanilla.
- Sin framework frontend.
- Node.js se usa solo para tooling de calidad y CI.
- Vercel se usa para deploy y previews.

### HTML

- Las páginas principales están en la raíz.
- El sitio incluye cuatro páginas base y dos casos CRBB.
- `case-crbb-pipeline.html` documenta un caso técnico de arquitectura de datos territorial.
- `case-crbb-participantes.html` contiene un dashboard interactivo CRBB.
- Las páginas usan metadatos SEO básicos y canonical.
- La navegación y el footer se resuelven con parciales y fallback HTML embebido.

### CSS

- `css/styles.css` contiene estilos globales del sitio.
- `css/crbb-dashboard.css` contiene estilos específicos del dashboard CRBB.
- La separación por intención es coherente con el tamaño actual del proyecto.

### JavaScript

- `js/script.js` gestiona:
  - carga de parciales con `fetch`;
  - estado activo de navegación;
  - año dinámico del footer;
  - envío del formulario Formspree.
- `js/crbb-dashboard.js` gestiona:
  - carga de JSON públicos CRBB;
  - filtros y tabla de participantes;
  - gráficos con ECharts;
  - segmentación híbrida;
  - oportunidades de activación de redes.

### Data pública CRBB

Los JSON en `data/` se usan para visualización pública y agregada. El diseño
actual evita exponer RUT, email, teléfono y texto completo sensible. Esta regla
queda mitigada parcialmente por `npm run check:privacy`, pero debe mantenerse
con revisión humana si se regeneran payloads.

### Tooling y CI

- `npm run ci:test` valida HTML, sitemap y privacidad mínima de JSON públicos.
- `npm run ci:lighthouse` ejecuta Lighthouse CI.
- En `.github/workflows/ci.yml`, Lighthouse está configurado como non-blocking
  mediante `continue-on-error: true`.
- El sitemap actual pasa el chequeo local.

## Deuda resuelta

- La deuda previa sobre `<lastmod>2025-12-01` como fecha futura ya no aplica al
  estado actual validado por `npm run ci:test`.
- El sitio ya no depende de una única hoja o un único script: el dashboard CRBB
  tiene CSS y JS propios.

## Riesgos y deuda vigente

| Prioridad | Área | Riesgo |
| --- | --- | --- |
| P1 | Documentación | La arquitectura del dashboard CRBB y la data pública aún no están documentadas en detalle. |
| P2 | Privacidad | La exclusión de PII queda mitigada parcialmente por `npm run check:privacy`, pero la regeneración de JSON públicos aún requiere revisión humana. |
| P2 | Frontend | `case-crbb-participantes.html` depende de ECharts desde CDN externo. |
| P2 | Operación | Formspree y Vercel son dependencias externas operativas para contacto, hosting y previews. |
| P2 | QA | Lighthouse es informativo/non-blocking; puede advertir regresiones sin bloquear PR. |
| P3 | Performance | No hay minificación ni cache busting de CSS/JS; aceptable por el tamaño actual. |

## Recomendaciones

- Documentar en Fase 2 el mapa técnico del sitio, especialmente el dashboard CRBB.
- Crear o ampliar documentación sobre data pública: origen derivado, privacidad,
  payloads permitidos y criterios de regeneración.
- Mantener `npm run ci:test` como gate local mínimo antes de PR, incluyendo el
  chequeo anti-PII de `data/*.json`.
- Tratar Lighthouse como señal de revisión mientras siga configurado como
  non-blocking.
- No introducir build step ni framework mientras el sitio siga siendo estático y
  mantenible con HTML/CSS/JS vanilla.

## Conclusión

El repo está en buen estado técnico para un sitio estático sin framework. La
validación mínima pasa y la deuda crítica actual es principalmente documental:
explicar mejor el dashboard CRBB, los payloads públicos y el flujo operativo de
QA/deploy.
