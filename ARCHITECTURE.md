# Smeagol Extension - Architecture & Developer Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              VS Code Extension Host                          │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│           SmeagolController (extension.js)                   │
│   Central orchestrator for all features                      │
└────────────────┬────────────────────────────────────────────┘
                 │
    ┌────────────┼────────────────┬──────────────┬─────────────┐
    │            │                │              │             │
    ▼            ▼                ▼              ▼             ▼
┌────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────┐
│Highlight│ │IndentMgr │ │FunctionMgr   │ │BracketGuides │ │HtmlMgr │
│Manager  │ │          │ │              │ │Manager       │ │        │
└────────┘ └──────────┘ └──────────────┘ └──────────────┘ └────────┘
    │            │                │              │             │
    └────────────┼────────────────┴──────────────┴─────────────┘
                 │
                 │ Visual Features
                 │
    ┌────────────┼─────────────────┐
    │            │                 │
    ▼            ▼                 ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│Language      │ │Language      │ │AutoIt        │
│Highlighters  │ │Highlighters  │ │Highlighter   │
│(Rust, Java,  │ │(C++, AutoIt) │ │(90+ funcs)   │
│ C++, AutoIt) │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
    │            │                 │
    └────────────┼─────────────────┘
                 │
                 │ Completion Providers
                 │
    ┌────────────┴──────────────────────────────────────────┐
    │                                                        │
    ▼                                                        ▼
