import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { useZoomToAnnotation } from "./useZoomToAnnotation.tsx";
import { useMemo } from "react";
import { findSvgSelector } from "../../utils/findSvgSelector.ts";
import { AnnotationHighlight } from "./AnnotationHighlight.tsx";
import { getHighlightColor } from "./getHighlightColor.ts";
import { Overlay, useCanvas, useImageInfo } from "@knaw-huc/osd-iiif-viewer";

export function AnnotationHighlightsOverlay() {
  const projectConfig = useProjectStore(projectConfigSelector);
  const annotations = useAnnotationStore((state) => state.annotations);
  const bodyId = useAnnotationStore((state) => state.bodyId);
  const { currentCanvasId } = useCanvas();
  const imageInfo = useImageInfo();

  useZoomToAnnotation(bodyId, annotations, currentCanvasId);

  const highlights = useMemo(() => {
    if (!annotations.length || !currentCanvasId) {
      return [];
    }
    return annotations.flatMap((annotation) => {
      const selector = findSvgSelector(annotation, currentCanvasId);
      if (!selector) {
        return [];
      }
      const id = annotation.body.id;
      return [{ id, selector, annotation }];
    });
  }, [annotations, currentCanvasId]);

  if (!imageInfo) {
    return null;
  }
  return (
    <>
      {highlights.map((h) => (
        <Overlay key={h.id} location={imageInfo.location}>
          <AnnotationHighlight
            svgPath={h.selector}
            size={imageInfo.size}
            color={getHighlightColor(h.annotation, projectConfig)}
          />
        </Overlay>
      ))}
    </>
  );
}
