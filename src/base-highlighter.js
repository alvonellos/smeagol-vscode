"use strict";

const vscode = require("vscode");
const { toRgba } = require("./utils");

/**
 * Base Highlighter - Consolidates common patterns across all language highlighters
 * 
 * Usage:
 * ```javascript
 * class MyLanguageHighlighter extends BaseHighlighter {
 *   getLanguageId() {
 *     return "mylanguage";
 *   }
 * 
 *   getTokenPatterns() {
 *     return {
 *       keyword: { regex: /\bkeyword\b/g, color: "#ff0000" },
 *       comment: { regex: /\/\/.*$/gm, color: "#008000" }
 *     };
 *   }
 * }
 * ```
 */
class BaseHighlighter {
  constructor() {
    this.decorationTypes = {};
    this.ranges = {};
  }

  /**
   * Override in subclass to return target language ID
   * @returns {string} VSCode language identifier (e.g., 'rust', 'java')
   */
  getLanguageId() {
    throw new Error("getLanguageId() must be implemented by subclass");
  }

  /**
   * Override in subclass to define token patterns
   * Returns object: { tokenType: { regex: /pattern/g, color: "#hexcolor", style: {...} } }
   * @returns {Object}
   */
  getTokenPatterns() {
    return {};
  }

  /**
   * Create decoration types for all token patterns
   * @protected
   */
  createDecorations() {
    if (Object.keys(this.decorationTypes).length > 0) {
      this.dispose();
    }

    const patterns = this.getTokenPatterns();
    this.decorationTypes = {};
    this.ranges = {};

    for (const [tokenType, config] of Object.entries(patterns)) {
      this.ranges[tokenType] = [];
      const decorationConfig = {
        color: config.color,
        ...config.style // Spread additional style options (fontWeight, fontStyle, etc.)
      };
      this.decorationTypes[tokenType] = vscode.window.createTextEditorDecorationType(decorationConfig);
    }
  }

  /**
   * Dispose all decoration types
   * @protected
   */
  dispose() {
    Object.values(this.decorationTypes).forEach(dec => {
      try {
        dec.dispose();
      } catch (e) {
        // Ignore disposal errors
      }
    });
    this.decorationTypes = {};
    this.ranges = {};
  }

  /**
   * Update highlighting for given editor
   * @param {vscode.TextEditor} editor
   * @public
   */
  update(editor) {
    if (!editor || editor.document.languageId !== this.getLanguageId()) {
      return;
    }

    if (Object.keys(this.decorationTypes).length === 0) {
      this.createDecorations();
    }

    this._clearRanges();
    const doc = editor.document;
    const patterns = this.getTokenPatterns();

    // Process visible ranges for performance
    editor.visibleRanges.forEach(range => {
      for (let line = range.start.line; line <= range.end.line; line++) {
        const lineText = doc.lineAt(line).text;
        this._findMatches(lineText, line, patterns);
      }
    });

    // Apply all decorations
    for (const [tokenType, ranges] of Object.entries(this.ranges)) {
      if (this.decorationTypes[tokenType]) {
        editor.setDecorations(this.decorationTypes[tokenType], ranges);
      }
    }
  }

  /**
   * Find matches for a single line
   * @protected
   * @param {string} lineText
   * @param {number} lineNumber
   * @param {Object} patterns
   */
  _findMatches(lineText, lineNumber, patterns) {
    for (const [tokenType, config] of Object.entries(patterns)) {
      let match;
      const regex = new RegExp(config.regex); // Clone regex
      while ((match = regex.exec(lineText)) !== null) {
        const startPos = new vscode.Position(lineNumber, match.index);
        const endPos = new vscode.Position(lineNumber, match.index + match[0].length);
        this.ranges[tokenType].push(new vscode.Range(startPos, endPos));
      }
    }
  }

  /**
   * Reset all ranges
   * @protected
   */
  _clearRanges() {
    for (const tokenType of Object.keys(this.ranges)) {
      this.ranges[tokenType] = [];
    }
  }

  /**
   * Reset highlighting state
   * @public
   */
  reset() {
    this.dispose();
  }
}

module.exports = { BaseHighlighter };
