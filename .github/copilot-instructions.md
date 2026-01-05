# Smeagol VS Code Extension - AI Coding Instructions

## Project Overview
**Smeagol** is a polyglot IDE extension (v0.2.3) providing:
- Automatic code complexity analysis with configurable thresholds
- 470+ smart completions for 14 languages (Python, Java, Rust, Go, JavaScript, Shell, AutoIt, APL, etc.)
- Semantic syntax highlighting and language-specific analysis
- Integration with SonarQube for code quality metrics

**Key Insight**: This is an opinionated VS Code extension that runs analysis *automatically* on file open/change—not via commands. The complexity analyzer is the star feature.

## Architecture at a Glance

### Central Orchestrator
- **`src/extension.js`**: `SmeagolController` class instantiates and manages all feature modules
- Single activation event: `onStartupFinished` (lightweight startup)
- Subscribes to VSCode events: `onDidChangeActiveTextEditor`, `onDidChangeTextDocument`, `onDidChangeConfiguration`

### Feature Categories

#### 1. Visual Managers (Core Rendering)
- `HighlightManager` - Multi-identifier semantic highlighting with rainbow colors
- `IndentManager` - Indent guide visualization with configurable depth colors
- `FunctionManager` - Function/class declaration highlighting
- `BracketGuidesManager` - Bracket pair depth visualization (LGBT pride 6-color spectrum)
- `HtmlManager` - Safe HTML preview rendering

#### 2. Language Highlighters (10+ languages)
Each implements pattern-based syntax highlighting:
- `RustHighlighter` - Macros, lifetimes, attributes, traits (~20 patterns)
- `JavaHighlighter` - Annotations, generics, static members (~20 patterns)
- `CppHighlighter` - Pointers, macros, namespaces, templates (~20 patterns)
- `AutoItHighlighter` - 150+ functions, 50+ macros (~200 patterns)
- `AplHighlighter` - 50+ APL operators

**Pattern**: All use `vscode.window.createTextEditorDecorationType()` with color mappings from `constants.js` (`DEFAULT_PALETTE`).

#### 3. Completion Providers (14 languages)
Uniform interface:
```javascript
class LanguageCompletionProvider {
  initialize() {
    this.completionItems = [
      new vscode.CompletionItem(label, kind),
      // ...
    ];
  }
  provideCompletionItems(document, position, token) {
    return this.completionItems;  // Filtered by caller
  }
}
```

Providers use trigger characters to optimize performance. See `extension.js` lines 108-170 for registration patterns.

#### 4. Analysis Engines
- `ComplexityAnalyzer` - Cyclomatic complexity + branch path analysis via pre-compiled regex patterns
- `IdiomsAnalyzer` - Detects non-idiomatic patterns per language
- `CodePatternsAnalyzer` - Abstract syntax pattern recognition
- `SymbolSummoner` - Generates symbol wordclouds for visualization

#### 5. Integration & Tools
- `SonarQubeConnector` - Quality metrics integration via HTTP
- `AiDslCompiler` - Custom DSL for AI prompt generation
- `SuggestionEngine` - Recommendation system for refactoring
- `ConcordanceSystem` - Project-wide symbol index and search

## Critical Workflow Patterns

### Configuration System
**File**: `src/config-loader.js` provides `ConfigLoader` class
- Loads `.smeagol/config.json` from workspace root (defaults if missing)
- Supports per-language thresholds (complexity warning/error, branch paths)
- Watch capability: `watchConfig(callback)` for hot-reload
- Usage: `configLoader.getComplexityThreshold(language, 'warning')`

**Default Thresholds Example**:
```javascript
{
  "complexity": { "warning": 10, "error": 15 },
  "languages": {
    "javascript": { "complexity": { "warning": 12, "error": 18 } },
    // ... per-language overrides
  }
}
```

### Performance Optimization
- **Debouncer** (`debouncer.js`): Delays expensive operations (analysis, completions) until user stops typing
- **Pre-compiled Regex** (`complexity-analyzer.js`): Patterns compiled once at module load, not per-call
- **Cache** (`completion-cache.js`): Completion results cached with TTL (default 5 min)
- **PerformanceProfiler** (`performance-profiler.js`): Metrics collection for optimization

