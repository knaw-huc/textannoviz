import { toast } from "react-toastify";
import { HOSTS } from "../../../Config";

export const fetchBroccoliOpening = async (
  document = "316_2",
  opening = "48"
) => {
  if (parseInt(opening) < 1) {
    toast("Opening number lower than 1 is not allowed!", { type: "error" });
    return;
  }

  const excludeTypes = ["tt:Token, px:Page, tt:Word"];
  //includeTypes = "px:TextRegion, px:TextLine, tt:Paragraph, tt:Entity"

  const response = await fetch(
    `${HOSTS.BROCCOLI}/v0/documents/${document}/openings/${opening}?excludeTypes=${excludeTypes}`
  );
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return;
  }
  return response.json();
};
