# 🎯 Smeagol Idioms Analyzer - Complete Language Guide

## Overview

The **Idioms Analyzer** detects non-idiomatic code patterns and suggests language-native alternatives. It learns from real exemplar code from popular frameworks like Django, Flask, Tokio, Spring, React, and others.

### How It Works

```
Real Exemplar Code (40+ snippets from popular frameworks)
        ↓
IdiomExtractor analyzes for semantic patterns
        ↓
Generates rules with idiomaticity scores (0-100)
        ↓
Your code is checked against rules
        ↓
Problems panel shows violations + idiomatic alternatives
```

**Scoring System:**
- **Error** (Red): Score ≥ 90 (highly idiomatic, frequently used)
- **Warning** (Yellow): Score 70-89 (very idiomatic, moderately used)
- **Information** (Blue): Score < 70 (idiomatic but less common)

### Features

✅ **Automatic Analysis** - Runs on file open and on every save (no commands needed)
✅ **All 14 Languages** - Full coverage including frameworks and infrastructure configs
✅ **40+ Exemplars** - Real code from Django, Flask, NumPy, Pandas, Tokio, Serde, Spring, etc.
✅ **160+ Rules** - Generated automatically from exemplar patterns
✅ **Smart Integration** - Shows alongside complexity analysis in Problems panel
✅ **Offline Mode** - All exemplars bundled with extension, no API calls

---

## Language-Specific Idioms

### 🐍 **Python** (7 Framework Exemplars)

**Exemplars Include:** Django, Flask, NumPy, Pandas, Requests, AsyncIO, PathLib

**Key Idiom Patterns Detected:**

| Pattern | Idiomatic | Non-Idiomatic | Score |
|---------|-----------|---------------|-------|
| **List Comprehensions** | `[x*2 for x in items]` | `result = []` `for x in items:` `result.append(x*2)` | 95 |
| **F-Strings** | `f"Hello {name}"` | `"Hello " + name` or `"Hello {}".format(name)` | 85 |
| **Context Managers** | `with open(f) as f:` | `f = open(f)` then `f.close()` | 92 |
| **Generators** | `(x*2 for x in items)` | List comprehension for memory-heavy ops | 80 |
| **Decorators** | `@property` `@staticmethod` | Manual getters/setters | 88 |
| **Enumerate** | `for i, v in enumerate(lst):` | Manual counter loop | 82 |
| **Dict Comprehension** | `{k: v*2 for k, v in d.items()}` | Manual dict building | 78 |
| **Type Hints** | `def func(x: int) -> str:` | No annotations | 72 |

**Django Exemplar Patterns:**
- Class-based views with proper inheritance
- ORM queries with `.filter()` chaining
- Middleware pattern with `__call__`
- Template tags with `@register.filter`

**Flask Exemplar Patterns:**
- Route decorators: `@app.route('/path')`
- Blueprint organization
- Request context with `@before_request`
- JSONify responses

**NumPy/Pandas Exemplar Patterns:**
- Vectorized operations instead of loops
- Broadcasting for dimension matching
- DataFrame method chaining
- Boolean indexing with masks

---

### 🦀 **Rust** (7 Framework Exemplars)

**Exemplars Include:** Tokio, Serde, Rayon, Clap, Error-handling, Pattern-matching, Traits

**Key Idiom Patterns Detected:**

| Pattern | Idiomatic | Non-Idiomatic | Score |
|---------|-----------|---------------|-------|
| **Match Expressions** | `match result { Ok(v) => ..., Err(e) => ... }` | `if is_ok() { } else { }` | 96 |
| **? Operator** | `let val = func()?;` | `let val = match func() { Ok(v) => v, Err(e) => return Err(e) }` | 94 |
| **Ownership/Borrowing** | `&str` / `&mut T` | Passing ownership everywhere | 98 |
| **Iterator Chains** | `.iter().filter().map().collect()` | Manual loops | 89 |
| **Combinators** | `.and_then()` `.map()` `.or_else()` | Nested match expressions | 85 |

**Tokio Exemplar Patterns:**
- `#[tokio::main]` entry point
- `async`/`await` syntax
- `spawn()` for concurrent tasks
- Channel-based communication

