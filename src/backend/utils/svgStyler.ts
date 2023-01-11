export const svgStyler = (svg: string, colour: string): string => {
  const parser = new DOMParser();
  const serializer = new XMLSerializer();

  const doc = parser.parseFromString(svg, "application/xml");
  const path = doc.getElementsByTagName("path");

  if (path.length > 0) {
    path[0].setAttribute("stroke", colour);
    path[0].setAttribute("fill", colour);
    path[0].setAttribute("fill-opacity", "0.5");
    path[0].setAttribute("stroke-width", "1");
  }

  return serializer.serializeToString(doc);
};
