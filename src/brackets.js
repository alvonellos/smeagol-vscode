
"use strict";

const vscode = require("vscode");
const { BRACKET_TYPES } = require("./_constants");

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
      "#ff6600",
      "#ffff00",
      "#00ff00",
      "#0099ff",
      "#ff00ff",
      "#ff006f",
      "#00e71c",
      "#00ffff",
      "#ffdd00",
      "#ffaa00"
    ];

    const styleKey = JSON.stringify([colors, cfg.lineWidth, cfg.lineOpacity, cfg.style]);

    if (styleKey !== this.styleKey) {
      this.dispose();

      // Create decorations for each depth level
      this.decorationTypes = colors.map((color) => {
        const opacity = cfg.lineOpacity || 0.85;
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
    const trackAngles = this.shouldTrackAngleBrackets(doc);
    const bracketMap = {
      ')': '(', ']': '[', '}': '{', '>': '<'
    };
    const openChars = trackAngles ? "([{<" : "([{";
    const closeChars = trackAngles ? ")]}>" : ")]}";

    for (let lineNum = 0; lineNum < doc.lineCount; lineNum++) {
      const line = this.stripCommentsAndStrings(doc.lineAt(lineNum).text, doc.languageId);

      for (let character = 0; character < line.length; character++) {
        const char = line[character];
        if (openChars.includes(char)) {
          stack.push({
            char,
            line: lineNum,
            character,
            depth: stack.length
          });
          continue;
        }

        if (!closeChars.includes(char)) {
          continue;
        }

        const expectedOpen = bracketMap[char];
        const last = stack[stack.length - 1];
        if (last && expectedOpen === last.char) {
          stack.pop();
          pairs.push({
            open: { line: last.line, character: last.character },
            close: { line: lineNum, character },
            depth: last.depth
          });
        }
      }
    }

    return pairs;
  }

  shouldTrackAngleBrackets(doc) {
    return [
      "typescript",
      "typescriptreact",
      "javascript",
      "javascriptreact",
      "java",
      "cpp",
      "c",
      "csharp",
      "kotlin",
      "rust"
    ].includes(doc.languageId);
  }

  stripCommentsAndStrings(line, languageId) {
    let commentStart = -1;
    if (languageId === "ada") {
      commentStart = line.indexOf("--");
    } else {
      const slashComment = line.indexOf("//");
      const hashComment = ["python", "shell", "powershell", "yaml"].includes(languageId)
        ? line.indexOf("#")
        : -1;
      commentStart = [slashComment, hashComment]
        .filter((index) => index >= 0)
        .sort((a, b) => a - b)[0] ?? -1;
    }

    const scanLimit = commentStart >= 0 ? commentStart : line.length;
    const chars = line.split("");
    let quote = null;
    let escaped = false;

    for (let index = 0; index < scanLimit; index++) {
      const char = line[index];
      if (quote) {
        chars[index] = " ";
        if (escaped) {
          escaped = false;
        } else if (char === "\\") {
          escaped = true;
        } else if (char === quote) {
          quote = null;
        }
        continue;
      }

      if (char === "\"" || char === "'" || char === "`") {
        quote = char;
        chars[index] = " ";
      }
    }

    if (commentStart >= 0) {
      for (let index = commentStart; index < chars.length; index++) {
        chars[index] = " ";
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
