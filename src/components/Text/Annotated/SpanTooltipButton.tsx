import { ReactNode } from "react";
import { TooltipTrigger } from "react-aria-components";
import { SpanButton } from "./SpanButton.tsx";

export function SpanTooltipButton(props: {
  label: ReactNode;
  tooltip: ReactNode;
}) {
  /**
   * Opening of model is handled by react-aria
   * (see {@link TooltipTrigger} and {@link SpanButton}
   */
  return (
    <TooltipTrigger delay={100}>
      <SpanButton>{props.label}</SpanButton>
      {props.tooltip}
    </TooltipTrigger>
  );
}
