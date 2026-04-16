import { XMarkIcon } from "@heroicons/react/24/outline";
import { PropsWithChildren } from "react";
import { Button, Dialog, Modal, ModalOverlay } from "react-aria-components";

type ScrollableModalProps = PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
}>;

export function ScrollableModal(props: ScrollableModalProps) {
  return (
    <ModalOverlay
      isOpen={props.isOpen}
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
      isDismissable
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <Modal className="h-fit w-full max-w-4xl rounded-lg bg-white shadow-xl">
        <Dialog>
          <div className="scrollable-modal-content">
            <div className="my-4 flex w-full justify-end px-4">
              <Button
                className="rounded bg-neutral-200 p-2"
                onPress={props.onClose}
              >
                <XMarkIcon className="h-6 fill-neutral-500 stroke-neutral-800" />
              </Button>
            </div>
            {props.children}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
