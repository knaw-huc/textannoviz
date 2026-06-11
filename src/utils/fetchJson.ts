import { fetchOrToast } from "./fetchOrToast";

export async function fetchJson<T = unknown>(
  url: string,
  signal: AbortSignal,
): Promise<T | null> {
  return fetchOrToast(url, signal).then((r) => r?.json() || null);
}
