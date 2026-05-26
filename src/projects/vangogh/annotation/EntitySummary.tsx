import {
  toEntityCategory,
  toEntityClassname,
} from "../../../components/Text/Annotated/utils/createAnnotationClasses";
import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation";
import {
  projectConfigSelector,
  useProjectStore,
  useTranslateProject,
} from "../../../stores/project";
import { getViteEnvVars } from "../../../utils/viteEnvVars";
import { EntitySummaryDetails } from "./EntitySummaryDetails";
import {
  Artwork,
  getAnnotationCategory,
  isArtwork,
  isBibliographyReference,
  isEntity,
  isLetterReference,
  isPerson,
  isReference,
  PersonTeiRef,
} from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";
import { toEntitySearchQuery } from "./toEntitySearchQuery";
import { toast } from "../../../utils/toast.ts";

const LETTER_TEMPLATE = "urn:mace:huc.knaw.nl:vangogh:";

export function EntitySummary(props: { body: AnnoRepoBody }) {
  const { body } = props;

  return (
    <>
      {isEntity(body) ? (
        Array.isArray(body["tei:ref"]) ? (
          body["tei:ref"].map((entityBody) => (
            <EntityComponent
              body={body}
              key={entityBody.id}
              entityBody={entityBody}
            />
          ))
        ) : (
          <EntityComponent
            body={body}
            key={body["tei:ref"].id}
            entityBody={body["tei:ref"]}
          />
        )
      ) : null}
    </>
  );
}

function EntityComponent(props: {
  body: AnnoRepoBody;
  entityBody: PersonTeiRef | Artwork;
}) {
  const { body, entityBody } = props;
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useTranslateProject();

  const entityCategory = toEntityCategory(
    projectConfig,
    getAnnotationCategory(body),
  );

  const entityClassname = toEntityClassname(projectConfig, entityCategory);

  const interfaceLang = projectConfig.selectedLanguage;

  const { routerBasename } = getViteEnvVars();

  const handleEntitySearchClick = () => {
    const basePath = routerBasename === "/" ? "" : routerBasename;

    if (isReference(body)) {
      const newTier2 = isLetterReference(body)
        ? LETTER_TEMPLATE + body.url.split(".")[0]
        : "";
      window.open(`${basePath}/detail/${newTier2}`, "_blank");
    } else {
      const query = toEntitySearchQuery(body, projectConfig, interfaceLang);
      window.open(`${basePath}/?${query}`, "_blank");
    }
  };

  const handleMoreInfoClick = () => {
    const basePath = routerBasename === "/" ? "" : routerBasename;
    if (isPerson(body)) {
      const id = entityBody.id;
      window.open(`${basePath}/persons#${id}`);
    } else if (isArtwork(body)) {
      const id = entityBody.id;
      window.open(`${basePath}/artworks#${id}`);
    } else if (isBibliographyReference(body)) {
      const id = body.url.split("#")[1];
      window.open(`${basePath}/bibliography#${id}`);
    } else {
      toast(`Unknown annotation body: ${body}`);
    }
  };

  return (
    <li className="mb-6 flex flex-col gap-2 border-b border-neutral-200 pb-6">
      <>
        <div className={`${entityClassname} annotationMarker italic`}>
          {translateProject(entityCategory)}
        </div>
        <EntitySummaryDetails
          entityBody={entityBody}
          entityCategory={entityCategory}
        />
      </>
      <div className="flex">
        <div>
          {!isBibliographyReference(body) && (
            <button
              className="rounded-full border border-neutral-200 bg-white px-3 py-1 transition hover:bg-neutral-200"
              onClick={handleEntitySearchClick}
            >
              {isLetterReference(body) ? (
                <>{translateProject("NAV_TO_LETTER")}</>
              ) : (
                <>
                  {translateProject("SEARCH_CATEGORY")}{" "}
                  {translateProject(entityCategory)}
                </>
              )}
            </button>
          )}

          {!isReference(body) && (
            <div className="mt-2 italic text-neutral-600">
              {translateProject("WARNING_NEW_SEARCH")}
            </div>
          )}
        </div>
        <div>
          {!isLetterReference(body) && (
            <button
              className="rounded-full border border-neutral-200 bg-white px-3 py-1 transition hover:bg-neutral-200"
              onClick={handleMoreInfoClick}
            >
              {translateProject("MORE_INFO_ON_CATEGORY")}{" "}
              {translateProject(entityCategory)}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
