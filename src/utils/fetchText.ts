import { fetchOrToast } from "./fetchOrToast";

export async function fetchText(
  url: string,
  signal: AbortSignal,
): Promise<string | null> {
  return fetchOrToast(url, signal).then((r) => r?.text() || null);
}
