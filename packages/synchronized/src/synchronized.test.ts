import { beforeEach, describe, expect, test, vi } from "vitest";
import { synchronized } from "./synchronized";

const fn = vi.fn();

class SynchronizedObject {
  public async parallel(ms: number): Promise<unknown> {
    return this.impl(ms);
  }

  @synchronized
  public async serially(ms: number): Promise<unknown> {
    return this.impl(ms);
  }

  protected impl(ms: number) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          resolve(await fn.call(this, ms));
        } catch (e) {
          reject(e);
        }
      }, ms);
    });
  }
}

describe("synchronized", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test("runs serially with @synchronized", async () => {
    const a = new SynchronizedObject();
    fn.mockResolvedValueOnce("a");
    fn.mockResolvedValueOnce("b");
    fn.mockResolvedValueOnce("c");
    const res = Promise.all([
      a.serially(300),
      a.serially(200),
      a.serially(100),
    ]);
    vi.advanceTimersToNextTimerAsync();
    vi.advanceTimersToNextTimerAsync();
    vi.advanceTimersToNextTimerAsync();
    await expect(res).resolves.toStrictEqual(["a", "b", "c"]);
  });

  test("runs in parallel without @synchronized", async () => {
    const a = new SynchronizedObject();
    fn.mockResolvedValueOnce("a");
    fn.mockResolvedValueOnce("b");
    fn.mockResolvedValueOnce("c");
    const res = Promise.all([
      a.parallel(300),
      a.parallel(200),
      a.parallel(100),
    ]);
    vi.advanceTimersToNextTimerAsync();
    vi.advanceTimersToNextTimerAsync();
    vi.advanceTimersToNextTimerAsync();
    await expect(res).resolves.toStrictEqual(["c", "b", "a"]);
  });

  test("reports an error to the caller but ignores for the next", async () => {
    const a = new SynchronizedObject();
    fn.mockRejectedValueOnce(new Error());
    fn.mockResolvedValueOnce("next");
    const p1 = a.serially(200);
    const p2 = a.serially(100);
    vi.advanceTimersToNextTimerAsync();
    vi.advanceTimersToNextTimerAsync();
    await expect(p1).rejects.toThrow();
    await expect(p2).resolves.toBe("next");
  });
});
