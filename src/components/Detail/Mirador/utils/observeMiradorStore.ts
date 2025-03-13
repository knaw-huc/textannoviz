import { Any } from "../../../utils/Any";

export function observeMiradorStore(
  store: Any,
  windowId: string,
  onCanvasChange: (canvasId: string) => void,
) {
  let currentValue: string | undefined;

  function handleCanvasChange() {
    const previousValue = currentValue;
    currentValue = store.getState().windows[windowId].canvasId;

    if (!previousValue) return;

    if (currentValue && previousValue !== currentValue) {
      onCanvasChange(currentValue);
    }
  }

  handleCanvasChange();

  const unsubscribe = store.subscribe(handleCanvasChange);

  return unsubscribe;
}
