import { PropsWithChildren } from "react";
import { MarkerSegment } from "./AnnotationModel.ts";
import { Optional } from "../../../utils/Optional.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import { isNoteBody } from "../../../model/AnnoRepoAnnotation.ts";
import { useTextStore } from "../../../stores/text.ts";
import { BroccoliTextGeneric } from "../../../model/Broccoli.ts";
import { OverlayArrow, Tooltip } from "react-aria-components";
import { SpanTooltipButton } from "./SpanTooltipButton.tsx";

// Detail.tsx performs an additional broccoli call to retrieve notes:
export const NOTES_VIEW = "notes";

/**
 * Marker annotation links footnote annotation to a location in the text
 */
export function FootnoteTooltipMarkerButton(
  props: Optional<FootnoteModalProps, "clickedMarker">,
) {
  return (
    <SpanTooltipButton
      label={props.children}
      tooltip={
        props.clickedMarker && (
          <FootnoteTooltip {...props} clickedMarker={props.clickedMarker} />
        )
      }
      delay={100}
    />
  );
}

type FootnoteModalProps = PropsWithChildren<{
  clickedMarker: MarkerSegment;
}>;

export function FootnoteTooltip(props: FootnoteModalProps) {
  const annotations = useAnnotationStore().annotations;
  const textPanels = useTextStore((state) => state.views);
  if (!textPanels) {
    throw new Error(`No text panels found`);
  }
  const noteTargetId = props.clickedMarker.body.metadata.target.split("#")[1];
  const note = annotations.find(
    (a) => isNoteBody(a.body) && a.body.metadata["tei:id"] === noteTargetId,
  );
  if (!note) {
    throw new Error(`No note found for marker ${noteTargetId}`);
  }
  const notesView = textPanels[NOTES_VIEW];
  if (!notesView) {
    throw new Error("No `notes` text panel found");
  }
  const noteBodyId = note.body.id;
  const lines = createNoteLines(notesView, noteBodyId);

  return (
    <Tooltip {...props}>
      <OverlayArrow>
        <svg width={8} height={8} viewBox="0 0 8 8">
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      <div>{lines.join("")}</div>
    </Tooltip>
  );
}

function createNoteLines(view: BroccoliTextGeneric, noteBodyId: string) {
  const noteOffsets = view.locations.annotations.find(
    (a) => a.bodyId === noteBodyId,
  );
  if (!noteOffsets) {
    throw new Error(`No relative note found for ${noteBodyId}`);
  }
  const noteLines = view.lines.slice(
    noteOffsets.start.line,
    // Broccoli end includes last element:
    noteOffsets.end.line + 1,
  );
  noteLines[0] = noteLines[0].slice(
    noteOffsets.start.offset,
    noteLines[0].length,
  );
  const lastLine = noteLines.length - 1;
  noteLines[lastLine] = noteLines[lastLine].slice(0, noteOffsets.end.offset);
  return noteLines;
}
