import { EntityModalButton } from "./EntityModal.tsx";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../../stores/project.ts";
import { GroupProps } from "../core";

export function ProjectSegmentGroup(props: GroupProps) {
  const { selectedLanguage } = useProjectStore(projectConfigSelector);
  const { group, children } = props;

  if (!group.id) {
    return <>{children}</>;
  }

  return (
    <EntityModalButton group={group}>
      <span className={`closedNestedAnnotation ${selectedLanguage}`}>
        {children}
      </span>
    </EntityModalButton>
  );
}
