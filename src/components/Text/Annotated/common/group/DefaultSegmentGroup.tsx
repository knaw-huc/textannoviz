import {
  projectConfigSelector,
  useProjectStore,
} from "../../../../../stores/project.ts";
import { GroupProps } from "../../core";
import { isProjectAnnotation } from "../../utils/isProjectAnnotation.ts";
import { AnnotationLink } from "./AnnotationLink.tsx";
import { useTextStore } from "../../../../../stores/text/text-store.ts";
import { orThrow } from "../../../../../utils/orThrow.tsx";

export function DefaultSegmentGroup(props: GroupProps) {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { selectedLanguage } = projectConfig;
  const { group, children } = props;
  const setClickedGroup = useTextStore((s) => s.setClickedGroup);

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
    <span
      className={`closedNestedAnnotation ${selectedLanguage} cursor-pointer`}
      role="button"
      tabIndex={0}
      onClick={() => setClickedGroup(group)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setClickedGroup(group);
        }
      }}
    >
      {children}
    </span>
  );
}
