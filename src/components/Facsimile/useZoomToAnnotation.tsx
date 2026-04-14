import { useEffect } from "react";
import { useViewer } from "@knaw-huc/osd-iiif-viewer";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { findImageRegions } from "../../utils/findImageRegions";

export function useZoomToAnnotation(
  bodyId: string | null,
  annotations: AnnoRepoAnnotation[],
  canvasId: string | null,
) {
  const viewer = useViewer();

  useEffect(() => {
    if (!viewer || !bodyId || !annotations.length || !canvasId) {
      return;
    }

    const anno = annotations.find((a) => a.body.id === bodyId);
    if (!anno) {
      return;
    }

    const region = findImageRegions(anno, canvasId);
    if (!region) {
      console.debug("Could not zoom to annotation:", bodyId);
      return;
    }

    const [x, y, w, h] = region[0].split(",").map(Number);
    const padding = 100;
    const rect = viewer.viewport.imageToViewportRectangle(
      x - padding,
      y - padding,
      w + padding * 2,
      h + padding * 2,
    );
    viewer.viewport.fitBounds(rect);
  }, [bodyId, viewer, annotations, canvasId]);
}
