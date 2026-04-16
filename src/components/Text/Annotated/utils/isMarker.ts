import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import { BroccoliRelativeAnno } from "../../../../model/Broccoli.ts";
import { ProjectConfig } from "../../../../model/ProjectConfig.ts";

export const isMarker = (
  annotation: AnnoRepoAnnotation,
  config: ProjectConfig,
) => {
  const type = annotation.body.type;
  if (config.insertTextMarkerAnnotationTypes.includes(type)) {
    return true;
  }
  if (config.pageMarkerAnnotationTypes.includes(type)) {
    return true;
  }
  return config.isToolTipMarker(annotation.body);
};

export function hasMarkerPositions(annotation: BroccoliRelativeAnno) {
  return annotation.end === annotation.begin;
}
