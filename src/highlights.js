"use strict";

const vscode = require("vscode");
const { DEFAULT_PALETTE } = require("./constants");
const {
  sanitizeColorArray,
  shouldProcessDocument,
  getVisibleRanges,
  hashString,
  isNumberLike,
  toRgba
} = require("./utils");

class HighlightManager {
  constructor() {
    this.decorationTypes = [];
    this.styleKey = "";
  }

  reset() {
    this.styleKey = "";
    this.dispose();
  }

  dispose() {
    this.decorationTypes.forEach((decoration) => decoration.dispose());
    this.decorationTypes = [];
  }

  clearAll(editors) {
    editors.forEach((editor) => this.clear(editor));
  }

  clear(editor) {
    this.decorationTypes.forEach((decoration) => editor.setDecorations(decoration, []));
  }

  update(editors, config) {
    const cfg = config.highlights;
    if (!cfg.enabled) {
      this.clearAll(editors);
      return;
    }

    const colors = sanitizeColorArray(cfg.colors, DEFAULT_PALETTE);
    const styleKey = JSON.stringify([
      colors,
      cfg.backgroundOpacity,
      cfg.borderOpacity,
      cfg.borderWidth,
      cfg.borderRadius
    ]);

    if (styleKey !== this.styleKey) {
      this.dispose();
      this.decorationTypes = colors.map((color) => {
        const border = cfg.borderWidth > 0
          ? cfg.borderWidth + "px solid " + toRgba(color, cfg.borderOpacity)
          : undefined;
        return vscode.window.createTextEditorDecorationType({
          backgroundColor: toRgba(color, cfg.backgroundOpacity),
          border,
          borderRadius: cfg.borderRadius + "px",
          overviewRulerColor: color
        });
      });
      this.styleKey = styleKey;
    }

    const excludeSet = new Set(cfg.exclude || []);
    editors.forEach((editor) => this.applyToEditor(editor, cfg, config.performance, excludeSet));
  }

  applyToEditor(editor, cfg, perf, excludeSet) {
    if (!shouldProcessDocument(editor.document, cfg.ignoreLanguages, perf)) {
      this.clear(editor);
      return;
    }

    const rangesByColor = this.decorationTypes.map(() => []);
    const occurrences = new Map();
    const doc = editor.document;

    const ranges = getVisibleRanges(editor);
    ranges.forEach((range) => {
      const startOffset = doc.offsetAt(range.start);
      const text = doc.getText(range);
      const regex = /\b[A-Za-z_][A-Za-z0-9_]*\b/g;
      let match;
      while ((match = regex.exec(text)) !== null) {
        const word = match[0];
        if (word.length < cfg.minLength) {
          continue;
        }
        if (excludeSet.has(word)) {
          continue;
        }
        if (isNumberLike(word)) {
          continue;
        }
        const start = startOffset + match.index;
        const end = start + word.length;
        let list = occurrences.get(word);
        if (!list) {
          list = [];
          occurrences.set(word, list);
        }
        list.push({ start, end });
      }
    });

    let entries = [];
    occurrences.forEach((rangesList, token) => {
      if (rangesList.length >= cfg.minOccurrences) {
        entries.push({ token, rangesList });
      }
    });

    if (entries.length === 0) {
      this.clear(editor);
      return;
    }

    if (cfg.maxTokens > 0 && entries.length > cfg.maxTokens) {
      entries.sort((a, b) => b.rangesList.length - a.rangesList.length);
      entries = entries.slice(0, cfg.maxTokens);
    }

    entries.forEach((entry) => {
      const colorIndex = hashString(entry.token) % this.decorationTypes.length;
      entry.rangesList.forEach((rangeInfo) => {
        const range = new vscode.Range(
          doc.positionAt(rangeInfo.start),
          doc.positionAt(rangeInfo.end)
        );
        rangesByColor[colorIndex].push(range);
      });
    });

    this.decorationTypes.forEach((decoration, index) => {
      editor.setDecorations(decoration, rangesByColor[index]);
    });
  }
}

module.exports = { HighlightManager };
