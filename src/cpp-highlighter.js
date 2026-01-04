"use strict";

const vscode = require("vscode");

/**
 * C/C++ Semantic Highlighting
 * Highlights pointers, memory management, macros, namespaces, templates
 */
class CppHighlighter {
  constructor() {
    this.decorationTypes = {};
    this.pointerColor = "#ff006f"; // magenta for pointers
    this.macroColor = "#fff600"; // yellow for macros
    this.namespaceColor = "#47bc9b"; // teal for namespaces
    this.templateColor = "#00c7ff"; // cyan for templates
    this.memoryColor = "#ff844c"; // orange for memory ops
  }

  createDecorations() {
    if (Object.keys(this.decorationTypes).length > 0) {
      this.dispose();
    }

    this.decorationTypes = {
      pointer: vscode.window.createTextEditorDecorationType({
        color: this.pointerColor,
        fontWeight: "bold"
      }),
      macro: vscode.window.createTextEditorDecorationType({
        color: this.macroColor,
        fontWeight: "bold"
      }),
      namespace: vscode.window.createTextEditorDecorationType({
        color: this.namespaceColor
      }),
      template: vscode.window.createTextEditorDecorationType({
        color: this.templateColor,
        fontStyle: "italic"
      }),
      memory: vscode.window.createTextEditorDecorationType({
        color: this.memoryColor,
        fontWeight: "bold"
      })
    };
  }

  dispose() {
    Object.values(this.decorationTypes).forEach(dec => dec.dispose());
    this.decorationTypes = {};
  }

  update(editor) {
    if (!editor || !['cpp', 'c', 'objective-c'].includes(editor.document.languageId)) {
      return;
    }

    if (Object.keys(this.decorationTypes).length === 0) {
      this.createDecorations();
    }

    const doc = editor.document;
    const ranges = {
      pointer: [],
      macro: [],
      namespace: [],
      template: [],
      memory: []
    };

    editor.visibleRanges.forEach(range => {
      for (let line = range.start.line; line <= range.end.line; line++) {
        const lineText = doc.lineAt(line).text;

        // Pointer dereference: *var, &var, ->
        let pointerMatch;
        const pointerRegex = /([*&]|\->)/g;
        while ((pointerMatch = pointerRegex.exec(lineText)) !== null) {
          const startPos = new vscode.Position(line, pointerMatch.index);
          const endPos = new vscode.Position(line, pointerMatch.index + pointerMatch[0].length);
          ranges.pointer.push(new vscode.Range(startPos, endPos));
        }

        // Macros: #define, #include, etc
        if (lineText.includes('#')) {
          const macroRegex = /#\s*(define|include|ifdef|ifndef|endif|pragma|error|warning|pragma|if|else|elif)/g;
          let macroMatch;
          while ((macroMatch = macroRegex.exec(lineText)) !== null) {
            const startPos = new vscode.Position(line, macroMatch.index);
            const endPos = new vscode.Position(line, macroMatch.index + macroMatch[0].length);
            ranges.macro.push(new vscode.Range(startPos, endPos));
          }
        }

        // Namespace: std::, namespace Foo
        if (lineText.includes('::')) {
          const nsRegex = /([a-zA-Z_][a-zA-Z0-9_]*)::/g;
          let nsMatch;
          while ((nsMatch = nsRegex.exec(lineText)) !== null) {
            const idx = lineText.indexOf(nsMatch[1], nsMatch.index);
            const startPos = new vscode.Position(line, idx);
            const endPos = new vscode.Position(line, idx + nsMatch[1].length);
            ranges.namespace.push(new vscode.Range(startPos, endPos));
          }
        }

        // Templates: <Type>, vector<int>
        if (lineText.includes('<')) {
          const templateRegex = /<([A-Za-z_][A-Za-z0-9_:,\s]*)>/g;
          let templateMatch;
          while ((templateMatch = templateRegex.exec(lineText)) !== null) {
            const startPos = new vscode.Position(line, templateMatch.index);
            const endPos = new vscode.Position(line, templateMatch.index + templateMatch[0].length);
            ranges.template.push(new vscode.Range(startPos, endPos));
          }
        }

        // Memory operations: new, delete, malloc, free
        const memoryRegex = /\b(new|delete|malloc|free|calloc|realloc)\b/g;
        let memoryMatch;
        while ((memoryMatch = memoryRegex.exec(lineText)) !== null) {
          const startPos = new vscode.Position(line, memoryMatch.index);
          const endPos = new vscode.Position(line, memoryMatch.index + memoryMatch[0].length);
          ranges.memory.push(new vscode.Range(startPos, endPos));
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

module.exports = { CppHighlighter };
