# 🧙‍♂️ Smeagol v0.2.0 - Quick Reference

## Installation

```bash
# VS Code CLI
code --install-extension smeagol-vscode.vsix

# Or: Extensions (Ctrl+Shift+X) → ... → Install from VSIX
```

## First Steps

1. **Initialize Project** (Cmd Palette: Ctrl+Shift+P)
   ```
   Type: "Initialize Smeagol Project"
   Creates: .smeagol/ folder with configs
   ```

2. **Start Coding**
   - Open any file: `.apl`, `.py`, `.java`, `.rs`, `.js`, etc.
   - Type and get intelligent completions
   - Semantic highlighting automatically activates

3. **Analyze Your Code**
   ```
   Cmd+Shift+P → "Analyze Code Complexity"
   Shows: Cyclomatic complexity + branch paths
   ```

4. **Summon Symbols**
   ```
   Cmd+Shift+P → "Summon Symbol Wordcloud"
   Visualizes: All APL/Python/Java/Rust symbols
   ```

---

## Command Palette Cheat Sheet

### 🔧 Project Setup
| Command | Purpose |
|---------|---------|
| `Initialize Smeagol Project` | Create .smeagol folder |

### 🎨 Analysis & Visualization
| Command | Purpose |
|---------|---------|
| `Analyze Code Complexity & Branch Paths` | Complexity report |
| `Summon Symbol Wordcloud` | Language symbol visualization |
| `Analyze Project Metrics` | LOC, functions, classes |
| `Detect Languages in Workspace` | Scan languages |
| `Project Health Report` | Overall quality |

### 📊 Project Tools
| Command | Purpose |
|---------|---------|
| `Create Project Concordance` | Build symbol index |
| `Search Symbols Across Project` | Find symbols |
| `Generate Workspace Documentation` | Auto-docs |

### 🔍 Code Quality
| Command | Purpose |
|---------|---------|
| `Test SonarQube Connection` | Verify SonarQube |
| `Configure SonarQube Settings` | Add credentials |
| `Show SonarQube Metrics` | Quality dashboard |

### 🤖 AI Features
| Command | Purpose |
|---------|---------|
| `Generate Boilerplate Code` | AI code gen |
| `Generate Documentation` | AI docs |
| `Generate Test Template` | AI test gen |
| `Explain Selected Code` | AI explanation |
| `Refactor Code (Suggestions)` | AI refactoring |
| `Optimize Code (Suggestions)` | AI optimization |
| `Compile AI DSL` | Compile DSL |
| `Generate Human Prompts from DSL` | DSL → human |
| `Generate Machine Prompts from DSL` | DSL → machine |

---

## Language Support

### ✅ Full Support (Completions + Highlighting)
- **APL** (50+ operators)
- **Java** (75+ items + annotations)
- **Rust** (40+ items)

### ✅ Rich Completions (40-50+ items)
- **Python** (50+ items)
- **JavaScript** (custom)
- **Shell/Bash** (40+ items)
- **PowerShell** (40+ items)
- **Spring Boot** (50+ items)
- **Kubernetes** (40+ items)
- **Groovy** (30+ items)
- **Maven** (30+ items)
- **Jenkins** (30+ items)
- **Lombok** (25+ items)
- **AutoIt** (90+ items)

### ⚠️ Basic Support (Syntax Highlighting)
- **C++**, **Go**, **Ruby**, **PHP**, and many more

---

## APL Quick Reference

### Operators
```apl
⍴   Shape             ⌽   Reverse        ⍒   Grade Down
⍋   Grade Up         ⊖   Rotate         ,    Ravel
↑   Take             ↓   Drop           ⊂   Enclose
⊃   Disclose         ∪   Union          ∩   Intersection
⍳   Index Of         ⍕   Format         ⍎   Execute
/   Reduce           \   Scan           .   Inner Product
∘.  Outer Product    @   At             ⍨   Commute
¨   Each
```

### Monadic Functions
```apl
¬   NOT              -   Negate          +   Identity
×   Sign             ÷   Reciprocal      ⌈   Ceiling
⌊   Floor            |   Magnitude       ⋆   Exponential
⍟   Natural Log      ○   Circular        !   Factorial
?   Random           ⎕CR  Character Repr  ⎕NC  Name Class
```

---

## Complexity Analysis Legend

### Complexity Levels
```
Complexity   Status    Action
─────────────────────────────
1-5          ✅ Good    Keep as is
6-10         ⚠️  Fair   Review soon
11-20        🔴 High    Refactor
20+          🔴🔴 Critical  Refactor immediately
```

