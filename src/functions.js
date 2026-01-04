"use strict";

const vscode = require("vscode");
const { DEFAULT_PALETTE } = require("./constants");
const {
  sanitizeColorArray,
  shouldProcessDocument,
  isLanguageIncluded,
  getVisibleRanges,
  escapeRegExp,
  hashString,
  extractFunctionDefinitions,
  toRgba
} = require("./utils");

class FunctionManager {
  constructor() {
    this.decorations = [];
    this.styleKey = "";
    this.updateToken = 0;
  }

  reset() {
    this.styleKey = "";
    this.dispose();
  }

  dispose() {
    this.decorations.forEach((decoration) => decoration.dispose());
    this.decorations = [];
  }

  clearAll(editors) {
    editors.forEach((editor) => this.clear(editor));
  }

  clear(editor) {
    this.decorations.forEach((decoration) => editor.setDecorations(decoration, []));
  }

  async update(editors, config, updateToken) {
    const cfg = config.functions;
    this.updateToken = updateToken;

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
      cfg.borderRadius,
      cfg.highlightStyle
    ]);

    if (styleKey !== this.styleKey) {
      this.dispose();
      const isWholeLine = cfg.highlightStyle === "line";
      this.decorations = colors.map((color) => {
        const border = cfg.borderWidth > 0
          ? cfg.borderWidth + "px solid " + toRgba(color, cfg.borderOpacity)
          : undefined;
        return vscode.window.createTextEditorDecorationType({
          backgroundColor: toRgba(color, cfg.backgroundOpacity),
          border,
          borderRadius: cfg.borderRadius + "px",
          isWholeLine
        });
      });
      this.styleKey = styleKey;
    }

    await Promise.all(
      editors.map((editor) => this.applyToEditor(editor, cfg, config.performance, updateToken))
    );
  }

  async applyToEditor(editor, cfg, perf, updateToken) {
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

    const symbols = await vscode.commands.executeCommand(
      "vscode.executeDocumentSymbolProvider",
      doc.uri
    );

    if (this.updateToken !== updateToken) {
      return;
    }

    const definitions = extractFunctionDefinitions(symbols, cfg.minLength, cfg.maxSymbols);
    if (definitions.size === 0) {
      this.clear(editor);
      return;
    }

    const names = Array.from(definitions.keys());
    const pattern = names.map(escapeRegExp).join("|");
    if (!pattern) {
      this.clear(editor);
      return;
    }

    const regex = new RegExp("\\b(" + pattern + ")\\b", "g");
    const ranges = getVisibleRanges(editor);
    const stats = new Map();

    ranges.forEach((range) => {
      const startOffset = doc.offsetAt(range.start);
      const text = doc.getText(range);
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(text)) !== null) {
        const name = match[1];
        if (!name) {
          continue;
        }
        const start = startOffset + match.index;
        const end = start + name.length;
        const line = doc.positionAt(start).line;
        let entry = stats.get(name);
        if (!entry) {
          entry = {
            ranges: [],
            lines: new Set(),
            hasDefinition: false,
            hasCall: false
          };
          stats.set(name, entry);
        }
        entry.ranges.push({ start, end, line });
        entry.lines.add(line);
        if (definitions.has(name) && definitions.get(name).has(line)) {
          entry.hasDefinition = true;
        } else {
          entry.hasCall = true;
        }
      }
    });

    const rangesByColor = this.decorations.map(() => []);
    stats.forEach((entry, name) => {
      if (entry.ranges.length < cfg.minOccurrences) {
        return;
      }
      if (cfg.requireDefinitionAndCall && (!entry.hasDefinition || !entry.hasCall)) {
        return;
      }
      const colorIndex = hashString(name) % this.decorations.length;
      if (cfg.highlightStyle === "line") {
        entry.lines.forEach((line) => {
          if (line >= 0 && line < doc.lineCount) {
            rangesByColor[colorIndex].push(doc.lineAt(line).range);
          }
        });
      } else {
        entry.ranges.forEach((rangeInfo) => {
          const range = new vscode.Range(
            doc.positionAt(rangeInfo.start),
            doc.positionAt(rangeInfo.end)
          );
          rangesByColor[colorIndex].push(range);
        });
      }
    });

    if (rangesByColor.every((rangesList) => rangesList.length === 0)) {
      this.clear(editor);
      return;
    }

    this.decorations.forEach((decoration, index) => {
      editor.setDecorations(decoration, rangesByColor[index]);
    });
  }
}

module.exports = { FunctionManager };
