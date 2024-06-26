import { PropsWithChildren } from "react";

/**
 * When nested or overlapping annotations are underlined, the most nested annotations can create gaps in the underlining.
 * E.g, consider the following annotations, ABC, AB and BC:
 * text: aabbcc
 *   BC: ##____
 *   AB: ____##
 *  ABC: ______
 * The underscores mark underlining, and the hashes mark gaps.
 *
 * The annotation BC overlaps with AB.
 * This overlap results in two empty parts:
 * - an empty spot between AB and the text `aa`;
 * - an empty gap between BC and the parent annotation ABC.
 * To render these gaps, a spacing component `DepthCorrection` is added.
 */
export function DepthCorrection(
  props: PropsWithChildren<{
    depthCorrection: number;
  }>,
) {
  return <>{props.children}</>;
  // TODO:
  // if (!props.depthCorrection) {
  //   return <>{props.children}</>;
  // }
  // return (
  //   <span className="depth-correction">
  //     <DepthCorrection depthCorrection={props.depthCorrection - 1}>
  //       {props.children}
  //     </DepthCorrection>
  //   </span>
  // );
}
