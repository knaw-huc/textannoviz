import { Button } from "react-aria-components";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { PlusIcon } from "../common/icons/PlusIcon";

type ShowMoreButtonProps = {
  showMoreButtonClickHandler: (aggregation: string) => void;
  facetName: string;
};

export function ShowMoreButton(props: ShowMoreButtonProps) {
  const translateProject = useProjectStore(translateProjectSelector);
  return (
    <Button
      className="text-brand2-500 fill-brand2-500 hover:text-brand2-700 hover:fill-brand2-700 border-brand2-100 bg-brand2-50 -mt-10 flex h-10 w-full max-w-[450px] items-center justify-end border-t-2 pr-2 outline-none"
      onPress={() => props.showMoreButtonClickHandler(props.facetName)}
    >
      {translateProject("showMore")}{" "}
      <span className="pl-1">
        <PlusIcon />
      </span>
    </Button>
  );
}
