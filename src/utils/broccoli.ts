import { toast } from "react-toastify";
import { ProjectConfig } from "../model/ProjectConfig";
import { SearchQueryRequestBody, SearchResult } from "../model/Search";
import { SearchUrlParams } from "../stores/search/search-params-slice.ts";
import { Any } from "./Any.ts";

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
) => {
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
  params: Partial<SearchUrlParams>,
  query: SearchQueryRequestBody,
  signal?: AbortSignal,
): Promise<SearchResult | null> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const urlSearchParams = new URLSearchParams(params as any);
  // TODO: update broccoli to use new format:
  const deprecatedSearchQuery = structuredClone(query);
  deprecatedSearchQuery.aggs = Object.entries(query.aggs || {}).map(
    (e) => `${e[0]}:${e[1].order},${e[1].size}`,
  ) as Any;
  const response = await fetch(
    `${projectConfig.broccoliUrl}/projects/${projectConfig.id}/search?${urlSearchParams}`,
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(deprecatedSearchQuery),
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
) => {
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
