import mirador from "mirador-knaw-huc-mui5";
import React, { useRef } from "react";
import { toast } from "react-toastify";
import { CanvasTarget, NoteBody } from "../../../model/AnnoRepoAnnotation.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import { useDetailViewStore } from "../../../stores/detail-view/detail-view-store.ts";
import { useInternalMiradorStore } from "../../../stores/internal-mirador.ts";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import { useTextStore } from "../../../stores/text/text-store.ts";
import { isMarkerSegment, MarkerSegment } from "./AnnotationModel.ts";
import { NestedAnnotationProps } from "./NestedAnnotation.tsx";
import { SegmentBody } from "./SegmentBody.tsx";
import { createTooltipMarkerClasses } from "./utils/createAnnotationClasses.ts";
import { useMiradorStore } from "../../../stores/mirador.ts";

export function MarkerAnnotation(
  props: Pick<NestedAnnotationProps, "segment">,
) {
  const projectConfig = useProjectStore(projectConfigSelector);
  const pageMarkerTypes = projectConfig.pageMarkerAnnotationTypes;
  const tooltipTypes = projectConfig.tooltipMarkerAnnotationTypes;
  const insertTextTypes = projectConfig.insertTextMarkerAnnotationTypes;

  const marker = props.segment.annotations.find(isMarkerSegment);

  if (!marker) {
    return <SegmentBody body={props.segment.body} />;
  } else if (tooltipTypes.includes(marker.body.type)) {
    return <TooltipMarkerAnnotation marker={marker} />;
  } else if (pageMarkerTypes.includes(marker.body.type)) {
    return <PageMarkerAnnotation marker={marker} />;
  } else if (insertTextTypes.includes(marker.body.type)) {
    return <InsertMarkerAnnotation marker={marker} />;
  } else {
    toast(`Unknown marker ${marker.body.type}`, { type: "error" });
    return <></>;
  }
}

export function PageMarkerAnnotation(props: { marker: MarkerSegment }) {
  const [doZoom, setDoZoom] = React.useState(false);
  const annotations = useAnnotationStore().annotations;
  const miradorStore = useInternalMiradorStore().miradorStore;
  const projectName = useProjectStore().projectName;
  const translateProject = useProjectStore(translateProjectSelector);

  const currentCanvas = useMiradorStore().currentCanvas;

  const pageAnno = annotations.find(
    (anno) => props.marker.body.id === anno.body.id,
  );

  const canvas = (pageAnno?.target as CanvasTarget[])
    .filter((t) => t.type === "Canvas")
    .map((t) => t.source)[0];

  const region = (pageAnno?.target as CanvasTarget[])
    .filter((t) => t.type === "Canvas")
    .flatMap((t) =>
      Array.isArray(t.selector)
        ? t.selector
            .filter(
              (sel): sel is { type: "iiif:ImageApiSelector"; region: string } =>
                sel.type === "iiif:ImageApiSelector" && "region" in sel,
            )
            .map((sel) => sel.region)
        : [],
    );

  const [x, y, w, h] = region[0].split(",").map(Number);
  const boxToZoom = { x, y, width: w, height: h };
  const zoomCenter = {
    x: boxToZoom.x + boxToZoom.width / 2,
    y: boxToZoom.y + boxToZoom.height / 2,
  };

  const miradorZoom = boxToZoom.width + boxToZoom.height / 2;

  React.useEffect(() => {
    if (canvas === currentCanvas) {
      if (doZoom) {
        miradorStore.dispatch(
          mirador.actions.updateViewport(projectName, {
            x: zoomCenter.x,
            y: zoomCenter.y,
            zoom: 1.5 / miradorZoom,
            flip: false,
            rotation: 0,
          }),
        );
        setDoZoom(false);
      }
    }
  }, [currentCanvas]);

  function pageBreakClickHandler() {
    if (canvas.length > 0) {
      if (currentCanvas === canvas) {
        miradorStore.dispatch(
          mirador.actions.updateViewport(projectName, {
            x: zoomCenter.x,
            y: zoomCenter.y,
            zoom: 1.5 / miradorZoom,
            flip: false,
            rotation: 0,
          }),
        );
      } else {
        miradorStore.dispatch(mirador.actions.setCanvas(projectName, canvas));
        setDoZoom(true);
      }
    }
  }

  const pageNumber = props.marker.body.metadata.n;
  return (
    <div className="mt-20 border-t border-neutral-100">
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

export function TooltipMarkerAnnotation(props: { marker: MarkerSegment }) {
  const { activeFootnote, setActiveFootnote } = useTextStore();
  const { setActiveSidebarTab } = useDetailViewStore();
  const { ptrToNoteAnnosMap } = useAnnotationStore();
  const ref = useRef<HTMLSpanElement>(null);
  const { marker } = props;
  const classNames: string[] = [];
  classNames.push(...createTooltipMarkerClasses(marker));

  const footnote = ptrToNoteAnnosMap.get(marker.body.metadata.target);
  //TODO: Note numbers should always come from the same data point
  const footnoteNumber = (footnote?.body as NoteBody).metadata.n;

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
      {(marker.body.metadata.n || footnoteNumber) ?? "*"}
      {/* </TooltipMarkerButton> */}
    </span>
  );
}

export function InsertMarkerAnnotation(props: { marker: MarkerSegment }) {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { marker } = props;
  return <projectConfig.components.InsertMarkerAnnotation marker={marker} />;
}
