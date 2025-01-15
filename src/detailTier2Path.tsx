export const detailPrefix = `detail/`;
export const detailTier2Path = `${detailPrefix}:tier2`;

export function detailPath(tier2: string) {
  return `/detail/${tier2}`;
}
