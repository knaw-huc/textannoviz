import { useParams } from "react-router";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { findLetterBody } from "../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";
import { Header as KunstenaarsbrievenHeader } from "../kunstenaarsbrieven/Header.tsx";
import { useTranslateProject } from "../../stores/project.ts";

export const Header = () => {
  const translateProject = useTranslateProject();
  const annotations = useAnnotationStore().annotations;
  const params = useParams();

  const introIds = [
    { name: "intro", id: "urn:mace:huc.knaw.nl:suriano:intro" },
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
    />
  );
};
