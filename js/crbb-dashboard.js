(function () {
  const DATA_PATH = "data/modulo_00_participantes_dashboard.json";
  const HYBRID_DATA_PATH = "data/modulo_00_participantes_hybrid_clusters.json";
  const ACTIVATION_DATA_PATH = "data/modulo_00_activation_opportunities.json";
  const charts = {
    main: [],
    hybrid: []
  };
  let rows = [];
  let filtered = [];
  let selectedId = null;
  let sourceData = null;

  const el = (id) => document.getElementById(id);

  const pageSize = 10;
  let currentPage = 1;

  const labelMap = {
    formacion: "formación",
    profesionalizacion: "profesionalización",
    colaboracion: "colaboración",
    circulacion: "circulación",
    territorio: "territorio",
    redes: "redes",
    hibrido: "híbrido",
    nodo_creativo: "nodo creativo",
    musica_escena: "música / escena",
    no_determinado: "no determinado",
    sin_macroperfil: "sin tipo definido",
    tecnico: "técnico",
    gestion: "gestión",
    visual: "visual",
    mixto: "mixto",
    especializado: "especializado",
    match_found: "con match",
    match_not_found: "sin match",
    unknown: "sin dato"
  };

  const motivationOrder = ["formacion", "redes", "profesionalizacion", "colaboracion", "circulacion", "territorio"];

  const chartTheme = {
    text: "#e8e8ef",
    muted: "#a9a9b8",
    grid: "rgba(255,255,255,0.14)",
    tooltipBg: "rgba(20,20,26,0.96)",
    border: "rgba(255,255,255,0.12)",
    territory: "#35d399",
    discipline: "#7cbcff",
    motivation: "#b9a7ff",
    structure: "#f5a524",
    blue: "#6f8fe7",
    green: "#35d399",
    yellow: "#ffd166",
    profilePalette: ["#ffd166", "#6f8fe7", "#35d399", "#b9a7ff", "#f5a524", "#7cbcff"]
  };

  const parseList = (value) => {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    if (typeof value === "string") {
      return value
        .split(/[,;|/\\\n]+/g)
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  };

  const asText = (value, fallback) => {
    if (typeof value === "string" && value.trim()) return value.trim();
    return fallback || "";
  };

  const normalizeTextToken = (value) => {
    const raw = String(value || "").trim();
    return labelMap[raw] || raw.replace(/_/g, " ");
  };

  const cleanRegionLabel = (value) => {
    const text = String(value || "").trim();
    if (!text) return "Sin región";
    return text
      .replace(/^Región\s+de\s+/i, "")
      .replace(/^Región\s+del\s+/i, "")
      .replace(/^Región\s+/i, "");
  };

  const asNumber = (value, fallback = null) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const formatNumber = (value, digits = 2) => {
    const parsed = asNumber(value);
    return parsed === null ? "-" : parsed.toFixed(digits);
  };

  const escapeHtml = (value) =>
    String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const cleanSafeText = (text) => {
    if (!text) return "Sin resumen seguro disponible.";
    const withoutEmail = text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[dato excluido]");
    const withoutPhone = withoutEmail.replace(/(\+?\d[\d\s().-]{7,}\d)/g, "[dato excluido]");
    return withoutPhone.replace(/\b\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK]\b/g, "[dato excluido]");
  };

  const normalizeRow = (item, index) => {
    const nombre =
      asText(item.nombre_publico_artistico) ||
      asText(item.nombre_publico) ||
      asText(item.nombre_artistico) ||
      asText(item.participant_id) ||
      "Participante " + String(index + 1).padStart(2, "0");

    const organizacion = asText(item.organizacion, "");
    const ciudad = asText(item.ciudad, "Sin ciudad");
    const region = asText(item.region, "Sin región");
    const pais = asText(item.pais, "");
    const territorio = asText(item.territorio, [ciudad, region, pais].filter(Boolean).join(", "));
    const macroperfilRaw = asText(item.macroperfil, "sin_macroperfil");
    const perfilInterRaw = asText(item.perfil_interdisciplinario, "sin perfil interdisciplinario");
    const areas = parseList(item.areas || item.disciplinas);
    const motivacionesRaw = parseList(item.motivaciones);
    const instagram = asText(item.instagram_publico || item.instagram, "");
    const resumen = cleanSafeText(
      asText(
        item.resumen_seguro_postulacion ||
        item.resumen_postulacion_seguro ||
        item.resumen_seguro ||
        item.texto_postulacion_resumen
      )
    );

    const parsedId = Number(item.participant_id);
    return {
      id: Number.isFinite(parsedId) && parsedId > 0 ? parsedId : index + 1,
      nombre,
      organizacion,
      ciudad,
      region,
      territorio,
      macroperfilRaw,
      macroperfil: normalizeTextToken(macroperfilRaw),
      perfilInterRaw,
      perfilInter: normalizeTextToken(perfilInterRaw),
      areas,
      areaPrincipal: areas[0] || "Sin área",
      motivacionesRaw,
      motivaciones: motivacionesRaw.map(normalizeTextToken),
      motivacionPrincipalRaw: motivacionesRaw[0] || "",
      motivacionPrincipal: normalizeTextToken(motivacionesRaw[0] || "Sin motivación"),
      instagram,
      resumen
    };
  };

  const countBy = (items, getter) => {
    const map = new Map();
    items.forEach((item) => {
      const key = getter(item);
      if (!key) return;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  };

  const countMany = (items, getter) => {
    const map = new Map();
    items.forEach((item) => {
      getter(item).forEach((value) => {
        if (!value) return;
        map.set(value, (map.get(value) || 0) + 1);
      });
    });
    return map;
  };

  const mapToItems = (map, labelKey = "label", valueKey = "value") =>
    Array.from(map.entries()).map(([label, value]) => ({ [labelKey]: label, [valueKey]: value }));

  function topNWithOther(items, n = 8, labelKey = "label", valueKey = "value") {
    const sorted = [...items].sort((a, b) => Number(b[valueKey]) - Number(a[valueKey]));
    const top = sorted.slice(0, n);
    const rest = sorted.slice(n);
    const otherValue = rest.reduce((sum, item) => sum + Number(item[valueKey] || 0), 0);
    if (otherValue > 0) {
      top.push({ [labelKey]: "Otros", [valueKey]: otherValue });
    }
    return top;
  }

  const sortedTop = (items, n) =>
    [...items].sort((a, b) => Number(b.value) - Number(a.value)).slice(0, n);

  const topLabel = (map) => {
    const first = sortedTop(mapToItems(map), 1)[0];
    return first ? normalizeTextToken(first.label) + " (" + first.value + ")" : "-";
  };

  const buildPairs = (items) => {
    const pairs = new Map();
    items.forEach((item) => {
      const uniqueAreas = Array.from(new Set(item.areas));
      for (let i = 0; i < uniqueAreas.length; i += 1) {
        for (let j = i + 1; j < uniqueAreas.length; j += 1) {
          const pair = [uniqueAreas[i], uniqueAreas[j]].sort().join(" + ");
          pairs.set(pair, (pairs.get(pair) || 0) + 1);
        }
      }
    });
    return pairs;
  };

  const renderKpis = () => {
    const observedCards = sourceData && sourceData.observed_data && sourceData.observed_data.cards;
    if (observedCards) {
      el("kpi-participantes").textContent = String(observedCards.total_participantes || rows.length || 0);
      el("kpi-regiones").textContent = String(observedCards.regiones || 0);
      el("kpi-territorios").textContent = String(observedCards.territorios_unicos || 0);
      el("kpi-disciplinas").textContent = String(observedCards.disciplinas || 0);
      el("kpi-motivacion").textContent = normalizeTextToken(observedCards.motivacion_principal || "-");
      el("kpi-perfil").textContent = normalizeTextToken(observedCards.perfil_interdisciplinario_dominante || "-");
      return;
    }

    const regiones = new Set(rows.map((item) => item.region)).size;
    const territorios = new Set(rows.map((item) => item.territorio)).size;
    const disciplinas = new Set(rows.flatMap((item) => item.areas)).size;
    const motivaciones = countMany(rows, (item) => item.motivaciones);
    const perfiles = countBy(rows, (item) => item.perfilInter);
    el("kpi-participantes").textContent = String(rows.length);
    el("kpi-regiones").textContent = String(regiones);
    el("kpi-territorios").textContent = String(territorios);
    el("kpi-disciplinas").textContent = String(disciplinas);
    el("kpi-motivacion").textContent = topLabel(motivaciones);
    el("kpi-perfil").textContent = topLabel(perfiles);
  };

  const createChart = (id, option, bucket = "main") => {
    const node = el(id);
    if (!node || typeof echarts === "undefined") return;
    const chart = echarts.init(node, null, { renderer: "canvas" });
    chart.setOption(option);
    if (!Array.isArray(charts[bucket])) charts[bucket] = [];
    charts[bucket].push(chart);
  };

  const resetCharts = (bucket = "main") => {
    if (!Array.isArray(charts[bucket])) return;
    charts[bucket].splice(0).forEach((chart) => chart.dispose());
  };

  function truncateLabel(value, max = 30) {
    if (!value) return "";
    const text = String(value);
    return text.length > max ? text.slice(0, max - 1) + "…" : text;
  }

  function baseTooltip(trigger = "item") {
    return {
      trigger,
      backgroundColor: chartTheme.tooltipBg,
      borderColor: chartTheme.border,
      textStyle: { color: chartTheme.text },
      confine: true
    };
  }

  function baseGrid(left = 150, bottom = 28, top = 28) {
    return {
      top,
      right: 24,
      bottom,
      left,
      containLabel: true
    };
  }

  function horizontalBarOption({ title, labels, values, color, colors, left = 150, barWidth = 14, labelMax = 30 }) {
    return {
      tooltip: {
        ...baseTooltip(),
        formatter: (params) =>
          "<strong>" + escapeHtml(params.name) + "</strong><br/>" +
          title + ": <strong>" + params.value + "</strong>"
      },
      grid: baseGrid(left),
      xAxis: {
        type: "value",
        axisLabel: { color: chartTheme.muted, fontSize: 12 },
        splitLine: { lineStyle: { color: chartTheme.grid } }
      },
      yAxis: {
        type: "category",
        data: labels,
        inverse: true,
        axisLabel: {
          color: chartTheme.muted,
          fontSize: 12,
          formatter: (value) => truncateLabel(value, labelMax)
        }
      },
      series: [{
        type: "bar",
        data: values,
        barWidth,
        itemStyle: {
          color: colors ? (params) => colors[params.dataIndex % colors.length] : color,
          borderRadius: [0, 6, 6, 0]
        },
        emphasis: { focus: "series" }
      }]
    };
  }

  function stackedMotivationOption(items) {
    const profileLabels = sortedTop(mapToItems(countBy(items, (item) => item.macroperfil)), 8).map((entry) => entry.label);
    const dataByProfile = new Map(profileLabels.map((label) => [label, new Map()]));

    items.forEach((item) => {
      if (!dataByProfile.has(item.macroperfil)) return;
      item.motivacionesRaw.forEach((motivation) => {
        const map = dataByProfile.get(item.macroperfil);
        map.set(motivation, (map.get(motivation) || 0) + 1);
      });
    });

    return {
      tooltip: {
        ...baseTooltip("axis"),
        axisPointer: { type: "shadow" }
      },
      legend: {
        top: 0,
        textStyle: { color: chartTheme.muted },
        itemWidth: 12,
        itemHeight: 12
      },
      grid: baseGrid(148, 26, 52),
      xAxis: {
        type: "value",
        axisLabel: { color: chartTheme.muted, fontSize: 12 },
        splitLine: { lineStyle: { color: chartTheme.grid } }
      },
      yAxis: {
        type: "category",
        data: profileLabels,
        inverse: true,
        axisLabel: {
          color: chartTheme.muted,
          fontSize: 12,
          formatter: (value) => truncateLabel(value, 28)
        }
      },
      series: motivationOrder.map((motivation, index) => ({
        name: normalizeTextToken(motivation),
        type: "bar",
        stack: "motivaciones",
        barWidth: 16,
        emphasis: { focus: "series" },
        itemStyle: { color: [chartTheme.motivation, chartTheme.blue, chartTheme.yellow, chartTheme.green, "#f5a524", "#7cbcff"][index] },
        data: profileLabels.map((profile) => dataByProfile.get(profile).get(motivation) || 0)
      }))
    };
  }

  const renderRegionalMotivationSummary = (items) => {
    const body = el("mot-region-summary");
    const regions = sortedTop(mapToItems(countBy(items, (item) => item.region)), 8);
    if (!regions.length) {
      body.innerHTML = '<tr><td colspan="3">Sin registros para los filtros activos.</td></tr>';
      return;
    }

    body.innerHTML = regions.map((region) => {
      const regionRows = items.filter((item) => item.region === region.label);
      const topMotivation = sortedTop(mapToItems(countMany(regionRows, (item) => item.motivacionesRaw)), 1)[0];
      return (
        "<tr>" +
        "<td>" + escapeHtml(cleanRegionLabel(region.label)) + "</td>" +
        "<td>" + escapeHtml(topMotivation ? normalizeTextToken(topMotivation.label) : "-") + "</td>" +
        "<td>" + escapeHtml(topMotivation ? topMotivation.value : 0) + "</td>" +
        "</tr>"
      );
    }).join("");
  };

  const renderPairCards = (items) => {
    const node = el("pair-cards");
    const pairs = sortedTop(mapToItems(buildPairs(items)), 5);
    if (!pairs.length) {
      node.innerHTML = '<p class="muted">Sin pares de áreas para los filtros activos.</p>';
      return;
    }

    node.innerHTML = pairs.map((pair, index) =>
      '<article class="pair-card">' +
      "<span>#" + (index + 1) + " · " + pair.value + " participantes</span>" +
      "<strong>" + escapeHtml(pair.label) + "</strong>" +
      "</article>"
    ).join("");
  };

  const renderCharts = () => {
    renderRegionalMotivationSummary(filtered);
    renderPairCards(filtered);
    if (typeof echarts === "undefined") return;

    resetCharts();
    const byRegion = topNWithOther(mapToItems(countBy(filtered, (item) => item.region)).map((item) => ({
      label: cleanRegionLabel(item.label),
      value: item.value
    })), 8);
    const byDisciplina = sortedTop(mapToItems(countMany(filtered, (item) => item.areas)), 10);
    const byMotivacion = sortedTop(mapToItems(countMany(filtered, (item) => item.motivaciones)), 10);
    const byTerritorio = sortedTop(mapToItems(countBy(filtered, (item) => item.ciudad)), 999);
    const interCounts = sortedTop(mapToItems(countBy(filtered, (item) => item.perfilInter)), 10);

    createChart("chart-region", horizontalBarOption({
      title: "Participantes",
      labels: byRegion.map((d) => d.label),
      values: byRegion.map((d) => d.value),
      color: chartTheme.territory,
      left: 150,
      barWidth: 12,
      labelMax: 24
    }));

    createChart("chart-territorios", horizontalBarOption({
      title: "Participantes",
      labels: byTerritorio.map((d) => d.label),
      values: byTerritorio.map((d) => d.value),
      color: chartTheme.territory,
      left: 110,
      barWidth: 10,
      labelMax: 20
    }));

    createChart("chart-disciplinas", horizontalBarOption({
      title: "Participantes",
      labels: byDisciplina.map((d) => d.label),
      values: byDisciplina.map((d) => d.value),
      color: chartTheme.discipline,
      left: 150
    }));

    createChart("chart-inter", horizontalBarOption({
      title: "Participantes",
      labels: interCounts.map((d) => d.label),
      values: interCounts.map((d) => d.value),
      colors: chartTheme.profilePalette,
      left: 150
    }));

    createChart("chart-motivaciones", horizontalBarOption({
      title: "Menciones",
      labels: byMotivacion.map((d) => d.label),
      values: byMotivacion.map((d) => d.value),
      color: chartTheme.motivation,
      left: 150
    }));

    createChart("chart-mot-perfil", stackedMotivationOption(filtered));
  };

  // Segmentación híbrida
  const setHybridChartFallback = (id, message) => {
    const node = el(id);
    if (!node) return;
    node.textContent = message;
    node.style.display = "grid";
    node.style.placeItems = "center";
    node.style.color = "#a1a1aa";
    node.style.border = "1px dashed #2d2d35";
    node.style.borderRadius = "10px";
    node.style.padding = "12px";
  };

  const showHybridFallback = (message) => {
    const fallback = el("hybrid-fallback");
    if (fallback) {
      fallback.hidden = false;
      fallback.textContent = message || "No fue posible cargar el payload público de segmentación híbrida.";
    }
    ["hybrid-kpi-total", "hybrid-kpi-k", "hybrid-kpi-silhouette"].forEach((id) => {
      const node = el(id);
      if (node) node.textContent = "-";
    });
    const clusterCards = el("hybrid-cluster-cards");
    if (clusterCards) {
      clusterCards.innerHTML = '<p class="muted">Sin datos públicos de segmentación híbrida.</p>';
    }
    [
      "chart-hybrid-scatter",
      "chart-hybrid-summary",
      "chart-hybrid-macroperfil",
      "chart-hybrid-instagram",
      "chart-hybrid-k"
    ].forEach((id) => setHybridChartFallback(id, "Segmentación híbrida no disponible."));
  };

  const renderHybridMethodMeta = (metadata, kMetrics) => {
    el("hybrid-kpi-total").textContent = String(metadata.total_participants || "-");
    el("hybrid-kpi-k").textContent = String(metadata.selected_k || "-");
    el("hybrid-kpi-silhouette").textContent = formatNumber(metadata.silhouette_final, 4);
    el("hybrid-method-note").textContent =
      metadata.method_note ||
      "Segmentación exploratoria basada en índices analíticos y digitales, no clasificación definitiva.";

    const byK = new Map((Array.isArray(kMetrics) ? kMetrics : []).map((row) => [asNumber(row.k), row]));
    const k2 = byK.get(2);
    const k3 = byK.get(3);
    if (k2 && k3 && asNumber(k3.silhouette) !== null && asNumber(k2.silhouette) !== null) {
      const text =
        "k=3 tuvo silhouette levemente mayor (" +
        formatNumber(k3.silhouette, 4) +
        "), pero fue descartado por cluster unitario (min_cluster_size=" +
        String(k3.min_cluster_size || "-") +
        "). k=2 fue seleccionado por criterio de tamaño mínimo de cluster.";
      el("hybrid-k-note").textContent = text;
      return;
    }
    el("hybrid-k-note").textContent =
      "La selección de k prioriza equilibrio entre silhouette y tamaño mínimo de cluster.";
  };

  const renderHybridClusterCards = (strategicRows, descriptionRows) => {
    const node = el("hybrid-cluster-cards");
    const strategic = Array.isArray(strategicRows) ? strategicRows : [];
    if (!strategic.length) {
      node.innerHTML = '<p class="muted">No hay filas estratégicas para mostrar.</p>';
      return;
    }

    const byClusterDescription = new Map(
      (Array.isArray(descriptionRows) ? descriptionRows : []).map((row) => [String(row.cluster), row])
    );

    node.innerHTML = strategic
      .sort((a, b) => asNumber(a.cluster, 999) - asNumber(b.cluster, 999))
      .map((row) => {
        const desc = byClusterDescription.get(String(row.cluster)) || {};
        return (
          '<article class="hybrid-cluster-card">' +
          "<h4>Cluster " + escapeHtml(row.cluster) + " · " + escapeHtml(row.nombre_cluster || "sin nombre") + "</h4>" +
          "<p><strong>Tipo:</strong> " + escapeHtml(row.tipo_cluster || "-") + "</p>" +
          "<p><strong>Participantes:</strong> " + escapeHtml(row.n_participants || desc.n_participants || "-") + "</p>" +
          "<p><strong>Interpretación:</strong> " + escapeHtml(row.interpretacion || "-") + "</p>" +
          "<p><strong>Rol en red:</strong> " + escapeHtml(row.rol_en_red || "-") + "</p>" +
          "<p><strong>Riesgo:</strong> " + escapeHtml(row.riesgo || "-") + "</p>" +
          "<p><strong>Acción recomendada:</strong> " + escapeHtml(row.accion_recomendada || "-") + "</p>" +
          "</article>"
        );
      })
      .join("");
  };

  const buildCompositionMatrix = (rows, labelKey) => {
    const list = Array.isArray(rows) ? rows : [];
    const clusters = Array.from(new Set(list.map((item) => String(item.cluster)))).sort((a, b) => asNumber(a, 999) - asNumber(b, 999));
    const labels = Array.from(new Set(list.map((item) => String(item[labelKey] || "sin_dato"))));
    const totals = {};
    labels.forEach((label) => { totals[label] = 0; });
    list.forEach((item) => {
      const label = String(item[labelKey] || "sin_dato");
      totals[label] += asNumber(item.count, 0);
    });
    labels.sort((a, b) => totals[b] - totals[a]);
    const matrix = {};
    labels.forEach((label) => {
      matrix[label] = clusters.map(() => 0);
    });
    list.forEach((item) => {
      const cluster = String(item.cluster);
      const label = String(item[labelKey] || "sin_dato");
      const clusterIndex = clusters.indexOf(cluster);
      if (clusterIndex >= 0 && matrix[label]) {
        matrix[label][clusterIndex] = asNumber(item.count, 0);
      }
    });
    return { clusters, labels, matrix };
  };

  const compositionOption = ({ matrixInfo, labelFormatter, title }) => ({
    tooltip: {
      ...baseTooltip("axis"),
      axisPointer: { type: "shadow" }
    },
    legend: {
      top: 0,
      textStyle: { color: chartTheme.muted },
      type: "scroll"
    },
    grid: baseGrid(120, 32, 60),
    xAxis: {
      type: "category",
      data: matrixInfo.clusters.map((cluster) => "Cluster " + cluster),
      axisLabel: { color: chartTheme.muted, fontSize: 12 }
    },
    yAxis: {
      type: "value",
      name: title,
      nameTextStyle: { color: chartTheme.muted },
      axisLabel: { color: chartTheme.muted, fontSize: 12 },
      splitLine: { lineStyle: { color: chartTheme.grid } }
    },
    series: matrixInfo.labels.map((label, index) => ({
      name: labelFormatter(label),
      type: "bar",
      stack: "total",
      emphasis: { focus: "series" },
      itemStyle: { color: chartTheme.profilePalette[index % chartTheme.profilePalette.length] },
      data: matrixInfo.matrix[label]
    }))
  });

  const hybridScatterOption = (points) => {
    const grouped = new Map();
    points.forEach((point) => {
      const cluster = asNumber(point.cluster, -1);
      if (!grouped.has(cluster)) grouped.set(cluster, []);
      grouped.get(cluster).push(point);
    });

    return {
      tooltip: {
        ...baseTooltip(),
        formatter: (params) => {
          const d = params.data.raw || {};
          return (
            "<strong>" + escapeHtml(d.anon_id || "-") + "</strong><br/>" +
            "Cluster: <strong>" + escapeHtml(String(d.cluster ?? "-")) + "</strong><br/>" +
            "Macroperfil: <strong>" + escapeHtml(normalizeTextToken(d.macroperfil || "sin_dato")) + "</strong><br/>" +
            "Región: <strong>" + escapeHtml(d.region || "sin_dato") + "</strong><br/>" +
            "Analytic index: <strong>" + formatNumber(d.analytic_index, 2) + "</strong><br/>" +
            "Digital index: <strong>" + formatNumber(d.digital_index, 2) + "</strong><br/>" +
            "Hybrid gap: <strong>" + formatNumber(d.hybrid_gap, 2) + "</strong>"
          );
        }
      },
      legend: {
        top: 0,
        textStyle: { color: chartTheme.muted }
      },
      grid: baseGrid(56, 46, 56),
      xAxis: {
        type: "value",
        name: "Analytic index",
        nameLocation: "middle",
        nameGap: 30,
        nameTextStyle: { color: chartTheme.muted },
        axisLabel: { color: chartTheme.muted, fontSize: 12 },
        splitLine: { lineStyle: { color: chartTheme.grid } }
      },
      yAxis: {
        type: "value",
        name: "Digital index",
        nameTextStyle: { color: chartTheme.muted },
        axisLabel: { color: chartTheme.muted, fontSize: 12 },
        splitLine: { lineStyle: { color: chartTheme.grid } }
      },
      series: Array.from(grouped.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([cluster, rows], index) => ({
          name: "Cluster " + cluster,
          type: "scatter",
          emphasis: { focus: "series" },
          itemStyle: { color: chartTheme.profilePalette[index % chartTheme.profilePalette.length] },
          symbolSize: (params) => {
            const areaCount = asNumber(params[2], 1);
            return 10 + Math.max(0, areaCount) * 2;
          },
          data: rows.map((row) => ({
            value: [
              asNumber(row.analytic_index, 0),
              asNumber(row.digital_index, 0),
              asNumber(row.areas_count, 1)
            ],
            raw: row
          }))
        }))
    };
  };

  const hybridSummaryOption = (rows) => {
    const sorted = [...rows].sort((a, b) => asNumber(a.cluster, 999) - asNumber(b.cluster, 999));
    return {
      tooltip: {
        ...baseTooltip("axis"),
        axisPointer: { type: "shadow" }
      },
      legend: {
        top: 0,
        textStyle: { color: chartTheme.muted }
      },
      grid: baseGrid(70, 32, 56),
      xAxis: {
        type: "category",
        data: sorted.map((row) => "Cluster " + row.cluster),
        axisLabel: { color: chartTheme.muted, fontSize: 12 }
      },
      yAxis: {
        type: "value",
        axisLabel: { color: chartTheme.muted, fontSize: 12 },
        splitLine: { lineStyle: { color: chartTheme.grid } }
      },
      series: [
        {
          name: "analytic_index",
          type: "bar",
          data: sorted.map((row) => asNumber(row.analytic_index, 0)),
          itemStyle: { color: chartTheme.blue }
        },
        {
          name: "digital_index",
          type: "bar",
          data: sorted.map((row) => asNumber(row.digital_index, 0)),
          itemStyle: { color: chartTheme.green }
        },
        {
          name: "hybrid_gap",
          type: "bar",
          data: sorted.map((row) => asNumber(row.hybrid_gap, 0)),
          itemStyle: { color: chartTheme.yellow }
        }
      ]
    };
  };

  const hybridKLineOption = (rows, selectedK) => {
    const sorted = [...rows].sort((a, b) => asNumber(a.k, 999) - asNumber(b.k, 999));
    return {
      tooltip: {
        ...baseTooltip("axis"),
        axisPointer: { type: "line" }
      },
      grid: baseGrid(60, 36, 46),
      xAxis: {
        type: "category",
        data: sorted.map((row) => "k=" + row.k),
        axisLabel: { color: chartTheme.muted, fontSize: 12 }
      },
      yAxis: {
        type: "value",
        name: "Silhouette",
        nameTextStyle: { color: chartTheme.muted },
        axisLabel: { color: chartTheme.muted, fontSize: 12 },
        splitLine: { lineStyle: { color: chartTheme.grid } }
      },
      series: [{
        type: "line",
        smooth: true,
        data: sorted.map((row) => asNumber(row.silhouette, 0)),
        itemStyle: { color: chartTheme.structure },
        lineStyle: { width: 2 },
        markPoint: selectedK
          ? {
              label: { color: chartTheme.text },
              data: [{
                name: "k seleccionado",
                coord: ["k=" + selectedK, asNumber((sorted.find((row) => asNumber(row.k) === asNumber(selectedK)) || {}).silhouette, 0)],
                value: "k=" + selectedK
              }]
            }
          : undefined
      }]
    };
  };

  const renderHybridSection = (payload) => {
    if (!payload || typeof payload !== "object") {
      showHybridFallback("No hay payload público válido para segmentación híbrida.");
      return;
    }

    const fallback = el("hybrid-fallback");
    if (fallback) fallback.hidden = true;

    const metadata = payload.metadata || {};
    const clusterSummary = Array.isArray(payload.cluster_summary) ? payload.cluster_summary : [];
    const clusterDescription = Array.isArray(payload.cluster_description) ? payload.cluster_description : [];
    const clusterStrategic = Array.isArray(payload.cluster_strategic) ? payload.cluster_strategic : [];
    const kMetrics = Array.isArray(payload.k_metrics) ? payload.k_metrics : [];
    const composition = payload.composition || {};
    const scatterPublic = Array.isArray(payload.scatter_public) ? payload.scatter_public : [];

    renderHybridMethodMeta(metadata, kMetrics);
    renderHybridClusterCards(clusterStrategic, clusterDescription);

    if (typeof echarts === "undefined") {
      [
        "chart-hybrid-scatter",
        "chart-hybrid-summary",
        "chart-hybrid-macroperfil",
        "chart-hybrid-instagram",
        "chart-hybrid-k"
      ].forEach((id) => setHybridChartFallback(id, "ECharts no disponible en este entorno."));
      return;
    }

    resetCharts("hybrid");

    const scatterPoints = scatterPublic.filter(
      (row) => asNumber(row.analytic_index) !== null && asNumber(row.digital_index) !== null
    );
    if (!scatterPoints.length) {
      setHybridChartFallback("chart-hybrid-scatter", "Sin datos para el scatter público.");
    } else {
      createChart("chart-hybrid-scatter", hybridScatterOption(scatterPoints), "hybrid");
    }

    if (!clusterSummary.length) {
      setHybridChartFallback("chart-hybrid-summary", "Sin resumen de clusters.");
    } else {
      createChart("chart-hybrid-summary", hybridSummaryOption(clusterSummary), "hybrid");
    }

    const macroMatrix = buildCompositionMatrix(composition.by_macroperfil, "macroperfil");
    if (!macroMatrix.clusters.length || !macroMatrix.labels.length) {
      setHybridChartFallback("chart-hybrid-macroperfil", "Sin composición por macroperfil.");
    } else {
      createChart(
        "chart-hybrid-macroperfil",
        compositionOption({
          matrixInfo: macroMatrix,
          labelFormatter: (label) => normalizeTextToken(label),
          title: "Participantes"
        }),
        "hybrid"
      );
    }

    const instagramMatrix = buildCompositionMatrix(composition.by_instagram_match, "instagram_match");
    if (!instagramMatrix.clusters.length || !instagramMatrix.labels.length) {
      setHybridChartFallback("chart-hybrid-instagram", "Sin composición por match de Instagram.");
    } else {
      createChart(
        "chart-hybrid-instagram",
        compositionOption({
          matrixInfo: instagramMatrix,
          labelFormatter: (label) => normalizeTextToken(label),
          title: "Participantes"
        }),
        "hybrid"
      );
    }

    if (!kMetrics.length) {
      setHybridChartFallback("chart-hybrid-k", "Sin métricas de evaluación de k.");
    } else {
      createChart(
        "chart-hybrid-k",
        hybridKLineOption(kMetrics, metadata.selected_k),
        "hybrid"
      );
    }
  };

  const loadHybridSection = async () => {
    try {
      const response = await fetch(HYBRID_DATA_PATH, { cache: "no-cache" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const hybridPayload = await response.json();
      renderHybridSection(hybridPayload);
    } catch (error) {
      console.warn("No fue posible cargar segmentación híbrida:", error);
      showHybridFallback("No fue posible cargar el payload público de segmentación híbrida.");
    }
  };

  const showActivationFallback = (message) => {
    const fallback = el("activation-fallback");
    if (fallback) {
      fallback.hidden = false;
      fallback.textContent = message || "No fue posible cargar oportunidades de activación desde JSON público. Se usa fallback estratégico.";
    }
  };

  const hideActivationFallback = () => {
    const fallback = el("activation-fallback");
    if (fallback) fallback.hidden = true;
  };

  const getFallbackActivationOpportunities = () => ([
    {
      title: "Artistas emergentes + visualistas",
      network_type: "colaboración creativa",
      priority: "alta",
      complexity: "media",
      why_it_matters: "La mezcla de escena emergente y capacidades visuales acelera prototipos de obra y mejora visibilidad de circuitos locales.",
      risk: "Quedar en colaboraciones tácticas sin continuidad editorial ni calendario de circulación.",
      suggested_action: "Levantar una mesa trimestral con desafíos curatoriales compartidos y una cartera breve de pilotos colaborativos.",
      tracking_indicator: "Número de pilotos co-creados y porcentaje que llega a muestra pública."
    },
    {
      title: "Gestores territoriales + espacios culturales",
      network_type: "articulación territorial",
      priority: "alta",
      complexity: "media",
      why_it_matters: "Conecta oferta programática con infraestructura de barrio y reduce fricción para implementar actividades distribuidas.",
      risk: "Sobrecarga de pocos espacios ancla y baja cobertura de comunas periféricas.",
      suggested_action: "Diseñar calendario rotativo de activaciones por territorio con cupos de co-producción.",
      tracking_indicator: "Cobertura territorial de activaciones y tasa de ocupación de espacios aliados."
    },
    {
      title: "Productores + comunicadores digitales",
      network_type: "aceleración de circulación",
      priority: "alta",
      complexity: "baja",
      why_it_matters: "Mejora conversión entre producción cultural y difusión, aumentando alcance efectivo de iniciativas colectivas.",
      risk: "Dependencia de difusión fragmentada sin narrativa común de ecosistema.",
      suggested_action: "Implementar sprint de contenidos por hito programático con pauta mínima y métricas compartidas.",
      tracking_indicator: "Alcance agregado por hito y tasa de interacción sobre publicaciones colaborativas."
    },
    {
      title: "Nodos puente + actores periféricos",
      network_type: "cohesión de red",
      priority: "media",
      complexity: "alta",
      why_it_matters: "Reduce aislamiento en bordes de la red y fortalece circulación de conocimiento entre perfiles con menor conectividad.",
      risk: "Intermediación excesiva de pocos nodos y fatiga de coordinación.",
      suggested_action: "Activar rondas de matchmaking temático con facilitación liviana y objetivos de transferencia explícitos.",
      tracking_indicator: "Cantidad de vínculos nuevos sostenidos a 90 días entre nodos puente y periferia."
    },
    {
      title: "Perfiles con alta motivación colaborativa + baja red actual",
      network_type: "inclusión colaborativa",
      priority: "alta",
      complexity: "media",
      why_it_matters: "Existe disposición para colaborar que hoy no se traduce en red efectiva; activar ese gap aumenta densidad colaborativa.",
      risk: "Frustración por expectativas altas sin mecanismos de entrada concretos.",
      suggested_action: "Crear cohortes cortas de onboarding colaborativo con mentoría entre pares y objetivos de proyecto.",
      tracking_indicator: "Participantes con baja red que concretan al menos una colaboración activa en 60 días."
    },
    {
      title: "Formación + profesionalización",
      network_type: "desarrollo de capacidades",
      priority: "media",
      complexity: "baja",
      why_it_matters: "Alinea motivaciones mayoritarias del ecosistema con rutas de aprendizaje aplicadas a sostenibilidad laboral.",
      risk: "Capacitaciones desconectadas de necesidades reales de implementación.",
      suggested_action: "Diseñar cápsulas prácticas con resolución de casos y acompañamiento de implementación.",
      tracking_indicator: "Porcentaje de participantes que aplica herramientas aprendidas en proyectos concretos."
    },
    {
      title: "Escena electrónica + institucionalidad cultural",
      network_type: "puente sectorial",
      priority: "media",
      complexity: "alta",
      why_it_matters: "Acerca prácticas de escena independiente a marcos institucionales, ampliando legitimidad y acceso a recursos.",
      risk: "Desalineación de tiempos y criterios entre dinámica de escena e institucionalidad.",
      suggested_action: "Pilotear una mesa bimensual de agenda compartida con criterios de co-diseño y evaluación temprana.",
      tracking_indicator: "Número de iniciativas co-diseñadas escena-institución que avanzan a ejecución."
    }
  ]);

  const normalizeActivationOpportunities = (payload) => {
    const sanitizeActivationText = (value, fallback = "") =>
      cleanSafeText(asText(value, fallback))
        .replace(/@[a-z0-9._]{2,30}/gi, "[dato excluido]")
        .replace(/instagram\.com\/[^\s)]+/gi, "[dato excluido]");

    const rawItems = Array.isArray(payload)
      ? payload
      : Array.isArray(payload && payload.opportunities)
        ? payload.opportunities
        : Array.isArray(payload && payload.items)
          ? payload.items
          : [];

    return rawItems
      .map((item) => ({
        title: sanitizeActivationText(item && item.title, ""),
        network_type: asText(item && item.network_type, "colaboración"),
        priority: asText(item && item.priority, "media"),
        complexity: asText(item && item.complexity, "media"),
        why_it_matters: sanitizeActivationText(item && item.why_it_matters, ""),
        risk: sanitizeActivationText(item && item.risk, ""),
        suggested_action: sanitizeActivationText(item && item.suggested_action, ""),
        tracking_indicator: sanitizeActivationText(item && item.tracking_indicator, "Sin indicador definido")
      }))
      .filter((item) => item.title);
  };

  const renderActivationOpportunities = (items) => {
    const node = el("activation-opportunity-cards");
    if (!node) return;
    if (!Array.isArray(items) || !items.length) {
      node.innerHTML = '<article class="activation-card"><p class="muted">Sin oportunidades para mostrar.</p></article>';
      return;
    }

    node.innerHTML = items.map((item, index) => (
      '<article class="activation-card">' +
        "<h4>" + escapeHtml(item.title) + "</h4>" +
        '<div class="activation-meta">' +
          "<span>Tipo de red: " + escapeHtml(item.network_type) + "</span>" +
          "<span>Prioridad: " + escapeHtml(item.priority) + "</span>" +
          "<span>Complejidad: " + escapeHtml(item.complexity) + "</span>" +
        "</div>" +
        "<p><strong>Por qué importa:</strong> " + escapeHtml(item.why_it_matters) + "</p>" +
        "<p><strong>Riesgo:</strong> " + escapeHtml(item.risk) + "</p>" +
        "<p><strong>Acción sugerida:</strong> " + escapeHtml(item.suggested_action) + "</p>" +
        "<p><strong>Indicador:</strong> " + escapeHtml(item.tracking_indicator) + "</p>" +
        "<p class=\"muted\">Oportunidad #" + escapeHtml(index + 1) + "</p>" +
      "</article>"
    )).join("");
  };

  const renderActivationMatrix = (items) => {
    const body = el("activation-matrix-body");
    if (!body) return;
    if (!Array.isArray(items) || !items.length) {
      body.innerHTML = '<tr><td colspan="5">Sin oportunidades para mostrar.</td></tr>';
      return;
    }

    body.innerHTML = items.map((item) => (
      "<tr>" +
        "<td>" + escapeHtml(item.title) + "</td>" +
        "<td>" + escapeHtml(item.priority) + "</td>" +
        "<td>" + escapeHtml(item.complexity) + "</td>" +
        "<td>" + escapeHtml(item.network_type) + "</td>" +
        "<td>" + escapeHtml(item.tracking_indicator) + "</td>" +
      "</tr>"
    )).join("");
  };

  const loadActivationSection = async () => {
    try {
      const response = await fetch(ACTIVATION_DATA_PATH, { cache: "no-cache" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const payload = await response.json();
      const items = normalizeActivationOpportunities(payload);
      if (!items.length) {
        const fallbackItems = getFallbackActivationOpportunities();
        showActivationFallback("JSON público sin oportunidades válidas. Se usa fallback estratégico.");
        renderActivationOpportunities(fallbackItems);
        renderActivationMatrix(fallbackItems);
        return;
      }
      hideActivationFallback();
      renderActivationOpportunities(items);
      renderActivationMatrix(items);
    } catch (error) {
      console.warn("No fue posible cargar activación de redes:", error);
      const fallbackItems = getFallbackActivationOpportunities();
      showActivationFallback("No fue posible cargar oportunidades de activación desde JSON público. Se usa fallback estratégico.");
      renderActivationOpportunities(fallbackItems);
      renderActivationMatrix(fallbackItems);
    }
  };

  const renderDetail = (row) => {
    const empty = el("detail-empty");
    const list = el("detail-list");
    if (!row) {
      empty.hidden = false;
      list.hidden = true;
      return;
    }

    empty.hidden = true;
    list.hidden = false;
    el("d-nombre").textContent = row.nombre;
    const orgItem = el("d-organizacion-item");
    orgItem.hidden = !row.organizacion;
    el("d-organizacion").textContent = row.organizacion;
    el("d-territorio").textContent = row.territorio;
    el("d-macroperfil").textContent = row.macroperfil;
    el("d-areas").textContent = row.areas.join(", ") || "Sin áreas declaradas";
    el("d-motivaciones").textContent = row.motivaciones.join(", ") || "Sin motivaciones declaradas";
    const instagramItem = el("d-instagram-item");
    const instagramText = row.instagram.length > 32 ? row.instagram.slice(0, 29) + "..." : row.instagram;
    instagramItem.hidden = !row.instagram;
    el("d-instagram").textContent = row.instagram ? instagramText : "";
    el("d-resumen").textContent = row.resumen;
  };

  const rowHtml = (row) => {
    const isActive = row.id === selectedId;
    const activeClass = isActive ? "active" : "";
    return (
      '<tr data-id="' + row.id + '" class="' + activeClass + '" tabindex="0" role="button" aria-pressed="' + (isActive ? "true" : "false") + '" aria-label="Ver detalle de ' + escapeHtml(row.nombre) + '">' +
      '<td title="' + escapeHtml(row.nombre) + '">' + escapeHtml(row.nombre) + "</td>" +
      '<td title="' + escapeHtml(row.territorio) + '">' + escapeHtml(row.territorio) + "</td>" +
      '<td title="' + escapeHtml(row.macroperfil) + '">' + escapeHtml(row.macroperfil) + "</td>" +
      '<td title="' + escapeHtml(row.areas.join(", ")) + '">' + escapeHtml(row.areas.join(", ") || "-") + "</td>" +
      '<td title="' + escapeHtml(row.motivacionPrincipal) + '">' + escapeHtml(row.motivacionPrincipal) + "</td>" +
      "</tr>"
    );
  };

  const selectParticipant = (id, restoreFocus = false) => {
    selectedId = id;
    renderTable();
    renderDetail(filtered.find((item) => item.id === selectedId) || rows.find((item) => item.id === selectedId));
    if (restoreFocus) {
      const activeRow = document.querySelector('#tabla-body tr[data-id="' + id + '"]');
      if (activeRow) activeRow.focus();
    }
  };

  const renderTable = () => {
    const body = el("tabla-body");
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);
    const start = (currentPage - 1) * pageSize;
    const pageRows = filtered.slice(start, start + pageSize);

    body.innerHTML = pageRows.length
      ? pageRows.map((row) => rowHtml(row)).join("")
      : '<tr><td colspan="5">Sin registros para los filtros activos.</td></tr>';

    Array.from(body.querySelectorAll("tr[data-id]")).forEach((tr) => {
      tr.addEventListener("click", () => selectParticipant(Number(tr.getAttribute("data-id"))));
      tr.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;
        event.preventDefault();
        selectParticipant(Number(tr.getAttribute("data-id")), true);
      });
    });

    const visibleStart = filtered.length ? start + 1 : 0;
    const visibleEnd = Math.min(start + pageSize, filtered.length);
    el("pagination-status").textContent = visibleStart + "–" + visibleEnd + " de " + filtered.length;
    el("prev-page").disabled = currentPage <= 1;
    el("next-page").disabled = currentPage >= totalPages;
  };

  const applyFilters = (preservePage = false) => {
    if (!preservePage) currentPage = 1;
    const q = el("search-input").value.trim().toLowerCase();
    const region = el("region-filter").value;
    const motivacion = el("motivacion-filter").value;
    const perfil = el("perfil-filter").value;
    const area = el("area-filter").value;

    filtered = rows.filter((row) => {
      if (region && row.region !== region) return false;
      if (motivacion && row.motivacionPrincipalRaw !== motivacion) return false;
      if (perfil && row.macroperfil !== perfil) return false;
      if (area && row.areaPrincipal !== area) return false;
      if (!q) return true;

      const haystack = [
        row.nombre,
        row.territorio,
        row.region,
        row.macroperfil,
        row.perfilInter,
        row.areas.join(" "),
        row.motivaciones.join(" ")
      ].join(" ").toLowerCase();

      return haystack.includes(q);
    });

    if (!filtered.find((item) => item.id === selectedId)) {
      selectedId = filtered[0] ? filtered[0].id : null;
    }

    renderTable();
    renderDetail(filtered.find((item) => item.id === selectedId));
    renderCharts();
  };

  const optionHtml = (value, label) => '<option value="' + escapeHtml(value) + '">' + escapeHtml(label) + "</option>";

  const initFilters = () => {
    const regionSelect = el("region-filter");
    const motivacionSelect = el("motivacion-filter");
    const perfilSelect = el("perfil-filter");
    const areaSelect = el("area-filter");
    const regions = Array.from(new Set(rows.map((item) => item.region))).sort();
    const motivations = Array.from(new Set(rows.map((item) => item.motivacionPrincipalRaw).filter(Boolean))).sort();
    const perfiles = Array.from(new Set(rows.map((item) => item.macroperfil))).sort();
    const areas = Array.from(new Set(rows.map((item) => item.areaPrincipal).filter(Boolean))).sort();

    regionSelect.innerHTML = '<option value="">Todas las regiones</option>' + regions.map((value) => optionHtml(value, value)).join("");
    motivacionSelect.innerHTML = '<option value="">Todas las motivaciones</option>' + motivations.map((value) => optionHtml(value, normalizeTextToken(value))).join("");
    perfilSelect.innerHTML = '<option value="">Todos los tipos de perfil</option>' + perfiles.map((value) => optionHtml(value, value)).join("");
    areaSelect.innerHTML = '<option value="">Todas las áreas</option>' + areas.map((value) => optionHtml(value, value)).join("");

    el("search-input").addEventListener("input", () => applyFilters());
    regionSelect.addEventListener("change", () => applyFilters());
    motivacionSelect.addEventListener("change", () => applyFilters());
    perfilSelect.addEventListener("change", () => applyFilters());
    areaSelect.addEventListener("change", () => applyFilters());
    el("prev-page").addEventListener("click", () => {
      currentPage -= 1;
      applyFilters(true);
    });
    el("next-page").addEventListener("click", () => {
      currentPage += 1;
      applyFilters(true);
    });
  };

  const showChartFallback = () => {
    Array.from(document.querySelectorAll(".chart-canvas")).forEach((node) => {
      node.textContent = "No fue posible cargar ECharts en este entorno.";
      node.style.display = "grid";
      node.style.placeItems = "center";
      node.style.color = "#a1a1aa";
      node.style.border = "1px dashed #2d2d35";
      node.style.borderRadius = "10px";
      node.style.padding = "12px";
    });
  };

  const boot = async () => {
    try {
      const response = await fetch(DATA_PATH, { cache: "no-cache" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = await response.json();
      sourceData = data;
      const baseRows = Array.isArray(data.participantes)
        ? data.participantes
        : Array.isArray(data.observed_data && data.observed_data.table_rows)
          ? data.observed_data.table_rows
          : [];
      rows = baseRows.map(normalizeRow);

      filtered = rows.slice();
      renderKpis();
      initFilters();
      applyFilters();
      await loadHybridSection();
      await loadActivationSection();

      if (typeof echarts === "undefined") {
        showChartFallback();
      } else {
        window.addEventListener("resize", () => {
          Object.values(charts).forEach((bucket) => {
            if (!Array.isArray(bucket)) return;
            bucket.forEach((chart) => chart.resize());
          });
        });
      }
    } catch (error) {
      console.error("Error cargando datos del caso:", error);
      el("tabla-body").innerHTML = '<tr><td colspan="5">No fue posible cargar el dataset público seguro.</td></tr>';
      renderDetail(null);
      showHybridFallback("No fue posible cargar la base principal para activar segmentación híbrida.");
      showChartFallback();
    }
  };

  boot();
})();
