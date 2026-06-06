// scripts/check-public-data-privacy.mjs
// Gate conservador para detectar PII evidente en JSON publicos directos de data/.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const DATA_DIR = resolve("data");
const LONG_TEXT_LIMIT = 280;

const FORBIDDEN_KEYS = new Set([
  "address",
  "correo",
  "direccion",
  "dirección",
  "email",
  "phone",
  "rut",
  "telefono",
  "teléfono",
]);

const LONG_TEXT_ALLOWED_KEYS = new Set([
  "action",
  "accion",
  "acción",
  "description",
  "descripcion",
  "descripción",
  "indicator",
  "method_note",
  "note",
  "notes",
  "razon",
  "razón",
  "reason",
  "resumen",
  "risk",
  "rules",
  "safe_summary",
  "summary",
  "suggested_action",
  "why_it_matters",
]);

const PRIVACY_DOC_PATHS = [
  ".privacy.excluded_columns",
  ".privacy.rules",
];

const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const RUT_REGEX = /\b(?:\d{1,2}\.?\d{3}\.?\d{3}|\d{7,8})-?[\dkK]\b/;
const CHILE_PHONE_REGEX = /(?:\+?56[\s.-]*)?(?:\(?0?9\)?[\s.-]*)\d{4}[\s.-]*\d{4}\b|\b(?:\+?56[\s.-]*)?(?:2|3[2-5]|4[1-5]|5[1-8]|6[1-9]|7[1-3])[\s.-]*\d{3,4}[\s.-]*\d{4}\b/;

function isPrivacyDocumentationPath(path) {
  return PRIVACY_DOC_PATHS.some((allowed) => path.startsWith(allowed));
}

function isForbiddenKey(key) {
  return FORBIDDEN_KEYS.has(String(key).trim().toLowerCase());
}

function isLongTextAllowedKey(key) {
  const normalized = String(key || "").trim().toLowerCase();
  return LONG_TEXT_ALLOWED_KEYS.has(normalized);
}

function listPublicJsonFiles() {
  return readdirSync(DATA_DIR)
    .filter((name) => name.endsWith(".json"))
    .map((name) => join(DATA_DIR, name))
    .filter((path) => statSync(path).isFile())
    .sort();
}

function addFinding(findings, type, path, detail) {
  findings.push({ type, path, detail });
}

function checkString(value, path, key, findings) {
  if (isPrivacyDocumentationPath(path)) return;

  if (EMAIL_REGEX.test(value)) {
    addFinding(findings, "email", path, "Patron de email detectado.");
  }
  if (RUT_REGEX.test(value)) {
    addFinding(findings, "rut", path, "Patron de RUT chileno detectado.");
  }
  if (CHILE_PHONE_REGEX.test(value)) {
    addFinding(findings, "telefono", path, "Patron de telefono chileno detectado.");
  }

  const compactText = value.replace(/\s+/g, " ").trim();
  if (
    compactText.length > LONG_TEXT_LIMIT &&
    !isLongTextAllowedKey(key) &&
    !isPrivacyDocumentationPath(path)
  ) {
    addFinding(
      findings,
      "texto_largo",
      path,
      `Texto largo en campo no narrativo (${compactText.length} caracteres).`
    );
  }
}

function walk(value, path, findings, key = "") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${path}[${index}]`, findings, key));
    return;
  }

  if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) {
      const childPath = `${path}.${childKey}`;
      if (isForbiddenKey(childKey) && !isPrivacyDocumentationPath(childPath)) {
        addFinding(findings, "clave_prohibida", childPath, `Clave prohibida: ${childKey}`);
      }
      walk(childValue, childPath, findings, childKey);
    }
    return;
  }

  if (typeof value === "string") {
    checkString(value, path, key, findings);
  }
}

function main() {
  const files = listPublicJsonFiles();
  const allFindings = [];

  console.log("Archivos revisados:");
  for (const file of files) {
    console.log(`- ${file}`);
    let parsed;
    try {
      parsed = JSON.parse(readFileSync(file, "utf8"));
    } catch (error) {
      addFinding(allFindings, "json_invalido", file, error.message);
      continue;
    }
    walk(parsed, "", allFindings);
  }

  console.log("\nHallazgos:");
  if (allFindings.length === 0) {
    console.log("- Sin hallazgos.");
    console.log("\nResultado final: OK. No se detecto PII evidente en data/*.json.");
    return;
  }

  for (const finding of allFindings) {
    console.log(`- [${finding.type}] ${finding.path || "(root)"}: ${finding.detail}`);
  }
  console.log("\nResultado final: ERROR. Se detectaron posibles riesgos de privacidad.");
  process.exit(1);
}

main();
