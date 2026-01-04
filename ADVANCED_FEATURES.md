# Smeagol Advanced Features Guide

## 🎆 Symbol Summoning Wordcloud

"*My precious... all my symbols gathered in one place!*"

Smeagol can summon a beautiful wordcloud visualization of all symbols and operators from your workspace.

### How to Use

1. **Command Palette**: `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: **"Summon Symbol Wordcloud"**
3. Watch as Smeagol gathers all APL, Python, Java, and Rust symbols

### What You'll See

- **APL Operators** (Magenta): `⍴⌽⍒⍋⊖,↑↓⊂⊃∪∩⍳⍕⍎///\.@⍨¨`
- **Python Functions** (Blue): `def`, `class`, `import`, `async`, `await`, `@decorator`
- **Java Keywords** (Dark Blue): `public`, `class`, `interface`, `@Override`, `static`
- **Rust Keywords** (Red): `fn`, `trait`, `impl`, `struct`, `enum`, `async`

### Interactive Features

- **Hover** over any symbol to see it glow and enlarge
- **Click & Drag** to interact with the visualization
- **Watch** symbols fade in with mesmerizing animations
- **Analyze** language distribution in your codebase

### Use Cases

1. **Code Comprehension**: Understand what symbols are used most
2. **Language Profiling**: See which languages dominate your project
3. **Team Learning**: Show team members symbols used in codebase
4. **API Discovery**: Find all available symbols at a glance

---

## 📊 Code Complexity & Branch Path Analysis

"*With great power comes great complexity.*"

Smeagol analyzes your code for cyclomatic complexity and tracks all possible execution paths.

### How to Use

1. **Open a code file** in any supported language
2. **Command Palette**: `Ctrl+Shift+P`
3. Type: **"Analyze Code Complexity & Branch Paths"**

### What It Measures

#### Cyclomatic Complexity
Measures the number of independent paths through code:
- **1-5**: ✅ Simple, easy to test
- **6-10**: ⚠️ Moderate, consider refactoring
- **11-20**: 🔴 High, likely needs refactoring
- **20+**: 🔴🔴 Very high, refactor immediately

#### Branch Paths
Tracks all possible execution flows:
- **if/else**: Doubles possible paths
- **switch/case**: Multiplies paths by case count
- **ternary `?:`**: Exponential growth
- **logical `&&`, `||`**: Adds complexity

### Supported Languages

- ✅ JavaScript/TypeScript
- ✅ Python
- ✅ Java
- ✅ Rust
- ✅ C/C++
- ✅ Go
- ✅ Ruby
- ✅ PHP
- ✅ AutoIt
- ✅ Shell/Bash

### Example Analysis

```python
def process_data(data, validate=True, transform=False):  # Start: 1
    if validate:                                          # +1 = 2
        if is_valid(data):                                # +1 = 3
            if transform:                                 # +1 = 4
                return transform_data(data)
            else:                                         # +1 = 5
                return data
        else:                                             # +1 = 6
            return None
    else:
        return data
    # Total Complexity: 6
    # Branch Paths: 2^3 = 8 possible execution flows
```

### Diagnostic Output

Smeagol will display:

```
High cyclomatic complexity: 12 (> 10 recommended)
Branch paths: 8 possible execution paths
Consider breaking into smaller functions:
  - Extract validation logic
  - Extract transformation logic
  - Use early returns
```

### Integration with VS Code

- **Problems Panel**: Shows high-complexity functions
- **Code Lens**: Inline complexity hints
- **Terminal Report**: Detailed summary of all functions
- **Color Coding**:
  - 🟢 **Green**: Complexity 1-5 (Good)
  - 🟡 **Yellow**: Complexity 6-10 (Fair)
  - 🔴 **Red**: Complexity 11-20 (High)
  - 🔴🔴 **Dark Red**: Complexity 20+ (Critical)

### Refactoring Tips for High Complexity

1. **Extract Methods**
```python
# BEFORE: Complexity 8
def process(x):
    if condition1:
        if condition2:
            if condition3:
                return x

# AFTER: Complexity 2 each
def process(x):
    if condition1:
        return process_condition2(x)

def process_condition2(x):
    if condition2:
        return process_condition3(x)
```

2. **Use Guard Clauses**
```javascript
// BEFORE: Complexity 5
function validate(user) {
    if (user) {
        if (user.active) {
            if (user.verified) {
                return true;
            }
        }
    }
    return false;
}

// AFTER: Complexity 2
function validate(user) {
    if (!user) return false;
    if (!user.active) return false;
    if (!user.verified) return false;
    return true;
}
```

3. **Extract Conditions to Named Functions**
```python
# BEFORE: Complexity 6
if data and is_numeric(data) and is_positive(data) and len(data) > 0:
    process(data)

# AFTER: Complexity 2
if is_valid_data(data):
    process(data)

def is_valid_data(data):
    return data and is_numeric(data) and is_positive(data) and len(data) > 0
```

