"use strict";

const vscode = require("vscode");
const { DEFAULT_PALETTE } = require("./constants");
const {
  sanitizeColorArray,
  shouldProcessDocument,
  getVisibleLines,
  getTabSize,
  getIndentSegments,
  toRgba
} = require("./utils");

class IndentManager {
  constructor() {
    this.indentDecorations = [];
    this.lineDecorations = [];
    this.styleKey = "";
  }

  reset() {
    this.styleKey = "";
    this.dispose();
  }

  dispose() {
    this.indentDecorations.forEach((decoration) => decoration.dispose());
    this.lineDecorations.forEach((decoration) => decoration.dispose());
    this.indentDecorations = [];
    this.lineDecorations = [];
  }

  clearAll(editors) {
    editors.forEach((editor) => this.clear(editor));
  }

  clear(editor) {
    this.indentDecorations.forEach((decoration) => editor.setDecorations(decoration, []));
    this.lineDecorations.forEach((decoration) => editor.setDecorations(decoration, []));
  }

  update(editors, config) {
    const cfg = config.indent;
    if (!cfg.enabled) {
      this.clearAll(editors);
      return;
    }

    const colors = sanitizeColorArray(cfg.colors, DEFAULT_PALETTE);
    const styleKey = JSON.stringify([
      colors,
      cfg.indentOpacity,
      cfg.lineOpacity,
      cfg.style
    ]);

    if (styleKey !== this.styleKey) {
      this.dispose();
      this.indentDecorations = colors.map((color) => {
        return vscode.window.createTextEditorDecorationType({
          backgroundColor: toRgba(color, cfg.indentOpacity)
        });
      });
      this.lineDecorations = colors.map((color) => {
        return vscode.window.createTextEditorDecorationType({
          backgroundColor: toRgba(color, cfg.lineOpacity),
          isWholeLine: true
        });
      });
      this.styleKey = styleKey;
    }

    editors.forEach((editor) => this.applyToEditor(editor, cfg, config.performance));
  }

  applyToEditor(editor, cfg, perf) {
    if (!shouldProcessDocument(editor.document, cfg.ignoreLanguages, perf)) {
      this.clear(editor);
      return;
    }

    const applyIndent = cfg.style !== "line";
    const applyLine = cfg.style !== "indent";

    const indentRanges = this.indentDecorations.map(() => []);
    const lineRanges = this.lineDecorations.map(() => []);
    const doc = editor.document;
    const tabSize = getTabSize(editor);
    const lines = getVisibleLines(editor);

    lines.forEach((lineNumber) => {
      if (lineNumber < 0 || lineNumber >= doc.lineCount) {
        return;
      }
      const line = doc.lineAt(lineNumber);
      const text = line.text;
      if (!text || text.trim().length === 0) {
        return;
      }
      const match = /^[\t ]+/.exec(text);
      if (!match) {
        return;
      }
      const indentText = match[0];
      const segments = getIndentSegments(indentText, tabSize);
      if (segments.length === 0) {
        return;
      }

      if (applyIndent) {
        segments.forEach((segment) => {
          const colorIndex = segment.level % this.indentDecorations.length;
          indentRanges[colorIndex].push(
            new vscode.Range(lineNumber, segment.start, lineNumber, segment.end)
          );
        });
      }

      if (applyLine) {
        const colorIndex = (segments.length - 1) % this.lineDecorations.length;
        lineRanges[colorIndex].push(line.range);
      }
    });

    if (applyIndent) {
      this.indentDecorations.forEach((decoration, index) => {
        editor.setDecorations(decoration, indentRanges[index]);
      });
    } else {
      this.indentDecorations.forEach((decoration) => editor.setDecorations(decoration, []));
    }

    if (applyLine) {
      this.lineDecorations.forEach((decoration, index) => {
        editor.setDecorations(decoration, lineRanges[index]);
      });
    } else {
      this.lineDecorations.forEach((decoration) => editor.setDecorations(decoration, []));
    }
  }
}

module.exports = { IndentManager };
