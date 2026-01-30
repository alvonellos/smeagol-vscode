# Smeagol Consolidation Implementation Guide

**Version**: 1.0  
**Date**: January 30, 2026  
**Purpose**: Step-by-step instructions for executing consolidation recommendations

---

## Phase 1: High-Impact Merges

### Step 1.1: Merge Python Completion Providers

#### Files Involved
- `src/python-completion.js` (445 lines)
- `src/python-completion-enhanced.js` (267 lines)

#### Process

1. **Analyze differences**:
```bash
# Compare files to identify unique features
diff src/python-completion.js src/python-completion-enhanced.js
```

2. **Identify enhancements**:
Look for:
- Additional keywords in enhanced version
- Different documentation
- Framework-specific completions
- Performance optimizations

3. **Merge strategy**:
   - If enhanced has better coverage → rename enhanced as main
   - If enhanced is framework-specific → rename to `python-django.js` or similar
   - If fully redundant → keep main, delete enhanced

4. **Update `extension.js`**:
```javascript
// Before
const { PythonCompletionProvider } = require("./python-completion");
const { PythonCompletionProvider: PythonCompletionProviderEnhanced } = require("./python-completion-enhanced");

// After
const { PythonCompletionProvider } = require("./python-completion");
```

5. **Test**:
```bash
- Open Python file
- Verify completions appear with Ctrl+Space
- Check that all keywords from both files are present
```

---

### Step 1.2: Split Maven/Groovy/Jenkins Provider

#### File
- `src/maven-groovy-jenkins-completion.js` (375 lines)

#### Current State
```javascript
class MavenCompletionProvider { /* 50 lines */ }
class GroovyCompletionProvider { /* 50 lines */ }
class JenkinsCompletionProvider { /* 50 lines */ }
module.exports = { MavenCompletionProvider, GroovyCompletionProvider, JenkinsCompletionProvider };
```

#### Create Three New Files

**`src/maven-completion.js`**:
```javascript
"use strict";

const vscode = require("vscode");
const { BaseCompletionProvider } = require("./base-completion-provider");

class MavenCompletionProvider extends BaseCompletionProvider {
  getCompletions() {
    return [
      { label: "dependency", kind: vscode.CompletionItemKind.Snippet, 
        detail: "Maven dependency", 
        doc: "<dependency>\n  <groupId></groupId>\n  <artifactId></artifactId>\n  <version></version>\n</dependency>" },
      // ... rest of Maven completions
    ];
  }

  getLanguageId() {
    return "xml"; // Maven uses XML
  }
}

module.exports = { MavenCompletionProvider };
```

**`src/groovy-completion.js`**:
```javascript
"use strict";

const vscode = require("vscode");
const { BaseCompletionProvider } = require("./base-completion-provider");

class GroovyCompletionProvider extends BaseCompletionProvider {
  getCompletions() {
    return [
      { label: "def", kind: vscode.CompletionItemKind.Keyword, 
        detail: "Define method", 
        doc: "def methodName() { ... }" },
      // ... rest of Groovy completions
    ];
  }

  getLanguageId() {
    return "groovy";
  }
}

module.exports = { GroovyCompletionProvider };
```

**`src/jenkins-completion.js`**:
```javascript
"use strict";

const vscode = require("vscode");
const { BaseCompletionProvider } = require("./base-completion-provider");

class JenkinsCompletionProvider extends BaseCompletionProvider {
  getCompletions() {
    return [
      { label: "pipeline", kind: vscode.CompletionItemKind.Keyword, 
        detail: "Jenkins pipeline", 
        doc: "pipeline {\n  stages { ... }\n}" },
      // ... rest of Jenkins completions
    ];
  }

  getLanguageId() {
    return "groovy"; // Jenkins files are Groovy
  }
}

module.exports = { JenkinsCompletionProvider };
```

#### Update `extension.js`

**Before**:
```javascript
const { MavenCompletionProvider, GroovyCompletionProvider, JenkinsCompletionProvider } 
  = require("./maven-groovy-jenkins-completion");

this.mavenCompletionProvider = new MavenCompletionProvider();
this.groovyCompletionProvider = new GroovyCompletionProvider();
this.jenkinsCompletionProvider = new JenkinsCompletionProvider();
```

**After**:
```javascript
const { MavenCompletionProvider } = require("./maven-completion");
const { GroovyCompletionProvider } = require("./groovy-completion");
const { JenkinsCompletionProvider } = require("./jenkins-completion");

this.mavenCompletionProvider = new MavenCompletionProvider();
this.groovyCompletionProvider = new GroovyCompletionProvider();
this.jenkinsCompletionProvider = new JenkinsCompletionProvider();
```

