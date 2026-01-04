"use strict";

const vscode = require("vscode");

function sanitizeStringArray(value, fallback) {
  if (!Array.isArray(value)) {
    return fallback.slice();
  }
  return value
    .map((item) => String(item))
    .filter((item) => item.length > 0);
}

function sanitizeColorArray(value, fallback) {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback.slice();
  }
  return value
    .map((item) => String(item))
    .filter((item) => item.length > 0);
}

function toNumber(value, fallback) {
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }
  const parsed = Number(value);
  if (!isNaN(parsed)) {
    return parsed;
  }
  return fallback;
}

function clamp(value, min, max) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function toOpacity(value, fallback) {
  return clamp(toNumber(value, fallback), 0, 1);
}

function parseColor(color) {
  if (!color || typeof color !== "string") {
    return null;
  }

  const shortHex = /^#([0-9a-fA-F]{3})$/.exec(color);
  if (shortHex) {
    const hex = shortHex[1];
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16)
    };
  }

  const hex = /^#([0-9a-fA-F]{6})$/.exec(color);
  if (hex) {
    return {
      r: parseInt(hex[1].slice(0, 2), 16),
      g: parseInt(hex[1].slice(2, 4), 16),
      b: parseInt(hex[1].slice(4, 6), 16)
    };
  }

  const rgb = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(color);
  if (rgb) {
    return {
      r: parseInt(rgb[1], 10),
      g: parseInt(rgb[2], 10),
      b: parseInt(rgb[3], 10)
    };
  }

  const rgba = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)$/.exec(color);
  if (rgba) {
    return {
      r: parseInt(rgba[1], 10),
      g: parseInt(rgba[2], 10),
      b: parseInt(rgba[3], 10)
    };
  }

  return null;
}

function toRgba(color, opacity) {
  const parsed = parseColor(color);
  if (!parsed) {
    return color;
  }
  return "rgba(" + parsed.r + ", " + parsed.g + ", " + parsed.b + ", " + opacity + ")";
}

function shouldProcessDocument(doc, ignoreLanguages, perf) {
  if (!doc) {
    return false;
  }
  if (ignoreLanguages && ignoreLanguages.indexOf(doc.languageId) >= 0) {
    return false;
  }
  if (perf.maxLineCount > 0 && doc.lineCount > perf.maxLineCount) {
    return false;
  }
  if (perf.maxDocumentLength > 0) {
    const text = doc.getText();
    if (text.length > perf.maxDocumentLength) {
      return false;
    }
  }
  return true;
}

function isLanguageIncluded(languageId, includeLanguages) {
  if (!Array.isArray(includeLanguages) || includeLanguages.length === 0) {
    return true;
  }
  return includeLanguages.indexOf(languageId) >= 0;
}

function getVisibleRanges(editor) {
  if (editor.visibleRanges && editor.visibleRanges.length > 0) {
    return editor.visibleRanges;
  }
  const doc = editor.document;
  const lastLine = Math.max(0, doc.lineCount - 1);
  const endCharacter = doc.lineAt(lastLine).range.end.character;
  return [new vscode.Range(0, 0, lastLine, endCharacter)];
}

function getVisibleLines(editor) {
  const lines = new Set();
  const doc = editor.document;
  const ranges = getVisibleRanges(editor);
  ranges.forEach((range) => {
    const start = Math.max(0, range.start.line);
    const end = Math.min(doc.lineCount - 1, range.end.line);
    for (let line = start; line <= end; line++) {
      lines.add(line);
    }
  });
  return Array.from(lines.values());
}

function getTabSize(editor) {
  const tabSize = editor.options.tabSize;
  if (typeof tabSize === "number" && tabSize > 0) {
    return tabSize;
  }
  return 4;
}

function getIndentSegments(indentText, tabSize) {
  const segments = [];
  let level = 0;
  let spaceCount = 0;

  for (let i = 0; i < indentText.length; i++) {
    const ch = indentText[i];
    if (ch === "\t") {
      if (spaceCount > 0) {
        segments.push({
          start: i - spaceCount,
          end: i,
          level
        });
        level += 1;
        spaceCount = 0;
      }
      segments.push({ start: i, end: i + 1, level });
      level += 1;
      continue;
    }

    spaceCount += 1;
    if (spaceCount === tabSize) {
      segments.push({
        start: i + 1 - spaceCount,
        end: i + 1,
        level
      });
      level += 1;
      spaceCount = 0;
    }
  }

  if (spaceCount > 0) {
    segments.push({
      start: indentText.length - spaceCount,
      end: indentText.length,
      level
    });
  }

  return segments;
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function isNumberLike(word) {
  return /^\d+$/.test(word);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function flattenSymbols(symbols, output) {
  if (!Array.isArray(symbols)) {
    return;
  }
  symbols.forEach((symbol) => {
    output.push(symbol);
    if (Array.isArray(symbol.children) && symbol.children.length > 0) {
      flattenSymbols(symbol.children, output);
    }
  });
}

function extractFunctionDefinitions(symbols, minLength, maxSymbols) {
  const definitions = new Map();
  if (!Array.isArray(symbols)) {
    return definitions;
  }
  const flat = [];
  flattenSymbols(symbols, flat);
  for (let i = 0; i < flat.length; i++) {
    const symbol = flat[i];
    if (!isFunctionKind(symbol.kind)) {
      continue;
    }
    const name = symbol.name;
    if (!name || name.length < minLength) {
      continue;
    }
    const line = getSymbolLine(symbol);
    if (line === null || line === undefined) {
      continue;
    }
    let set = definitions.get(name);
    if (!set) {
      set = new Set();
      definitions.set(name, set);
    }
    set.add(line);
    if (maxSymbols > 0 && definitions.size >= maxSymbols) {
      break;
    }
  }
  return definitions;
}

function getSymbolLine(symbol) {
  if (symbol.location && symbol.location.range) {
    return symbol.location.range.start.line;
  }
  if (symbol.selectionRange) {
    return symbol.selectionRange.start.line;
  }
  if (symbol.range) {
    return symbol.range.start.line;
  }
  return null;
}

function isFunctionKind(kind) {
  return kind === vscode.SymbolKind.Function
    || kind === vscode.SymbolKind.Method
    || kind === vscode.SymbolKind.Constructor
    || kind === vscode.SymbolKind.Class
    || kind === vscode.SymbolKind.Interface;
}

module.exports = {
  sanitizeStringArray,
  sanitizeColorArray,
  toNumber,
  clamp,
  toOpacity,
  parseColor,
  toRgba,
  shouldProcessDocument,
  isLanguageIncluded,
  getVisibleRanges,
  getVisibleLines,
  getTabSize,
  getIndentSegments,
  hashString,
  isNumberLike,
  escapeRegExp,
  flattenSymbols,
  extractFunctionDefinitions,
  getSymbolLine,
  isFunctionKind
};
