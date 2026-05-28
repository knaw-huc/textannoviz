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
      className="border-brand2-100 bg-brand2-50 -mt-6 flex h-10 w-full max-w-[450px] items-center justify-end border-t-2 fill-neutral-800 pr-2 text-black outline-none hover:fill-black"
      onPress={() => props.showMoreButtonClickHandler(props.facetName)}
    >
      {translate("SHOW_MORE")}{" "}
      <span className="p-1">
        <PlusIcon />
      </span>
    </Button>
  );
}
