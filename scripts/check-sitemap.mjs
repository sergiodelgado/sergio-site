// scripts/check-sitemap.mjs
// Valida que el sitemap exista, que tenga <lastmod> no vacíos
// y que ninguna fecha sea futura.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function parseLastmodDates(xml) {
  const regex = /<lastmod>(.*?)<\/lastmod>/g;
  const dates = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    dates.push(match[1]);
  }
  return dates;
}

function isFuture(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return true; // fecha inválida = error
  const today = new Date();
  // Compara solo fecha (no hora)
  const dOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const tOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return dOnly > tOnly;
}

function main() {
  const sitemapPath = resolve("sitemap.xml");
  let xml;
  try {
    xml = readFileSync(sitemapPath, "utf8");
  } catch (err) {
    console.error("❌ No se pudo leer sitemap.xml:", err.message);
    process.exit(1);
  }

  const lastmods = parseLastmodDates(xml);
  if (lastmods.length === 0) {
    console.error("❌ sitemap.xml no contiene etiquetas <lastmod>.");
    process.exit(1);
  }

  let hasError = false;
  for (const lm of lastmods) {
    if (isFuture(lm)) {
      console.error(`❌ <lastmod> futura o inválida detectada: ${lm}`);
      hasError = true;
    }
  }

  if (hasError) {
    process.exit(1);
  } else {
    console.log("✅ sitemap.xml OK (sin fechas futuras).");
  }
}

main();
