import { AnyAnnotatedTextConfig } from "../../components/Text/Annotated/core";
import { DefaultHighlightAnnotations } from "../../components/Text/Annotated/highlight/DefaultHighlightAnnotations";
import { DefaultMarkerAnnotation } from "../../components/Text/Annotated/marker/DefaultMarkerAnnotation";
import { DefaultSegmentGroup } from "../../components/Text/Annotated/group/DefaultSegmentGroup";
import { DefaultNestedAnnotation } from "../../components/Text/Annotated/nested/DefaultNestedAnnotation.tsx";

export const defaultAnnotatedTextConfig: AnyAnnotatedTextConfig = {
  Annotation: DefaultNestedAnnotation,
  Highlight: DefaultHighlightAnnotations,
  Marker: DefaultMarkerAnnotation,
  Group: DefaultSegmentGroup,
};
