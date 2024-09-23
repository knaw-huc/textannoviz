import mirador from "mirador-knaw-huc-mui5";
import { toast } from "react-toastify";
import { CanvasTarget } from "../../../model/AnnoRepoAnnotation.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import { useMiradorStore } from "../../../stores/mirador.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import { isMarkerSegment, MarkerSegment } from "./AnnotationModel.ts";
import { TooltipMarkerButton } from "./MarkerTooltip.tsx";
import { NestedAnnotationProps } from "./NestedAnnotation.tsx";
import { SegmentBody } from "./SegmentBody.tsx";
import { createTooltipMarkerClasses } from "./utils/createAnnotationClasses.ts";

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
  const annotations = useAnnotationStore().annotations;
  const miradorStore = useMiradorStore().miradorStore;
  const projectName = useProjectStore().projectName;

  const pageAnno = annotations.find(
    (anno) => props.marker.body.id === anno.body.id,
  );

  const canvas = (pageAnno?.target as CanvasTarget[])
    .filter((t) => t.type === "Canvas")
    .map((t) => t.source)[0];

  function pageBreakClickHandler() {
    if (canvas.length > 0) {
      miradorStore.dispatch(mirador.actions.setCanvas(projectName, canvas));
    }
  }

  return (
    <div className="mb-3 mt-10">
      <hr />
      <div
        className="mt-4 text-center text-sm text-gray-500 transition hover:cursor-pointer hover:text-gray-900 hover:underline"
        onClick={pageBreakClickHandler}
      >
        {/*TODO: move to project config*/}(
        {props.marker.body.metadata.n ?? "page break"})
      </div>
    </div>
  );
}

export function TooltipMarkerAnnotation(props: { marker: MarkerSegment }) {
  const { marker } = props;
  const classNames: string[] = [];
  classNames.push(...createTooltipMarkerClasses(marker));
  return (
    <span className={classNames.join(" ")}>
      <TooltipMarkerButton clickedMarker={marker}>
        {/*TODO: move to project config*/}[{marker.body.metadata.n ?? "*"}]
      </TooltipMarkerButton>
    </span>
  );
}

export function InsertMarkerAnnotation(props: { marker: MarkerSegment }) {
  const { marker } = props;
  return (
    <span className="inserted-text">
      {/*TODO: move to project config*/}
      {marker.body.metadata.facs ?? ""}
    </span>
  );
}
