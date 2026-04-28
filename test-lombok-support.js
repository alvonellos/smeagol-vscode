"use strict";

const assert = require("assert");
const Module = require("module");

let lombokEnabled = true;

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

const mockVscode = {
  CompletionItemKind: {
    Class: 7
  },
  CompletionItem: MockCompletionItem,
  MarkdownString: MockMarkdownString,
  workspace: {
    getConfiguration() {
      return {
        get(key, fallback) {
          if (key === "lombok.enabled") {
            return lombokEnabled;
          }
          return fallback;
        }
      };
    }
  }
};

const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "vscode") {
    return mockVscode;
  }
  return originalLoad.call(this, request, parent, isMain);
};

const { LombokCompletionProvider } = require("./src/lombok-completion");

Module._load = originalLoad;

function javaDocument(lineText) {
  return {
    languageId: "java",
    lineAt() {
      return { text: lineText };
    }
  };
}

const provider = new LombokCompletionProvider();

let items = provider.provideCompletionItems(
  javaDocument("@"),
  { line: 0, character: 1 },
  null,
  { triggerCharacter: "@" }
);
let labels = new Set(items.map((item) => item.label));

assert(labels.has("@Data"), "Lombok completions should include @Data");
assert(labels.has("@Slf4j"), "Lombok completions should include @Slf4j");

items = provider.provideCompletionItems(
  javaDocument("public class User"),
  { line: 0, character: 17 },
  null,
  {}
);
assert.strictEqual(items.length, 0, "Lombok completions should stay quiet outside annotation context");

lombokEnabled = false;
items = provider.provideCompletionItems(
  javaDocument("@"),
  { line: 0, character: 1 },
  null,
  { triggerCharacter: "@" }
);
assert.strictEqual(items.length, 0, "Lombok completions should honor smeagol.lombok.enabled");

console.log("Lombok support tests passed.");