**Serde Exemplar Patterns:**
- `#[derive(Serialize, Deserialize)]`
- Custom serialization with `#[serde(rename)]`
- Error handling in serialization
- Generic serializers

**Rayon Exemplar Patterns:**
- `.par_iter()` for parallel processing
- Thread pool automatic management
- Work-stealing distribution
- Avoiding data races

---

### ☕ **Java** (6 Framework Exemplars)

**Exemplars Include:** Spring, Streams, Optional, Guava, Lombok, Exception-handling

**Key Idiom Patterns Detected:**

| Pattern | Idiomatic | Non-Idiomatic | Score |
|---------|-----------|---------------|-------|
| **Streams API** | `list.stream().filter().map().collect()` | Traditional for-loops | 93 |
| **Optional** | `Optional.of(v).map().orElse()` | Null checks with if | 87 |
| **Try-with-Resources** | `try (Resource r = new R()) { }` | Manual try-finally | 91 |
| **Lambda Expressions** | `(x, y) -> x + y` | Anonymous inner classes | 89 |
| **Method References** | `String::valueOf` | Lambda wrappers | 84 |
| **Annotations** | `@Override` `@Deprecated` | Comments like `// override` | 75 |

**Spring Exemplar Patterns:**
- `@RestController` with `@GetMapping`
- Dependency injection with `@Autowired`
- `@Service` / `@Repository` layers
- `ResponseEntity<T>` for HTTP responses
- `@Transactional` for database operations

**Guava Exemplar Patterns:**
- `ImmutableList`, `ImmutableMap`
- `Preconditions.checkNotNull()`
- `FluentIterable` chains
- `Table<R,C,V>` for 2D data

**Lombok Exemplar Patterns:**
- `@Data` for getters/setters
- `@Builder` for fluent object creation
- `@NonNull` for null safety
- `@Value` for immutable objects

---

### 🟨 **JavaScript** (6 Framework Exemplars)

**Exemplars Include:** ES6+, Async/Await, React, Lodash, Spread/Rest, Promises

**Key Idiom Patterns Detected:**

| Pattern | Idiomatic | Non-Idiomatic | Score |
|---------|-----------|---------------|-------|
| **Arrow Functions** | `const fn = (x) => x * 2;` | `function(x) { return x * 2; }` | 92 |
| **Destructuring** | `const { name, age } = obj;` | `const name = obj.name;` etc. | 88 |
| **Template Literals** | `\`Hello ${name}\`` | `"Hello " + name` | 85 |
| **Async/Await** | `async () => { await fn(); }` | `.then().catch()` chains | 90 |
| **Const/Let** | `const x = ...` / `let y = ...` | `var` keyword | 94 |
| **Spread Operator** | `{ ...obj, key: val }` | `Object.assign({}, obj, {})` | 82 |

**React Exemplar Patterns:**
- Functional components with hooks
- `useState()` / `useEffect()` hooks
- JSX without className strings
- Component composition patterns

**Lodash Exemplar Patterns:**
- `_.map()` / `_.filter()` chains
- `_.groupBy()` for grouping
- `_.maxBy()` / `_.minBy()` for selections
- `_.debounce()` / `_.throttle()` for events

---

### 🐹 **Go** (6 Framework Exemplars)

**Exemplars Include:** Error-handling, Goroutines, Interfaces, Defer, HTTP, Testing

**Key Idiom Patterns Detected:**

| Pattern | Idiomatic | Non-Idiomatic | Score |
|---------|-----------|---------------|-------|
| **Error Checking** | `if err != nil { return err }` | `try-catch` or error ignoring | 98 |
| **Goroutines** | `go func() { }()` | Sequential execution | 89 |
| **Interfaces** | `type Reader interface { Read() }` | Type-based polymorphism | 85 |
| **Defer** | `defer file.Close()` | Manual cleanup | 87 |
| **Channels** | `ch := make(chan T)` | Shared memory synchronization | 82 |

**HTTP Exemplar Patterns:**
- `http.HandleFunc()` route registration
- `http.ListenAndServe()` server startup
- Request/response patterns
- Error handling in handlers

