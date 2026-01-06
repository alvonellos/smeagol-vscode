"use strict";

const vscode = require("vscode");
const { DEFAULT_PALETTE, VOID_ELEMENTS } = require("./constants");
const {
  sanitizeColorArray,
  sanitizeStringArray,
  shouldProcessDocument,
  isLanguageIncluded,
  escapeRegExp
} = require("./utils");

class HtmlManager {
  constructor() {
    this.tagDecorations = [];
    this.delimiterDecorations = [];
    this.styleKey = "";
    this.updateToken = 0;
    this.regexCache = new Map(); // Cache compiled regex patterns for tagged templates
  }

  reset() {
    this.styleKey = "";
    this.regexCache.clear();
    this.dispose();
  }

  dispose() {
    this.tagDecorations.forEach((decoration) => decoration.dispose());
    this.delimiterDecorations.forEach((decoration) => decoration.dispose());
    this.tagDecorations = [];
    this.delimiterDecorations = [];
  }

  clearAll(editors) {
    editors.forEach((editor) => this.clear(editor));
  }

  clear(editor) {
    this.tagDecorations.forEach((decoration) => editor.setDecorations(decoration, []));
    this.delimiterDecorations.forEach((decoration) => editor.setDecorations(decoration, []));
  }

  update(editors, config, updateToken) {
    const cfg = config.html;
    this.updateToken = updateToken;

    if (!cfg.enabled) {
      this.clearAll(editors);
      return;
    }

    const colors = sanitizeColorArray(cfg.colors, DEFAULT_PALETTE);
    const styleKey = JSON.stringify([colors, cfg.delimiterOpacity]);

    if (styleKey !== this.styleKey) {
      this.dispose();
      this.tagDecorations = colors.map((color) => {
        return vscode.window.createTextEditorDecorationType({ color });
      });
      this.delimiterDecorations = colors.map((color) => {
        return vscode.window.createTextEditorDecorationType({
          color,
          opacity: String(cfg.delimiterOpacity),
          rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });
      });
      this.styleKey = styleKey;
    }

    editors.forEach((editor) => this.applyToEditor(editor, cfg, config.performance, updateToken));
  }

  applyToEditor(editor, cfg, perf, updateToken) {
    if (this.updateToken !== updateToken) {
      return;
    }
    const doc = editor.document;
    if (!shouldProcessDocument(doc, [], perf)) {
      this.clear(editor);
      return;
    }
    if (!isLanguageIncluded(doc.languageId, cfg.includeLanguages)) {
      this.clear(editor);
      return;
    }

    const text = doc.getText();
    if (!text) {
      this.clear(editor);
      return;
    }

    const segments = getHtmlSegments(doc, text, cfg);
    if (segments.length === 0) {
      this.clear(editor);
      return;
    }

    const nameRangesByColor = this.tagDecorations.map(() => []);
    const delimiterRangesByColor = this.delimiterDecorations.map(() => []);
    const colorCount = this.tagDecorations.length;

    const stack = [];
    const nextIndexStack = [0];

    segments.forEach((segment) => {
      let pos = segment.start;
      while (pos < segment.end) {
        if (text.startsWith("<!--", pos)) {
          const end = text.indexOf("-->", pos + 4);
          if (end === -1 || end >= segment.end) {
            pos = segment.end;
            continue;
          }
          pos = end + 3;
          continue;
        }

        if (text.startsWith("<!DOCTYPE", pos) || text.startsWith("<!doctype", pos)) {
          const end = text.indexOf(">", pos + 2);
          if (end === -1 || end >= segment.end) {
            pos = segment.end;
            continue;
          }
          pos = end + 1;
          continue;
        }

        if (text[pos] === "<") {
          const tagEnd = findTagEnd(text, pos + 1, segment.end);
          if (tagEnd === -1) {
            pos += 1;
            continue;
          }

          const tagText = text.slice(pos, tagEnd + 1);
          if (tagText.startsWith("<?") || (tagText.startsWith("<!") && !tagText.startsWith("<!DOCTYPE") && !tagText.startsWith("<!doctype"))) {
            pos = tagEnd + 1;
            continue;
          }

          const isClosing = /^<\s*\//.test(tagText);
          const nameMatch = tagText.match(/^<\s*\/?\s*([A-Za-z][A-Za-z0-9:-]*)/);
          if (!nameMatch) {
            pos = tagEnd + 1;
            continue;
          }

          const tagName = nameMatch[1].toLowerCase();
          const isSelfClosing = /\/>\s*$/.test(tagText) || VOID_ELEMENTS.has(tagName);

          let colorIndex = 0;
          if (isClosing) {
            colorIndex = nextIndexStack[Math.max(0, stack.length)] || 0;
            for (let i = stack.length - 1; i >= 0; i--) {
              if (stack[i].name === tagName) {
                colorIndex = stack[i].colorIndex;
                stack.splice(i);
                break;
              }
            }
            nextIndexStack.length = stack.length + 1;
          } else {
            const depth = stack.length;
            const parentColor = depth > 0 ? stack[depth - 1].colorIndex : null;
            const startIndex = nextIndexStack[depth] || 0;
            colorIndex = nextDifferentColor(startIndex, parentColor, colorCount);
            nextIndexStack[depth] = (colorIndex + 1) % colorCount;

            if (!isSelfClosing) {
              stack.push({ name: tagName, colorIndex });
              nextIndexStack[depth + 1] = (colorIndex + 1) % colorCount;
            }
          }

          addTagPieces(
            doc,
            pos,
            tagText,
            colorIndex,
            nameRangesByColor,
            delimiterRangesByColor
          );

          pos = tagEnd + 1;
          continue;
        }

        pos += 1;
      }
    });

    this.tagDecorations.forEach((decoration, index) => {
      editor.setDecorations(decoration, nameRangesByColor[index]);
    });
    this.delimiterDecorations.forEach((decoration, index) => {
      editor.setDecorations(decoration, delimiterRangesByColor[index]);
    });
  }
}

