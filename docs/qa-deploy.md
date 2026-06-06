# QA y deploy
Guia breve para validar cambios antes de abrir, actualizar o cerrar un PR.
## Alcance
Aplica al sitio estatico `sergio-site` y a su flujo actual de CI/Vercel.
No reemplaza una revision funcional del contenido visible cuando una tarea
modifica HTML, CSS, JavaScript o data publica.
## Validacion local minima
Antes de entregar una tarea:
```bash
git status --short --branch
npm run ci:test
git diff --stat
```
`npm run ci:test` es el gate local minimo.
## Que ejecuta `npm run ci:test`
Definicion actual en `package.json`:
```bash
npm run lint:html && npm run check:sitemap && npm run check:privacy
```
`npm run lint:html` valida:
- `index.html`
- `about.html`
- `projects.html`
- `contact.html`
- `case-crbb-pipeline.html`
- `case-crbb-participantes.html`
`npm run check:sitemap` ejecuta:
```bash
node scripts/check-sitemap.mjs
```
Ese script valida que `sitemap.xml`:
- exista;
- contenga etiquetas `<lastmod>`;
- no tenga fechas futuras o invalidas.
`npm run check:privacy` ejecuta:
```bash
node scripts/check-public-data-privacy.mjs
```
Ese script revisa solo `data/*.json` y falla ante PII evidente o claves
prohibidas de identificacion en los payloads publicos.
## Revision Git
Usar:
```bash
git status --short --branch
git diff --stat
```
Cuando corresponda, revisar tambien el diff especifico:
```bash
git diff -- <archivo>
```
Criterio:
- la rama no debe ser `main`;
- los archivos modificados deben coincidir con el alcance de la tarea;
- no debe haber cambios accidentales en HTML, CSS, JS, data o configuracion;
- no se debe incluir ruido de formato.
## CI
Workflow detectado:
```text
.github/workflows/ci.yml
```
Se ejecuta en:
- push a `main`;
- pull request hacia `main`.
Jobs actuales:
- `quality`
- `lighthouse`
`quality` usa Node 22, instala con `npm ci` y ejecuta:
```bash
npm run ci:test
```
Este job es bloqueante para la calidad minima.
## Lighthouse
Comando disponible:
```bash
npm run ci:lighthouse
```
Configuracion detectada:
```text
lighthouserc.json
```
El workflow ejecuta Lighthouse en el job `lighthouse` con:
```yaml
continue-on-error: true
```
Por lo tanto, Lighthouse es una senal de revision no bloqueante mientras esa
configuracion se mantenga. Sus advertencias deben revisarse, pero no bloquean
por si solas el merge.
## Revision local opcional
Para levantar el sitio:
```bash
npm run dev
```
El comando usa `serve` mediante `npx --yes`.
Revisar manualmente las paginas afectadas. Para cambios globales, revisar al
menos:
- `/`
- `/about.html`
- `/projects.html`
- `/contact.html`
- `/case-crbb-pipeline.html`
- `/case-crbb-participantes.html`
## Criterio para PR
Cada PR debe incluir:
- titulo semantico;
- checklist de aceptacion;
- lista de archivos modificados;
- diff-resumen;
- resultado de `npm run ci:test`;
- estado de Vercel Preview.
El PR debe apuntar a `main`, pero no se debe pushear directo a `main`.
## Vercel Preview
Criterio operativo:
- abrir o actualizar PR;
- esperar Preview de Vercel;
- verificar que el deploy compile correctamente;
- revisar paginas afectadas en la URL de Preview;
- no marcar la tarea como lista si la Preview esta fallando.
`vercel.json` solo define headers globales. No se detecta build custom.
## Antes de merge
Checklist minimo:
- Rama de trabajo distinta de `main`.
- `npm run ci:test` pasa localmente.
- `git diff --stat` coincide con el alcance.
- CI `quality` verde.
- Lighthouse revisado como non-blocking si reporta advertencias.
- Vercel Preview verde.
- No hay archivos fuera de alcance.
- No hay cambios accidentales en dependencias o workflows.
- El PR documenta validacion y archivos modificados.
## Cierre de tarea documental
Para tareas que solo crean o editan documentacion:
- no modificar contenido visible del sitio;
- no modificar data publica;
- no modificar configuracion;
- no instalar dependencias;
- ejecutar `npm run ci:test`;
- dejar el repo sin cambios no explicados.
