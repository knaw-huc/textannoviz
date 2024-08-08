import { PropsWithChildren } from "react";
import { MarkerSegment } from "./AnnotationModel.ts";
import { Optional } from "../../../utils/Optional.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import { isNoteBody } from "../../../model/AnnoRepoAnnotation.ts";
import { useTextStore } from "../../../stores/text.ts";
import { BroccoliTextGeneric } from "../../../model/Broccoli.ts";
import { OverlayArrow, Tooltip } from "react-aria-components";
import { SpanTooltipButton } from "./SpanTooltipButton.tsx";

/**
 * Marker annotations link footnote annotations to a location in the line
 */
export function FootnoteModalMarkerButton(
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
  const textPanel = textPanels.self;
  const noteBodyId = note.body.id;
  const lines = createNoteLines(textPanel, noteBodyId);
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