function getHtmlSegments(doc, text, cfg) {
  const lang = doc.languageId;
  if (lang === "html" || doc.fileName.endsWith(".html") || doc.fileName.endsWith(".htm")) {
    return [{ start: 0, end: text.length }];
  }
  if (lang === "javascriptreact" || lang === "typescriptreact") {
    return [{ start: 0, end: text.length }];
  }
  if (lang !== "javascript" && lang !== "typescript") {
    return [];
  }

  const tagNames = sanitizeStringArray(cfg.taggedTemplateNames, ["html"]);
  if (tagNames.length === 0) {
    return [];
  }

  const pattern = tagNames.map(escapeRegExp).join("|");
  const cacheKey = pattern;
  
  // Use cached regex to avoid recompilation
  let regex = this.regexCache.get(cacheKey);
  if (!regex) {
    try {
      regex = new RegExp("(?:^|[^A-Za-z0-9_$\\.])(" + pattern + ")\\s*`", "g");
      this.regexCache.set(cacheKey, regex);
    } catch (e) {
      console.warn(`Failed to compile tagged template regex: ${e.message}`);
      return [];
    }
  }
  
  const segments = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchText = match[0];
    const tickIndex = match.index + matchText.lastIndexOf("`");
    const literalStart = tickIndex + 1;
    const literalEnd = findTemplateLiteralEnd(text, literalStart);
    if (literalEnd === -1) {
      break;
    }
    const literalSegments = splitTemplateLiteral(text, literalStart, literalEnd);
    literalSegments.forEach((segment) => segments.push(segment));
    regex.lastIndex = literalEnd + 1;
  }

  return segments;
}

function findTemplateLiteralEnd(text, startPos) {
  let i = startPos;
  while (i < text.length) {
    const ch = text[i];
    const next2 = text.slice(i, i + 2);
    if (ch === "\\") {
      i += 2;
      continue;
    }
    if (next2 === "${") {
      const exprEnd = scanTemplateExpr(text, i + 2, text.length);
      if (exprEnd === -1) {
        return -1;
      }
      i = exprEnd;
      continue;
    }
    if (ch === "`") {
      return i;
    }
    i += 1;
  }
  return -1;
}

function splitTemplateLiteral(text, startPos, endPos) {
  const segments = [];
  let i = startPos;
  let chunkStart = startPos;

  while (i < endPos) {
    const next2 = text.slice(i, i + 2);
    if (text[i] === "\\") {
      i += 2;
      continue;
    }
    if (next2 === "${") {
      if (chunkStart < i) {
        segments.push({ start: chunkStart, end: i });
      }
      const exprEnd = scanTemplateExpr(text, i + 2, endPos);
      if (exprEnd === -1) {
        return segments;
      }
      i = exprEnd;
      chunkStart = i;
      continue;
    }
    i += 1;
  }

  if (chunkStart < endPos) {
    segments.push({ start: chunkStart, end: endPos });
  }
  return segments;
}

