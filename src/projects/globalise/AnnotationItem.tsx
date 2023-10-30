import {AnnoRepoAnnotation} from "../../model/AnnoRepoAnnotation";
import {AnnotationItemProps} from "../../model/ProjectConfig.ts";

export const getAnnotationItem = (annotation: AnnoRepoAnnotation) => {
  return annotation.body.type;
};

export default function AnnotationItem(props: AnnotationItemProps) {
  return <>{
    getAnnotationItem(props.annotation)
  }</>
}