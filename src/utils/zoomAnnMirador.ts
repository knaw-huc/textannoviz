import { AnnoRepoAnnotation } from "../model/AnnoRepoAnnotation";
import { findImageRegions } from "./findImageRegions";

export const zoomAnnMirador = (
  annotation: AnnoRepoAnnotation,
  canvasId: string
) => {
  const region = findImageRegions(annotation, canvasId);
  const [x, y, w, h] = region[0].split(",").map(Number);
  const boxToZoom = { x, y, width: w, height: h };
  const zoomCenter = {
    x: boxToZoom.x + boxToZoom.width / 2,
    y: boxToZoom.y + boxToZoom.height / 2,
  };

  const miradorZoom = boxToZoom.width + boxToZoom.height / 2;

  return { zoomCenter, miradorZoom };
};
