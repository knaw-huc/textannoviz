export function toPageNumber(from: number, size: number) {
  return Math.floor(from / size) + 1;
}
