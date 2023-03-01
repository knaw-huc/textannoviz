import { toast } from "react-toastify";
import { HOSTS } from "../Config";
import { ProjectConfig } from "../model/ProjectConfig";

export const fetchBroccoliScan = async (
  tier0: string,
  tier1: string,
  config: ProjectConfig,
  annotationTypesToInclude: string[]
) => {
  if (parseInt(tier1) < 1) {
    toast("Opening number lower than 1 is not allowed!", { type: "error" });
    return;
  }

  const response = await fetch(
    `${HOSTS.BROCCOLI}/${config.id}/${config.broccoliVersion}/${config.tier[0]}/${tier0}/${config.tier[1]}/${tier1}?includeTypes=${annotationTypesToInclude}`
  );
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return response.json();
};

export const fetchBroccoliBodyId = async (
  bodyId: string,
  config: ProjectConfig
) => {
  const response = await fetch(
    `${HOSTS.BROCCOLI}/${config.id}/${config.broccoliVersion}/bodies/${bodyId}`
  );
  if (!response.ok) return null;
  return response.json();
};

export const fetchBroccoliBodyIdRelativeTo = async (
  bodyId: string,
  relativeTo: string,
  config: ProjectConfig
) => {
  const response = await fetch(
    `${HOSTS.BROCCOLI}/${config.id}/${config.broccoliVersion}/bodies/${bodyId}?relativeTo=${relativeTo}`
  );
  if (!response.ok) return null;
  return response.json();
};
