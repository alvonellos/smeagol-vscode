# Base Classes Developer Guide

**Version**: 1.0  
**Last Updated**: January 30, 2026  
**Status**: Ready for Implementation  

---

## Overview

This guide explains how to use the two new base classes to eliminate code duplication:
- **BaseCompletionProvider** - For language completion suggestions
- **BaseHighlighter** - For semantic syntax highlighting

---

## Part 1: BaseCompletionProvider

### 1.1 What It Is

A generic base class that handles:
- Completion item creation and formatting
- Caching with configurable TTL
- Debouncing for performance
- Lifecycle management (initialize, reset, dispose)

All you need to provide is the language-specific completion data.

### 1.2 Creating a New Completion Provider

#### Step 1: Extend BaseCompletionProvider

```javascript
"use strict";

const vscode = require("vscode");
const { BaseCompletionProvider } = require("./base-completion-provider");

class MyLanguageCompletionProvider extends BaseCompletionProvider {
  constructor() {
    super(500, 5 * 60 * 1000); // cacheSize=500, cacheTTL=5min
    this.initialize();
  }

  // REQUIRED: Return target language ID
  getLanguageId() {
    return "mylanguage";
  }

  // REQUIRED: Return array of completion data
  getCompletions() {
    return [
      // Array of completion objects
    ];
  }
}

module.exports = { MyLanguageCompletionProvider };
```

#### Step 2: Define Completion Data

```javascript
getCompletions() {
  return [
    {
      label: "keyword",
      kind: vscode.CompletionItemKind.Keyword,
      detail: "keyword syntax",
      doc: "Description of keyword in Markdown"
    },
    {
      label: "function",
      kind: vscode.CompletionItemKind.Function,
      detail: "function(args)",
      doc: "Function description"
    },
    {
      label: "snippet",
      kind: vscode.CompletionItemKind.Snippet,
      detail: "for loop",
      doc: "Loop description",
      insertText: "for ${1:i} in ${2:range}:\n    ${0:pass}"
    }
  ];
}
```

### 1.3 Completion Item Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | string | Yes | Display text in suggestion menu |
| kind | CompletionItemKind | Yes | Icon type (Keyword, Function, Class, etc.) |
| detail | string | No | Short description shown next to label |
| doc | string | No | Full documentation shown on hover |
| insertText | string | No | Text to insert when selected (default: label) |

### 1.4 CompletionItemKind Options

```javascript
vscode.CompletionItemKind.Text         // Plain text
vscode.CompletionItemKind.Method       // Method/function
vscode.CompletionItemKind.Function     // Function
vscode.CompletionItemKind.Constructor  // Constructor
vscode.CompletionItemKind.Field        // Object field
vscode.CompletionItemKind.Variable     // Variable
vscode.CompletionItemKind.Class        // Class
vscode.CompletionItemKind.Struct       // Struct type
vscode.CompletionItemKind.Interface    // Interface
vscode.CompletionItemKind.Module       // Module/package
vscode.CompletionItemKind.Property     // Property
vscode.CompletionItemKind.Unit         // Unit
vscode.CompletionItemKind.Value        // Value/constant
vscode.CompletionItemKind.Enum         // Enum
vscode.CompletionItemKind.EnumMember   // Enum value
vscode.CompletionItemKind.Keyword      // Language keyword
vscode.CompletionItemKind.Snippet      // Code snippet
vscode.CompletionItemKind.Color        // Color value
vscode.CompletionItemKind.Reference    // Reference/import
vscode.CompletionItemKind.Folder       // Folder
vscode.CompletionItemKind.File         // File
vscode.CompletionItemKind.Event        // Event
vscode.CompletionItemKind.Operator     // Operator
vscode.CompletionItemKind.TypeParameter // Type parameter
```

### 1.5 Full Example: Go Completion Provider

```javascript
"use strict";

const vscode = require("vscode");
const { BaseCompletionProvider } = require("./base-completion-provider");

class GoCompletionProvider extends BaseCompletionProvider {
  constructor() {
    super(300, 5 * 60 * 1000);
    this.initialize();
  }

  getLanguageId() {
    return "go";
  }

  getCompletions() {
    return [
      // Standard library packages
      {
        label: "fmt",
        kind: vscode.CompletionItemKind.Module,
        detail: "import \"fmt\"",
        doc: "The fmt package provides formatted I/O."
      },
      {
        label: "net/http",
        kind: vscode.CompletionItemKind.Module,
        detail: "import \"net/http\"",
        doc: "The net/http package provides HTTP client and server implementations."
      },

      // Keywords
      {
        label: "func",
        kind: vscode.CompletionItemKind.Keyword,
        detail: "func name() {}",
        doc: "Function declaration"
      },
      {
        label: "go",
        kind: vscode.CompletionItemKind.Keyword,
        detail: "go fn()",
        doc: "Launch goroutine"
      },

      // Snippets
      {
        label: "main",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "main function",
        doc: "Main entry point",
        insertText: "func main() {\n    ${0}\n}"
      },
      {
        label: "for",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "for loop",
        doc: "Iterate over range",
        insertText: "for ${1:i} := 0; ${1:i} < ${2:n}; ${1:i}++ {\n    ${0}\n}"
      }
    ];
  }
}

module.exports = { GoCompletionProvider };
```

