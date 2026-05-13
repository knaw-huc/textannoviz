import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import { BroccoliRelativeAnno } from "../../../../model/Broccoli.ts";
import { ProjectAnnotatedText } from "../ProjectAnnotatedText.tsx";
import { Segment, TextPositions } from "./AnnotationModel.ts";
import { SegmentedText } from "./SegmentedText.tsx";

export const debugAnno = "let759/p.trans.1/body";

export function id(s: string) {
  return debugAnno ? s : undefined;
}

export function debugTextAnnoSlice(
  relativeAnnotations: BroccoliRelativeAnno[],
  annotations: AnnoRepoAnnotation[],
  textBody: string,
) {
  if (!debugAnno) {
    return;
  }
  const relative = relativeAnnotations.find((a) =>
    a.bodyId.includes(debugAnno),
  );
  if (!relative) {
    return;
  }
  const anno = annotations.find((a) => a.body.id.includes(debugAnno));
  const textSlice = textBody.slice(relative.begin, relative.end);
  const context = {
    anno,
    relative,
    textSlice,
    annotations,
    relativeAnnotations,
  };
  console.log(ProjectAnnotatedText.name, context);
}

export function debugSegments(offsets: TextPositions[], segments: Segment[]) {
  if (!debugAnno) {
    return;
  }
  const annoOffsets = offsets.find((a) => a.body.id.includes(debugAnno));
  if (!annoOffsets) {
    return;
  }
  const annoSegments = segments.find((s) =>
    s.annotations.some((a) => a.body.id.includes(debugAnno)),
  );
  const context = { annoOffsets, annoSegments, offsets, segments };
  console.log(SegmentedText.name, context);
}