### Update Scheduling
```javascript
// In extension.js - scheduleUpdate() called on every editor change
// Uses updateId counter to prevent overlapping updates
scheduleUpdate() {
  clearTimeout(this.updateTimer);
  this.updateId++;
  const localId = this.updateId;
  this.updateTimer = setTimeout(() => {
    if (localId === this.updateId) {
      // Execute all manager updates
    }
  }, 100); // 100ms debounce
}
```

## Key Development Conventions

### Module Export Pattern
```javascript
// Every src/*.js file exports a class or object
class MyFeature { /* ... */ }
module.exports = { MyFeature };  // Named export required

// Destructuring in extension.js
const { MyFeature } = require("./my-feature");
```

### Regex Pattern Style
Use pre-compiled patterns at module load, reference via `PRECOMPILED_REGEX` map:
```javascript
const PRECOMPILED_REGEX = {
  jsFunction: /^(\s*)(async\s+)?function\s+(\w+)\s*\(/gm,
};
// Then: text.match(PRECOMPILED_REGEX.jsFunction)
```

### VSCode Color/Decoration Pattern
```javascript
const decorationType = vscode.window.createTextEditorDecorationType({
  backgroundColor: toRgba(color, opacity),
  border: `2px solid ${borderColor}`,
  borderRadius: "2px"
});
editor.setDecorations(decorationType, ranges); // ranges = [{ range, hoverMessage }]
```

### Diagnostic Reporting (for Problems Panel)
```javascript
const diagnostic = new vscode.Diagnostic(
  range,
  `Message with details`,
  vscode.DiagnosticSeverity.Error // or Warning, Information
);
diagnostic.source = "Smeagol Feature Name";
diagnostic.code = "error-code";
diagnosticsCollection.set(document.uri, [diagnostic]);
```

## Code Quality Standards

### Input Validation & Defensive Programming
**Files exemplifying this**: `utils.js`, `config-loader.js`, `complexity-analyzer.js`

All user inputs and external data must be validated:
```javascript
function sanitizeColorArray(value, fallback) {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback.slice();
  }
  return value
    .map((item) => String(item))
    .filter((item) => item.length > 0);
}

function toNumber(value, fallback) {
  if (typeof value === "number" && !isNaN(value)) return value;
  const parsed = Number(value);
  return !isNaN(parsed) ? parsed : fallback;
}
```

**Apply to**:
- Config file parsing (always validate before use)
- Color parsing from settings
- Numeric thresholds
- File paths and patterns

### Error Handling & Graceful Degradation
Use try/catch with meaningful messages and fallbacks:
```javascript
try {
  if (fs.existsSync(this.configPath)) {
    const rawConfig = fs.readFileSync(this.configPath, "utf-8");
    const userConfig = JSON.parse(rawConfig);
    this.config = this._mergeConfigs(DEFAULT_CONFIG, userConfig);
  }
} catch (error) {
  console.warn(`Failed to load config from ${this.configPath}:`, error.message);
  this.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG)); // Safe fallback
}
```

### Performance Critical: Caching & Debouncing
**Applied in**: `python-completion.js`, `complexity-analyzer.js`, `extension.js`

Three-tier performance strategy:
1. **Debounce** expensive operations (300ms delay typical)
2. **Cache** results with TTL (5min default)
3. **Pre-compile** regex patterns at module load

```javascript
constructor() {
  this.cache = new CompletionCache(500, 5 * 60 * 1000); // 500 items, 5min TTL
  this.debouncer = new Debouncer(() => this.completionItems, 300);
}
```

### Documentation Quality
Every class and public method must have JSDoc comments:
```javascript
/**
 * Analyze document for complexity metrics
 * @param {vscode.TextEditor} editor - Active editor
 * @returns {void}
 */
analyzeDocument(editor) { /* ... */ }
```

### Strict Mode & Consistent Conventions
- **Always use `"use strict";`** at module start
- **Use `const`/`let`** never `var` (enforced by pattern)
- **Arrow functions** for closures, regular functions for methods
- **Object destructuring** for imports to prevent namespace pollution

