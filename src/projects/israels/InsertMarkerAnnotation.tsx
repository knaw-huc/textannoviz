import { MarkerSegment } from "../../components/Text/Annotated/AnnotationModel";

type InsertMarkerAnnotationProps = {
  marker: MarkerSegment;
};

export const InsertMarkerAnnotation = (props: InsertMarkerAnnotationProps) => {
  if (props.marker.body.type === "tei:Space") {
    return <br />;
  }

  if (props.marker.body.type === "tei:Figure") {
    // return <img src={logo} className="h-12" alt="logo" />;
    return <></>;
  }

  return null;
};