---

## 🔍 Understanding Branch Paths

### What Are Branch Paths?

Every decision point in code creates branches:

```
START
  ├─ if condition1? YES → Process A
  │  ├─ if condition2? YES → Process A1
  │  └─ if condition2? NO → Process A2
  └─ if condition1? NO → Process B
     ├─ if condition3? YES → Process B1
     └─ if condition3? NO → Process B2

Total paths: 4 (A1, A2, B1, B2)
```

### Why Branch Paths Matter

1. **Testing**: Each branch needs test coverage
2. **Debugging**: More branches = harder to debug
3. **Maintenance**: More paths = more edge cases
4. **Performance**: Excessive branching affects speed

### Branch Path Examples

#### Simple (2 paths)
```javascript
if (user.active) {
    return "active";
} else {
    return "inactive";
}
// Paths: 2
```

#### Moderate (4 paths)
```javascript
if (user.active) {
    if (user.verified) {
        return "verified";
    } else {
        return "pending";
    }
} else {
    return "inactive";
}
// Paths: 4 (verified, pending, inactive, plus base)
```

#### Complex (8+ paths)
```javascript
if (user.active) {
    if (user.verified) {
        if (user.subscribed) {
            if (user.premium) {
                return "premium-subscriber";
            } else {
                return "subscriber";
            }
        }
    }
}
// Paths: 8+
```

---

## 📈 Project Metrics & Statistics

### Available Metrics

```
Lines of Code (LOC)
├─ Total lines
├─ Code lines (excluding comments/blanks)
├─ Comment lines
└─ Blank lines

Functions & Classes
├─ Total functions
├─ Total classes
├─ Interfaces
└─ Modules

Quality Metrics
├─ Average function length
├─ Documentation ratio (comments/LOC)
├─ Largest function complexity
└─ Overall project health
```

### How to Generate Metrics

1. **Command Palette**: `Ctrl+Shift+P`
2. **"Analyze Project Metrics"**
3. View in terminal or sidebar

---

## 🎯 Best Practices

### Complexity Thresholds

| Threshold | Action | Priority |
|-----------|--------|----------|
| **< 5** | No action needed | ✅ |
| **5-10** | Monitor | ⚠️ |
| **10-15** | Refactor soon | ⚠️⚠️ |
| **> 15** | Refactor immediately | 🔴 |

### Target Metrics

- **Average function complexity**: < 7
- **Max function complexity**: < 15
- **Documentation ratio**: > 20%
- **Function count per file**: < 20
- **Average file size**: < 500 LOC

### Regular Analysis Schedule

- **Per-commit**: Run locally before pushing
- **Daily**: Team metrics check
- **Weekly**: Project health report
- **Monthly**: Trend analysis

---

## 🚀 Advanced: Custom Analysis Rules

Create custom complexity rules in `.smeagol/config.json`:

```json
{
  "complexity": {
    "maxComplexity": 10,
    "maxBranchPaths": 8,
    "maxFileLOC": 500,
    "maxFunctionLOC": 100,
    "enforceDocumentation": true,
    "docRatioTarget": 0.25,
    "rules": {
      "typescript": { "maxComplexity": 8 },
      "python": { "maxComplexity": 12 },
      "java": { "maxComplexity": 10 },
      "rust": { "maxComplexity": 7 }
    }
  }
}
```

---

## Troubleshooting

### "No functions detected"
- Ensure file has functions/methods
- Check file language is recognized
- Try a different file

### "Complexity seems wrong"
- Different languages count complexity differently
- Some frameworks/patterns add artificial complexity
- Check actual function code for nested ternaries

### Performance issues
- Complexity analysis works on visible files
- Large files (5000+ LOC) may take longer
- Try focusing on smaller functions

---

## Commands Reference

| Command | Shortcut | Purpose |
|---------|----------|---------|
| Analyze Complexity | - | Scan current file for complexity |
| Summon Symbols | - | Open symbol wordcloud |
| Project Metrics | - | Generate workspace statistics |
| Health Report | - | Overall project health check |

---

## Integration with CI/CD

Use Smeagol's complexity analysis in your pipeline:

```yaml
# .github/workflows/quality.yml
- name: Check Code Complexity
  run: smeagol analyze-complexity --fail-on-high
  
- name: Generate Metrics Report
  run: smeagol report metrics > metrics.json
```

---

## Further Reading

- [Cyclomatic Complexity (Wikipedia)](https://en.wikipedia.org/wiki/Cyclomatic_complexity)
- [Code Smell (Refactoring.guru)](https://refactoring.guru/smells)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code (Uncle Bob)](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
