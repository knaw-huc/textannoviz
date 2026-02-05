import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useParams } from "react-router-dom";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { findLetterBody } from "./annotation/ProjectAnnotationModel.ts";
import { Header as KunstenaarsbrievenHeader } from "../kunstenaarsbrieven/Header.tsx";

export const Header = () => {
  const translateProject = useProjectStore(translateProjectSelector);
  const annotations = useAnnotationStore().annotations;
  const params = useParams();

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
    />
  );
};
