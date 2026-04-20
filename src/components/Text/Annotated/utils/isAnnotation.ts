import { AnnotationSegment, NestedSegment } from "../core";
import { AnnoRepoBody } from "../../../../model/AnnoRepoAnnotation.ts";

export function isAnnotation(
  toTest: AnnotationSegment,
): toTest is NestedSegment<AnnoRepoBody> {
  return toTest.type === "annotation";
}
