import {
  AnnoRepoAnnotation,
  TeiCorrespactionBody,
  TeiDateBody,
  TeiDivBody,
  TeiNoteBody,
  TeiObjectdescBody,
  TeiPtrBody,
  TeiRefBody,
  TeiRegBody,
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
    case "tei:Objectdesc":
      return (
        annotation.body.type +
        " (" +
        `${(annotation.body as TeiObjectdescBody).metadata.form}` +
        ")"
      );
    case "tei:Correspaction":
      return (
        annotation.body.type +
        " (" +
        `${(annotation.body as TeiCorrespactionBody).metadata.type}` +
        ")"
      );
    case "tei:Date":
      return (
        annotation.body.type +
        " (" +
        `${(annotation.body as TeiDateBody).metadata.when}` +
        ")"
      );
    case "tei:Ptr":
      if (
        (annotation.body as TeiPtrBody).metadata.target &&
        (annotation.body as TeiPtrBody).metadata.type
      ) {
        return (
          annotation.body.type +
          " (" +
          `${(annotation.body as TeiPtrBody).metadata.target}, ${
            (annotation.body as TeiPtrBody).metadata.type
          }` +
          ")"
        );
      } else {
        return (
          annotation.body.type +
          " (" +
          `${(annotation.body as TeiPtrBody).metadata.target}` +
          ")"
        );
      }
    case "tei:Note":
      if ((annotation.body as TeiNoteBody).metadata?.id) {
        return (
          annotation.body.type +
          " (id:" +
          `${(annotation.body as TeiNoteBody).metadata.id}` +
          ")"
        );
      }

      if ((annotation.body as TeiNoteBody).metadata?.type) {
        return (
          annotation.body.type +
          " (type:" +
          `${(annotation.body as TeiNoteBody).metadata.type}` +
          ")"
        );
      }

      if (!(annotation.body as TeiNoteBody).metadata) {
        return annotation.body.type;
      }

      break;
    case "tei:Ref":
      return (
        annotation.body.type +
        " (" +
        `${(annotation.body as TeiRefBody).metadata.target}` +
        ")"
      );
    case "tei:Reg":
      return (
        annotation.body.type +
        " (" +
        `${(annotation.body as TeiRegBody).metadata.type}` +
        ")"
      );
    default:
      return annotation.body.type;
  }
};
