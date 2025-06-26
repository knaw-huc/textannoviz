import { MarkerSegment } from "../../components/Text/Annotated/AnnotationModel";

type InsertMarkerAnnotationProps = {
  marker: MarkerSegment;
};

export const InsertMarkerAnnotation = (props: InsertMarkerAnnotationProps) => {
  if (props.marker.body.type === "tei:Space") {
    return <br />;
  }

  return null;
};
