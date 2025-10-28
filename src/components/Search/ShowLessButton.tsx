import { Button } from "react-aria-components";
import { translateSelector, useProjectStore } from "../../stores/project";
import { MinusIcon } from "../common/icons/MinusIcon";

type ShowLessButtonProps = {
  showLessButtonClickHandler: (aggregation: string) => void;
  facetName: string;
};

export function ShowLessButton(props: ShowLessButtonProps) {
  const translate = useProjectStore(translateSelector);
  return (
    <Button
      className="hover:bg-brand2-50 fill-brand2-500 hover:fill-brand2-700 border-brand2-100 bg-brand2-50 -mt-10 flex h-10 w-full max-w-[450px] items-center justify-end border-t-2 pr-2 text-black outline-none hover:text-black"
      onPress={() => props.showLessButtonClickHandler(props.facetName)}
    >
      {translate("SHOW_LESS")}{" "}
      <span className="p-1">
        <MinusIcon />
      </span>
    </Button>
  );
}
