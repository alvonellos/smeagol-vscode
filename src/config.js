"use strict";

const vscode = require("vscode");
const { DEFAULT_PALETTE, DEFAULT_EXCLUDE } = require("./constants");
const {
  sanitizeStringArray,
  sanitizeColorArray,
  toNumber,
  toOpacity
} = require("./utils");

function getConfig() {
  const config = vscode.workspace.getConfiguration("smeagol");

  const performance = {
    refreshDelayMs: toNumber(config.get("performance.refreshDelayMs"), 120),
    maxDocumentLength: toNumber(config.get("performance.maxDocumentLength"), 400000),
    maxLineCount: toNumber(config.get("performance.maxLineCount"), 10000)
  };

  const highlights = {
    enabled: !!config.get("highlights.enabled", true),
    colors: sanitizeColorArray(config.get("highlights.colors"), DEFAULT_PALETTE),
    minOccurrences: toNumber(config.get("highlights.minOccurrences"), 2),
    minLength: toNumber(config.get("highlights.minLength"), 2),
    maxTokens: toNumber(config.get("highlights.maxTokens"), 120),
    backgroundOpacity: toOpacity(config.get("highlights.backgroundOpacity"), 0.16),
    borderOpacity: toOpacity(config.get("highlights.borderOpacity"), 0.65),
    borderWidth: toNumber(config.get("highlights.borderWidth"), 1),
    borderRadius: toNumber(config.get("highlights.borderRadius"), 2),
    exclude: sanitizeStringArray(config.get("highlights.exclude"), DEFAULT_EXCLUDE),
    ignoreLanguages: sanitizeStringArray(config.get("highlights.ignoreLanguages"), [])
  };

  const indent = {
    enabled: !!config.get("indent.enabled", true),
    colors: sanitizeColorArray(config.get("indent.colors"), DEFAULT_PALETTE),
    indentOpacity: toOpacity(config.get("indent.indentOpacity"), 0.18),
    lineOpacity: toOpacity(config.get("indent.lineOpacity"), 0.08),
    style: config.get("indent.style", "both"),
    ignoreLanguages: sanitizeStringArray(config.get("indent.ignoreLanguages"), [])
  };

  const functionsConfig = {
    enabled: !!config.get("functions.enabled", true),
    colors: sanitizeColorArray(config.get("functions.colors"), DEFAULT_PALETTE),
    minOccurrences: toNumber(config.get("functions.minOccurrences"), 2),
    minLength: toNumber(config.get("functions.minLength"), 2),
    maxSymbols: toNumber(config.get("functions.maxSymbols"), 200),
    requireDefinitionAndCall: !!config.get("functions.requireDefinitionAndCall", true),
    highlightStyle: config.get("functions.highlightStyle", "line"),
    backgroundOpacity: toOpacity(config.get("functions.backgroundOpacity"), 0.12),
    borderOpacity: toOpacity(config.get("functions.borderOpacity"), 0.55),
    borderWidth: toNumber(config.get("functions.borderWidth"), 1),
    borderRadius: toNumber(config.get("functions.borderRadius"), 2),
    includeLanguages: sanitizeStringArray(config.get("functions.includeLanguages"), [])
  };

  const html = {
    enabled: !!config.get("html.enabled", true),
    colors: sanitizeColorArray(config.get("html.colors"), DEFAULT_PALETTE),
    delimiterOpacity: toOpacity(config.get("html.delimiterOpacity"), 0.7),
    includeLanguages: sanitizeStringArray(config.get("html.includeLanguages"), [
      "html",
      "javascriptreact",
      "typescriptreact",
      "javascript",
      "typescript"
    ]),
    taggedTemplateNames: sanitizeStringArray(config.get("html.taggedTemplateNames"), ["html"])
  };

  const brackets = {
    enabled: !!config.get("brackets.enabled", true),
    colors: sanitizeColorArray(config.get("brackets.colors"), DEFAULT_PALETTE),
    style: config.get("brackets.style", "bracket"),
    lineWidth: toNumber(config.get("brackets.lineWidth"), 1),
    lineOpacity: toOpacity(config.get("brackets.lineOpacity"), 0.5)
  };

  const rust = {
    enabled: !!config.get("rust.enabled", true)
  };

  const java = {
    enabled: !!config.get("java.enabled", true)
  };

  return {
    enabled: !!config.get("enabled", true),
    performance,
    highlights,
    indent,
    functions: functionsConfig,
    html,
    brackets,
    rust,
    java
  };
}

module.exports = { getConfig };
