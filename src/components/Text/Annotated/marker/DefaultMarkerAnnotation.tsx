import { MarkerProps } from "../core";
import { throwUnknownAnnotation } from "../throwUnknownAnnotation.ts";

/**
 * Marker implementation used by projects that do not emit marker offsets
 * Throws when invoked by unknown markers
 */
export function DefaultMarkerAnnotation(props: MarkerProps) {
  throwUnknownAnnotation("marker", props.marker.body);
  return null;
}
