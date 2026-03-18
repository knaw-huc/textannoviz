import { MarkerSegment } from "../../components/Text/Annotated/AnnotationModel";
import { isHeadBody } from "./annotation/ProjectAnnotationModel.ts";

type InsertMarkerAnnotationProps = {
  marker: MarkerSegment;
};

export const InsertMarkerAnnotation = (props: InsertMarkerAnnotationProps) => {
  const body = props.marker.body;
  if (body.type === "tei:Space") {
    return <br className="insert-marker" />;
  }

  if (body.type === "Picture") {
    const maxWidth = body.width ?? "400";
    const width = Math.min(parseInt(maxWidth), 400);
    return (
      // eslint-disable-next-line jsx-a11y/img-redundant-alt
      <img
        className="insert-marker marker-picture"
        src={`${body.url}/full/${width},/0/default.jpg`}
        alt="Image not available (yet)"
      />
    );
  }

  if (isHeadBody(body) && body.n) {
    return <span className="insert-marker marker-head">{body.n}. </span>;
  }

  return null;
};
