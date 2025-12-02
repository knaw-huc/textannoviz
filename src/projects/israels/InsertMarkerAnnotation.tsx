import { MarkerSegment } from "../../components/Text/Annotated/AnnotationModel";
import { isDivision } from "./annotation/ProjectAnnotationModel.ts";

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

  if (isDivision(body)) {
    if (body["xml:id"] && body["xml:id"].includes("5.8")) {
      // TODO: show section number instead of id, waiting for n property?
      console.log("Division", body);
      return <span className="highlight-head">{body["xml:id"]}. </span>;
    }
  }

  return null;
};
