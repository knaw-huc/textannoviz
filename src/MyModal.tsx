import { ElementType, PropsWithChildren, useRef } from "react";
import { useButton } from "react-aria";
import { Dialog, DialogTrigger, Modal } from "react-aria-components";
import "./MyModal.css";
import { AriaButtonOptions } from "@react-aria/button";

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

export function MyModal() {
  return (
    <DialogTrigger>
      <SpanButton>Open</SpanButton>
      <Modal>
        <Dialog>
          {({ close }) => (
            <div className="prose border-brand1Grey-100 mx-auto w-full max-w-full overflow-auto border-x border-y p-3 font-serif text-lg">
              <p>Modal</p>
              <button onClick={() => close()}>close</button>
            </div>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
