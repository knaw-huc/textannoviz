import { PropsWithChildren } from "react";
import { MarkerSegment } from "./AnnotationModel.ts";
import { Optional } from "../../../utils/Optional.ts";
import { ScrollableModal } from "./ScrollableModal.tsx";
import { SpanModalButton } from "./SpanModalButton.tsx";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import { isNoteBody } from "../../../model/AnnoRepoAnnotation.ts";
import { useTextStore } from "../../../stores/text.ts";
import { BroccoliTextGeneric } from "../../../model/Broccoli.ts";

/**
 * Marker annotations link footnote annotations to a location in the line
 */
export function FootnoteModalMarkerButton(
  props: Optional<FootnoteModalProps, "clickedMarker">,
) {
  return (
    <SpanModalButton
      label={props.children}
      modal={
        props.clickedMarker && (
          <FootnoteModal {...props} clickedMarker={props.clickedMarker} />
        )
      }
    />
  );
}

type FootnoteModalProps = PropsWithChildren<{
  clickedMarker: MarkerSegment;
}>;

export function FootnoteModal(props: FootnoteModalProps) {
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
  const textPanel = textPanels.self;
  const noteBodyId = note.body.id;
  const lines = createNoteLines(textPanel, noteBodyId);
  return (
    <ScrollableModal>
      <div>{lines.join("")}</div>
    </ScrollableModal>
  );
}

function createNoteLines(panel: BroccoliTextGeneric, noteBodyId: string) {
  const noteOffsets = panel.locations.annotations.find(
    (a) => a.bodyId === noteBodyId,
  );
  if (!noteOffsets) {
    throw new Error("No relative note found");
  }
  const noteLines = panel.lines.slice(
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
