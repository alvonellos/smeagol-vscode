/**
 * Configuration Loader
 * Loads and manages .smeagol/config.json for customizable complexity thresholds
 * Supports per-language configuration with sensible defaults
 */

const fs = require("fs");
const path = require("path");

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  // Global complexity thresholds
  complexity: {
    warning: 10,
    error: 15
  },
  // Branch path thresholds
  branches: {
    maxPaths: 8,
    warnAbove: 8
  },
  // Per-language overrides
  languages: {
    javascript: {
      complexity: { warning: 12, error: 18 },
      branches: { maxPaths: 10, warnAbove: 10 }
    },
    python: {
      complexity: { warning: 10, error: 15 },
      branches: { maxPaths: 8, warnAbove: 8 }
    },
    java: {
      complexity: { warning: 15, error: 20 },
      branches: { maxPaths: 12, warnAbove: 12 }
    },
    rust: {
      complexity: { warning: 12, error: 18 },
      branches: { maxPaths: 10, warnAbove: 10 }
    },
    go: {
      complexity: { warning: 10, error: 15 },
      branches: { maxPaths: 8, warnAbove: 8 }
    },
    cpp: {
      complexity: { warning: 15, error: 20 },
      branches: { maxPaths: 12, warnAbove: 12 }
    },
    csharp: {
      complexity: { warning: 12, error: 18 },
      branches: { maxPaths: 10, warnAbove: 10 }
    }
  },
  // File patterns to analyze
  patterns: {
    include: ["**/*.js", "**/*.py", "**/*.java", "**/*.rs", "**/*.go", "**/*.cpp", "**/*.h"],
    exclude: ["node_modules/**", "*.test.js", "*.spec.js"]
  },
  // Performance settings
  performance: {
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    cacheEnabled: true,
    cacheTtl: 300000 // 5 minutes in ms
  }
};

class ConfigLoader {
  constructor() {
    this.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    this.configPath = null;
    this.lastLoadTime = null;
    this.watchers = [];
  }

  /**
   * Load configuration from workspace root
   * @param {string} workspaceRoot - Root directory of workspace
   * @returns {Object} Loaded configuration (or defaults if not found)
   */
  loadConfig(workspaceRoot) {
    this.configPath = path.join(workspaceRoot, ".smeagol", "config.json");

    try {
      if (fs.existsSync(this.configPath)) {
        const rawConfig = fs.readFileSync(this.configPath, "utf-8");
        const userConfig = JSON.parse(rawConfig);
        
        // Merge user config with defaults (user config takes precedence)
        this.config = this._mergeConfigs(DEFAULT_CONFIG, userConfig);
        this.lastLoadTime = Date.now();
        
        return this.config;
      }
    } catch (error) {
      console.warn(`Failed to load config from ${this.configPath}:`, error.message);
    }

    // Return defaults if file not found or parse failed
    this.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    return this.config;
  }

  /**
   * Get configuration for a specific language
   * @param {string} language - Programming language (e.g., 'javascript', 'python')
   * @returns {Object} Language-specific configuration with fallback to defaults
   */
  getLanguageConfig(language) {
    const lang = language.toLowerCase();
    
    if (this.config.languages && this.config.languages[lang]) {
      // Merge language config with global defaults
      return {
        complexity: {
          warning: this.config.languages[lang].complexity?.warning ?? this.config.complexity.warning,
          error: this.config.languages[lang].complexity?.error ?? this.config.complexity.error
        },
        branches: {
          maxPaths: this.config.languages[lang].branches?.maxPaths ?? this.config.branches.maxPaths,
          warnAbove: this.config.languages[lang].branches?.warnAbove ?? this.config.branches.warnAbove
        }
      };
    }

    // Return global defaults
    return {
      complexity: this.config.complexity,
      branches: this.config.branches
    };
  }

  /**
   * Get complexity threshold for a language
   * @param {string} language - Programming language
   * @param {string} level - 'warning' or 'error'
   * @returns {number} Threshold value
   */
  getComplexityThreshold(language, level = "warning") {
    const langConfig = this.getLanguageConfig(language);
    return langConfig.complexity[level] ?? this.config.complexity[level];
  }

