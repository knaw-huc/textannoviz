import {
  toEntityCategory,
  toEntityClassname,
} from "../../../components/Detail/Text/Annotated/utils/createAnnotationClasses.ts";
import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation.ts";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import { EntitySummaryDetails } from "./EntitySummaryDetails.tsx";

export function EntitySummary(props: { body: AnnoRepoBody }) {
  const translateProject = useProjectStore(translateProjectSelector);
  const { getAnnotationCategory } = useProjectStore(projectConfigSelector);
  const { body } = props;

  const entityCategory = toEntityCategory(getAnnotationCategory(body));
  const entityClassname = toEntityClassname(entityCategory);
  return (
    <li className="mb-6 flex flex-col gap-2 border-b border-neutral-200 pb-6">
      <div className={`${entityClassname} annotationMarker italic`}>
        {translateProject(entityCategory)}
      </div>
      <EntitySummaryDetails body={props.body} />
    </li>
  );
}
