import React from "react";
import { Link, useParams } from "react-router-dom";

export const GetAnnotationLinks = () => {
  const { volumeNum, openingNum } = useParams<{
    volumeNum: string;
    openingNum: string;
  }>();

  return (
    <>
      {" | "}
      {volumeNum && openingNum ? (
        <Link to="/detail/resolutions/urn:republic:session-1728-06-19-ordinaris-num-1-resolution-16">
          Switch to resolution view
        </Link>
      ) : (
        <Link to="/detail/volumes/1728/openings/285">
          Switch to opening view
        </Link>
      )}
    </>
  );
};
