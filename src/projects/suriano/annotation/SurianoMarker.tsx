import { MarkerProps } from "../../../components/Text/Annotated/core";
import { isPageBody, MarkerBody } from "../../../model/AnnoRepoAnnotation.ts";
import { PageMarker } from "../../default/annotation/marker/PageMarker.tsx";
import { throwUnknownAnnotation } from "../../../components/Text/Annotated/throwUnknownAnnotation.ts";
import { insertTextMarkerTypes } from "./ProjectAnnotationModel.ts";
import { Empty } from "../../../components/Empty.tsx";

export function SurianoMarker(props: MarkerProps<MarkerBody>) {
  const { marker } = props;
  const type = marker.body.type;

  if (isPageBody(marker.body)) {
    return <PageMarker id={marker.body.id} label={marker.body.n} />;
  }
  if (insertTextMarkerTypes.includes(type)) {
    // TODO: remove suriano projectInsertTextMarkerAnnotationTypes
    return Empty();
  }
  throwUnknownAnnotation("marker", marker.body);
}
