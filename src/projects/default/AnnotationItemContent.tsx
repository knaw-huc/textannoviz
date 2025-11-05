import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";

type AnnotationItemContentProps = {
  annotation: AnnoRepoAnnotation;
};

export const AnnotationItemContent = (props: AnnotationItemContentProps) => {
  return (
    <>
      {props.annotation.body
        ? Object.entries(props.annotation.body).map(([key, value], index) => {
            return <li key={index}>{`${key}: ${value}`}</li>;
          })
        : null}
    </>
  );
};
