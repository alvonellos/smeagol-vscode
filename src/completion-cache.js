/**
 * Completion Cache Module
 * Provides intelligent caching for completion items to improve performance
 * Reduces memory pressure and CPU usage on large files
 */

class CompletionCache {
  constructor(maxItems = 500, ttlMs = 5 * 60 * 1000) {
    this.cache = new Map();
    this.maxItems = maxItems;
    this.ttlMs = ttlMs;
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }

  /**
   * Get cached completion items for a context
   * @param {string} key - Cache key (language, position context, etc.)
   * @returns {Array|null} Cached items or null if not found/expired
   */
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    entry.lastAccess = Date.now();
    return entry.items;
  }

  /**
   * Set completion items in cache
   * @param {string} key - Cache key
   * @param {Array} items - Completion items to cache
   */
  set(key, items) {
    // Evict LRU item if cache is full
    if (this.cache.size >= this.maxItems) {
      this._evictLRU();
    }

    this.cache.set(key, {
      items: items,
      timestamp: Date.now(),
      lastAccess: Date.now()
    });
  }

  /**
   * Clear entire cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} Stats with hits, misses, hit rate
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) : 0;

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      size: this.cache.size,
      maxSize: this.maxItems
    };
  }

  /**
   * Evict least recently used item
   * @private
   */
  _evictLRU() {
    let lruKey = null;
    let lruTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccess < lruTime) {
        lruTime = entry.lastAccess;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      this.stats.evictions++;
    }
  }
}

module.exports = { CompletionCache };
