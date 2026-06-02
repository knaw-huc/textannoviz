export function buildNavLink(target: string) {
  const baseUrl = "/detail/urn:mace:huc.knaw.nl:vangogh:";

  if (target.startsWith("bio")) {
    return "/persons";
  }

  if (target.startsWith("artwork")) {
    const hash = target.split("#")[1];
    return `artworks#${hash}`;
  }

  if (target.startsWith("biblio#")) {
    const hash = target.split("#")[1];
    return `bibliography#${hash}`;
  }

  return `${baseUrl}${target}`;
}
