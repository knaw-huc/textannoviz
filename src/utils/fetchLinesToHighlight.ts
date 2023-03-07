import { BroccoliTextGeneric, BroccoliV3 } from "../model/Broccoli";
import { ProjectConfig } from "../model/ProjectConfig";
import { createIndices } from "./createIndices";
import { fetchBroccoliBodyIdRelativeTo } from "./fetchBroccoli";

export const fetchLinesToHighlight = async (
  bodyId: string,
  relativeTo: string,
  projectConfig: ProjectConfig
) => {
  const includeTypes = ["anno", "text"];

  const result: BroccoliV3 = await fetchBroccoliBodyIdRelativeTo(
    bodyId,
    relativeTo,
    includeTypes,
    projectConfig
  );

  console.log(result);

  const startIndex = (
    result.text as BroccoliTextGeneric
  ).locations.annotations.find((anno) => anno.id === bodyId).start.line;

  console.log(startIndex);
  const endIndex = (
    result.text as BroccoliTextGeneric
  ).locations.annotations.find((anno) => anno.id === bodyId).end.line;

  const indices = createIndices(startIndex, endIndex);

  return indices;
};
