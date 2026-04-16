import { MarkerProps } from "../../../../components/Text/Annotated/core";
import { MarkerBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { PageMarkerAnnotation } from "../../../../components/Text/Annotated/common/marker/PageMarkerAnnotation.tsx";
import { throwUnknownAnnotation } from "../../../../components/Text/Annotated/throwUnknownAnnotation.ts";
import {
  projectPageMarkerAnnotationTypes,
  projectInsertTextMarkerAnnotationTypes,
} from "../../annotation/ProjectAnnotationModel.ts";

export function SurianoMarker(props: MarkerProps<MarkerBody>) {
  const { marker } = props;
  const type = marker.body.type;

  if (projectPageMarkerAnnotationTypes.includes(type)) {
    return <PageMarkerAnnotation marker={marker} />;
  }
  if (projectInsertTextMarkerAnnotationTypes.includes(type)) {
    // tei:Metamark: currently rendered as nothing (legacy behavior via Empty component)
    return null;
  }
  throwUnknownAnnotation("marker", marker.body);
}
