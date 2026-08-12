import { SearchItem as KunstenaarsbrievenSearchItem } from "../kunstenaarsbrieven/SearchItem.tsx";
import { VanGoghSearchResultsBody } from "../../model/Search.ts";
import { SearchItemProps } from "../../model/SearchItemProps.ts";

export const SearchItem = (
  props: SearchItemProps<VanGoghSearchResultsBody>,
) => {
  const searchItemTitle = props.result.title;
  return (
    <KunstenaarsbrievenSearchItem
      {...props}
      searchItemTitle={searchItemTitle}
    />
  );
};
