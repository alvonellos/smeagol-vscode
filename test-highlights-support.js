"use strict";

const assert = require("assert");
const Module = require("module");

let decorationId = 0;

class MockPosition {
  constructor(line, character) {
    this.line = line;
    this.character = character;
  }
}

class MockRange {
  constructor(startLineOrPosition, startCharacter, endLine, endCharacter) {
    if (typeof startLineOrPosition === "number") {
      this.start = new MockPosition(startLineOrPosition, startCharacter);
      this.end = new MockPosition(endLine, endCharacter);
    } else {
      this.start = startLineOrPosition;
      this.end = startCharacter;
    }
  }
}

const mockVscode = {
  Position: MockPosition,
  Range: MockRange,
  window: {
    createTextEditorDecorationType(options) {
      return {
        id: decorationId++,
        options,
        dispose() {}
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

const { HighlightManager } = require("./src/highlights");

Module._load = originalLoad;

class MockDocument {
  constructor(lines) {
    this.lines = lines;
    this.languageId = "javascript";
    this.lineCount = lines.length;
    this.text = lines.join("\n");
    this.lineOffsets = [];
    let offset = 0;
    for (const line of lines) {
      this.lineOffsets.push(offset);
      offset += line.length + 1;
    }
  }

  getText() {
    return this.text;
  }

  lineAt(line) {
    const text = this.lines[line];
    return {
      text,
      range: new MockRange(line, 0, line, text.length)
    };
  }

  positionAt(offset) {
    let line = 0;
    while (line + 1 < this.lineOffsets.length && this.lineOffsets[line + 1] <= offset) {
      line++;
    }
    return new MockPosition(line, offset - this.lineOffsets[line]);
  }
}

const document = new MockDocument([
  "const alpha = 1;",
  "const beta = 2;",
  "console.log(alpha);"
]);

const decorationCalls = [];
const editor = {
  document,
  visibleRanges: [
    new MockRange(0, 0, 0, document.lines[0].length)
  ],
  setDecorations(decoration, ranges) {
    decorationCalls.push({ decoration, ranges });
  }
};

const manager = new HighlightManager();
manager.update([editor], {
  performance: {
    maxDocumentLength: 100000,
    maxLineCount: 10000
  },
  highlights: {
    enabled: true,
    colors: ["#ff0000", "#00ff00"],
    minOccurrences: 2,
    minLength: 2,
    maxTokens: 10,
    backgroundOpacity: 0.28,
    borderOpacity: 0.9,
    borderWidth: 2,
    borderRadius: 2,
    exclude: ["const"],
    ignoreLanguages: []
  }
});

const paintedRanges = decorationCalls.flatMap((call) => call.ranges);

assert.strictEqual(
  paintedRanges.length,
  1,
  "Highlights should paint the visible occurrence when the token repeats elsewhere in the document"
);
assert.strictEqual(paintedRanges[0].start.line, 0, "Visible alpha occurrence should be on line 0");
assert.strictEqual(paintedRanges[0].start.character, 6, "Visible alpha occurrence should start after const ");

console.log("Highlight support tests passed.");