┌──────────────────────────────────────┐  ┌────────────────────┐
│ Language-Specific Completion         │  │ AI Helpers Module  │
│ Providers (9 providers)              │  │ (6 commands)       │
│                                      │  │                    │
│ ├─ PythonCompletionProvider         │  │ ├─ Generate Code  │
│ ├─ RustCompletionProvider           │  │ ├─ Generate Docs  │
│ ├─ LombokCompletionProvider         │  │ ├─ Generate Tests │
│ ├─ SpringBootCompletionProvider     │  │ ├─ Explain Code   │
│ ├─ KubernetesCompletionProvider     │  │ ├─ Refactor      │
│ ├─ ShellCompletionProvider          │  │ └─ Optimize      │
│ ├─ PowerShellCompletionProvider     │  │                    │
│ ├─ MavenCompletionProvider          │  └────────────────────┘
│ ├─ GroovyCompletionProvider         │
│ ├─ JenkinsCompletionProvider        │
│ └─ AutoItCompletionProvider         │
│                                      │
└──────────────────────────────────────┘
```

---

## Module Breakdown

### Core Managers (extension.js)

#### HighlightManager
- **Purpose**: Multi-identifier semantic highlighting
- **Inputs**: Active editor, document text
- **Outputs**: Decoration ranges with colors
- **Performance**: <50ms per document

#### IndentManager
- **Purpose**: Indent guide visualization
- **Inputs**: Editor content, indent size
- **Outputs**: Indent guides with colors
- **Features**: Rainbow colors by depth

#### FunctionManager
- **Purpose**: Function and class highlighting
- **Inputs**: Code tokens, regex patterns
- **Outputs**: Colored function declarations
- **Supported**: All languages

#### BracketGuidesManager
- **Purpose**: Bracket pair depth visualization
- **Inputs**: Bracket tokens, nesting depth
- **Outputs**: Colored bracket guides
- **Colors**: LGBT pride 6-color spectrum

#### HtmlManager
- **Purpose**: HTML/template rendering
- **Inputs**: HTML content
- **Outputs**: Rendered preview
- **Features**: Safe HTML sanitization

---

### Language Highlighters

#### RustHighlighter
- **File**: `rust-highlighter.js`
- **Features**: Macros, lifetimes, attributes, traits
- **Colors**: Kromatic theme aligned
- **Tokens**: ~20+ pattern types

#### JavaHighlighter
- **File**: `java-highlighter.js`
- **Features**: Annotations, generics, static members
- **Colors**: Kromatic theme aligned
- **Tokens**: ~20+ pattern types

#### CppHighlighter
- **File**: `cpp-highlighter.js`
- **Features**: Pointers, macros, namespaces, templates
- **Colors**: Kromatic theme aligned
- **Tokens**: ~20+ pattern types

#### AutoItHighlighter
- **File**: `autoit-highlighter.js`
- **Features**: 150+ functions, 50+ macros
- **Colors**: Kromatic theme aligned
- **Tokens**: ~200+ pattern types

---

### Completion Providers

Each provider follows this interface:

```javascript
class LanguageCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.initialize();
  }

  initialize() {
    // Build completionItems array with vscode.CompletionItem objects
    const completions = [
      {
        label: "item",
        kind: vscode.CompletionItemKind.Function,
        detail: "signature",
        doc: "markdown documentation"
      },
      // ... more items
    ];

    completions.forEach(comp => {
      const item = new vscode.CompletionItem(comp.label, comp.kind);
      item.detail = comp.detail;
      if (comp.doc) {
        item.documentation = new vscode.MarkdownString(comp.doc);
      }
      this.completionItems.push(item);
    });
  }

  provideCompletionItems(document, position, token, context) {
    return this.completionItems;
  }

  resolveCompletionItem(item, token) {
    return item; // Can enrich item here
  }
}
```

#### Provider List

| Provider | File | Items | Languages |
|----------|------|-------|-----------|
| Python | `python-completion.js` | 50+ | python |
| Spring Boot | `spring-kubernetes-completion.js` | 50+ | java |
| Kubernetes | `spring-kubernetes-completion.js` | 40+ | yaml |
| Shell | `shell-powershell-completion.js` | 40+ | shell |
| PowerShell | `shell-powershell-completion.js` | 40+ | powershell |
| Maven | `maven-groovy-jenkins-completion.js` | 30+ | xml |
| Groovy | `maven-groovy-jenkins-completion.js` | 30+ | groovy |
| Jenkins | `maven-groovy-jenkins-completion.js` | 30+ | groovy |
| Rust | `rust-completion.js` | 40+ | rust |
| Lombok | `lombok-completion.js` | 25+ | java |
| AutoIt | `autoit-completion.js` | 90+ | autoit |

---

### AI Helpers Module (ai-helpers.js)

```javascript
class AiHelpersModule {
  // 6 Commands:
  generateBoilerplate()    // Template generation
  generateDocumentation()  // Doc insertion
  generateTests()          // Test skeleton
  explainCode()           // Code analysis
  refactorCode()          // Refactoring suggestions
  optimizeCode()          // Performance tips
}
```

**Features:**
- Language-aware template generation
- Documentation format per language
- Test framework selection
- Code analysis with webview panel
- Refactoring strategy picker
- Performance optimization suggestions

---

## Data Flow

### Completion Flow
```
User Types Character
    ↓
VS Code triggers completion
    ↓
VS Code checks registered providers for language
    ↓
Provider.provideCompletionItems() called
    ↓
Returns vscode.CompletionItem[] array
    ↓
VS Code displays suggestions
    ↓
User selects item
    ↓
Provider.resolveCompletionItem() called (optional enrichment)
    ↓
Completion inserted into editor
```

### Highlighting Flow
```
Document changes
    ↓
scheduleUpdate() called (debounced)
    ↓
updateAll() executes
    ↓
HighlightManager.scan() processes tokens
    ↓
IndentManager.scan() processes indents
    ↓
LanguageHighlighters.scan() process language-specific patterns
    ↓
BracketGuidesManager.scan() processes bracket pairs
    ↓
Decorations applied to editor
    ↓
