import { AnyAnnotatedTextConfig } from "../../../components/Text/Annotated/core";
import { DefaultHighlights } from "./highlight/DefaultHighlights.tsx";
import { DefaultMarker } from "./marker/DefaultMarker.tsx";
import { DefaultGroup } from "./group/DefaultGroup.tsx";
import { DefaultNested } from "./nested/DefaultNested.tsx";

export const defaultAnnotatedTextConfig: AnyAnnotatedTextConfig = {
  Nested: DefaultNested,
  Highlight: DefaultHighlights,
  Marker: DefaultMarker,
  Group: DefaultGroup,
};
