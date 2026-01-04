# Smeagol VS Code Extension

**Intelligent Semantic Code Visualization with Kromatic Dark Theme**

Smeagol provides unified multi-language highlighting, scope visualization, and code structure insights with minimal performance overhead. Built specifically for polyglot developers working with Java, Rust, Python, JavaScript/TypeScript, and more.

## Features

### 🎨 Kromatic Dark Theme
- Dark professional theme with carefully crafted colors
- Based on IntelliJ's Kromatic theme
- Semantic token support for all major languages
- Optimized for extended coding sessions

### 🌈 Rainbow Highlights
- Automatic occurrence-based identifier highlighting
- Configurable color palette
- Smart token filtering (exclude keywords, operators, etc.)
- Respects minimum occurrence threshold
- Performance-optimized for large files

### 📊 Rainbow Indentation Guides
- Depth-based indentation visualization
- Three styles: indent markers, full-line shading, or both
- Configurable colors and opacity
- Language-aware indent size detection

### 🔤 Function & Class Visualization
- Rainbow coloring for function/class definitions
- Visual distinction between definitions and calls
- Optional full-line highlighting
- Per-language configuration

### 🏷️ HTML/XML Tag Coloring
- Rainbow tag colorization
- Delimiter opacity control
- Tagged template support for JS/TS (e.g., `html`...)
- Smart language detection

### 🆕 Bracket Pair Guides
- Automatic bracket pair detection and visualization
- Supports: `()`, `[]`, `{}`, `<>`
- Depth-based color assignment
- Three display modes: bracket-only, line-based, or both
- Configurable opacity and styling

### 🦀 Rust-Specific Highlighting
- **Macros**: Bold highlighting for `macro!()` invocations and attributes `#[...]`
- **Lifetimes**: Italic cyan highlighting for `'lifetime` parameters
- **Attributes**: Attribute visualization with consistent coloring
- **Trait Bounds**: Detection of `impl` and `trait` declarations
- **Generics**: Generic parameter `<T>` highlighting

### ☕ Java-Specific Highlighting
- **Annotations**: Bold yellow highlighting for `@AnnotationName`
- **Generics**: Cyan `<Type, AnotherType>` parameter visualization
- **Static Members**: Orange highlighting for `static` declarations
- **Interfaces**: Turquoise interface name coloring
- **Enums**: Magenta enum declaration highlighting

### 🎯 Other Supported Languages
- Python (keywords, decorators)
- Go (exported items, type references)
- C/C++ (type specifiers, qualifiers)
- And more via semantic token support

## Quick Start

1. Install from VS Code Extensions marketplace
2. Select "Kromatic Dark (Smeagol)" theme
3. Customize settings under `smeagol.*` as needed

```bash
code --install-extension alexa.smeagol-vscode
```

## Configuration

All settings are under the `smeagol.*` namespace. Access via:
- VS Code Settings UI (Cmd/Ctrl+,)
- JSON settings: `.vscode/settings.json`

### Essential Settings

```json
{
  "smeagol.enabled": true,
  "smeagol.highlights.enabled": true,
  "smeagol.indent.enabled": true,
  "smeagol.brackets.enabled": true,
  "smeagol.rust.enabled": true,
  "smeagol.java.enabled": true
}
```

### Highlights Configuration
```json
{
  "smeagol.highlights.minOccurrences": 2,
  "smeagol.highlights.minLength": 2,
  "smeagol.highlights.maxTokens": 120,
  "smeagol.highlights.backgroundOpacity": 0.16,
  "smeagol.highlights.borderWidth": 1
}
```

### Indentation Configuration
```json
{
  "smeagol.indent.style": "both",  // "indent" | "line" | "both"
  "smeagol.indent.indentOpacity": 0.18,
  "smeagol.indent.lineOpacity": 0.08
}
```

### Bracket Guides Configuration
```json
{
  "smeagol.brackets.style": "bracket",  // "bracket" | "line" | "both"
  "smeagol.brackets.lineWidth": 1,
  "smeagol.brackets.lineOpacity": 0.5
}
```