  /**
   * Get branch path threshold for a language
   * @param {string} language - Programming language
   * @returns {number} Maximum allowed branch paths
   */
  getBranchThreshold(language) {
    const langConfig = this.getLanguageConfig(language);
    return langConfig.branches.warnAbove ?? this.config.branches.warnAbove;
  }

  /**
   * Check if file should be analyzed based on patterns
   * @param {string} filePath - Full file path
   * @returns {boolean} True if file matches include patterns and not in exclude patterns
   */
  shouldAnalyzeFile(filePath) {
    const patterns = this.config.patterns;
    const fileName = path.basename(filePath);
    
    // Check exclusion patterns first
    if (patterns.exclude) {
      for (const pattern of patterns.exclude) {
        if (this._matchesPattern(filePath, pattern)) {
          return false;
        }
      }
    }

    // Check inclusion patterns
    if (patterns.include) {
      for (const pattern of patterns.include) {
        if (this._matchesPattern(filePath, pattern)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if file size is within analysis limits
   * @param {number} fileSizeBytes - File size in bytes
   * @returns {boolean} True if file is within limits
   */
  isFileSizeAllowed(fileSizeBytes) {
    return fileSizeBytes <= this.config.performance.maxFileSize;
  }

  /**
   * Get performance configuration
   * @returns {Object} Performance settings
   */
  getPerformanceConfig() {
    return {
      ...this.config.performance
    };
  }

  /**
   * Create a template config file at the specified path
   * @param {string} workspaceRoot - Root directory where .smeagol/ will be created
   */
  createTemplateConfig(workspaceRoot) {
    const smeagolDir = path.join(workspaceRoot, ".smeagol");
    const configFile = path.join(smeagolDir, "config.json");

    try {
      // Create .smeagol directory if it doesn't exist
      if (!fs.existsSync(smeagolDir)) {
        fs.mkdirSync(smeagolDir, { recursive: true });
      }

      // Write template config
      fs.writeFileSync(configFile, JSON.stringify(DEFAULT_CONFIG, null, 2), "utf-8");
      return true;
    } catch (error) {
      console.error(`Failed to create template config:`, error.message);
      return false;
    }
  }

  /**
   * Watch config file for changes
   * @param {Function} callback - Function to call when config changes
   * @returns {Function} Function to stop watching
   */
  watchConfig(callback) {
    if (!this.configPath || !fs.existsSync(this.configPath)) {
      return () => {};
    }

    try {
      const watcher = fs.watch(this.configPath, (eventType) => {
        if (eventType === "change") {
          // Small delay to ensure file is fully written
          setTimeout(() => {
            const dirPath = path.dirname(this.configPath);
            const workspaceRoot = path.dirname(dirPath);
            this.loadConfig(workspaceRoot);
            if (callback) {
              callback(this.config);
            }
          }, 100);
        }
      });

      this.watchers.push(watcher);

      // Return function to stop watching
      return () => {
        watcher.close();
        this.watchers = this.watchers.filter(w => w !== watcher);
      };
    } catch (error) {
      console.warn(`Failed to watch config file:`, error.message);
      return () => {};
    }
  }

  /**
   * Stop all file watchers
   */
  closeWatchers() {
    this.watchers.forEach(watcher => {
      try {
        watcher.close();
      } catch (e) {
        // Ignore close errors
      }
    });
    this.watchers = [];
  }

  /**
   * Merge user config with defaults
   * @private
   */
  _mergeConfigs(defaults, userConfig) {
    const merged = JSON.parse(JSON.stringify(defaults));

    for (const key in userConfig) {
      if (typeof userConfig[key] === "object" && !Array.isArray(userConfig[key])) {
        merged[key] = { ...merged[key], ...userConfig[key] };
      } else {
        merged[key] = userConfig[key];
      }
    }

    return merged;
  }

  /**
   * Simple glob-like pattern matching
   * @private
   */
  _matchesPattern(filePath, pattern) {
    // Convert glob pattern to simple regex
    const regexPattern = pattern
      .replace(/\./g, "\\.")
      .replace(/\*/g, ".*")
      .replace(/\?/g, ".");
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath);
  }
}

module.exports = { ConfigLoader };
