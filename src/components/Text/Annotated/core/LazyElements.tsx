import { useEffect, useMemo, useRef, useState } from "react";
import { Element } from "./block";

import { Elements } from "./Elements.tsx";
import {
  cancelIdleCallback,
  requestIdleCallback,
} from "./utils/requestIdleCallback.ts";

type LazyElementsProps = {
  elements: Element[];
  totalChars: number;
  initChars?: number;
};

/**
 * For a large text, initialize with a subset of elements that amount up to
 * {@link initChars} to populate the screen quickly, using an estimated spacer
 * to maintain the scroll position.
 * After the initial batch is rendered, load the remaining elements.
 */
export function LazyElements({
  elements,
  totalChars,
  initChars = estimateInitChars(),
}: LazyElementsProps) {
  const initElementIndex = useMemo(
    () => findInitElementIndex(elements, initChars),
    [elements, initChars],
  );
  const needsLazyLoad = initElementIndex !== -1;
  const [renderAll, setRenderAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = useState(0);
  const [prevElements, setPrevElements] = useState(elements);

  if (prevElements !== elements) {
    setPrevElements(elements);
    setRenderAll(false);
    setSpacerHeight(0);
  }

  useEffect(() => {
    if (!needsLazyLoad || renderAll) {
      return;
    }

    const container = containerRef.current;
    if (container) {
      const renderedHeight = container.getBoundingClientRect().height;
      const renderedChars = elements
        .slice(0, initElementIndex)
        .reduce((sum, e) => sum + countElementChars(e), 0);

      if (renderedChars) {
        const remainingChars = totalChars - renderedChars;
        setSpacerHeight((remainingChars / renderedChars) * renderedHeight);
      }
    }

    // Wait for the browser to render the first batch, render the rest later:
    const id = requestIdleCallback(() => setRenderAll(true), { timeout: 1000 });
    return () => cancelIdleCallback(id);
  }, [needsLazyLoad, renderAll, elements, initElementIndex, totalChars]);

  if (!needsLazyLoad) {
    return <Elements elements={elements} />;
  }

  return (
    <div ref={containerRef}>
      <Elements
        elements={renderAll ? elements : elements.slice(0, initElementIndex)}
      />
      {!renderAll && spacerHeight > 0 && (
        <div style={{ height: spacerHeight }} />
      )}
    </div>
  );
}

/**
 * Find the first root element that passes the initChars threshold
 */
function findInitElementIndex(
  elements: Element[],
  initChars: number,
): number | -1 {
  let total = 0;
  for (let i = 0; i < elements.length; i++) {
    total += countElementChars(elements[i]);
    if (total >= initChars) {
      return i + 1;
    }
  }
  return -1;
}

function countElementChars(element: Element): number {
  if (!element.isBlock) {
    return element.segments.reduce(
      (charCount, segment) => charCount + segment.body.length,
      0,
    );
  }
  return element.children.reduce(
    (charCount, child) => charCount + countElementChars(child),
    0,
  );
}

function estimateInitChars(): number {
  const charsPerLine = 70;
  const style = getComputedStyle(document.body);
  const lineHeight = parseFloat(style.lineHeight) || 24;
  const linesPerPage = Math.ceil(window.innerHeight / lineHeight);
  return charsPerLine * linesPerPage;
}
