import { DepthCorrection } from "./DepthCorrection.tsx";

export function SegmentBody(props: { body: string; depthCorrection: number }) {
  return (
    <DepthCorrection depthCorrection={props.depthCorrection}>
      {props.body}
    </DepthCorrection>
  );
}
