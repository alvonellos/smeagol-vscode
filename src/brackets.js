"use strict";

const vscode = require("vscode");
const { BRACKET_TYPES } = require("./_constants");
const { isAdaDocument } = require("./ada-support");

/**
 * Bracket Pair Guides
 * Visualizes bracket matching with scope lines and depth-based coloring
 */
class BracketGuidesManager {
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
    const cfg = config.brackets;
    if (!cfg || !cfg.enabled) {
      this.clearAll(editors);
      return;
    }

    const colors = cfg.colors || [
      "#ff844c",
      "#fdd835",
      "#aee571",
      "#039be5",
      "#c158dc",
      "#ff006f",
      "#00e71c",
      "#00c7ff",
      "#facd45",
      "#ffc66d"
    ];

    const styleKey = JSON.stringify([colors, cfg.lineWidth, cfg.lineOpacity, cfg.style]);

    if (styleKey !== this.styleKey) {
      this.dispose();

      // Create decorations for each depth level
      this.decorationTypes = colors.map((color) => {
        const opacity = cfg.lineOpacity || 0.5;
        const borderColor = this.hexToRgba(color, opacity);
        
        return vscode.window.createTextEditorDecorationType({
          border: `${cfg.lineWidth || 1}px solid ${borderColor}`,
          borderRadius: "2px",
          isWholeLine: cfg.style === 'line',
          overviewRulerColor: color
        });
      });

      this.styleKey = styleKey;
    }

    editors.forEach((editor) => this.applyToEditor(editor, cfg));
  }

  applyToEditor(editor, cfg) {
    const doc = editor.document;
    const rangesByColor = this.decorationTypes.map(() => []);

    // Find all bracket pairs
    const bracketPairs = this.findBracketPairs(doc);

    // Assign colors based on depth
    bracketPairs.forEach((pair) => {
      const colorIndex = pair.depth % this.decorationTypes.length;
      
      if (cfg.style === 'bracket' || cfg.style === 'both') {
        // Highlight just the brackets
        rangesByColor[colorIndex].push(
          new vscode.Range(pair.open.line, pair.open.character, pair.open.line, pair.open.character + 1)
        );
        if (pair.close) {
          rangesByColor[colorIndex].push(
            new vscode.Range(pair.close.line, pair.close.character, pair.close.line, pair.close.character + 1)
          );
        }
      }
      
      if (cfg.style === 'line' || cfg.style === 'both') {
        // Highlight entire lines of opening bracket
        rangesByColor[colorIndex].push(
          new vscode.Range(pair.open.line, 0, pair.open.line, doc.lineAt(pair.open.line).text.length)
        );
      }
    });

    // Apply all decorations
    this.decorationTypes.forEach((decoration, index) => {
      editor.setDecorations(decoration, rangesByColor[index]);
    });
  }

  findBracketPairs(doc) {
    const pairs = [];
    const stack = [];
    const bracketTypes = this.getBracketTypes(doc);
    const openBrackets = new Set(Object.keys(bracketTypes));
    const closeBrackets = Object.fromEntries(
      Object.entries(bracketTypes).map(([open, meta]) => [meta.close, open])
    );

    for (let lineNum = 0; lineNum < doc.lineCount; lineNum++) {
      const line = this.sanitizeLineForBracketScan(doc.lineAt(lineNum).text, doc);

      for (let index = 0; index < line.length; index++) {
        const char = line[index];

        if (openBrackets.has(char)) {
          stack.push({
            char,
            line: lineNum,
            character: index,
            depth: stack.length
          });
          continue;
        }

        const expectedOpen = closeBrackets[char];
        if (!expectedOpen) {
          continue;
        }

        const last = stack[stack.length - 1];
        if (last && expectedOpen === last.char) {
          stack.pop();
          pairs.push({
            open: { line: last.line, character: last.character },
            close: { line: lineNum, character: index },
            depth: last.depth
          });
        }
      }
    }

    return pairs;
  }

  getBracketTypes(doc) {
    if (!isAdaDocument(doc)) {
      return BRACKET_TYPES;
    }

    const bracketTypes = { ...BRACKET_TYPES };
    delete bracketTypes["<"];
    return bracketTypes;
  }

  sanitizeLineForBracketScan(line, doc) {
    if (!isAdaDocument(doc)) {
      return line;
    }
    return this.maskAdaIgnoredText(line);
  }

  maskAdaIgnoredText(line) {
    const chars = Array.from(line);

    for (let index = 0; index < chars.length; index++) {
      if (chars[index] === "-" && chars[index + 1] === "-") {
        for (let maskIndex = index; maskIndex < chars.length; maskIndex++) {
          chars[maskIndex] = " ";
        }
        break;
      }

      if (chars[index] !== "\"") {
        continue;
      }

      chars[index] = " ";
      index += 1;

      while (index < chars.length) {
        const isQuote = chars[index] === "\"";
        chars[index] = " ";

        if (!isQuote) {
          index += 1;
          continue;
        }

        if (index + 1 < chars.length && chars[index + 1] === "\"") {
          chars[index + 1] = " ";
          index += 2;
          continue;
        }

        break;
      }
    }

    return chars.join("");
  }

  hexToRgba(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}

module.exports = { BracketGuidesManager };
