import { Navigate, useLocation } from "react-router";
import { useSearchPath } from "../../utils/searchPath";
import type { JSX } from "react";
import { blankParams } from "../../components/Search/createSearchParams";
import { decodeObject } from "../../utils/url/UrlParamUtils";

export function HomepageRoute({ homePage }: { homePage: JSX.Element }) {
  const location = useLocation();
  const searchPath = useSearchPath();

  const urlParams = decodeObject(location.search);
  const hasSearchParams = Object.keys(blankParams).some((k) => k in urlParams);

  if (hasSearchParams) {
    return (
      <Navigate
        to={{
          pathname: searchPath,
          search: location.search,
          hash: location.hash,
        }}
        replace
      />
    );
  }
  return homePage;
}
