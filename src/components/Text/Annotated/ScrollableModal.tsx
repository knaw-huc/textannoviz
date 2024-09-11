import { PropsWithChildren } from "react";
import { Button, Dialog, Modal } from "react-aria-components";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function ScrollableModal(
  props: PropsWithChildren<{ className: string }>,
) {
  const classNames = ["bg-white", props.className];

  return (
    <Modal className={classNames.join(" ")}>
      <Dialog>
        {({ close }) => (
          <div className="scrollable-modal-content">
            <div className="my-4 flex justify-end px-4">
              <Button
                className="rounded bg-neutral-200 p-2"
                onPress={() => close()}
              >
                <XMarkIcon className="h-6 fill-neutral-500 stroke-neutral-800" />
              </Button>
            </div>
            {props.children}
          </div>
        )}
      </Dialog>
    </Modal>
  );
}
