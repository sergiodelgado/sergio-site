# sergio-site

Sitio personal y portafolio técnico de Sergio Delgado.

Integra ingeniería aplicada, infraestructura hidráulica, ciencia de datos,
automatización, IA aplicada, QA técnico y visualización de sistemas complejos.

## Casos principales

- CRBB Pipeline: arquitectura de datos e inteligencia territorial.
- CRBB Participantes: dashboard público con datos anonimizados.
- QA Automation AG RBB: validación técnica y CI/CD.
- Churn Prediction: ciencia de datos aplicada.

## Propósito

`sergio-site` es un sitio estático orientado a:

- mostrar proyectos técnicos reales y casos de estudio;
- publicar lecturas agregadas de ecosistemas culturales sin exponer datos sensibles;
- sostener una presencia profesional sobria, trazable y fácil de revisar;
- documentar decisiones técnicas mínimas sin introducir frameworks innecesarios.

## Stack actual

- **HTML5** para estructura de páginas.
- **CSS3** en `css/styles.css` y `css/crbb-dashboard.css`.
- **JavaScript vanilla** en `js/script.js` y `js/crbb-dashboard.js`.
- **Parciales HTML** en `partials/nav.html` y `partials/footer.html`.
- **JSON público** en `data/` para visualizaciones CRBB.
- **Node.js** solo para tooling de calidad y CI.
- **Vercel** para hosting y previews.

No hay framework frontend ni build step obligatorio para renderizar el sitio.

## Páginas principales

| Página | Propósito |
| --- | --- |
| `index.html` | Home y señal profesional principal |
| `about.html` | Perfil, foco actual y ámbitos de colaboración |
| `projects.html` | Índice de proyectos técnicos y laboratorio conceptual |
| `contact.html` | Formulario de contacto vía Formspree |
| `case-crbb-pipeline.html` | Caso técnico de arquitectura de datos territorial |
| `case-crbb-participantes.html` | Dashboard interactivo CRBB con visualizaciones públicas |

## Data pública CRBB

La página `case-crbb-participantes.html` consume payloads públicos en `data/`:

- `data/modulo_00_participantes_dashboard.json`
- `data/modulo_00_participantes_hybrid_clusters.json`
- `data/modulo_00_activation_opportunities.json`

Estos archivos están pensados para visualización pública segura. No deben
contener RUT, email, teléfono, direcciones ni textos completos sensibles.

## Estructura del repo

```text
.
├── .github/                  # CI, Dependabot y templates
├── css/
│   ├── styles.css
│   └── crbb-dashboard.css
├── data/                     # JSON públicos usados por el dashboard CRBB
├── docs/
│   └── well-architected.md
├── js/
│   ├── script.js
│   └── crbb-dashboard.js
├── partials/
│   ├── nav.html
│   └── footer.html
├── scripts/
│   ├── check-sitemap.mjs
│   └── build_hybrid_clusters_public_payload.py
├── index.html
├── about.html
├── projects.html
├── contact.html
├── case-crbb-pipeline.html
├── case-crbb-participantes.html
├── robots.txt
├── sitemap.xml
├── package.json
└── vercel.json
```

## Uso local

El sitio puede abrirse directamente desde HTML para revisión visual básica:

```bash
start index.html      # Windows
open index.html       # macOS
xdg-open index.html   # Linux
```

Para ejecutar validaciones se requieren dependencias Node ya instaladas o una
instalación aprobada previamente:

```bash
npm run ci:test
```

`npm run ci:test` ejecuta:

- validación HTML con `html-validate`;
- chequeo de `sitemap.xml` mediante `scripts/check-sitemap.mjs`.
- chequeo anti-PII de JSON públicos mediante `scripts/check-public-data-privacy.mjs`.

Chequeo de privacidad independiente:

```bash
npm run check:privacy
```

Auditoría Lighthouse opcional:

```bash
npm run ci:lighthouse
```

En CI, Lighthouse se ejecuta como revisión no bloqueante. No debe tratarse como
gate obligatorio mientras el workflow mantenga `continue-on-error: true`.

## Flujo básico de trabajo

- Trabajar en ramas `codex/<slug>` o ramas descriptivas equivalentes.
- No pushear directo a `main`.
- Hacer cambios pequeños y trazables.
- Ejecutar `npm run ci:test` antes de abrir o actualizar un PR.
- Verificar Vercel Preview verde antes de marcar una tarea como lista.
- No instalar dependencias sin aprobación.
- No modificar data pública, CI, deploy o contenido visible del sitio salvo tarea explícita.

## Documentación relacionada

- `ARCHITECTURE.md`: decisiones de arquitectura.
- `AUDIT.md`: auditoría técnica viva.
- `CONTRIBUTING.md`: flujo de contribución.
- `docs/well-architected.md`: checklist operativo.
- `SECURITY.md`: política de seguridad.

## Licencia

MIT License. Ver `LICENSE`.
