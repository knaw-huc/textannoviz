import { useManifest, Viewer } from "@knaw-huc/osd-iiif-viewer";

export function FacsimileViewer() {
  const { isReady, error } = useManifest();

  if (error) {
    return <div>Manifest error: {error}</div>;
  }

  if (!isReady) {
    return <div>Loading facsimile...</div>;
  }

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <Viewer options={{ showNavigationControl: true }} />
    </div>
  );
}
