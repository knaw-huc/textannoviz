import { createFootnoteMarkerClasses } from "./utils/createAnnotationClasses.ts";
import { SegmentBody } from "./SegmentBody.tsx";
import { NestedAnnotationProps } from "./NestedAnnotation.tsx";
import { isMarkerSegment, MarkerSegment } from "./AnnotationModel.ts";
import { FootnoteTooltipMarkerButton } from "./FootnoteTooltip.tsx";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";

export function MarkerAnnotation(
  props: Pick<NestedAnnotationProps, "segment">,
) {
  const projectConfig = useProjectStore(projectConfigSelector);

  const marker = props.segment.annotations.find(isMarkerSegment);

  if (!marker) {
    return <SegmentBody body={props.segment.body} />;
  }
  console.log("marker", marker);
  if (projectConfig.footnoteMarkerAnnotationTypes.includes(marker.body.type)) {
    return <FootnoteMarkerAnnotation marker={marker} />;
  }
  return <>---marker---</>;
}

export function FootnoteMarkerAnnotation(props: { marker: MarkerSegment }) {
  const { marker } = props;
  const classNames: string[] = [];
  classNames.push(createFootnoteMarkerClasses(marker));
  return (
    <span className={classNames.join(" ")}>
      <FootnoteTooltipMarkerButton clickedMarker={marker}>
        [{marker.body.metadata.n || "*"}]
      </FootnoteTooltipMarkerButton>
    </span>
  );
}