### Branch Paths Example
```javascript
if (a) {           // Branch 1: Start with 1 path
  if (b) {         // Branch 2: 1 * 2 = 2 paths
    if (c) {       // Branch 3: 2 * 2 = 4 paths
      // Total: 4 possible execution paths
    }
  }
}
```

### Refactoring Tips
- Extract validation to separate functions
- Use early returns instead of nested if
- Replace if/else chains with switch
- Move complex conditions to named functions

---

## AI DSL Quick Syntax

### Generate Code
```
ai-instruction {
  action: "generate function"
  context: "Python, pandas, DataFrame manipulation"
  language: "python"
  constraints: ["use vectorization", "add docstring", "handle NaN"]
  output: "code"
}
```

### Document Code
```
ai-instruction {
  action: "generate documentation"
  context: "JavaScript async/await patterns"
  language: "javascript"
  output: "markdown"
}
```

### Create Tests
```
ai-instruction {
  action: "generate tests"
  context: "unit tests for calculator module"
  language: "python"
  constraints: ["pytest", "100% coverage"]
  output: "code"
}
```

---

## .smeagol Folder Structure

```
.smeagol/
├── config.json           # Project metadata
├── languages.json        # Language registry
├── concordance.json      # Symbol index
├── sonarqube.json        # Code quality config
└── ai-dsl-rules.json     # Custom AI rules
```

### Example: config.json
```json
{
  "version": "1.0.0",
  "projectName": "my-project",
  "languages": ["python", "javascript", "sql"],
  "tools": {
    "concordance": true,
    "sonarqube": false,
    "aiDsl": true
  }
}
```

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Command Palette | `Ctrl+Shift+P` |
| Toggle Terminal | `Ctrl+`` |
| Focus Explorer | `Ctrl+B` |
| Quick Open File | `Ctrl+P` |
| Find in File | `Ctrl+F` |
| Find in Files | `Ctrl+Shift+F` |
| Go to Line | `Ctrl+G` |

---

## Performance Tips

1. **Large Files (5000+ LOC)**
   - Complexity analysis works but slower
   - Symbol searching limited to first 100 files

2. **Many Languages**
   - Smeagol supports 14+ simultaneously
   - Performance remains fast (< 100ms)

3. **First Run**
   - Initial scanning takes 2-3 seconds
   - Cached after first run

4. **Memory Usage**
   - Typical: 30-50 MB
   - Large projects: 50-100 MB

---

## Troubleshooting

### Q: Completions not showing
**A**: Check language ID in bottom-right. May need `.apl` extension.

### Q: Highlighting looks wrong
**A**: Ensure Kromatic Dark theme is active. Go to File → Preferences → Color Theme → Kromatic Dark

### Q: Complexity analysis shows error
**A**: Some languages need proper syntax. Check file has complete functions.

### Q: Symbol wordcloud not rendering
**A**: Check workspace has files of supported languages (.apl, .py, .java, .rs)

### Q: SonarQube not connecting
**A**: Use command "Test SonarQube Connection" to verify host and token.

---

## Documentation Files

| File | Content |
|------|---------|
| `README.md` | Overview & features |
| `QUICK_START.md` | Installation & basic usage |
| `ARCHITECTURE.md` | System design |
| `COMPREHENSIVE_FEATURES.md` | All features detailed |
| `COMPLETION_REFERENCE.md` | Language completions |
| `ADVANCED_FEATURES.md` | Complexity, symbolism |
| `COMPETITIVE_ANALYSIS.md` | vs other extensions |
| `RELEASE_NOTES_V0.2.0.md` | This version |

---

## Resources

- **GitHub**: https://github.com/alvonellos/smeagol-vscode
- **Issues**: Report bugs on GitHub
- **Feature Requests**: GitHub Discussions
- **License**: MIT (free to use & modify)

---

## Version Info

```
Smeagol v0.2.0
VSIX: 128.42 KB
Files: 53 total
Commands: 28
Languages: 14+
Completions: 470+
```

---

## What's Next?

### v0.3.0 Roadmap
- Go, Ruby, PHP support
- Enhanced linting
- Security scanning
- Type inference
- GitHub integration

### Community Contributions Welcome! 
- Star on GitHub
- Submit PRs
- Report issues
- Suggest features

---

## Need Help?

1. **Check Docs**: ADVANCED_FEATURES.md
2. **See Examples**: QUICK_START.md
3. **Command Help**: Hover over command in palette
4. **GitHub Issues**: Report bugs

---

**"My precious... all the code tools you need, gathered in one place!" 🧙‍♂️**
