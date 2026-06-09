import { MarkerSegment } from "../../../../components/Text/Annotated/core";
import { MarkerBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { isHeadBody } from "../ProjectAnnotationModel.ts";

type InsertMarkerAnnotationProps = {
  marker: MarkerSegment<MarkerBody>;
};

export const InsertMarkerAnnotation = (props: InsertMarkerAnnotationProps) => {
  const body = props.marker.body;
  if (body.type === "tei:Space") {
    return <br className="insert-marker" />;
  }

  if (body.type === "Picture") {
    // Images of sketches contain a full IIIF URL, meaning that default.jpg is already in the URL
    if (body.url?.includes("default.jpg")) {
      return (
        <img
          className="insert-marker marker-picture"
          src={body.url}
          alt="Not available"
        />
      );
    } else {
      const maxWidth = body.width ?? "400";
      const width = Math.min(parseInt(maxWidth), 400);
      return (
        <img
          className="insert-marker marker-picture"
          src={`${body.url}/full/${width},/0/default.jpg`}
          alt="Not available"
        />
      );
    }
  }
  if (isHeadBody(body) && body.n) {
    return <span className="insert-marker marker-head">{body.n}. </span>;
  }
  return null;
};
