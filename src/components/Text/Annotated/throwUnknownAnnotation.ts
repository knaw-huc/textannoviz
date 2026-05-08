import { AnnotationType } from "./core/AnnotationModel.ts";

export function throwUnknownAnnotation(
  type: AnnotationType,
  body: unknown,
): never {
  throw new Error(`Unknown ${type}: ${JSON.stringify(body)}`);
}
