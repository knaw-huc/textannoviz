import { ReactNode, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { LanguageCode, isValidLanguageCode } from "../model/Language.ts";
import {
  projectConfigSelector,
  setProjectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../stores/project.ts";
import { LANGUAGE } from "./Search/SearchUrlParams.ts";
import { HelpTooltip } from "./common/HelpTooltip.tsx";

//TODO: move state of languages from project config to Zustand store
export function LanguageMenu() {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const languages = projectConfig.languages;
  const setProjectConfig = useProjectStore(setProjectConfigSelector);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    initLanguageFromUrl();
    function initLanguageFromUrl() {
      const urlLanguage = searchParams.get(LANGUAGE);
      if (!urlLanguage || urlLanguage === projectConfig.defaultLanguage) {
        return;
      }
      if (!isValidLanguageCode(urlLanguage)) {
        return;
      }
      const newConfig = { ...projectConfig };
      newConfig.defaultLanguage = urlLanguage;
      setProjectConfig(newConfig);
    }
  }, [searchParams]);

  return (
    <div
      className="languages ml-4 flex flex-row items-center gap-2"
      aria-label="select language"
    >
      {languages.length > 1 &&
        languages
          .map<ReactNode>((l) => (
            <LanguageIcon
              key={l.code}
              code={l.code}
              selected={projectConfig.defaultLanguage === l.code}
              onClick={(code) => {
                searchParams.set(LANGUAGE, code);
                setSearchParams(searchParams);
                const newConfig = { ...projectConfig };
                newConfig.defaultLanguage = code;
                setProjectConfig(projectConfig);
              }}
            />
          ))
          .reduce((prev, curr) => [prev, " | ", curr])}
      <HelpTooltip label={translateProject("LANG_MENU_HELP")} />
    </div>
  );
}
export function LanguageIcon(props: {
  code: LanguageCode;
  selected: boolean;
  onClick: (code: LanguageCode) => void;
}) {
  return (
    <button
      className={props.selected ? "selected" : "hover:underline"}
      onClick={() => props.onClick(props.code)}
    >
      {props.code.toUpperCase()}
    </button>
  );
}