**Testing Exemplar Patterns:**
- Table-driven tests with slice of structs
- `testing.T` with subtests
- Benchmark functions with `B.ResetTimer()`
- Example functions for documentation

---

### 📊 **APL** (6 Framework Exemplars)

**Exemplars Include:** Array operations, Tacit programming, Higher-order operators, Composition, Structural, Generators

**Key Idiom Patterns Detected:**

| Pattern | Idiomatic | Non-Idiomatic | Score |
|---------|-----------|---------------|-------|
| **Array Operations** | `+/` (sum), `×/` (product), `⌈/` (max) | Loop-based accumulation | 95 |
| **Tacit Definitions** | `sum ← +/` | Explicit function parameters | 88 |
| **Reduction** | `/` operator with functions | Manual recursion | 92 |
| **Scan** | `\` operator (cumulative operations) | Step-by-step iteration | 89 |
| **Function Composition** | `∘` (compose), `⍨` (commute) | Explicit chaining | 84 |

**Tacit Programming Patterns:**
- Point-free function definitions
- Operator binding and composition
- Train expressions (railroad diagrams)
- Implicit argument passing

---

### 🐚 **Shell / Bash** (1 Exemplar)

**Key Idiom Patterns Detected:**

| Pattern | Idiomatic | Non-Idiomatic | Score |
|---------|-----------|---------------|-------|
| **Command Substitution** | `$(command)` | `` `command` `` (backticks) | 90 |
| **Quoting** | `"$var"` for expansion, `'$var'` for literals | Mixed unquoted variables | 85 |
| **Test Conditions** | `[ -f "$file" ]` | Manual existence checks | 87 |
| **Globbing** | `*.txt` | Manual file listing | 82 |
| **Pipes** | `cat file \| grep pattern` | Storing intermediate files | 88 |

---

### 💜 **PowerShell** (1 Exemplar)

**Key Idiom Patterns Detected:**

| Pattern | Idiomatic | Non-Idiomatic | Score |
|---------|-----------|---------------|-------|
| **Cmdlet Naming** | `Get-ChildItem`, `Set-Location` | Custom function names | 88 |
| **Pipeline Usage** | `Get-Process \| Where-Object` | Sequential cmdlet calls | 90 |
| **Parameter Validation** | `[ValidateNotNull()]` attributes | Manual parameter checking | 85 |
| **Error Handling** | `$?` and `$Error` | Bare exception handling | 80 |
| **Object Pipelines** | Pass objects between cmdlets | String parsing | 87 |

---

### 🔧 **Groovy** (1 Exemplar)

**Key Idiom Patterns Detected:**

| Pattern | Idiomatic | Non-Idiomatic | Score |
|---------|-----------|---------------|-------|
| **Closures** | `{ x -> x * 2 }` | Anonymous inner classes | 92 |
| **GString Interpolation** | `"Hello ${name}"` | String concatenation | 88 |
| **Collection Methods** | `.each()` / `.collect()` / `.findAll()` | Manual iteration | 85 |
| **Operator Overloading** | Custom `+`, `-`, `[]` operators | Method calls | 78 |
| **Safe Navigation** | `obj?.method()` | Null checks | 82 |

---

### 🤖 **AutoIt** (1 Exemplar)

**Key Idiom Patterns Detected:**

| Pattern | Idiomatic | Non-Idiomatic | Score |
|---------|-----------|---------------|-------|
| **WinAPI Calls** | `DllCall("user32.dll", ...)` | Reinventing wheel | 85 |
| **Error Checking** | `If @error Then` | Ignoring errors | 87 |
| **Window Operations** | `WinActivate()` / `ControlClick()` | Direct user actions | 88 |
| **Loop Patterns** | `Do...Until` / `While...Wend` | Goto labels | 83 |

---

### ☸️ **Kubernetes YAML** (1 Exemplar)

**Key Idiom Patterns Detected:**

| Pattern | Idiomatic | Non-Idiomatic | Score |
|---------|-----------|---------------|-------|
| **Resource Structure** | `apiVersion` → `kind` → `metadata` → `spec` | Random key ordering | 95 |
| **Labels & Selectors** | `app: myapp` labels with selectors | Inline app names | 90 |
| **Resource Limits** | `requests` / `limits` sections | Unbounded resources | 88 |
| **Health Checks** | `livenessProbe` / `readinessProbe` | Manual monitoring | 87 |
| **ConfigMaps** | Separate config from image | Hardcoded values | 89 |

---

### 📦 **Maven XML** (1 Exemplar)

**Key Idiom Patterns Detected:**

| Pattern | Idiomatic | Non-Idiomatic | Score |
|---------|-----------|---------------|-------|
| **Project Structure** | `<groupId>` → `<artifactId>` → `<version>` | Flat naming | 93 |
| **Dependency Management** | `<dependencyManagement>` for versions | Version duplication | 85 |
| **Plugins** | `<plugins>` with `<configuration>` | Hardcoded build settings | 80 |
| **Profiles** | Dev/test/prod profiles | Single configuration | 82 |
| **Repository URLs** | Proper Maven Central references | Custom mirror setup | 78 |

---

### 🔨 **Jenkins Groovy** (1 Exemplar)

**Key Idiom Patterns Detected:**

| Pattern | Idiomatic | Non-Idiomatic | Score |
|---------|-----------|---------------|-------|
| **Declarative Pipelines** | `pipeline { stages { } }` | Scripted pipelines | 92 |
| **Stage Organization** | Build → Test → Deploy stages | Linear scripts | 88 |
| **Environment Variables** | `environment { VAR = value }` | Hardcoded values | 85 |
| **Post Actions** | `post { success { } failure { } }` | Manual cleanup | 83 |
| **Credentials** | `credentials('id')` | Plaintext secrets | 90 |

---

### 🌱 **Spring Boot** (1 Exemplar)

**Key Idiom Patterns Detected:**

| Pattern | Idiomatic | Non-Idiomatic | Score |
|---------|-----------|---------------|-------|
| **Annotations** | `@SpringBootApplication` / `@RestController` | Manual configuration | 94 |
| **Dependency Injection** | `@Autowired` / Constructor injection | Manual instantiation | 91 |
| **REST Endpoints** | `@GetMapping` / `@PostMapping` | Manual routing | 89 |
| **Properties** | `application.properties` / `application.yml` | Hardcoded config | 87 |
| **Service Layer** | `@Service` with business logic | Controllers doing everything | 86 |

---

## Integration with Complexity Analysis

The **Idioms Analyzer** works alongside the Complexity Analyzer:

- **Complexity Analysis**: Measures cyclomatic complexity, branch paths, nesting depth
- **Idioms Analysis**: Detects non-idiomatic patterns and suggests alternatives

Both appear in the **Problems** panel with:
- **Source**: "Smeagol Complexity" or "Smeagol Idioms"
- **Severity**: Error (red) / Warning (yellow) / Information (blue)
- **Related Info**: Shows idiomatic alternative or suggestion

### Example Problems Panel Output

```
test-python.py
  Line 5: Non-idiomatic: Manual loop instead of list comprehension (Smeagol Idioms)
    ├─ Severity: Warning (score 95)
    └─ Suggestion: Use [x*2 for x in items]

  Line 12: High complexity: Nested conditionals (Smeagol Complexity)
    ├─ Severity: Error (complexity 8)
    └─ Suggestion: Consider extracting to separate function

  Line 23: Non-idiomatic: String concatenation instead of f-string (Smeagol Idioms)
    ├─ Severity: Information (score 85)
    └─ Suggestion: Use f"Hello {name}"
