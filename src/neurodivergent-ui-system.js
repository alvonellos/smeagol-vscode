"use strict";

/**
 * Neurodivergent-Optimized UI System with Animated Highlights
 * 
 * Designed specifically for ADHD/Autism spectrum:
 * - High contrast, vibrant colors for attention-holding
 * - Animated blinking/pulsing highlights - code MOVES and BLINKS
 * - Immediate visual feedback (no delays)
 * - Redundant visual cues (color + icons + animation + glow)
 * - Pattern recognition aids (striping, grouping)
 * - Stimulating but not overwhelming feedback loops
 * - IntelliJ-inspired visual design
 */

class NeuroUI {
  constructor() {
    this.animationFrames = new Map(); // Track active animations
    this.activeDecorations = new Set(); // Prevent overlapping highlights
    
    // High-contrast, attention-grabbing palette for neurodivergent brains
    this.palettes = {
      // PALETTE 1: ADHD MODE - Stimulating primary colors - high saturation for engagement
      adhd: [
        "#ff3366", // Hot magenta - immediate attention
        "#00ff00", // Neon green - high energy
        "#00aaff", // Electric cyan - focus marker
        "#ffaa00", // Bright orange - warmth
        "#ff00ff", // Vivid magenta - excitement
        "#00ffff", // Bright cyan - clarity
        "#00dd00", // Neon lime - positivity
        "#ff6600", // Vibrant orange - engagement
      ],

      // PALETTE 2: AUTISM MODE - Autism-friendly: distinct hues, clear separation
      autism: [
        "#ff5577", // Clear red
        "#00dd00", // Pure green
        "#0099ff", // Pure blue
        "#ffdd00", // Pure yellow
        "#ff00ff", // Pure magenta
        "#00ffff", // Pure cyan
        "#ff8800", // Clear orange
        "#88ff00", // Lime
      ],

      // PALETTE 3: STIM MODE - Animated, high-contrast with pulsing
      stim: [
        "#ff2244", // Pulsing red
        "#00ff00", // Pulsing green
        "#0088ff", // Pulsing blue
        "#ffff00", // Pulsing yellow
        "#ff00ff", // Pulsing magenta
        "#00ffff", // Pulsing cyan
      ],
    };

    // Animation keyframes for blinking/moving effects
    this.animations = {
      pulse: {
        keyframes: [0.5, 0.7, 0.9, 1.0, 0.9, 0.7, 0.5],
        duration: 1500, // milliseconds
        name: "pulse"
      },
      blink: {
        keyframes: [1.0, 1.0, 0.3, 0.3, 1.0],
        duration: 800,
        name: "blink"
      },
      bounce: {
        keyframes: [0, 5, 10, 5, 0, -5, 0],
        duration: 1000,
        name: "bounce"
      },
      shake: {
        keyframes: [0, 2, -2, 2, 0],
        duration: 400,
        name: "shake"
      },
      glow: {
        keyframes: [0.2, 0.4, 0.6, 0.8, 1.0, 0.8, 0.6, 0.4, 0.2],
        duration: 1200,
        name: "glow"
      }
    };

    // Visual feedback styles (IntelliJ-inspired)
    this.feedbackStyles = {
      // For successful operations - GREEN, SOLID
      success: {
        color: "#00ff00",
        icon: "✓",
        animation: "pulse",
        borderColor: "#00dd00",
        backgroundColor: "rgba(0, 255, 0, 0.15)",
      },
      // For warnings/high complexity - ORANGE, BLINKING
      warning: {
        color: "#ffaa00",
        icon: "⚠",
        animation: "blink",
        borderColor: "#ff8800",
        backgroundColor: "rgba(255, 170, 0, 0.15)",
      },
      // For errors - RED, SHAKING
      error: {
        color: "#ff3366",
        icon: "✕",
        animation: "shake",
        borderColor: "#ff0055",
        backgroundColor: "rgba(255, 51, 102, 0.15)",
      },
      // For information - CYAN, BLINKING
      info: {
        color: "#00aaff",
        icon: "ℹ",
        animation: "blink",
        borderColor: "#0088ff",
        backgroundColor: "rgba(0, 170, 255, 0.15)",
      },
      // For patterns detected - MAGENTA, GLOWING
      pattern: {
        color: "#ff00ff",
        icon: "⚡",
        animation: "glow",
        borderColor: "#ff00ff",
        backgroundColor: "rgba(255, 0, 255, 0.15)",
      },
    };
  }

  /**
   * Get optimal palette for neurodivergent user
   * @param {string} mode - 'adhd', 'autism', or 'stim'
   * @returns {string[]} Color palette
   */
  getPalette(mode = "adhd") {
    return this.palettes[mode] || this.palettes.adhd;
  }

