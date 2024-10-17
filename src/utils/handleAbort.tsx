export function handleAbort(e: Error) {
  if (e instanceof DOMException && e.name == "AbortError") {
    console.debug("useEffect request aborted");
  } else {
    throw e;
  }
}
