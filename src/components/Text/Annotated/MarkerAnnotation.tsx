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
import { FootnoteTooltipMarkerButton } from "./FootnoteTooltip.tsx";
import { NestedAnnotationProps } from "./NestedAnnotation.tsx";
import { SegmentBody } from "./SegmentBody.tsx";
import { createFootnoteMarkerClasses } from "./utils/createAnnotationClasses.ts";

export function MarkerAnnotation(
  props: Pick<NestedAnnotationProps, "segment">,
) {
  const projectConfig = useProjectStore(projectConfigSelector);
  const pageTypes = projectConfig.pageMarkerAnnotationTypes;
  const footnoteTypes = projectConfig.footnoteMarkerAnnotationTypes;

  const marker = props.segment.annotations.find(isMarkerSegment);

  if (!marker) {
    return <SegmentBody body={props.segment.body} />;
  } else if (footnoteTypes.includes(marker.body.type)) {
    return <FootnoteMarkerAnnotation marker={marker} />;
  } else if (pageTypes.includes(marker.body.type)) {
    return <PageMarkerAnnotation marker={marker} />;
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
        ({props.marker.body.metadata.n ?? "page break"})
      </div>
    </div>
  );
}

export function FootnoteMarkerAnnotation(props: { marker: MarkerSegment }) {
  const { marker } = props;
  const classNames: string[] = [];
  classNames.push(createFootnoteMarkerClasses(marker));
  return (
    <span className={classNames.join(" ")}>
      <FootnoteTooltipMarkerButton clickedMarker={marker}>
        [{marker.body.metadata.n ?? "*"}]
      </FootnoteTooltipMarkerButton>
    </span>
  );
}
