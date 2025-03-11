import { useEffect, useRef, useState } from "react";
import { useTextStore } from "../../../stores/text.ts";
import { LineOffsets } from "./AnnotationModel.ts";
import { WithContainerRect } from "./AnnotatedText.tsx";

type SearchHighlightBrowserProps = {
  highlight?: string;
  searchHighlightOffsets: LineOffsets[];
} & WithContainerRect;

export function SearchHighlightBrowser(props: SearchHighlightBrowserProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { containerRect, searchHighlightOffsets } = props;
  const { setHighlightedSearchId, isInitSearchHighlight, highlightedSearchId } =
    useTextStore();
  const [top, setTop] = useState<number>();
  const [left, setLeft] = useState<number>();
  /**
   * TODO: use search highlights to scroll
   * - Config option to enable highlight scrolling
   * - Store that tracks which highlight is highlighted
   * - Panel that shows prev/next button
   * - Highlight first search highlight
   * - Move to prev/next highlight
   */
  useEffect(() => {
    if (!isInitSearchHighlight && searchHighlightOffsets.length) {
      setHighlightedSearchId(searchHighlightOffsets[0].body.id);
    }
  }, [isInitSearchHighlight]);

  useEffect(() => {
    const refRect = ref.current?.getBoundingClientRect();
    if (!refRect || !containerRect) {
      return;
    }
    if (containerRect.bottom < 0) {
      console.debug("top should be positive");
      return;
    }
    const newTop = containerRect.bottom - refRect.height;
    const newLeft = containerRect.right - refRect.width;
    console.log("Position browser", {
      newLeft,
      newTop,
      containerRect: containerRect.toJSON(),
      refRect: refRect.toJSON(),
    });
    setTop(newTop);
    setLeft(newLeft);
  }, [props.containerRect]);

  if (!isInitSearchHighlight || !searchHighlightOffsets.length) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="search-highlight-browser border border-solid bg-white pb-1 pl-1 pr-1"
      style={{
        position: "fixed",
        top: toPx(top),
        left: toPx(left),
      }}
    >
      <button
        type="button"
        onClick={() => {
          const foundIndex = findSearchHighlightIndex(
            searchHighlightOffsets,
            highlightedSearchId,
          );
          if (foundIndex === 0) {
            return;
          }
          const newIndex = foundIndex - 1;
          setHighlightedSearchId(searchHighlightOffsets[newIndex].body.id);
        }}
      >
        &lt; prev
      </button>
      <span className="pl-2 pr-2">{props.highlight}</span>
      <button
        type="button"
        onClick={() => {
          const foundIndex = findSearchHighlightIndex(
            searchHighlightOffsets,
            highlightedSearchId,
          );
          if (foundIndex === searchHighlightOffsets.length - 1) {
            return;
          }
          const newIndex = foundIndex + 1;
          setHighlightedSearchId(searchHighlightOffsets[newIndex].body.id);
        }}
      >
        next &gt;
      </button>
    </div>
  );
}

function toPx(dimension: number | undefined) {
  return `${dimension || 0}px`;
}

function findSearchHighlightIndex(
  offsets: LineOffsets[],
  highlightedSearchId: string,
) {
  const foundIndex = offsets.findIndex(
    (o) => o.body.id === highlightedSearchId,
  );
  if (foundIndex === -1) {
    throw new Error(`No offset found by id: ${highlightedSearchId}`);
  }
  return foundIndex;
}
