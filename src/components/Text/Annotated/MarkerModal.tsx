import { PropsWithChildren } from "react";
import { MarkerSegment } from "./AnnotationModel.ts";
import { Optional } from "../../../utils/Optional.ts";
import { ScrollableModal } from "./ScrollableModal.tsx";
import { SpanModalButton } from "./SpanModalButton.tsx";

type MarkerModalProps = PropsWithChildren<{
  clickedMarker: MarkerSegment;
}>;

export function MarkerModalButton(
  props: Optional<MarkerModalProps, "clickedMarker">,
) {
  return (
    <SpanModalButton
      label={props.children}
      modal={
        props.clickedMarker && (
          <MarkerModal {...props} clickedMarker={props.clickedMarker} />
        )
      }
    />
  );
}

export function MarkerModal(props: MarkerModalProps) {
  return (
    <ScrollableModal>
      <pre>{JSON.stringify(props.clickedMarker, null, 2)}</pre>
    </ScrollableModal>
  );
}
