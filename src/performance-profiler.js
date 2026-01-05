/**
 * Performance Profiler
 * Measures execution time, memory usage, and cache hit rates
 * Used to validate optimization impact
 */

class PerformanceProfiler {
  constructor(name) {
    this.name = name;
    this.metrics = {
      executions: [],
      memorySnapshots: [],
      cacheMisses: 0,
      cacheHits: 0,
      averageExecTimeMs: 0,
      peakMemoryMb: 0,
      totalTime: 0
    };
    this.startTime = null;
  }

  /**
   * Start timing an operation
   */
  startTimer() {
    this.startTime = performance.now();
  }

  /**
   * End timing and record the measurement
   */
  endTimer() {
    if (!this.startTime) return;
    const elapsed = performance.now() - this.startTime;
    this.metrics.executions.push(elapsed);
    this.metrics.totalTime += elapsed;
    this.startTime = null;
    return elapsed;
  }

  /**
   * Record a cache hit
   */
  recordCacheHit() {
    this.metrics.cacheHits++;
  }

  /**
   * Record a cache miss
   */
  recordCacheMiss() {
    this.metrics.cacheMisses++;
  }

  /**
   * Snapshot current memory usage
   */
  snapshotMemory() {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      const heapUsedMb = memUsage.heapUsed / 1024 / 1024;
      this.metrics.memorySnapshots.push(heapUsedMb);
      
      if (heapUsedMb > this.metrics.peakMemoryMb) {
        this.metrics.peakMemoryMb = heapUsedMb;
      }
    }
  }

  /**
   * Get comprehensive metrics report
   */
  getReport() {
    const count = this.metrics.executions.length;
    const totalHits = this.metrics.cacheHits + this.metrics.cacheMisses;
    
    if (count > 0) {
      this.metrics.averageExecTimeMs = (this.metrics.totalTime / count).toFixed(2);
    }

    return {
      name: this.name,
      executionCount: count,
      totalTimeMs: this.metrics.totalTime.toFixed(2),
      averageTimeMs: this.metrics.averageExecTimeMs,
      minTimeMs: count > 0 ? Math.min(...this.metrics.executions).toFixed(2) : 'N/A',
      maxTimeMs: count > 0 ? Math.max(...this.metrics.executions).toFixed(2) : 'N/A',
      cacheHitRate: totalHits > 0 ? ((this.metrics.cacheHits / totalHits) * 100).toFixed(2) + '%' : 'N/A',
      peakMemoryMb: this.metrics.peakMemoryMb.toFixed(2),
      totalCacheHits: this.metrics.cacheHits,
      totalCacheMisses: this.metrics.cacheMisses
    };
  }

  /**
   * Reset all metrics
   */
  reset() {
    this.metrics = {
      executions: [],
      memorySnapshots: [],
      cacheMisses: 0,
      cacheHits: 0,
      averageExecTimeMs: 0,
      peakMemoryMb: 0,
      totalTime: 0
    };
  }

  /**
   * Format report for logging
   */
  formatReport() {
    const report = this.getReport();
    return `
╔════════════════════════════════════════╗
║ PERFORMANCE PROFILE: ${report.name.padEnd(22)} ║
╠════════════════════════════════════════╣
║ Executions:        ${String(report.executionCount).padEnd(23)} │
║ Total Time:        ${String(report.totalTimeMs + 'ms').padEnd(23)} │
║ Average Time:      ${String(report.averageTimeMs + 'ms').padEnd(23)} │
║ Min/Max Time:      ${String(report.minTimeMs + '/' + report.maxTimeMs + 'ms').padEnd(23)} │
╠════════════════════════════════════════╣
║ Cache Hit Rate:    ${String(report.cacheHitRate).padEnd(23)} │
║ Cache Hits:        ${String(report.totalCacheHits).padEnd(23)} │
║ Cache Misses:      ${String(report.totalCacheMisses).padEnd(23)} │
╠════════════════════════════════════════╣
║ Peak Memory:       ${String(report.peakMemoryMb + 'MB').padEnd(23)} │
╚════════════════════════════════════════╝
    `;
  }
}

module.exports = { PerformanceProfiler };
