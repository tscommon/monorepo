/* eslint-disable @typescript-eslint/no-non-null-assertion */

/**
 * An internal class representing a node in the doubly linked list.
 * This class is not exported as it's an implementation detail.
 */
class Node<K, V> {
  public key: K;
  public value: V;
  public next?: Node<K, V>;
  public prev?: Node<K, V>;

  public constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

/**
 * A Least Recently Used (LRU) Cache implementation.
 * {@includeCode ../examples/index.ts}
 * @template K - The type of keys in the cache.
 * @template V - The type of values in the cache.
 */
export class LRUCache<K, V> {
  private readonly _capacity: number;
  private readonly _cache: Map<K, Node<K, V>>;
  private readonly _head: Node<K, V>; // Sentinel node
  private readonly _tail: Node<K, V>; // Sentinel node

  /**
   * Creates an instance of LRUCache.
   * @param {number} capacity - The maximum number of items the cache can hold. Must be a positive number.
   * @throws {TypeError} when the provided capacity is not a positive number.
   * @complexity O(1)
   */
  public constructor(capacity: number) {
    if (capacity <= 0) {
      throw new TypeError('Capacity must be a positive number.');
    }
    this._capacity = capacity;
    this._cache = new Map<K, Node<K, V>>();

    // Initialize sentinel nodes using `undefined` for their payload.
    this._head = new Node<K, V>(undefined as K, undefined as V);
    this._tail = new Node<K, V>(undefined as K, undefined as V);

    // Connect the sentinel nodes to form an empty list
    this._head.next = this._tail;
    this._tail.prev = this._head;
  }

  /**
   * Retrieves the value associated with the given key from the cache.
   * This operation marks the item as recently used.
   * @param {K} key - The key of the item to retrieve.
   * @returns {V | undefined} The value of the item, or undefined if the key is not found.
   * @complexity O(1) on average.
   */
  public get(key: K): V | undefined {
    const node = this._cache.get(key);

    if (!node) {
      return undefined;
    }

    // Move the accessed node to the head of the list to mark it as most recently used.
    this._moveToHead(node);

    return node.value;
  }

  /**
   * Adds or updates a key-value pair in the cache.
   * This operation marks the item as recently used.
   * If adding a new item exceeds the cache's capacity, the least recently used item is evicted.
   * @param {K} key - The key of the item to add or update.
   * @param {V} value - The value of the item.
   * @complexity O(1) on average.
   */
  public put(key: K, value: V): void {
    const existingNode = this._cache.get(key);

    if (existingNode) {
      // Key already exists: update the value and move it to the head.
      existingNode.value = value;
      this._moveToHead(existingNode);
    } else {
      // Key is new: create a new node and add it.
      const newNode = new Node(key, value);
      this._cache.set(key, newNode);
      this._addToHead(newNode);

      // Check if eviction is needed.
      if (this._cache.size > this._capacity) {
        this._evictLRU();
      }
    }
  }

  /**
   * Checks if a key exists in the cache without updating its usage.
   * @param {K} key - The key to check.
   * @returns {boolean} True if the key exists, false otherwise.
   * @complexity O(1) on average.
   */
  public has(key: K): boolean {
    return this._cache.has(key);
  }

  /**
   * Removes an item from the cache.
   * @param {K} key - The key of the item to delete.
   * @returns {boolean} True if the item was found and deleted, false otherwise.
   * @complexity O(1) on average.
   */
  public delete(key: K): boolean {
    const node = this._cache.get(key);

    if (!node) {
      return false;
    }

    // Remove from both the linked list and the map
    this._removeNode(node);
    this._cache.delete(key);

    return true;
  }

  /**
   * Returns the current number of items in the cache.
   * @returns {number} The current size of the cache.
   * @complexity O(1)
   */
  public get size(): number {
    return this._cache.size;
  }

  /**
   * Returns the maximum capacity of the cache.
   * @returns {number} The capacity of the cache.
   * @complexity O(1)
   */
  public get capacity(): number {
    return this._capacity;
  }

  /**
   * Removes all items from the cache.
   * @complexity O(N), where N is the number of items in the cache.
   */
  public clear(): void {
    this._cache.clear();
    // Reset the doubly linked list to its initial empty state
    this._head.next = this._tail;
    this._tail.prev = this._head;
  }

  /**
   * Detaches a node from its current position in the linked list.
   */
  private _removeNode(node: Node<K, V>): void {
    const prevNode = node.prev!;
    const nextNode = node.next!;
    prevNode.next = nextNode;
    nextNode.prev = prevNode;
  }

  /**
   * Adds a node to the front of the linked list (right after the head sentinel).
   */
  private _addToHead(node: Node<K, V>): void {
    const originalFirstNode = this._head.next!;

    node.prev = this._head;
    node.next = originalFirstNode;

    this._head.next = node;
    originalFirstNode.prev = node;
  }

  /**
   * A convenience method that combines removing a node and adding it to the head.
   */
  private _moveToHead(node: Node<K, V>): void {
    this._removeNode(node);
    this._addToHead(node);
  }

  /**
   * Removes the least recently used item from the cache.
   */
  private _evictLRU(): void {
    const lruNode = this._tail.prev;
    if (lruNode && lruNode !== this._head) {
      this._removeNode(lruNode);
      this._cache.delete(lruNode.key);
    }
  }
}
