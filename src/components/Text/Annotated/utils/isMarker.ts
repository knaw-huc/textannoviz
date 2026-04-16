import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import { BroccoliRelativeAnno } from "../../../../model/Broccoli.ts";
import { ProjectConfig } from "../../../../model/ProjectConfig.ts";

export function isMarker(
  annotation: AnnoRepoAnnotation,
  config: ProjectConfig,
): boolean {
  return config.markerAnnotationTypes.includes(annotation.body.type);
}

export function hasMarkerPositions(annotation: BroccoliRelativeAnno) {
  return annotation.end === annotation.begin;
}
