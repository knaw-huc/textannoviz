import { AnnoRepoAnnotation } from "../../../../../model/AnnoRepoAnnotation.ts";
import { OffsetsByCharIndex, RelativeTextAnnotation } from "../../Model.ts";

export const line = "aabbccddee";
/**
 * Annotated sections:
 * aa (0,1) -> none
 * bb (2,3) -> anno1
 * cc (4,5) -> anno1, anno2, anno3
 * dd (6,7) -> anno3
 * ee (8,9) -> none
 */
export const annotations: RelativeTextAnnotation[] = [
  {
    type: "Entity",
    anno: { body: { id: "anno1" } } as AnnoRepoAnnotation,
    lineIndex: 0,
    startChar: 2,
    endChar: 6,
  },
  {
    type: "Entity",
    anno: { body: { id: "anno2" } } as AnnoRepoAnnotation,
    lineIndex: 0,
    startChar: 4,
    endChar: 6,
  },
  {
    type: "Entity",
    anno: { body: { id: "anno3" } } as AnnoRepoAnnotation,
    lineIndex: 0,
    startChar: 4,
    endChar: 8,
  },
];

export const offsetsByCharIndex: OffsetsByCharIndex[] = [
  {
    charIndex: 2,
    offsets: [
      {
        charIndex: 2,
        type: "start",
        annotationId: "anno1",
      },
    ],
  },
  {
    charIndex: 4,
    offsets: [
      {
        charIndex: 4,
        type: "start",
        annotationId: "anno2",
      },
      {
        charIndex: 4,
        type: "start",
        annotationId: "anno3",
      },
    ],
  },
  {
    charIndex: 6,
    offsets: [
      {
        charIndex: 2,
        type: "end",
        annotationId: "anno1",
      },
      {
        charIndex: 4,
        type: "end",
        annotationId: "anno2",
      },
    ],
  },
  {
    charIndex: 8,
    offsets: [
      {
        charIndex: 4,
        type: "end",
        annotationId: "anno3",
      },
    ],
  },
];