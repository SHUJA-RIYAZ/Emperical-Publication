/**
 * Simulates network latency for the mock service layer.
 * When a real backend is introduced, service functions swap their
 * `delay() + mock data` bodies for HTTP calls — signatures stay identical.
 */
export function delay(ms?: number): Promise<void> {
  const wait = ms ?? 500 + Math.random() * 300;
  return new Promise((resolve) => setTimeout(resolve, wait));
}
