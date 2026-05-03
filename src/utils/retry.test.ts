import { describe, expect, it, vi } from "vitest";
import { retryAsync } from "./retry";

describe("retryAsync", () => {
  it("retries until the function succeeds", async () => {
    const onRetry = vi.fn();
    const task = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("first failure"))
      .mockResolvedValueOnce("ok");

    await expect(
      retryAsync(task, { retries: 2, delay: 0, onRetry }),
    ).resolves.toBe("ok");
    expect(task).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenCalledWith(expect.any(Error), 1);
  });

  it("throws the final error after all retries are exhausted", async () => {
    const error = new Error("still broken");
    const task = vi.fn<() => Promise<string>>().mockRejectedValue(error);

    await expect(retryAsync(task, { retries: 1, delay: 0 })).rejects.toThrow(
      "still broken",
    );
    expect(task).toHaveBeenCalledTimes(2);
  });
});
