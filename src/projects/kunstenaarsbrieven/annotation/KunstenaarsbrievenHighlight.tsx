import { HighlightBody } from "../../../components/Text/Annotated/utils/highlightBodyGuards.ts";
import { HighlightProps } from "../../../components/Text/Annotated/core";
import { DefaultHighlight } from "../../default/annotation/highlight/DefaultHighlight.tsx";
import { isWhitespace } from "./ProjectAnnotationModel.ts";

export function KunstenaarsbrievenHighlight(
  props: HighlightProps<HighlightBody>,
) {
  if (props.highlights.every((a) => isWhitespace(a.body))) {
    return <span className="whitespace">{props.children}</span>;
  }
  return <DefaultHighlight {...props} />;
}
