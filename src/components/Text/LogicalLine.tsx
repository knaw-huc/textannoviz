import { RelativeTextAnnotation } from "./RelativeTextAnnotation.tsx";

export function LogicalLine(props: {
  line: string;
  annotations: RelativeTextAnnotation[];
}) {
  return <>{props.line}</>;
}
