import React from "react";
import { Link, useParams } from "react-router-dom";
import { ScanBody } from "../../../model/AnnoRepoAnnotation";
import { Broccoli } from "../../../model/Broccoli";
import { useProjectStore } from "../../../stores/project";
import { fetchBroccoliScanWithOverlap } from "../../../utils/broccoli";

export const GetAnnotationLinks = () => {
  const params = useParams();
  const [opening, setOpening] = React.useState<number>(0);
  const [volume, setVolume] = React.useState<string>("");
  const projectConfig = useProjectStore((state) => state.projectConfig);

  React.useEffect(() => {
    if (params.tier2 && projectConfig) {
      fetchBroccoliScanWithOverlap(
        params.tier2,
        ["Scan"],
        ["anno"],
        projectConfig
      ).then((result: Broccoli) => {
        setOpening((result.anno[0].body as ScanBody).metadata.opening);
        setVolume((result.anno[0].body as ScanBody).metadata.volume);
      });
    }
  }, [params.tier2, projectConfig]);

  return (
    <>
      {" | "}
      {params.tier0 && params.tier1 ? (
        <Link to="/detail/urn:republic:session-1728-06-19-ordinaris-num-1-resolution-16">
          Switch to resolution view
        </Link>
      ) : (
        <Link to={`/detail/${volume}/${opening.toString()}`}>
          Switch to opening view
        </Link>
      )}
    </>
  );
};
