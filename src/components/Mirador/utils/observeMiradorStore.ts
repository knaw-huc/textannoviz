import { Any } from "../../../utils/Any";

export function observeMiradorStore(
  store: Any,
  windowId: string,
  onCanvasChange: (canvasId: string) => void,
) {
  let currentCanvas: string | undefined;
  let currentCoords:
    | {
        flip: boolean;
        rotation: number;
        x: number;
        y: number;
        zoom: number;
      }
    | null
    | undefined;

  function handleCanvasChange() {
    const previousCanvas = currentCanvas;
    currentCoords = store.getState().viewers[windowId];

    if (currentCoords) {
      currentCanvas = store.getState().windows[windowId].canvasId;

      if (!previousCanvas) return;

      if (currentCanvas && previousCanvas !== currentCanvas) {
        onCanvasChange(currentCanvas);
      }
    }
  }

  handleCanvasChange();

  const unsubscribe = store.subscribe(handleCanvasChange);

  return unsubscribe;
}
