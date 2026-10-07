import time
import threading

class MemoryCache:
    def __init__(self, default_ttl=300):
        self._cache = {}
        self._lock = threading.Lock()
        self.default_ttl = default_ttl

    def get(self, key):
        with self._lock:
            if key not in self._cache:
                return None
            item, expires_at = self._cache[key]
            if time.time() > expires_at:
                del self._cache[key]
                return None
            return item

    def set(self, key, value, ttl=None):
        if ttl is None:
            ttl = self.default_ttl
        expires_at = time.time() + ttl
        with self._lock:
            self._cache[key] = (value, expires_at)

    def clear(self):
        with self._lock:
            self._cache.clear()

    def cleanup_expired(self):
        now = time.time()
        with self._lock:
            expired_keys = [k for k, (_, exp) in self._cache.items() if now > exp]
            for k in expired_keys:
                del self._cache[k]
