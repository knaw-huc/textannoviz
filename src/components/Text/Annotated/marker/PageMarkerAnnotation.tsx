import { useEffect, useState } from "react";
import {
  useCanvas,
  useViewer,
  useViewerReady,
} from "@knaw-huc/osd-iiif-viewer";
import {
  AnnoRepoAnnotation,
  CanvasSelector,
  CanvasTarget,
  MarkerBody,
} from "../../../../model/AnnoRepoAnnotation.ts";
import { useAnnotationStore } from "../../../../stores/annotation.ts";
import {
  projectConfigSelector,
  useProjectStore,
  useTranslateProject,
} from "../../../../stores/project.ts";
import { MarkerSegment } from "../core";
import { toArray } from "lodash";

export function PageMarkerAnnotation(props: {
  marker: MarkerSegment<MarkerBody>;
}) {
  const { marker } = props;
  const [isZooming, setIsZooming] = useState(false);
  const annotations = useAnnotationStore().annotations;
  const viewer = useViewer();
  const viewerReady = useViewerReady();
  const { currentCanvasId, goToById } = useCanvas();
  const translateProject = useTranslateProject();
  const { zoomToAnnoOnFacsimile } = useProjectStore(projectConfigSelector);

  const { canvas, region } = findCanvasRegion(annotations, marker.body.id);

  useEffect(() => {
    if (!zoomToAnnoOnFacsimile || !viewer || !viewerReady || !region) {
      return;
    }

    if (canvas === currentCanvasId && isZooming) {
      zoomToRegion(viewer, region);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsZooming(false);
    }
  }, [currentCanvasId, viewerReady]);

  function pageBreakClickHandler() {
    if (!canvas) {
      return;
    }

    if (currentCanvasId === canvas) {
      if (!zoomToAnnoOnFacsimile || !viewer || !region) {
        return;
      }
      zoomToRegion(viewer, region);
    } else {
      goToById(canvas);
      setIsZooming(true);
    }
  }

  const pageNumber = marker.body.n;
  return (
    <div className="mt-20 border-t border-neutral-100 first:mt-10">
      <div className="group flex -translate-x-0 -translate-y-4  font-sans text-sm text-neutral-600">
        <button
          className="inline-flex rounded border border-neutral-200 bg-white px-1 py-1  "
          onClick={pageBreakClickHandler}
          aria-label="Click to show the facsimile"
        >
          ←
          <span className="hidden transition group-hover:inline-block ">
            {translateProject("SHOW_PAGE")}
          </span>
        </button>
        <div className="border2 inline-flex rounded border-neutral-200 bg-white px-2 py-1  ">
          {pageNumber
            ? `${translateProject("page")} ${pageNumber}`
            : "page break"}
        </div>
      </div>
    </div>
  );
}

function zoomToRegion(
  viewer: NonNullable<ReturnType<typeof useViewer>>,
  region: string,
) {
  const [x, y, w, h] = region.split(",").map((s) => Number(s));
  const rect = viewer.viewport.imageToViewportRectangle(x, y, w, h);
  viewer.viewport.fitBounds(rect);
}

type WithRegion = { type: "iiif:ImageApiSelector"; region: string };

function isWithRegion(sel: CanvasSelector): sel is WithRegion {
  return sel.type === "iiif:ImageApiSelector" && "region" in sel;
}

function findCanvasRegion(annotations: AnnoRepoAnnotation[], markerId: string) {
  const pageAnno = annotations.find((anno) => anno.body.id === markerId);

  const canvas = (pageAnno?.target as CanvasTarget[])
    .filter((t) => t.type === "Canvas")
    .map((t) => t.source)[0];

  const canvasTargets = (pageAnno?.target as CanvasTarget[]).filter(
    (t) => t.type === "Canvas",
  );

  const regions = canvasTargets.flatMap((t) => {
    if (!t.selector) {
      return [];
    }
    const selectors = toArray(t.selector);
    return selectors.filter(isWithRegion).map((s) => s.region);
  });

  return {
    canvas,
    region: regions[0] ?? null,
  };
}
