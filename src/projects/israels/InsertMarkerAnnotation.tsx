import { MarkerSegment } from "../../components/Text/Annotated/AnnotationModel";

type InsertMarkerAnnotationProps = {
  marker: MarkerSegment;
};

export const InsertMarkerAnnotation = (props: InsertMarkerAnnotationProps) => {
  if (props.marker.body.type === "tei:Space") {
    return <br />;
  }

  if (props.marker.body.type === "tei:Graphic") {
    return (
      <img
        src={`${props.marker.body.metadata.url}/full/400,/0/default.jpg`}
        alt="logo"
      />
    );
  }

  return null;
};
