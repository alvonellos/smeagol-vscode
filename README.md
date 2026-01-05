# 🧙‍♂️ Smeagol VS Code Extension v0.2.3

**Polyglot IDE with Automatic Code Complexity Analysis & Configurable Thresholds**

Smeagol provides intelligent code analysis, 470+ smart completions for 14 languages, and automatic complexity detection—all without needing commands. Now with custom threshold configuration!

## ⭐ Star Feature: Automatic Complexity Analysis with Custom Thresholds

No commands needed. When you open ANY code file:

```
FILE OPENS
    ↓
Smeagol analyzes functions automatically
    ↓
Calculates cyclomatic complexity (uses your config thresholds!)
    ↓
Tracks exponential branch paths
    ↓
Shows in Problems panel (Ctrl+Shift+M)
    ↓
🟢 GREEN (1-5) → Good
🟡 YELLOW (6-10) → Monitor  
🔴 RED (11-20) → Refactor soon
🔴🔴 DARK RED (20+) → Refactor NOW
```

**NEW**: Customize thresholds in `.smeagol/config.json` - per-language support!

## 🎯 What's Included

### Core Features
- **Automatic Complexity Analysis** - Runs on every file, no commands
- **Custom Thresholds** - Configure warning/error levels per-language
- **Cyclomatic Complexity** - Measure function complexity
- **Branch Path Tracking** - Exponential growth visualization
- **14-Language Support** - Python, Java, Rust, Go, JavaScript, Shell, and more
- **470+ Completions** - Smart suggestions for all supported languages
- **Semantic Highlighting** - Language-aware code visualization
- **APL Language Support** - 50+ operators (unique!)
- **Idioms Analyzer** - Detect non-idiomatic code patterns

### Completion Providers
- **Python**: stdlib, decorators, async, Django, Flask, NumPy, Pandas, Requests
- **Java/Spring Boot**: annotations, configuration, starters
- **Kubernetes YAML**: resources, fields, manifests
- **Shell/PowerShell**: cmdlets, keywords, variables
- **And 10 more languages...**

### AI Helper Commands
- Generate boilerplate code
- Refactor suggestions
- Documentation generation
- Test generation
- Code explanation
- Code optimization

## 🚀 Quick Start (5 minutes)

### 1. Open a Test File
```bash
File → Open File → test-complexity.py
```

### 2. Watch Automatic Analysis
Open the Problems panel: `Ctrl+Shift+M`

You'll see complexity warnings like:
```
🔴 veryComplex: High cyclomatic complexity: 15
🔴 complex_function: Cyclomatic complexity: 8
🟡 moderate_function: Cyclomatic complexity: 4
```

### 3. Try Completions
Type Python code and press `Ctrl+Space`:
```python
print(
```
See 50+ Python completions appear!

### 4. Try APL (Optional)
Open `test-apl.apl` and type `⍴` → see 50+ operator completions

Done! 🎉 You've tested all major features!

## 📊 What Makes Smeagol Special

| Feature | Unique? | Notes |
|---------|---------|-------|
| **Automatic Complexity** | ⭐⭐⭐ | Runs automatically, no commands! |
| **Branch Path Tracking** | ⭐⭐⭐ | Competitors don't have this |
| **APL Support** | ⭐⭐⭐ | 50+ operators, very rare |
| **14-Language Support** | ⭐⭐ | All at once, polyglot |
| **470+ Completions** | ⭐⭐ | Comprehensive framework support |
| **Idioms Analyzer** | ⭐⭐ | Detects non-idiomatic patterns |
| **AI Helpers** | ⭐ | 6 useful commands |

## 📖 Documentation

Start with one of these:

- **[QUICK_START.md](QUICK_START.md)** - 5-minute walkthrough
- **[CONFIGURATION.md](CONFIGURATION.md)** - Custom complexity thresholds (NEW!)
- **[RUN_GUIDE.md](RUN_GUIDE.md)** - Step-by-step testing
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - All 28 commands cheat sheet
- **[ADVANCED_FEATURES.md](ADVANCED_FEATURES.md)** - Complexity analysis, deep dive
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - How it works internally
- **[IDIOMS_FEATURES.md](IDIOMS_FEATURES.md)** - Code idioms analyzer
- **[RELEASE_NOTES_V0.2.2.md](RELEASE_NOTES_V0.2.2.md)** - Previous version features

## ⚡ 28 Registered Commands

### Complexity Analysis
- Analyze Complexity
- Show Complexity Report
- Reset Complexity Cache

### Symbol Tools
- Summon Symbol Wordcloud
- Generate Symbol Summary
- Jump to Symbol Definition

### AI Helpers
- Generate Boilerplate Code
- Refactor Code
- Generate Documentation
- Generate Tests
- Explain Code
- Optimize Code

### Project Tools
- Initialize Smeagol Project
- Show Concordance
- Update Complexity Thresholds
- Configure Smeagol

