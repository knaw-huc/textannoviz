import { useEffect } from "react";
import { useViewer, useViewerReady } from "@knaw-huc/osd-iiif-viewer";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { findImageRegions } from "../../utils/findImageRegions";

export function useZoomToAnnotation(
  bodyId: string | null,
  annotations: AnnoRepoAnnotation[],
  canvasId: string | null,
) {
  const viewer = useViewer();
  const viewerReady = useViewerReady();

  useEffect(() => {
    if (
      !viewer ||
      !viewerReady ||
      !bodyId ||
      !annotations.length ||
      !canvasId
    ) {
      return;
    }

    const annotation = annotations.find((a) => a.body.id === bodyId);
    if (!annotation) {
      return;
    }

    const region = findImageRegions(annotation, canvasId);
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
  }, [bodyId, viewer, annotations, canvasId, viewerReady]);
}
