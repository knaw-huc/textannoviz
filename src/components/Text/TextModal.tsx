import { ElementType, PropsWithChildren, useRef } from "react";
import { useButton } from "react-aria";
import { Dialog, DialogTrigger, Modal } from "react-aria-components";
import "../../MyModal.css";
import { AriaButtonOptions } from "@react-aria/button";

import { StyledText } from "./StyledText.tsx";
import { LineSegmentsViewer } from "./Annotated/LineSegmentsViewer.tsx";
import _ from "lodash";
import { Segment } from "./Annotated/AnnotationModel.ts";

function SpanButton(props: PropsWithChildren<AriaButtonOptions<ElementType>>) {
  const ref = useRef(null);
  const { buttonProps } = useButton(props, ref);
  const { children } = props;

  return (
    <span {...buttonProps} ref={ref}>
      {children}
    </span>
  );
}

export function TextModal(props: PropsWithChildren<{ segments: Segment[] }>) {
  return (
    <DialogTrigger>
      <SpanButton>{props.children}</SpanButton>
      <Modal style={{ width: "600px" }}>
        <Dialog>
          {({ close }) => (
            <>
              <button onClick={() => close()}>[X]</button>
              <StyledText panel="text-modal">
                <LineSegmentsViewer
                  segments={props.segments}
                  showDetails={true}
                  onClickSegment={_.noop}
                />
              </StyledText>
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
