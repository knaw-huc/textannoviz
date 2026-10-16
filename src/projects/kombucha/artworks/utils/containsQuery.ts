export function containsQuery(value: unknown, queryLower: string): boolean {
  if (typeof value === "number") return false;
  if (typeof value === "string")
    return value.toLowerCase().includes(queryLower);
  if (Array.isArray(value))
    return value.some((v) => containsQuery(v, queryLower));
  if (typeof value === "object" && value)
    return Object.values(value).some((v) => containsQuery(v, queryLower));
  return false;
}