### Code Tools
- Format Document
- Show Bracket Pairs
- Highlight Occurrences
- Show Function Metrics

### And 13 more...

## 📈 Build Metrics

| Metric | Value |
|--------|-------|
| Version | 0.2.2 |
| VSIX Size | 202.71 KB |
| Files | 77 in package |
| Languages | 14 active |
| Commands | 28 registered |
| Completions | 470+ items |
| Modules | 32 JavaScript files |
| Build Time | ~2 seconds |
| Performance | <100ms on typical files |

## 🔧 Installation

### From VS Code Marketplace
Extensions → Search "Smeagol" → Install

### From VSIX File
1. Download `smeagol-vscode.vsix`
2. Extensions → Install from VSIX
3. Restart VS Code

### From Source
```bash
git clone https://github.com/alvonellos/smeagol-vscode.git
cd smeagol-vscode
npm install
npm run package:vsix
code --install-extension smeagol-vscode.vsix
```

## 🎨 Supported Languages

### Core Support
- Python (completions, complexity, idioms)
- Java (completions, complexity, idioms)
- Rust (completions, complexity, idioms)
- JavaScript/TypeScript (completions, complexity)
- Shell/Bash (completions)
- PowerShell (completions)
- Go (complexity)
- C/C++ (complexity)

### Framework Support
- **Django** - Python web framework
- **Flask** - Python microframework
- **Spring Boot** - Java enterprise
- **NumPy/Pandas** - Python data science
- **Tokio/Serde** - Rust async/serialization
- **Kubernetes YAML** - Container orchestration
- **Maven/Jenkins** - Java build tools
- **And more...**

## 🚀 Advanced Features

### Custom Complexity Thresholds
Create `.smeagol/config.json` in project root:

```json
{
  "complexity": {
    "cyclomatic": {
      "green": 1,
      "yellow": 6,
      "red": 11,
      "darkred": 20
    }
  }
}
```

### Idioms Analyzer
Automatically detects non-idiomatic code:
- 160+ rules for 14 languages
- Framework-specific patterns
- Auto-suggestions showing alternatives
- Real exemplars from popular projects

### Symbol Wordcloud
Visual frequency-based word clouds:
- Shows most-used symbols
- Beautiful animated visualization
- Click to jump to definition
- Project-wide or file-level

## 📚 Examples

### Python Complexity
```python
def veryComplex():  # Cyclomatic complexity: 15
    if a:
        if b:
            if c:
                # ... many nested conditions
                pass
```
Shows 🔴 RED in Problems panel

### Java Spring Boot Completions
Start typing:
```java
@Spring
```
See: `@SpringBootApplication`, `@Service`, `@RestController`, etc.

### Kubernetes YAML Completions
Start a manifest:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: app
      image: myimage:latest
      ports:
        - containerPort: 8080
```
All fields auto-complete!

## 💡 Pro Tips

1. **Open test-complexity.py** to see complexity analysis in action
2. **Use QUICK_REFERENCE.md** to discover all 28 commands
3. **Press Ctrl+Space** in any file for language completions
4. **Use Problems panel (Ctrl+Shift+M)** to see all issues
5. **Try "Summon Symbol Wordcloud"** command for visualization
6. **Read IDIOMS_FEATURES.md** for non-idiomatic pattern detection

## 🐛 Known Limitations

- Complexity analysis best effort (not 100% accurate for all languages)
- Completions are templates, not context-aware AI
- Idioms detection uses pattern matching, not ML
- Large files (>10MB) may have reduced performance

## 🛠️ Development

### Project Structure
```
src/
├── extension.js ........................ Main controller
├── complexity-analyzer.js ............. ⭐ Auto analysis
├── python-completion.js ............... Python completions
├── spring-kubernetes-completion.js .... Spring + Kubernetes
├── shell-powershell-completion.js .... Shell completions
├── ai-helpers.js ...................... AI commands
├── idioms-analyzer.js ................. Pattern detection
├── idiom-extractor.js ................. Idiom engine
├── symbol-summoner.js ................. Wordcloud
└── [23 other modules] ................. Language support
```

### Building
```bash
npm install
npm run package:vsix
```

### Testing
Press F5 to launch Extension Development Host

## 📄 License

MIT

## 👤 Author

Alexa Nellos  
[@alvonellos](https://github.com/alvonellos)

---

## 🎉 Version History

| Version | Date | Highlight |
|---------|------|-----------|
| **0.2.2** | Jan 2026 | 470+ completions, AI helpers |
| **0.2.1** | Jan 2026 | Idioms analyzer, 9 exemplars |
| **0.2.0** | Dec 2025 | Complexity analysis, 14 languages |

---

**My precious... all your code analyzed in one place!** 🧙‍♂️

📖 **[Read QUICK_START.md now!](QUICK_START.md)**
