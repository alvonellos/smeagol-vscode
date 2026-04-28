"use strict";

const DEFAULT_PALETTE = [
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

const LGBT_PRIDE_PALETTE = [
  "#ff0000",
  "#ff7f00",
  "#ffff00",
  "#00ff00",
  "#0000ff",
  "#8b00ff"
];

const DEFAULT_EXCLUDE = [
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "break",
  "continue",
  "return",
  "try",
  "catch",
  "finally",
  "throw",
  "new",
  "delete",
  "typeof",
  "instanceof",
  "in",
  "of",
  "void",
  "true",
  "false",
  "null",
  "undefined",
  "class",
  "function",
  "extends",
  "implements",
  "interface",
  "enum",
  "const",
  "let",
  "var",
  "import",
  "export",
  "default",
  "public",
  "private",
  "protected",
  "static",
  "async",
  "await",
  "yield",
  "this",
  "super",
  "get",
  "set",
  "package",
  "namespace",
  "module",
  "type",
  "from",
  "as",
  "with",
  "debugger",
  "using"
];

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);

module.exports = {
  DEFAULT_PALETTE,
  LGBT_PRIDE_PALETTE,
  DEFAULT_EXCLUDE,
  VOID_ELEMENTS
};
