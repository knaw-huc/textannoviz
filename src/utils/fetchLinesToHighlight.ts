import { BroccoliV3 } from "../model/Broccoli";
import { ProjectConfig } from "../model/ProjectConfig";
import { createIndices } from "./createIndices";
import { fetchBroccoliBodyIdRelativeTo } from "./fetchBroccoli";

export const fetchLinesToHighlight = async (
  bodyId: string,
  relativeTo: string,
  projectConfig: ProjectConfig
) => {
  const result: BroccoliV3 = await fetchBroccoliBodyIdRelativeTo(
    bodyId,
    relativeTo,
    projectConfig
  );

  const startIndex = result.text.location.start.line;
  const endIndex = result.text.location.end.line;

  const indices = createIndices(startIndex, endIndex);

  return indices;
};
