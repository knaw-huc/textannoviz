import { PropsWithChildren } from "react";
import { getViteEnvVars } from "../../../../utils/viteEnvVars";
import { SearchQuery } from "../../../../model/Search";
import { encodeObject } from "../../../../utils/url/UrlParamUtils";

export function BibleReferenceLink(
  props: PropsWithChildren<{ cRef: string; className?: string }>,
) {
  const { cRef, className, children } = props;
  const { routerBasename } = getViteEnvVars();

  const basePath = routerBasename === "/" ? "" : routerBasename;

  function searchBibleRef(cRef: string) {
    const query: Partial<SearchQuery> = {
      terms: {
        bibleRefIds: [cRef],
      },
    };

    const encodedQuery = encodeObject({ query: query });
    window.open(`${basePath}/?${encodedQuery}`, "_blank");
  }

  return (
    <span
      className={`closedNestedAnnotation cursor-pointer ${className ?? ""}`}
      role="link"
      tabIndex={0}
      onClick={() => searchBibleRef(cRef)}
      onKeyDown={(e) => {
        if (e.key === "Enter") searchBibleRef(cRef);
      }}
    >
      {children}
    </span>
  );
}
