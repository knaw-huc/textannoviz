import { useRef } from "react";
import { MarkerBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { useAnnotationStore } from "../../../../stores/annotation.ts";
import { useTextStore } from "../../../../stores/text/text-store.ts";
import { MarkerSegment } from "../../../../components/Text/Annotated/core";
import { createTooltipMarkerClasses } from "../../../../components/Text/Annotated/utils/createAnnotationClasses.ts";
import { isNoteReference } from "../ProjectAnnotationModel.ts";
import { useSelectNote } from "../../../../components/Detail/useSelectNote.ts";

export function NoteMarker(props: { marker: MarkerSegment<MarkerBody> }) {
  const activeFootnote = useTextStore((state) => state.activeFootnote);
  const ptrToNoteAnnosMap = useAnnotationStore(
    (state) => state.ptrToNoteAnnosMap,
  );
  const selectNote = useSelectNote();

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

  function spanClickHandler() {
    selectNote(noteUrl.slice(1));
  }

  // Neither the active footnote nor panel visibility overrides are reset on
  // unmount: a marker unmounts whenever its panel is swapped out, which is
  // exactly what selecting a note does on a narrow screen. useInitDetail
  // clears both per letter instead.

  return (
    <span
      ref={ref}
      className={`${classNames.join(
        " ",
      )} transition-all duration-300 ease-in-out ${
        activeFootnote === footnoteNumber ? "bg-yellow-200" : "bg-white"
      }`}
      onClick={() => spanClickHandler()}
      role="button"
      tabIndex={0}
      onKeyDown={() => spanClickHandler()}
    >
      {(marker.body.n || footnoteNumber) ?? "*"}
    </span>
  );
}
