import { Key } from "react-aria-components";
import { Artwork } from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel";
import { useLocation } from "react-router";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project";
import React from "react";
import { syncActiveTabWithHash } from "./utils/syncActiveTabWithHash";

export function useFilteredArtworks(props: {
  items: Artwork[];
  filter?: (item: Artwork) => boolean;
  query: string;
  isGlobal: boolean;
  setActiveTab: (newTab: Key) => void;
}) {
  const { items, filter, query, isGlobal, setActiveTab } = props;
  const location = useLocation();
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;

  const [displayLimit, setDisplayLimit] = React.useState(100);
  const [showFocusedOnly, setShowFocusedOnly] = React.useState(true);
  const observerTarget = React.useRef<HTMLDivElement | null>(null);

  const filteredData = React.useMemo(() => {
    const hashId = location.hash.slice(1);
    const hasQuery = query.trim() !== "";

    // If hash is present and no search query, show only that item (if showFocusedOnly is true)
    if (hashId && !hasQuery && showFocusedOnly) {
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
    showFocusedOnly,
  ]);

  React.useEffect(() => {
    const hashId = location.hash.slice(1);
    syncActiveTabWithHash(hashId, setActiveTab);
  }, []);

  const observerCallback = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (observerTarget.current) {
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
  const isFocusedViewActive =
    showFocusedOnly && location.hash.slice(1) && !props.query.trim();

  return {
    filteredData,
    displayLimit,
    observerCallback,
    visibleArtworks,
    isFocusedViewActive,
    toggleFocusedView: () => setShowFocusedOnly(false),
  };
}
