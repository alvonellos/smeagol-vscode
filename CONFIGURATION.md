# Configuration Guide - v0.2.3 Custom Thresholds

## Overview

Smeagol now supports custom complexity thresholds through a `.smeagol/config.json` configuration file. This allows you to tailor complexity warnings to your project's coding standards and per-language preferences.

## Quick Start

Create a `.smeagol/config.json` file in your project root:

```json
{
  "complexity": {
    "warning": 10,
    "error": 15
  },
  "branches": {
    "warnAbove": 8
  }
}
```

## Configuration File Structure

### Global Thresholds

```json
{
  "complexity": {
    "warning": 10,    // Yellow warning at this level
    "error": 15       // Red error at this level
  },
  "branches": {
    "maxPaths": 8,    // Maximum allowed branch paths
    "warnAbove": 8    // Warn when exceeded
  }
}
```

### Per-Language Overrides

Override thresholds for specific languages:

```json
{
  "languages": {
    "javascript": {
      "complexity": { "warning": 12, "error": 18 },
      "branches": { "maxPaths": 10, "warnAbove": 10 }
    },
    "python": {
      "complexity": { "warning": 10, "error": 15 },
      "branches": { "maxPaths": 8, "warnAbove": 8 }
    },
    "java": {
      "complexity": { "warning": 15, "error": 20 },
      "branches": { "maxPaths": 12, "warnAbove": 12 }
    },
    "rust": {
      "complexity": { "warning": 12, "error": 18 },
      "branches": { "maxPaths": 10, "warnAbove": 10 }
    }
  }
}
```

Supported languages:
- `javascript` / `typescript`
- `python`
- `java`
- `rust`
- `go`
- `cpp`
- `csharp`

### File Patterns

Control which files are analyzed:

```json
{
  "patterns": {
    "include": [
      "**/*.js",
      "**/*.py",
      "**/*.java",
      "src/**/*.ts"
    ],
    "exclude": [
      "node_modules/**",
      "*.test.js",
      "*.spec.js",
      "dist/**",
      "build/**"
    ]
  }
}
```

### Performance Settings

```json
{
  "performance": {
    "maxFileSize": 10485760,  // 10 MB - skip analysis on larger files
    "cacheEnabled": true,      // Enable completion caching
    "cacheTtl": 300000         // Cache TTL in milliseconds (5 min)
  }
}
```

## Default Configuration

If no `.smeagol/config.json` exists, these defaults apply:

```json
{
  "complexity": {
    "warning": 10,
    "error": 15
  },
  "branches": {
    "maxPaths": 8,
    "warnAbove": 8
  },
  "performance": {
    "maxFileSize": 10485760,
    "cacheEnabled": true,
    "cacheTtl": 300000
  }
}
```

## Understanding Complexity Metrics

### Cyclomatic Complexity

Measures the number of linearly independent paths through code:

- **1-5**: Low complexity (ideal)
- **6-10**: Moderate complexity (acceptable)
- **11-15**: High complexity (consider refactoring)
- **16+**: Very high complexity (should refactor)

**Default thresholds**:
- ⚠️ Warning at 10
- 🔴 Error at 15

### Branch Paths

The total number of possible execution paths through conditional logic:

```javascript
// 2 paths (if / no if)
if (condition) {
  doSomething();
}

// 4 paths (if-else × nested if-else)
if (condition1) {
  if (condition2) {
    doA();
  } else {
    doB();
  }
} else {
  doC();
}
```

**Default threshold**: Warn when > 8 paths

## Real-World Examples

### Lenient Configuration (Startup/Legacy Code)

```json
{
  "complexity": {
    "warning": 20,
    "error": 30
  },
  "branches": {
    "warnAbove": 15
  }
}
```

### Strict Configuration (High-Quality Code)

```json
{
  "complexity": {
    "warning": 5,
    "error": 10
  },
  "branches": {
    "warnAbove": 4
  }
}
```

### Language-Specific (Mixed Codebase)

```json
{
  "complexity": {
    "warning": 10,
    "error": 15
  },
  "languages": {
    "python": {
      "complexity": { "warning": 8, "error": 12 }
    },
    "javascript": {
      "complexity": { "warning": 12, "error": 18 }
    }
  }
}
```

## Configuration Behavior

### Loading Order

1. Load `.smeagol/config.json` if exists
2. Merge user config with defaults (user config takes precedence)
3. Per-language overrides apply to specific files

### Hot Reload

Configuration changes are automatically detected and reloaded:
- Edit `.smeagol/config.json`
- Complexity warnings update on next file save

### Fallback Logic

If a specific language threshold is missing:
1. Check language-specific override in config
2. Fall back to global threshold
3. Fall back to built-in default

## API Usage (For Extension Developers)

### Loading Configuration

```javascript
const { ConfigLoader } = require("./config-loader");

const loader = new ConfigLoader();
const config = loader.loadConfig(workspaceRoot);
```

### Getting Language Thresholds

```javascript
const warningThreshold = loader.getComplexityThreshold("javascript", "warning");
const errorThreshold = loader.getComplexityThreshold("javascript", "error");
const branchThreshold = loader.getBranchThreshold("javascript");
```

### Watching for Changes

```javascript
const stopWatching = loader.watchConfig((newConfig) => {
  console.log("Config updated:", newConfig);
});

// Later...
stopWatching();
```

## Troubleshooting

### Config Not Loading

- Check file path: `.smeagol/config.json` (from workspace root)
- Verify JSON syntax (use VS Code JSON validator)
- Ensure file is readable

### Thresholds Not Applied

- Language ID must match: `javascript`, `python`, `java`, etc.
- Verify language override is at correct nesting level
- Check that config is saved (watch mode auto-detects changes)

### Performance Impact

- Large `maxFileSize` may slow analysis on big projects
- Disable `cacheEnabled` to troubleshoot cache issues
- Increase `cacheTtl` for frequently-accessed files

## Next: Project Profiles

Consider creating multiple `.smeagol/` configuration files:

```
project/
  .smeagol/
    config.json              # Default/shared config
    config.dev.json          # Development (strict)
    config.production.json   # Production (lenient)
```

Load via VS Code settings or CLI flags (future feature).

---

**See also**:
- [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md) - Full feature guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [RUN_GUIDE.md](RUN_GUIDE.md) - Testing instructions
