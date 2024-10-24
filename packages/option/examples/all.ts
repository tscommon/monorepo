import { Option } from '../src';

Option.all([Option.some(1), Option.some(2)]);

// Output:
// Some { value: [1, 2] }

Option.all([Option.some(1), Option.none]);

// Output:
// None {}
