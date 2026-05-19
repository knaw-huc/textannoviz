import { MarkerProps } from "../../../../components/Text/Annotated/core";
import { throwUnknownAnnotation } from "../../../../components/Text/Annotated/throwUnknownAnnotation.ts";

/**
 * Marker implementation used by projects that do not emit marker offsets
 * Throws when invoked by unknown markers
 */
export function DefaultMarker(props: MarkerProps) {
  throwUnknownAnnotation("marker", props.marker.body);
  return null;
}
