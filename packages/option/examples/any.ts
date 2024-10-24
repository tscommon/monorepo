import { Option } from '../src';

Option.any([Option.some(1), Option.some(2)]);

// Output:
// Some { value: 1 }

Option.any([Option.some(1), Option.none]);

// Output:
// Some { value: 1 }