See [full configuration reference](#configuration-reference) below for all options.

## Architecture

### Modular Design
- **_model.js**: Data models (TokenHighlight, BracketPair, SemanticToken, FunctionDefinition)
- **_constants.js**: All constants (color palettes, keywords, regex patterns)
- **_api.js**: VS Code API abstractions
- **highlights.js**: Identifier highlighting engine
- **indent.js**: Indentation visualization
- **functions.js**: Function/class highlighting
- **html.js**: HTML/XML tag coloring
- **brackets.js**: Bracket pair guides
- **rust-highlighter.js**: Rust semantic highlighting
- **java-highlighter.js**: Java semantic highlighting

### Language-Specific Modules

#### RustHighlighter
Detects and colors:
- Macros: `identifier!` or `#[macro]`
- Lifetimes: `'lifetime`
- Traits: `impl Trait` and `trait Definition`
- Generics: `<T, U, V>`

#### JavaHighlighter
Detects and colors:
- Annotations: `@Annotation`
- Generics: `<TypeParam>`
- Static members: `static field/method`
- Interfaces and enums

## Performance

Optimized for large files and extended sessions:

- **Debounce**: Configurable 120ms refresh delay prevents excessive updates
- **File size limits**: Skips highlighting for files >400KB or >10,000 lines
- **Parallel execution**: All managers update concurrently
- **Efficient regex**: Patterns compiled once and reused

Configuration:
```json
{
  "smeagol.performance.refreshDelayMs": 120,
  "smeagol.performance.maxDocumentLength": 400000,
  "smeagol.performance.maxLineCount": 10000
}
```

## IntelliJ Integration

Perfect complement to IntelliJ IDEA's Kromatic theme:
- Identical color palette for consistency
- Bracket coloring matches IntelliJ's rainbow pairs
- Java/Rust highlighting compatible with IntelliJ semantics
- Unified look across IDE ecosystem

## Development

### Building

```powershell
npm install
npm run package:vsix
```

### Testing

Press F5 in VS Code to launch Extension Development Host with debugging enabled.

### Project Structure

```
smeagol-vscode/
├── src/
│   ├── _api.js              # VS Code API wrappers
│   ├── _constants.js        # Consolidated constants
│   ├── _model.js            # Shared data models
│   ├── brackets.js          # Bracket pair guides
│   ├── config.js            # Configuration loader
│   ├── extension.js         # Main entry point
│   ├── functions.js         # Function highlighting
│   ├── highlights.js        # Identifier highlighting
│   ├── html.js              # HTML tag coloring
│   ├── indent.js            # Indentation guides
│   ├── java-highlighter.js  # Java semantic highlighting
│   ├── rust-highlighter.js  # Rust semantic highlighting
│   └── utils.js             # Utility functions
├── themes/
│   └── smeagol-dark-color-theme.json
├── package.json             # Extension manifest
└── README.md
```

## Configuration Reference

### Global

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `smeagol.enabled` | boolean | true | Enable all Smeagol features |
| `smeagol.performance.refreshDelayMs` | number | 120 | Debounce delay in milliseconds |
| `smeagol.performance.maxDocumentLength` | number | 400000 | Skip files larger than this |
| `smeagol.performance.maxLineCount` | number | 10000 | Skip files with more lines |

### Highlights

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `smeagol.highlights.enabled` | boolean | true | Enable identifier highlighting |
| `smeagol.highlights.colors` | array | [palette] | Color palette for highlights |
| `smeagol.highlights.minOccurrences` | number | 2 | Min occurrences to highlight |
| `smeagol.highlights.minLength` | number | 2 | Min token length to highlight |
| `smeagol.highlights.maxTokens` | number | 120 | Max unique tokens per editor |
| `smeagol.highlights.backgroundOpacity` | number | 0.16 | Background opacity (0-1) |
| `smeagol.highlights.borderOpacity` | number | 0.65 | Border opacity (0-1) |
| `smeagol.highlights.borderWidth` | number | 1 | Border width in pixels |
| `smeagol.highlights.exclude` | array | [keywords] | Tokens never to highlight |
| `smeagol.highlights.ignoreLanguages` | array | [] | Language IDs to skip |

### Indentation

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `smeagol.indent.enabled` | boolean | true | Enable indent guides |
| `smeagol.indent.colors` | array | [palette] | Color palette |
| `smeagol.indent.style` | string | "both" | "indent", "line", or "both" |
| `smeagol.indent.indentOpacity` | number | 0.18 | Indent block opacity |
| `smeagol.indent.lineOpacity` | number | 0.08 | Full-line opacity |

### Functions

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `smeagol.functions.enabled` | boolean | true | Enable function highlighting |
| `smeagol.functions.highlightStyle` | string | "line" | "line" or "name" |
| `smeagol.functions.requireDefinitionAndCall` | boolean | true | Require definition + call |
| `smeagol.functions.minOccurrences` | number | 2 | Min occurrences |
| `smeagol.functions.maxSymbols` | number | 200 | Max symbols per file |

### HTML/XML

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `smeagol.html.enabled` | boolean | true | Enable HTML tag coloring |
| `smeagol.html.delimiterOpacity` | number | 0.7 | Delimiter opacity |
| `smeagol.html.includeLanguages` | array | [...] | Languages to enable for |

### Brackets

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `smeagol.brackets.enabled` | boolean | true | Enable bracket guides |
| `smeagol.brackets.style` | string | "bracket" | "bracket", "line", or "both" |
| `smeagol.brackets.lineWidth` | number | 1 | Border width in pixels |
| `smeagol.brackets.lineOpacity` | number | 0.5 | Border opacity (0-1) |

### Language-Specific

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `smeagol.rust.enabled` | boolean | true | Enable Rust highlighting |
| `smeagol.java.enabled` | boolean | true | Enable Java highlighting |

## Known Limitations

- Bracket detection uses greedy matching (may match in comments)
- Language detection based on file extension
- Large files have reduced highlight accuracy
- Some regex patterns may not handle all edge cases

## Roadmap

See [FUTURE.md](FUTURE.md) for planned features:
- Enhanced semantic token type awareness
- Code complexity indicators
- Light theme variant
- Accessibility modes
- Performance metrics dashboard

## Security

- Uses only VS Code APIs and local document text
- No network requests or child processes
- No telemetry or data collection
- See SECURITY.md for detailed audit

## License

MIT

## Author

Alex Alvonellos  
[@alvonellos](https://github.com/alvonellos)

---

**Enjoy intelligent code visualization with Smeagol!** 🧙‍♂️
