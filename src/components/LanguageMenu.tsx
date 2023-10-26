import {projectConfigSelector, useProjectStore} from "../stores/project.ts";
import {ReactNode} from "react";
import {LanguageCode} from "../model/Language.ts";

export function LanguageMenu() {
  const projectConfig = useProjectStore(projectConfigSelector);
  const languages = projectConfig.languages;
  const setProjectConfig = useProjectStore((state) => state.setProjectConfig);

  return <div className="ml-4 flex flex-row items-center gap-2 languages">
    {languages
        .map<ReactNode>(l => <LanguageIcon
            code={l.code}
            onClick={code => {
              projectConfig.selectedLanguage = code;
              setProjectConfig(projectConfig);
            }}
        />)
        .reduce((prev, curr) => [prev, ' | ', curr])
    }
  </div>
}
export function LanguageIcon(props: {
  code: LanguageCode,
  onClick: (code: LanguageCode) => void
}) {
  return <span
      onClick={() => props.onClick(props.code)}
  >
    {props.code.toUpperCase()}
  </span>
}