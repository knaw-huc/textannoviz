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
import { useLocation } from "react-router";
import { Key } from "react-aria-components";

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
  setActiveTab: React.Dispatch<React.SetStateAction<Key>>;
}) {
  const { items, CardComponent, filter, query, isGlobal, setActiveTab } = props;
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  const [displayLimit, setDisplayLimit] = React.useState(100);
  const observerTarget = React.useRef<HTMLDivElement | null>(null);
  const { routerBasename } = getViteEnvVars();
  const location = useLocation();

  const filteredData = React.useMemo(() => {
    const hashId = location.hash.slice(1);
    const hasQuery = query.trim() !== "";

    syncActiveTabWithHash(hashId, setActiveTab);

    if (hashId && !hasQuery) {
      const focusedItem = items.find((item) => item.id === hashId);
      if (focusedItem) {
        return [focusedItem];
      }
    }

    const shouldApplyFilter = filter && !(isGlobal && hasQuery);

    let newItems = shouldApplyFilter ? items.filter(filter) : items;

    if (hasQuery) {
      const queryLower = query.toLowerCase();
      newItems = newItems.filter(
        (item) =>
          item.head[interfaceLang]?.toLowerCase().includes(queryLower) ||
          item.id.toLowerCase() === queryLower,
      );
    }
    return newItems;
  }, [
    filter,
    interfaceLang,
    isGlobal,
    items,
    location.hash,
    query,
    setActiveTab,
  ]);

  const observerCallback = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (observerTarget.current) {
        // Clean up previous observer
        observerTarget.current = null;
      }
      if (node) {
        observerTarget.current = node;
        const observer = new IntersectionObserver(
          (entries) => {
            if (
              entries[0].isIntersecting &&
              displayLimit < filteredData.length
            ) {
              setDisplayLimit((prev) => prev + 100);
            }
          },
          { threshold: 0.1 },
        );
        observer.observe(node);
        return () => observer.disconnect();
      }
    },
    [displayLimit, filteredData.length],
  );

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
        ref={observerCallback}
        className="flex h-10 items-center justify-center"
      >
        {displayLimit < filteredData.length && "Loading more..."}
      </div>
    </>
  );
}

function syncActiveTabWithHash(
  hashId: string,
  setActiveTab: React.Dispatch<React.SetStateAction<Key>>,
) {
  if (hashId.startsWith("sketch")) {
    setActiveTab("sketches");
  } else if (hashId.startsWith("ill")) {
    setActiveTab("artworksAll");
  }
}
