import { ReactNode } from "react";
import { DialogTrigger } from "react-aria-components";

import { SpanButton } from "./SpanButton.tsx";

export function SpanModalButton(props: { label: ReactNode; modal: ReactNode }) {
  /**
   * Opening of model is handled by react-aria
   * (see {@link DialogTrigger} and {@link SpanButton}
   */
  return (
    <DialogTrigger>
      <SpanButton>{props.label}</SpanButton>
      {props.modal}
    </DialogTrigger>
  );
}
