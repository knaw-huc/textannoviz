import { PropsWithChildren } from "react";
import { useNavigate, useParams } from "react-router";
import { toInternalReferenceTarget } from "./toInternalReferenceTarget.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../../stores/project.ts";

export function InternalReferenceLink(
  props: PropsWithChildren<{ url: string; className?: string }>,
) {
  const { url, className, children } = props;
  const navigate = useNavigate();
  const params = useParams();
  const projectName = useProjectStore(projectConfigSelector).id;

  const go = () => {
    navigate(toInternalReferenceTarget(url, params.tier2, projectName));
  };

  return (
    <span
      className={`closedNestedAnnotation cursor-pointer ${className ?? ""}`}
      role="link"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === "Enter") go();
      }}
    >
      {children}
    </span>
  );
}
