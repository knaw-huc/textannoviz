import {
  AnnoRepoAnnotation,
  TeiDivBody,
  TeiRsBody,
} from "../../../model/AnnoRepoAnnotation";

export const getAnnotationItem = (annotation: AnnoRepoAnnotation) => {
  switch (annotation.body.type) {
    case "tei:Div":
      return (
        annotation.body.type +
        " (" +
        `${(annotation.body as TeiDivBody).metadata.type}` +
        ")"
      );
    case "tei:Rs":
      if ((annotation.body as TeiRsBody).metadata.anno) {
        return annotation.body.type + " (with image link!)";
      } else {
        return (
          annotation.body.type +
          " (" +
          `${(annotation.body as TeiRsBody).metadata.type}` +
          ")"
        );
      }
    default:
      return annotation.body.type;
  }
};
