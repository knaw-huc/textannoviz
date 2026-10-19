import { PropsWithChildren } from "react";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../../stores/project";
import { toLetterDetailPath } from "./toLetterDetailPath.ts";

export function LetterLink(
  props: PropsWithChildren<{ url: string; className?: string }>,
) {
  const { url, className, children } = props;
  const projectName = useProjectStore(projectConfigSelector).id;

  const go = () => {
    window.open(toLetterDetailPath(url.split(".")[0], projectName), "_blank");
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
