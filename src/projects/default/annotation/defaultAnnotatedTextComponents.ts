import { AnyAnnotatedTextComponents } from "../../../components/Text/Annotated/core";
import { DefaultHighlight } from "./highlight/DefaultHighlight.tsx";
import { DefaultMarker } from "./marker/DefaultMarker.tsx";
import { DefaultGroup } from "./group/DefaultGroup.tsx";
import { DefaultNested } from "./nested/DefaultNested.tsx";
import { DefaultBlock } from "./block/DefaultBlock.tsx";

export const defaultAnnotatedTextComponents: AnyAnnotatedTextComponents = {
  Nested: DefaultNested,
  Highlight: DefaultHighlight,
  Marker: DefaultMarker,
  Group: DefaultGroup,
  Block: DefaultBlock,
};
