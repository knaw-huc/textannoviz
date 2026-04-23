import { AnnotationSegment, NestedAnnotationSegment } from "../core";
import { AnnoRepoBody } from "../../../../model/AnnoRepoAnnotation.ts";

export function isAnnotation(
  toTest: AnnotationSegment,
): toTest is NestedAnnotationSegment<AnnoRepoBody> {
  return toTest.type === "annotation";
}
