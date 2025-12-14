# Well-Architected Checklist — sergio-site

Este documento define principios y un checklist operativo para mantener `sergio-site`
simple, profesional y sostenible. Su foco es **mejora continua sin sobreingeniería**.

---

## Principio rector

> **Keep it Simple**  
> Resolver el problema actual con la menor complejidad posible,
> manteniendo claridad, trazabilidad y calidad sostenida.

---

## Estado actual (Baseline v1.0)

Fecha de cierre baseline: **2025-12**

### Entregado (DONE)
**Productividad**
- [x] Workflows de calidad automáticos (CI) con feedback rápido
- [x] Reglas y documentación mínima para colaborar (archivos de gobernanza)
- [x] Estructura por intención: `css/`, `js/`, `assets/`, `partials/`

**Colaboración**
- [x] PR/Issue templates (si aplica) y convenciones claras
- [x] Ciclo PR → checks → merge, sin bypass

**Seguridad de aplicación**
- [x] Higiene de secretos (repo “public-safe”)
- [x] Dependabot habilitado para mantener dependencias al día
- [x] SECURITY.md para reporte responsable

**Gobernanza**
- [x] README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY (baseline)
- [x] Decisiones de arquitectura documentadas en `ARCHITECTURE.md`

**Arquitectura**
- [x] Sitio estático sin framework (HTML/CSS/JS) por decisión
- [x] Eliminación de duplicación de layout mediante `partials/` + `fetch`
- [x] Node.js solo para tooling (no runtime)

---

## Checklist mensual (10 minutos)

### 1) Salud del repo
- [ ] `main` con CI en verde
- [ ] No hay ramas stale sin propósito
- [ ] No hay archivos sospechosos (.env, tokens, dumps)

### 2) Dependencias y seguridad
- [ ] Dependabot: sin PRs críticos pendientes
- [ ] Dependencias dev actualizadas sin romper CI

### 3) Calidad del sitio
- [ ] `npm run ci:test` pasa
- [ ] `npm run ci:lighthouse` (en CI) sin regresiones graves
- [ ] Links relevantes funcionan (home, proyectos, contacto)

### 4) Contenido (señal profesional)
- [ ] “Proyectos” refleja estado real (sin humo)
- [ ] Microcopy claro y consistente (técnico primero, narrativa como capa 2)
- [ ] Contacto funciona (Formspree) y no hay fricción

---

## Política de cambios (para mantener simple)

- Cambios estructurales: PR separado y documentado (README + ARCHITECTURE).
- Dependabot: merge si CI pasa y no toca runtime crítico.
- Si el checklist empieza a crecer: **se recorta**.
