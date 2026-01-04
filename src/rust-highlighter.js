"use strict";

const vscode = require("vscode");
const { RUST_ATTRIBUTE, RUST_LIFETIME, RUST_MACROS } = require("./_constants");
const { toRgba } = require("./utils");

/**
 * Rust-specific semantic highlighting
 * Handles macros, lifetimes, attributes, traits, and generic parameters
 */
class RustHighlighter {
  constructor() {
    this.decorationTypes = {};
    this.macroColor = "#fff600"; // yellow for macros
    this.lifetimeColor = "#00c7ff"; // cyan for lifetimes
    this.attributeColor = "#ffc66d"; // orange for attributes
    this.traitColor = "#00ffd9"; // turquoise for traits
    this.genericColor = "#bb00ff"; // magenta for generics
  }

  createDecorations() {
    if (Object.keys(this.decorationTypes).length > 0) {
      this.dispose();
    }

    this.decorationTypes = {
      macro: vscode.window.createTextEditorDecorationType({
        color: this.macroColor,
        fontWeight: "bold"
      }),
      lifetime: vscode.window.createTextEditorDecorationType({
        color: this.lifetimeColor,
        fontStyle: "italic"
      }),
      attribute: vscode.window.createTextEditorDecorationType({
        color: this.attributeColor
      }),
      trait: vscode.window.createTextEditorDecorationType({
        color: this.traitColor
      }),
      generic: vscode.window.createTextEditorDecorationType({
        color: this.genericColor
      })
    };
  }

  dispose() {
    Object.values(this.decorationTypes).forEach(dec => dec.dispose());
    this.decorationTypes = {};
  }

  update(editor) {
    if (!editor || editor.document.languageId !== 'rust') {
      return;
    }

    if (Object.keys(this.decorationTypes).length === 0) {
      this.createDecorations();
    }

    const doc = editor.document;
    const ranges = {
      macro: [],
      lifetime: [],
      attribute: [],
      trait: [],
      generic: []
    };

    // Process each visible line
    editor.visibleRanges.forEach(range => {
      for (let line = range.start.line; line <= range.end.line; line++) {
        const lineText = doc.lineAt(line).text;

        // Find macros: identifier!
        let macroMatch;
        const macroRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*!)/g;
        while ((macroMatch = macroRegex.exec(lineText)) !== null) {
          const startPos = new vscode.Position(line, macroMatch.index);
          const endPos = new vscode.Position(line, macroMatch.index + macroMatch[1].length - 1);
          ranges.macro.push(new vscode.Range(startPos, endPos));
        }

        // Find lifetimes: 'lifetime
        let lifetimeMatch;
        const lifetimeRegex = /'([a-zA-Z_][a-zA-Z0-9_]*)/g;
        while ((lifetimeMatch = lifetimeRegex.exec(lineText)) !== null) {
          const startPos = new vscode.Position(line, lifetimeMatch.index);
          const endPos = new vscode.Position(line, lifetimeMatch.index + lifetimeMatch[0].length);
          ranges.lifetime.push(new vscode.Range(startPos, endPos));
        }

        // Find attributes: #[...]
        let attributeMatch;
        const attributeRegex = /#\[([^\]]+)\]/g;
        while ((attributeMatch = attributeRegex.exec(lineText)) !== null) {
          const startPos = new vscode.Position(line, attributeMatch.index);
          const endPos = new vscode.Position(line, attributeMatch.index + attributeMatch[0].length);
          ranges.attribute.push(new vscode.Range(startPos, endPos));
        }

        // Find trait bounds and impls
        if (lineText.includes('impl ') || lineText.includes('trait ')) {
          const implMatch = lineText.match(/\b(impl|trait)\s+(<[^>]+>)?\s*([A-Z][a-zA-Z0-9_]*)/);
          if (implMatch && implMatch[3]) {
            const idx = lineText.indexOf(implMatch[3]);
            const startPos = new vscode.Position(line, idx);
            const endPos = new vscode.Position(line, idx + implMatch[3].length);
            ranges.trait.push(new vscode.Range(startPos, endPos));
          }
        }

        // Find generic parameters <T, U, V>
        let genericMatch;
        const genericRegex = /<([A-Z][a-zA-Z0-9_]*)(?:\s*[,>])/g;
        while ((genericMatch = genericRegex.exec(lineText)) !== null) {
          const idx = lineText.indexOf(genericMatch[1], genericMatch.index);
          if (idx > -1) {
            const startPos = new vscode.Position(line, idx);
            const endPos = new vscode.Position(line, idx + genericMatch[1].length);
            ranges.generic.push(new vscode.Range(startPos, endPos));
          }
        }
      }
    });

    // Apply decorations
    Object.keys(this.decorationTypes).forEach(key => {
      editor.setDecorations(this.decorationTypes[key], ranges[key]);
    });
  }

  clear(editor) {
    if (editor) {
      Object.values(this.decorationTypes).forEach(dec => {
        editor.setDecorations(dec, []);
      });
    }
  }

  clearAll(editors) {
    editors.forEach(editor => this.clear(editor));
  }

  reset() {
    this.dispose();
  }
}

module.exports = { RustHighlighter };
