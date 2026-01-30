# 🧠 Smeagol VS Code Extension

> **"My precious!"** — Intelligent polyglot IDE with automatic code complexity analysis, 1,060+ smart completions, semantic syntax highlighting, and AI-powered refactoring suggestions.

> 📚 **Documentation Note**: All documentation is in `docs/` directory. Use `docs/` for all new documentation, references, and guides. See [docs/STRUCTURE.md](docs/STRUCTURE.md) for the complete project layout.

[![Version](https://img.shields.io/badge/version-0.2.3-blue.svg)](https://github.com/alvonellos/smeagol-vscode)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Languages](https://img.shields.io/badge/languages-20%2B-brightgreen.svg)](#supported-languages)
[![Completions](https://img.shields.io/badge/completions-1%2C060%2B-yellow.svg)](#smart-completions)

---

## ✨ What Is Smeagol?

Smeagol is a **next-generation VS Code extension** that brings intelligent code analysis and completion to your favorite polyglot environment. It automatically analyzes code complexity, detects code smells, provides context-aware completions, and offers AI-driven refactoring suggestions—all without leaving VS Code.

### Core Philosophy
- **Zero Configuration**: Works out of the box with sensible defaults
- **Polyglot First**: 20+ languages, one unified experience
- **Non-Invasive**: Automatic analysis, never in your way
- **Smart Defaults**: Industry-standard thresholds, tunable per-language
- **Performance First**: <100ms analysis, sub-10ms cached queries

---

## 🚀 Quick Start

### Installation

```bash
# From VS Code Extensions panel
# Open: Ctrl+Shift+X → Search "Smeagol" → Install
# Or command line:
code --install-extension smeagol-vscode.vsix
```

### First Run

1. **Open any code file** (Python, JavaScript, Java, Rust, etc.)
2. **Save the file** (Ctrl+S) — Smeagol automatically analyzes it
3. **Check Problems panel** (Ctrl+Shift+M) — See complexity warnings

### Live Example

```python
# Save this file and check Problems panel (Ctrl+Shift+M)
def simple():
    return 42  # ✅ Green - Complexity 1

def moderate(x):
    if x > 0:
        return x
    return 0  # ⚠️ Yellow - Complexity 2

def complex(a, b, c):
    if a:
        if b:
            if c:
                return 1
    return 0  # 🔴 Red - Complexity 4
```

---

## 📚 Documentation

All project documentation is organized in the `docs/` directory:

| Document | Purpose |
|----------|---------|
| [docs/STRUCTURE.md](docs/STRUCTURE.md) | **Project layout and file organization** |
| [docs/API.md](docs/API.md) | **Complete API reference for developers** |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | **How to contribute and extend Smeagol** |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | **Problem solving and FAQ** |
| [docs/SAMPLE_DATABASES.md](docs/SAMPLE_DATABASES.md) | **Code examples and data structures** |
| [docs/DOCUMENTATION_DIRECTIVE.md](docs/DOCUMENTATION_DIRECTIVE.md) | **Rules for creating and organizing documentation** |
| [docs/TEMPORARY_FILES_CONVENTION.md](docs/TEMPORARY_FILES_CONVENTION.md) | **How to label and manage temporary markdown files** |
| [docs/archive/](docs/archive/) | **Historical session notes and references** |

> 💡 **Contributing tips**:
> - All new documentation goes in `docs/` directory → See [DOCUMENTATION_DIRECTIVE.md](docs/DOCUMENTATION_DIRECTIVE.md)
> - Use `tmp.{purpose}.md` for work-in-progress files → See [TEMPORARY_FILES_CONVENTION.md](docs/TEMPORARY_FILES_CONVENTION.md)

---

## 🎯 Key Features

### 1. Automatic Complexity Analysis 📊
- **Cyclomatic complexity** calculation on every file save
- **Color-coded indicators**: 🟢 Simple → 🟡 Moderate → 🔴 Complex → 🔴⛔ Critical
- **Per-language thresholds**: JavaScript can have different rules than Python
- **Branch path tracking**: Identifies exponential complexity growth
- **Zero setup required**: Just install and save a file

**Output Example:**
```
Problems (4)
test-complexity.py
  10:1   ✅  simple_function                        Complexity: 1
  14:1   ⚠️   moderate_function                     Complexity: 4
  22:1   🔴   complex_function                      Complexity: 8
  39:1   🔴⛔ highly_complex_function               Complexity: 16
```

### 2. Smart Completions (1,060+ Items) 💡

**17 language-specific providers:**

| Language | Provider | Items | Features |
|----------|----------|-------|----------|
| 🐍 Python | Enhanced | 100+ | Stdlib, async, decorators, frameworks |
| 🔵 TypeScript | Full | 120+ | Types, generics, async/await, decorators |
| 💜 C# | Full | 90+ | LINQ, attributes, async, .NET stdlib |
| ☕ Java | Spring Boot | 100+ | Spring, Lombok, annotations, Maven |
| 🦀 Rust | Advanced | 50+ | Lifetimes, macros, traits, Cargo |
| 🐹 Go | Complete | 50+ | Concurrency, stdlib, patterns |
| 🎯 Kotlin | Advanced | 100+ | Coroutines, Android, extensions |
| 📜 JavaScript | Modern ES | 80+ | DOM APIs, async, ES6+ features |
| 🐚 Shell | Bash/PS | 70+ | Bash, PowerShell, utilities |
| 🎨 YAML | K8s/Docker | 40+ | Kubernetes, Docker Compose, GitHub |
| ⌨️ APL | Full | 50+ | Operators, vector operations |
| 🪟 AutoIt | Windows | 150+ | Windows automation, functions |
| 🏗️ Maven | Build | 120+ | Maven, Groovy, Jenkins |
| 🌩️ Spring | Cloud | 140+ | Spring, Spring Boot, Kubernetes |
| 📝 Markdown | Syntax | 25+ | Headers, lists, code blocks |
| **5+ more** | Highlighters | **100+** | Rust, Java, C++, APL, AutoIt |

### 3. Semantic Syntax Highlighting 🌈
- **Language-specific patterns**: Rust macros, Java annotations, C++ templates
- **6-color bracket pair guides**: Track nested structures instantly
- **Configurable indent guides**: Visualize code depth
- **Zero performance impact**: Pre-compiled patterns, cached

### 4. Code Pattern Detection 🔍
- **Idiom detection**: Find non-idiomatic patterns
- **Anti-pattern recognition**: Spots common pitfalls
- **Code smell detection**: Identifies technical debt
- **Actionable suggestions**: Refactoring recommendations

### 5. Advanced Features ⚙️
- **SonarQube Integration**: Enterprise code metrics
- **Symbol Summoning**: Auto-generate code summaries
- **Performance Profiling**: Built-in metrics
- **AI DSL Compiler**: Custom code generation templates
- **Project Concordance**: Full symbol indexing

---

## ⚙️ Configuration

### Zero-Config Start
Smeagol works **out of the box**. No configuration needed!

### Custom Configuration
Create `.smeagol/config.json` in your project root:

#### Simple Setup
```json
{
  "complexity": {
    "warning": 10,
    "error": 15
  },
  "branches": {
    "warnAbove": 8
  }
}
```

#### Per-Language Setup
```json
{
  "complexity": {
    "warning": 10,
    "error": 15
  },
  "languages": {
    "python": {
      "complexity": { "warning": 8, "error": 12 },
      "branches": { "warnAbove": 6 }
    },
    "javascript": {
      "complexity": { "warning": 12, "error": 18 },
      "branches": { "warnAbove": 10 }
    },
    "java": {
      "complexity": { "warning": 15, "error": 20 },
      "branches": { "warnAbove": 12 }
    }
  }
}
```

#### Advanced Setup (with file patterns)
```json
{
  "complexity": {
    "warning": 10,
    "error": 15
  },
  "branches": {
    "maxPaths": 8,
    "warnAbove": 8
  },
  "performance": {
    "maxFileSize": 10485760,
    "cacheEnabled": true,
    "cacheTtl": 300000
  },
  "filePatterns": {
    "include": ["**/*.{js,py,java,rs}"],
    "exclude": ["**/node_modules/**", "**/.git/**"]
  },
  "languages": {
    "python": {
      "complexity": { "warning": 8, "error": 12 },
      "branches": { "warnAbove": 6 }
    },
    "javascript": {
      "complexity": { "warning": 12, "error": 18 },
      "branches": { "warnAbove": 10 }
    },
    "java": {
      "complexity": { "warning": 15, "error": 20 },
      "branches": { "warnAbove": 12 }
    },
    "rust": {
      "complexity": { "warning": 12, "error": 18 },
      "branches": { "warnAbove": 10 }
    },
    "go": {
      "complexity": { "warning": 10, "error": 15 },
      "branches": { "warnAbove": 8 }
    },
    "csharp": {
      "complexity": { "warning": 12, "error": 18 },
      "branches": { "warnAbove": 10 }
    },
    "cpp": {
      "complexity": { "warning": 15, "error": 20 },
      "branches": { "warnAbove": 12 }
    }
  }
}
```

### Configuration Presets

**Startup Mode** (lenient):
```json
{ "complexity": { "warning": 20, "error": 30 }, "branches": { "warnAbove": 15 } }
```

**Enterprise Mode** (strict):
```json
{ "complexity": { "warning": 5, "error": 10 }, "branches": { "warnAbove": 4 } }
```

**Legacy Mode** (gradual improvement):
```json
{ "complexity": { "warning": 30, "error": 50 }, "branches": { "warnAbove": 20 } }
```

**🔥 Hot Reload**: Edit `.smeagol/config.json` and save—configuration reloads instantly!

---

## 📚 Sample Data & Examples

### Test Dataset
```
my-project/
├── src/
│   ├── simple.py           (1 simple function)
│   ├── moderate.js         (2-3 moderate functions)
│   ├── complex.java        (4-5 complex functions)
│   └── critical.rs         (2-3 critical functions)
├── tests/
│   ├── test_simple.py
│   ├── test_moderate.js
│   └── test_complex.java
└── .smeagol/config.json    (custom thresholds)
```

### Analysis Output Database

```
complexity_metrics.db (example structure):
{
  "file": "src/complex.java",
  "timestamp": "2026-01-06T10:30:00Z",
  "language": "java",
  "functions": [
    {
      "name": "processData",
      "complexity": 8,
      "lines": [25, 45],
      "severity": "high",
      "branches": 6
    },
    {
      "name": "validateInput",
      "complexity": 12,
      "lines": [48, 75],
      "severity": "critical",
      "branches": 10
    }
  ],
  "summary": {
    "avgComplexity": 10,
    "maxComplexity": 12,
    "totalFunctions": 2,
    "criticalCount": 1
  }
}
```

### Real-World Sample Analysis

**Python Project:**
```python
# src/data_processor.py

def validate_record(record):  # ✅ Complexity: 2
    """Simple validation"""
    return record and record.get('id')

def process_records(records, validate=True):  # ⚠️ Complexity: 5
    """Process with optional validation"""
    results = []
    for record in records:
        if validate:
            if not validate_record(record):
                continue
        results.append(record)
    return results

def complex_workflow(user, config, cache):  # 🔴 Complexity: 11
    """Complex business logic"""
    if user:
        if user.is_active():
            if config.get('cache'):
                if cache_exists(user.id):
                    return get_from_cache(user.id)
            
            if config.get('validate'):
                if not validate_user(user):
                    return None
                
                if config.get('enrich'):
                    user = enrich_user(user)
    
    return process_user(user)
```

**Output:**
```
Problems (3)

src/data_processor.py
  3:1    ✅  validate_record                         Complexity: 2
  9:1    ⚠️   process_records                        Complexity: 5
  19:1   🔴   complex_workflow                       Complexity: 11
```

---

## 🎨 Themes & Customization

### Built-in Theme
- **"Kromatic Dark (Smeagol)"** — Optimized for code analysis visibility

### Complexity Color Scheme
```
🟢 GREEN (1-3):     Maintainable, no action needed
🟡 YELLOW (4-7):    Moderate, watch for growth
🔴 RED (8-14):      Complex, refactor soon
🔴⛔ DARK RED (15+): Critical, refactor now
```

### Bracket Pair Colors (6-Color Rainbow)
```
🔴 Red:    Outermost level
🟠 Orange: Level 2
🟡 Yellow: Level 3
🟢 Green:  Level 4
🔵 Blue:   Level 5
🟣 Purple: Level 6+
```

---

## 📊 Supported Languages

| # | Language | Provider | Completions | Highlighting |
|---|----------|----------|-------------|---------------|
| 1 | Python | Enhanced | 100+ | ✅ |
| 2 | TypeScript | Full | 120+ | ✅ |
| 3 | C# | Full | 90+ | ✅ |
| 4 | Java | Spring Boot | 100+ | ✅ |
| 5 | Rust | Advanced | 50+ | ✅ |
| 6 | Go | Complete | 50+ | ✅ |
| 7 | Kotlin | Advanced | 100+ | ✅ |
| 8 | JavaScript | Modern | 80+ | ✅ |
| 9 | Shell | Bash/PS | 70+ | ✅ |
| 10 | YAML | K8s | 40+ | ✅ |
| 11 | APL | Full | 50+ | ✅ |
| 12 | AutoIt | Windows | 150+ | ✅ |
| 13 | Maven | Build | 120+ | ✅ |
| 14 | Spring | Cloud | 140+ | ✅ |
| 15 | Markdown | Syntax | 25+ | ✅ |
| 16+ | **C++, Groovy, Jenkins** | **Highlighters** | **100+** | ✅ |

---

## 🔧 Advanced Usage

### Configuration API
```javascript
const { ConfigLoader } = require("./src/config-loader");

const config = new ConfigLoader();
config.loadConfig(workspaceRoot);

// Get thresholds
const warning = config.getComplexityThreshold("python", "warning");
const error = config.getComplexityThreshold("python", "error");

// Watch for changes
config.watchConfig(() => console.log("Config reloaded!"));
```

### Complexity Analyzer API
```javascript
const { ComplexityAnalyzer } = require("./src/complexity-analyzer");

const analyzer = new ComplexityAnalyzer(workspaceRoot);
analyzer.analyzeDocument(editor);

// Results appear in Problems panel
```

### Symbol Summoner
```javascript
const { SymbolSummoner } = require("./src/symbol-summoner");

const summoner = new SymbolSummoner();
const summary = summoner.generateSummary(document, range);
// Returns: {title, description, parameters, complexity, suggestions}
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| **No analysis showing** | Save file with Ctrl+S — analysis triggers on save |
| **Config not loading** | Verify `.smeagol/config.json` in workspace root |
| **Completions not appearing** | Check language trigger characters, type slowly |
| **Extension not activating** | Reload window: Ctrl+Shift+P → "Developer: Reload Window" |
| **Performance slow** | Check file size (>10MB skipped), disable cache if needed |

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [docs/CONFIGURATION.md](docs/CONFIGURATION.md) | Full configuration reference |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design & internals |
| [docs/ADVANCED_FEATURES.md](docs/ADVANCED_FEATURES.md) | ML suggestions, patterns, tools |
| [docs/API.md](docs/API.md) | Developer API reference |
| [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) | Code quality standards |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Problem solving guide |

---

## 🤝 Contributing

Contributions welcome! See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)

---

## 📄 License

MIT License © 2026. See [LICENSE](LICENSE).

---

## 🙏 Acknowledgments

- Inspired by SonarQube, ESLint, Pylint
- Complexity metrics: McCabe's cyclomatic complexity
- Built for the polyglot developer ❤️

---

## 🚀 Roadmap

- **Phase 4**: ML-based refactoring suggestions
- **Phase 5**: Team collaboration features
- **Phase 6**: IDE integration (IntelliJ, Eclipse)

---

**Made with ❤️ by [Alexa Vellos](https://github.com/alvonellos)**

⭐ **Star us on [GitHub](https://github.com/alvonellos/smeagol-vscode)!**

---

*Version 0.2.3 | Last Updated: January 6, 2026 | Status: Production Ready ✅*
