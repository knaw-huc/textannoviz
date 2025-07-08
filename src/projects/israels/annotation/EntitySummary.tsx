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
  isEntity,
  isPersonEntity,
  IsraelsTeiRefBody,
} from "./ProjectAnnotationModel";
import { toEntitySearchQuery } from "./toEntitySearchQuery";

const LETTER_TEMPLATE = "urn:israels:letter:";

export function EntitySummary(props: { body: AnnoRepoBody }) {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);

  const { routerBasename } = getViteEnvVars();

  const entityCategory = toEntityCategory(
    projectConfig,
    getAnnotationCategory(props.body),
  );

  const entityClassname = toEntityClassname(projectConfig, entityCategory);

  const handleEntitySearchClick = () => {
    if (props.body.type !== "tei:Ref") {
      const query = toEntitySearchQuery(props.body, projectConfig);
      window.open(
        `${routerBasename === "/" ? "" : routerBasename}/?${query}`,
        "_blank",
      );
    } else {
      const newTier2 =
        LETTER_TEMPLATE +
        (props.body as IsraelsTeiRefBody).metadata.target.split(".")[0];
      window.open(
        `${routerBasename === "/" ? "" : routerBasename}/detail/${newTier2}`,
        "_blank",
      );
    }
  };

  const handleMoreInfoClick = () => {
    if (isEntity(props.body) && isPersonEntity(props.body.metadata.ref)) {
      const persId = props.body.metadata.ref[0].id;
      window.open(
        `${routerBasename === "/" ? "" : routerBasename}/persons#${persId}`,
      );
    }

    if (isEntity(props.body) && isArtworkEntity(props.body.metadata.ref)) {
      const artwId = props.body.metadata.ref[0].id;
      window.open(
        `${routerBasename === "/" ? "" : routerBasename}/artworks#${artwId}`,
      );
    }
  };

  return (
    <li className="mb-6 flex flex-col gap-2 border-b border-neutral-200 pb-6">
      <>
        <div className={`${entityClassname} annotationMarker italic`}>
          {translateProject(entityCategory)}
        </div>
        <EntitySummaryDetails body={props.body} />
      </>
      <div className="flex gap-4">
        <div>
          <button
            className="rounded-full border border-neutral-200 bg-white px-3 py-1 transition hover:bg-neutral-200"
            onClick={handleEntitySearchClick}
          >
            {translateProject("SEARCH_CATEGORY")}{" "}
            {translateProject(entityCategory)}
          </button>
          <div className="mt-2 italic text-neutral-600">
            {translateProject("WARNING_NEW_SEARCH")}
          </div>
        </div>
        <div>
          <button
            className="rounded-full border border-neutral-200 bg-white px-3 py-1 transition hover:bg-neutral-200"
            onClick={handleMoreInfoClick}
          >
            {translateProject("MORE_INFO_ON_CATEGORY")}{" "}
            {translateProject(entityCategory)}
          </button>
        </div>
      </div>
    </li>
  );
}
