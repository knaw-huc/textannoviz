type AnnotationHighlightProps = {
  svgPath: string;
  size: OpenSeadragon.Point;
  color: string;
};

export function AnnotationHighlight({
  svgPath,
  size,
  color,
}: AnnotationHighlightProps) {
  const d = getPathData(svgPath);

  return (
    <svg
      viewBox={`0 0 ${size.x} ${size.y}`}
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <path d={d} fill={color} fillOpacity={0.15} fillRule="evenodd" />
    </svg>
  );
}

function getPathData(svgPath: string): string {
  const match = svgPath.match(/d="([^"]+)"/);
  if (!match) {
    throw new Error("No d attribute found in SVG path");
  }
  return match[1];
}
