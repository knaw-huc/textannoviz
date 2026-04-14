import { useMemo, useRef } from "react";
import {
  Overlay,
  useCanvas,
  useImageInfo,
  useManifest,
  Viewer,
} from "@knaw-huc/osd-iiif-viewer";
import { NavigationBar } from "./NavigationBar";
import { AnnotationHighlight } from "./AnnotationHighlight";
import { useZoomToAnnotation } from "./useZoomToAnnotation";
import { useAnnotationStore } from "../../stores/annotation";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { findSvgSelector } from "../../utils/findSvgSelector";
import { getHighlightColor } from "./getHighlightColor.ts";

export function FacsimileViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isReady, error } = useManifest();
  const { currentCanvasId } = useCanvas();
  const imageInfo = useImageInfo();

  const { annotations, bodyId } = useAnnotationStore();
  const projectConfig = useProjectStore(projectConfigSelector);
  const { showAnnosOnFacsimile } = projectConfig;

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

  useZoomToAnnotation(bodyId, annotations, currentCanvasId);

  if (error) {
    return <div>Manifest error: {error}</div>;
  }
  if (!isReady) {
    return <div>Loading facsimile...</div>;
  }

  return (
    <div
      ref={containerRef}
      className="relative inset-0 h-full w-full cursor-grab overflow-hidden bg-neutral-100 active:cursor-grabbing"
    >
      <Viewer options={{ showNavigationControl: false }} />
      {imageInfo &&
        showAnnosOnFacsimile &&
        highlights.map((f) => (
          <Overlay key={f.id} location={imageInfo.location}>
            <AnnotationHighlight
              svgPath={f.selector}
              size={imageInfo.size}
              color={getHighlightColor(f.annotation, projectConfig)}
            />
          </Overlay>
        ))}
      <NavigationBar fullscreenRef={containerRef} />
    </div>
  );
}
