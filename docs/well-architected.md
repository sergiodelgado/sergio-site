# Well-Architected Checklist — sergio-site

Este documento define principios y un checklist operativo para mantener `sergio-site`
simple, profesional y sostenible. Su foco es **mejora continua sin sobreingeniería**.

---

## Principio rector

> **Keep it Simple**  
> Resolver el problema actual con la menor complejidad posible,
> manteniendo claridad, trazabilidad y calidad sostenida.

---

## Estado actual

Fecha de revisión documental: **2026-06-05**

### Entregado (DONE)
**Productividad**
- [x] Workflows de calidad automáticos (CI) con feedback rápido
- [x] Reglas y documentación mínima para colaborar (archivos de gobernanza)
- [x] Estructura por intención: `css/`, `js/`, `data/`, `partials/`, `docs/`
- [x] Documentación técnica separada en `docs/site-technical-map.md`,
  `docs/crbb-public-data.md` y `docs/qa-deploy.md`

**Colaboración**
- [x] PR/Issue templates (si aplica) y convenciones claras
- [x] Ciclo PR → checks → merge, sin bypass

**Seguridad de aplicación**
- [x] Higiene de secretos (repo “public-safe”)
- [x] Dependabot habilitado para mantener dependencias al día
- [x] SECURITY.md para reporte responsable
- [x] Criterio explícito para payloads públicos CRBB sin RUT, email, teléfono,
  direcciones ni texto sensible completo

**Gobernanza**
- [x] README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY (baseline)
- [x] Decisiones de arquitectura documentadas en `ARCHITECTURE.md`
- [x] Mapa técnico, data pública y QA/deploy documentados en `docs/`

**Arquitectura**
- [x] Sitio estático sin framework (HTML/CSS/JS) por decisión
- [x] Eliminación de duplicación de layout mediante `partials/` + `fetch`
- [x] Node.js solo para tooling (no runtime)
- [x] CSS global en `css/styles.css` y CSS CRBB en `css/crbb-dashboard.css`
- [x] JS global en `js/script.js` y dashboard CRBB en `js/crbb-dashboard.js`
- [x] Dashboard CRBB alimentado por JSON públicos en `data/`
- [x] ECharts vía CDN para visualizaciones del dashboard

**QA y deploy**
- [x] `npm run ci:test` como validación local mínima
- [x] CI con validación HTML y chequeo de sitemap
- [x] Lighthouse configurado como non-blocking en CI
- [x] Vercel para deploy y Preview de PR

---

## Checklist mensual (10 minutos)

### 1) Salud del repo
- [ ] `main` con CI en verde
- [ ] No hay ramas stale sin propósito
- [ ] No hay archivos sospechosos (.env, tokens, dumps)
- [ ] No hay cambios fuera de alcance en HTML, CSS, JS, data, scripts o workflows

### 2) Dependencias y seguridad
- [ ] Dependabot: sin PRs críticos pendientes
- [ ] Dependencias dev actualizadas sin romper CI
- [ ] Payloads públicos CRBB sin RUT, email, teléfono, direcciones ni texto sensible completo
- [ ] No se usó `data/raw` salvo instrucción explícita

### 3) Calidad del sitio
- [ ] `npm run ci:test` pasa
- [ ] Lighthouse revisado como señal non-blocking si reporta advertencias
- [ ] Vercel Preview verde cuando exista PR
- [ ] Links relevantes funcionan (home, proyectos, contacto)

### 4) Contenido (señal profesional)
- [ ] “Proyectos” refleja estado real (sin humo)
- [ ] Microcopy claro y consistente (técnico primero, narrativa como capa 2)
- [ ] Contacto funciona (Formspree) y no hay fricción

---

## Política de cambios (para mantener simple)

- Cambios estructurales: PR separado y documentado (README + ARCHITECTURE).
- Dependabot: merge si CI pasa y no toca runtime crítico.
- Cambios de data pública: revisar `docs/crbb-public-data.md` antes de editar.
- Cambios de estructura, QA o deploy: revisar `docs/site-technical-map.md` y
  `docs/qa-deploy.md`.
- Si el checklist empieza a crecer: **se recorta**.
