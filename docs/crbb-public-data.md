# Data publica CRBB
Documento operativo sobre los JSON publicos usados por el dashboard CRBB en
`case-crbb-participantes.html`.
## Alcance
Esta documentacion cubre solo archivos publicos existentes en `data/`.
Archivos detectados:
- `data/modulo_00_participantes_dashboard.json`
- `data/modulo_00_participantes_hybrid_clusters.json`
- `data/modulo_00_activation_opportunities.json`
No cubre fuentes privadas, insumos originales ni carpetas no publicas.
## Criterio de privacidad
Los archivos publicados en `data/` deben contener solo informacion:
- agregada;
- derivada;
- anonimizada cuando corresponda;
- no sensible;
- apta para visualizacion publica.
No deben publicarse:
- RUT;
- email;
- telefono;
- direccion;
- identificadores privados;
- textos completos sensibles;
- fuentes originales no autorizadas;
- datos que permitan reidentificacion innecesaria.
El frontend incluye limpieza defensiva para email, telefono y RUT en textos de
resumen, pero la regla principal debe aplicarse antes de publicar los JSON.
## Consumo frontend
El consumidor principal es `js/crbb-dashboard.js`, cargado desde
`case-crbb-participantes.html`.
Rutas usadas por el frontend:
```js
data/modulo_00_participantes_dashboard.json
data/modulo_00_participantes_hybrid_clusters.json
data/modulo_00_activation_opportunities.json
```
La carga se hace con `fetch(..., { cache: "no-cache" })`.
Si falla la base principal, el dashboard muestra mensaje de error en tabla y
fallbacks para secciones dependientes. Si falla ECharts, se muestra fallback en
contenedores de graficos.
## `modulo_00_participantes_dashboard.json`
Proposito:
- alimentar la vista principal del dashboard de participantes CRBB;
- proveer KPIs, resumenes observados, distribuciones y filas tabulares;
- sostener filtros, tabla, detalle y graficos principales.
Claves principales detectadas:
- `schema_version`
- `generated_at`
- `module_id`
- `stage`
- `traceability`
- `privacy`
- `observed_data`
- `derived_summary`
`observed_data` contiene:
- `cards`
- `summary`
- `por_region`
- `por_ciudad`
- `por_disciplina`
- `por_motivacion`
- `por_macroperfil`
- `por_interdisciplinariedad`
- `top_territorios`
- `top_pares_areas`
- `matrices`
- `table_rows`
`observed_data.table_rows` es la fuente principal para normalizar participantes
en frontend. En el estado revisado contiene 53 filas.
Las filas incluyen identificadores internos de participante, nombres publicos o
artisticos, territorio, perfiles, areas, motivaciones, scores y resumen seguro.
No deben usarse datos privados de identificacion.
## `modulo_00_participantes_hybrid_clusters.json`
Proposito:
- alimentar la seccion de segmentacion hibrida del dashboard;
- publicar metricas de clusters y composicion agregada;
- exponer puntos anonimizados para scatter sin usar identificadores directos.
Claves principales detectadas:
- `metadata`
- `cluster_summary`
- `cluster_description`
- `cluster_strategic`
- `k_metrics`
- `composition`
- `scatter_public`
`scatter_public` usa `anon_id` y variables analiticas/digitales. No debe
incorporar nombres, emails, telefonos ni textos originales.
## `modulo_00_activation_opportunities.json`
Proposito:
- alimentar la seccion de oportunidades de activacion de redes;
- entregar acciones sugeridas, prioridad, complejidad, riesgo e indicador de
  seguimiento;
- mantener lectura operativa sin publicar fuentes sensibles.
Claves principales detectadas:
- `metadata`
- `opportunities`
`opportunities` incluye titulo, tipo de red, prioridad, complejidad, razon
operativa, riesgo, accion sugerida e indicador de seguimiento.
## Trazabilidad de generacion
Script detectado:
```bash
scripts/build_hybrid_clusters_public_payload.py
```
Uso previsto:
```bash
python3 scripts/build_hybrid_clusters_public_payload.py --input-dir <ruta-insumos> --output data/modulo_00_participantes_hybrid_clusters.json
```
El script espera salidas analiticas de `clustering_hybrid_v4`, entre ellas CSV
de participantes, resumenes de clusters, metricas de `k` y reporte markdown.
Salida por defecto:
```bash
data/modulo_00_participantes_hybrid_clusters.json
```
El script:
- lee CSV y reporte analitico;
- selecciona o confirma `k`;
- calcula composicion por cluster;
- genera `scatter_public` con `anon_id`;
- escribe JSON con `ensure_ascii=False` e indentacion.
No se ejecuta en CI.
## Limites operativos
- No editar fuentes privadas desde tareas documentales.
- No publicar insumos sensibles.
- No usar fuentes originales completas como payload del sitio.
- No editar `data/*.json` sin tarea explicita.
- No regenerar payloads sin registrar input, proceso y output.
- No asumir que un JSON es seguro solo porque el frontend oculte campos.
## Procedimiento minimo para actualizar payloads publicos
1. Confirmar alcance de la actualizacion y archivo objetivo.
2. Revisar `git status --short --branch`.
3. Generar el payload desde insumos derivados autorizados.
4. Verificar que el JSON no contiene PII ni textos sensibles completos.
5. Revisar claves y conteos esperados contra `js/crbb-dashboard.js`.
6. Ejecutar:
```bash
npm run ci:test
```
7. Revisar:
```bash
git diff --stat
git diff -- data/
```
8. Documentar en PR:
- fuente derivada usada;
- comando ejecutado;
- archivo generado;
- validacion de privacidad;
- resultado de `npm run ci:test`.
## Checklist de privacidad
- No hay RUT, emails, telefonos ni direcciones.
- No hay textos completos de postulacion sensibles.
- Los identificadores publicos son necesarios para la visualizacion.
- Los puntos anonimizados usan `anon_id` cuando corresponde.
- La data publicada coincide con lo que consume el frontend.
