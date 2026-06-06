# Security Policy

## Alcance
Este repositorio es un sitio estático (HTML/CSS/JS vanilla) desplegado en
Vercel. No ejecuta backend propio.

El alcance operativo incluye:
- páginas HTML estáticas;
- CSS y JavaScript servidos desde el repo;
- JSON públicos CRBB en `data/`;
- formulario de contacto vía Formspree;
- deploys y previews en Vercel;
- dependencias externas puntuales como ECharts vía CDN.

No se asume cumplimiento normativo específico más allá de las prácticas
documentadas en este repositorio.

## Reporte de vulnerabilidades
Si detectas un problema de seguridad:
1. No publiques detalles explotables en issues públicos.
2. Reporta el hallazgo usando el canal de contacto indicado en `contact.html` (o el email del README si lo incluyes).

Incluye en el reporte:
- archivo o URL afectada;
- descripción breve del riesgo;
- pasos mínimos para reproducirlo, si aplica;
- impacto esperado.

## Secretos
- No publicar secretos, tokens, claves API, credenciales ni archivos `.env`.
- No incluir dumps, backups privados ni salidas completas de servicios externos.
- Si un secreto se publica por error, debe rotarse fuera del repositorio y
  eliminarse del historial mediante el proceso Git correspondiente.

## Privacidad y data pública
No publicar PII ni datos sensibles. En particular, quedan excluidos:
- RUT;
- email;
- teléfono;
- direcciones;
- identificadores privados;
- textos completos sensibles;
- fuentes originales no autorizadas.

Los JSON públicos CRBB en `data/` deben contener solo datos agregados,
derivados, anonimizados cuando corresponda o no sensibles.

Referencia operativa: `docs/crbb-public-data.md`.

## Fuentes restringidas
`data/raw`, si existe en una rama o entorno local, debe tratarse como fuente
sensible o restringida. No debe publicarse, editarse ni usarse en tareas
documentales salvo instrucción explícita.

## Prácticas de mantenimiento
- Node.js se utiliza solo para tooling (lint, validación, Lighthouse, CI).
- `npm run ci:test` es el gate mínimo local antes de PR.
- Lighthouse es señal de revisión non-blocking mientras el workflow mantenga
  `continue-on-error: true`.
- Dependencias externas deben mantenerse acotadas y justificadas.
