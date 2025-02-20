import {
  AnnotationSegment,
  isNestedAnnotationSegment,
  Segment,
} from "./AnnotationModel.ts";
import { createAnnotationClasses } from "./utils/createAnnotationClasses.ts";
import { HighlightAnnotations } from "./HighlightAnnotations.tsx";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";

export type NestedAnnotationProps = {
  segment: Segment;
  toNest: AnnotationSegment[];
  clickedSegment?: Segment;
};

export function NestedAnnotation(props: NestedAnnotationProps) {
  const projectConfig = useProjectStore(projectConfigSelector);
  const nestedAnnotationTypes = [
    ...projectConfig.entityAnnotationTypes,
    ...projectConfig.highlightedAnnotationTypes,
  ];

  const nestedAnnotations = props.toNest.filter(isNestedAnnotationSegment);
  const toRender = nestedAnnotations[0];

  const toNest = nestedAnnotations.slice(1);
  if (!nestedAnnotations.length) {
    return <HighlightAnnotations segment={props.segment} />;
  }
  return (
    <span
      className={createAnnotationClasses(
        props.segment,
        toRender,
        nestedAnnotationTypes,
        projectConfig.getAnnotationCategory,
      ).join(" ")}
    >
      {toNest.length ? (
        <NestedAnnotation {...props} toNest={toNest} />
      ) : (
        <HighlightAnnotations segment={props.segment} />
      )}
    </span>
  );
}
