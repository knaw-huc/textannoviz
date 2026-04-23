import { HighlightBody } from "../../../components/Text/Annotated/utils/highlightBodyGuards.ts";
import { HighlightProps } from "../../../components/Text/Annotated/core";
import { DefaultHighlight } from "../../default/annotation/highlight/DefaultHighlight.tsx";

export function KunstenaarsbrievenHighlight(
  props: HighlightProps<HighlightBody>,
) {
  return <DefaultHighlight {...props} />;
}
