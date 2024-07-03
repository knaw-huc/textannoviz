import { ElementType, PropsWithChildren, ReactNode, useRef } from "react";
import { AriaTooltipProps, TooltipTriggerProps } from "@react-types/tooltip";

import { useTooltipTriggerState } from "react-stately";
import {
  mergeProps,
  useButton,
  useTooltip,
  useTooltipTrigger,
} from "react-aria";
import { TooltipTriggerState } from "@react-stately/tooltip";
import { Dialog, DialogTrigger, Modal } from "react-aria-components";
import "./MyModal.css";
import { AriaButtonOptions } from "@react-aria/button";

export type ToolTipProps = PropsWithChildren<
  AriaTooltipProps & { state: TooltipTriggerState }
>;

function Tooltip(props: ToolTipProps) {
  const { state } = props;
  const { tooltipProps } = useTooltip(props, state);

  return (
    <span
      style={{
        position: "absolute",
        left: "5px",
        top: "100%",
        maxWidth: 150,
        marginTop: "10px",
        backgroundColor: "white",
        color: "black",
        padding: "5px",
        border: "1px solid gray",
      }}
      {...mergeProps(props, tooltipProps)}
    >
      {props.children}
    </span>
  );
}

function TooltipTrigger(
  props: PropsWithChildren<TooltipTriggerProps & { tooltip: ReactNode }>,
) {
  const state = useTooltipTriggerState(props);
  const ref = useRef(null);

  // Get props for the trigger and its tooltip
  const { triggerProps, tooltipProps } = useTooltipTrigger(props, state, ref);

  return (
    <span style={{ position: "relative" }}>
      <span
        ref={ref}
        {...triggerProps}
        style={{ fontSize: 18 }}
        onClick={() => (state.isOpen ? state.close(true) : state.open(true))}
        onMouseOver={(e) => e.preventDefault()}
        onMouseLeave={(e) => e.preventDefault()}
      >
        {props.children}
      </span>
      {state.isOpen && (
        <Tooltip state={state} {...tooltipProps}>
          {props.tooltip}
        </Tooltip>
      )}
    </span>
  );
}

export function Tbs() {
  return (
    <>
      <TooltipTrigger tooltip="Edit">✏️</TooltipTrigger>
      <TooltipTrigger tooltip="Delete">🚮</TooltipTrigger>
      <MyModal />
    </>
  );
}

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
      <SpanButton>Sign up…</SpanButton>
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
