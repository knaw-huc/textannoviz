import { Body, TextOffsets } from "../../AnnotationModel.ts";

/**
 * aa<anno1>bb<anno2><anno3>cc</anno2></anno1>dd</anno3>ee
 */
export const body = "aabbccddee";

/**
 * Annotated sections:
 * aa (0,1) -> none
 * bb (2,3) -> anno1
 * cc (4,5) -> anno1, anno2, anno3
 * dd (6,7) -> anno3
 * ee (8,9) -> none
 */
export const annotations: TextOffsets[] = [
  {
    type: "nested",
    body: { id: "anno1" } as Body,
    beginChar: 2,
    endChar: 6,
  },
  {
    type: "nested",
    body: { id: "anno2" } as Body,
    beginChar: 4,
    endChar: 6,
  },
  {
    type: "nested",
    body: { id: "anno3" } as Body,
    beginChar: 4,
    endChar: 8,
  },
];
