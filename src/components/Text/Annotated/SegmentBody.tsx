import { CSSProperties } from "react";

export function SegmentBody(props: { body: string; depthCorrection: number }) {
  let className: string | undefined;
  const style: CSSProperties = {};
  if (props.depthCorrection) {
    className = `depth-correction`;
    style.marginBottom = props.depthCorrection * 3;
  }
  return (
    <span className={className} style={style}>
      {props.body}
    </span>
  );
}
