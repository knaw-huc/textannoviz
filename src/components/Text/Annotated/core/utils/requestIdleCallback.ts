/**
 * Queue a function to be called during a browser's idle period
 * Source: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
 */
export const requestIdleCallback: typeof requestIdleCallbackShim =
  "requestIdleCallback" in window
    ? window.requestIdleCallback
    : requestIdleCallbackShim;

/**
 * Safari does not support window.requestIdleCallback
 * Source: https://developer.chrome.com/blog/using-requestidlecallback
 */
function requestIdleCallbackShim(
  callback: IdleRequestCallback,
  options?: IdleRequestOptions,
) {
  const start = Date.now();
  return window.setTimeout(
    () =>
      callback({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        },
      }),
    options?.timeout || 1,
  );
}

export const cancelIdleCallback =
  "cancelIdleCallback" in window
    ? window.cancelIdleCallback
    : (id: number) => clearTimeout(id);
