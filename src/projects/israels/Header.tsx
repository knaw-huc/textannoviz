import {
  projectConfigSelector,
  useProjectStore,
  useTranslateProject,
} from "../../stores/project.ts";
import { useParams } from "react-router";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { findLetterBody } from "../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";
import { Header as KunstenaarsbrievenHeader } from "../kunstenaarsbrieven/Header.tsx";

export const Header = () => {
  const translateProject = useTranslateProject();
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  const annotations = useAnnotationStore().annotations;
  const params = useParams();

  const introIds = [
    { name: "intro1", id: "urn:mace:huc.knaw.nl:israels:intro" },
  ];

  const letterAnnoBody = findLetterBody(annotations);

  const letterTitle =
    letterAnnoBody?.titles[interfaceLang] ||
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
