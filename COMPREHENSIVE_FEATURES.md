# Smeagol Extension - Polyglot IDE with AI Helpers

**Intelligent Semantic Code Visualization & AI-Assisted Development for VS Code**

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎨 Features Overview

Smeagol is a comprehensive VS Code extension that provides:

1. **Multi-Language Support** with IntelliJ-like completions:
   - 🦀 **Rust** (stdlib, traits, macros, crates)
   - ☕ **Java & Spring Boot** (annotations, Lombok, Spring framework)
   - 🐍 **Python** (stdlib, popular packages, async/await)
   - 🚀 **DevOps Stack** (Kubernetes, Maven, Groovy, Jenkins, Shell, PowerShell)
   - 💻 **Web Technologies** (JavaScript, TypeScript, YAML)

2. **Semantic Highlighting** with Kromatic Official Theme:
   - Rainbow bracket guides with LGBT pride colors
   - Language-specific semantic highlighting
   - Automatic multi-identifier highlighting
   - Indent visualization

3. **AI-Assisted Development Tools**:
   - 🤖 Code generation & boilerplate templates
   - 🔄 Refactoring suggestions
   - 📝 Automatic documentation generation
   - 🧪 Test template generation
   - 💡 Code explanation & analysis
   - ⚡ Performance optimization suggestions

## 📦 Completion Providers (420+ Items)

### Rust (40+ items)
```rust
Vec, String, HashMap, Option, Result, Arc, Mutex
Iterator, Clone, Copy, Default, Display, Debug
println!, dbg!, vec!, panic!, assert!
tokio, serde, anyhow, regex, chrono, clap
```

### Python (50+ items)
```python
print, len, enumerate, map, filter
@property, @staticmethod, @classmethod
async def, await, asyncio
numpy, pandas, flask, requests, pytest
```

### Java & Spring Boot (60+ items)
```java
@SpringBootApplication, @RestController, @Service
@Autowired, @Configuration, @Bean
@Entity, @Transactional, @Id
Lombok annotations: @Data, @Builder, @Slf4j
spring-boot-starter-web, spring-boot-starter-data-jpa
```

### Kubernetes (40+ items)
```yaml
Pod, Deployment, Service, ConfigMap, Secret
containers, volumes, ports, env
apiVersion, kind, metadata, spec
persistentVolumeClaim, Ingress, StatefulSet
```

### Shell/Bash (40+ items)
```bash
echo, ls, grep, sed, awk, find, xargs
if/then/else, for, while, case
kill, ps, curl, wget, ssh
```

### PowerShell (40+ items)
```powershell
Get-ChildItem, Copy-Item, Get-Process
ForEach-Object, Where-Object, Select-Object
$PSScriptRoot, $env:PATH, @()
```

### Maven (30+ items)
```xml
<dependency>, <plugin>, <repository>
clean, compile, test, package, deploy
maven-compiler-plugin, spring-boot-maven-plugin
${project.version}, ${maven.home}
```

### Groovy (30+ items)
```groovy
def, class, interface, trait, closure
each, map, filter, find, collect
?. (safe navigation), * (spread operator)
```

### Jenkins Pipeline (30+ items)
```groovy
pipeline, agent, stages, stage, steps
sh, bat, echo, junit, timeout, retry
environment, parameters, credentials
```

## 🤖 AI Helper Commands

Access via **Ctrl+Shift+P** > "Smeagol":

### `smeagol.generateBoilerplate`
Generates language-specific starter templates:
- Python: Complete module with logging, type hints
- Java: Spring Boot service with Lombok
- Rust: Struct with traits and main()
- TypeScript: Class with interfaces

### `smeagol.generateDocs`
Inserts documentation templates:
- Python docstrings with examples
- Java JavaDoc with parameter docs
- Rust doc comments with examples
- JSDoc/TSDoc with type annotations

### `smeagol.generateTests`
Creates test file stubs:
- Python: unittest framework
- Java: JUnit 5 test cases
- Rust: #[cfg(test)] modules
- Groovy: Spock specifications

### `smeagol.explainCode`
Analyzes selected code and provides:
- Purpose and functionality explanation
- Data flow analysis
- Complexity assessment
- Potential issues and improvements

### `smeagol.refactorCode`
Suggests refactoring strategies:
- Extract method opportunities
- Reduce complexity recommendations
- Remove duplication hints
- Simplify logic suggestions

