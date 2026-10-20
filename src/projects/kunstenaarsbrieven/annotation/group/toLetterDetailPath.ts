import { getViteEnvVars } from "../../../../utils/viteEnvVars";

/**
 * Path to a letter's detail page, for opening it outside the router, e.g.
 * "let093" -> "/vangogh/detail/urn:mace:huc.knaw.nl:vangogh:let093"
 */
export function toLetterDetailPath(
  letterId: string,
  projectName: string,
): string {
  const { routerBasename } = getViteEnvVars();
  const basePath = routerBasename === "/" ? "" : routerBasename;
  return `${basePath}/detail/urn:mace:huc.knaw.nl:${projectName}:${letterId}`;
}

/**
 * Path to the letter a letter reference points at, keeping its anchor, e.g.
 * "let011.xml#note-t-8" -> "/vangogh/detail/urn:mace:huc.knaw.nl:vangogh:let011#note-t-8"
 */
export function toLetterLinkPath(url: string, projectName: string): string {
  const [document, anchor] = url.split("#");
  const path = toLetterDetailPath(document.split(".")[0], projectName);
  return anchor ? `${path}#${anchor}` : path;
}
