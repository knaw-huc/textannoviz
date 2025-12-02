import { MarkerSegment } from "../../components/Text/Annotated/AnnotationModel";
import { isHeadBody } from "./annotation/ProjectAnnotationModel.ts";

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

  if (isHeadBody(body) && body.n) {
    return <span className="highlight-head">{body.n}. </span>;
  }

  return null;
};
