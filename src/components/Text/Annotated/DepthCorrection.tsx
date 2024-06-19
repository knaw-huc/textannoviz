import { PropsWithChildren } from "react";

/**
 * Every annotation has a certain depth. In order to align underlines between segments,
 * gaps between annotations and the text or other annotations need to be filled.
 *
 * Consider three annotations, ABC, AB and BC:
 *          text: aabbcc
 * BC  (depth 3): ##____
 * AB  (depth 2): ____##
 * ABC (depth 1): ______
 * (underscores mark an underlining, hashes mark empty space)
 *
 * The annotation BC overlaps with AB.
 * This overlap results in two empty parts:
 * - an empty spot between AB and the text `aa`;
 * - an empty 'lane' between BC and the parent annotation ABC.
 * To render these empty spots, a spacing component `DepthCorrection` is added.
 */
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
