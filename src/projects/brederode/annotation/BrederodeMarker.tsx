import { MarkerProps } from "../../../components/Text/Annotated/core";
import { isPageBody, MarkerBody } from "../../../model/AnnoRepoAnnotation.ts";
import { PageMarker } from "../../default/annotation/marker/PageMarker.tsx";
import { throwUnknownAnnotation } from "../../../components/Text/Annotated/throwUnknownAnnotation.ts";

export function BrederodeMarker(props: MarkerProps<MarkerBody>) {
  const { marker } = props;

  if (isPageBody(marker.body)) {
    return <PageMarker id={marker.body.id} label={marker.body.n} />;
  }
  throwUnknownAnnotation("marker", marker.body);
}
