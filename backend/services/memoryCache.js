/**
 * Simple In-Memory TTL Cache for backend job search queries
 */
class MemoryCache {
  constructor(defaultTtl = 300) {
    this.cache = new Map();
    this.defaultTtl = defaultTtl;
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const { value, expiresAt } = this.cache.get(key);
    if (Date.now() > expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return value;
  }

  set(key, value, ttl = null) {
    const timeToLive = ttl !== null ? ttl : this.defaultTtl;
    const expiresAt = Date.now() + (timeToLive * 1000);
    this.cache.set(key, { value, expiresAt });
  }

  clear() {
    this.cache.clear();
  }
}

module.exports = MemoryCache;
