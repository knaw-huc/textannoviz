import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";

export function getAnnotationsByTypes(
  annotations: AnnoRepoAnnotation[],
  annotationTypes: string[],
) {
  const filteredAnnotations: AnnoRepoAnnotation[] = [];
  annotationTypes.forEach((annotationType) => {
    const annotationsOfType = annotations.filter(
      (annotation) => annotation.body.type === annotationType,
    );
    filteredAnnotations.push(...annotationsOfType);
  });
  return filteredAnnotations;
}