function scanTemplateExpr(text, startPos, endPos) {
  let i = startPos;
  let depth = 1;
  let inSingle = false;
  let inDouble = false;
  let inBacktick = false;

  while (i < endPos) {
    const ch = text[i];
    const next2 = text.slice(i, i + 2);

    if ((inSingle || inDouble || inBacktick) && ch === "\\") {
      i += 2;
      continue;
    }

    if (!inDouble && !inBacktick && ch === "'" && !inSingle) {
      inSingle = true;
      i += 1;
      continue;
    }
    if (inSingle && ch === "'") {
      inSingle = false;
      i += 1;
      continue;
    }
    if (!inSingle && !inBacktick && ch === "\"" && !inDouble) {
      inDouble = true;
      i += 1;
      continue;
    }
    if (inDouble && ch === "\"") {
      inDouble = false;
      i += 1;
      continue;
    }
    if (!inSingle && !inDouble && ch === "`" && !inBacktick) {
      inBacktick = true;
      i += 1;
      continue;
    }
    if (inBacktick && ch === "`") {
      inBacktick = false;
      i += 1;
      continue;
    }

    if (!inSingle && !inDouble && !inBacktick) {
      if (next2 === "${") {
        depth += 1;
        i += 2;
        continue;
      }
      if (ch === "{") {
        depth += 1;
        i += 1;
        continue;
      }
      if (ch === "}") {
        depth -= 1;
        i += 1;
        if (depth === 0) {
          return i;
        }
        continue;
      }
    }

    i += 1;
  }

  return -1;
}

function findTagEnd(text, startPos, endPos) {
  let i = startPos;
  let inSingle = false;
  let inDouble = false;

  while (i < endPos) {
    const ch = text[i];
    const next2 = text.slice(i, i + 2);

    if ((inSingle || inDouble) && ch === "\\") {
      i += 2;
      continue;
    }

    if (!inDouble && ch === "'" && !inSingle) {
      inSingle = true;
      i += 1;
      continue;
    }
    if (inSingle && ch === "'") {
      inSingle = false;
      i += 1;
      continue;
    }
    if (!inSingle && ch === "\"" && !inDouble) {
      inDouble = true;
      i += 1;
      continue;
    }
    if (inDouble && ch === "\"") {
      inDouble = false;
      i += 1;
      continue;
    }

    if (!inSingle && !inDouble && next2 === "${") {
      const exprEnd = scanTemplateExpr(text, i + 2, endPos);
      if (exprEnd === -1) {
        return -1;
      }
      i = exprEnd;
      continue;
    }

    if (!inSingle && !inDouble && ch === ">") {
      return i;
    }

    i += 1;
  }

  return -1;
}

function nextDifferentColor(startIndex, forbiddenIndex, count) {
  if (count <= 0) {
    return 0;
  }
  let idx = startIndex % count;
  if (forbiddenIndex === null || forbiddenIndex === undefined) {
    return idx;
  }
  if (idx === forbiddenIndex) {
    idx = (idx + 1) % count;
  }
  return idx;
}

function addTagPieces(doc, startOffset, tagText, colorIndex, nameRanges, delimiterRanges) {
  const pushRange = (ranges, start, end) => {
    if (start >= end) {
      return;
    }
    const range = new vscode.Range(
      doc.positionAt(startOffset + start),
      doc.positionAt(startOffset + end)
    );
    ranges[colorIndex].push(range);
  };

  pushRange(delimiterRanges, 0, 1);
  if (tagText.startsWith("</")) {
    pushRange(delimiterRanges, 1, 2);
  }

  const nameMatch = tagText.match(/^<\s*\/?\s*([A-Za-z][A-Za-z0-9:-]*)/);
  if (nameMatch) {
    const nameIndex = tagText.indexOf(nameMatch[1]);
    if (nameIndex >= 0) {
      pushRange(nameRanges, nameIndex, nameIndex + nameMatch[1].length);
    }
  }

  if (/\/>\s*$/.test(tagText)) {
    pushRange(delimiterRanges, tagText.length - 2, tagText.length - 1);
  }
  pushRange(delimiterRanges, tagText.length - 1, tagText.length);
}

module.exports = { HtmlManager };