### State Management & Cleanup
All managers implement **reset/dispose pattern**:
```javascript
class HighlightManager {
  reset() {
    this.styleKey = "";
    this.dispose(); // Clean up resources
  }

  dispose() {
    this.decorationTypes.forEach((decoration) => decoration.dispose());
    this.decorationTypes = [];
  }

  // Called when config changes
  update(editors, config) { /* ... */ }
}
```

**All event listeners must be cleanup**:
```javascript
watchConfig(callback) {
  const watcher = fs.watch(this.configPath, (eventType) => { /* ... */ });
  this.watchers.push(watcher);
  return () => {
    watcher.close();
    this.watchers = this.watchers.filter(w => w !== watcher);
  };
}

closeWatchers() {
  this.watchers.forEach(watcher => {
    try { watcher.close(); } catch (e) { /* ignore */ }
  });
  this.watchers = [];
}
```

### Metrics & Observability
**PerformanceProfiler** for performance-critical operations:
```javascript
const profiler = new PerformanceProfiler("analysis");
profiler.startTimer();
// ... expensive operation
const elapsed = profiler.endTimer();
profiler.recordCacheHit(); // Track cache behavior
profiler.snapshotMemory();  // Monitor memory
```

**Diagnostics Collection** for user-visible issues:
```javascript
const diagnosticsCollection = vscode.languages.createDiagnosticCollection("smeagol-feature");
// Then populate and report to user
diagnosticsCollection.set(document.uri, diagnostics);
```

## Cross-Feature Integration Points

1. **Auto-Analysis Trigger**: `onDidChangeActiveTextEditor` in `extension.js` calls:
   - `ComplexityAnalyzer.analyzeDocument(editor)`
   - `IdiomsAnalyzer.analyzeDocument(editor)`

2. **Configuration Reload**: `onDidChangeConfiguration` resets all managers:
   ```javascript
   this.highlightManager.reset();
   this.indentManager.reset();
   // ... etc for all 8 managers
   ```

3. **Completion Registration**: Providers are language-specific and auto-registered on startup
   - Java: Lombok, Spring Boot, Maven completions
   - Python: Standard library, async, Django, Flask, NumPy, Pandas
   - YAML: Kubernetes resources

4. **Symbol Summoning** (`SymbolSummoner`): Depends on:
   - `IdiomsAnalyzer` for pattern detection
   - `ConcordanceSystem` for workspace-wide symbol index

## Testing & Debugging Helpers

**Test Files Provided**:
- `test-complexity.py` - Demonstrates complexity metrics
- `test-complexity.js` - JavaScript complexity examples
- `test-patterns.js` - Code pattern samples
- `test-apl.apl` - APL language test

**Quick Smoke Test**: Open `test-complexity.py` and check Problems panel for colored complexity warnings.

## When Modifying Code

### Adding a New Language Highlighter
1. Create `src/LANGUAGE-highlighter.js` with class `LanguageHighlighter`
2. Add pattern definitions in `PRECOMPILED_REGEX` (or instance property)
3. Import and instantiate in `extension.js` constructor
4. Subscribe to `onDidChangeActiveTextEditor` via `update()` method
5. Register in theme colors if needed

### Adding a New Completion Provider
1. Create `src/LANGUAGE-completion.js` with class `LanguageCompletionProvider`
2. Implement `provideCompletionItems()` returning array of `vscode.CompletionItem`
3. Add registration in `extension.js` constructor with appropriate trigger characters
4. Test with `Ctrl+Space` on relevant file types

### Modifying Complexity Analysis
- Edit thresholds in `DEFAULT_CONFIG` in `config-loader.js`
- Complexity calculation logic in `ComplexityAnalyzer.calculateCyclomaticComplexity()`
- Add new metric types following the `branches` pattern

## References & File Locations

- **Main Entry**: `src/extension.js` (SmeagolController)
- **Colors & Config**: `src/constants.js`, `src/config.js`
- **Theme**: `themes/smeagol-dark-color-theme.json`
- **Extension Manifest**: `package.json` (activationEvents, contributes, commands)
- **Architecture Deep Dive**: `ARCHITECTURE.md`
- **Commands Reference**: `QUICK_REFERENCE.md`

