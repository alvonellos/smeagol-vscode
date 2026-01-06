# Sample Databases & Data Structures

Example data structures Smeagol uses internally.

## Complexity Metrics Database

```json
{
  "version": "0.2.3",
  "timestamp": "2026-01-06T10:30:00Z",
  "project": "my-awesome-project",
  "files": [
    {
      "path": "src/main.py",
      "language": "python",
      "analyzed": "2026-01-06T10:25:00Z",
      "functions": [
        {
          "name": "main",
          "line": 1,
          "complexity": 2,
          "branches": 1,
          "severity": "simple",
          "trend": "stable"
        },
        {
          "name": "process_data",
          "line": 10,
          "complexity": 8,
          "branches": 6,
          "severity": "high",
          "trend": "increasing"
        }
      ],
      "summary": {
        "totalFunctions": 2,
        "avgComplexity": 5,
        "maxComplexity": 8,
        "criticalCount": 1,
        "score": 7.5
      }
    },
    {
      "path": "src/utils.ts",
      "language": "typescript",
      "analyzed": "2026-01-06T10:26:00Z",
      "functions": [
        {
          "name": "formatDate",
          "line": 5,
          "complexity": 3,
          "branches": 2,
          "severity": "moderate",
          "trend": "stable"
        }
      ],
      "summary": {
        "totalFunctions": 1,
        "avgComplexity": 3,
        "maxComplexity": 3,
        "criticalCount": 0,
        "score": 9.2
      }
    }
  ],
  "summary": {
    "totalFiles": 2,
    "totalFunctions": 3,
    "avgComplexity": 4.33,
    "maxComplexity": 8,
    "criticalCount": 1,
    "overallScore": 8.35
  }
}
```

## Completion Cache Structure

```javascript
{
  "python": {
    "hash": "abc123def456",
    "timestamp": 1672945200000,
    "ttl": 300000,
    "items": [
      {
        "label": "import",
        "kind": "Keyword",
        "detail": "Python keyword"
      },
      {
        "label": "datetime",
        "kind": "Module",
        "detail": "Python stdlib"
      }
      // ... 100+ items
    ]
  },
  "javascript": {
    "hash": "xyz789uvw012",
    "timestamp": 1672945200000,
    "ttl": 300000,
    "items": [
      {
        "label": "async",
        "kind": "Keyword",
        "detail": "ES2017"
      }
      // ... 80+ items
    ]
  }
}
```

## Symbol Index Database

```javascript
{
  "project": {
    "path": "/path/to/project",
    "symbols": {
      "function:main": {
        "file": "src/main.py",
        "line": 1,
        "type": "function",
        "complexity": 2,
        "references": ["src/utils.py:5", "src/app.py:12"]
      },
      "class:DataProcessor": {
        "file": "src/processor.py",
        "line": 10,
        "type": "class",
        "methods": ["process", "validate", "transform"],
        "references": ["src/main.py:15", "tests/test_processor.py:20"]
      },
      "module:helpers": {
        "file": "src/helpers.py",
        "type": "module",
        "exports": ["parse_config", "validate_data", "format_output"],
        "references": ["src/main.py:5", "src/app.py:8"]
      }
    }
  }
}
```

## Configuration Database

```json
{
  "workspace": "/path/to/project",
  "version": "0.2.3",
  "lastModified": "2026-01-06T10:15:00Z",
  "globalThresholds": {
    "complexity": {
      "warning": 10,
      "error": 15
    },
    "branches": {
      "warnAbove": 8,
      "maxPaths": 8
    }
  },
  "languageOverrides": {
    "python": {
      "complexity": {
        "warning": 8,
        "error": 12
      },
      "branches": {
        "warnAbove": 6
      }
    },
    "javascript": {
      "complexity": {
        "warning": 12,
        "error": 18
      },
      "branches": {
        "warnAbove": 10
      }
    }
  },
  "performance": {
    "maxFileSize": 10485760,
    "cacheEnabled": true,
    "cacheTtl": 300000
  },
  "filePatterns": {
    "include": ["**/*.{py,js,ts,java,rs}"],
    "exclude": ["**/node_modules/**", "**/.git/**"]
  }
}
```

## Analysis Results Cache

```javascript
{
  "file:///path/to/src/main.py": {
    "hash": "abc123def456",
    "timestamp": 1672945200000,
    "language": "python",
    "results": {
      "complexity": [
        {
          "name": "main",
          "line": 1,
          "score": 2,
          "severity": "simple",
          "message": "Function 'main' has low complexity (2)"
        },
        {
          "name": "process",
          "line": 10,
          "score": 8,
          "severity": "high",
          "message": "Function 'process' is complex (8), consider refactoring"
        }
      ],
      "idioms": [
        {
          "line": 25,
          "pattern": "non_idiomatic_error_handling",
          "message": "Use try/except for error handling in Python"
        }
      ],
      "patterns": [
        {
          "line": 40,
          "pattern": "duplicate_code",
          "message": "Similar code block found at line 35"
        }
      ]
    },
    "score": 7.2
  }
}
```

## SonarQube Metrics Response

```json
{
  "project": {
    "key": "my-project",
    "name": "My Awesome Project",
    "metrics": {
      "ncloc": 5248,
      "complexity": 142,
      "cognitive_complexity": 89,
      "comment_lines": 312,
      "duplicated_lines": 45,
      "duplicated_blocks": 3,
      "duplicated_files": 1,
      "violations": 12,
      "blocker_violations": 0,
      "critical_violations": 2,
      "major_violations": 5,
      "minor_violations": 5
    },
    "quality_gates": {
      "status": "PASSED",
      "conditions": [
        {
          "metric": "coverage",
          "operator": "GREATER_THAN",
          "threshold": 80,
          "value": 85.5,
          "status": "OK"
        },
        {
          "metric": "new_duplicated_lines_density",
          "operator": "LESS_THAN",
          "threshold": 3,
          "value": 1.2,
          "status": "OK"
        }
      ]
    },
    "ratings": {
      "maintainability": "A",
      "reliability": "A",
      "security": "A",
      "coverage": 85.5,
      "duplications": 0.3
    }
  }
}
```

## Performance Profile Data

```javascript
{
  "session": {
    "timestamp": "2026-01-06T10:30:00Z",
    "duration": 3600000,  // 1 hour
    "metrics": {
      "files_analyzed": 156,
      "total_functions": 1247,
      "avg_analysis_time": 45,  // ms
      "slowest_analysis": 234,  // ms
      "cache_hits": 892,
      "cache_misses": 112,
      "cache_hit_rate": 0.889,
      "memory_peak": 145,  // MB
      "memory_avg": 98,    // MB
      "completions_provided": 5432,
      "avg_completion_time": 8   // ms
    },
    "languages": {
      "python": {
        "files": 45,
        "functions": 312,
        "avg_time": 42,
        "completions": 1240
      },
      "javascript": {
        "files": 38,
        "functions": 289,
        "avg_time": 48,
        "completions": 1890
      },
      "java": {
        "files": 32,
        "functions": 456,
        "avg_time": 52,
        "completions": 1450
      }
    }
  }
}
```

---

These structures represent the data Smeagol uses internally for:
- Caching analysis results
- Tracking performance
- Managing configuration
- Storing symbol information
- Reporting metrics

Developers can extend these structures to add additional metadata or metrics relevant to their use cases.
