import { toast } from "react-toastify";
import { HOSTS } from "../Config";
import { ProjectConfig } from "../model/ProjectConfig";
import { SearchQuery } from "../model/Search";

const headers = {
  "Content-Type": "application/json",
};

export const fetchBroccoliBodyId = async (
  bodyId: string,
  config: ProjectConfig
) => {
  const response = await fetch(
    `${HOSTS.BROCCOLI}/projects/${config.id}/${bodyId}`
  );
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return response.json();
};

export const fetchBroccoliBodyIdRelativeTo = async (
  bodyId: string,
  relativeTo: string,
  includeResults: string[],
  config: ProjectConfig
) => {
  const response = await fetch(
    `${HOSTS.BROCCOLI}/projects/${config.id}/${bodyId}?includeResults=${includeResults}&relativeTo=${relativeTo}`
  );
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return response.json();
};

export const fetchBroccoliBodyIdOfScan = async (
  tier0: string,
  tier1: string,
  config: ProjectConfig
) => {
  if (parseInt(tier1) < 1) {
    toast("Opening number lower than 1 is not allowed!", { type: "error" });
    return;
  }

  const response = await fetch(
    `${HOSTS.BROCCOLI}/projects/${config.id}/${config.scanAnnotation}/${tier0}/${tier1}?includeResults=bodyId`
  );
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return response.json();
};

export const fetchBroccoliScanWithOverlap = async (
  bodyId: string,
  overlapTypes: string[],
  includeResults: string[],
  config: ProjectConfig
) => {
  const response = await fetch(
    `${HOSTS.BROCCOLI}/projects/${config.id}/${bodyId}?overlapTypes=${overlapTypes}&includeResults=${includeResults}&relativeTo=${config.relativeTo}`
  );
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return response.json();
};

export const selectDistinctBodyTypes = async (
  projectId: string
): Promise<string[]> => {
  const response = await fetch(`${HOSTS.BROCCOLI}/projects/${projectId}`);
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return [];
  }
  return response.json();
};

export const sendSearchQuery = async (
  searchQuery: SearchQuery,
  fragParam: string,
  sizeParam: number,
  fromParam = 0,
  projectConfig: ProjectConfig,
  sortBy = "_score",
  sortOrder = "desc"
) => {
  const params = new URLSearchParams({
    frag: fragParam,
    size: sizeParam.toString(),
    from: fromParam.toString(),
    sortBy: sortBy,
    sortOrder: sortOrder,
  });

  const response = await fetch(
    `${HOSTS.BROCCOLI}/projects/${projectConfig.id}/search?${params}`,
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(searchQuery),
    }
  );

  console.log(response);

  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }

  const data = await response.json();

  console.log(data);

  return data;
};

export const getFacets = async (projectConfig: ProjectConfig) => {
  const response = await fetch(
    `${HOSTS.BROCCOLI}/brinta/${projectConfig.id}/facets`
  );
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return response.json();
};

export const getElasticIndices = async (projectConfig: ProjectConfig) => {
  const response = await fetch(
    `${HOSTS.BROCCOLI}/brinta/${projectConfig.id}/indices`
  );
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return response.json();
};
