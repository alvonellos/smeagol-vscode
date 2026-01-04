"use strict";

/**
 * Data Models for Smeagol
 * Defines all shared data structures across the extension
 */

class TokenHighlight {
  constructor(token, ranges, colorIndex) {
    this.token = token;
    this.ranges = ranges;
    this.colorIndex = colorIndex;
  }
}

class BracketPair {
  constructor(open, close, depth, children = []) {
    this.open = open; // { line, character }
    this.close = close; // { line, character }
    this.depth = depth;
    this.children = children;
  }
}

class SemanticToken {
  constructor(range, type, modifiers = []) {
    this.range = range;
    this.type = type; // 'class', 'function', 'variable', 'parameter', 'property', 'macro', 'lifetime', etc
    this.modifiers = modifiers; // ['static', 'readonly', 'deprecated', etc]
  }
}

class FunctionDefinition {
  constructor(name, kind, startLine, endLine, isStatic = false) {
    this.name = name;
    this.kind = kind; // 'function', 'class', 'method', 'struct', 'trait', 'impl'
    this.startLine = startLine;
    this.endLine = endLine;
    this.isStatic = isStatic;
    this.calls = []; // { line, column } references
  }
}

class LanguageContext {
  constructor(languageId) {
    this.languageId = languageId;
    this.isJava = languageId === 'java';
    this.isRust = languageId === 'rust';
    this.isTypeScript = languageId === 'typescript' || languageId === 'typescriptreact';
    this.isJavaScript = languageId === 'javascript' || languageId === 'javascriptreact';
    this.isPython = languageId === 'python';
    this.isGo = languageId === 'go';
    this.isCpp = languageId === 'cpp' || languageId === 'c';
  }
}

module.exports = {
  TokenHighlight,
  BracketPair,
  SemanticToken,
  FunctionDefinition,
  LanguageContext
};
