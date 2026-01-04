"use strict";

const vscode = require("vscode");
const { KROMATIC_PALETTE } = require("./constants");

/**
 * APL Language Highlighter
 * Semantic highlighting for A Programming Language (APL)
 */
class AplHighlighter {
  constructor() {
    this.decorationType = {};
    this.reset();
  }

  reset() {
    const palette = KROMATIC_PALETTE;

    this.decorationType = {
      operator: vscode.window.createTextEditorDecorationType({
        color: palette.magenta,
        fontStyle: "bold"
      }),
      function: vscode.window.createTextEditorDecorationType({
        color: palette.orange
      }),
      keyword: vscode.window.createTextEditorDecorationType({
        color: palette.magenta
      }),
      variable: vscode.window.createTextEditorDecorationType({
        color: palette.cyan
      }),
      comment: vscode.window.createTextEditorDecorationType({
        color: palette.gray,
        fontStyle: "italic"
      }),
      string: vscode.window.createTextEditorDecorationType({
        color: palette.green
      }),
      number: vscode.window.createTextEditorDecorationType({
        color: palette.cyan
      }),
      array: vscode.window.createTextEditorDecorationType({
        color: palette.turquoise
      })
    };
  }

  getCompletionItems() {
    return [
      { label: "⍴", detail: "Shape" },
      { label: "⌽", detail: "Reverse" },
      { label: "⍒", detail: "Grade Down" },
      { label: "⍋", detail: "Grade Up" },
      { label: "/", detail: "Reduce" },
      { label: "\\", detail: "Scan" },
      { label: ",", detail: "Ravel" }
    ];
  }

  scan(editor) {
    const document = editor.document;
    if (document.languageId !== "apl" && document.fileName.endsWith(".apl") === false) {
      return;
    }

    const text = document.getText();
    const operators = [];
    const functions = [];
    const keywords = [];
    const variables = [];
    const comments = [];
    const strings = [];
    const numbers = [];

    // APL operators: monadic and dyadic
    const operatorPattern = /[⊢⊣~×÷⌈⌊|⋆⍟○!?=≠<≤>≥←→]/g;
    let match;
    while ((match = operatorPattern.exec(text)) !== null) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      operators.push(new vscode.Range(startPos, endPos));
    }

    // Structural functions
    const functionPattern = /[⍴⌽⍒⍋⊖⊂⊃∪∩⍳⍕⍎]/g;
    while ((match = functionPattern.exec(text)) !== null) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      functions.push(new vscode.Range(startPos, endPos));
    }

    // Higher-order operators
    const horderPattern = /[\/\\\.@⍨¨]/g;
    while ((match = horderPattern.exec(text)) !== null) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      operators.push(new vscode.Range(startPos, endPos));
    }

    // Control keywords
    const keywordPattern = /:(If|Else|EndIf|While|EndWhile|For|EndFor|Repeat|Until|Namespace|EndNamespace)\b/g;
    while ((match = keywordPattern.exec(text)) !== null) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      keywords.push(new vscode.Range(startPos, endPos));
    }

    // Variables (NamedVars start with uppercase or Greek)
    const variablePattern = /\b[A-Z_][A-Za-z0-9_]*\b/g;
    while ((match = variablePattern.exec(text)) !== null) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      variables.push(new vscode.Range(startPos, endPos));
    }

    // Comments (from ⍝ to end of line)
    const commentPattern = /⍝.*$/gm;
    while ((match = commentPattern.exec(text)) !== null) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      comments.push(new vscode.Range(startPos, endPos));
    }

    // Strings (quoted with single quotes)
    const stringPattern = /'([^'\\]|\\.)*'/g;
    while ((match = stringPattern.exec(text)) !== null) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      strings.push(new vscode.Range(startPos, endPos));
    }

    // Numbers
    const numberPattern = /\b\d+\.?\d*([eE][+-]?\d+)?\b/g;
    while ((match = numberPattern.exec(text)) !== null) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      numbers.push(new vscode.Range(startPos, endPos));
    }

    editor.setDecorations(this.decorationType.operator, operators);
    editor.setDecorations(this.decorationType.function, functions);
    editor.setDecorations(this.decorationType.keyword, keywords);
    editor.setDecorations(this.decorationType.variable, variables);
    editor.setDecorations(this.decorationType.comment, comments);
    editor.setDecorations(this.decorationType.string, strings);
    editor.setDecorations(this.decorationType.number, numbers);
  }

  clearAll(editors) {
    editors.forEach(editor => {
      Object.values(this.decorationType).forEach(type => {
        editor.setDecorations(type, []);
      });
    });
  }
}

module.exports = { AplHighlighter };
