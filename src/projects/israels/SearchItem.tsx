import { SearchItem as KunstenaarsbrievenSearchItem } from "../kunstenaarsbrieven/SearchItem.tsx";
import { IsraelsSearchResultsBody } from "../../model/Search.ts";
import { SearchItemProps } from "../../model/SearchItemProps.ts";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";

export const SearchItem = (
  props: SearchItemProps<IsraelsSearchResultsBody>,
) => {
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  const translateProject = useProjectStore(translateProjectSelector);

  let searchItemTitle: string;
  if (props.result.type === "letter") {
    searchItemTitle =
      interfaceLang === "nl" ? props.result.titleNL : props.result.titleEN;
  } else if (props.result.type === "intro") {
    searchItemTitle = translateProject("intro");
  } else {
    searchItemTitle = translateProject("UNKNOWN");
  }

  return (
    <KunstenaarsbrievenSearchItem
      {...props}
      searchItemTitle={searchItemTitle}
    />
  );
};
