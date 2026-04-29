import { useRef } from "react";
import { MarkerBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { useAnnotationStore } from "../../../../stores/annotation.ts";
import { useDetailViewStore } from "../../../../stores/detail-view/detail-view-store.ts";
import { useTextStore } from "../../../../stores/text/text-store.ts";
import { MarkerSegment } from "../../../../components/Text/Annotated/core";
import { createTooltipMarkerClasses } from "../../../../components/Text/Annotated/utils/createAnnotationClasses.ts";
import { isNoteReference } from "../../annotation/ProjectAnnotationModel.ts";

export function TooltipMarkerAnnotation(props: {
  marker: MarkerSegment<MarkerBody>;
}) {
  const activeFootnote = useTextStore((state) => state.activeFootnote);
  const setActiveFootnote = useTextStore((state) => state.setActiveFootnote);
  const setActiveSidebarTab = useDetailViewStore(
    (state) => state.setActiveSidebarTab,
  );
  const ptrToNoteAnnosMap = useAnnotationStore(
    (state) => state.ptrToNoteAnnosMap,
  );
  const ref = useRef<HTMLSpanElement>(null);
  const { marker } = props;
  const classNames: string[] = [];
  const noteReference = isNoteReference(marker.body) && marker.body;
  if (!noteReference) {
    throw new Error("Expected pointer:" + JSON.stringify(noteReference));
  }
  classNames.push(...createTooltipMarkerClasses());
  const noteUrl = noteReference.target;
  const footnote = ptrToNoteAnnosMap.get(noteUrl);
  if (!noteUrl) {
    console.warn(`No footnote for ${noteReference.id} with url ${noteUrl}`);
  }
  const footnoteNumber = footnote?.body.n ?? "?";

  function spanClickHandler(footnoteNumber: string) {
    setActiveFootnote(footnoteNumber);
    setActiveSidebarTab("notes");
  }

  return (
    <span
      ref={ref}
      className={`${classNames.join(
        " ",
      )} transition-all duration-300 ease-in-out ${
        activeFootnote === footnoteNumber ? "bg-[#FFCE01]" : "bg-white"
      }`}
      onClick={() => spanClickHandler(footnoteNumber)}
      role="button"
      tabIndex={0}
      onKeyDown={() => spanClickHandler(footnoteNumber)}
    >
      {(marker.body.n || footnoteNumber) ?? "*"}
    </span>
  );
}
