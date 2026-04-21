import { HighlightBody } from "../../../components/Text/Annotated/utils/highlightBodyGuards.ts";
import { HighlightProps } from "../../../components/Text/Annotated/core";
import { isWhitespace } from "./ProjectAnnotationModel.ts";
import { DefaultHighlight } from "../../default/annotation/highlight/DefaultHighlight.tsx";

export function KunstenaarsbrievenHighlight(
  props: HighlightProps<HighlightBody>,
) {
  const { highlights, children } = props;

  const isWhitespaceMarkup = highlights.every(
    (h) => isWhitespace(h.body) && h.body.isTextSuffix,
  );

  if (isWhitespaceMarkup) {
    return <span className="whitespace-markup">{children}</span>;
  }

  return <DefaultHighlight {...props} />;
}
