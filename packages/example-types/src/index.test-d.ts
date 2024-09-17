import { expectType } from "tsd";
import { Example } from ".";

expectType<Example>({ name: "example" });
