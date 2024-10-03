import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation.ts";
import {
  normalizeEntityCategory,
  toEntityClassname,
} from "../../../components/Text/Annotated/utils/createAnnotationClasses.ts";
import { EntitySummaryDetails } from "./EntitySummaryDetails.tsx";

export function EntitySummary(props: { body: AnnoRepoBody }) {
  const translateProject = useProjectStore(translateProjectSelector);
  const { getEntityCategory } = useProjectStore(projectConfigSelector);
  const { body } = props;

  const entityCategory = normalizeEntityCategory(getEntityCategory(body));
  const entityClassname = toEntityClassname(entityCategory);
  return (
    <li className="mb-6 flex flex-col gap-2 border-b border-neutral-200 pb-6">
      <div className={`${entityClassname} annotationMarker text-sm italic`}>
        {translateProject(entityCategory)}
      </div>
      <EntitySummaryDetails body={props.body} />
    </li>
  );
}
