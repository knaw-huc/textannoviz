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
