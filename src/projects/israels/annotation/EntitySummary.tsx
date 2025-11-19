import {
  toEntityCategory,
  toEntityClassname,
} from "../../../components/Text/Annotated/utils/createAnnotationClasses";
import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../../stores/project";
import { getViteEnvVars } from "../../../utils/viteEnvVars";
import { EntitySummaryDetails } from "./EntitySummaryDetails";
import {
  getAnnotationCategory,
  isArtworkEntity,
  isBibliographyReference,
  isEntity,
  isLetterReference,
  isPersonEntity,
  isReference,
} from "./ProjectAnnotationModel";
import { toEntitySearchQuery } from "./toEntitySearchQuery";

const LETTER_TEMPLATE = "urn:israels:letter:";

export function EntitySummary(props: { body: AnnoRepoBody }) {
  const { body } = props;
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const interfaceLang = projectConfig.selectedLanguage;

  const { routerBasename } = getViteEnvVars();

  const entityCategory = toEntityCategory(
    projectConfig,
    getAnnotationCategory(body),
  );

  const entityClassname = toEntityClassname(projectConfig, entityCategory);

  const handleEntitySearchClick = () => {
    const basePath = routerBasename === "/" ? "" : routerBasename;

    if (isReference(body)) {
      const newTier2 = isLetterReference(body)
        ? LETTER_TEMPLATE + body.target.split(".")[0]
        : "";
      window.open(`${basePath}/detail/${newTier2}`, "_blank");
    } else {
      const query = toEntitySearchQuery(body, projectConfig, interfaceLang);
      window.open(`${basePath}/?${query}`, "_blank");
    }
  };

  const handleMoreInfoClick = () => {
    const basePath = routerBasename === "/" ? "" : routerBasename;
    if (isEntity(body) && isPersonEntity(body.ref)) {
      const id = body.ref[0].id;
      window.open(`${basePath}/persons#${id}`);
    }
    if (isEntity(body) && isArtworkEntity(body.ref)) {
      const id = body.ref[0].id;
      window.open(`${basePath}/artworks#${id}`);
    }
    if (isBibliographyReference(body)) {
      const id = body.target[0].id;
      window.open(`${basePath}/bibliography#${id}`);
    }
  };

  return (
    <li className="mb-6 flex flex-col gap-2 border-b border-neutral-200 pb-6">
      <>
        <div className={`${entityClassname} annotationMarker italic`}>
          {translateProject(entityCategory)}
        </div>
        <EntitySummaryDetails body={body} />
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
