import { ReactNode } from "react";
import { DialogTrigger } from "react-aria-components";
import { SpanButton } from "./SpanButton.tsx";

export function SpanModalButton(props: {
  label: ReactNode;
  modal: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  return (
    <DialogTrigger isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <SpanButton>{props.label}</SpanButton>
      {props.modal}
    </DialogTrigger>
  );
}
