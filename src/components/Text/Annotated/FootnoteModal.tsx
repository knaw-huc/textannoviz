import { PropsWithChildren } from "react";
import { MarkerSegment } from "./AnnotationModel.ts";
import { Optional } from "../../../utils/Optional.ts";
import { ScrollableModal } from "./ScrollableModal.tsx";
import { SpanModalButton } from "./SpanModalButton.tsx";
import { useAnnotationStore } from "../../../stores/annotation.ts";

/**
 * A footnote annotation is connected to text by a marker annotation
 */
export function FootnoteModalButton(
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
  const footnotes = annotations.filter((a) => a.body.type === "tei:Note");
  console.log("FootnoteModal", { annotations, footnotes });

  return (
    <ScrollableModal>
      <pre>{JSON.stringify(props.clickedMarker, null, 2)}</pre>
    </ScrollableModal>
  );
}