  /**
   * Create high-contrast highlight for code patterns
   * @param {string} color - Base color
   * @param {number} intensity - 0-100, intensity of highlight
   * @returns {object} VSCode decoration properties
   */
  createStimulatingHighlight(color, intensity = 80) {
    const alpha = Math.min(intensity / 100, 0.9);
    return {
      backgroundColor: `${color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`,
      border: `2px solid ${color}`,
      borderRadius: "2px",
      fontWeight: "600",
      isWholeLine: false,
    };
  }

  /**
   * Create glow effect for important items
   * @param {string} color - Glow color
   * @returns {object} VSCode decoration properties
   */
  createGlowEffect(color) {
    return {
      backgroundColor: `${color}22`,
      border: `1px solid ${color}`,
      borderRadius: "2px",
      boxShadow: `inset 0 0 10px ${color}44`,
    };
  }

  /**
   * Get visual feedback for code quality
   * @param {number} complexity - 0-100 complexity score
   * @returns {object} Feedback style and color
   */
  getComplexityFeedback(complexity) {
    if (complexity < 20) {
      return { ...this.feedbackStyles.success, label: "CLEAR" };
    } else if (complexity < 50) {
      return { ...this.feedbackStyles.info, label: "MODERATE" };
    } else if (complexity < 75) {
      return { ...this.feedbackStyles.warning, label: "COMPLEX" };
    } else {
      return { ...this.feedbackStyles.error, label: "CRITICAL" };
    }
  }

  /**
   * Pattern indicators - redundant visual cues
   * Combines color + shape + icon for maximum clarity
   * @returns {object} Pattern decoration styles
   */
  getPatternIndicators() {
    return {
      // Code smells - visible warning
      codesmell: {
        color: "#ffaa00",
        icon: "◆",
        intensity: 70,
      },
      // Performance issues - red alert
      performance: {
        color: "#ff3366",
        icon: "⚡",
        intensity: 80,
      },
      // Best practices detected - positive feedback
      bestpractice: {
        color: "#00ff00",
        icon: "★",
        intensity: 60,
      },
      // Dead code - muted
      deadcode: {
        color: "#666666",
        icon: "○",
        intensity: 40,
      },
      // Security concern - urgent
      security: {
        color: "#ff0000",
        icon: "🔒",
        intensity: 90,
      },
      // Optimization opportunity
      optimization: {
        color: "#00ffff",
        icon: "⚙",
        intensity: 70,
      },
    };
  }

  /**
   * Create decorations with redundant visual cues
   * Color + shape + movement for accessibility
   * @param {string} patternType - Type of pattern
   * @returns {object} VSCode decoration config
   */
  createRedundantCue(patternType) {
    const patterns = this.getPatternIndicators();
    const pattern = patterns[patternType] || patterns.codesmell;

    return {
      backgroundColor: `${pattern.color}${Math.floor(pattern.intensity * 2.55).toString(16).padStart(2, "0")}`,
      border: `2px solid ${pattern.color}`,
      borderRadius: "3px",
      isWholeLine: false,
      gutterIconPath: null, // VSCode doesn't support custom glyphs, use decoration instead
      light: {
        backgroundColor: `${pattern.color}44`,
        border: `2px dashed ${pattern.color}`,
      },
    };
  }

  /**
   * Performance: Color code operations by duration
   * Fast (green) → Medium (yellow) → Slow (red)
   * @param {number} durationMs - Operation duration in ms
   * @returns {string} Color code
   */
  getPerformanceColor(durationMs) {
    if (durationMs < 10) return "#00ff00"; // Fast - neon green
    if (durationMs < 50) return "#00dd00"; // Good - bright green
    if (durationMs < 100) return "#aadd00"; // Fair - yellow-green
    if (durationMs < 200) return "#ffdd00"; // Slow - bright yellow
    if (durationMs < 500) return "#ffaa00"; // Very slow - orange
    return "#ff3366"; // Critical - red
  }

  /**
   * Generate CSS animation for visual interest
   * @param {string} animationType - pulse, bounce, glow, shake, blink
   * @returns {string} CSS animation code
   */
  generateAnimationCSS(animationType) {
    const anim = this.animations[animationType];
    if (!anim) return "";
    return `
      @keyframes ${animationType} {
        ${anim.keyframes}
      }
      .${animationType} {
        animation: ${animationType} ${anim.duration} infinite;
      }
    `;
  }

