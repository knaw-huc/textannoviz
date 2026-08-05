import { toast } from "./toast";

export async function fetchOrToast(
  url: string,
  signal: AbortSignal,
): Promise<Response | null> {
  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    // Aborts are intentional (e.g. unmount, new request): let the caller handle them
    if (
      signal.aborted ||
      (error instanceof DOMException && error.name === "AbortError")
    ) {
      throw error;
    }
    // fetch only rejects when the request never reached the server
    toast(`Could not reach ${url}`, { type: "error" });
    return null;
  }
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return response;
}