Visual update with colors
```

---

## Color System

### Kromatic Official Theme
```javascript
const KROMATIC_PALETTE = {
  gold: "#facd45",      // Macros, annotations, constants
  cyan: "#00c7ff",      // Variables, numbers, generics
  orange: "#ffc66d",    // Functions, attributes, static
  turquoise: "#00ffd9", // Classes, interfaces, traits
  magenta: "#ff006f",   // Keywords, operators
  purple: "#bb00ff",    // Escapes, enums, directives
  green: "#00e71c",     // Strings
  gray: "#888888"       // Comments
};
```

### Pride Bracket Colors
```javascript
const PRIDE_COLORS = [
  "#ff0000",  // Red (depth 1)
  "#ff7f00",  // Orange (depth 2)
  "#ffff00",  // Yellow (depth 3)
  "#00ff00",  // Green (depth 4)
  "#0000ff",  // Blue (depth 5)
  "#4b0082"   // Indigo (depth 6+)
];
```

---

## Performance Characteristics

### Metrics
- **Completion trigger latency**: <50ms
- **Document highlight latency**: <100ms
- **VSIX size**: 74.94 KB
- **Memory per editor**: ~5-10 MB
- **Debounce delay**: 120ms (configurable)

### Optimizations
1. **Lazy initialization** - Providers instantiated on demand
2. **Debounced updates** - Changes delayed by 120ms
3. **Max document size** - Skip files >400KB
4. **Max line count** - Skip files >10,000 lines
5. **Token limiting** - Max 120 highlighted tokens
6. **Incremental rendering** - Only update changed ranges

---

## File Structure

```
smeagol-vscode/
├── src/
│   ├── extension.js              # Main entry point (6 KB)
│   ├── config.js                 # Configuration (4 KB)
│   ├── constants.js              # Color palettes (3 KB)
│   ├── functions.js              # Function highlight (3 KB)
│   ├── highlights.js             # Semantic highlighting (5 KB)
│   ├── indent.js                 # Indent guides (4 KB)
│   ├── html.js                   # HTML rendering (3 KB)
│   ├── utils.js                  # Utilities (7 KB)
│   ├── brackets.js               # Bracket guides (5 KB)
│   │
│   ├── Highlighters/
│   ├── rust-highlighter.js       # Rust specific (5 KB)
│   ├── java-highlighter.js       # Java specific (5 KB)
│   ├── cpp-highlighter.js        # C++ specific (5 KB)
│   ├── autoit-highlighter.js     # AutoIt specific (19 KB)
│   │
│   ├── Completion Providers/
│   ├── python-completion.js      # Python (18 KB)
│   ├── spring-kubernetes-...js   # Spring+K8s (25 KB)
│   ├── shell-powershell-...js    # Shell+PS (16 KB)
│   ├── maven-groovy-jenkins...js # Maven+Groovy+Jenkins (22 KB)
│   ├── rust-completion.js        # Rust (16 KB)
│   ├── lombok-completion.js      # Lombok (12 KB)
│   ├── autoit-completion.js      # AutoIt (19 KB)
│   │
│   └── ai-helpers.js             # AI commands (22 KB)
│
├── themes/
│   └── kromatic-dark-color-theme.json  # Theme (9 KB)
│
├── scripts/
│   └── package.ps1               # Build script
│
├── Docs/
│   ├── README.md                 # Overview
│   ├── COMPREHENSIVE_FEATURES.md # Full guide
│   ├── COMPLETION_REFERENCE.md   # Language reference
│   ├── DEPLOYMENT_SUMMARY.md     # Technical summary
│   ├── QUICK_START.md            # Installation guide
│   ├── FUTURE.md                 # Future plans
│   ├── SECURITY.md               # Security policy
│   └── MIGRATION_SUMMARY.md      # Migration notes
│
├── package.json                  # npm manifest
├── smeagol-vscode.vsix          # Built extension (74.94 KB)
└── .gitignore, .git/            # Version control
```

---

## Adding New Language Support

### Steps to Add Language

1. **Create Provider File**
   ```javascript
   // src/new-language-completion.js
   const vscode = require("vscode");

   class NewLanguageCompletionProvider {
     constructor() {
       this.completionItems = [];
       this.initialize();
     }

     initialize() {
       // Add items here
       this.completionItems.push(
         new vscode.CompletionItem("keyword", vscode.CompletionItemKind.Keyword)
       );
     }

     provideCompletionItems(document, position, token, context) {
       return this.completionItems;
     }

     resolveCompletionItem(item, token) {
       return item;
     }
   }

   module.exports = { NewLanguageCompletionProvider };
   ```

2. **Register in extension.js**
   ```javascript
   // Import
   const { NewLanguageCompletionProvider } = require("./new-language-completion");

   // In constructor
   this.newLanguageProvider = new NewLanguageCompletionProvider();

   // In start()
   vscode.languages.registerCompletionItemProvider(
     { language: 'newlang', scheme: 'file' },
     this.newLanguageProvider,
     'a', 'b', 'c' // trigger characters
   )
   ```

3. **Test**
   - Create `.newlang` file
   - Type trigger characters
   - Verify completions appear

4. **Commit**
   ```bash
   git add -A
   git commit -m "feat: add NewLanguage completion provider"
   ```

5. **Build**
   ```bash
   npm run package:vsix
   ```

---

## Testing Strategy

### Unit Testing (Recommended for Future)
```javascript
// test/providers.test.js
const assert = require('assert');
const { PythonCompletionProvider } = require('../src/python-completion');

