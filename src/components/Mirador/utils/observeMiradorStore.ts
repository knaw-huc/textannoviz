/* eslint-disable @typescript-eslint/no-explicit-any */

export function observeMiradorStore(
  store: any,
  windowId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onChange?: any,
) {
  let currentValue: string;

  function handleChange() {
    const previousValue = currentValue;
    currentValue = store.getState().windows[windowId].canvasId;

    if (previousValue !== currentValue) {
      console.log("niet hetzelfde");
      console.log(previousValue, currentValue);
    }
  }

  handleChange();
  return store.subscribe(handleChange);
}
