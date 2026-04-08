"use strict";

const assert = require("assert");
const Module = require("module");

class MockCompletionItem {
  constructor(label, kind) {
    this.label = label;
    this.kind = kind;
  }
}

class MockMarkdownString {
  constructor(value) {
    this.value = value;
  }
}

class MockSnippetString {
  constructor(value) {
    this.value = value;
  }
}

class MockPosition {
  constructor(line, character) {
    this.line = line;
    this.character = character;
  }
}

class MockRange {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

const mockVscode = {
  CompletionItemKind: {
    Text: 0,
    Keyword: 1,
    Function: 2,
    Module: 3,
    Property: 4,
    Snippet: 5
  },
  CompletionItem: MockCompletionItem,
  MarkdownString: MockMarkdownString,
  SnippetString: MockSnippetString,
  Position: MockPosition,
  Range: MockRange,
  window: {
    createTextEditorDecorationType: () => ({ dispose() {} })
  }
};

const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "vscode") {
    return mockVscode;
  }
  return originalLoad.call(this, request, parent, isMain);
};

const { AdaCompletionProvider } = require("./src/ada-completion");
const { AdaHighlighter } = require("./src/ada-highlighter");
const { ADA_DOCUMENT_SELECTORS, isAdaDocument } = require("./src/ada-support");

Module._load = originalLoad;

assert(ADA_DOCUMENT_SELECTORS.some((selector) => selector.language === "ada"), "Ada selectors should include the ada language id");
assert(isAdaDocument({ languageId: "ada", fileName: "demo.txt" }), "Ada language id should be recognized");
assert(isAdaDocument({ languageId: "plaintext", fileName: "demo.ads" }), "Ada file extensions should be recognized");

const provider = new AdaCompletionProvider();
const items = provider.provideCompletionItems({}, {}, null, null);
const labels = new Set(items.map((item) => item.label));

assert(labels.has("procedure"), "Ada completions should include procedure snippets");
assert(labels.has("package body"), "Ada completions should include package body snippets");
assert(labels.has("pragma Assert"), "Ada completions should include pragma snippets");
assert(labels.has("Ada.Text_IO"), "Ada completions should include common stdlib packages");
assert(labels.has("'Image"), "Ada completions should include attribute completions");

const procedureItem = items.find((item) => item.label === "procedure");
assert(procedureItem.insertText instanceof MockSnippetString, "Procedure completion should insert a snippet");

const highlighter = new AdaHighlighter();
const lines = [
  "with Ada.Text_IO; use Ada.Text_IO;",
  "procedure Hello is",
  "begin",
  "   pragma Assert (1 = 1);",
  "   Put_Line (\"Hello, Ada\"); -- comment",
  "end Hello;"
];

const decorationCalls = [];
const editor = {
  document: {
    languageId: "plaintext",
    fileName: "hello.adb",
    lineAt(index) {
      return { text: lines[index] };
    }
  },
  visibleRanges: [
    { start: { line: 0 }, end: { line: lines.length - 1 } }
  ],
  setDecorations(_decoration, ranges) {
    decorationCalls.push(ranges);
  }
};

highlighter.update(editor);

assert(decorationCalls.length > 0, "Ada highlighter should set decorations");
assert(decorationCalls.some((ranges) => Array.isArray(ranges) && ranges.length > 0), "Ada highlighter should emit semantic ranges");

console.log("Ada support tests passed.");
