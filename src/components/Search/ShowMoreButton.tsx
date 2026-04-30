import { Button } from "react-aria-components";
import { useTranslate } from "../../stores/project";
import { PlusIcon } from "../common/icons/PlusIcon";

type ShowMoreButtonProps = {
  showMoreButtonClickHandler: (aggregation: string) => void;
  facetName: string;
};

export function ShowMoreButton(props: ShowMoreButtonProps) {
  const translate = useTranslate();
  return (
    <Button
      className="fill-brand2-700 hover:text-brand2-700 hover:fill-brand2-700 border-brand2-100 bg-brand2-50 -mt-6 flex h-10 w-full max-w-[450px] items-center justify-end border-t-2 pr-2 text-black outline-none"
      onPress={() => props.showMoreButtonClickHandler(props.facetName)}
    >
      {translate("SHOW_MORE")}{" "}
      <span className="pl-1">
        <PlusIcon />
      </span>
    </Button>
  );
}
