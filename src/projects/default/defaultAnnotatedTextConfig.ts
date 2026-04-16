import { AnyAnnotatedTextConfig } from "../../components/Text/Annotated/core";
import { DefaultHighlightAnnotations } from "../../components/Text/Annotated/highlight/DefaultHighlightAnnotations";
import { ProjectMarkerAnnotation } from "../../components/Text/Annotated/project/ProjectMarkerAnnotation";
import { ProjectSegmentGroup } from "../../components/Text/Annotated/project/ProjectSegmentGroup";
import { DefaultNestedAnnotation } from "../../components/Text/Annotated/nested/DefaultNestedAnnotation.tsx";

export const defaultAnnotatedTextConfig: AnyAnnotatedTextConfig = {
  Annotation: DefaultNestedAnnotation,
  Highlight: DefaultHighlightAnnotations,
  Marker: ProjectMarkerAnnotation,
  Group: ProjectSegmentGroup,
};
