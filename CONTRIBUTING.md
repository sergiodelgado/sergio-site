# CONTRIBUTING

Guía operativa para mantener coherencia y calidad en `sergio-site`.

## Principios

- Mantener el sitio estático, ligero y sin framework.
- Preferir cambios pequeños, revisables y trazables.
- No modificar contenido visible del sitio salvo que la tarea lo pida.
- No tocar `data/*.json` sin justificación explícita.
- No instalar dependencias sin aprobación.
- No modificar CI, sitemap o configuración de Vercel salvo tarea explícita.
- Cuidar accesibilidad, SEO básico y privacidad de data pública.

## Estructura actual

```text
.
├── .github/                  # CI, Dependabot y templates
├── css/
│   ├── styles.css
│   └── crbb-dashboard.css
├── data/                     # JSON públicos CRBB
├── docs/
├── js/
│   ├── script.js
│   └── crbb-dashboard.js
├── partials/
│   ├── nav.html
│   └── footer.html
├── scripts/
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

No existe carpeta `assets/` en el estado actual.

## Flujo de trabajo

### 1. Revisar estado

```bash
git status --short --branch
```

### 2. Crear rama de trabajo

No trabajar directo sobre `main`.

```bash
git checkout -b codex/<slug>
```

Usar un `<slug>` corto y descriptivo, por ejemplo:

```bash
git checkout -b codex/docs-fase-1
```

### 3. Aplicar cambios acotados

- Tocar solo los archivos definidos por la tarea.
- Respetar la indentación existente.
- No reformatear archivos completos sin necesidad.
- Separar cambios de documentación, análisis, visualización, data y configuración.
- Mantener trazabilidad entre input, proceso y output cuando haya data involucrada.

### 4. Validar

Antes de abrir o actualizar un PR:

```bash
npm run ci:test
```

Este comando valida HTML y `sitemap.xml`.

Lighthouse puede ejecutarse como revisión adicional:

```bash
npm run ci:lighthouse
```

En CI, Lighthouse es non-blocking. Sus resultados sirven como señal de revisión,
no como bloqueo obligatorio mientras el workflow mantenga esa configuración.

### 5. Pull Request

Cada PR debe incluir:

- título semántico;
- checklist de aceptación;
- lista de archivos modificados;
- resumen del diff;
- resultado de `npm run ci:test`;
- estado de Vercel Preview.

No marcar una tarea como lista hasta revisar que Vercel Preview esté verde.

## Reglas por tipo de archivo

### HTML

- Mantener HTML semántico.
- Usar indentación de 2 espacios.
- No introducir JavaScript inline.
- No cambiar contenido visible sin tarea explícita.

### CSS

- Usar patrones existentes.
- `css/styles.css` es global.
- `css/crbb-dashboard.css` es específico del dashboard CRBB.
- No crear nuevos archivos CSS sin justificarlo.

### JavaScript

- Mantener JavaScript vanilla.
- `js/script.js` contiene comportamiento global.
- `js/crbb-dashboard.js` contiene lógica del dashboard CRBB.
- No agregar librerías sin aprobación.

### Data pública

- No editar `data/*.json` sin justificación explícita.
- No publicar RUT, email, teléfono, direcciones ni texto sensible completo.
- Si se regenera data pública, documentar fuente derivada, proceso y validación.

### Documentación

- Mantener documentación útil, sobria y mantenible.
- Actualizar README o auditoría cuando cambien estructura, comandos o arquitectura.
- Evitar duplicar detalle técnico en varios documentos.

## Comandos útiles

```bash
git status --short --branch
npm run ci:test
git diff --stat
git diff -- README.md AUDIT.md CONTRIBUTING.md
```

## Criterio de cierre

Una tarea documental queda lista cuando:

- solo toca los archivos permitidos;
- `npm run ci:test` pasa;
- el diff es revisable;
- no cambia contenido visible del sitio;
- Vercel Preview está verde cuando existe PR.
