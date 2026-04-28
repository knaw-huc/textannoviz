import { MarkerProps } from "../../../components/Text/Annotated/core";
import { isPageBody, MarkerBody } from "../../../model/AnnoRepoAnnotation.ts";
import { PageMarker } from "../../default/annotation/marker/PageMarker.tsx";
import { throwUnknownAnnotation } from "../../../components/Text/Annotated/throwUnknownAnnotation.ts";
import { pageMarkerTypes } from "./ProjectAnnotationModel.ts";

export function OratiesMarker(props: MarkerProps<MarkerBody>) {
  const { marker } = props;
  const type = marker.body.type;

  if (pageMarkerTypes.includes(type) && isPageBody(marker.body)) {
    return <PageMarker id={marker.body.id} label={marker.body.n} />;
  }
  throwUnknownAnnotation("marker", marker.body);
}
