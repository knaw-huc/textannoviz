import { toast } from "react-toastify";
import { HOSTS } from "../Config";
import { ProjectConfig } from "../model/ProjectConfig";

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
