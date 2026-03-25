import { AnnotationSegment, NestedAnnotationSegment } from "../../core";
import { AnnoRepoBody } from "../../../../../model/AnnoRepoAnnotation.ts";

export function isProjectAnnotation(
  toTest: AnnotationSegment,
): toTest is NestedAnnotationSegment<AnnoRepoBody> {
  return toTest.type === "annotation";
}