### 1.6 Caching & Performance

The base class handles caching automatically:

```javascript
// Default: 500 items cached for 5 minutes
super(500, 5 * 60 * 1000);

// Customize for your language:
// - Large standard library? Use bigger cache
super(1000, 10 * 60 * 1000); // 1000 items, 10 min TTL

// - Small/simple language? Use smaller cache
super(100, 2 * 60 * 1000); // 100 items, 2 min TTL
```

**Cache behavior**:
- First call: Generates completion items (slow ~5ms)
- Subsequent calls (within TTL): Returns cached items (fast <1ms)
- After TTL expires: Regenerates and recaches

### 1.7 Lifecycle Methods

You can override these methods if needed:

```javascript
class MyLanguageCompletionProvider extends BaseCompletionProvider {
  // Called when provider is disposed (cleanup)
  dispose() {
    super.dispose(); // Must call super
    // Your cleanup code here
  }

  // Called when configuration changes (via onDidChangeConfiguration)
  reset() {
    super.reset(); // Must call super
    // Reinitialize if needed
  }

  // Override if you need custom resolution (e.g., fetch docs from server)
  resolveCompletionItem(item, token) {
    // Optionally fetch additional info
    return item;
  }
}
```

### 1.8 Integration in extension.js

```javascript
const { MyLanguageCompletionProvider } = require("./my-language-completion");

class SmeagolController {
  constructor(context) {
    this.myLanguageProvider = new MyLanguageCompletionProvider();

    // Register with VS Code
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        "mylanguage",
        this.myLanguageProvider,
        ".", "::", "//" // Trigger characters
      )
    );
  }
}
```

---

## Part 2: BaseHighlighter

### 2.1 What It Is

A generic base class that handles:
- Decoration type creation and management
- Pattern matching for all visible ranges
- Range collection and application
- Performance optimization (visible ranges only)
- Lifecycle management (reset, dispose)

All you need to provide is token patterns (regex + color).

### 2.2 Creating a New Highlighter

#### Step 1: Extend BaseHighlighter

```javascript
"use strict";

const vscode = require("vscode");
const { BaseHighlighter } = require("./base-highlighter");

class MyLanguageHighlighter extends BaseHighlighter {
  // REQUIRED: Return target language ID
  getLanguageId() {
    return "mylanguage";
  }

  // REQUIRED: Return token patterns
  getTokenPatterns() {
    return {
      // tokenType: { regex, color, style (optional) }
    };
  }
}

module.exports = { MyLanguageHighlighter };
```

#### Step 2: Define Token Patterns

```javascript
getTokenPatterns() {
  return {
    keyword: {
      regex: /\b(if|else|while|for)\b/g,
      color: "#569cd6"
    },
    comment: {
      regex: /\/\/.*$/gm,
      color: "#6a9955"
    },
    string: {
      regex: /"[^"]*"/g,
      color: "#ce9178"
    },
    function: {
      regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
      color: "#dcdcaa",
      style: { fontWeight: "bold" }
    }
  };
}
```

### 2.3 Pattern Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| regex | RegExp | Yes | Pattern to match (with /g flag) |
| color | string | Yes | Hex color code (e.g., "#ff0000") |
| style | object | No | Additional styling (fontWeight, fontStyle, etc.) |

### 2.4 Style Options

```javascript
style: {
  fontWeight: "bold",        // bold, normal
  fontStyle: "italic",       // italic, normal
  textDecoration: "underline", // underline, etc.
  backgroundColor: "#ffffff", // background color
  border: "1px solid #000",  // border style
  borderRadius: "2px"        // border radius
}
```

### 2.5 Full Example: Rust Highlighter

