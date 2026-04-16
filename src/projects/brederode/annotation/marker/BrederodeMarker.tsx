import { MarkerProps } from "../../../../components/Text/Annotated/core";
import { MarkerBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { PageMarkerAnnotation } from "../../../default/annotation/marker/PageMarkerAnnotation.tsx";
import { throwUnknownAnnotation } from "../../../../components/Text/Annotated/throwUnknownAnnotation.ts";
import { projectPageMarkerAnnotationTypes } from "../../annotation/ProjectAnnotationModel.ts";

export function BrederodeMarker(props: MarkerProps<MarkerBody>) {
  const { marker } = props;
  const type = marker.body.type;

  if (projectPageMarkerAnnotationTypes.includes(type)) {
    return <PageMarkerAnnotation marker={marker} />;
  }
  throwUnknownAnnotation("marker", marker.body);
}
