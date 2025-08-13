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
    const maxWidth = props.marker.body.metadata.width ?? "400";
    const width = Math.min(parseInt(maxWidth), 400);
    return (
      <img
        src={`${props.marker.body.metadata.url}/full/${width},/0/default.jpg`}
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
