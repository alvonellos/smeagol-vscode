"use strict";

/**
 * Semantic Idiom Extractor
 * Analyzes exemplar code to extract idiomatic patterns
 * and generates language-specific idiom rules
 */
class IdiomExtractor {
  constructor() {
    this.exemplars = new Map();
    this.patterns = new Map();
    this.rules = new Map();
  }

  /**
   * Register exemplar code for a language
   * Exemplar = real code from popular libraries showing best practices
   */
  registerExemplar(language, framework, code) {
    const key = `${language}:${framework}`;
    if (!this.exemplars.has(language)) {
      this.exemplars.set(language, []);
    }
    this.exemplars.get(language).push({
      framework,
      code,
      key
    });
  }

  /**
   * Extract patterns from exemplar code
   * Returns: { patternName, regex, frequency, score, context }
   */
  extractPatterns(language) {
    const exemplarList = this.exemplars.get(language) || [];
    const patterns = [];
    const patternMap = new Map();

    for (const exemplar of exemplarList) {
      const extracted = this._analyzeCode(exemplar.code, language);
      
      for (const pattern of extracted) {
        const key = pattern.name;
        if (!patternMap.has(key)) {
          patternMap.set(key, {
            ...pattern,
            frequency: 1,
            frameworks: [exemplar.framework]
          });
        } else {
          const existing = patternMap.get(key);
          existing.frequency++;
          if (!existing.frameworks.includes(exemplar.framework)) {
            existing.frameworks.push(exemplar.framework);
          }
        }
      }
    }

    // Convert to array, calculate idiomaticity score
    for (const [, pattern] of patternMap) {
      // Score: (frequency / total) * frameworks count * 100
      const totalExemplars = exemplarList.length || 1;
      pattern.score = Math.min(100, (pattern.frequency / totalExemplars) * 100);
      patterns.push(pattern);
    }

    return patterns.sort((a, b) => b.score - a.score);
  }

  /**
   * Generate idiom rules from extracted patterns
   */
  generateRules(language) {
    const patterns = this.extractPatterns(language);
    const rules = [];

    for (const pattern of patterns) {
      if (pattern.score < 30) continue; // Only high-confidence patterns

      const rule = {
        id: this._generateId(pattern.name),
        name: pattern.name,
        pattern: pattern.regex,
        antiPattern: pattern.antiPattern, // What to avoid
        suggestion: pattern.suggestion,
        example: pattern.example,
        idiomatic: pattern.idiomatic,
        language,
        frameworks: pattern.frameworks,
        score: Math.round(pattern.score), // 0-100 idiomaticity
        severity: this._calculateSeverity(pattern.score),
        category: pattern.category || "general"
      };

      rules.push(rule);
    }

    this.rules.set(language, rules);
    return rules;
  }

  /**
   * Analyze code and extract semantic patterns
   * Language-specific analyzers
   */
  _analyzeCode(code, language) {
    switch (language.toLowerCase()) {
      case "python":
        return this._analyzePython(code);
      case "rust":
        return this._analyzeRust(code);
      case "java":
        return this._analyzeJava(code);
      case "javascript":
        return this._analyzeJavaScript(code);
      case "go":
        return this._analyzeGo(code);
      case "apl":
        return this._analyzeAPL(code);
      case "shell":
        return this._analyzeShell(code);
      case "powershell":
        return this._analyzePowerShell(code);
      case "groovy":
        return this._analyzeGroovy(code);
      case "autoit":
        return this._analyzeAutoIt(code);
      case "yaml":
      case "kubernetes":
        return this._analyzeYAML(code);
      case "xml":
      case "maven":
        return this._analyzeXML(code);
      case "groovy-jenkins":
      case "jenkins":
        return this._analyzeJenkins(code);
      case "java-spring":
      case "springboot":
        return this._analyzeSpringBoot(code);
      default:
        return [];
    }
  }