#### Delete Old File
```bash
rm src/maven-groovy-jenkins-completion.js
```

---

## Phase 2: Base Class Adoption

### Step 2.1: Audit Current Completion Providers

#### Create Audit Script

**`scripts/audit-completion-providers.js`**:
```javascript
const fs = require("fs");
const path = require("path");

const providers = [
  "autoit-completion.js",
  "apl-completion.js",
  "go-completion.js",
  "csharp-completion.js",
  "kotlin-completion.js",
  "rust-completion.js",
  "typescript-completion.js",
  "yaml-completion.js",
  "markdown-completion.js",
  "lombok-completion.js",
  "bash-shell-makefile-completion.js",
  "maven-completion.js",
  "groovy-completion.js",
  "jenkins-completion.js"
];

console.log("Completion Provider Inheritance Audit\n");
console.log("File | Inherits BaseCompletionProvider | Duplicated Code");
console.log("-----|------|----------------------|-----");

for (const provider of providers) {
  const content = fs.readFileSync(path.join(__dirname, "../src", provider), "utf-8");
  const inheritsBase = content.includes("extends BaseCompletionProvider");
  const hasInitialize = content.includes("initialize()");
  const hasProvideCompletions = content.includes("provideCompletionItems()");
  
  const duplicated = (hasInitialize || hasProvideCompletions) && !inheritsBase;
  
  console.log(`${provider.padEnd(40)} | ${inheritsBase ? "✓ Yes" : "✗ No"} | ${duplicated ? "✓ Yes" : "✗ No"}`);
}
```

**Run**:
```bash
node scripts/audit-completion-providers.js
```

---

### Step 2.2: Migrate One Provider (Example: Go)

#### Before
**`src/go-completion.js`**:
```javascript
"use strict";

const vscode = require("vscode");
const { CompletionCache } = require("./completion-cache");
const { Debouncer } = require("./debouncer");

class GoCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.cache = new CompletionCache(500, 5 * 60 * 1000);
    this.debouncer = new Debouncer(() => this.completionItems, 300);
  }

  initialize() {
    const raw = this.getCompletions();
    this.completionItems = raw.map(item => {
      const completion = new vscode.CompletionItem(item.label, item.kind || vscode.CompletionItemKind.Text);
      completion.detail = item.detail || "";
      completion.documentation = new vscode.MarkdownString(item.doc || "");
      if (item.insertText) completion.insertText = item.insertText;
      return completion;
    });
  }

  provideCompletionItems(document, position, token) {
    if (this.completionItems.length === 0) {
      this.initialize();
    }
    return this.completionItems;
  }

  getCompletions() {
    return [
      { label: "package", kind: vscode.CompletionItemKind.Keyword, ... },
      // ... more items
    ];
  }
}

module.exports = { GoCompletionProvider };
```

#### After
**`src/go-completion.js`**:
```javascript
"use strict";

const vscode = require("vscode");
const { BaseCompletionProvider } = require("./base-completion-provider");

class GoCompletionProvider extends BaseCompletionProvider {
  getCompletions() {
    return [
      { label: "package", kind: vscode.CompletionItemKind.Keyword, ... },
      // ... more items
    ];
  }

  getLanguageId() {
    return "go";
  }
}

module.exports = { GoCompletionProvider };
```

**Comparison**:
- Before: 58 lines
- After: 20 lines
- **Reduction: 65%**

---

### Step 2.3: Migrate All Remaining Providers

Repeat Step 2.2 for:
1. ✅ `autoit-completion.js`
2. ✅ `apl-completion.js`
3. ✅ `csharp-completion.js`
4. ✅ `kotlin-completion.js`
5. ✅ `rust-completion.js`
6. ✅ `typescript-completion.js`
7. ✅ `yaml-completion.js`
8. ✅ `markdown-completion.js`
9. ✅ `lombok-completion.js`
10. ✅ `bash-shell-makefile-completion.js`

---

### Step 2.4: Migrate Language Highlighters