describe('PythonCompletionProvider', () => {
  it('should provide print() completion', () => {
    const provider = new PythonCompletionProvider();
    const items = provider.provideCompletionItems(null, null, null, null);
    assert(items.some(item => item.label === 'print'));
  });
});
```

### Manual Testing Checklist
- [ ] Extension loads without errors
- [ ] Completions trigger for each language
- [ ] Documentation appears on hover
- [ ] AI commands execute successfully
- [ ] Theme applies correctly
- [ ] Bracket guides render with colors
- [ ] No console errors (F12)
- [ ] Performance is acceptable
- [ ] VSIX builds successfully

---

## Debugging

### Enable Debug Mode
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Extension",
      "type": "extensionHost",
      "request": "launch",
      "args": ["--extensionDevelopmentPath=${workspaceFolder}"],
      "outFiles": ["${workspaceFolder}/out/**/*.js"]
    }
  ]
}
```

### View Logs
```javascript
// In any module
console.log("Debug message"); // F12 → Output panel
```

### Common Issues
1. **Completions not showing** → Check language registration
2. **Colors not applying** → Verify Kromatic theme selected
3. **Slow performance** → Reduce maxTokens or refreshDelayMs
4. **AI commands fail** → Check for syntax errors in ai-helpers.js

---

## Building & Deployment

### Build VSIX
```bash
npm run package:vsix
```

### Publish to Marketplace
```bash
# Requires publisher account
vsce publish --pat <personal-access-token>
```

### Manual Installation
```bash
code --install-extension smeagol-vscode.vsix
```

---

## Future Enhancements

### High Priority
- [ ] TypeScript completions
- [ ] Go language support
- [ ] Lua completions
- [ ] Integration with Copilot Chat

### Medium Priority
- [ ] Unit test framework
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Language server protocol (LSP) support
- [ ] Snippet suggestions

### Low Priority
- [ ] Custom AI model integration
- [ ] Code smell detection
- [ ] Security vulnerability scanning
- [ ] Performance profiling

---

## Contributing Guidelines

### Code Style
- Use consistent indentation (2 spaces)
- Follow camelCase for variables
- Use descriptive names
- Add comments for complex logic

### Commit Messages
```
feat: add new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code reorganization
perf: performance improvement
```

### Pull Request Process
1. Fork repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes with clear messages
4. Push to branch
5. Create Pull Request with description

---

## Resources

### Documentation
- [VS Code Extension API](https://code.visualstudio.com/api)
- [IntelliJ Kromatic Theme](https://plugins.jetbrains.com/plugin/15676-kromatic)
- [VS Code Color Customization](https://code.visualstudio.com/api/references/theme-color)

### Tools
- [VSCE](https://github.com/microsoft/vscode-vsce) - Packaging tool
- [yo code](https://github.com/microsoft/vscode-generator-code) - Generator

### Community
- [VS Code Extension Forum](https://github.com/microsoft/vscode/discussions)
- [GitHub Issues](https://github.com/alvonellos/smeagol-vscode/issues)

---

**Made with ❤️ for developers**

*The precious IDE just got more precise!* ✨
