# 🧙‍♂️ Smeagol v0.2.0 - Test Examples

## ✅ Installation Complete

Your Smeagol extension is now installed and ready to test!

### Version
- **v0.2.0** (141.27 KB, 56 files)
- **14 Languages** actively supported
- **28 Commands** available
- **470+ Completions** items

---

## 🚀 Quick Test (5 minutes)

### Step 1: Initialize Project
1. Open command palette: `Ctrl+Shift+P` (or `Cmd+Shift+P`)
2. Type: **"Initialize Smeagol Project"**
3. Creates `.smeagol/` folder with configs
4. ✓ You'll see: "✓ Smeagol project initialized"

### Step 2: Test APL Completions
1. Create new file: `test.apl`
2. Type: `⍴` (reshape operator)
3. You should see APL completions with descriptions
4. Type: `⌽` (reverse), `⍒` (grade down), etc.
5. ✓ All 50+ APL operators available

### Step 3: Test Complexity Analysis (AUTOMATIC)
1. Create new file: `test.py` with this code:
```python
def process_data(data, validate=True, transform=False):
    if validate:
        if is_valid(data):
            if transform:
                return transform_data(data)
            else:
                return data
        else:
            return None
    else:
        return data
```
2. Save the file
3. **Complexity analysis runs automatically!**
4. Check "Problems" panel (Ctrl+Shift+M)
5. ✓ You'll see: "High cyclomatic complexity: 6 (> 10 recommended). Branch paths: 8"

### Step 4: Test Symbol Wordcloud
1. Open command palette: `Ctrl+Shift+P`
2. Type: **"Summon Symbol Wordcloud"**
3. Beautiful animated visualization of symbols
4. Hover over symbols to see them glow
5. ✓ Wordcloud shows APL/Python/Java/Rust symbols

### Step 5: Test Language Completions
Try these in their respective files:

**Python** (`test.py`):
- Type `def` → See function completions
- Type `import n` → See numpy, nested imports
- Type `@` → See @decorator, @property completions

**Java** (`test.java`):
- Type `@` → See Lombok (@Data, @Getter, @Setter)
- Type `@Service` → See Spring Boot annotations
- Type `public` → See access modifiers

**Rust** (`test.rs`):
- Type `Vec::` → See standard library
- Type `#[` → See derive macros
- Type `trait` → See trait completions

**Shell** (`test.sh`):
- Type `echo` → See shell commands
- Type `for` → See loop syntax

---

## 🧪 Full Feature Test (15 minutes)

### Automatic Code Recognition

**WHAT'S HAPPENING**:
- When you open/edit any code file, Smeagol automatically:
  1. ✓ Highlights syntax with Kromatic colors
  2. ✓ Analyzes complexity metrics
  3. ✓ Tracks branch paths
  4. ✓ Creates diagnostics for high-complexity functions
  5. ✓ Detects language automatically

### Test Complexity with Multiple Languages

#### JavaScript (`test.js`):
```javascript
function validate(user) {
  if (user) {
    if (user.active) {
      if (user.verified) {
        if (user.premium) {
          return "premium";
        } else {
          return "verified";
        }
      } else {
        return "pending";
      }
    } else {
      return "inactive";
    }
  }
  return "none";
}
```
**Expected**: Complexity 5, Branch paths 16

#### Java (`test.java`):
```java
public class DataProcessor {
  public void process(Data data, boolean validate, boolean transform) {
    if (validate) {
      if (isValid(data)) {
        if (transform) {
          transformData(data);
        }
      }
    }
  }
}
```
**Expected**: Complexity 4, Branch paths 4-8

#### Rust (`test.rs`):
```rust
fn handle_response(status: u32, body: Option<String>) -> String {
  if status == 200 {
    if let Some(b) = body {
      if b.len() > 0 {
        return b;
      }
    }
  } else if status == 404 {
    return "Not Found".to_string();
  }
  return "Error".to_string();
}
```
**Expected**: Complexity 5, Branch paths 6-8

### Test Concordance System

1. Open command palette: `Ctrl+Shift+P`
2. Type: **"Create Concordance Index"**
3. Check `.smeagol/` folder:
   - ✓ `config.json` - Project settings
   - ✓ `languages.json` - Language registry
   - ✓ `concordance.json` - Symbol index
   - ✓ `sonarqube.json` - SonarQube config
   - ✓ `ai-dsl-rules.json` - AI instruction rules

### Test SmeagolTools

1. **Detect Languages**: `Ctrl+Shift+P` → "Detect Languages"
   - Scans workspace for all file types
   - Shows detected languages

2. **Analyze Metrics**: `Ctrl+Shift+P` → "Analyze Project Metrics"
   - Shows LOC, functions, classes, comments
   - Calculates documentation ratio

3. **Search Symbols**: `Ctrl+Shift+P` → "Search Symbols"
   - Type symbol name to find across project
   - Cross-language symbol search

4. **Project Health**: `Ctrl+Shift+P` → "Project Health Report"
   - Checks for tests, README, docs
   - Quality assessment

### Test AI DSL Compiler

