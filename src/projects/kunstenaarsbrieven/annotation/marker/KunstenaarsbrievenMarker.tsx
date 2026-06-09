import { MarkerProps } from "../../../../components/Text/Annotated/core";
import { MarkerBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { throwUnknownAnnotation } from "../../../../components/Text/Annotated/throwUnknownAnnotation.ts";
import { isNoteReference } from "../ProjectAnnotationModel.ts";
import { insertMarkerTypes } from "../ProjectAnnotationModel.ts";
import { NoteMarker } from "./NoteMarker.tsx";
import { InsertMarker } from "./InsertMarker.tsx";

export function KunstenaarsbrievenMarker(props: MarkerProps<MarkerBody>) {
  const { marker } = props;
  const body = marker.body;
  const type = body.type;

  if (isNoteReference(body)) {
    return <NoteMarker marker={marker} />;
  }
  if (insertMarkerTypes.includes(type)) {
    return <InsertMarker marker={marker} />;
  }
  throwUnknownAnnotation("marker", body);
}
