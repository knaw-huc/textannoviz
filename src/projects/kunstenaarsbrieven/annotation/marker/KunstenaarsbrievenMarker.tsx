import { MarkerProps } from "../../../../components/Text/Annotated/core";
import { MarkerBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { PageMarkerAnnotation } from "../../../../components/Text/Annotated/common/marker/PageMarkerAnnotation.tsx";
import { throwUnknownAnnotation } from "../../../../components/Text/Annotated/throwUnknownAnnotation.ts";
import { isNoteReference } from "../../annotation/ProjectAnnotationModel.ts";
import {
  projectPageMarkerAnnotationTypes,
  projectInsertTextMarkerAnnotationTypes,
} from "../ProjectAnnotationModel.ts";
import { TooltipMarkerAnnotation } from "./TooltipMarkerAnnotation.tsx";
import { InsertMarkerAnnotation } from "./InsertMarkerAnnotation.tsx";

export function KunstenaarsbrievenMarker(props: MarkerProps<MarkerBody>) {
  const { marker } = props;
  const body = marker.body;
  const type = body.type;

  if (isNoteReference(body)) {
    return <TooltipMarkerAnnotation marker={marker} />;
  }
  if (projectPageMarkerAnnotationTypes.includes(type)) {
    return <PageMarkerAnnotation marker={marker} />;
  }
  if (projectInsertTextMarkerAnnotationTypes.includes(type)) {
    return <InsertMarkerAnnotation marker={marker} />;
  }
  throwUnknownAnnotation("marker", body);
}
