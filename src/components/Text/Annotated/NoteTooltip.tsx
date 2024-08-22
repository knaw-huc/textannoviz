import { PropsWithChildren } from "react";
import { OverlayArrow, Tooltip } from "react-aria-components";

export function TooltipWithArrow(props: PropsWithChildren<unknown>) {
  return (
    <Tooltip {...props}>
      <OverlayArrow>
        <svg width={8} height={8} viewBox="0 0 8 8">
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {props.children}
    </Tooltip>
  );
}
