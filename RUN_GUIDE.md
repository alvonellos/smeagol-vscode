# 🧙‍♂️ Smeagol v0.2.0 - Test & Run Guide

**Your extension is installed and ready to use!**

## ⚡ Quick Start (2 minutes)

### Open VS Code Fresh
```bash
code c:\Users\alexa\Documents\GitHub\smeagol-vscode
```

### Open Test Files (Already Created!)
All in the root folder:
1. **test-complexity.py** - Python complexity examples
2. **test-complexity.js** - JavaScript complexity examples  
3. **test-apl.apl** - APL operator examples
4. **TEST_EXAMPLES.md** - Complete testing guide

### Watch Automatic Complexity Analysis

**When you open/edit any file:**
1. Smeagol automatically analyzes code
2. Creates complexity diagnostics
3. Shows in "Problems" panel (`Ctrl+Shift+M`)
4. Color-coded: 🟢 green → 🔴 red

---

## 🎯 Test Case 1: Open Python File

1. **File** → **Open File** → Select `test-complexity.py`
2. **Problems panel appears** (`Ctrl+Shift+M`)
3. **You should see:**
   ```
   🔴 high_complexity_function: High cyclomatic complexity: 8
   🔴 veryComplex: High cyclomatic complexity: 15+  
   🟡 complex_function: Complexity 7, Branch paths: 8
   ```
4. **Hover** over warnings to see details
5. **Click** on warnings to jump to function

**Result**: ✓ Automatic complexity analysis working!

---

## 🎯 Test Case 2: Open JavaScript File

1. **File** → **Open File** → Select `test-complexity.js`
2. Same automatic analysis
3. Multiple class methods with different complexities
4. Ternary operators and async/await tracked

**Result**: ✓ Multi-language support working!

---

## 🎯 Test Case 3: Try APL Completions

1. **File** → **Open File** → Select `test-apl.apl`
2. Move cursor to blank line
3. Type: `⍴` (hold Alt+Shift+P, type 3 for ⍴)
   - Or copy-paste from file
4. **See completions** with full descriptions
5. Type `⌽` (reverse), `⍒` (sort down), etc.

**Result**: ✓ APL completions with 50+ operators!

---

## 🎯 Test Case 4: Test Other Languages

### Python Completions
Open **test-complexity.py**, type:
- `def` → See function templates
- `import n` → numpy, nested, etc.
- `@` → @property, @decorator

### Java Completions  
Create `test.java`, type:
- `@Data` → Lombok annotations
- `@Service` → Spring Boot
- `public` → Access modifiers

### Rust Completions
Create `test.rs`, type:
- `Vec::` → Standard library
- `#[derive` → Macros
- `trait` → Trait definitions

### Shell Completions
Create `test.sh`, type:
- `echo` → Command completions
- `for` → Loop syntax
- `if` → Conditional syntax

---

## 🌟 Test Case 5: Symbol Wordcloud

1. **Command Palette**: `Ctrl+Shift+P`
2. Type: **"Summon Symbol Wordcloud"**
3. **Beautiful visualization appears!**
   - Animated fade-in (600ms)
   - Symbols from APL/Python/Java/Rust
   - Color-coded by language
   - Hover effects (glow, scale, rotate)

**Result**: ✓ Interactive symbol visualization!

---

## 🌟 Test Case 6: Initialize Smeagol Project

1. **Command Palette**: `Ctrl+Shift+P`
2. Type: **"Initialize Smeagol Project"**
3. **Message**: "✓ Smeagol project initialized"
4. **Check folder**: `.smeagol/` created with:
   - `config.json` - Project settings
   - `languages.json` - Language registry
   - `concordance.json` - Symbol index
   - `sonarqube.json` - SonarQube config
   - `ai-dsl-rules.json` - AI rules

**Result**: ✓ Project metadata system working!

---

## 🔍 Test Case 7: Project Tools

### Detect Languages
1. **Command Palette**: `Ctrl+Shift+P`
2. Type: **"Detect Languages"**
3. **Output**: All detected languages in workspace
   - Shows file extensions
   - Maps to language names

### Analyze Metrics
1. **Command Palette**: `Ctrl+Shift+P`
2. Type: **"Analyze Project Metrics"**
3. **Output**: 
   - Total lines of code
   - Functions and classes
   - Documentation ratio
   - Quality assessment

### Project Health
1. **Command Palette**: `Ctrl+Shift+P`
2. Type: **"Project Health Report"**
3. **Output**: 
   - README presence
   - Tests detected
   - Documentation quality
   - Overall health score

---

## 📋 Verification Checklist

### Core Features
- [ ] Extension installed (v0.2.0)
- [ ] 28 commands available
- [ ] 14 languages detected
- [ ] 470+ completions available

### Automatic Complexity ⭐ (THE STAR)
- [ ] Complexity analysis runs on file open
- [ ] Complexity analysis runs on file save  
- [ ] Cyclomatic complexity calculated
- [ ] Branch paths shown
- [ ] Color-coded severity (🟢🟡🔴)
- [ ] Problems panel shows warnings

### Language Support
- [ ] APL: 50+ operators with descriptions
- [ ] Python: stdlib, decorators, async
- [ ] Java: Lombok, Spring Boot, JDK
- [ ] Rust: traits, macros, std library
- [ ] Shell/PowerShell/Groovy/Maven/K8s

