import { Link, useParams } from "react-router-dom";
import { ScanBody } from "../../../model/AnnoRepoAnnotation";
import { useAnnotationStore } from "../../../stores/annotation";

export const GetAnnotationLinks = () => {
  const params = useParams();

  const annotations = useAnnotationStore((state) => state.annotations);
  const scanAnno = annotations.filter((anno) => anno.body.type === "Scan");

  return (
    <>
      {" | "}
      {params.tier0 && params.tier1 ? (
        <Link to="/detail/urn:republic:session-1728-06-19-ordinaris-num-1-resolution-16">
          Switch to resolution view
        </Link>
      ) : (
        <Link
          to={`/detail/${(scanAnno[0].body as ScanBody).metadata.volume}/${(
            scanAnno[0].body as ScanBody
          ).metadata.opening.toString()}`}
        >
          Switch to opening view
        </Link>
      )}
    </>
  );
};
