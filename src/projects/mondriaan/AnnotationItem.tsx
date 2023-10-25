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
} from "../../model/AnnoRepoAnnotation";
import {AnnotationItemProps} from "../../model/ProjectConfig.ts";

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
    case "tei:ObjectDesc":
      return (
          annotation.body.type +
          " (" +
          `${(annotation.body as TeiObjectdescBody).metadata.form}` +
          ")"
      );
    case "tei:CorrespAction":
      return (
          annotation.body.type +
          " (" +
          `${(annotation.body as TeiCorrespactionBody).metadata.type}` +
          ")"
      );
    case "tei:Date":
      if ((annotation.body as TeiDateBody).metadata) {
        return (
            annotation.body.type +
            " (" +
            `${(annotation.body as TeiDateBody).metadata.when}` +
            ")"
        );
      } else {
        return annotation.body.type;
      }
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
      if ((annotation.body as TeiRefBody).metadata) {
        return (
            annotation.body.type +
            " (" +
            `${(annotation.body as TeiRefBody).metadata.target}` +
            ")"
        );
      } else {
        return annotation.body.type;
      }
    case "tei:Reg":
      if ((annotation.body as TeiRegBody).metadata) {
        return (
            annotation.body.type +
            " (" +
            `${(annotation.body as TeiRegBody).metadata.type}` +
            ")"
        );
      } else {
        return annotation.body.type;
      }
    default:
      return annotation.body.type;
  }
};

export default function AnnotationItem(props: AnnotationItemProps) {
  return <>{
    getAnnotationItem(props.annotation)
  }</>
}