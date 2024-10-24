import { None, Option, Some } from '../src';

let data: Option<number> = Option.some(42);

if (Option.is(data, Some)) {
  // Data is present
}

data = Option.none;

if (Option.is(data, None)) {
  // Data is absent
}
