export function getTabFromHash(hash: string) {
  switch (hash) {
    case "non-illustrated":
      return "nonIllustrated";
    case "sketches":
      return "sketches";
    case "illustrated":
      return "artworksAll";
    default:
      return "artworksAll";
  }
}
