export function throwUnknownAnnotation(
  type: "annotation" | "highlight" | "marker" | "group",
  body: unknown,
): never {
  throw new Error(`Unknown ${type}: ${JSON.stringify(body)}`);
}
