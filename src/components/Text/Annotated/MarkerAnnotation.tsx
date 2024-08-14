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

  const marker = props.segment.annotations.find(isMarkerSegment);

  if (!marker) {
    return <SegmentBody body={props.segment.body} />;
  }
  if (projectConfig.footnoteMarkerAnnotationTypes.includes(marker.body.type)) {
    return <FootnoteMarkerAnnotation marker={marker} />;
  } else if (
    projectConfig.pageMarkerAnnotationTypes.includes(marker.body.type)
  ) {
    return <span className="block">---page---</span>;
  } else {
    toast("Unknown marker " + marker.body.type, { type: "error" });
    return <></>;
  }
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
