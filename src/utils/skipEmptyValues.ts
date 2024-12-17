import { Any } from "./Any.ts";

export function skipEmptyValues(_: string, v: Any) {
  return [null, ""].includes(v) ? undefined : v;
}
