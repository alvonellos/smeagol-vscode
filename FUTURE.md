# Smeagol VS Code Extension - Future Development

## Current Features
- **Kromatic Dark Theme** - Base dark theme with semantic highlighting
- **Rainbow Highlights** - Automatic multi-identifier highlighting with configurable color palette
- **Indent Guides** - Visual indent level representation
- **Function Markers** - Function/method visualization
- **HTML Tag Colorization** - Colorized HTML/XML tags

## Installed Extension Analysis & Overlap Detection

### 1. **Highlighting & Visualization Overlaps**

#### Extensions with Overlapping Functionality:
- **`cobaltblu27.rainbow-highlighter`** - Rainbow highlighting
  - **Overlap**: Both highlight identifiers/syntax in rainbow colors
  - **Unique to Smeagol**: Automatic occurrence-based highlighting (highlights all instances of selected identifier)
  - **Recommendation**: Differentiate by focusing on smart semantic highlighting

- **`gabrielgod1.indent-rainbow-blocks`** - Rainbow indent guides
  - **Overlap**: Both colorize indentation
  - **Unique to Smeagol**: Integrated with theme, configurable via settings
  - **Recommendation**: Ensure Smeagol's indent coloring is superior/complementary

- **`thertzlor.semantic-rainbow`** - Semantic color highlighting
  - **Overlap**: Token-based coloring
  - **Unique to Smeagol**: Occurrence counting, min/max token limits
  - **Recommendation**: Could add semantic token type awareness

- **`nizmosis.rainbow-functions`** - Function bracket/scope highlighting
  - **Overlap**: Function visualization
  - **Unique to Smeagol**: Function marker visualization
  - **Recommendation**: Consider adding function scope brackets coloring

- **`wumbl3.rainbow-html`** - Rainbow HTML tag coloring
  - **Overlap**: HTML/XML tag colorization
  - **Unique to Smeagol**: Integrated HTML manager in extension
  - **Recommendation**: Ensure HTML coloring is consistent with theme

#### Non-Overlapping Visualization Tools:
- `eclipse-cdt.memory-inspector` - Memory inspection (embedded systems)
- `mcu-debug.memory-view` - Memory debugging
- `mcu-debug.peripheral-viewer` - Peripheral inspection
- `mcu-debug.rtos-views` - RTOS task views
- `evgeniypeshkov.syntax-highlighter` - Custom syntax highlighting
- `mathworks.language-matlab` - MATLAB-specific

### 2. **Theme Overlaps**

#### Extensions with Theme Functionality:
- **`quzma.vscode-kroma`** - Kroma theme collection
  - **Overlap**: Kromatic Dark is similar color palette
  - **Recommendation**: Consider merging or differentiating theme

- **`gerane.theme-rainbow`** - Rainbow theme
- **`darkrainbow.darkrainbow`** - Dark rainbow theme
  - **Overlap**: Dark theme with rainbow elements
  - **Recommendation**: Position Smeagol as "theme + smart highlighting" not just theme

### 3. **Rust-Specific Overlaps** (Rust project context detected)

#### Rust Language Tools:
- **`rust-lang.rust-analyzer`** (PRIMARY) - Official Rust language server
- **`1yib.rust-bundle`** - Rust bundle (includes analyzer)
- **`jrobsonchase.rust-extension-pack`** - Rust extension pack
- **`swellaby.rust-pack`** - Rust pack
- **`nyxiative.rust-and-friends`** - Rust and friends
- Multiple Rust syntax/grammar packs

**Recommendation for Smeagol**: Consider Rust-specific semantic highlighting to complement rust-analyzer

### 4. **Testing & Debugging Overlaps**

- `swellaby.vscode-rust-test-adapter` - Rust test adapter
- `hdenl.vscode-rust-test-lens` - Rust test lens
- `vscjava.vscode-java-test` - Java test integration
- `vadimcn.vscode-lldb` - LLDB debugger
- `mcu-debug.debug-tracker-vscode` - Debug tracking
- `ms-python.debugpy` - Python debugging

**Recommendation**: Add Rust/Python test result highlighting or gutter decorations

### 5. **Documentation Overlaps**

- `jscearcy.rust-doc-viewer` - Rust doc viewer
- `chrisbeard.rustdocstring` - Rust doc string generation
- `maarti.jenkins-doc` - Jenkins documentation

**Recommendation**: Could add inline documentation preview or doc comment highlighting

### 6. **Code Organization Overlaps**

- `mooman219.rust-assist` - Rust code assist
- `conradludgate.rust-playground` - Rust playground
- `lorenzopirro.rust-flash-snippets` - Rust snippets
- `yaduahuja.code-builder` - Code builder

**Recommendation**: Could add code structure visualization

---

## Priority Recommendations for Smeagol Enhancement

### **High Priority - Differentiation**
1. **Enhanced Semantic Highlighting** - Add semantic token awareness beyond identifier coloring
2. **Code Flow Visualization** - Bracket matching, scope visualization
3. **Performance Metrics** - Show code complexity indicators
4. **Breadcrumb Enhancement** - Custom breadcrumb styling

### **Medium Priority - Features**
1. **Rust-Specific Highlighting** - Macro highlighting, trait bounds coloring
2. **Bracket Pair Guides** - Visual guides connecting matching brackets
3. **Indentation Error Detection** - Highlight indentation issues
4. **Custom Gutter Decorations** - Function markers, warning indicators

### **Low Priority - Polish**
1. **Additional Themes** - Light version, high contrast variant
2. **Custom Icon Theme** - Smeagol-styled icons
3. **Accessibility Features** - High contrast, colorblind mode
4. **Performance Profiling** - Built-in performance metrics

---

## Technical Debt & Optimization

- Review configuration schema for conflicts with other installed extensions
- Benchmark against rainbow-highlighter and semantic-rainbow for performance
- Consider WebWorker/Shared Worker for heavy computation
- Cache regex patterns and compiled decorations

---

## User Value Proposition

**Current**: "Dark theme with rainbow highlights and indent guides"

**Enhanced**: "Intelligent semantic code visualization providing unified multi-language highlighting, scope visualization, and code structure insights with minimal performance overhead"

---

## Notes
- Installed extensions are heavily Rust-focused (40+ Rust-related)
- Multiple overlapping theme and highlighting extensions suggest user wants customization
- Java, Python, and embedded debugging tools installed suggest polyglot development
- Consider creating ecosystem of Smeagol extensions rather than monolithic single extension
