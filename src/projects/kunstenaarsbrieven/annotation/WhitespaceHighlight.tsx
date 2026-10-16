import { HighlightProps } from "../../../components/Text/Annotated/core";
import { WhitespaceBody } from "./ProjectAnnotationModel.ts";

export function WhitespaceHighlight(props: HighlightProps<WhitespaceBody>) {
  return <span className="whitespace">{props.children}</span>;
}
