import { MarkerSegment } from "../../components/Text/Annotated/AnnotationModel";
import { IsraelsTeiHeadBody } from "./annotation/ProjectAnnotationModel";

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
        alt="Possible XML error!"
      />
    );
  }

  if (props.marker.body.type === "tei:Head") {
    const headAnno = props.marker.body as unknown as IsraelsTeiHeadBody;
    if (!headAnno.metadata?.inFigure?.length) {
      if (headAnno.metadata?.n) {
        return <>{headAnno.metadata.n}. </>;
      }
    }
  }

  return null;
};
