import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";

interface GetAnnotationItemContentProps {
  annotation: AnnoRepoAnnotation;
}

export const GetAnnotationItemContent = (
  props: GetAnnotationItemContentProps,
) => {
  return (
    <>
      {props.annotation.body.metadata
        ? Object.entries(props.annotation.body.metadata).map(
            ([key, value], i) => {
              return <li key={i}>{`${key}: ${value}`}</li>;
            },
          )
        : null}
    </>
  );
};
