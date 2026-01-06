# Smeagol Project Structure

## 📖 Root Level (Essential Files Only)

```
smeagol-vscode/
├── README.md                  # ⭐ START HERE - Main documentation
├── COMPLETION_SUMMARY.md      # Session completion status
├── LICENSE                    # MIT License
├── package.json              # Project metadata & configuration
├── icon.png                  # Extension icon (128×128)
└── smeagol-vscode.vsix       # Ready-to-install package
```

## 📁 Key Directories

### `/src` - Source Code
- **extension.js** - Main controller (SmeagolController)
- **\*-completion.js** - 17 language completion providers
- **\*-highlighter.js** - Syntax highlighters
- **complexity-analyzer.js** - Core analysis engine
- **config-loader.js** - Configuration management
- **\*-analyzer.js** - Pattern/idiom analyzers
- **Performance, caching, utilities** - Supporting modules

### `/docs` - Documentation
#### Main Guides (Read These)
- **STRUCTURE.md** - This file (project layout guide)
- **DOCUMENTATION_DIRECTIVE.md** - Where to create new docs
- **API.md** - Complete API reference for developers
- **CONTRIBUTING.md** - How to contribute & extend
- **TROUBLESHOOTING.md** - Problem solving guide
- **SAMPLE_DATABASES.md** - Code examples and data structures

#### Archive
- **archive/** - 40+ old session docs, reports, and reference materials (organized for historical reference)

> 📝 **Important**: See [DOCUMENTATION_DIRECTIVE.md](DOCUMENTATION_DIRECTIVE.md) — **All new documentation goes in `docs/`, not at root!**

### `/themes` - UI Themes
- **smeagol-dark-color-theme.json** - Color theme definition

### `/icons` - Icon Assets
- **smeagol-icon.svg** - Original SVG icon

### `/.smeagol` - Configuration
- **config.json** - Example configuration with all options

### `/scripts` - Build Tools
- **package.ps1** - VSIX packaging script

### `/test-*.* ` - Test Files
- **test-complexity.py/js** - Complexity analysis examples
- **test-patterns.js** - Code pattern samples
- **test-apl.apl** - APL language test

---

## 🎯 Where to Find What

| Need | Location |
|------|----------|
| **Getting Started** | [README.md](README.md) |
| **API Documentation** | [docs/API.md](docs/API.md) |
| **Contributing** | [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) |
| **Troubleshooting** | [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) |
| **Code Examples** | [docs/SAMPLE_DATABASES.md](docs/SAMPLE_DATABASES.md) |
| **Extension Code** | `src/` directory |
| **Old References** | `docs/archive/` |
| **Configuration Example** | `.smeagol/config.json` |
| **UI Theme** | `themes/smeagol-dark-color-theme.json` |

---

## 📦 What's Included in VSIX

The packaged extension (`smeagol-vscode.vsix`) contains:
- ✅ All 46+ source modules
- ✅ Complete documentation
- ✅ Configuration examples
- ✅ Icons and themes
- ✅ Build scripts
- ✅ Test files

**Size**: 5.75 MB  
**Files**: 1,295  
**Ready to deploy**: Yes ✅

---

## 🧹 Cleanup Notes

This is a clean, professional project structure:
- ✅ Root directory: Only essential files
- ✅ Documentation: Organized in `/docs` with archived history in `/docs/archive`
- ✅ Source: All code in `/src`
- ✅ Tests: Sample test files at root
- ✅ Icons/Themes: In dedicated directories

---

**Version**: 0.2.3  
**Status**: Release-Ready  
**Last Updated**: 2025-01-06
