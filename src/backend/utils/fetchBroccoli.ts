import { HOSTS } from "../../Config";

export const fetchBroccoliOpening = async (
  volume = "1728",
  opening = "285"
) => {
  if (parseInt(opening) < 1) {
    alert("Opening number lower than 1 is not allowed!");
    return;
  }

  const annotationTypesToInclude = [
    "Session, Resolution, Reviewed, AttendanceList, Attendant",
  ]; //Exclude: "Line", "Page", "RepublicParagraph", "TextRegion", "Scan"

  const response = await fetch(
    `${HOSTS.BROCCOLI}/v3/volumes/${volume}/openings/${opening}?includeTypes=${annotationTypesToInclude}`
  );
  if (!response.ok) {
    const error = await response.json();
    alert(`${error.message}`);
    return null;
  }
  return response.json();
};

export const fetchBroccoliResolution = async (
  resolutionId = "urn:republic:session-1728-09-24-ordinaris-num-1-resolution-1"
) => {
  const response = await fetch(`${HOSTS.BROCCOLI}/v3/bodies/${resolutionId}`);
  if (!response.ok) return null;
  return response.json();
};

export const fetchBroccoliBodyId = async (
  bodyId = "urn:republic:session-1728-06-19-ordinaris-num-1-para-2",
  relativeTo: string
) => {
  const response = await fetch(
    `${HOSTS.BROCCOLI}/v3/bodies/${bodyId}?relativeTo=${relativeTo}`
  );
  if (!response.ok) return null;
  return response.json();
};
