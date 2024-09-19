import type { Option } from "./Option";

export type OptionType<T> = T extends Option<infer U> ? U : T;
