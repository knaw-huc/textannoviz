/* eslint-disable @typescript-eslint/no-explicit-any */

export function observeMiradorStore(
  store: any,
  windowId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange: (canvasId: string) => void,
) {
  let currentValue: string;

  function handleChange() {
    const previousValue = currentValue;
    currentValue = store.getState().windows[windowId].canvasId;

    if (!previousValue) return;

    if (previousValue !== currentValue) {
      onChange(currentValue);
    }
  }

  handleChange();
  return store.subscribe(handleChange);
}
