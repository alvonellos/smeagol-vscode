# Smeagol API Reference

Complete API documentation for developers extending Smeagol.

## Table of Contents
1. [ComplexityAnalyzer](#complexityanalyzer)
2. [ConfigLoader](#configloader)
3. [SymbolSummoner](#symbolsummoner)
4. [SonarQubeConnector](#sonarqubeconnector)
5. [Completion Providers](#completion-providers)
6. [Code Pattern Analyzers](#code-pattern-analyzers)

---

## ComplexityAnalyzer

Analyzes code complexity and branch paths.

### Constructor
```javascript
new ComplexityAnalyzer(workspaceRoot)
```

### Methods

#### analyzeDocument(editor)
Analyze active editor and report diagnostics.

```javascript
analyzer.analyzeDocument(editor);
// Results → Problems panel

// Output: Diagnostics with complexity scores
```

#### calculateCyclomaticComplexity(source, language)
Calculate complexity for a code string.

```javascript
const complexity = analyzer.calculateCyclomaticComplexity(source, 'python');
// Returns: { score: 8, branches: 6, type: 'high' }
```

#### getBranchPaths(source)
Get branch path count.

```javascript
const paths = analyzer.getBranchPaths(source);
// Returns: { paths: 12, level: 'critical' }
```

---

## ConfigLoader

Manage Smeagol configuration with hot reload.

### Constructor
```javascript
const loader = new ConfigLoader();
```

### Methods

#### loadConfig(workspaceRoot)
Load configuration from workspace.

```javascript
loader.loadConfig(workspaceRoot);
// Loads .smeagol/config.json or uses defaults
```

#### getComplexityThreshold(language, level)
Get threshold for a language.

```javascript
const warning = loader.getComplexityThreshold('python', 'warning');
// Returns: 8 (from config or default)

const error = loader.getComplexityThreshold('python', 'error');
// Returns: 12
```

#### getBranchThreshold(language)
Get branch path threshold.

```javascript
const threshold = loader.getBranchThreshold('python');
// Returns: { warnAbove: 6, maxPaths: 8 }
```

#### watchConfig(callback)
Watch for configuration changes.

```javascript
const stop = loader.watchConfig(() => {
  console.log('Configuration reloaded!');
  // Re-run analysis with new thresholds
});

// Later: stop watching
stop();
```

---

## SymbolSummoner

Generate code summaries and metadata.

### Constructor
```javascript
const summoner = new SymbolSummoner();
```

### Methods

#### generateSummary(document, range)
Generate summary for code range.

```javascript
const summary = summoner.generateSummary(document, range);
// Returns:
// {
//   title: "processData",
//   description: "Processes input data with validation",
//   parameters: ["data", "validate"],
//   complexity: 8,
//   suggestions: ["Refactor into smaller functions", "Extract validation logic"]
// }
```

#### findSymbols(document)
Find all symbols in document.

```javascript
const symbols = summoner.findSymbols(document);
// Returns: [ {name, type, range, complexity}, ... ]
```

#### generateDependencyGraph(workspaceRoot)
Create dependency graph.

```javascript
const graph = summoner.generateDependencyGraph(workspaceRoot);
// Returns: { "file.js": ["dep1.js", "dep2.js"], ... }
```

---

## SonarQubeConnector

Connect to SonarQube servers.

### Constructor
```javascript
const sonar = new SonarQubeConnector({
  host: 'https://sonarqube.company.com',
  token: 'squ_xxxxxxxxxxxx'
});
```

### Methods

#### getProjectMetrics(projectKey)
Get project quality metrics.

```javascript
const metrics = await sonar.getProjectMetrics('my-project');
// Returns:
// {
//   maintainability: 8.5,
//   reliability: 7.2,
//   security: 9.1,
//   coverage: 75,
//   duplications: 2.3
// }
```

#### getIssues(projectKey, filters)
Get code issues.

```javascript
const issues = await sonar.getIssues('my-project', {
  severity: 'CRITICAL',
  type: 'BUG'
});
// Returns: Array of issues with details
```

---

## Completion Providers

Register completions for a language.

### Interface
```javascript
class CustomCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.initialize();
  }
  
  initialize() {
    // Load completion items
  }
  
  provideCompletionItems(document, position, token) {
    // Return completion items for this position
    return this.completionItems;
  }
  
  filterByContext(document, position, line) {
    // Filter based on context
    return filtered_items;
  }
}
```

### Registering
```javascript
vscode.languages.registerCompletionItemProvider(
  { language: 'mylang', scheme: 'file' },
  new CustomCompletionProvider(),
  'a', 'b', 'c'  // trigger characters
);
```

### Example: Simple Provider
```javascript
const { CompletionCache } = require('./completion-cache');

class MyLanguageCompletion {
  constructor() {
    this.completionItems = [];
    this.cache = new CompletionCache(300, 5 * 60 * 1000);
    this.initialize();
  }
  
  initialize() {
    this.completionItems = [
      new vscode.CompletionItem('keyword1', vscode.CompletionItemKind.Keyword),
      new vscode.CompletionItem('function1', vscode.CompletionItemKind.Function)
    ];
  }
  
  provideCompletionItems(document, position, token) {
    const line = document.lineAt(position.line).text;
    const filtered = this.filterByContext(document, position, line);
    return filtered || this.completionItems;
  }
  
  filterByContext(document, position, line) {
    // Return items or null
    return null;
  }
}
```

---

## Code Pattern Analyzers

### IdiomsAnalyzer
Detect non-idiomatic patterns.

```javascript
const { IdiomsAnalyzer } = require('./src/idioms-analyzer');

const analyzer = new IdiomsAnalyzer();
analyzer.analyzeDocument(editor);

// Results → Problems panel with idiom warnings
```

### CodePatternsAnalyzer
Analyze code patterns.

```javascript
const { CodePatternsAnalyzer } = require('./src/code-patterns-analyzer');

const analyzer = new CodePatternsAnalyzer();
const patterns = analyzer.analyze(document);

// Returns: { antiPatterns: [], codeSmells: [] }
```

---

## Events & Lifecycle

### Extension Activation
```javascript
// When extension activates
function activate(context) {
  const controller = new SmeagolController(context);
  controller.start();
  context.subscriptions.push(controller);
}
```

### File Change Events
```javascript
vscode.window.onDidChangeActiveTextEditor(editor => {
  // Triggered when user opens a file
  analyzer.analyzeDocument(editor);
});

vscode.window.onDidChangeTextDocument(event => {
  // Triggered on any text change
  scheduleAnalysis(event.document);
});
```

### Configuration Changes
```javascript
vscode.workspace.onDidChangeConfiguration(event => {
  if (event.affectsConfiguration('smeagol')) {
    configLoader.loadConfig(workspaceRoot);
    // Re-analyze with new config
  }
});
```

---

## Performance Profiling

```javascript
const { PerformanceProfiler } = require('./src/performance-profiler');

const profiler = new PerformanceProfiler('analysis');
profiler.startTimer();

// ... do work ...

const elapsed = profiler.endTimer();
profiler.recordCacheHit();
profiler.snapshotMemory();

console.log(`Analysis took ${elapsed}ms`);
```

---

## Diagnostic Reporting

```javascript
// Create diagnostic
const diagnostic = new vscode.Diagnostic(
  range,
  'Complexity too high',
  vscode.DiagnosticSeverity.Error
);

diagnostic.source = 'Smeagol: Complexity Analysis';
diagnostic.code = 'complexity-high';

// Report
diagnosticsCollection.set(document.uri, [diagnostic]);
```

---

## Best Practices

1. **Always validate input**: Check editor, document existence
2. **Use caching**: Avoid redundant analysis
3. **Respect user config**: Load `.smeagol/config.json`
4. **Handle errors gracefully**: Fallback to defaults
5. **Clean up resources**: Dispose of watchers, subscriptions
6. **Profile performance**: Use PerformanceProfiler
7. **Document your code**: JSDoc for all public methods

---

**See [README.md](../README.md) for usage examples.**
