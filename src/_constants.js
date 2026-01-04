"use strict";

/**
 * Consolidated Constants for Smeagol
 * All constants organized by category
 */

// Color Palettes
const DEFAULT_PALETTE = [
  "#ff844c", // orange
  "#fdd835", // yellow
  "#aee571", // light green
  "#039be5", // blue
  "#c158dc", // magenta
  "#ff006f", // pink
  "#00e71c", // green
  "#00c7ff", // cyan
  "#facd45", // gold
  "#ffc66d"  // light orange
];

// Keywords to exclude from highlighting
const DEFAULT_EXCLUDE = [
  // Control flow
  "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "return",
  // Exception handling
  "try", "catch", "finally", "throw",
  // Operators
  "new", "delete", "typeof", "instanceof", "in", "of", "void",
  // Primitives
  "true", "false", "null", "undefined",
  // Declarations
  "class", "function", "extends", "implements", "interface", "enum",
  "const", "let", "var", "import", "export", "default",
  // Access modifiers
  "public", "private", "protected", "static",
  // Async/iteration
  "async", "await", "yield",
  // Context
  "this", "super",
  // Property accessors
  "get", "set",
  // Packages/namespaces
  "package", "namespace", "module", "type", "from", "as", "with",
  // Debugging
  "debugger", "using"
];

// Rust-specific patterns
const RUST_KEYWORDS = new Set([
  "fn", "let", "mut", "const", "static", "struct", "enum", "trait", "impl",
  "pub", "crate", "use", "mod", "unsafe", "async", "await", "move",
  "type", "where", "for", "in", "loop", "break", "continue", "return"
]);

const RUST_MACROS = /\b[a-zA-Z_][a-zA-Z0-9_]*!\s*[\({[\[]]/g;
const RUST_LIFETIME = /'[a-zA-Z_][a-zA-Z0-9_]*/g;
const RUST_ATTRIBUTE = /#\[[\s\S]*?\]/g;

// Java-specific patterns
const JAVA_KEYWORDS = new Set([
  "public", "private", "protected", "static", "final", "abstract", "class", "interface",
  "enum", "extends", "implements", "new", "return", "if", "else", "for", "while",
  "do", "switch", "case", "break", "continue", "try", "catch", "finally", "throw",
  "throws", "import", "package", "synchronized", "volatile", "transient", "native",
  "strictfp", "this", "super", "true", "false", "null", "void"
]);

const JAVA_ANNOTATION = /@[A-Za-z_][A-Za-z0-9_]*/g;
const JAVA_GENERIC = /<[^>]+>/g;

// Bracket types for depth coloring
const BRACKET_TYPES = {
  '(': { close: ')', type: 'paren', priority: 1 },
  '[': { close: ']', type: 'square', priority: 1 },
  '{': { close: '}', type: 'curly', priority: 1 },
  '<': { close: '>', type: 'angle', priority: 0.5 }, // Lower priority due to ambiguity
};

// Default performance settings
const DEFAULT_PERFORMANCE = {
  refreshDelayMs: 120,
  maxDocumentLength: 400000,
  maxLineCount: 10000
};

// Language-specific indent sizes (spaces)
const INDENT_SIZES = {
  'rust': 4,
  'java': 4,
  'javascript': 2,
  'typescript': 2,
  'python': 4,
  'go': 8,
  'cpp': 4,
  'c': 4
};

module.exports = {
  DEFAULT_PALETTE,
  DEFAULT_EXCLUDE,
  RUST_KEYWORDS,
  RUST_MACROS,
  RUST_LIFETIME,
  RUST_ATTRIBUTE,
  JAVA_KEYWORDS,
  JAVA_ANNOTATION,
  JAVA_GENERIC,
  BRACKET_TYPES,
  DEFAULT_PERFORMANCE,
  INDENT_SIZES
};