1. Create file: `test.ai-dsl`:
```
ai-instruction {
  action: "refactor complex function",
  context: "function has cyclomatic complexity 15",
  language: "python",
  constraints: ["keep API unchanged", "add unit tests"],
  output: "refactored code with tests"
}
```

2. Open terminal (Ctrl+`)
3. Check output for compiled instruction
4. Both human-readable and machine JSON generated

### Test SonarQube Integration (Optional)

1. Open command palette: `Ctrl+Shift+P`
2. Type: **"SonarQube: Test Connection"**
3. If SonarQube available, connects and fetches metrics
4. Shows issues in Problems panel

---

## 📊 Verification Checklist

### Basic Features
- [ ] ✓ APL language support (50+ operators)
- [ ] ✓ Python/Java/Rust/Shell completions
- [ ] ✓ Automatic syntax highlighting
- [ ] ✓ All 14 languages detected
- [ ] ✓ Package.json shows v0.2.0

### Complexity Analysis (THE STAR ⭐)
- [ ] ✓ Automatic analysis on file open
- [ ] ✓ Automatic analysis on file change
- [ ] ✓ Cyclomatic complexity calculated correctly
- [ ] ✓ Branch paths shown in diagnostics
- [ ] ✓ High-complexity functions marked in Problems panel
- [ ] ✓ Color-coded severity (🟢🟡🔴)

### Advanced Features
- [ ] ✓ Symbol wordcloud visualization
- [ ] ✓ Interactive hover effects on symbols
- [ ] ✓ Animated fade-in on wordcloud
- [ ] ✓ Project concordance system
- [ ] ✓ SmeagolTools commands working
- [ ] ✓ AI DSL compilation

### Quality
- [ ] ✓ No errors in extension output
- [ ] ✓ No performance issues
- [ ] ✓ Commands palette shows 28 commands
- [ ] ✓ All new modules load without errors

---

## 🎯 Key Features to Highlight

### 1. Automatic Code Complexity ⭐⭐⭐
**Most Unique Feature**: Real-time complexity + branch path analysis
```
When you save a file → Smeagol automatically:
1. Extracts all functions
2. Calculates cyclomatic complexity
3. Analyzes branch paths (exponential for nested conditions)
4. Shows diagnostics in Problems panel
5. Color-codes severity
```

### 2. Branch Path Visualization ⭐⭐
**Competitors Don't Have This**: 
```
if (a) {           → Paths: 2
  if (b) {         → Paths: 4
    if (c) {       → Paths: 8
      ...
    }
  }
}
```

### 3. Symbol Wordcloud ⭐
**Beautiful Visualization**:
- Animated symbols from all languages
- Interactive hover effects
- Color-coded by language
- Helps understand codebase visually

### 4. Polyglot IDE Support ⭐
**14 Languages in One**:
- APL, Python, Java, Rust, Go, JavaScript
- Shell, PowerShell, Spring Boot, Kubernetes, Groovy, Maven, Jenkins, AutoIt

### 5. AI DSL Compiler ⭐
**Unique Control**:
```
Human instruction → AI DSL → AI Compiler → Machine Prompt
```

---

## 🐛 Troubleshooting

### Complexity Analysis Not Showing
1. Check Problems panel: `Ctrl+Shift+M`
2. Ensure file has actual functions
3. Try different file (test.py with code above)
4. Check extension output: Help → Toggle Developer Tools

### Wordcloud Not Rendering
1. Check WebView permissions
2. Try: `Ctrl+Shift+P` → "Reload Window"
3. Verify workspace has symbols to display

### Completions Not Appearing
1. Verify file language is recognized
2. Type trigger characters (letters, @, $, etc.)
3. Check syntax highlighting is working

### Performance Issues
1. Large files (5000+ LOC) may slow down
2. Reduce complexity analysis scope
3. Check CPU/memory in Task Manager

---

## 🚀 Next Steps

### Try Different Scenarios
1. Open real project with mixed languages
2. Check which files trigger complexity warnings
3. Use refactoring tips from ADVANCED_FEATURES.md
4. Track complexity metrics over time

### Customize
1. Edit `.smeagol/config.json` for thresholds
2. Adjust complexity limits per language
3. Add custom AI DSL rules
4. Configure SonarQube connection

### Get Feedback
1. Which complexity warnings are most useful?
2. Are branch paths helping with understanding?
3. What languages do you need next?
4. Should we add more features (Go, Ruby, PHP)?

---

## 📚 Documentation Files

- **QUICK_REFERENCE.md** - 28 commands cheat sheet
- **ADVANCED_FEATURES.md** - Deep dive on complexity
- **WHATS_NEW.md** - User guide for new features
- **COMPETITIVE_ANALYSIS.md** - Market positioning
- **RELEASE_NOTES_V0.2.0.md** - Full changelog

---

## 🎆 Success!

**Your Smeagol IDE is running!**

"*My precious... all my code analyzed in one place!*" 🧙‍♂️

---

### Questions?
See documentation files or check extension output:
`Help → Toggle Developer Tools → Console`
