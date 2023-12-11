import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { AnnotationItemProps } from "../../model/ProjectConfig";

export const getAnnotationItem = (annotation: AnnoRepoAnnotation) => {
  return annotation.body.type;
};

export const AnnotationItem = (props: AnnotationItemProps) => {
  return <>{getAnnotationItem(props.annotation)}</>;
};
