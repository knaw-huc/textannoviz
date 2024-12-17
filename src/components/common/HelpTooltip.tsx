import { SpanTooltipButton } from "./SpanTooltipButton.tsx";
import { OverlayArrow, Tooltip } from "react-aria-components";
import { HelpIcon } from "./icons/HelpIcon.tsx";

export function HelpTooltip(props: { label?: string; iconColor?: string }) {
  // Hide tooltip when project does not provide a label:
  if (!props.label) {
    return null;
  }

  return (
    <SpanTooltipButton
      label={
        <span className="cursor-help p-1">
          <HelpIcon color={props.iconColor ?? "rgba(0,0,0,0.5)"} />
        </span>
      }
      tooltip={
        <Tooltip {...props} className="react-aria-Tooltip help-tooltip">
          <OverlayArrow>
            <svg width={8} height={8} viewBox="0 0 8 8">
              <path d="M0 0 L4 4 L8 0" />
            </svg>
          </OverlayArrow>
          <div className="help-tooltip">{props.label}</div>
        </Tooltip>
      }
      delay={100}
    />
  );
}
