import { ReactNode } from "react";
import { TooltipTrigger } from "react-aria-components";
import { SpanButton } from "../Text/Annotated/SpanButton.tsx";

import "./SpanTooltipButton.css";

export function SpanTooltipButton(props: {
  label: ReactNode;
  tooltip: ReactNode;
  delay: number;
}) {
  /**
   * Opening of model is handled by react-aria
   * (see {@link TooltipTrigger} and {@link SpanButton}
   */
  return (
    <TooltipTrigger delay={props.delay}>
      <SpanButton>{props.label}</SpanButton>
      {props.tooltip}
    </TooltipTrigger>
  );
}
