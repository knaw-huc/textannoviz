import { MarkerProps } from "../../../components/Text/Annotated/core";
import { MarkerBody } from "../../../model/AnnoRepoAnnotation.ts";
import { PageMarker } from "../../default/annotation/marker/PageMarker.tsx";
import { throwUnknownAnnotation } from "../../../components/Text/Annotated/throwUnknownAnnotation.ts";
import { projectPageMarkerAnnotationTypes } from "./ProjectAnnotationModel.ts";

export function BrederodeMarker(props: MarkerProps<MarkerBody>) {
  const { marker } = props;
  const type = marker.body.type;

  if (projectPageMarkerAnnotationTypes.includes(type)) {
    return <PageMarker marker={marker} />;
  }
  throwUnknownAnnotation("marker", marker.body);
}
