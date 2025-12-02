import { MarkerSegment } from "../../components/Text/Annotated/AnnotationModel";
import { isHeadBody } from "./annotation/ProjectAnnotationModel";

type InsertMarkerAnnotationProps = {
  marker: MarkerSegment;
};

export const InsertMarkerAnnotation = (props: InsertMarkerAnnotationProps) => {
  const body = props.marker.body;
  if (body.type === "tei:Space") {
    return <br />;
  }

  if (body.type === "Picture") {
    const maxWidth = body.width ?? "400";
    const width = Math.min(parseInt(maxWidth), 400);
    return (
      <img
        src={`${body.url}/full/${width},/0/default.jpg`}
        alt="Possible XML error!"
      />
    );
  }

  if (isHeadBody(body)) {
    // TODO: remove inFigure check, is being converted into a caption:
    if (!body.inFigure?.length) {
      if (body.n) {
        return <>{body.n}. </>;
      }
    }
  }

  return null;
};
