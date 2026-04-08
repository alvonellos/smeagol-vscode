"use strict";

const assert = require("assert");
const Module = require("module");

const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "vscode") {
    return {
      window: {
        createTextEditorDecorationType: () => ({ dispose() {} })
      },
      Range: class Range {}
    };
  }
  return originalLoad.call(this, request, parent, isMain);
};

const { BracketGuidesManager } = require("./src/brackets");
Module._load = originalLoad;

function makeDoc(lines, languageId, fileName) {
  return {
    languageId,
    fileName,
    lineCount: lines.length,
    lineAt(index) {
      return { text: lines[index] };
    }
  };
}

function getPairChars(doc, pairs) {
  return pairs.map((pair) => ({
    open: doc.lineAt(pair.open.line).text[pair.open.character],
    close: doc.lineAt(pair.close.line).text[pair.close.character]
  }));
}

const manager = new BracketGuidesManager();

const adaDoc = makeDoc([
  "procedure Demo is",
  "   -- comment with ( and <> that should be ignored",
  "   Result := F(X);",
  "   subtype Buffer is String (<>);",
  "   pragma Assert (Left < Right);",
  "   Message := \"Ignore (<> ) in strings\";",
  "begin",
  "   null;",
  "end Demo;"
], "ada", "demo.adb");

const adaPairs = manager.findBracketPairs(adaDoc);
assert.strictEqual(adaPairs.length, 3, "Ada should only produce real parenthesis pairs");
assert.deepStrictEqual(
  getPairChars(adaDoc, adaPairs),
  [
    { open: "(", close: ")" },
    { open: "(", close: ")" },
    { open: "(", close: ")" }
  ],
  "Ada should ignore angle brackets, comments, and strings when scanning pairs"
);

const tsDoc = makeDoc([
  "const value: Foo<Bar> = baz(qux);"
], "typescript", "demo.ts");

const tsPairs = manager.findBracketPairs(tsDoc);
assert.deepStrictEqual(
  getPairChars(tsDoc, tsPairs),
  [
    { open: "<", close: ">" },
    { open: "(", close: ")" }
  ],
  "TypeScript should still recognize generic angle brackets"
);

console.log("Bracket guide tests passed.");