#### Before
**`src/rust-highlighter.js` (421 lines)**:
```javascript
class RustHighlighter {
  constructor() {
    this.decorationTypes = {};
    this.ranges = {};
  }

  createDecorations() {
    if (Object.keys(this.decorationTypes).length > 0) {
      this.dispose();
    }

    const patterns = this.getTokenPatterns();
    this.decorationTypes = {};
    this.ranges = {};

    for (const [tokenType, config] of Object.entries(patterns)) {
      this.ranges[tokenType] = [];
      const decorationConfig = {
        color: config.color,
        ...config.style
      };
      this.decorationTypes[tokenType] = vscode.window.createTextEditorDecorationType(decorationConfig);
    }
  }

  dispose() {
    Object.values(this.decorationTypes).forEach(dec => {
      try {
        dec.dispose();
      } catch (e) {
        // Ignore
      }
    });
    this.decorationTypes = {};
  }

  update(editors, config) {
    editors.forEach(editor => {
      const text = editor.document.getText();
      const patterns = this.getTokenPatterns();
      
      for (const [tokenType, config] of Object.entries(patterns)) {
        const ranges = [];
        for (const match of text.matchAll(config.regex)) {
          ranges.push({
            range: new vscode.Range(
              editor.document.positionAt(match.index),
              editor.document.positionAt(match.index + match[0].length)
            )
          });
        }
        editor.setDecorations(this.decorationTypes[tokenType], ranges);
      }
    });
  }

  getTokenPatterns() {
    return {
      keyword: { regex: /\b(let|mut|fn|pub)\b/g, color: "#569cd6" },
      macro: { regex: /\b(\w+)!/g, color: "#ce9178" },
      // ...
    };
  }
}
```

#### After
**`src/rust-highlighter.js` (45 lines)**:
```javascript
"use strict";

const { BaseHighlighter } = require("./base-highlighter");

class RustHighlighter extends BaseHighlighter {
  getLanguageId() {
    return "rust";
  }

  getTokenPatterns() {
    return {
      keyword: { regex: /\b(let|mut|fn|pub)\b/g, color: "#569cd6" },
      macro: { regex: /\b(\w+)!/g, color: "#ce9178" },
      lifetime: { regex: /'[a-zA-Z_]\w*/g, color: "#646695" },
      attribute: { regex: /#\[[\w:=(),\s]*\]/g, color: "#d4a574" },
      trait: { regex: /\b[A-Z]\w+(?=\s*[\{;:])/g, color: "#4ec9b0", style: { fontStyle: "italic" } },
      // ... more patterns
    };
  }
}

module.exports = { RustHighlighter };
```

**Comparison**:
- Before: 421 lines (with utilities)
- After: 45 lines (logic only)
- **Reduction: 89%**

---

## Phase 3: Analyzer Consolidation

### Step 3.1: Create Base Analyzer

**`src/base-analyzer.js`**:
```javascript
"use strict";

const vscode = require("vscode");
const { ConfigLoader } = require("./config-loader");
const { PerformanceProfiler } = require("./performance-profiler");

/**
 * Base Analyzer - Consolidates common analysis patterns
 * Handles diagnostic creation, ConfigLoader, pre-compiled regex management
 */
class BaseAnalyzer {
  constructor(diagnosticsCollectionName) {
    this.diagnosticsCollection = vscode.languages.createDiagnosticCollection(diagnosticsCollectionName);
    this.configLoader = new ConfigLoader();
    this.regexCache = new Map();
    this.profiler = new PerformanceProfiler(diagnosticsCollectionName);
    this.taskDatabase = null;
  }

  /**
   * Set database reference for logging
   */
  setDatabase(taskDatabase) {
    this.taskDatabase = taskDatabase;
  }

  /**
   * Create and report diagnostic
   * @protected
   */
  reportDiagnostic(document, range, message, severity = vscode.DiagnosticSeverity.Warning, code = "") {
    const diagnostic = new vscode.Diagnostic(range, message, severity);
    diagnostic.source = `[Smeagol] ${this.constructor.name}`;
    diagnostic.code = code;
    
    const existing = this.diagnosticsCollection.get(document.uri) || [];
    existing.push(diagnostic);
    this.diagnosticsCollection.set(document.uri, existing);
  }

  /**
   * Clear diagnostics for document
   * @protected
   */
  clearDiagnostics(document) {
    this.diagnosticsCollection.delete(document.uri);
  }

  /**
   * Get pre-compiled regex for language
   * @protected
   */
  getCompiledRegex(languageId, patternKey) {
    const cacheKey = `${languageId}:${patternKey}`;
    if (this.regexCache.has(cacheKey)) {
      return this.regexCache.get(cacheKey);
    }
    
    const patterns = this.getLanguagePatterns(languageId);
    const regex = patterns?.[patternKey];
    if (regex) this.regexCache.set(cacheKey, regex);
    return regex;
  }

  /**
   * Log analysis to database
   * @protected
   */
  async logAnalysis(filePath, languageId, metrics = {}, duration = 0) {
    if (!this.taskDatabase) return;
    
    try {
      await this.taskDatabase.logActivityEvent(
        "analysis_complete",
        filePath,
        languageId,
        { ...metrics, durationMs: duration }
      );
    } catch (err) {
      console.warn("[Smeagol] Failed to log analysis:", err.message);
    }
  }

  /**
   * Analyze document (implemented by subclass)
   */
  analyzeDocument(editor) {
    throw new Error("analyzeDocument() must be implemented by subclass");
  }

  /**
   * Get language-specific patterns (implemented by subclass)
   */
  getLanguagePatterns(languageId) {
    throw new Error("getLanguagePatterns() must be implemented by subclass");
  }

  /**
   * Dispose and cleanup
   */
  dispose() {
    this.diagnosticsCollection.dispose();
    this.regexCache.clear();
  }
}

module.exports = { BaseAnalyzer };
```