### Advanced Features
- [ ] Symbol wordcloud renders
- [ ] Wordcloud animation smooth
- [ ] Interactive hover on symbols
- [ ] Concordance system works
- [ ] Project tools functional
- [ ] SmeagolTools commands available

### Quality
- [ ] No extension errors
- [ ] Fast performance (<100ms)
- [ ] All modules load
- [ ] VSIX size: 141.27 KB

---

## 🎨 What to Look For

### In Problems Panel (`Ctrl+Shift+M`):
```
🔴 DARK RED (Complexity 20+)
  → This NEEDS refactoring immediately
  → Breaking function into smaller pieces
  → Too many branch paths for testing

🔴 RED (Complexity 11-20)
  → Consider refactoring soon
  → Getting hard to test all branches
  → Maintenance burden

🟡 YELLOW (Complexity 6-10)
  → Monitor this function
  → OK for now, track it
  → Refactor if growing

🟢 GREEN (Complexity 1-5)
  → Perfect! Easy to test and maintain
  → No action needed
```

### Branch Path Examples:
```
if (a) if (b) if (c) → 8 paths
if (a) switch(x) case A,B,C → 6+ paths
a ? b : c ? d : e → 4 paths (exponential)
```

---

## 🚀 Commands Available (28 Total)

### Complexity & Analysis
- `Analyze Code Complexity & Branch Paths` - Manual analysis
- `Summon Symbol Wordcloud` - Visualization
- `Create Concordance Index` - Build symbol index
- `Detect Languages` - Scan workspace
- `Analyze Project Metrics` - Get statistics
- `Project Health Report` - Quality check
- `Search Symbols` - Cross-language search
- `Document Workspace` - Auto-generate docs

### Project & Tools
- `Initialize Smeagol Project` - Create .smeagol folder
- `Smeagol: Help` - Get started
- And 18 more language-specific commands...

Type `smeagol` in command palette to see all!

---

## 🐛 Troubleshooting

### Complexity not showing
1. Open Problems panel: `Ctrl+Shift+M`
2. Ensure file has actual functions
3. Try fresh file save
4. Check file language is recognized

### Wordcloud not rendering
1. Try: `Ctrl+Shift+P` → "Reload Window"
2. Check WebView console: `F12`
3. Verify symbols exist in workspace

### Completions not appearing
1. Ensure file language matches
2. Type trigger characters (letters, @, $)
3. Check syntax highlighting works
4. May need slight delay after typing

### Performance slow
1. Large files (5000+ LOC) can slow analysis
2. Check CPU in Task Manager
3. Try closing other extensions
4. Report if consistent

---

## 📊 Expected Results

### test-complexity.py:
```
🔴 veryComplex: 15+ complexity
🔴 complex_function: 7-8 complexity
🟡 moderate_function: 3 complexity
🟢 simple_function: 1 complexity
```

### test-complexity.js:
```
🔴 veryComplex: 15+ complexity
🔴🔴 nestedConditions: 10+ complexity
🟡 statusHandler: 8 complexity
🟢 simple: 1 complexity
```

### test-apl.apl:
```
✓ All 50+ APL operators available
✓ Completions show descriptions
✓ Unicode symbols properly recognized
```

---

## 🎆 Next Steps

### 1. Explore the Code
- Open real project files
- See which functions trigger warnings
- Use branch paths to understand flow
- Track complexity trends

### 2. Read Documentation
- **QUICK_REFERENCE.md** - All commands
- **ADVANCED_FEATURES.md** - Deep dive
- **COMPETITIVE_ANALYSIS.md** - Market positioning
- **WHATS_NEW.md** - User guide

### 3. Customize
- Edit `.smeagol/config.json` for settings
- Adjust complexity thresholds
- Add custom AI DSL rules
- Configure SonarQube connection

### 4. Share Feedback
- Which features most useful?
- What languages should we add?
- Performance on your projects?
- Suggestions for v0.3?

---

## 📖 Documentation Files

All in root directory:
- **TEST_EXAMPLES.md** - Complete testing guide
- **QUICK_REFERENCE.md** - Command cheat sheet
- **ADVANCED_FEATURES.md** - Complexity deep-dive
- **COMPETITIVE_ANALYSIS.md** - vs competitors
- **RELEASE_NOTES_V0.2.0.md** - Full changelog
- **WHATS_NEW.md** - Feature guide

---

## 🎯 Key Takeaways

### ✅ What Works Automatically
1. **Syntax highlighting** for 14 languages
2. **Complexity analysis** on every file change
3. **Branch path tracking** exponential growth
4. **Color-coded severity** 🟢🟡🔴
5. **Completions** for 470+ items
6. **Symbol discovery** across workspace

### ⭐ The Unique Features
1. **Automatic complexity** without command
2. **Branch path visualization** (not in competitors)
3. **APL support** (rare!)
4. **Polyglot IDE** (14 languages)
5. **Symbol wordcloud** (beautiful!)

### 🚀 Ready For
- Real projects with mixed languages
- Complexity-driven refactoring
- Team code reviews
- Educational purposes
- CI/CD pipelines

---

## 🧙‍♂️ Success!

**"My precious... all my code analyzed in one place!"**

Your Smeagol IDE is running. Open test files and watch the magic! ✨

Questions? Check extension output:
`Help → Toggle Developer Tools → Console`
