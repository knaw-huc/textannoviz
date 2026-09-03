import { useParams } from "react-router";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { findLetterBody } from "../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";
import { Header as KunstenaarsbrievenHeader } from "../kunstenaarsbrieven/Header.tsx";
import {
  projectConfigSelector,
  useProjectStore,
  useTranslateProject,
} from "../../stores/project.ts";
import { toast } from "react-toastify";
import React from "react";
import { handleAbort } from "../../utils/handleAbort.tsx";

export const Header = () => {
  const translateProject = useTranslateProject();
  const annotations = useAnnotationStore().annotations;
  const params = useParams();
  const menuUrl = useProjectStore(projectConfigSelector).menuUrl;
  const letterIdUrl = useProjectStore(projectConfigSelector).letterIdUrl;
  const [letterIds, setLetterIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const aborter = new AbortController();

    async function initLetterIDs(aborter: AbortController) {
      const newIDs = await fetchLetterIDs(letterIdUrl, aborter.signal);
      if (!newIDs) return;
      setLetterIds(newIDs.map((id) => id.toLowerCase()));
    }

    initLetterIDs(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
    };
  }, []);

  const introIds = [
    { name: "intro1", id: "urn:mace:huc.knaw.nl:vangogh:introI" },
    { name: "intro2", id: "urn:mace:huc.knaw.nl:vangogh:introII" },
    { name: "intro3", id: "urn:mace:huc.knaw.nl:vangogh:introIII" },
    { name: "intro4", id: "urn:mace:huc.knaw.nl:vangogh:introIV" },
    { name: "intro6", id: "urn:mace:huc.knaw.nl:vangogh:introVI" },
  ];

  const letterAnnoBody = findLetterBody(annotations);

  const letterTitle =
    letterAnnoBody?.title ||
    (params.tier2 && introIds.some((intro) => intro.id === params.tier2)
      ? translateProject("intro")
      : "");

  return (
    <KunstenaarsbrievenHeader
      letterTitle={letterTitle}
      letterNumber={letterAnnoBody?.n}
      introIds={introIds}
      menuUrl={menuUrl}
      letterIds={letterIds}
    />
  );
};

async function fetchLetterIDs(
  url: string,
  signal: AbortSignal,
): Promise<string[] | null> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return await response.json();
}
