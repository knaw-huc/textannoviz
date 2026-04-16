export function throwUnknownAnnotation(
  slot: "annotation" | "highlight" | "marker" | "group",
  body: unknown,
): never {
  throw new Error(`Unknown ${slot}: ${JSON.stringify(body)}`);
}
