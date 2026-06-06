# Mapa tecnico del sitio
Documento operativo para ubicar la estructura real de `sergio-site` y sus
dependencias internas.
## Proposito
`sergio-site` es un sitio estatico personal y profesional de Sergio Delgado.
Funciona como portafolio tecnico, memoria publica de proyectos y laboratorio
liviano para casos de datos, automatizacion, QA, arquitectura de informacion e
inteligencia territorial.
El sitio prioriza:
- HTML/CSS/JavaScript directo.
- Carga publica revisable.
- Documentacion minima y trazable.
- Visualizaciones con datos CRBB publicos y no sensibles.
- Deploy simple en Vercel.
## Limites del stack
- No hay framework frontend.
- No hay build obligatorio para renderizar paginas.
- No hay bundler detectado.
- No hay TypeScript detectado.
- No hay backend propio detectado.
- Node.js se usa para tooling de calidad y CI.
- Las paginas se sirven como archivos HTML estaticos.
- El JavaScript del sitio es vanilla.
## Paginas HTML
| Archivo | Rol operativo |
| --- | --- |
| `index.html` | Home del sitio y entrada profesional principal. |
| `about.html` | Perfil, foco de trabajo y ambitos de colaboracion. |
| `projects.html` | Indice de proyectos tecnicos y casos publicados. |
| `contact.html` | Formulario de contacto con envio a Formspree. |
| `case-crbb-pipeline.html` | Caso documental sobre arquitectura de datos territorial. |
| `case-crbb-participantes.html` | Dashboard interactivo CRBB con visualizaciones publicas. |
Todas las paginas principales cargan `css/styles.css` y `js/script.js`.
`case-crbb-participantes.html` agrega CSS y JS especificos del dashboard.
## CSS
| Archivo | Uso |
| --- | --- |
| `css/styles.css` | Estilos globales: layout, navegacion, cards, formularios, tipografia, responsive y patrones comunes. |
| `css/crbb-dashboard.css` | Estilos especificos del dashboard CRBB: KPIs, filtros, tabla, paneles, visualizaciones y secciones analiticas. |
La separacion actual es por alcance:
- `styles.css` cubre el sitio base.
- `crbb-dashboard.css` queda acotado a `case-crbb-participantes.html`.
- No existe un paso de compilacion CSS.
## JavaScript
| Archivo | Uso |
| --- | --- |
| `js/script.js` | Comportamiento global del sitio. |
| `js/crbb-dashboard.js` | Carga, normalizacion y visualizacion del dashboard CRBB. |
`js/script.js` gestiona:
- calculo de `BASE_PATH` desde `meta[name="site-base"]` o `/`;
- carga de parciales desde `partials/`;
- fallback embebido si falla la carga de parciales;
- marcado de navegacion activa;
- actualizacion del ano en footer;
- envio del formulario `data-formspree` mediante `fetch`.
`js/crbb-dashboard.js` gestiona:
- carga de tres payloads JSON publicos en `data/`;
- normalizacion de filas de participantes;
- filtros por region, motivacion, perfil y area;
- tabla paginada y panel de detalle;
- KPIs y graficos con ECharts;
- fallback visual si ECharts no carga;
- seccion de segmentacion hibrida;
- seccion de oportunidades de activacion.
## Librerias externas en frontend
Detectado en `case-crbb-participantes.html`:
- ECharts `5.5.0` via CDN jsDelivr.
Detectado en paginas HTML:
- Google Fonts para Inter.
- Formspree como endpoint externo del formulario de contacto.
No hay dependencias frontend instaladas para empaquetado.
## Parciales
| Archivo | Contenido |
| --- | --- |
| `partials/nav.html` | Skip link y navegacion principal. |
| `partials/footer.html` | Footer con ano dinamico. |
Las paginas incluyen fallback HTML embebido para navegacion y footer. Luego
`js/script.js` intenta reemplazar esos bloques con `fetch` desde `partials/`.
Si la carga falla, se conserva el fallback local de cada pagina.
## Data publica CRBB
`case-crbb-participantes.html` consume estos archivos:
| Archivo | Uso en frontend |
| --- | --- |
| `data/modulo_00_participantes_dashboard.json` | Base principal del dashboard: KPIs, resumen, distribuciones y `observed_data.table_rows`. |
| `data/modulo_00_participantes_hybrid_clusters.json` | Segmentacion hibrida, metricas de clusters, composicion y puntos anonimizados. |
| `data/modulo_00_activation_opportunities.json` | Oportunidades publicas de activacion y matriz operativa. |
El frontend espera datos publicos, agregados, derivados o seguros. No debe
depender de fuentes sensibles en runtime.
## Scripts
| Archivo | Proposito |
| --- | --- |
| `scripts/check-sitemap.mjs` | Valida que `sitemap.xml` exista, tenga `<lastmod>` y no use fechas futuras. |
| `scripts/build_hybrid_clusters_public_payload.py` | Genera `data/modulo_00_participantes_hybrid_clusters.json` desde salidas analiticas de clustering hibrido. |
`scripts/check-sitemap.mjs` se ejecuta dentro de `npm run ci:test`.
`scripts/build_hybrid_clusters_public_payload.py` acepta:
- `--input-dir` para indicar la carpeta de insumos analiticos;
- `--output` para escribir el JSON publico de segmentacion hibrida.
El script Python no se ejecuta como parte de CI.
## Tooling Node
Scripts definidos en `package.json`:
| Comando | Funcion |
| --- | --- |
| `npm run dev` | Sirve el sitio estatico con `serve`. |
| `npm run lint:html` | Valida los seis HTML principales con `html-validate`. |
| `npm run check:sitemap` | Ejecuta `scripts/check-sitemap.mjs`. |
| `npm run ci:test` | Ejecuta HTML validate y chequeo de sitemap. |
| `npm run ci:lighthouse` | Ejecuta Lighthouse CI. |
Dependencias de desarrollo detectadas:
- `html-validate`
- `@lhci/cli`
## CI
Workflow detectado: `.github/workflows/ci.yml`.
Se ejecuta en:
- push a `main`;
- pull request hacia `main`.
Jobs:
- `quality`: Node 22, `npm ci`, `npm run ci:test`.
- `lighthouse`: Node 20, `npm ci`, `npm run ci:lighthouse`.
El job `lighthouse` depende de `quality`. La ejecucion de Lighthouse esta
configurada con `continue-on-error: true`; por lo tanto es senal de revision y
no gate bloqueante mientras esa configuracion se mantenga.
## Lighthouse
Configuracion detectada: `lighthouserc.json`.
URLs evaluadas:
- `/`
- `/about.html`
- `/projects.html`
- `/contact.html`
- `/case-crbb-pipeline.html`
- `/case-crbb-participantes.html`
El servidor local para Lighthouse se levanta con:
```bash
npx --yes serve . -l 3000
```
Las aserciones actuales generan advertencias para performance, accesibilidad y
SEO. No bloquean CI por configuracion del workflow.
## Vercel
Configuracion detectada: `vercel.json`.
Headers globales configurados:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
No se detecta configuracion de build custom en `vercel.json`.
## Sitemap y robots
Archivos detectados:
- `sitemap.xml`
- `robots.txt`
`sitemap.xml` lista las seis paginas HTML principales y usa `lastmod`.
`robots.txt` permite indexacion general y apunta al sitemap publicado.
El chequeo operativo del sitemap es:
```bash
npm run check:sitemap
```
## Operacion minima
Antes de abrir o actualizar un PR:
```bash
git status --short --branch
npm run ci:test
git diff --stat
```
Para revision visual local:
```bash
npm run dev
```
Para Lighthouse local:
```bash
npm run ci:lighthouse
```
## Reglas de mantenimiento
- Mantener el sitio estatico mientras el alcance siga siendo acotado.
- No introducir framework sin necesidad tecnica explicita.
- No mover logica CRBB fuera de `js/crbb-dashboard.js` sin una razon operativa.
- No mezclar cambios de contenido visible, data, tooling y documentacion en una misma tarea si no es necesario.
- Mantener los payloads publicos CRBB sin PII ni texto sensible completo.
