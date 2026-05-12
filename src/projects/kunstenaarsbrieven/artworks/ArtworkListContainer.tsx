import React from "react";
import { LanguageCode } from "../../../model/Language";
import {
  useProjectStore,
  projectConfigSelector,
} from "../../../stores/project";
import { Artwork } from "../annotation/ProjectAnnotationModel";
import { SearchQuery } from "../../../model/Search";
import { encodeObject } from "../../../utils/url/UrlParamUtils";
import { getViteEnvVars } from "../../../utils/viteEnvVars";

export function ArtworkListContainer(props: {
  items: Artwork[];
  CardComponent: React.ComponentType<{
    artwork: Artwork;
    interfaceLang: LanguageCode;
    handleSearch: (artwork: Artwork) => void;
  }>;
  filter?: (item: Artwork) => boolean;
  query: string;
  isGlobal: boolean;
}) {
  const { items, CardComponent, filter } = props;
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  const [displayLimit, setDisplayLimit] = React.useState(100);
  const observerTarget = React.useRef(null);
  const { routerBasename } = getViteEnvVars();

  const filteredData = React.useMemo(() => {
    const hasQuery = props.query.trim() !== "";

    const shouldApplyFilter = filter && !(props.isGlobal && hasQuery);

    let newItems = shouldApplyFilter ? items.filter(filter) : items;

    if (hasQuery) {
      const queryLower = props.query.toLowerCase();
      newItems = newItems.filter(
        (item) =>
          item.head[interfaceLang]?.toLowerCase().includes(queryLower) ||
          item.id.toLowerCase() === queryLower,
      );
    }
    return newItems;
  }, [filter, interfaceLang, items, props.isGlobal, props.query]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayLimit < filteredData.length) {
          setDisplayLimit((prev) => prev + 100);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [displayLimit, filteredData.length]);

  const visibleArtworks = filteredData.slice(0, displayLimit);

  function handleSearch(artwork: Artwork) {
    const query: Partial<SearchQuery> = {
      terms: {
        ["artworkIds"]: [artwork.id],
      },
    };

    const encodedQuery = encodeObject({ query: query });
    window.open(
      `${routerBasename === "/" ? "" : routerBasename}/?${encodedQuery}`,
      "_blank",
    );
  }

  return (
    <>
      {visibleArtworks.map((artw) => (
        <CardComponent
          key={artw.id}
          artwork={artw}
          interfaceLang={interfaceLang}
          handleSearch={handleSearch}
        />
      ))}

      <div
        ref={observerTarget}
        className="flex h-10 items-center justify-center"
      >
        {displayLimit < filteredData.length && "Loading more..."}
      </div>
    </>
  );
}
