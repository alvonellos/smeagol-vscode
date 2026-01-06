# Contributing to Smeagol

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

### Prerequisites
- Node.js 16+
- VS Code 1.80+
- Git

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/alvonellos/smeagol-vscode.git
cd smeagol-vscode

# Install dependencies
npm install

# Open in VS Code for development
code .

# Or use the included debug configuration
# Press F5 to start debugging
```

## Project Structure

```
smeagol-vscode/
├── src/
│   ├── extension.js                 # Main extension file
│   ├── complexity-analyzer.js       # Core analysis engine
│   ├── config-loader.js             # Configuration management
│   ├── *-completion.js              # Language-specific completions (17 files)
│   ├── *-highlighter.js             # Syntax highlighting (5+ files)
│   ├── idioms-analyzer.js           # Non-idiomatic pattern detection
│   ├── symbol-summoner.js           # Code summarization
│   └── ... (30+ more modules)
├── docs/
│   ├── API.md                       # API reference
│   ├── CONFIGURATION.md             # Config guide
│   ├── ARCHITECTURE.md              # System design
│   └── ... (more guides)
├── themes/
│   └── smeagol-dark-color-theme.json
├── .smeagol/
│   └── config.json                  # Default configuration
├── test-*.* files                   # Test files for each language
├── package.json
└── README.md                        # Main documentation
```

## How to Contribute

### Adding a New Language Provider

1. **Create the provider file**:
   ```javascript
   // src/mylang-completion.js
   const vscode = require("vscode");
   const { CompletionCache } = require("./completion-cache");

   class MyLangCompletionProvider {
     constructor() {
       this.completionItems = [];
       this.cache = new CompletionCache(300, 5 * 60 * 1000);
       this.initialize();
     }

     initialize() {
       this.completionItems = [
         new vscode.CompletionItem("keyword1", vscode.CompletionItemKind.Keyword),
         // ... more items
       ];
     }

     provideCompletionItems(document, position, token) {
       const line = document.lineAt(position.line).text;
       return this.filterByContext(document, position, line) || this.completionItems;
     }

     filterByContext(document, position, line) {
       // Return filtered items or null
       return null;
     }
   }

   module.exports = { MyLangCompletionProvider };
   ```

2. **Register in extension.js**:
   ```javascript
   // Add import
   const { MyLangCompletionProvider } = require("./mylang-completion");

   // Add instantiation in constructor
   this.mylangCompletionProvider = new MyLangCompletionProvider();

   // Add registration in start() method
   vscode.languages.registerCompletionItemProvider(
     { language: 'mylang', scheme: 'file' },
     this.mylangCompletionProvider,
     'a', 'b', 'c', // trigger characters
   )
   ```

3. **Create test file**:
   ```
   test-mylang.ml
   
   Contains examples showcasing completions
   ```

4. **Document**:
   - Update README.md with language
   - Add items count and features

### Adding a New Syntax Highlighter

1. **Create highlighter file**:
   ```javascript
   // src/mylang-highlighter.js
   const vscode = require("vscode");

   class MyLangHighlighter {
     constructor() {
       this.decorationTypes = [];
     }

     update(editors, config) {
       editors.forEach(editor => this.applyHighlighting(editor, config));
     }

     applyHighlighting(editor, config) {
       // Use regex patterns to find elements
       // Create decorations
       // Apply to editor
     }
   }

   module.exports = { MyLangHighlighter };
   ```

2. **Register in extension.js**:
   ```javascript
   this.mylangHighlighter = new MyLangHighlighter();
   
   // In start() method:
   this.mylangHighlighter.update(vscode.window.visibleTextEditors, config);
   ```

## Code Quality Standards

See [CODING_STANDARDS.md](./docs/CODING_STANDARDS.md) for detailed requirements.

### Quick Checklist
- [ ] Use `"use strict";` at file start
- [ ] Document with JSDoc comments
- [ ] Handle errors gracefully
- [ ] Validate user input
- [ ] Use pre-compiled regex patterns
- [ ] Clean up resources (dispose, close watchers)
- [ ] No external dependencies without approval
- [ ] Test with multiple file sizes

## Testing

### Manual Testing
```bash
# Press F5 in VS Code to start debug session
# Open test files:
# - test-complexity.py
# - test-complexity.js
# - test-patterns.js

