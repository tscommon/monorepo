import { beforeEach, describe, expect, it } from 'vitest';
import { LRUCache } from './LRUCache.js';

describe('LRUCache', () => {
  let cache: LRUCache<string, number>;

  describe('Initialization', () => {
    it('should create a cache with the specified capacity', () => {
      const cacheInstance = new LRUCache<string, number>(10);
      expect(cacheInstance.size).toBe(0);
    });

    it('should throw an error if capacity is zero or less', () => {
      expect(() => new LRUCache(0)).toThrow('Capacity must be a positive number');
      expect(() => new LRUCache(-5)).toThrow('Capacity must be a positive number');
    });
  });

  describe('Core Functionality', () => {
    beforeEach(() => {
      cache = new LRUCache<string, number>(3);
    });

    it('should set and get a value', () => {
      cache.set('a', 1);
      expect(cache.get('a')).toBe(1);
      expect(cache.size).toBe(1);
    });

    it('should return undefined for a non-existent key', () => {
      expect(cache.get('non-existent')).toBeUndefined();
    });

    it('should update the value of an existing key', () => {
      cache.set('a', 1);
      cache.set('a', 100);
      expect(cache.get('a')).toBe(100);
      expect(cache.size).toBe(1);
    });

    it('should handle different key and value types', () => {
      const objCache = new LRUCache<object, object>(2);
      const key1 = { id: 1 };
      const val1 = { data: 'A' };
      const key2 = { id: 2 };
      const val2 = { data: 'B' };

      objCache.set(key1, val1);
      objCache.set(key2, val2);

      expect(objCache.get(key1)).toBe(val1);
      expect(objCache.get(key2)).toBe(val2);
      expect(objCache.size).toBe(2);
    });
  });

  describe('LRU Eviction Policy', () => {
    beforeEach(() => {
      cache = new LRUCache<string, number>(3);
      cache.set('a', 1); // a is LRU
      cache.set('b', 2); // b is middle
      cache.set('c', 3); // c is MRU
    });

    it('should evict the least recently used item when capacity is exceeded', () => {
      expect(cache.size).toBe(3);

      // 'a' is the least recently used. Adding 'd' should evict 'a'.
      cache.set('d', 4);

      expect(cache.size).toBe(3);
      expect(cache.get('a')).toBeUndefined(); // 'a' should be gone
      expect(cache.get('b')).toBe(2);
      expect(cache.get('c')).toBe(3);
      expect(cache.get('d')).toBe(4);
    });

    it('should make an item the most recently used on `get`', () => {
      // Access 'a', making it the MRU. The new order should be b (LRU), c, a (MRU).
      cache.get('a');

      // Adding 'd' should now evict 'b'.
      cache.set('d', 4);

      expect(cache.size).toBe(3);
      expect(cache.get('b')).toBeUndefined(); // 'b' should be evicted
      expect(cache.get('a')).toBe(1);
      expect(cache.get('c')).toBe(3);
      expect(cache.get('d')).toBe(4);
    });

    it('should make an item the most recently used on `set` (update)', () => {
      // Update 'a', making it the MRU. New order: b (LRU), c, a (MRU).
      cache.set('a', 100);

      // Adding 'd' should now evict 'b'.
      cache.set('d', 4);

      expect(cache.size).toBe(3);
      expect(cache.get('b')).toBeUndefined(); // 'b' should be evicted
      expect(cache.get('a')).toBe(100);
      expect(cache.get('c')).toBe(3);
      expect(cache.get('d')).toBe(4);
    });

    it('should work correctly with a capacity of 1', () => {
      const smallCache = new LRUCache<string, number>(1);
      smallCache.set('a', 1);
      expect(smallCache.get('a')).toBe(1);

      smallCache.set('b', 2); // This should evict 'a'
      expect(smallCache.get('a')).toBeUndefined();
      expect(smallCache.get('b')).toBe(2);
      expect(smallCache.size).toBe(1);
    });

    it('should return true and remove the item if the key exists', () => {
      const initialSize = cache.size;

      const result = cache.delete('b');

      expect(result).toBe(true);
      expect(cache.size).toBe(initialSize - 1);
      expect(cache.has('b')).toBe(false);
      expect(cache.get('b')).toBeUndefined();
    });

    it('should not affect other items when one is deleted', () => {
      cache.delete('b');
      expect(cache.get('a')).toBe(1);
      expect(cache.get('c')).toBe(3);
    });

    it('should return false if the key does not exist', () => {
      const initialSize = cache.size;

      const result = cache.delete('non-existent');

      expect(result).toBe(false);
      expect(cache.size).toBe(initialSize);
    });

    it('should correctly handle deleting the least recently used item', () => {
      // Order is a (LRU), b, c (MRU)
      cache.delete('a'); // Delete the LRU item

      expect(cache.has('a')).toBe(false);
      expect(cache.size).toBe(2);

      // Now 'b' is the LRU. Adding two more items should evict 'b'.
      cache.set('d', 4);
      cache.set('e', 5);

      expect(cache.size).toBe(3);
      expect(cache.has('b')).toBe(false); // 'b' was correctly evicted
      expect(cache.has('c')).toBe(true);
    });

    it('should correctly handle deleting the most recently used item', () => {
      // Order is a (LRU), b, c (MRU)
      cache.delete('c'); // Delete the MRU item

      expect(cache.has('c')).toBe(false);
      expect(cache.size).toBe(2);

      // Now 'b' is the MRU and 'a' is the LRU. Adding two items should evict 'a'.
      cache.set('d', 4);
      cache.set('e', 5);

      expect(cache.size).toBe(3);
      expect(cache.has('a')).toBe(false); // 'a' was correctly evicted
      expect(cache.has('b')).toBe(true);
    });
  });

  describe('Helper Methods', () => {
    beforeEach(() => {
      cache = new LRUCache<string, number>(2);
      cache.set('a', 1);
      cache.set('b', 2);
    });

    it('`has` should return true for existing keys and false for non-existent ones', () => {
      expect(cache.has('a')).toBe(true);
      expect(cache.has('c')).toBe(false);
    });

    it('`has` should not update the usage order of an item', () => {
      // Order: a (LRU), b (MRU)
      cache.has('a'); // Check for 'a'

      // Add 'c', which should evict the LRU item, 'a'
      cache.set('c', 3);

      expect(cache.has('a')).toBe(false); // 'a' was not promoted and got evicted
      expect(cache.has('b')).toBe(true);
      expect(cache.has('c')).toBe(true);
    });

    it('`clear` should remove all items from the cache', () => {
      expect(cache.size).toBe(2);
      cache.clear();
      expect(cache.size).toBe(0);
      expect(cache.has('a')).toBe(false);
      expect(cache.get('b')).toBeUndefined();
    });
  });
});
