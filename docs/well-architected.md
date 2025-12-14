# Well-Architected Checklist — sergio-site

Este documento define los principios y checklists mínimos para mantener
`sergio-site` como un repositorio simple, mantenible y profesional.

No busca maximizar complejidad ni features, sino **calidad sostenida en el tiempo**.

---

## Principios guía (Keep it Simple)

### 1. Simplicidad antes que sofisticación
- Preferir soluciones simples y explícitas.
- Evitar frameworks o tooling innecesario.
- Cada archivo debe tener una razón clara de existir.

### 2. Señal profesional > ornamentación
- El contenido debe comunicar rol, nivel y criterio técnico en <60s.
- Evitar buzzwords sin contexto operativo.
- La narrativa es un diferenciador, no el eje principal.

### 3. Automatizar lo mínimo necesario
- CI liviano pero efectivo.
- Calidad validada automáticamente.
- Nada manual que pueda romperse en silencio.

### 4. Gobernanza visible
- Reglas claras, aunque el proyecto sea personal.
- Procesos documentados > conocimiento implícito.

### 5. Mejora continua consciente
- Cambios pequeños, revisables y trazables.
- Evitar refactors grandes sin necesidad real.

---

## Checklist operativo (revisión mensual)

### Repositorio
- [ ] El branch `main` está verde en CI
- [ ] No existen ramas stale sin propósito
- [ ] No hay secretos ni credenciales en el repo
- [ ] Dependabot sin PRs críticos pendientes

### Calidad
- [ ] `npm run ci:test` pasa localmente
- [ ] HTML válido y sin warnings
- [ ] Links externos funcionan correctamente
- [ ] Lighthouse sin regresiones graves

### Contenido
- [ ] Los proyectos reflejan trabajo real y vigente
- [ ] Badges y tags siguen siendo precisos
- [ ] La capa narrativa no interfiere con la lectura técnica
- [ ] No hay texto obsoleto o engañoso

### Arquitectura
- [ ] No hay duplicación innecesaria (nav/footer, estilos)
- [ ] La estructura sigue siendo fácil de entender
- [ ] No se agregaron dependencias sin justificación
- [ ] Las decisiones siguen alineadas con “Keep it Simple”

### Gobernanza
- [ ] README describe correctamente el estado actual
- [ ] CONTRIBUTING sigue siendo válido
- [ ] CODE_OF_CONDUCT presente y visible
- [ ] Templates de Issues y PR siguen siendo útiles

---

## Cadencia sugerida

- Revisión ligera: 1 vez al mes
- Revisión completa: antes de cambios estructurales
- Refactor grande: solo con motivación clara y documentada

---

## Notas finales

Este checklist es intencionalmente corto.
Si deja de ser útil, se simplifica o se elimina.

El objetivo no es cumplir el checklist,
sino **detectar degradación antes de que sea un problema**.
