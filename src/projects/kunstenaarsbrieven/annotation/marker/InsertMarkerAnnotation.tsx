import { MarkerSegment } from "../../../../components/Text/Annotated/core";
import { MarkerBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { isHeadBody, isPictureBody } from "../ProjectAnnotationModel.ts";

type InsertMarkerAnnotationProps = {
  marker: MarkerSegment<MarkerBody>;
};

export const InsertMarkerAnnotation = (props: InsertMarkerAnnotationProps) => {
  const body = props.marker.body;
  if (body.type === "tei:Space") {
    return <br className="insert-marker" />;
  }

  if (isPictureBody(body) && body.url) {
    // Images of sketches contain a full IIIF URL, meaning that default.jpg is already in the URL
    if (body.url.includes("default.jpg")) {
      return (
        <img
          className="insert-marker marker-picture"
          src={body.url}
          alt="Not available"
        />
      );
    }
    // In all other cases, we need to build the URL ourselves
    else {
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