```javascript
"use strict";

const vscode = require("vscode");
const { BaseHighlighter } = require("./base-highlighter");

class RustHighlighter extends BaseHighlighter {
  getLanguageId() {
    return "rust";
  }

  getTokenPatterns() {
    return {
      // Macros: identifier!
      macro: {
        regex: /\b([a-zA-Z_][a-zA-Z0-9_]*!)/g,
        color: "#facd45",
        style: { fontWeight: "bold" }
      },

      // Lifetimes: 'name
      lifetime: {
        regex: /'[a-zA-Z_][a-zA-Z0-9_]*/g,
        color: "#00c7ff",
        style: { fontStyle: "italic" }
      },

      // Attributes: #[attribute]
      attribute: {
        regex: /#\[\w+/g,
        color: "#ffc66d"
      },

      // Traits: implements, dyn Trait
      trait: {
        regex: /\b(dyn|impl)\s+(\w+)/g,
        color: "#00ffd9"
      },

      // Generic parameters: <T, U>
      generic: {
        regex: /<[^>]+>/g,
        color: "#bb00ff"
      }
    };
  }
}

module.exports = { RustHighlighter };
```

### 2.6 Color Reference

**Common color schemes** (Dark background):

| Element | Color | Hex | Notes |
|---------|-------|-----|-------|
| Keywords | Blue | #569cd6 | Most languages |
| Strings | Orange | #ce9178 | Standard |
| Comments | Green | #6a9955 | Line/block comments |
| Functions | Yellow | #dcdcaa | Bold recommended |
| Macros | Gold | #facd45 | Bold recommended |
| Lifetimes | Cyan | #00c7ff | Italic recommended |
| Generics | Purple | #bb00ff | Type parameters |
| Attributes | Orange | #ffc66d | Decorators |

### 2.7 Performance Optimization

The base class automatically optimizes performance:

```javascript
// Only visible ranges are processed (not entire file)
editor.visibleRanges.forEach(range => {
  for (let line = range.start.line; line <= range.end.line; line++) {
    // Match patterns only for visible lines
  }
});

// Result: O(visible_lines) instead of O(all_lines)
```

**For files with 1000+ lines**:
- Without optimization: 1000+ lines scanned every keystroke → Slow
- With optimization: Only ~50 visible lines scanned → Fast

### 2.8 Regex Guidelines

**DO**:
- Use `/g` flag for global matching: `/pattern/g`
- Use `/m` flag for multiline: `/pattern/gm`
- Test patterns in regexper.com before using

```javascript
// GOOD: Matches macros everywhere
macro: {
  regex: /\b([a-zA-Z_][a-zA-Z0-9_]*!)/g,
  color: "#facd45"
}
```

**DON'T**:
- Leave off `/g` flag → Only first match highlighted
- Use overly complex regex → Performance degrades
- Forget to escape special characters

```javascript
// BAD: Missing /g flag - only first macro highlighted
macro: {
  regex: /\b([a-zA-Z_][a-zA-Z0-9_]*!)/,
  color: "#facd45"
}

// BAD: Overly complex - runs slowly
attribute: {
  regex: /#\[(?:[a-zA-Z_][\w]*(?:\([^)]*\))?(?:,)?)*\]/g,
  color: "#ffc66d"
}
```

### 2.9 Lifecycle Methods

```javascript
class MyLanguageHighlighter extends BaseHighlighter {
  // Called on editor change
  update(editor) {
    super.update(editor); // Must call super
    // Your custom updates here
  }

  // Called when disposed
  dispose() {
    super.dispose(); // Must call super
    // Your cleanup code here
  }

  // Called when configuration changes
  reset() {
    super.reset(); // Must call super
    // Reinitialize if needed
  }
}
```

### 2.10 Integration in extension.js

```javascript
const { MyLanguageHighlighter } = require("./my-language-highlighter");

class SmeagolController {
  constructor(context) {
    this.myLanguageHighlighter = new MyLanguageHighlighter();

    // Update when editor changes
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        this.myLanguageHighlighter.update(editor);
      }
    });

    // Update when document changes
    vscode.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === event.document) {
        this.myLanguageHighlighter.update(editor);
      }
    });

    // Cleanup on extension deactivate
    context.subscriptions.push({
      dispose: () => this.myLanguageHighlighter.dispose()
    });
  }
}
```

---

## Part 3: Migration Checklist

### Converting Existing Completion Provider

```
[ ] 1. Copy provider file name for reference
[ ] 2. Extend BaseCompletionProvider in constructor
[ ] 3. Implement getLanguageId() method
[ ] 4. Extract completions to getCompletions() return value
[ ] 5. Remove old initialize() method
[ ] 6. Remove old provideCompletionItems() (inherited)
[ ] 7. Remove old reset()/dispose() (inherited)
[ ] 8. Verify no other methods/properties
[ ] 9. Test completions still show in editor
[ ] 10. Check cache/debouncing still works
[ ] 11. Run lint check (no errors)
[ ] 12. Commit: "refactor: consolidate language completion provider"
```

