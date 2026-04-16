import { AnyAnnotatedTextConfig } from "../../components/Text/Annotated/core";
import { ProjectHighlightAnnotations } from "../../components/Text/Annotated/project/ProjectHighlightAnnotations";
import { ProjectMarkerAnnotation } from "../../components/Text/Annotated/project/ProjectMarkerAnnotation";
import { ProjectNestedAnnotation } from "../../components/Text/Annotated/project/ProjectNestedAnnotation";
import { ProjectSegmentGroup } from "../../components/Text/Annotated/project/ProjectSegmentGroup";

export const defaultAnnotatedTextConfig: AnyAnnotatedTextConfig = {
  Annotation: ProjectNestedAnnotation,
  Highlight: ProjectHighlightAnnotations,
  Marker: ProjectMarkerAnnotation,
  Group: ProjectSegmentGroup,
};
