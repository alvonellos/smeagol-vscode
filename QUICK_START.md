# 🚀 Smeagol Extension - Quick Start Guide

## Installation

### Option 1: Install from VSIX (Direct)
```bash
code --install-extension smeagol-vscode.vsix
```

### Option 2: Install from VS Code
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Smeagol"
4. Click Install

### Option 3: Manual
1. Download `smeagol-vscode.vsix`
2. Open VS Code
3. Command Palette (Ctrl+Shift+P)
4. Type: `Extensions: Install from VSIX`
5. Select the file

---

## First Steps

### 1. Apply Theme
- Open Settings (Ctrl+,)
- Search for "Color Theme"
- Select **"Kromatic Dark (Smeagol)"**
- Restart VS Code (optional but recommended)

### 2. Try Completions
Open a file in any supported language and start typing:

**Python:**
```python
pr  # → print() completion
im  # → import suggestions
de  # → def autocomplete
```

**Rust:**
```rust
Ve  # → Vec<T> completion
Ha  # → HashMap completion
to  # → tokio crate
```

**Java:**
```java
@S  # → @Service annotation
@A  # → @Autowired completion
@L  # → @Lombok annotations
```

**Kubernetes:**
```yaml
ap  # → apiVersion completion
De  # → Deployment resource
Se  # → Service resource
```

### 3. Test AI Commands
Press **Ctrl+Shift+P** and search for "Smeagol":

- `Smeagol: Generate Boilerplate Code` → Creates starter template
- `Smeagol: Generate Documentation` → Adds doc template
- `Smeagol: Generate Test Template` → Creates test skeleton
- `Smeagol: Explain Selected Code` → Analyzes code
- `Smeagol: Refactor Code` → Suggests improvements
- `Smeagol: Optimize Code` → Performance tips

---

## Supported Languages

| Language | Type | File Extension |
|----------|------|----------------|
| Python | Scripting | .py |
| Rust | Systems | .rs |
| Java | JVM | .java |
| Groovy | JVM | .groovy |
| Spring Boot | Framework | .java |
| Kotlin | JVM | .kt |
| C++ | Systems | .cpp, .h |
| Shell/Bash | Scripting | .sh |
| PowerShell | Scripting | .ps1 |
| YAML | Config | .yml, .yaml |
| XML | Markup | .xml (Maven POM) |
| Kubernetes | Config | .yaml |
| Jenkins | Config | Jenkinsfile |
| AutoIt | Scripting | .au3 |

---

## Configuration

### Basic Settings
Edit `.vscode/settings.json`:

```json
{
  "smeagol.enabled": true,
  "smeagol.highlights.enabled": true,
  "smeagol.brackets.enabled": true,
  "smeagol.rust.enabled": true,
  "smeagol.java.enabled": true,
  "smeagol.performance.refreshDelayMs": 120
}
```

### Advanced Configuration
```json
{
  // Disable specific languages
  "smeagol.rust.enabled": false,
  "smeagol.java.enabled": false,
  
  // Performance tuning
  "smeagol.performance.maxDocumentLength": 400000,
  "smeagol.performance.maxLineCount": 10000,
  "smeagol.performance.refreshDelayMs": 120,
  
  // Highlight customization
  "smeagol.highlights.minOccurrences": 2,
  "smeagol.highlights.minLength": 2,
  "smeagol.highlights.maxTokens": 120,
  "smeagol.highlights.backgroundOpacity": 0.16,
  "smeagol.highlights.borderOpacity": 0.65,
  
  // Custom colors
  "smeagol.highlights.colors": [
    "#ff844c",
    "#fdd835",
    "#aee571",
    "#039be5",
    "#c158dc"
  ]
}
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Open command palette |
| `Ctrl+Space` | Trigger completions manually |
| `Escape` | Close completions menu |
| `Enter` | Accept completion |
| `Tab` | Accept and move to next |
| `↑↓` | Navigate completions |
| `Ctrl+K Ctrl+I` | Show signature help |
| `Ctrl+Shift+Space` | Trigger parameter hints |

---

## Feature Examples

### Auto-Completions

**Python**
```python
# Type "pr" → get "print()" suggestion
print("Hello, World!")

# Type "as" → get "async def" suggestion  
async def fetch_data():
    pass
```

**Rust**
```rust
// Type "Ve" → get "Vec<T>" 
let mut vec: Vec<i32> = Vec::new();

// Type "Ha" → get "HashMap"
use std::collections::HashMap;
```

**Java**
```java
// Type "@Sp" → get "@SpringBootApplication"
@SpringBootApplication
public class Application {
}

// Type "@Da" → get "@Data" (Lombok)
@Data
public class User {
}
```

### Bracket Guides
Colors show nesting depth:
- 🔴 Red (depth 1)
- 🟠 Orange (depth 2)
- 🟡 Yellow (depth 3)
- 🟢 Green (depth 4)
- 🔵 Blue (depth 5)
- 🟣 Indigo (depth 6+)

### AI Commands

**Generate Boilerplate**
```python
# Select language when prompted
# Inserts complete class template with type hints
class MyClass:
    def __init__(self):
        pass
