export function handleAbort(e: Error) {
  if (e instanceof DOMException && e.name == "AbortError") {
    console.debug("useEffect cleanup aborted request:", e);
  } else {
    throw e;
  }
}