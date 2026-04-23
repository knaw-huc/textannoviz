import { MarkerProps } from "../../../components/Text/Annotated/core";
import { MarkerBody } from "../../../model/AnnoRepoAnnotation.ts";
import { PageMarkerAnnotation } from "../../default/annotation/marker/PageMarkerAnnotation.tsx";
import { throwUnknownAnnotation } from "../../../components/Text/Annotated/throwUnknownAnnotation.ts";
import {
  projectPageMarkerAnnotationTypes,
  projectInsertTextMarkerAnnotationTypes,
} from "./ProjectAnnotationModel.ts";
import { Empty } from "../../../components/Empty.tsx";

export function SurianoMarker(props: MarkerProps<MarkerBody>) {
  const { marker } = props;
  const type = marker.body.type;

  if (projectPageMarkerAnnotationTypes.includes(type)) {
    return <PageMarkerAnnotation marker={marker} />;
  }
  if (projectInsertTextMarkerAnnotationTypes.includes(type)) {
    // TODO: remove suriano projectInsertTextMarkerAnnotationTypes
    return Empty();
  }
  throwUnknownAnnotation("marker", marker.body);
}
