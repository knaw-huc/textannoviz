import { useRef } from "react";
import { useManifest, Viewer } from "@knaw-huc/osd-iiif-viewer";
import { NavigationBar } from "./NavigationBar";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { AnnotationHighlightsOverlay } from "./AnnotationHighlightsOverlay.tsx";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { PageBody } from "../../projects/kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";
import DummyFacs from "../../assets/dummy.jpeg";

export function FacsimileViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isReady, error } = useManifest();
  const { annotations } = useAnnotationStore();
  const { showAnnosOnFacsimile } = useProjectStore(projectConfigSelector);

  const pageAnnotations = annotations.filter(
    (anno) => anno.body.type === "Page",
  );

  /*
    This has been implemented for Mondriaan, but seeing as this is a generic part of TAV
    it should be implemented like this in all projects that do not have images.
   */
  const isDummyFacs = pageAnnotations.some(
    (pageAnno) => (pageAnno.body as PageBody).facsimile === "dummy",
  );

  if (error) {
    console.error("Manifest error:", error);
    return <div>Manifest error: {error}</div>;
  }
  if (!isReady) {
    return <div>Loading facsimile...</div>;
  }

  if (isDummyFacs) {
    return (
      <div
        className="relative inset-0 flex h-full w-full items-center justify-center overflow-hidden p-4"
        style={{ backgroundColor: "#f5f3e7" }}
      >
        <img
          src={DummyFacs}
          alt="No facsimile available"
          className="max-h-full max-w-[450px] object-contain"
        />
      </div>
    );
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
