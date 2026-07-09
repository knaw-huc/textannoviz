import { PropsWithChildren } from "react";
import { getViteEnvVars } from "../../../../utils/viteEnvVars";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../../stores/project";

export function LetterLink(
  props: PropsWithChildren<{ url: string; className?: string }>,
) {
  const { url, className, children } = props;
  const { routerBasename } = getViteEnvVars();
  const projectName = useProjectStore(projectConfigSelector).id;

  const basePath = routerBasename === "/" ? "" : routerBasename;
  const LETTER_TEMPLATE = `urn:mace:huc.knaw.nl:${projectName}:`;

  const go = () => {
    const newTier2 = LETTER_TEMPLATE + url.split(".")[0];
    window.open(`${basePath}/detail/${newTier2}`, "_blank");
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