### Converting Existing Highlighter

```
[ ] 1. Copy highlighter file name for reference
[ ] 2. Extend BaseHighlighter in constructor
[ ] 3. Implement getLanguageId() method
[ ] 4. Convert color definitions to getTokenPatterns()
[ ] 5. Convert pattern matching to regex in patterns
[ ] 6. Remove old createDecorations() method
[ ] 7. Remove old dispose() method
[ ] 8. Remove old update() method (inherited)
[ ] 9. Verify no other methods/properties
[ ] 10. Test syntax highlighting works in editor
[ ] 11. Check all token types still highlight
[ ] 12. Run lint check (no errors)
[ ] 13. Commit: "refactor: consolidate language highlighter"
```

---

## Part 4: Troubleshooting

### Problem: Completions not showing

**Check**:
1. `getLanguageId()` returns correct value
2. Provider is registered in extension.js
3. `getCompletions()` returns non-empty array
4. Trigger characters match use case
5. VSCode language mode matches languageId

### Problem: Syntax highlighting not appearing

**Check**:
1. `getLanguageId()` returns correct value
2. Highlighter is instantiated in SmeagolController
3. `getTokenPatterns()` returns patterns
4. Regex patterns have `/g` flag
5. Colors are valid hex codes (#RRGGBB)
6. File is in correct language mode

### Problem: Performance is slow

**Check**:
1. Pattern regex isn't overly complex
2. Highlighter uses visible ranges (BaseHighlighter handles this)
3. Cache size is appropriate for language
4. Check DevTools Performance tab:
   - Open: `Help > Toggle Developer Tools > Performance`
   - Record while typing
   - Look for "time spent in pattern matching"

### Problem: Colors don't match theme

**Solution**:
Use theme color variables instead of hardcoded hex:

```javascript
// BETTER: Respects user theme
color: "var(--vscode-symbolIcon-keywordForeground)"

// Or use vscode theme colors
style: {
  color: new vscode.ThemeColor("keyword.foreground")
}
```

---

## Part 5: API Reference

### BaseCompletionProvider

```javascript
class BaseCompletionProvider {
  constructor(cacheSize, cacheTTL)
  
  abstract getCompletions()           // Override: return completion data
  abstract getLanguageId()            // Override: return language ID
  
  initialize()                        // Called in constructor
  provideCompletionItems()            // Called by VSCode (don't override)
  resolveCompletionItem(item, token)  // Can override for custom resolution
  reset()                             // Clear cache and reset state
  dispose()                           // Cleanup resources
  
  // Protected
  _setupCache()                       // Hook for subclasses
  _getCachedCompletions()             // Get with cache support
}
```

### BaseHighlighter

```javascript
class BaseHighlighter {
  constructor()
  
  abstract getLanguageId()            // Override: return language ID
  abstract getTokenPatterns()         // Override: return patterns
  
  update(editor)                      // Called on editor change
  reset()                             // Clear state
  dispose()                           // Cleanup resources
  
  // Protected
  createDecorations()                 // Create decoration types
  _findMatches(lineText, line, patterns) // Find matches in line
  _clearRanges()                      // Reset range cache
}
```

---

## Part 6: Examples by Language

### Python Completion

```javascript
class PythonCompletionProvider extends BaseCompletionProvider {
  getLanguageId() { return "python"; }
  
  getCompletions() {
    return [
      // Builtins
      { label: "print", kind: 12, detail: "print(...)", doc: "Print to stdout" },
      { label: "len", kind: 12, detail: "len(x)", doc: "Return length" },
      // Async
      { label: "async def", kind: 4, detail: "async def:", doc: "Async function" },
      { label: "await", kind: 4, detail: "await", doc: "Await coroutine" },
      // Decorators
      { label: "@property", kind: 4, detail: "@property", doc: "Property decorator" }
    ];
  }
}
```

### Java Highlighter

```javascript
class JavaHighlighter extends BaseHighlighter {
  getLanguageId() { return "java"; }
  
  getTokenPatterns() {
    return {
      annotation: {
        regex: /@([A-Za-z_][A-Za-z0-9_]*)/g,
        color: "#facd45",
        style: { fontWeight: "bold" }
      },
      generic: {
        regex: /<[^>]+>/g,
        color: "#00c7ff"
      }
    };
  }
}
```

---

**Document Version**: 1.0  
**Last Updated**: January 30, 2026  
**Status**: ✓ READY FOR USE
