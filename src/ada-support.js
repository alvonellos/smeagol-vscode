"use strict";

const ADA_LANGUAGE_IDS = new Set(["ada"]);
const ADA_FILE_EXTENSIONS = [".adb", ".ads", ".ada", ".adc"];
const ADA_DOCUMENT_SELECTORS = [
  { language: "ada", scheme: "file" },
  ...ADA_FILE_EXTENSIONS.map((extension) => ({
    scheme: "file",
    pattern: `**/*${extension}`
  }))
];

function isAdaFileName(fileName) {
  const normalized = String(fileName || "").toLowerCase();
  return ADA_FILE_EXTENSIONS.some((extension) => normalized.endsWith(extension));
}

function isAdaDocument(document) {
  const languageId = String(document && document.languageId || "").toLowerCase();
  if (ADA_LANGUAGE_IDS.has(languageId)) {
    return true;
  }

  return isAdaFileName(document && document.fileName);
}

module.exports = {
  ADA_LANGUAGE_IDS,
  ADA_FILE_EXTENSIONS,
  ADA_DOCUMENT_SELECTORS,
  isAdaDocument,
  isAdaFileName
};
