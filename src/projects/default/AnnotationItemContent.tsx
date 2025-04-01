import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";

type AnnotationItemContentProps = {
  annotation: AnnoRepoAnnotation;
};

export const AnnotationItemContent = (props: AnnotationItemContentProps) => {
  return (
    <>
      {props.annotation.body.metadata
        ? Object.entries(props.annotation.body.metadata).map(
          ([key, value], index) => {
            return <li key={index}>{`${key}: ${value}`}</li>;
          },
        )
        : null}
    </>
  );
};
