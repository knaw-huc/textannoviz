import { PropsWithChildren, useEffect, useRef } from "react";

const highlightMarker = "paragraphReferenceHighlight";
const highlightClasses = [
  highlightMarker,
  "bg-[#FFCE01]",
  "rounded-lg",
  "transition-all",
  "duration-300",
  "w-fit",
];

function clearParagraphReferenceHighlights() {
  document
    .querySelectorAll(`.${highlightMarker}`)
    .forEach((element) => element.classList.remove(...highlightClasses));
}

export function ParagraphReferenceLink(
  props: PropsWithChildren<{ url: string; className?: string }>,
) {
  const { url, className, children } = props;
  const paragraphId = url.slice(1);
  const didHighlight = useRef(false);

  useEffect(() => {
    return () => {
      if (didHighlight.current) {
        clearParagraphReferenceHighlights();
      }
    };
  }, []);

  function go() {
    if (paragraphId) {
      const element = document.getElementById(paragraphId);
      if (element) {
        clearParagraphReferenceHighlights();
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add(...highlightClasses);
        didHighlight.current = true;
      }
    }
  }

  return (
    <span
      className={`closedNestedAnnotation cursor-pointer ${className ?? ""}`}
      role="link"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === "Enter") go();
      }}
    >
      {children}
    </span>
  );
}
