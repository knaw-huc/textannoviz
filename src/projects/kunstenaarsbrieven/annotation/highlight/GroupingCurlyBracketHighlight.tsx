import { HighlightBody } from "../../../../components/Text/Annotated/utils/highlightBodyGuards.ts";
import { HighlightProps } from "../../../../components/Text/Annotated/core";
import { DefaultHighlight } from "../../../default/annotation/highlight/DefaultHighlight.tsx";
import bracket from "../../../../assets/groupingcurlybracket.svg";

export function GroupingCurlyBracketHighlight(
  props: HighlightProps<HighlightBody>,
) {
  return (
    <DefaultHighlight {...props}>
      <img
        src={bracket}
        alt={props.segment.value}
        className="grouping-curly-bracket"
      />
    </DefaultHighlight>
  );
}
