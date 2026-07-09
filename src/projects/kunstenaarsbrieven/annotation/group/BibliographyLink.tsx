import { PropsWithChildren } from "react";
import { getViteEnvVars } from "../../../../utils/viteEnvVars";

export function BibliographyLink(
  props: PropsWithChildren<{ url: string; className?: string }>,
) {
  const { url, className, children } = props;
  const { routerBasename } = getViteEnvVars();

  const basePath = routerBasename === "/" ? "" : routerBasename;

  const go = () => {
    const id = url.split("#")[1];
    window.open(`${basePath}/bibliography#${id}`);
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
