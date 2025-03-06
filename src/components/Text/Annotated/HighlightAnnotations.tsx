import { createHighlightClasses } from "./utils/createAnnotationClasses.ts";
import { NestedAnnotationProps } from "./NestedAnnotation.tsx";
import { isHighlightSegment } from "./AnnotationModel.ts";
import { MarkerAnnotation } from "./MarkerAnnotation.tsx";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import uniq from "lodash/uniq";

export function HighlightAnnotations(
  props: Pick<NestedAnnotationProps, "segment">,
) {
  const { getHighlightCategory } = useProjectStore(projectConfigSelector);
  const classNames: string[] = [];
  const highlights = props.segment.annotations.filter(isHighlightSegment);

  if (!highlights.length) {
    return <MarkerAnnotation segment={props.segment} />;
  }
  const allHighlightsClasses = [];
  for (const highlight of highlights) {
    // TODO: should every highlight have its own component?
    allHighlightsClasses.push(
      ...createHighlightClasses(highlight, props.segment, getHighlightCategory),
    );
  }
  classNames.push(...uniq(allHighlightsClasses));
  return (
    <span className={classNames.join(" ")}>
      <MarkerAnnotation segment={props.segment} />
    </span>
  );
}
