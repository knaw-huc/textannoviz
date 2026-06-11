import { toast } from "react-toastify";

export async function fetchOrToast(
  url: string,
  signal: AbortSignal,
): Promise<Response | null> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return response;
}
