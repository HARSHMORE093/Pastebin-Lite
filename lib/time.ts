export function getNowMs(headers: Headers): number {
    if (process.env.TEST_MODE === "1") {
      const val = headers.get("x-test-now-ms");
      if (val) return parseInt(val, 10);
    }
    return Date.now();
  }
  