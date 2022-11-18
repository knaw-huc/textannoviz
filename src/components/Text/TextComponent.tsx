import React from "react";
import { textContext } from "../../state/text/TextContext";

export function TextComponent() {
  const { textState } = React.useContext(textContext);
  return <>{textState.text ? textState.text.lines.join("\n") : null}</>;
}
