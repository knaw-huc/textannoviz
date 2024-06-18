import { PropsWithChildren } from "react";

export function DepthCorrection(
  props: PropsWithChildren<{
    depthCorrection: number;
  }>,
) {
  if (!props.depthCorrection) {
    return <>{props.children}</>;
  }
  return (
    <span className="depth-correction">
      <DepthCorrection depthCorrection={props.depthCorrection - 1}>
        {props.children}
      </DepthCorrection>
    </span>
  );
}