```

---

## Statistics & Reporting

### View Idiom Statistics

Run command: **"Analyze Code Idioms"** to see:

```
Smeagol Idioms Statistics:
- Total Languages: 14
- Total Rules: 160+
- Rules by Language:
  • Python: 30 rules
  • Rust: 25 rules
  • Java: 20 rules
  • JavaScript: 18 rules
  • Go: 15 rules
  • APL: 12 rules
  • [... plus 8 more languages ...]
```

---

## Best Practices by Language

### Python: Write Pythonic Code

1. **Use list/dict/set comprehensions** instead of manual loops
2. **Use context managers** (`with` statements) for resource cleanup
3. **Use f-strings** for string interpolation (Python 3.6+)
4. **Use generators** for memory-efficient iteration
5. **Add type hints** for better IDE support and documentation
6. **Use decorators** for cross-cutting concerns

### Rust: Leverage Ownership & Safety

1. **Use pattern matching** (`match`) for exhaustive handling
2. **Use the `?` operator** for error propagation
3. **Respect borrowing rules** - use references wisely
4. **Chain iterators** instead of explicit loops
5. **Use Result/Option combinators** - `.map()`, `.and_then()`
6. **Use traits** for polymorphism

### Java: Embrace Modern Paradigms

1. **Use Streams API** for data transformations
2. **Use Optional** instead of null checks
3. **Use try-with-resources** for automatic cleanup
4. **Use lambda expressions** for functional programming
5. **Use annotations** for metadata and configuration
6. **Use records** (Java 14+) for simple data carriers

### JavaScript: Write ES6+ Code

1. **Use arrow functions** instead of `function` keyword
2. **Use destructuring** for cleaner variable extraction
3. **Use const/let** instead of `var`
4. **Use template literals** for string interpolation
5. **Use async/await** instead of `.then()` chains
6. **Use spread operator** for object/array manipulation

---

## Exemplar Framework Coverage

### Python (7 Frameworks)
- Django: Web framework, ORM, middleware
- Flask: Microframework, routing, templates
- NumPy: Numerical computing, vectorization
- Pandas: Data analysis, DataFrames, grouping
- Requests: HTTP library, sessions, error handling
- AsyncIO: Async/await patterns, coroutines
- PathLib: Object-oriented path handling

### Rust (7 Frameworks)
- Tokio: Async runtime, tasks, channels
- Serde: Serialization framework
- Rayon: Data-level parallelism
- Clap: CLI argument parsing
- Error-Handling: Result types, error propagation
- Pattern-Matching: Match expressions, enums
- Traits: Polymorphism, type bounds

### Java (6 Frameworks)
- Spring: Dependency injection, web framework
- Streams: Functional data processing
- Optional: Null-safe value handling
- Guava: Collections and utilities
- Lombok: Boilerplate code reduction
- Exception-Handling: Custom exceptions, recovery

### JavaScript (6 Frameworks)
- ES6+: Modern syntax features
- Async/Await: Promise-based concurrency
- React: Component patterns, hooks
- Lodash: Utility library, functional programming
- Spread/Rest: Operator patterns
- Promises: Async control flow

### Go (6 Frameworks)
- Error-Handling: Error returns, checking
- Goroutines: Lightweight concurrency
- Interfaces: Duck typing, polymorphism
- Defer: Cleanup guarantee
- HTTP: Web server patterns
- Testing: Table-driven tests

---

## Extending Idioms

Want to add custom idioms for your team's patterns?

**Coming Soon**: Custom exemplar registration API
- Load exemplars from files
- Define language-specific patterns
- Share across team

---

## Troubleshooting

**Q: No idiom suggestions appearing?**
- A: Check that file type is recognized (Python, Rust, Java, etc.)
- Ensure file is saved (idioms analyze on save)
- Open Problems panel (Ctrl+Shift+M)

**Q: How accurate are suggestions?**
- A: Patterns extracted from 40+ real exemplars from popular libraries
- Confidence scores shown (90+ = highly idiomatic, 70-89 = very idiomatic)
- Regex-based matching works for 80% of patterns

**Q: Can I disable specific rules?**
- A: Set `"smeagol.idioms.enabled": false` in settings
- Per-file disable coming soon

---

## About the Exemplars

All exemplars are:
- ✅ Real code from production libraries
- ✅ Bundled with extension (no external downloads)
- ✅ License-compliant (OSS projects)
- ✅ Regularly updated with new frameworks

**Featured Frameworks:**
Django, Flask, NumPy, Pandas, Requests, Tokio, Serde, Rayon, Spring, React, Lodash, Groovy, Kubernetes, Maven, Jenkins, and more!

---

**Idioms Analyzer** • Part of [Smeagol v0.2.1+](README.md) • All 14 Languages Supported
