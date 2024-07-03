import { useTooltipTriggerState } from "react-stately";
import { mergeProps, useTooltip, useTooltipTrigger } from "react-aria";
import { PropsWithChildren, ReactNode, useRef } from "react";
import { AriaTooltipProps, TooltipTriggerProps } from "@react-types/tooltip";
import { TooltipTriggerState } from "@react-stately/tooltip";

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

function TooltipButton(
  props: PropsWithChildren<TooltipTriggerProps & { tooltip: ReactNode }>,
) {
  const state = useTooltipTriggerState(props);
  const ref = useRef(null);

  // Get props for the trigger and its tooltip
  const { triggerProps, tooltipProps } = useTooltipTrigger(props, state, ref);

  return (
    <span style={{ position: "relative" }}>
      <button
        ref={ref}
        {...triggerProps}
        style={{ fontSize: 18 }}
        onClick={() => alert("Pressed button")}
      >
        {props.children}
      </button>
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
      <TooltipButton tooltip="Edit">✏️</TooltipButton>
      <TooltipButton tooltip="Delete">🚮</TooltipButton>
    </>
  );
}
