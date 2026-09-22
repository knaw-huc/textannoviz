import { HighlightBody } from "../../../components/Text/Annotated/utils/highlightBodyGuards.ts";
import { HighlightProps } from "../../../components/Text/Annotated/core";
import { DefaultHighlight } from "../../default/annotation/highlight/DefaultHighlight.tsx";
import {
  isRowHeight,
  isWhitespace,
  WhitespaceBody,
} from "./ProjectAnnotationModel.ts";
import { GroupingCurlyBracketHighlight } from "./highlight/GroupingCurlyBracketHighlight.tsx";
import { WhitespaceHighlight } from "./WhitespaceHighlight.tsx";

export function KunstenaarsbrievenHighlight(
  props: HighlightProps<HighlightBody>,
) {
  const { highlights } = props;
  if (highlights.every((a) => isWhitespace(a.body))) {
    return (
      <WhitespaceHighlight {...(props as HighlightProps<WhitespaceBody>)} />
    );
  }
  if (
    props.highlights.some((a) => isRowHeight(a.body)) &&
    props.segment.value === "}"
  ) {
    return <GroupingCurlyBracketHighlight {...props} />;
  }
  return <DefaultHighlight {...props} />;
}