---

### Step 3.2: Refactor ComplexityAnalyzer

**Before** (304 lines, inline diagnostics):
```javascript
analyzeDocument(editor) {
  const diagnostics = [];
  // ... analysis code ...
  diagnostics.push({
    diagnostic: new vscode.Diagnostic(...),
    message: "...",
    severity: vscode.DiagnosticSeverity.Warning
  });
  this.diagnosticsCollection.set(document.uri, diagnostics);
}
```

**After** (250 lines, using base class):
```javascript
"use strict";

const vscode = require("vscode");
const { BaseAnalyzer } = require("./base-analyzer");
const { PerformanceProfiler } = require("./performance-profiler");

const PRECOMPILED_REGEX = {
  jsFunction: /^(\s*)(async\s+)?function\s+(\w+)\s*\(/gm,
  pythonFunction: /^(\s*)(async\s+)?def\s+(\w+)\s*\(/gm,
  // ...
};

class ComplexityAnalyzer extends BaseAnalyzer {
  constructor(workspaceRoot = null) {
    super("smeagol-complexity");
    if (workspaceRoot) {
      this.configLoader.loadConfig(workspaceRoot);
    }
  }

  analyzeDocument(editor) {
    const startTime = performance.now();
    this.clearDiagnostics(editor.document);
    
    const document = editor.document;
    const text = document.getText();
    const languageId = document.languageId;

    const complexityWarning = this.configLoader.getComplexityThreshold(languageId, "warning");
    const complexityError = this.configLoader.getComplexityThreshold(languageId, "error");

    const functions = this.extractFunctions(text, document);

    functions.forEach(func => {
      const complexity = this.calculateCyclomaticComplexity(func.code);
      const branches = this.analyzeBranches(func.code);

      if (complexity > complexityWarning) {
        const range = new vscode.Range(func.startLine, 0, func.endLine, 0);
        const severity = complexity > complexityError 
          ? vscode.DiagnosticSeverity.Error 
          : vscode.DiagnosticSeverity.Warning;
        
        this.reportDiagnostic(
          document,
          range,
          `High cyclomatic complexity: ${complexity} (threshold: ${complexityWarning})`,
          severity,
          "complexity-high"
        );
      }
    });

    // Log to database
    const duration = performance.now() - startTime;
    this.logAnalysis(document.uri.fsPath, languageId, { 
      functionCount: functions.length,
      diagnosticCount: (this.diagnosticsCollection.get(document.uri) || []).length
    }, duration);
  }

  getLanguagePatterns(languageId) {
    const patterns = {
      javascript: PRECOMPILED_REGEX.jsFunction,
      python: PRECOMPILED_REGEX.pythonFunction,
      // ...
    };
    return patterns[languageId] || {};
  }

  extractFunctions(text, document) { /* ... */ }
  calculateCyclomaticComplexity(code) { /* ... */ }
  analyzeBranches(code) { /* ... */ }
}

module.exports = { ComplexityAnalyzer };
```

**Reduction**: ~50 lines (17%)

---

## Phase 4: Database Integration

### Step 4.1: Extend TaskDatabase Schema

**Edit `src/task-database.js`**, update `_createSchema()`:

```javascript
async _createSchema() {
  return new Promise((resolve, reject) => {
    this.db.serialize(() => {
      // ... existing tables ...

      // NEW: Analysis sessions table
      this.db.run(
        `CREATE TABLE IF NOT EXISTS analysis_sessions (
          id TEXT PRIMARY KEY,
          start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
          end_time DATETIME,
          files_analyzed INTEGER DEFAULT 0,
          total_complexity REAL DEFAULT 0,
          warning_count INTEGER DEFAULT 0,
          error_count INTEGER DEFAULT 0
        )`,
        (err) => {
          if (err) console.warn("Analysis sessions table error:", err.message);
        }
      );

      // NEW: File analyses
      this.db.run(
        `CREATE TABLE IF NOT EXISTS file_analyses (
          id TEXT PRIMARY KEY,
          session_id TEXT,
          file_path TEXT NOT NULL,
          language_id TEXT,
          cyclomatic_complexity INTEGER,
          branch_paths INTEGER,
          issues_found INTEGER,
          analysis_time_ms INTEGER,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (session_id) REFERENCES analysis_sessions(id)
        )`,
        (err) => {
          if (err) console.warn("File analyses table error:", err.message);
        }
      );

      // NEW: Activity log
      this.db.run(
        `CREATE TABLE IF NOT EXISTS activity_log (
          id TEXT PRIMARY KEY,
          event_type TEXT NOT NULL,
          file_path TEXT,
          language_id TEXT,
          event_data TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) console.warn("Activity log table error:", err.message);
        }
      );

      // NEW: Performance metrics
      this.db.run(
        `CREATE TABLE IF NOT EXISTS performance_metrics (
          id TEXT PRIMARY KEY,
          metric_name TEXT NOT NULL,
          value REAL,
          unit TEXT,
          language_id TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) reject(new Error(`Failed to create performance_metrics table: ${err.message}`));
          else resolve();
        }
      );
    });
  });
}
```

### Step 4.2: Add Analysis Logging Methods

**Add to `src/task-database.js`**:

```javascript
/**
 * Create analysis session
 */
async createAnalysisSession() {
  const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return new Promise((resolve, reject) => {
    this.db.run(
      "INSERT INTO analysis_sessions (id) VALUES (?)",
      [sessionId],
      (err) => {
        if (err) reject(err);
        else resolve(sessionId);
      }
    );
  });
}

/**
 * Log file analysis result
 */
async logFileAnalysis(sessionId, filePath, languageId, complexity, branches, issuesCount, timeMs) {
  const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return new Promise((resolve, reject) => {
    this.db.run(
      `INSERT INTO file_analyses 
       (id, session_id, file_path, language_id, cyclomatic_complexity, branch_paths, issues_found, analysis_time_ms)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [fileId, sessionId, filePath, languageId, complexity, branches, issuesCount, timeMs],
      (err) => {
        if (err) reject(err);
        else resolve(fileId);
      }
    );
  });
}

/**
 * Log activity event
 */
