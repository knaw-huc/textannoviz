import { ElementType, PropsWithChildren, useRef } from "react";
import { useButton } from "react-aria";
import { Dialog, DialogTrigger, Modal } from "react-aria-components";
import "../../MyModal.css";
import { AriaButtonOptions } from "@react-aria/button";
import { StyledText } from "./TextPanel.tsx";

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

export function TextModal() {
  return (
    <DialogTrigger>
      <SpanButton>Open</SpanButton>
      <Modal>
        <Dialog>
          {({ close }) => (
            <StyledText panel="text-modal">
              <p>Modal</p>
              <button onClick={() => close()}>close</button>
            </StyledText>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
