import { MarkerSegment } from "../../components/Text/Annotated/AnnotationModel";

type InsertMarkerAnnotationProps = {
  marker: MarkerSegment;
};

export const InsertMarkerAnnotation = (props: InsertMarkerAnnotationProps) => {
  return (
    <span className="inserted-text">
      {props.marker.body.metadata.facs ?? ""}
    </span>
  );
};
