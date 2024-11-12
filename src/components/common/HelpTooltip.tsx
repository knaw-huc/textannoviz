import { SpanTooltipButton } from "./SpanTooltipButton.tsx";
import { OverlayArrow, Tooltip } from "react-aria-components";
import { HelpIcon } from "./icons/HelpIcon.tsx";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";

export function HelpTooltip(props: { label: string }) {
  const translateProject = useProjectStore(translateProjectSelector);

  return (
    <SpanTooltipButton
      label={
        <span className="p-1">
          <HelpIcon />
        </span>
      }
      tooltip={
        <Tooltip {...props} className="react-aria-Tooltip help-tooltip">
          <OverlayArrow>
            <svg width={8} height={8} viewBox="0 0 8 8">
              <path d="M0 0 L4 4 L8 0" />
            </svg>
          </OverlayArrow>
          <div className="help-tooltip">{translateProject(props.label)}</div>
        </Tooltip>
      }
      delay={100}
    />
  );
}
