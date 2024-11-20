import { toast } from "react-toastify";
import {
  toEntityCategory,
  toEntityClassname,
} from "../../../components/Text/Annotated/utils/createAnnotationClasses.ts";
import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation.ts";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import { EntitySummaryDetails } from "./EntitySummaryDetails.tsx";
import { toEntitySearchQuery } from "./toEntitySearchQuery.ts";
import { isDateEntity } from "./ProjectAnnotationModel.ts";
import { ArchiveIcon } from "../../../components/common/icons/ArchiveIcon.tsx";

export function EntitySummary(props: { body: AnnoRepoBody }) {
  const translateProject = useProjectStore(translateProjectSelector);
  const { getAnnotationCategory } = useProjectStore(projectConfigSelector);
  const { body } = props;

  const entityCategory = toEntityCategory(getAnnotationCategory(body));
  const entityClassname = toEntityClassname(entityCategory);

  const handleEntityBrowseClick = () => {
    return toast("Not implemented", { type: "info" });
  };

  const handleProvenanceBrowseClick = () => {
    return toast("Not implemented", { type: "info" });
  };

  const handleEntitySearchClick = () => {
    const query = toEntitySearchQuery(props.body);
    window.open(`/?${query.toString()}`, "_blank");
  };

  return (
    <li className="mb-6 flex flex-col gap-2 border-b border-neutral-200 pb-6">
      <div>
        <div className={`${entityClassname} annotationMarker italic`}>
          {translateProject(entityCategory)}
        </div>
        <EntitySummaryDetails body={props.body} />
      </div>
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
        {!isDateEntity(body) && (
          <div>
            <button
              className="rounded-full border border-neutral-200 bg-white px-3 py-1 transition hover:bg-neutral-200"
              // TODO:
              onClick={handleEntityBrowseClick}
            >
              {translateProject("MORE_INFO_ON_CATEGORY")}{" "}
              {translateProject(entityCategory)}
            </button>
          </div>
        )}
        <div>
          <button
            className="rounded-full border border-neutral-200 bg-white px-3 py-1 transition hover:bg-neutral-200"
            // TODO:
            onClick={handleProvenanceBrowseClick}
            title={translateProject("PROVENANCE")}
          >
            <ArchiveIcon color="#ccc" />
          </button>
        </div>
      </div>
    </li>
  );
}
