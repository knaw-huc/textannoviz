export function buildNavLink(target: string, projectName: string) {
  const baseUrl = `/detail/urn:mace:huc.knaw.nl:${projectName}:`;

  if (target.startsWith("bio")) {
    return "/persons";
  }

  if (target.startsWith("place")) {
    return "/locations";
  }

  if (target.startsWith("biblio")) {
    return `bibliography`;
  }

  return `${baseUrl}${target}`;
}
