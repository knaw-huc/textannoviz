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
import { useFilteredArtworks } from "../../vangogh/artworks/useFilteredArtworks";
import { TabId } from "../../vangogh/artworks/utils/hashConfig";

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
  setActiveTab: (newTab: TabId) => void;
}) {
  const { items, CardComponent, filter, query, isGlobal, setActiveTab } = props;
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  const { routerBasename } = getViteEnvVars();

  const {
    visibleArtworks,
    filteredData,
    displayLimit,
    observerCallback,
    isFocusedViewActive,
    toggleFocusedView,
  } = useFilteredArtworks({
    items,
    filter,
    query,
    isGlobal,
    setActiveTab,
  });

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
      {isFocusedViewActive && (
        <div className="flex h-10 items-center justify-center p-4">
          <button
            onClick={toggleFocusedView}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Show All
          </button>
        </div>
      )}
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