### `smeagol.optimizeCode`
Performance optimization suggestions:
- Caching/memoization strategies
- Parallel processing opportunities
- Algorithm optimization
- Memory optimization
- Database query optimization

## 🎯 Language-Specific Features

### Rust Excellence
- Complete stdlib reference (Vec, String, HashMap, BTreeMap)
- Traits: Iterator, Clone, Copy, Default, Display, Debug, PartialEq, Eq, Ord
- Popular crates: tokio, serde, anyhow, regex, chrono, clap, lazy_static

### Spring Boot Mastery
- All major annotations (@SpringBootApplication, @RestController, @Service, @Repository)
- Dependency management (@Autowired, @Qualifier, @Conditional)
- Data persistence (@Entity, @Table, @Id, @OneToMany, @ManyToOne)
- Configuration properties (server.port, spring.datasource.*, spring.jpa.*)
- Spring Boot starters with descriptions

### Kubernetes YAML
- All resource types (Pod, Deployment, Service, ConfigMap, Secret, Ingress, PVC)
- Common fields (metadata, spec, status, containers, volumes)
- Service types and configurations
- Ingress setup and routing

### Python Ecosystem
- Core builtins (print, len, range, enumerate, zip, map, filter)
- Decorators (@property, @staticmethod, @classmethod, @abstractmethod, @contextmanager)
- Async/await patterns (async def, await, asyncio.gather, asyncio.create_task)
- Popular packages (numpy, pandas, matplotlib, requests, flask, django, pytest, sqlalchemy)

## 🌈 Visual Features

### Bracket Guides with Pride Colors
Rainbow-colored bracket depth indicators:
- 🔴 Red (depth 1)
- 🟠 Orange (depth 2)
- 🟡 Yellow (depth 3)
- 🟢 Green (depth 4)
- 🔵 Blue (depth 5)
- 🟣 Indigo (depth 6+)

### Kromatic Theme Integration
Official IntelliJ Kromatic color palette:
- Gold (#facd45): Macros, annotations, constants
- Cyan (#00c7ff): Variables, numbers, generics
- Orange (#ffc66d): Functions, attributes
- Turquoise (#00ffd9): Classes, interfaces, traits
- Magenta (#ff006f): Keywords, operators
- Purple (#bb00ff): Escapes, enums, directives
- Green (#00e71c): Strings
- Gray (#888888): Comments

### Semantic Highlighting
Automatically highlights multiple occurrences of selected identifiers with distinct colors, making code navigation intuitive.

## ⚙️ Configuration

Edit `settings.json` for customization:

```json
{
  "smeagol.enabled": true,
  "smeagol.highlights.enabled": true,
  "smeagol.brackets.enabled": true,
  "smeagol.performance.refreshDelayMs": 120,
  "smeagol.rust.enabled": true,
  "smeagol.java.enabled": true,
  "smeagol.cpp.enabled": true,
  "smeagol.autoit.enabled": true
}
```

## 🚀 Quick Start

1. Install the extension from VS Code Marketplace
2. Select **Kromatic Dark (Smeagol)** theme for full effect
3. Start coding - completions appear automatically
4. Use **Cmd+Shift+P** for AI helper commands
5. Hover over suggestions for detailed documentation

## 📊 Statistics

- **24 completion provider files**
- **420+ completion items** across all languages
- **74.94 KB** total VSIX size (highly optimized)
- **35 included files** with comprehensive theme and config

## 🛠️ Technologies

- VS Code Extension API v1.80.0+
- Node.js runtime
- Lombok, Spring Boot, Maven ecosystem
- Kubernetes/Docker reference
- Jenkins/Groovy DSL knowledge base

## 📝 License

MIT License - Free and open source

## 🤝 Contributing

Contributions welcome! Submit PRs for:
- New language support
- Additional completions
- Bug fixes
- Documentation improvements

## 🔗 Links

- [GitHub Repository](https://github.com/alvonellos/smeagol-vscode)
- [VS Code Marketplace](https://marketplace.visualstudio.com)
- [Kromatic Theme](https://plugins.jetbrains.com/plugin/15676-kromatic)

---

**Made with ❤️ for developers who love smart tooling**

*Smeagol: "What hssss the precioussss?"* - Your IDE just became more precious! ✨