  _analyzePython(code) {
    const patterns = [];
    
    // List comprehension vs loop
    if (/for\s+\w+\s+in\s+.+:\s+results\.append/.test(code)) {
      patterns.push({
        name: "Use list comprehension instead of append loop",
        regex: /(\w+)\s*=\s*\[\]\s*\n\s*for\s+(\w+)\s+in\s+([^:]+):\s*\n\s*\1\.append/,
        antiPattern: "[]\nfor x in items:\n  results.append(x)",
        suggestion: "Use [x for x in items] for more idiomatic Python",
        example: "results = [x * 2 for x in items if x > 0]",
        idiomatic: "results = [x * 2 for x in items if x > 0]",
        category: "expressions",
        score: 95
      });
    }

    // F-strings vs format/percent
    if (/\.format\(|%\s*\(/.test(code) && code.includes("def ")) {
      patterns.push({
        name: "Use f-strings for string formatting",
        regex: /['\"].*\{.*\}.*['\"]\.format\(|['\"].*%s.*['\"]\s*%/,
        antiPattern: '"Hello {}".format(name)\n"Hello %s" % name',
        suggestion: "Use f-strings: f'Hello {name}'",
        example: "message = f'Hello {name}, you are {age} years old'",
        idiomatic: "f'Hello {name}'",
        category: "strings"
      });
    }

    // Context managers for file I/O
    if (/open\(|with\s+open/.test(code)) {
      patterns.push({
        name: "Use 'with' statement for file handling",
        regex: /f\s*=\s*open\(|\.close\(\)/,
        antiPattern: "f = open(file)\ndata = f.read()\nf.close()",
        suggestion: "Use 'with' statement to ensure file is closed",
        example: "with open(file) as f:\n  data = f.read()",
        idiomatic: "with open(file) as f: ...",
        category: "io"
      });
    }

    // Generator expressions
    if (/\(.*for.*in.*\)/.test(code)) {
      patterns.push({
        name: "Use generator expressions for memory efficiency",
        regex: /\[.*for\s+\w+\s+in\s+.*\](?=\s*for)/,
        suggestion: "Use generator expression (x for x in ...) instead of list",
        idiomatic: "(x for x in items)",
        category: "performance"
      });
    }

    // Decorators for functions
    if (/@\w+\s*\ndef/.test(code)) {
      patterns.push({
        name: "Use decorators for cross-cutting concerns",
        regex: /@(property|staticmethod|classmethod|wraps|lru_cache)/,
        suggestion: "Decorators are the idiomatic way to modify functions",
        idiomatic: "@decorator\ndef func(): ...",
        category: "functions"
      });
    }

    // Enumerate instead of manual indexing
    if (/for\s+i\s+in\s+range\(len\(/.test(code)) {
      patterns.push({
        name: "Use enumerate instead of range(len())",
        regex: /for\s+i\s+in\s+range\(len\(/,
        antiPattern: "for i in range(len(items)):\n  item = items[i]",
        suggestion: "Use enumerate(items) for cleaner iteration",
        idiomatic: "for i, item in enumerate(items): ...",
        category: "iteration"
      });
    }

    // Dict comprehension
    if (/dict\(|for.*in.*\}/.test(code)) {
      patterns.push({
        name: "Use dict comprehension",
        regex: /\{.*:\s*.*\s+for\s+.*\s+in\s+.*\}/,
        suggestion: "Dict comprehensions are more Pythonic than loops",
        idiomatic: "{k: v for k, v in items}",
        category: "collections"
      });
    }

    // Type hints
    if (/def\s+\w+\(.*\)\s*:|:\s*List|:\s*Optional/.test(code)) {
      patterns.push({
        name: "Use type hints for clarity",
        regex: /def\s+(\w+)\(([^)]*)\)\s*:/,
        suggestion: "Type hints improve code clarity: def func(x: int) -> str:",
        idiomatic: "def func(x: int) -> str: ...",
        category: "typing"
      });
    }

    return patterns;
  }

  _analyzeRust(code) {
    const patterns = [];

    // Pattern matching over if-else
    if (/match\s+\w+/.test(code)) {
      patterns.push({
        name: "Use match for pattern matching",
        regex: /match\s+\w+\s*\{/,
        antiPattern: "if x == Some(...) { ... } else { ... }",
        suggestion: "match is more expressive for Rust enum patterns",
        idiomatic: "match value { Some(x) => ..., None => ... }",
        category: "control-flow"
      });
    }

    // Option/Result combinators
    if (/\.map\(|\.filter\(|\.and_then/.test(code)) {
      patterns.push({
        name: "Use Option/Result combinators",
        regex: /\.map\(|\.filter\(|\.and_then\(|\.unwrap_or/,
        suggestion: "Combinators (map, filter, and_then) are idiomatic",
        idiomatic: "value.map(|x| x * 2).unwrap_or(0)",
        category: "functional"
      });
    }

    // Ownership and borrowing
    if (/&\w+|mut\s+\w+/.test(code)) {
      patterns.push({
        name: "Proper use of references and ownership",
        regex: /&.*,|mut\s+\w+\s*=/,
        suggestion: "Respect Rust's ownership model with proper borrowing",
        idiomatic: "fn process(s: &String) or fn process(&mut self)",
        category: "ownership"
      });
    }

    // Error handling with ?
    if (/\?\s*;|\.context\(/.test(code)) {
      patterns.push({
        name: "Use ? operator for error propagation",
        regex: /\?\s*;/,
        antiPattern: "match result { Ok(v) => v, Err(e) => return Err(e) }",
        suggestion: "? operator is idiomatic for error propagation",
        idiomatic: "let value = operation()?;",
        category: "error-handling"
      });
    }

    // Iterator methods
    if (/\.iter\(|\.map\(|\.collect\(/.test(code)) {
      patterns.push({
        name: "Use iterator adapters instead of loops",
        regex: /\.iter\(\)|\.map\(|\.filter\(|\.collect\(/,
        suggestion: "Iterator chains are more idiomatic than manual loops",
        idiomatic: "items.iter().map(|x| x * 2).collect()",
        category: "iteration"
      });
    }

    return patterns;
  }

  _analyzeJava(code) {
    const patterns = [];

    // Streams API vs loops
    if (/\.stream\(|\.map\(|\.filter\(/.test(code)) {
      patterns.push({
        name: "Use Stream API instead of loops",
        regex: /\.stream\(|\.map\(|\.filter\(|\.collect\(/,
        antiPattern: "for (Item item : items) { if (item.isValid()) ... }",
        suggestion: "Stream API is modern idiomatic Java",
        idiomatic: "items.stream().filter(Item::isValid).collect(toList())",
        category: "collections"
      });
    }

    // Optional instead of null checks
    if (/Optional\.|\.isPresent|\.ifPresent/.test(code)) {
      patterns.push({
        name: "Use Optional instead of null checks",
        regex: /Optional\.|\.isPresent\(\)|\.ifPresent\(/,
        antiPattern: "if (obj != null) { ... }",
        suggestion: "Optional makes null handling explicit and safe",
        idiomatic: "Optional.ofNullable(value).ifPresent(v -> ...)",
        category: "null-safety"
      });
    }

    // Try-with-resources
    if (/try\s*\(\s*\w+\s*=|\.close\(\)/.test(code)) {
      patterns.push({
        name: "Use try-with-resources for resource management",
        regex: /try\s*\(\s*\w+\s*=/,
        antiPattern: "try { ... } finally { resource.close(); }",
        suggestion: "try-with-resources auto-closes resources",
        idiomatic: "try (Resource r = new Resource()) { ... }",
        category: "resources"
      });
    }

    // Lambda expressions
    if (/\(.*\)\s*->|::/.test(code)) {
      patterns.push({
        name: "Use lambda expressions for functional interfaces",
        regex: /\(.*\)\s*->|::/,
        suggestion: "Lambdas are more concise than anonymous classes",
        idiomatic: "list.forEach(item -> System.out.println(item))",
        category: "functional"
      });
    }

    // Method references
    if (/::/.test(code)) {
      patterns.push({
        name: "Use method references for clarity",
        regex: /::/,
        suggestion: "Method references are cleaner than lambda wrappers",
        idiomatic: "items.forEach(System.out::println)",
        category: "functional"
      });
    }

    // Annotations for Spring/Lombok
    if (/@\w+\(|@Service|@Controller|@Data/.test(code)) {
      patterns.push({
        name: "Use annotations for dependency injection",
        regex: /@(Service|Component|Repository|Controller|Autowired)/,
        suggestion: "Annotations are idiomatic for Spring configuration",
        idiomatic: "@Service public class MyService { ... }",
        category: "spring"
      });
    }

    return patterns;
  }

  _analyzeJavaScript(code) {
    const patterns = [];

    // Arrow functions
    if (/=>|function\s*\(/.test(code)) {
      patterns.push({
        name: "Use arrow functions for conciseness",
        regex: /=>/,
        antiPattern: "items.map(function(x) { return x * 2; })",
        suggestion: "Arrow functions are more idiomatic in modern JS",
        idiomatic: "items.map(x => x * 2)",
        category: "functions"
      });
    }

    // Destructuring
    if (/\{.*\}\s*=|const\s*\[.*\]\s*=/.test(code)) {
      patterns.push({
        name: "Use destructuring for object/array unpacking",
        regex: /\{.*\}\s*=|const\s*\[.*\]\s*=/,
        antiPattern: "const name = obj.name; const age = obj.age;",
        suggestion: "Destructuring reduces boilerplate",
        idiomatic: "const { name, age } = obj",
        category: "syntax"
      });
    }

    // Template literals
    if (/`.*\$\{|'.*' \+|".*" \+/.test(code)) {
      patterns.push({
        name: "Use template literals for string interpolation",
        regex: /`.*\$\{/,
        antiPattern: "'Hello ' + name + ', age ' + age",
        suggestion: "Template literals are cleaner for string interpolation",
        idiomatic: "`Hello ${name}, age ${age}`",
        category: "strings"
      });
    }

    // Async/await over callbacks
    if (/async\s+\w+|await\s+/.test(code)) {
      patterns.push({
        name: "Use async/await instead of promises",
        regex: /async\s+\w+|await\s+/,
        antiPattern: ".then(result => { ... }).catch(err => { ... })",
        suggestion: "async/await is more readable than promise chains",
        idiomatic: "async function() { const result = await fetch(...); }",
        category: "async"
      });
    }

    // const/let instead of var
    if (/const\s+|let\s+/.test(code)) {
      patterns.push({
        name: "Use const/let instead of var",
        regex: /const\s+|let\s+/,
        antiPattern: "var x = 5;",
        suggestion: "const/let prevent scope issues and improve clarity",
        idiomatic: "const x = 5; let y = 10;",
        category: "scope"
      });
    }

    // Spread operator
    if (/\.\.\./. test(code)) {
      patterns.push({
        name: "Use spread operator for array/object operations",
        regex: /\.\.\./,
        antiPattern: "Object.assign({}, obj, newProps)",
        suggestion: "Spread operator is more readable",
        idiomatic: "{ ...obj, ...newProps }",
        category: "operators"
      });
    }

    return patterns;
  }

  _analyzeGo(code) {
    const patterns = [];

    // Error handling
    if (/if err != nil|if err == nil/.test(code)) {
      patterns.push({
        name: "Always check error returns",
        regex: /if err != nil|if err == nil/,
        suggestion: "Go idiom: errors are values that must be checked",
        idiomatic: "if err != nil { return err }",
        category: "error-handling"
      });
    }

    // Goroutines and channels
    if (/go\s+\w+|<-|->|chan\s+/.test(code)) {
      patterns.push({
        name: "Use goroutines and channels for concurrency",
        regex: /go\s+\w+|<-|->|chan\s+/,
        suggestion: "Goroutines and channels are idiomatic Go",
        idiomatic: "go func() { ... }() or ch := make(chan int)",
        category: "concurrency"
      });
    }

    // Interface usage
    if (/interface\s*\{|implements/.test(code)) {
      patterns.push({
        name: "Use interfaces for abstraction",
        regex: /interface\s*\{/,
        suggestion: "Interfaces enable polymorphism in Go",
        idiomatic: "type Reader interface { Read([]byte) (int, error) }",
        category: "abstractions"
      });
    }

    // Defer for cleanup
    if (/defer\s+/.test(code)) {
      patterns.push({
        name: "Use defer for resource cleanup",
        regex: /defer\s+/,
        suggestion: "defer ensures cleanup even if panic occurs",
        idiomatic: "defer file.Close()",
        category: "resources"
      });
    }

    return patterns;
  }

  _analyzeAPL(code) {
    const patterns = [];

    // Array operations instead of loops
    if (/:\s*For|:\s*While/.test(code)) {
      patterns.push({
        name: "Use array operations instead of explicit loops",
        regex: /:For\s+|:While\s+/,
        antiPattern: ":For i :In ⍳ ≢ array ... :EndFor",
        suggestion: "APL idiom: use array operations for elegance",
        idiomatic: "+/ array (sum) or ×/ array (product)",
        category: "array-programming"
      });
    }

    // Tacit programming
    if (/f\s*←\s*\w+.*\w+/.test(code)) {
      patterns.push({
        name: "Use tacit definitions for reusable functions",
        regex: /\w+\s*←\s*\+\/|←\s*×\//,
        suggestion: "Tacit definitions are concise and powerful",
        idiomatic: "avg ← +/ ÷ ≢",
        category: "functions"
      });
    }

    // Reduction and scan
    if (/\/|\\/.test(code)) {
      patterns.push({
        name: "Use reduction (/) and scan (\\) operators",
        regex: /\/|\\(?!n)/,
        suggestion: "/ and \\ are APL idioms for fold/reduce operations",
        idiomatic: "+/ array or +\\ array",
        category: "operators"
      });
    }

    return patterns;
  }

  _analyzeShell(code) {
    const patterns = [];

    // Command substitution
    if (/\$\(|`.*`/.test(code)) {
      patterns.push({
        name: "Use $(...) instead of backticks",
        regex: /\$\(/,
        antiPattern: "`command`",
        suggestion: "$(...) is more readable and nests better",
        idiomatic: "result=$(command)",
        category: "substitution"
      });
    }

    // Proper quoting
    if (/".*\$|'.*'/.test(code)) {
      patterns.push({
        name: "Use proper quoting to prevent word splitting",
        regex: /"\$|'.*'/,
        suggestion: 'Double quotes for variables: "$var", single for literals',
        idiomatic: 'echo "$filename"',
        category: "quoting"
      });
    }

    // Test conditions
    if (/if\s*\[|test\s+/.test(code)) {
      patterns.push({
        name: "Use test command with proper operators",
        regex: /if\s*\[|test\s+/,
        suggestion: "Use [ ] or test for idiomatic conditionals",
        idiomatic: "if [ -f $file ]; then ...; fi",
        category: "conditionals"
      });
    }

    return patterns;
  }

  _analyzePowerShell(code) {
    const patterns = [];

    // Cmdlets over functions
    if (/Get-|Set-|New-|Remove-/.test(code)) {
      patterns.push({
        name: "Use PowerShell cmdlets",
        regex: /Get-\w+|Set-\w+|New-\w+|Remove-\w+/,
        suggestion: "Cmdlets provide consistent interface and error handling",
        idiomatic: "Get-ChildItem, Set-Location, New-Item",
        category: "cmdlets"
      });
    }

    // Pipeline usage
    if (/\|/.test(code)) {
      patterns.push({
        name: "Use pipeline for object flow",
        regex: /\|\s*\w+-\w+/,
        suggestion: "PowerShell pipelines pass objects, not strings",
        idiomatic: "Get-Process | Where-Object { $_.CPU -gt 50 }",
        category: "pipeline"
      });
    }

    // Parameter validation
    if (/\[Parameter\]|param\s*\(/.test(code)) {
      patterns.push({
        name: "Use proper parameter declaration",
        regex: /\[Parameter\]|param\s*\(/,
        suggestion: "Parameter declarations enable validation and help",
        idiomatic: "[Parameter()][string]$Name",
        category: "functions"
      });
    }

    return patterns;
  }

  _analyzeGroovy(code) {
    const patterns = [];

    // Closures
    if (/\{.*->|\.each\s*\{|\.(map|filter)\s*\{/.test(code)) {
      patterns.push({
        name: "Use closures for callbacks",
        regex: /\{.*->|\.\w+\s*\{/,
        suggestion: "Closures are idiomatic Groovy for callbacks",
        idiomatic: "list.each { item -> println item }",
        category: "closures"
      });
    }

    // GString interpolation
    if (/".*\$\{|".*\$\w+/.test(code)) {
      patterns.push({
        name: "Use GString for string interpolation",
        regex: /".*\$\{/,
        suggestion: "GStrings are more readable than concatenation",
        idiomatic: '"Hello ${name}, you are ${age}"',
        category: "strings"
      });
    }

    // Collections methods
    if (/\.findAll|\.collect|\.groupBy/.test(code)) {
      patterns.push({
        name: "Use collection methods",
        regex: /\.findAll|\.collect|\.groupBy|\.inject/,
        suggestion: "Collection methods are more idiomatic than loops",
        idiomatic: "list.findAll { it > 5 }",
        category: "collections"
      });
    }

    return patterns;
  }

  _analyzeAutoIt(code) {
    const patterns = [];

    // WinAPI usage
    if (/WinGetHandle|WinActivate|ControlClick/.test(code)) {
      patterns.push({
        name: "Use AutoIt WinAPI functions",
        regex: /Win\w+|Control\w+/,
        suggestion: "WinAPI functions are idiomatic for automation",
        idiomatic: 'WinActivate("Window Title")',
        category: "winapi"
      });
    }

    // Error handling
    if (/@error|If.*@error/.test(code)) {
      patterns.push({
        name: "Check @error macros",
        regex: /@error/,
        suggestion: "Always check @error after API calls",
        idiomatic: "If @error Then ...",
        category: "error-handling"
      });
    }

    return patterns;
  }

  _analyzeYAML(code) {
    const patterns = [];

    // K8s resource structure
    if (/apiVersion:|kind:|metadata:|spec:/.test(code)) {
      patterns.push({
        name: "Use proper K8s resource structure",
        regex: /apiVersion:|kind:|metadata:|spec:/,
        suggestion: "K8s resources follow standard structure",
        idiomatic: "apiVersion: v1\nkind: Pod\nmetadata: ...",
        category: "structure"
      });
    }

    // Selectors
    if (/selector:|labels:/.test(code)) {
      patterns.push({
        name: "Use labels and selectors for organization",
        regex: /selector:|labels:/,
        suggestion: "Labels organize resources idiomatically",
        idiomatic: "labels:\n  app: myapp",
        category: "labels"
      });
    }

    return patterns;
  }

  _analyzeXML(code) {
    const patterns = [];

    // Maven POM structure
    if (/<project>|<dependencies>|<plugins>/.test(code)) {
      patterns.push({
        name: "Use proper Maven POM structure",
        regex: /<project>|<groupId>|<artifactId>|<version>/,
        suggestion: "Maven POMs follow standard structure",
        idiomatic: "<groupId>com.example</groupId>",
        category: "structure"
      });
    }

    return patterns;
  }

  _analyzeJenkins(code) {
    const patterns = [];

    // Pipeline syntax
    if (/pipeline\s*\{|stage\s*\(|steps\s*\{/.test(code)) {
      patterns.push({
        name: "Use declarative pipeline syntax",
        regex: /pipeline\s*\{|stage\s*\(|steps\s*\{/,
        suggestion: "Declarative pipelines are idiomatic",
        idiomatic: "pipeline { agent any stages { stage('Build') { ... }}}",
        category: "pipeline"
      });
    }

    // Environment variables
    if (/environment\s*\{|env\.BUILD_ID/.test(code)) {
      patterns.push({
        name: "Use environment blocks for variables",
        regex: /environment\s*\{|env\.\w+/,
        suggestion: "Environment blocks make variables explicit",
        idiomatic: "environment { BUILD_VERSION = '1.0' }",
        category: "variables"
      });
    }

    return patterns;
  }

  _analyzeSpringBoot(code) {
    const patterns = [];

    // Component scanning
    if (/@Component|@Service|@Repository|@Controller/.test(code)) {
      patterns.push({
        name: "Use component scanning annotations",
        regex: /@(Component|Service|Repository|Controller|RestController)/,
        suggestion: "Component annotations enable auto-discovery",
        idiomatic: "@Service public class MyService { ... }",
        category: "components"
      });
    }

    // Dependency injection
    if (/@Autowired|@Inject|private.*final/.test(code)) {
      patterns.push({
        name: "Use constructor injection over @Autowired",
        regex: /private\s+final\s+\w+\s+\w+;/,
        antiPattern: "@Autowired private SomeService service;",
        suggestion: "Constructor injection is more testable and explicit",
        idiomatic: "public MyClass(SomeService service) { ... }",
        category: "injection"
      });
    }

    // Properties over XML
    if (/application\.properties|application\.yml|@ConfigurationProperties/.test(code)) {
      patterns.push({
        name: "Use properties files and ConfigurationProperties",
        regex: /@ConfigurationProperties|application\./,
        suggestion: "Properties files are idiomatic for Spring config",
        idiomatic: "server.port=8080 in application.properties",
        category: "configuration"
      });
    }

    return patterns;
  }

  /**
   * Calculate severity based on idiomaticity score
   */
  _calculateSeverity(score) {
    if (score >= 90) return "error"; // Critical idiom
    if (score >= 70) return "warning"; // Important idiom
    return "information"; // Suggestion
  }

  /**
   * Generate rule ID from pattern name
   */
  _generateId(name) {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  /**
   * Get rules for a language
   */
  getRules(language) {
    return this.rules.get(language) || [];
  }

  /**
   * Get all rules
   */
  getAllRules() {
    const allRules = {};
    for (const [lang, rules] of this.rules) {
      allRules[lang] = rules;
    }
    return allRules;
  }
}

module.exports = { IdiomExtractor };
