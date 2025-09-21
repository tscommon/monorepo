import { LRUCache } from '../src/index.js';

const cache = new LRUCache<string, number>(3);
cache.put('a', 1);
cache.put('b', 2);
cache.put('c', 3);
console.log(cache.get('a')); // Outputs: 1
cache.put('d', 4); // Evicts key 'b' as it is the least recently used
console.log(cache.has('b')); // Outputs: false
