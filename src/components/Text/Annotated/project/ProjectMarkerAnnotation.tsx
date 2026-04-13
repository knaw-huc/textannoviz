import { useEffect, useRef, useState } from "react";
import { useCanvas, useViewer } from "@knaw-huc/osd-iiif-viewer";
import {
  AnnoRepoAnnotation,
  CanvasSelector,
  CanvasTarget,
  MarkerBody,
} from "../../../../model/AnnoRepoAnnotation.ts";
import { useAnnotationStore } from "../../../../stores/annotation.ts";
import { useDetailViewStore } from "../../../../stores/detail-view/detail-view-store.ts";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../../../stores/project.ts";
import { useTextStore } from "../../../../stores/text/text-store.ts";
import { MarkerProps, MarkerSegment } from "../core";
import { createTooltipMarkerClasses } from "./utils/createAnnotationClasses.ts";
import { isNoteReference } from "../../../../projects/kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";
import { ProjectConfig } from "../../../../model/ProjectConfig.ts";
import { BroccoliRelativeAnno } from "../../../../model/Broccoli.ts";
import { toArray } from "lodash";

export function ProjectMarkerAnnotation(props: MarkerProps<MarkerBody>) {
  const projectConfig = useProjectStore(projectConfigSelector);
  const pageMarkerTypes = projectConfig.pageMarkerAnnotationTypes;
  const insertTextTypes = projectConfig.insertTextMarkerAnnotationTypes;

  const { marker } = props;
  const body = marker.body;
  const type = body.type;

  if (projectConfig.isToolTipMarker(body)) {
    return <TooltipMarkerAnnotation marker={marker} />;
  } else if (pageMarkerTypes.includes(type)) {
    return <PageMarkerAnnotation marker={marker} />;
  } else if (insertTextTypes.includes(type)) {
    return <InsertMarkerAnnotation marker={marker} />;
  } else {
    throw new Error(`Unknown marker ${type}: ${JSON.stringify(body)}`);
  }
}

export function PageMarkerAnnotation(props: {
  marker: MarkerSegment<MarkerBody>;
}) {
  const { marker } = props;
  const [isZooming, setIsZooming] = useState(false);
  const annotations = useAnnotationStore().annotations;
  const viewer = useViewer();
  const { currentCanvasId, goToById } = useCanvas();
  const translateProject = useProjectStore(translateProjectSelector);
  const zoomAnnoFacsimile = useProjectStore(
    projectConfigSelector,
  ).zoomAnnoFacsimile;

  const { canvas, region } = findCanvasRegion(annotations, marker.body.id);

  useEffect(() => {
    if (!zoomAnnoFacsimile || !viewer || !region) {
      return;
    }

    if (canvas === currentCanvasId && isZooming) {
      zoomToRegion(viewer, region);
      setIsZooming(false);
    }
  }, [currentCanvasId]);

  function pageBreakClickHandler() {
    if (!canvas) {
      return;
    }

    if (currentCanvasId === canvas) {
      if (!zoomAnnoFacsimile || !viewer || !region) {
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

export function TooltipMarkerAnnotation(props: {
  marker: MarkerSegment<MarkerBody>;
}) {
  const { activeFootnote, setActiveFootnote } = useTextStore();
  const { setActiveSidebarTab } = useDetailViewStore();
  const { ptrToNoteAnnosMap } = useAnnotationStore();
  const ref = useRef<HTMLSpanElement>(null);
  const { marker } = props;
  const classNames: string[] = [];
  const noteReference = isNoteReference(marker.body) && marker.body;
  if (!noteReference) {
    throw new Error("Expected pointer:" + JSON.stringify(noteReference));
  }
  classNames.push(...createTooltipMarkerClasses());
  const noteUrl = noteReference.target;
  const footnote = ptrToNoteAnnosMap.get(noteUrl);
  if (!noteUrl) {
    console.warn(`No footnote for ${noteReference.id} with url ${noteUrl}`);
  }
  //TODO: Note numbers should always come from the same data point
  const footnoteNumber = footnote?.body.n ?? "?";

  function spanClickHandler(footnoteNumber: string) {
    setActiveFootnote(footnoteNumber);
    setActiveSidebarTab("notes");
  }

  return (
    <span
      ref={ref}
      className={`${classNames.join(
        " ",
      )} transition-all duration-300 ease-in-out ${
        activeFootnote === footnoteNumber ? "bg-[#FFCE01]" : "bg-white"
      }`}
      onClick={() => spanClickHandler(footnoteNumber)}
      role="button"
      tabIndex={0}
      onKeyDown={() => spanClickHandler(footnoteNumber)}
    >
      {/* 31-07-2025: footnote tooltips are disabled for now.
        - The tooltips cannot be triggered via touch devices
        - The placement of the tooltip is messed up when entities are marked via the AnnotatedText component
        - It's impossible to click on marked entities in the tooltip
        - Solution: migrate from tooltips to popovers?
      */}
      {/* <TooltipMarkerButton clickedMarker={marker}> */}
      {/*TODO: move to project config*/}
      {(marker.body.n || footnoteNumber) ?? "*"}
      {/* </TooltipMarkerButton> */}
    </span>
  );
}

export function InsertMarkerAnnotation(props: {
  marker: MarkerSegment<MarkerBody>;
}) {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { marker } = props;
  return <projectConfig.components.InsertMarkerAnnotation marker={marker} />;
}

export const isMarker = (
  annotation: AnnoRepoAnnotation,
  config: ProjectConfig,
) => {
  const type = annotation.body.type;
  if (config.insertTextMarkerAnnotationTypes.includes(type)) {
    return true;
  }
  if (config.pageMarkerAnnotationTypes.includes(type)) {
    return true;
  }
  return config.isToolTipMarker(annotation.body);
};

export function hasMarkerPositions(annotation: BroccoliRelativeAnno) {
  return annotation.end === annotation.begin;
}

function zoomToRegion(viewer: ReturnType<typeof useViewer>, region: string) {
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
