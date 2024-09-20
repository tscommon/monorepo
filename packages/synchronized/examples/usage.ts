import { setTimeout } from "timers/promises";
import { synchronized } from "../src/synchronized";

class SynchronizedObject {
  @synchronized
  public async serially(value: number): Promise<void> {
    console.log("Running serially", value);
    await setTimeout(Math.random() * 1000);
  }
}

const obj = new SynchronizedObject();

obj.serially(1);
obj.serially(2);
obj.serially(3);

// Running serially 1
// Running serially 2
// Running serially 3
