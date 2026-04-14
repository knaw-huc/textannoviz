import { useRef } from "react";
import { useManifest, Viewer } from "@knaw-huc/osd-iiif-viewer";
import { NavigationBar } from "./NavigationBar";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { AnnotationHighlightsOverlay } from "./AnnotationHighlightsOverlay.tsx";

export function FacsimileViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isReady, error } = useManifest();

  const { showAnnosOnFacsimile } = useProjectStore(projectConfigSelector);

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
      {showAnnosOnFacsimile && <AnnotationHighlightsOverlay />}
      <NavigationBar fullscreenRef={containerRef} />
    </div>
  );
}
