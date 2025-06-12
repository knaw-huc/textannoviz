import { PropsWithChildren } from "react";
import { OverlayArrow, Tooltip } from "react-aria-components";
import {
  AnnoRepoAnnotation,
  isNoteBody,
  NoteBody,
} from "../../../model/AnnoRepoAnnotation.ts";
import { BroccoliTextGeneric, ViewLang } from "../../../model/Broccoli.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import { useTextStore } from "../../../stores/text/text-store.ts";
import { Optional } from "../../../utils/Optional.ts";
import { SpanTooltipButton } from "../../common/SpanTooltipButton.tsx";
import { MarkerSegment } from "./AnnotationModel.ts";
import { AnnotatedText } from "./AnnotatedText.tsx";

// Detail.tsx performs an additional broccoli call to retrieve notes:
export const NOTES_VIEW = "notes";

/**
 * Marker annotation links footnote annotation to a location in the text
 */
export function TooltipMarkerButton(
  props: Optional<FootnoteModalProps, "clickedMarker">,
) {
  return (
    <SpanTooltipButton
      label={props.children}
      tooltip={
        props.clickedMarker && (
          <MarkerTooltip {...props} clickedMarker={props.clickedMarker} />
        )
      }
      delay={100}
    />
  );
}

type FootnoteModalProps = PropsWithChildren<{
  clickedMarker: MarkerSegment;
}>;

export function MarkerTooltip(props: FootnoteModalProps) {
  const annotations = useAnnotationStore().annotations;
  const textPanels = useTextStore((state) => state.views);
  const tooltipBody = getTooltipBody(
    textPanels?.["textNotes"],
    props,
    annotations,
  );
  return (
    <Tooltip {...props}>
      <OverlayArrow>
        <svg width={8} height={8} viewBox="0 0 8 8">
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      <AnnotatedText text={tooltipBody} showDetail={false} />
    </Tooltip>
  );
}

// TODO: move to project config
function getTooltipBody(
  textPanels: Record<ViewLang, Record<string, BroccoliTextGeneric>> | undefined,
  props: {
    clickedMarker: MarkerSegment;
  } & {
    children?: React.ReactNode | undefined;
  },
  annotations: AnnoRepoAnnotation[],
) {
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

  const noteLanguage = (note.body as NoteBody).metadata.lang as ViewLang;

  const notesView = textPanels[noteLanguage];
  if (!notesView) {
    throw new Error("No `notes` text panel found");
  }

  const noteNumber = (note.body as NoteBody).metadata.n;

  if (!noteNumber) {
    throw new Error(`No note number for ${note.body.id}`);
  }

  return notesView[noteNumber];
}

export function createNoteLines(view: BroccoliTextGeneric, noteBodyId: string) {
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
  noteLines[lastLine] = noteLines[lastLine].slice(
    0,
    noteOffsets.end.offset! + 1,
  );
  return noteLines;
}