  /**
   * Create animated blinking highlight decoration (IntelliJ-style)
   * Code literally MOVES and BLINKS
   * @param {string} color - Hex color code
   * @param {number} opacity - 0-1 opacity value
   * @param {string} animationType - blink, pulse, glow, bounce, shake
   * @returns {vscode.TextEditorDecorationType} Animated decoration
   */
  createAnimatedHighlight(color, opacity = 0.8, animationType = "pulse") {
    const vscode = require("vscode");
    const rgba = this._hexToRgba(color, opacity);
    
    // Prevent overlapping decorations
    const decorKey = `${color}-${animationType}`;
    if (this.activeDecorations.has(decorKey)) {
      return null; // Already animated, avoid duplication
    }
    
    const decoration = vscode.window.createTextEditorDecorationType({
      // Animated background with thick colored border
      backgroundColor: rgba,
      border: `3px solid ${color}`,
      borderRadius: "4px",
      
      // Create blinking/pulsing motion effect
      opacity: opacity,
      isWholeLine: false,
      
      // Glow effect via outline
      outline: `2px solid ${color}`,
      outlineOffset: "2px",
      
      // Add underline motion
      textDecoration: "underline wavy",
      
      light: {
        backgroundColor: `${color}33`,
        border: `3px solid ${color}`,
      },
      dark: {
        backgroundColor: `${color}22`,
        border: `3px solid ${color}`,
      },
    });
    
    this.activeDecorations.add(decorKey);
    return decoration;
  }

  /**
   * Apply animated blinking highlight to ranges WITHOUT overlapping
   * Smart overlap detection prevents conflicting decorations
   * @param {vscode.TextEditor} editor - Active editor
   * @param {vscode.Range[]} ranges - Ranges to highlight
   * @param {string} color - Color code
   * @param {string} animationType - Animation type
   */
  applyBlinkingHighlight(editor, ranges, color, animationType = "pulse") {
    if (!editor || !ranges || ranges.length === 0) return;
    
    // Filter overlapping ranges to prevent conflicts
    const filtered = this._filterOverlappingRanges(ranges);
    
    const decoration = this.createAnimatedHighlight(color, 0.9, animationType);
    if (decoration && filtered.length > 0) {
      const rangesWithMessages = filtered.map(range => ({
        range,
        hoverMessage: `${animationType.toUpperCase()}: ${color}`,
      }));
      
      editor.setDecorations(decoration, rangesWithMessages);
    }
  }

  /**
   * Smart highlight - automatically chooses animation based on code context
   * ADHD mode: Uses multiple animations for different code elements
   * @param {vscode.TextEditor} editor - Active editor
   * @param {vscode.Range} range - Range to highlight
   * @param {string} contextType - 'function', 'loop', 'error', 'warning', 'success'
   */
  smartAnimatedHighlight(editor, range, contextType) {
    if (!editor) return;
    
    const animationMap = {
      function: { color: "#00aaff", animation: "pulse" },      // Cyan pulse - functions
      loop: { color: "#ffaa00", animation: "bounce" },          // Orange bounce - loops
      error: { color: "#ff3366", animation: "shake" },          // Red shake - errors
      warning: { color: "#ffaa00", animation: "blink" },        // Orange blink - warnings
      success: { color: "#00ff00", animation: "glow" },         // Green glow - success
      pattern: { color: "#ff00ff", animation: "glow" },         // Magenta glow - patterns
    };
    
    const config = animationMap[contextType] || animationMap.pattern;
    this.applyBlinkingHighlight(editor, [range], config.color, config.animation);
  }

  /**
   * Create decoration for code that "moves" on screen
   * Used for high-importance code (errors, complexity warnings)
   * @param {string} color - Highlight color
   * @returns {vscode.TextEditorDecorationType} Animated decoration
   */
  createMovingHighlight(color) {
    const vscode = require("vscode");
    const rgba = this._hexToRgba(color, 0.9);
    
    return vscode.window.createTextEditorDecorationType({
      backgroundColor: rgba,
      border: `2px dashed ${color}`,
      borderRadius: "3px",
      
      // Strong visual emphasis
      fontWeight: "bold",
      textDecoration: "underline wavy",
      
      // Glow/halo effect
      outline: `2px solid ${color}`,
      outlineOffset: "1px",
    });
  }

  /**
   * Helper: Convert hex to rgba
   * @private
   */
  _hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Helper: Filter overlapping ranges to prevent decoration conflicts
   * @private
   */
  _filterOverlappingRanges(ranges) {
    if (ranges.length <= 1) return ranges;
    
    const sorted = [...ranges].sort((a, b) => {
      if (a.start.line !== b.start.line) return a.start.line - b.start.line;
      return a.start.character - b.start.character;
    });
    
    const filtered = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const last = filtered[filtered.length - 1];
      
      // Skip if overlaps with last range
      if (!(current.start.line === last.end.line && current.start.character < last.end.character)) {
        filtered.push(current);
      }
    }
    
    return filtered;
  }

  /**
   * Dispose all animated decorations
   */
  dispose() {
    this.animationFrames.clear();
    this.activeDecorations.clear();
  }
}

module.exports = { NeuroUI };
