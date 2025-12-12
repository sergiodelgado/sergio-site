# Auditoría técnica del sitio (vivo)

## Alcance
- Revisión del repositorio `sergio-site` en su estado actual.
- Se audita la **estructura del proyecto y el código fuente** mantenido en el repositorio.
- Subdirectorios relevantes: `scripts/`, `.github/`.
- **Nota**: `node_modules/` existe por dependencias locales, pero **no se audita** por ser contenido generado.
- Archivos clave auditados:
  - HTML: `index.html`, `about.html`, `projects.html`, `contact.html`
  - Estilos y scripts: `styles.css`, `script.js`
  - SEO: `robots.txt`, `sitemap.xml`
  - Documentación: `README.md`, `AGENTS.md`, `AUDIT.md`
  - Tooling/CI: `package.json`, `package-lock.json`, `lighthouserc.json`, `scripts/check-sitemap.mjs`, `.github/workflows/ci.yml`

---

## Estado actual

### Estructura
- Sitio estático con páginas HTML en la raíz del proyecto.
- Utilidades y validaciones en `scripts/`.
- Configuración de CI en `.github/workflows/`.

### Stack y dependencias
- **Frontend**: HTML5, CSS3, JavaScript vanilla.
- **Fuentes**: Google Fonts (Inter) cargadas vía `<link>` con `display=swap` (sin `preload`).
- **Formulario**: Formspree consumido mediante `fetch` desde `script.js`.
- **Tooling Node** (desarrollo/CI):
  - `html-validate` para validación de HTML.
  - `@lhci/cli` para Lighthouse CI.
  - Script propio de validación de `sitemap.xml`.

### HTML
- Todas las páginas definen `lang="es"`, `<title>` y meta descripción.
- Navegación consistente con estado activo (`aria-current="page"`).
- Enlaces sociales apuntan a URLs reales (LinkedIn, Medium, Instagram).
- Formulario usa patrón válido de accesibilidad: `label` envolviendo campos con `id`.

### CSS
- Hoja única (`styles.css`) con variables CSS y enfoque minimalista.
- La clase `.muted` está **en uso** (texto introductorio en `contact.html`).
- No hay modularización por página (aceptable por tamaño actual).

### JavaScript
- `script.js` encapsula lógica en una IIFE.
- Funcionalidades:
  - Actualización dinámica del año en el footer.
  - Manejo del formulario de contacto (`fetch`, estados de éxito/error).
- No existe JavaScript inline en los HTML.

### SEO y robots
- `robots.txt` presente.
- `sitemap.xml` presente y listado en robots.
- **Hallazgo**: `<lastmod>` contiene fechas futuras (`2025-12-01`), lo que rompe validación y puede afectar SEO.

### Tooling y CI
- Existe pipeline de CI configurado en `.github/workflows/ci.yml`.
- El CI ejecuta:
  - Validación HTML.
  - Chequeo de `sitemap.xml` (`scripts/check-sitemap.mjs`).
  - Lighthouse CI contra el sitio desplegado.
- El pipeline está activo y operativo en GitHub Actions.

---

## Cambios recientes detectados
- Introducción de tooling Node y CI (html-validate, Lighthouse CI).
- Centralización de la lógica del formulario en `script.js` (eliminación de JS inline).
- Corrección de enlaces sociales (ya no usan `#`).
- Uso efectivo de `.muted` en el formulario de contacto.
- Incorporación de auditoría técnica y documentación adicional.

---

## Deuda técnica (priorizada)

1. **SEO**: `sitemap.xml` declara fechas futuras en `<lastmod>`.
2. **Performance**: fuentes externas sin `preload` (mitigado parcialmente por `display=swap`).
3. **Optimización**: CSS y JS no minificados ni con cache busting (baja prioridad por tamaño actual).

> Nota: el patrón de accesibilidad del formulario (`label` envolvente + `input`) es válido y no constituye deuda técnica.

---

## Recomendaciones

- Corregir `sitemap.xml` para usar fechas reales y mantenerlo alineado con despliegues.
- Mantener e integrar el script `check-sitemap.mjs` como gate obligatorio del CI (ya disponible).
- Evaluar `preload` de la fuente principal si se busca optimizar métricas Lighthouse.
- Considerar minificación y versionado de assets solo si el sitio crece en complejidad o peso.
- Mantener este `AUDIT.md` actualizado cuando cambie el stack, el CI o la arquitectura.

---

## Conclusión
El sitio `sergio-site` presenta un **estado técnico sólido**, con arquitectura simple y coherente, CI funcional y deuda técnica acotada.  
La principal acción pendiente es la corrección de metadatos SEO (`sitemap.xml`). El resto de mejoras son incrementales y no críticas.