async logActivityEvent(eventType, filePath, languageId, eventData = {}) {
  const eventId = `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return new Promise((resolve, reject) => {
    this.db.run(
      `INSERT INTO activity_log (id, event_type, file_path, language_id, event_data)
       VALUES (?, ?, ?, ?, ?)`,
      [eventId, eventType, filePath || null, languageId || null, JSON.stringify(eventData)],
      (err) => {
        if (err) reject(err);
        else resolve(eventId);
      }
    );
  });
}

/**
 * Get trending complexity over N days
 */
async getTrendingComplexity(days = 7) {
  return new Promise((resolve, reject) => {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    this.db.all(
      `SELECT DATE(timestamp) as date, 
              AVG(cyclomatic_complexity) as avg_complexity,
              COUNT(*) as files_analyzed,
              SUM(issues_found) as total_issues
       FROM file_analyses 
       WHERE timestamp > ?
       GROUP BY DATE(timestamp)
       ORDER BY date DESC`,
      [since],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}
```

---

### Step 4.3: Wire Analyzers to Database

**Edit `src/complexity-analyzer.js`**:

```javascript
// In analyzeDocument(), after creating diagnostics:

async analyzeDocument(editor) {
  const startTime = performance.now();
  const sessionId = await this.ensureSession();
  
  // ... existing analysis code ...

  if (this.taskDatabase) {
    try {
      const functionCount = functions.length;
      const avgComplexity = functions.reduce((sum, f) => 
        sum + this.calculateCyclomaticComplexity(f.code), 0) / (functionCount || 1);
      
      await this.taskDatabase.logFileAnalysis(
        sessionId,
        editor.document.uri.fsPath,
        editor.document.languageId,
        Math.round(avgComplexity),
        diagnostics.length,
        diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length,
        Math.round(performance.now() - startTime)
      );
    } catch (err) {
      console.warn("[Smeagol] Database logging failed:", err.message);
    }
  }
}

async ensureSession() {
  if (!this.currentSessionId) {
    this.currentSessionId = await this.taskDatabase.createAnalysisSession();
  }
  return this.currentSessionId;
}
```

---

## Phase 5: Task-Analysis Integration

### Step 5.1: Link Tasks to Code Locations

**Extend `task-management-system.js`**:

```javascript
/**
 * Create task linked to current editor location
 */
async createTaskAtCurrentLocation() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No file open");
    return;
  }

  const description = await vscode.window.showInputBox({
    prompt: "Task description",
    placeHolder: "e.g., Refactor this function"
  });

  if (!description) return;

  const priority = await vscode.window.showQuickPick(
    ["low", "normal", "high"],
    { placeHolder: "Priority" }
  ) || "normal";

  const taskId = uuidv4();
  await this.taskDb.createTask(taskId, description, "pending", priority);

  // NEW: Link to location
  await this.taskDb.linkTaskToLocation(taskId, {
    filePath: editor.document.uri.fsPath,
    lineNumber: editor.selection.active.line,
    context: editor.document.getText(new vscode.Range(
      new vscode.Position(Math.max(0, editor.selection.active.line - 2), 0),
      new vscode.Position(Math.min(editor.document.lineCount, editor.selection.active.line + 3), 0)
    ))
  });

  vscode.window.showInformationMessage(`✓ Task created and linked to ${path.basename(editor.document.uri.fsPath)}`);
}

/**
 * Jump to task location in editor
 */
async jumpToTaskLocation(taskId) {
  const task = await this.taskDb.readTask(taskId);
  if (!task || !task.linked_file_path) {
    vscode.window.showWarningMessage("Task has no linked location");
    return;
  }

  const doc = await vscode.workspace.openTextDocument(task.linked_file_path);
  const editor = await vscode.window.showTextDocument(doc);

  if (task.linked_line_number !== undefined) {
    const lineNum = task.linked_line_number;
    editor.selection = new vscode.Selection(
      new vscode.Position(lineNum, 0),
      new vscode.Position(lineNum, 0)
    );
    editor.revealRange(new vscode.Range(
      new vscode.Position(Math.max(0, lineNum - 5), 0),
      new vscode.Position(Math.min(editor.document.lineCount, lineNum + 10), 0)
    ));
  }
}
```

---

## Testing Checklist

### Phase 1 Testing
- [ ] Python completions work after merge
- [ ] Maven/Groovy/Jenkins all registered separately
- [ ] No import errors in extension.js

### Phase 2 Testing
- [ ] Each migrated completion provider shows completions
- [ ] Each migrated highlighter shows syntax highlighting
- [ ] No errors in Problems panel

### Phase 3 Testing
- [ ] BaseAnalyzer properly creates diagnostics
- [ ] Regex caching improves performance
- [ ] Analysis still reports all issues

### Phase 4 Testing
- [ ] Database initializes without errors
- [ ] Analysis sessions created on startup
- [ ] File analyses logged to database
- [ ] Trending queries return data

### Phase 5 Testing
- [ ] Create task at current location
- [ ] Jump to task location works
- [ ] Task linked file and line visible in task details

---

## Validation Commands

```bash
# Check for syntax errors
find src -name "*.js" -exec node -c {} \;

# Check imports
grep -r "require(" src/ | wc -l

# Check file sizes before/after
ls -lS src/ | head -20

# Test database initialization
node -e "const { TaskDatabase } = require('./src/task-database'); const db = new TaskDatabase('./test'); db.initialize().then(() => console.log('✓ DB OK')).catch(e => console.error('✗', e.message));"

# Run extension in debug mode
code --extensionDevelopmentPath=. --enable-proposed-api
```

---

## Rollback Procedures

If issues occur during consolidation:

### For Phase 1 (File Merges)
```bash
# Restore from git
git checkout HEAD -- src/python-completion-enhanced.js
git checkout HEAD -- src/maven-groovy-jenkins-completion.js
```

### For Phase 2 (Base Class Adoption)
```bash
# Revert individual files
git checkout HEAD -- src/go-completion.js
```

### For Phase 4 (Database)
```bash
# Delete database file
rm ~/.vscode/storage/smeagol-tasks.db

# Restart extension
```

---

**Document Version**: 1.0  
**Last Updated**: January 30, 2026
