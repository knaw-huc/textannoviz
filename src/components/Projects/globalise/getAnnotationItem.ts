import { AnnoRepoAnnotation } from "../../../model/AnnoRepoAnnotation";

export const getAnnotationItem = (annotation: AnnoRepoAnnotation) => {
  return annotation.body.type;
};