# Save each and check Problems panel
```

### Automated Tests
```bash
# Run test suite
node test-new-providers.js

# Check syntax
node -c src/extension.js

# Lint (if configured)
npm run lint
```

### Performance Testing
```bash
# Check memory usage
node --expose-gc test-performance.js

# Profile a large file
time node -c src/large-file.js
```

## Git Workflow

### Branching
```bash
# Create feature branch
git checkout -b feature/new-language-support

# Make commits
git add .
git commit -m "feat: add Kotlin completions (100+ items)"

# Push
git push origin feature/new-language-support
```

### Commit Messages
```
feat: add new feature
fix: resolve issue  
docs: update documentation
perf: improve performance
refactor: restructure code
test: add tests
```

### Pull Requests
1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests if applicable
5. Update documentation
6. Submit PR with description

## Building & Packaging

### Build VSIX Package
```bash
npm run package:vsix
# Creates: smeagol-vscode.vsix
```

### Install Locally
```bash
code --install-extension smeagol-vscode.vsix
```

### Version Bumping
Update version in `package.json`:
```json
{
  "version": "0.2.4"
}
```

## Documentation

### Adding Documentation
1. Create `.md` file in `docs/`
2. Use clear markdown formatting
3. Include code examples
4. Add table of contents for long docs
5. Link from main README

### Example Structure
```markdown
# Feature Title

## Overview
Brief description

## Quick Start
Code example

## Detailed Guide
Full explanation

## API Reference
If applicable

## Examples
Real-world usage

## Troubleshooting
Common issues
```

## Coding Practices

### Pattern: Completion Provider
```javascript
class LanguageCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.cache = new CompletionCache(300, 5 * 60 * 1000);
    this.initialize();
  }

  initialize() {
    try {
      this.completionItems = [ /* items */ ];
    } catch (error) {
      console.warn("Error:", error.message);
      this.completionItems = [];
    }
  }

  provideCompletionItems(document, position, token) {
    const line = document.lineAt(position.line).text;
    const filtered = this.filterByContext(document, position, line);
    return filtered || this.completionItems;
  }

  filterByContext(document, position, line) {
    // Custom logic
    return null;
  }

  reset() {
    this.completionItems = [];
    this.cache.clear();
  }

  dispose() {
    this.reset();
  }
}
```

### Pattern: Configuration Integration
```javascript
constructor(workspaceRoot) {
  this.configLoader = new ConfigLoader();
  if (workspaceRoot) {
    this.configLoader.loadConfig(workspaceRoot);
    this.configWatcher = this.configLoader.watchConfig(() => {
      // Config changed, update behavior
    });
  }
}

dispose() {
  if (this.configWatcher) this.configWatcher();
  this.configLoader.closeWatchers();
}
```

## Performance Guidelines

- ✅ Pre-compile regex patterns at module load
- ✅ Cache analysis results (5 min TTL default)
- ✅ Use debouncing for user input (100ms default)
- ✅ Validate file size before analysis (skip >10MB)
- ❌ Don't do synchronous I/O on hot paths
- ❌ Don't reload configuration on every keystroke

## Reporting Issues

### Bug Report Template
```
### Description
Clear description of the bug

### Steps to Reproduce
1. Open file
2. Perform action
3. Observe issue

### Expected Behavior
What should happen

### Actual Behavior
What happens instead

### Environment
- VS Code version
- Smeagol version
- File type
- Configuration (if relevant)
```

## Feature Requests

When requesting features:
1. **Describe the use case**: Why is this needed?
2. **Provide examples**: Show how it would work
3. **Suggest implementation**: Any ideas?
4. **Check existing issues**: Avoid duplicates

## Communication

- **Issues**: Bug reports and feature requests
- **Discussions**: Questions and general topics
- **GitHub**: Main communication channel

## Code Review Checklist

Before submitting PR:
- [ ] Code follows style guide
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No console errors
- [ ] Performance acceptable
- [ ] No breaking changes
- [ ] Commit messages clear

## Getting Help

- Check [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
- Read [API.md](./docs/API.md)
- Review existing code in `src/`
- Open a discussion

---

**Thank you for contributing to Smeagol!** ❤️
