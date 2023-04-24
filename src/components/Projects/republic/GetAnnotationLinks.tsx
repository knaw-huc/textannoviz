import { Link, useParams } from "react-router-dom";

export const GetAnnotationLinks = () => {
  const params = useParams();

  return (
    <>
      {" | "}
      {params.tier0 && params.tier1 ? (
        <Link to="/detail/urn:republic:session-1728-06-19-ordinaris-num-1-resolution-16">
          Switch to resolution view
        </Link>
      ) : (
        <Link to="/detail/1728/285">Switch to opening view</Link>
      )}
    </>
  );
};
