import { PropsWithChildren, useEffect, useRef } from "react";
import { useDetailViewStore } from "../../../../stores/detail-view/detail-view-store";

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
  const setPanelVisibilityOverrides = useDetailViewStore(
    (state) => state.setPanelVisibilityOverrides,
  );

  const resetPanelVisibilityOverrides = useDetailViewStore(
    (state) => state.resetPanelVisibilityOverrides,
  );

  const { url, className, children } = props;
  const paragraphId = url.slice(1);
  const didHighlight = useRef(false);

  useEffect(() => {
    return () => {
      resetPanelVisibilityOverrides();
      if (didHighlight.current) {
        clearParagraphReferenceHighlights();
      }
    };
  }, []);

  function go() {
    if (paragraphId) {
      const element = document.getElementById(paragraphId);
      if (element) {
        // The panel name is now hardcoded. This is okay for now, since only Van Gogh uses this functionality. If other projects begin using this and want to scroll in other panels, we should find a way to compute which panel should be made visible.
        setPanelVisibilityOverrides({ "text.orig": true });
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
