"use strict";

const vscode = require("vscode");
const { JAVA_ANNOTATION, JAVA_GENERIC } = require("./_constants");

/**
 * Java-specific semantic highlighting
 * Handles annotations, generics, access modifiers, and static members
 */
class JavaHighlighter {
  constructor() {
    this.decorationTypes = {};
    this.annotationColor = "#facd45"; // gold for annotations (matches theme constants)
    this.genericColor = "#00c7ff"; // cyan for generics (matches theme variables)
    this.staticColor = "#ffc66d"; // light orange for static (matches theme functions)
    this.interfaceColor = "#00ffd9"; // turquoise for interfaces (matches theme classes)
    this.enumColor = "#bb00ff"; // purple for enums (matches theme escapes)
  }

  createDecorations() {
    if (Object.keys(this.decorationTypes).length > 0) {
      this.dispose();
    }

    this.decorationTypes = {
      annotation: vscode.window.createTextEditorDecorationType({
        color: this.annotationColor,
        fontWeight: "bold"
      }),
      generic: vscode.window.createTextEditorDecorationType({
        color: this.genericColor
      }),
      static: vscode.window.createTextEditorDecorationType({
        color: this.staticColor
      }),
      interface: vscode.window.createTextEditorDecorationType({
        color: this.interfaceColor
      }),
      enum: vscode.window.createTextEditorDecorationType({
        color: this.enumColor
      })
    };
  }

  dispose() {
    Object.values(this.decorationTypes).forEach(dec => dec.dispose());
    this.decorationTypes = {};
  }

  update(editor) {
    if (!editor || editor.document.languageId !== 'java') {
      return;
    }

    if (Object.keys(this.decorationTypes).length === 0) {
      this.createDecorations();
    }

    const doc = editor.document;
    const ranges = {
      annotation: [],
      generic: [],
      static: [],
      interface: [],
      enum: []
    };

    // Process each visible line
    editor.visibleRanges.forEach(range => {
      for (let line = range.start.line; line <= range.end.line; line++) {
        const lineText = doc.lineAt(line).text;

        // Find annotations: @AnnotationName
        let annotationMatch;
        const annotationRegex = /@([A-Za-z_][A-Za-z0-9_]*)/g;
        while ((annotationMatch = annotationRegex.exec(lineText)) !== null) {
          const startPos = new vscode.Position(line, annotationMatch.index);
          const endPos = new vscode.Position(line, annotationMatch.index + annotationMatch[0].length);
          ranges.annotation.push(new vscode.Range(startPos, endPos));
        }

        // Find generics: <Type, AnotherType>
        let genericMatch;
        const genericRegex = /<\s*([A-Z][a-zA-Z0-9_]*(?:\s*,\s*[A-Z][a-zA-Z0-9_]*)*)\s*>/g;
        while ((genericMatch = genericRegex.exec(lineText)) !== null) {
          const startPos = new vscode.Position(line, genericMatch.index);
          const endPos = new vscode.Position(line, genericMatch.index + genericMatch[0].length);
          ranges.generic.push(new vscode.Range(startPos, endPos));
        }

        // Find static declarations
        if (lineText.includes('static ')) {
          const staticRegex = /\bstatic\s+\w+\s+([A-Za-z_][A-Za-z0-9_]*)/g;
          let staticMatch;
          while ((staticMatch = staticRegex.exec(lineText)) !== null) {
            const idx = lineText.indexOf(staticMatch[1], staticMatch.index);
            const startPos = new vscode.Position(line, idx);
            const endPos = new vscode.Position(line, idx + staticMatch[1].length);
            ranges.static.push(new vscode.Range(startPos, endPos));
          }
        }

        // Find interface declarations
        if (lineText.includes('interface ')) {
          const interfaceMatch = lineText.match(/\binterface\s+([A-Za-z_][A-Za-z0-9_]*)/);
          if (interfaceMatch && interfaceMatch[1]) {
            const idx = lineText.indexOf(interfaceMatch[1]);
            const startPos = new vscode.Position(line, idx);
            const endPos = new vscode.Position(line, idx + interfaceMatch[1].length);
            ranges.interface.push(new vscode.Range(startPos, endPos));
          }
        }

        // Find enum declarations
        if (lineText.includes('enum ')) {
          const enumMatch = lineText.match(/\benum\s+([A-Za-z_][A-Za-z0-9_]*)/);
          if (enumMatch && enumMatch[1]) {
            const idx = lineText.indexOf(enumMatch[1]);
            const startPos = new vscode.Position(line, idx);
            const endPos = new vscode.Position(line, idx + enumMatch[1].length);
            ranges.enum.push(new vscode.Range(startPos, endPos));
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

module.exports = { JavaHighlighter };