## Critical Notes for AI Agents

1. **Never hardcode file paths**—use workspace root from VSCode context
2. **Always validate `editor` and `document` exist** before accessing properties
3. **Performance matters**: Use debouncing for any repeated analysis, cache expensive results
4. **Color handling**: Use `toRgba()` utility and respect opacity settings
5. **Async/await**: Completion providers are sync; use callbacks for async operations
6. **Watch for config changes**: Managers listen to `onDidChangeConfiguration` and reset state

## Quality Anti-Patterns to Avoid

### ❌ Unsafe Input Handling
```javascript
// BAD: No validation
function processColor(color) {
  return color.toUpperCase(); // Crashes if color is null
}

// GOOD: Validate first
function processColor(color) {
  if (!color || typeof color !== "string") return DEFAULT_COLOR;
  return color.toUpperCase();
}
```

### ❌ Synchronous File I/O on Active Thread
```javascript
// BAD: Blocks editor during file read
const config = JSON.parse(fs.readFileSync(path));

// GOOD: Use callbacks or move to debounced/async context
watchConfig(() => {
  setTimeout(() => {
    const config = JSON.parse(fs.readFileSync(path));
  }, 100);
});
```

### ❌ Unmanaged Event Listeners
```javascript
// BAD: Memory leak—listener never cleaned up
vscode.window.onDidChangeActiveTextEditor(() => {
  // Process editor
});

// GOOD: Return cleanup function
const dispose = vscode.window.onDidChangeActiveTextEditor(() => {
  // Process editor
});
context.subscriptions.push(dispose);
```

### ❌ Regex Recompilation in Loops
```javascript
// BAD: Regex compiled 1000 times
for (const line of lines) {
  if (/function\s+(\w+)/.exec(line)) { /* ... */ }
}

// GOOD: Compile once at module load
const FUNC_REGEX = /function\s+(\w+)/;
for (const line of lines) {
  if (FUNC_REGEX.exec(line)) { /* ... */ }
}
```

### ❌ Silent Failures
```javascript
// BAD: Error silently ignored
try {
  const config = JSON.parse(configText);
} catch (e) {
  // Silent failure—user doesn't know config failed
}

// GOOD: Log and fall back gracefully
try {
  const config = JSON.parse(configText);
} catch (e) {
  console.warn(`Config parse failed: ${e.message}`);
  return DEFAULT_CONFIG;
}
```

### ❌ Resource Leaks in Dispose
```javascript
// BAD: Partial cleanup
dispose() {
  this.watchers.forEach(w => w.close());
  // Forgot to clear the array—watchers still referenced
}

// GOOD: Complete cleanup
dispose() {
  this.watchers.forEach(w => {
    try { w.close(); } catch (e) { /* ignore */ }
  });
  this.watchers = []; // Clear references
}
```

### ❌ Missing Null Checks on VSCode APIs
```javascript
// BAD: Crashes if no editor active
const text = vscode.window.activeTextEditor.document.getText();

// GOOD: Validate before access
const editor = vscode.window.activeTextEditor;
if (!editor || !editor.document) {
  vscode.window.showErrorMessage("No file open");
  return;
}
const text = editor.document.getText();
```

## Code Quality Checklist

Before submitting code that touches:

| Area | Checklist |
|------|-----------|
| **Config/Settings** | ✓ Validates input, ✓ Has fallbacks, ✓ Watches for changes, ✓ Cleans up watchers |
| **Analysis** | ✓ Pre-compiled regex, ✓ Caches results, ✓ Debounces calls, ✓ Reports via diagnostics |
| **UI (Decorations)** | ✓ Disposes old decorations, ✓ Respects opacity, ✓ Uses `toRgba()`, ✓ Clamps color values |
| **Completions** | ✓ Sync provider, ✓ Returns VsCode.CompletionItem[], ✓ Cached, ✓ Debounced |
| **Events** | ✓ Subscriptions pushed to context, ✓ Dispose methods clean up, ✓ No memory leaks |
| **File I/O** | ✓ Error handling, ✓ Not on hot path, ✓ Respects file size limits |


