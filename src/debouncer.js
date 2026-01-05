/**
 * Debouncer Utility
 * Prevents excessive function calls by delaying execution until activity stops
 * Used for completion requests, analysis, and other expensive operations
 */

class Debouncer {
  constructor(func, delayMs = 300) {
    this.func = func;
    this.delayMs = delayMs;
    this.timeout = null;
    this.lastCallTime = 0;
    this.lastArgs = null;
    this.stats = {
      calls: 0,
      executed: 0,
      cancelled: 0
    };
  }

  /**
   * Call with debouncing
   * @param {...any} args - Arguments to pass to function
   * @returns {Promise} Resolves when debounced function executes
   */
  call(...args) {
    return new Promise((resolve, reject) => {
      this.stats.calls++;
      this.lastArgs = args;
      this.lastCallTime = Date.now();

      // Clear existing timeout
      if (this.timeout) {
        this.stats.cancelled++;
        clearTimeout(this.timeout);
      }

      // Set new timeout
      this.timeout = setTimeout(() => {
        try {
          this.stats.executed++;
          const result = this.func(...this.lastArgs);
          
          // Handle both sync and async functions
          if (result instanceof Promise) {
            result.then(resolve).catch(reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        } finally {
          this.timeout = null;
        }
      }, this.delayMs);
    });
  }

  /**
   * Cancel any pending execution
   */
  cancel() {
    if (this.timeout) {
      this.stats.cancelled++;
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  /**
   * Execute immediately, bypassing debounce
   * @param {...any} args - Arguments to pass to function
   * @returns {any} Result of function
   */
  flush(...args) {
    this.cancel();
    this.stats.executed++;
    return this.func(...(args.length > 0 ? args : this.lastArgs || []));
  }

  /**
   * Get debouncer statistics
   * @returns {Object} Stats with call/execution/cancellation counts
   */
  getStats() {
    return {
      ...this.stats,
      efficiencyRate: this.stats.calls > 0 
        ? ((this.stats.executed / this.stats.calls) * 100).toFixed(2) + '%'
        : 'N/A'
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      calls: 0,
      executed: 0,
      cancelled: 0
    };
  }
}

module.exports = { Debouncer };
