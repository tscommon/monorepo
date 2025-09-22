/**
 * A high-performance, memory-efficient double-ended queue (deque)
 * that automatically grows and can be configured to shrink.
 */
export class Deque<T> implements Iterable<T> {
  private _buffer: (T | undefined)[];
  private _capacity: number;
  private _length: number;
  private _head: number;
  private _tail: number;
  private _mask: number;
  private _autoShrink: boolean;

  // A minimum capacity below which the deque will not shrink.
  private static readonly _MINIMUM_CAPACITY = 16;

  /**
   * @param initialCapacity - Initial capacity of the deque.
   * @param autoShrink - Whether the deque should automatically shrink when elements are removed.
   * @throws {TypeError} when the provided capacity is not a positive number.
   */
  public constructor(initialCapacity = 16, autoShrink = true) {
    if (initialCapacity <= 0) {
      throw new RangeError('Initial capacity must be a positive integer');
    }
    this._capacity = this._nextPowerOfTwo(initialCapacity);
    this._mask = this._capacity - 1; // For bitmasking
    this._buffer = new Array<T | undefined>(this._capacity);
    this._autoShrink = autoShrink;
    this._length = 0;
    this._head = 0;
    this._tail = 0;
  }

  /**
   * The number of elements in the deque.
   * @complexity O(1)
   */
  public get length(): number {
    return this._length;
  }

  /**
   * Checks if the deque is empty.
   * @complexity O(1)
   */
  public get empty(): boolean {
    return this._length === 0;
  }

  /**
   * Adds an element to the back of the deque.
   * @complexity O(1) amortized
   */
  public push(value: T): number {
    if (this._length === this._capacity) {
      this._resize(this._capacity * 2);
    }
    this._buffer[this._tail] = value;
    this._tail = (this._tail + 1) & this._mask;
    return ++this._length;
  }

  /**
   * Removes and returns the element from the back of the deque.
   * @complexity O(1) amortized
   */
  public pop(): T | undefined {
    if (this._length === 0) {
      return undefined;
    }
    this._tail = (this._tail - 1) & this._mask;
    const value = this._buffer[this._tail];
    this._buffer[this._tail] = undefined; // Help GC
    this._length--;

    // Shrink check is now conditional
    if (this._autoShrink && this._capacity > Deque._MINIMUM_CAPACITY && this._length < this._capacity / 4) {
      this._resize(this._capacity / 2);
    }

    return value;
  }

  /**
   * Adds an element to the front of the deque.
   * @complexity O(1) amortized
   */
  public unshift(value: T): number {
    if (this._length === this._capacity) {
      this._resize(this._capacity * 2);
    }
    this._head = (this._head - 1) & this._mask;
    this._buffer[this._head] = value;
    return ++this._length;
  }

  /**
   * Removes and returns the element from the front of the deque.
   * @complexity O(1) amortized
   */
  public shift(): T | undefined {
    if (this._length === 0) {
      return undefined;
    }
    const value = this._buffer[this._head];
    this._buffer[this._head] = undefined; // Help GC
    this._head = (this._head + 1) & this._mask;
    this._length--;

    // Shrink check is now conditional
    if (this._autoShrink && this._capacity > Deque._MINIMUM_CAPACITY && this._length < this._capacity / 4) {
      this._resize(this._capacity / 2);
    }

    return value;
  }

  /**
   * Returns the first element.
   * @complexity O(1)
   */
  public get first(): T | undefined {
    return this._length === 0 ? undefined : this._buffer[this._head];
  }

  /**
   * Returns the last element.
   * @complexity O(1)
   */
  public get last(): T | undefined {
    if (this._length === 0) {
      return undefined;
    }
    const lastIndex = (this._tail - 1) & this._mask;
    return this._buffer[lastIndex];
  }

  /**
   * Clears all elements from the deque.
   * @complexity O(n)
   */
  public clear(): void {
    for (let i = 0; i < this._length; i++) {
      this._buffer[(this._head + i) & this._mask] = undefined;
    }
    this._length = 0;
    this._head = 0;
    this._tail = 0;
  }

  /**
   * Calculates the next power of two greater than or equal to n.
   */
  private _nextPowerOfTwo(n: number): number {
    n--;
    n |= n >> 1;
    n |= n >> 2;
    n |= n >> 4;
    n |= n >> 8;
    n |= n >> 16;
    return n + 1;
  }

  /**
   * Resizes the internal buffer (for both growing and shrinking).
   */
  private _resize(newCapacity: number): void {
    const newBuffer = new Array<T | undefined>(newCapacity);
    const oldBuffer = this._buffer;
    const head = this._head;
    const mask = this._mask; // Use the old mask for copying

    if (this._length > 0) {
      for (let i = 0; i < this._length; i++) {
        newBuffer[i] = oldBuffer[(head + i) & mask];
      }
    }

    this._buffer = newBuffer;
    this._capacity = newCapacity;
    this._mask = newCapacity - 1;
    this._head = 0;
    this._tail = this._length;
  }

  /**
   * Returns an iterator over the elements of the deque.
   * @complexity O(n)
   */
  public [Symbol.iterator](): Iterator<T> {
    let index = 0;
    const { _length, _head, _mask, _buffer } = this;

    return {
      next(): IteratorResult<T> {
        if (index < _length) {
          const value = _buffer[(_head + index) & _mask] as T;
          index++;
          return { value, done: false };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  }
}
