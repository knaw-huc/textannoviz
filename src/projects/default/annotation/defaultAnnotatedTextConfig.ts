import { AnyAnnotatedTextConfig } from "../../../components/Text/Annotated/core";
import { DefaultHighlightAnnotations } from "../../../components/Text/Annotated/common/highlight/DefaultHighlightAnnotations";
import { DefaultMarkerAnnotation } from "../../../components/Text/Annotated/common/marker/DefaultMarkerAnnotation";
import { DefaultSegmentGroup } from "../../../components/Text/Annotated/common/group/DefaultSegmentGroup";
import { DefaultNestedAnnotation } from "../../../components/Text/Annotated/common/nested/DefaultNestedAnnotation.tsx";

export const defaultAnnotatedTextConfig: AnyAnnotatedTextConfig = {
  Nested: DefaultNestedAnnotation,
  Highlight: DefaultHighlightAnnotations,
  Marker: DefaultMarkerAnnotation,
  Group: DefaultSegmentGroup,
};
