import { Segment } from "./AnnotationModel.ts";
import { Modal, ModalOverlay } from "react-aria-components";

type ClickedAnnotationModalProps = {
  segments: Segment[];
};

export function ClickedAnnotationModal(props: ClickedAnnotationModalProps) {
  // const state = useOverlayTriggerState(props);
  console.log("ClickedAnnotationModal", props);
  return (
    <ModalOverlay>
      <Modal isOpen={true}>
        <>
          MODAL
          {/*{props.segments.map((segment, i) => (*/}
          {/*  <LineSegment*/}
          {/*    key={i}*/}
          {/*    segment={segment}*/}
          {/*    onClick={(s) => console.log('clicked', s)}*/}
          {/*  />*/}
          {/*))}*/}
        </>
      </Modal>
    </ModalOverlay>
  );
}
