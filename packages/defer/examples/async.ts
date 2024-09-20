import { DeferFunction } from "../src";

function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function main() {
  await using defer = new DeferFunction(); // It is important to use the `using` keyword here.
  console.log("start");
  defer(async () => (await sleep(1000), console.log("a")));
  defer(async () => (await sleep(1000), console.log("b")));
  console.log("end");
}

main();

// Output:
// start
// end
// b
// a
