import { useEffect, useRef, useState, useMemo } from "react";
import { Element } from "./block";

import { Elements } from "./Elements.tsx";

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
  initChars = 3000,
}: LazyElementsProps) {
  const initElementThreshold = useMemo(
    () => findInitElementThreshold(elements, initChars),
    [elements, initChars],
  );

  const needsLazyLoad = initElementThreshold < elements.length;

  const [renderAll, setRenderAll] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
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

    const el = contentRef.current;
    if (el) {
      const renderedHeight = el.getBoundingClientRect().height;
      const renderedChars = elements
        .slice(0, initElementThreshold)
        .reduce((sum, e) => sum + countElementChars(e), 0);

      if (renderedChars) {
        const remainingChars = totalChars - renderedChars;
        setSpacerHeight((remainingChars / renderedChars) * renderedHeight);
      }
    }

    const id = setTimeout(() => setRenderAll(true), 0);
    return () => clearTimeout(id);
  }, [needsLazyLoad, renderAll, elements, initElementThreshold, totalChars]);

  if (!needsLazyLoad) {
    return <Elements elements={elements} />;
  }

  return (
    <div ref={contentRef}>
      <Elements
        elements={
          renderAll ? elements : elements.slice(0, initElementThreshold)
        }
      />
      {!renderAll && spacerHeight > 0 && (
        <div style={{ height: spacerHeight }} />
      )}
    </div>
  );
}

function findInitElementThreshold(
  elements: Element[],
  threshold: number,
): number {
  let total = 0;
  for (let i = 0; i < elements.length; i++) {
    total += countElementChars(elements[i]);
    if (total >= threshold) {
      return i + 1;
    }
  }
  return elements.length;
}

function countElementChars(element: Element): number {
  if (!element.isBlock) {
    return element.segments.reduce(
      (counted, segment) => counted + segment.body.length,
      0,
    );
  }
  return element.children.reduce(
    (counted, child) => counted + countElementChars(child),
    0,
  );
}
