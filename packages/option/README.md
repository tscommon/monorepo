# Some/None Value

[![Runkit](https://badgen.net/badge/runkit/playground/cyan)](https://npm.runkit.com/some-none)

`Option` represents an optional value: it is either `some` and contains a value, or `none`, and does not.

## Installation

```
npm i some-none --save
```

```
yarn add some-none
```

## Usage

```ts
import { Option } from "some-none";

let a: Option<number> = Option.some(42);

switch (a) {
  case Option.none:
    console.log("No value");
    break;
  default:
    console.log("Some value");
    break;
}

console.log(a.unwrap());

a = Option.none;

switch (a) {
  case Option.none:
    console.log("No value");
    break;
}
```
