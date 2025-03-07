import { toast } from "react-toastify";
import { ProjectConfig } from "../model/ProjectConfig";
import {
  ElasticIndices,
  SearchParams,
  SearchQueryRequestBody,
  SearchResult,
} from "../model/Search";
import { Broccoli } from "../model/Broccoli.ts";
import { cleanUrlParams } from "./UrlParamUtils.ts";

const headers = {
  "Content-Type": "application/json",
};

export const fetchBroccoliScanWithOverlap = async (
  bodyId: string,
  overlapTypes: string[],
  includeResults: string[],
  views: string,
  relativeTo: string,
  config: ProjectConfig,
  signal: AbortSignal,
): Promise<Broccoli | null> => {
  const url = `${config.broccoliUrl}/projects/${config.id}/${bodyId}?overlapTypes=${overlapTypes}&includeResults=${includeResults}&views=${views}&relativeTo=${relativeTo}`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return await response.json();
};

export const selectDistinctBodyTypes = async (
  projectId: string,
  broccoliUrl: string,
  signal: AbortSignal,
): Promise<string[]> => {
  const response = await fetch(`${broccoliUrl}/projects/${projectId}`, {
    signal,
  });
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return [];
  }
  return response.json();
};

export const sendSearchQuery = async (
  projectConfig: ProjectConfig,
  params: Partial<SearchParams>,
  query: SearchQueryRequestBody,
  signal?: AbortSignal,
): Promise<SearchResult | null> => {
  const urlSearchParams = new URLSearchParams(cleanUrlParams(params));
  const response = await fetch(
    `${projectConfig.broccoliUrl}/projects/${projectConfig.id}/search?${urlSearchParams}`,
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(query),
      signal,
    },
  );

  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }

  return response.json();
};

export const getElasticIndices = async (
  projectConfig: ProjectConfig,
  signal?: AbortSignal,
): Promise<ElasticIndices | null> => {
  const response = await fetch(
    `${projectConfig.broccoliUrl}/brinta/${projectConfig.id}/indices`,
    { signal },
  );
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return response.json();
};
