import {
  AnnotationBody,
  OffsetsByCharIndex,
  LineOffsets,
} from "../../AnnotationModel.ts";

/**
 * aa<anno1>bb<anno2><anno3>cc</anno2></anno1>dd</anno3>ee
 */
export const line = "aabbccddee";

/**
 * Annotated sections:
 * aa (0,1) -> none
 * bb (2,3) -> anno1
 * cc (4,5) -> anno1, anno2, anno3
 * dd (6,7) -> anno3
 * ee (8,9) -> none
 */
export const annotations: LineOffsets[] = [
  {
    type: "annotation",
    body: { id: "anno1" } as AnnotationBody,
    lineIndex: 0,
    startChar: 2,
    endChar: 6,
  },
  {
    type: "annotation",
    body: { id: "anno2" } as AnnotationBody,
    lineIndex: 0,
    startChar: 4,
    endChar: 6,
  },
  {
    type: "annotation",
    body: { id: "anno3" } as AnnotationBody,
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
        mark: "start",
        type: "annotation",
        body: { id: "anno1" } as AnnotationBody,
      },
    ],
  },
  {
    charIndex: 4,
    offsets: [
      {
        charIndex: 4,
        mark: "start",
        type: "annotation",
        body: { id: "anno2" } as AnnotationBody,
      },
      {
        charIndex: 4,
        mark: "start",
        type: "annotation",
        body: { id: "anno3" } as AnnotationBody,
      },
    ],
  },
  {
    charIndex: 6,
    offsets: [
      {
        charIndex: 6,
        mark: "end",
        type: "annotation",
        body: { id: "anno1" } as AnnotationBody,
      },
      {
        charIndex: 6,
        mark: "end",
        type: "annotation",
        body: { id: "anno2" } as AnnotationBody,
      },
    ],
  },
  {
    charIndex: 8,
    offsets: [
      {
        charIndex: 8,
        mark: "end",
        type: "annotation",
        body: { id: "anno3" } as AnnotationBody,
      },
    ],
  },
];
