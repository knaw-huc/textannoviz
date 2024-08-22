import { createFootnoteMarkerClasses } from "./utils/createAnnotationClasses.ts";
import { SegmentBody } from "./SegmentBody.tsx";
import { NestedAnnotationProps } from "./NestedAnnotation.tsx";
import { isMarkerSegment, MarkerSegment } from "./AnnotationModel.ts";
import { FootnoteTooltipMarkerButton } from "./FootnoteTooltip.tsx";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import { toast } from "react-toastify";

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
  return (
    <div className="mb-10 mt-5">
      <div className="mb-3 text-center text-sm text-gray-500">
        ({props.marker.body.metadata.n ?? "page break"})
      </div>
      <hr />
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
