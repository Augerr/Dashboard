type RetryOptions = {
  retries?: number;
  delay?: number;
  onRetry?: (error: unknown, attempt: number) => void;
};

export async function retryAsync<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { retries = 5, delay = 3000, onRetry } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      if (attempt === retries) {
        throw lastError;
      }

      if (onRetry) {
        onRetry(err, attempt + 1);
      }

      const backoff = delay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }

  throw lastError; // fallback (should never hit)
}
