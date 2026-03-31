import { EntityModalButton } from "./EntityModal.tsx";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../../stores/project.ts";
import { GroupProps } from "../core";
import { isProjectAnnotation } from "./utils/isProjectAnnotation.ts";
import { orThrow } from "./utils/orThrow.tsx";
import { AnnotationLink } from "./AnnotationLink.tsx";

export function ProjectSegmentGroup(props: GroupProps) {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { selectedLanguage } = projectConfig;
  const { group, children } = props;

  if (!group.id) {
    return <>{children}</>;
  }

  const link = group.segments
    .flatMap((s) => s.annotations)
    .filter(isProjectAnnotation)
    .find((a) => projectConfig.isLink(a.body));

  if (link) {
    const url =
      projectConfig.getUrl(link.body) ??
      orThrow(`Link ${link.body.id} has no url`);
    return (
      <AnnotationLink
        url={url}
        className={`closedNestedAnnotation ${selectedLanguage} cursor-pointer`}
      >
        {children}
      </AnnotationLink>
    );
  }

  return (
    <EntityModalButton group={group}>
      <span className={`closedNestedAnnotation ${selectedLanguage}`}>
        {children}
      </span>
    </EntityModalButton>
  );
}
