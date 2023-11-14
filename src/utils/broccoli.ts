import {toast} from "react-toastify";
import {ProjectConfig} from "../model/ProjectConfig";
import {SearchQueryRequestBody, SearchResult} from "../model/Search";
import {SearchUrlParams} from "../stores/search/search-params-slice.ts";

const headers = {
  "Content-Type": "application/json",
};

export const fetchBroccoliBodyIdOfScan = async (
  tier0: string,
  tier1: string,
  config: ProjectConfig,
) => {
  if (parseInt(tier1) < 1) {
    toast("Opening number lower than 1 is not allowed!", { type: "error" });
    return;
  }

  const response = await fetch(
    `${config.broccoliUrl}/projects/${config.id}/${config.scanAnnotation}/${tier0}/${tier1}?includeResults=bodyId`,
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
  views: string,
  relativeTo: string,
  config: ProjectConfig,
) => {
  const response = await fetch(
    `${config.broccoliUrl}/projects/${config.id}/${bodyId}?overlapTypes=${overlapTypes}&includeResults=${includeResults}&views=${views}&relativeTo=${relativeTo}`,
  );
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
): Promise<string[]> => {
  const response = await fetch(`${broccoliUrl}/projects/${projectId}`);
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
    query: SearchQueryRequestBody
): Promise<SearchResult | null> => {
  const urlSearchParams = new URLSearchParams(params as any);
  const response = await fetch(
    `${projectConfig.broccoliUrl}/projects/${projectConfig.id}/search?${urlSearchParams}`,
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(query),
    },
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
    `${projectConfig.broccoliUrl}/brinta/${projectConfig.id}/indices`,
  );
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return response.json();
};
