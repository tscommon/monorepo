import { setTimeout } from "timers/promises";
import { synchronized } from "../src";

class SynchronizedObject {
  @synchronized
  public async execute(value: number): Promise<void> {
    console.log(value);
    await setTimeout(Math.random() * 1000);
  }
}

const obj = new SynchronizedObject();

obj.execute(1);
obj.execute(2);
obj.execute(3);

// 1
// 2
// 3
