import { MarkerProps } from "../../../../components/Text/Annotated/core";
import { MarkerBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { throwUnknownAnnotation } from "../../../../components/Text/Annotated/throwUnknownAnnotation.ts";
import { isNoteReference } from "../ProjectAnnotationModel.ts";
import { insertMarkerTypes } from "../ProjectAnnotationModel.ts";
import { TooltipMarkerAnnotation } from "./TooltipMarkerAnnotation.tsx";
import { InsertMarkerAnnotation } from "./InsertMarkerAnnotation.tsx";

export function KunstenaarsbrievenMarker(props: MarkerProps<MarkerBody>) {
  const { marker } = props;
  const body = marker.body;
  const type = body.type;

  if (isNoteReference(body)) {
    return <TooltipMarkerAnnotation marker={marker} />;
  }
  if (insertMarkerTypes.includes(type)) {
    return <InsertMarkerAnnotation marker={marker} />;
  }
  throwUnknownAnnotation("marker", body);
}
