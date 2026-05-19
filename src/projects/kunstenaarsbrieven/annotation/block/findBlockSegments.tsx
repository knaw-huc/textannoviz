import { Element, Segment } from "../../../../components/Text/Annotated/core";

export function findBlockSegments(elements: Element[]): Segment[] {
  return elements.flatMap((e) =>
    e.isBlock ? findBlockSegments(e.children) : e.segments,
  );
}
