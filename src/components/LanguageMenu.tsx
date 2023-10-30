import {projectConfigSelector, setProjectConfigSelector, useProjectStore} from "../stores/project.ts";
import {ReactNode, useEffect} from "react";
import {isValidLanguageCode, LanguageCode} from "../model/Language.ts";
import {useSearchParams} from "react-router-dom";

const LANGUAGE_PARAM = 'language';
export function LanguageMenu() {
  const projectConfig = useProjectStore(projectConfigSelector);
  const languages = projectConfig.languages;
  const setProjectConfig = useProjectStore(setProjectConfigSelector);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    initLanguageFromUrl();
    function initLanguageFromUrl() {
      const urlLanguage = searchParams.get(LANGUAGE_PARAM);
      if (!urlLanguage || urlLanguage === projectConfig.selectedLanguage) {
        return;
      }
      if(!isValidLanguageCode(urlLanguage)) {
        return;
      }
      const newConfig = {...projectConfig};
      newConfig.selectedLanguage = urlLanguage;
      setProjectConfig(newConfig)
    }
  }, [searchParams]);

  return <div className="ml-4 flex flex-row items-center gap-2 languages">
    {languages
        .map<ReactNode>(l => <LanguageIcon
            key={l.code}
            code={l.code}
            selected={projectConfig.selectedLanguage === l.code}
            onClick={code => {
              searchParams.set(LANGUAGE_PARAM, code);
              setSearchParams(searchParams);
              const newConfig = {...projectConfig};
              newConfig.selectedLanguage = code;
              setProjectConfig(projectConfig);
            }}
        />)
        .reduce((prev, curr) => [prev, ' | ', curr])
    }
  </div>
}
export function LanguageIcon(props: {
  code: LanguageCode,
  selected: boolean,
  onClick: (code: LanguageCode) => void
}) {
  return <span
      className={props.selected ? 'selected' : ''}
      onClick={() => props.onClick(props.code)}
  >
    {props.code.toUpperCase()}
  </span>
}