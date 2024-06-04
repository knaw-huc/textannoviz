export function handleAbortControllerAbort(signal: AbortSignal) {
  if (!signal.aborted) {
    console.debug("Request not aborted.");
    return;
  }

  console.debug(
    `Request aborted with reason: ${signal.reason ?? "No reason given."}`,
  );
}
