import { useRef } from "react";
import { useManifest, Viewer } from "@knaw-huc/osd-iiif-viewer";
import { NavigationBar } from "./NavigationBar.tsx";

export function FacsimileViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isReady, error } = useManifest();

  if (error) {
    return <div>Manifest error: {error}</div>;
  }

  if (!isReady) {
    return <div>Loading facsimile...</div>;
  }

  return (
    <div
      ref={containerRef}
      className="relative inset-0 h-full w-full overflow-hidden bg-neutral-100"
    >
      <Viewer options={{ showNavigationControl: false }} />
      <NavigationBar fullscreenRef={containerRef} />
    </div>
  );
}
