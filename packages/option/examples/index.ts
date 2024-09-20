import { Option } from "../src";

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
