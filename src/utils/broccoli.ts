import { toast } from "react-toastify";
import { ProjectConfig } from "../model/ProjectConfig";
import { SearchQueryRequestBody, SearchResult } from "../model/Search";
import { SearchUrlParams } from "../stores/search/search-params-slice.ts";
import { Broccoli } from "../model/Broccoli.ts";
import dummy from "../components/Text/Annotated/test/resources/dummy-broccoli-session-3248-num-14-resolution-4.json";

const headers = {
  "Content-Type": "application/json",
};

// TODO: clean up dummy broccoli call
export const DUMMY_ANNOTATION_RESOLUTION =
  "urn:republic:session-3248-num-14-resolution-4";
export const fetchBroccoliScanWithOverlapDummy =
  async (): Promise<Broccoli> => {
    return Promise.resolve(dummy as unknown as Broccoli);
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
  const response = await fetch(
    `${config.broccoliUrl}/projects/${config.id}/${bodyId}?overlapTypes=${overlapTypes}&includeResults=${includeResults}&views=${views}&relativeTo=${relativeTo}`,
    { signal },
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
  signal: AbortSignal,
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
