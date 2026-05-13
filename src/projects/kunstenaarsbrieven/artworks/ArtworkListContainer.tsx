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
import { useVirtualizer } from "@tanstack/react-virtual";
import { useLocation } from "react-router";

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
  console.log(filter);
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  // const [displayLimit, setDisplayLimit] = React.useState(100);
  // const observerTarget = React.useRef(null);
  const { routerBasename } = getViteEnvVars();
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const hashId = location.hash.split("#")[1];
  const [measureRef, width] = useWidth();

  const combinedRef = (node: HTMLDivElement | null) => {
    parentRef.current = node;
    measureRef(node);
  };

  const columns = Math.max(1, Math.floor(width / 320));

  const rowVirtualiser = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 600,
    overscan: 1,
    lanes: columns,
    gap: 24,
  });

  React.useEffect(() => {
    if (!items) return;
    const targetIndex = items.findIndex((item) => item.id === hashId);
    if (targetIndex !== -1) {
      rowVirtualiser.scrollToIndex(targetIndex, { align: "start" });
    }
  }, [hashId, items]);

  // const filteredData = React.useMemo(() => {
  //   const hasQuery = props.query.trim() !== "";

  //   const shouldApplyFilter = filter && !(props.isGlobal && hasQuery);

  //   let newItems = shouldApplyFilter ? items.filter(filter) : items;

  //   if (hasQuery) {
  //     const queryLower = props.query.toLowerCase();
  //     newItems = newItems.filter(
  //       (item) =>
  //         item.head[interfaceLang]?.toLowerCase().includes(queryLower) ||
  //         item.id.toLowerCase() === queryLower,
  //     );
  //   }
  //   return newItems;
  // }, [filter, interfaceLang, items, props.isGlobal, props.query]);

  // React.useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && displayLimit < filteredData.length) {
  //         setDisplayLimit((prev) => prev + 100);
  //       }
  //     },
  //     { threshold: 0.1 },
  //   );

  //   if (observerTarget.current) observer.observe(observerTarget.current);

  //   return () => observer.disconnect();
  // }, [displayLimit, filteredData.length]);

  // const visibleArtworks = filteredData.slice(0, displayLimit);

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
      <div
        ref={combinedRef}
        className="h-[68vh] overflow-y-auto px-8 pb-8"
        style={{ scrollBehavior: "smooth" }}
      >
        <div
          style={{
            height: `${rowVirtualiser.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualiser.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${100 / columns}%`,
                transform: `translateX(${virtualRow.lane * 100}%) translateY(${
                  virtualRow.start
                }px)`,
                padding: "12px", // Provides the gap between columns
              }}
            >
              <CardComponent
                artwork={items[virtualRow.index]}
                interfaceLang={interfaceLang}
                handleSearch={handleSearch}
              />
            </div>
          ))}
        </div>
      </div>
      {/* {visibleArtworks.map((artw) => (
        <CardComponent
          key={artw.id}
          artwork={artw}
          interfaceLang={interfaceLang}
          handleSearch={handleSearch}
        />
      ))} */}

      {/* <div
        ref={observerTarget}
        className="flex h-10 items-center justify-center"
      >
        {displayLimit < filteredData.length && "Loading more..."}
      </div> */}
    </>
  );
}

function useWidth() {
  const [width, setWidth] = React.useState(0);
  const [node, setNode] = React.useState<HTMLElement | null>(null);

  const ref = React.useCallback((node: HTMLElement | null) => {
    setNode(node);
  }, []);

  React.useEffect(() => {
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width);
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return [ref, width] as const;
}