```

**Generate Documentation**
```python
# Select code
# Inserts docstring template
"""
Summary of functionality.

Args:
    param1 (type): Description
"""
```

**Generate Tests**
```python
# Select function
# Creates test class with test methods
class TestMyFunction(unittest.TestCase):
    def test_basic_functionality(self):
        pass
```

---

## Troubleshooting

### Issue: Completions not appearing

**Solution:**
1. Verify file is in supported language
2. Check `smeagol.enabled` is `true` in settings
3. Restart VS Code
4. Manually trigger: `Ctrl+Space`

### Issue: Theme not applying

**Solution:**
1. Open Settings (Ctrl+,)
2. Search "Color Theme"
3. Select **Kromatic Dark (Smeagol)**
4. Reload window (Cmd+Shift+P → "Reload Window")

### Issue: Extension is slow

**Solution:**
1. Increase `refreshDelayMs` to 200ms
2. Reduce `maxTokens` to 80
3. Disable unused languages in settings
4. Close large files (>400KB)

### Issue: Commands not showing

**Solution:**
1. Verify extension is installed: Extensions sidebar
2. Restart VS Code
3. Open command palette: Ctrl+Shift+P
4. Type "Smeagol" to see all commands

---

## Performance Tips

1. **Close very large files** - Disable for files > 400KB
2. **Adjust refresh delay** - Default 120ms is fine
3. **Limit tokens** - Default 120 is good for most users
4. **Exclude keywords** - Some tokens are excluded by default
5. **Use categorized search** - Press Ctrl+Space for smart filtering

---

## Tips & Tricks

### 💡 Pro Tips

1. **Hover for docs** - Hover over any completion for full documentation
2. **Multiple languages** - Completions work in polyglot projects
3. **Custom snippets** - Combine Smeagol with VS Code snippets
4. **AI + snippets** - Generate code then use snippets to customize
5. **Settings sync** - Settings are synced across machines

### 🔥 Power User Features

1. **Command palette** - Cmd+Shift+P for instant access to all AI commands
2. **Batch refactoring** - Run AI commands across multiple files
3. **Custom colors** - Set `highlights.colors` to your favorite palette
4. **Disable features** - Set `enabled: false` for languages you don't use
5. **Performance mode** - Increase delays for large projects

---

## Examples by Language

### 🐍 Python Example
```python
#!/usr/bin/env python3
# Type these and completions will help:

# Builtins
for i in range(10):  # range() autocomplete
    print(i)         # print() autocomplete

# Standard library
import json          # json module
data = {"key": "value"}

# Decorators
@property
def name(self):      # @property autocomplete
    return self._name

# Async
async def fetch():   # async def autocomplete
    await asyncio.sleep(1)

# AI Command: Generate Docs
# Select this function → Cmd+Shift+P → Generate Documentation
def my_function(x, y):
    return x + y
```

### 🦀 Rust Example
```rust
// Standard types
let vec: Vec<i32> = vec![1, 2, 3];  // Vec<> autocomplete
let map: HashMap<String, i32> = HashMap::new();  // HashMap
let result: Result<T, E> = Ok(value);  // Result<>

// Traits
impl Clone for MyStruct {  // Clone trait suggestion
    fn clone(&self) -> Self { ... }
}

// Popular crates
use tokio::runtime;  // tokio crate
use serde::{Serialize, Deserialize};  // serde
```

### ☕ Java/Spring Example
```java
@SpringBootApplication  // Autocomplete
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@Service  // Service annotation
@Data     // Lombok @Data
public class UserService {
    @Autowired  // Dependency injection
    private UserRepository repo;
    
    @Transactional  // Transaction
    public void save(User user) {
        repo.save(user);
    }
}
```

### ☸️ Kubernetes Example
```yaml
apiVersion: v1          # apiVersion: autocomplete
kind: Pod               # Pod autocomplete
metadata:
  name: my-pod
spec:
  containers:           # containers: autocomplete
  - name: app
    image: myapp:latest
    ports:
    - containerPort: 8080
```

---

## Getting Help

### Documentation
- 📖 [COMPREHENSIVE_FEATURES.md](COMPREHENSIVE_FEATURES.md) - Full feature guide
- 📚 [COMPLETION_REFERENCE.md](COMPLETION_REFERENCE.md) - Language reference
- 🚀 [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) - Technical summary
- 📋 [README.md](README.md) - Project overview

### Community
- **GitHub Issues** - Report bugs or request features
- **GitHub Discussions** - Ask questions and share ideas
- **VS Code Extension Forum** - General extension help

### Resources
- [VS Code Extension API](https://code.visualstudio.com/api)
- [IntelliJ Kromatic Theme](https://plugins.jetbrains.com/plugin/15676-kromatic)
- [Language Documentation](https://www.python.org, https://www.rust-lang.org, etc.)

---

## Version Info

- **Version**: 0.1.0
- **License**: MIT
- **Repository**: https://github.com/alvonellos/smeagol-vscode
- **VSIX Size**: 74.94 KB
- **VS Code Min Version**: 1.80.0

---

## Support & Feedback

Found a bug? Have a suggestion? 

1. 📝 **Create an issue** on GitHub
2. 💬 **Start a discussion** for feature requests
3. 🔐 **Report security issues** to SECURITY.md

---

**Happy coding! 🎉**

*Smeagol's precious IDE is now complete!* ✨
