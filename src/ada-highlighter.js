"use strict";

const vscode = require("vscode");
const { isAdaDocument } = require("./ada-support");

const ADA_KEYWORD_REGEX = /\b(?:abort|abs|abstract|accept|access|aliased|all|and|array|at|begin|body|case|constant|declare|delay|delta|digits|do|else|elsif|end|entry|exception|exit|for|function|generic|goto|if|in|interface|is|limited|loop|mod|new|not|null|of|or|others|out|overriding|package|pragma|private|procedure|protected|raise|range|record|rem|renames|requeue|return|reverse|select|separate|subtype|synchronized|tagged|task|terminate|then|type|until|use|when|while|with|xor)\b/gi;
const ADA_STRING_REGEX = /"(?:[^"]|"")*"/g;
const ADA_COMMENT_REGEX = /--.*$/;
const ADA_PRAGMA_REGEX = /\bpragma\s+[A-Za-z_][A-Za-z0-9_]*\b/gi;
const ADA_ATTRIBUTE_REGEX = /'[A-Za-z_][A-Za-z0-9_]*(?!')/g;
const ADA_DECLARATION_REGEX = /\b(?:procedure|function|package|task|entry|type|subtype|protected)\s+([A-Za-z_][A-Za-z0-9_]*)/gi;
const ADA_NUMBER_REGEX = /\b\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?\b/g;

class AdaHighlighter {
  constructor() {
    this.decorationTypes = {};
    this.keywordColor = "#039be5";
    this.commentColor = "#888888";
    this.stringColor = "#00e71c";
    this.pragmaColor = "#facd45";
    this.attributeColor = "#00c7ff";
    this.declarationColor = "#00ffd9";
    this.numberColor = "#c158dc";
  }

  createDecorations() {
    if (Object.keys(this.decorationTypes).length > 0) {
      this.dispose();
    }

    this.decorationTypes = {
      keyword: vscode.window.createTextEditorDecorationType({
        color: this.keywordColor,
        fontWeight: "bold"
      }),
      comment: vscode.window.createTextEditorDecorationType({
        color: this.commentColor,
        fontStyle: "italic"
      }),
      string: vscode.window.createTextEditorDecorationType({
        color: this.stringColor
      }),
      pragma: vscode.window.createTextEditorDecorationType({
        color: this.pragmaColor,
        fontWeight: "bold"
      }),
      attribute: vscode.window.createTextEditorDecorationType({
        color: this.attributeColor,
        fontStyle: "italic"
      }),
      declaration: vscode.window.createTextEditorDecorationType({
        color: this.declarationColor
      }),
      number: vscode.window.createTextEditorDecorationType({
        color: this.numberColor
      })
    };
  }

  dispose() {
    Object.values(this.decorationTypes).forEach((decoration) => decoration.dispose());
    this.decorationTypes = {};
  }

  update(editor) {
    if (!editor) {
      return;
    }
    if (!isAdaDocument(editor.document)) {
      this.clear(editor);
      return;
    }

    if (Object.keys(this.decorationTypes).length === 0) {
      this.createDecorations();
    }

    const doc = editor.document;
    const ranges = {
      keyword: [],
      comment: [],
      string: [],
      pragma: [],
      attribute: [],
      declaration: [],
      number: []
    };

    editor.visibleRanges.forEach((range) => {
      for (let line = range.start.line; line <= range.end.line; line++) {
        const lineText = doc.lineAt(line).text;
        const maskedLine = this.maskIgnoredText(lineText);
        this.collectMatches(lineText, maskedLine, line, ranges);
      }
    });

    Object.keys(this.decorationTypes).forEach((key) => {
      editor.setDecorations(this.decorationTypes[key], ranges[key]);
    });
  }

  collectMatches(originalLine, maskedLine, lineNumber, ranges) {
    this.pushMatches(originalLine, lineNumber, ADA_STRING_REGEX, ranges.string);
    this.pushComment(originalLine, lineNumber, ranges.comment);
    this.pushMatches(maskedLine, lineNumber, ADA_PRAGMA_REGEX, ranges.pragma);
    this.pushMatches(maskedLine, lineNumber, ADA_ATTRIBUTE_REGEX, ranges.attribute);
    this.pushMatches(maskedLine, lineNumber, ADA_KEYWORD_REGEX, ranges.keyword);
    this.pushDeclarationMatches(maskedLine, lineNumber, ranges.declaration);
    this.pushMatches(maskedLine, lineNumber, ADA_NUMBER_REGEX, ranges.number);
  }

  pushMatches(sourceLine, lineNumber, regex, output) {
    const matcher = new RegExp(regex.source, regex.flags);
    let match;
    while ((match = matcher.exec(sourceLine)) !== null) {
      const startPos = new vscode.Position(lineNumber, match.index);
      const endPos = new vscode.Position(lineNumber, match.index + match[0].length);
      output.push(new vscode.Range(startPos, endPos));
    }
  }

  pushComment(lineText, lineNumber, output) {
    const match = ADA_COMMENT_REGEX.exec(lineText);
    if (!match || match.index < 0) {
      return;
    }

    const startPos = new vscode.Position(lineNumber, match.index);
    const endPos = new vscode.Position(lineNumber, lineText.length);
    output.push(new vscode.Range(startPos, endPos));
  }

  pushDeclarationMatches(maskedLine, lineNumber, output) {
    const matcher = new RegExp(ADA_DECLARATION_REGEX.source, ADA_DECLARATION_REGEX.flags);
    let match;
    while ((match = matcher.exec(maskedLine)) !== null) {
      const name = match[1];
      if (!name) {
        continue;
      }

      const nameIndex = maskedLine.indexOf(name, match.index);
      if (nameIndex < 0) {
        continue;
      }

      const startPos = new vscode.Position(lineNumber, nameIndex);
      const endPos = new vscode.Position(lineNumber, nameIndex + name.length);
      output.push(new vscode.Range(startPos, endPos));
    }
  }

  maskIgnoredText(lineText) {
    const chars = Array.from(lineText);
    let index = 0;

    while (index < chars.length) {
      if (chars[index] === "-" && chars[index + 1] === "-") {
        for (let commentIndex = index; commentIndex < chars.length; commentIndex++) {
          chars[commentIndex] = " ";
        }
        break;
      }

      if (chars[index] !== "\"") {
        index += 1;
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

        index += 1;
        break;
      }
    }

    return chars.join("");
  }

  clear(editor) {
    if (!editor) {
      return;
    }
    Object.values(this.decorationTypes).forEach((decoration) => {
      editor.setDecorations(decoration, []);
    });
  }

  clearAll(editors) {
    editors.forEach((editor) => this.clear(editor));
  }

  reset() {
    this.dispose();
  }
}

module.exports = { AdaHighlighter };
