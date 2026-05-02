#!/usr/bin/env python3
"""Build a public-safe aggregated payload for hybrid clustering visualizations."""

from __future__ import annotations

import argparse
import csv
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any


REQUIRED_FILES = (
    "participants_hybrid_clusters.csv",
    "hybrid_clusters_summary.csv",
    "hybrid_clusters_description.csv",
    "hybrid_clusters_strategic.csv",
    "hybrid_k_metrics.csv",
    "hybrid_clustering_report.md",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build public aggregated payload from clustering_hybrid_v4 outputs."
    )
    parser.add_argument(
        "--input-dir",
        type=Path,
        default=None,
        help="Directory containing clustering_hybrid_v4 files.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("data/modulo_00_participantes_hybrid_clusters.json"),
        help="Output JSON path.",
    )
    return parser.parse_args()


def read_csv_rows(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def to_float(value: Any) -> float | None:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def to_int(value: Any) -> int | None:
    number = to_float(value)
    if number is None:
        return None
    if number.is_integer():
        return int(number)
    return None


def normalize_match(value: Any) -> str:
    text = str(value or "").strip().lower()
    if text in {"1", "true", "yes", "si", "sí"}:
        return "match_found"
    if text in {"0", "false", "no"}:
        return "match_not_found"
    return "unknown"


def ensure_input_dir(path: Path) -> bool:
    return path.exists() and all((path / name).exists() for name in REQUIRED_FILES)


def resolve_input_dir(cli_path: Path | None) -> Path:
    if cli_path is not None:
        candidate = cli_path.expanduser().resolve()
        if not ensure_input_dir(candidate):
            raise FileNotFoundError(
                f"Input dir inválido: {candidate}. Debe contener: {', '.join(REQUIRED_FILES)}"
            )
        return candidate

    cwd = Path.cwd()
    candidates = [
        cwd / "outputs" / "analytics" / "clustering_hybrid_v4",
        cwd / "outputs" / "clustering_hybrid_v4",
        cwd / "data" / "insights" / "clustering_hybrid_v4",
        Path.home() / "Documents" / "CRBB2" / "data" / "insights" / "clustering_hybrid_v4",
    ]
    for candidate in candidates:
        if ensure_input_dir(candidate):
            return candidate.resolve()

    raise FileNotFoundError(
        "No se encontró carpeta clustering_hybrid_v4. Usa --input-dir para indicar la ruta."
    )


def parse_report_metrics(report_path: Path) -> tuple[int | None, float | None]:
    text = report_path.read_text(encoding="utf-8")
    selected_match = re.search(r"k seleccionado:\s*(\d+)", text, flags=re.IGNORECASE)
    silhouette_match = re.search(
        r"silhouette final:\s*([0-9]+(?:\.[0-9]+)?)", text, flags=re.IGNORECASE
    )
    selected_k = int(selected_match.group(1)) if selected_match else None
    silhouette = float(silhouette_match.group(1)) if silhouette_match else None
    return selected_k, silhouette


def parse_table_rows(
    rows: list[dict[str, str]],
    int_fields: set[str] | None = None,
    float_fields: set[str] | None = None,
) -> list[dict[str, Any]]:
    int_fields = int_fields or set()
    float_fields = float_fields or set()
    parsed: list[dict[str, Any]] = []
    for row in rows:
        out: dict[str, Any] = {}
        for key, raw_value in row.items():
            value = (raw_value or "").strip()
            if key in int_fields:
                out[key] = to_int(value)
            elif key in float_fields:
                out[key] = to_float(value)
            elif key == "cluster":
                out[key] = to_int(value) if to_int(value) is not None else value
            else:
                out[key] = value
        parsed.append(out)
    return parsed


def build_composition(participants: list[dict[str, str]]) -> dict[str, list[dict[str, Any]]]:
    totals_by_cluster: Counter[Any] = Counter()
    by_macroperfil: Counter[tuple[Any, str]] = Counter()
    by_perfil: Counter[tuple[Any, str]] = Counter()
    by_region: Counter[tuple[Any, str]] = Counter()
    by_instagram: Counter[tuple[Any, str]] = Counter()

    for row in participants:
        cluster = to_int(row.get("cluster"))
        cluster_value: Any = cluster if cluster is not None else (row.get("cluster") or "unknown")
        totals_by_cluster[cluster_value] += 1

        macroperfil = (row.get("macroperfil") or "").strip() or "sin_dato"
        perfil = (row.get("perfil_interdisciplinario") or "").strip() or "sin_dato"
        region = (row.get("region") or "").strip() or "sin_dato"
        instagram_match = normalize_match(row.get("instagram_match_found"))

        by_macroperfil[(cluster_value, macroperfil)] += 1
        by_perfil[(cluster_value, perfil)] += 1
        by_region[(cluster_value, region)] += 1
        by_instagram[(cluster_value, instagram_match)] += 1

    def to_rows(counter: Counter[tuple[Any, str]], label_key: str) -> list[dict[str, Any]]:
        rows_out: list[dict[str, Any]] = []
        for (cluster, label), count in counter.items():
            total = totals_by_cluster[cluster] or 1
            rows_out.append(
                {
                    "cluster": cluster,
                    label_key: label,
                    "count": count,
                    "pct_cluster": round((count / total) * 100.0, 2),
                }
            )
        rows_out.sort(
            key=lambda item: (
                int(item["cluster"]) if isinstance(item["cluster"], int) else 999,
                -int(item["count"]),
                str(item[label_key]),
            )
        )
        return rows_out

    return {
        "by_macroperfil": to_rows(by_macroperfil, "macroperfil"),
        "by_perfil_interdisciplinario": to_rows(by_perfil, "perfil_interdisciplinario"),
        "by_region": to_rows(by_region, "region"),
        "by_instagram_match": to_rows(by_instagram, "instagram_match"),
    }


def build_scatter_public(participants: list[dict[str, str]]) -> list[dict[str, Any]]:
    scatter: list[dict[str, Any]] = []
    for index, row in enumerate(participants, start=1):
        item: dict[str, Any] = {
            "anon_id": f"P{index:03d}",
            "cluster": to_int(row.get("cluster")),
            "analytic_index": to_float(row.get("analytic_index")),
            "digital_index": to_float(row.get("digital_index")),
            "hybrid_gap": to_float(row.get("hybrid_gap")),
        }
        areas_count = to_int(row.get("areas_count"))
        if areas_count is not None:
            item["areas_count"] = areas_count
        macroperfil = (row.get("macroperfil") or "").strip()
        if macroperfil:
            item["macroperfil"] = macroperfil
        perfil = (row.get("perfil_interdisciplinario") or "").strip()
        if perfil:
            item["perfil_interdisciplinario"] = perfil
        region = (row.get("region") or "").strip()
        if region:
            item["region"] = region
        instagram_match_raw = row.get("instagram_match_found")
        if instagram_match_raw is not None and str(instagram_match_raw).strip() != "":
            match_flag = to_int(instagram_match_raw)
            item["instagram_match_found"] = (
                match_flag if match_flag is not None else normalize_match(instagram_match_raw)
            )
        scatter.append(item)
    return scatter


def select_k(
    k_metrics: list[dict[str, str]], selected_from_report: int | None
) -> tuple[int | None, float | None]:
    if selected_from_report is not None:
        row = next((item for item in k_metrics if to_int(item.get("k")) == selected_from_report), None)
        if row:
            return selected_from_report, to_float(row.get("silhouette"))
        return selected_from_report, None

    eligible = [
        item
        for item in k_metrics
        if (to_int(item.get("min_cluster_size")) or 0) >= 3 and to_float(item.get("silhouette")) is not None
    ]
    if not eligible:
        return None, None
    best = max(eligible, key=lambda item: to_float(item.get("silhouette")) or float("-inf"))
    return to_int(best.get("k")), to_float(best.get("silhouette"))


def main() -> None:
    args = parse_args()
    input_dir = resolve_input_dir(args.input_dir)

    participants = read_csv_rows(input_dir / "participants_hybrid_clusters.csv")
    cluster_summary_rows = read_csv_rows(input_dir / "hybrid_clusters_summary.csv")
    cluster_description_rows = read_csv_rows(input_dir / "hybrid_clusters_description.csv")
    cluster_strategic_rows = read_csv_rows(input_dir / "hybrid_clusters_strategic.csv")
    k_metrics_rows = read_csv_rows(input_dir / "hybrid_k_metrics.csv")

    selected_from_report, silhouette_from_report = parse_report_metrics(
        input_dir / "hybrid_clustering_report.md"
    )
    selected_k, silhouette_selected_row = select_k(k_metrics_rows, selected_from_report)
    silhouette_final = silhouette_from_report if silhouette_from_report is not None else silhouette_selected_row

    payload = {
        "metadata": {
            "source": "clustering_hybrid_v4",
            "total_participants": len(participants),
            "selected_k": selected_k,
            "silhouette_final": round(silhouette_final, 4) if silhouette_final is not None else None,
            "method_note": (
                "Segmentación exploratoria basada en índices analíticos y digitales. "
                "k=2 fue seleccionado por criterio de cluster mínimo >= 3."
            ),
        },
        "cluster_summary": parse_table_rows(
            cluster_summary_rows,
            int_fields={"cluster", "n_participants"},
            float_fields={
                "score_formacion",
                "score_redes",
                "score_colaboracion",
                "score_profesionalizacion",
                "score_circulacion",
                "score_territorio",
                "digital_reach_score",
                "engagement_score",
                "activity_score",
                "network_visibility_score",
                "analytic_index",
                "digital_index",
                "hybrid_gap",
            },
        ),
        "cluster_description": parse_table_rows(
            cluster_description_rows,
            int_fields={"cluster", "n_participants"},
            float_fields={"areas_count_mean", "instagram_match_rate"},
        ),
        "cluster_strategic": parse_table_rows(
            cluster_strategic_rows,
            int_fields={"cluster", "n_participants"},
            float_fields={"analytic_index_mean", "digital_index_mean", "hybrid_gap_mean"},
        ),
        "k_metrics": parse_table_rows(
            k_metrics_rows,
            int_fields={"k", "min_cluster_size", "max_cluster_size"},
            float_fields={"inertia", "silhouette"},
        ),
        "composition": build_composition(participants),
        "scatter_public": build_scatter_public(participants),
    }

    output_path = args.output.resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Payload generado: {output_path}")
    print(f"Fuente: {input_dir}")


if __name__ == "__main__":
    main()
