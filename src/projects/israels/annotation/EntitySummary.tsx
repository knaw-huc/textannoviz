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
import { EntitySummaryDetails } from "./EntitySummaryDetails";
import { getAnnotationCategory } from "./ProjectAnnotationModel";
import { toEntitySearchQuery } from "./toEntitySearchQuery";

export function EntitySummary(props: { body: AnnoRepoBody }) {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);

  const entityCategory = toEntityCategory(
    projectConfig,
    getAnnotationCategory(props.body),
  );

  const entityClassname = toEntityClassname(projectConfig, entityCategory);

  const handleEntitySearchClick = () => {
    const query = toEntitySearchQuery(props.body, projectConfig);
    window.open(`/?${query}`, "_blank");
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
            onClick={() => window.open("/persons")}
          >
            {translateProject("MORE_INFO_ON_CATEGORY")}{" "}
            {translateProject(entityCategory)}
          </button>
        </div>
      </div>
    </li>
  );
}
