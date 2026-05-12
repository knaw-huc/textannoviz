import { Button } from "react-aria-components";
import { useTranslate } from "../../stores/project";
import { MinusIcon } from "../common/icons/MinusIcon";

type ShowLessButtonProps = {
  showLessButtonClickHandler: (aggregation: string) => void;
  facetName: string;
};

export function ShowLessButton(props: ShowLessButtonProps) {
  const translate = useTranslate();
  return (
    <Button
      className="border-brand2-100 bg-brand2-50 -mt-6 flex h-10 w-full max-w-[450px] items-center justify-end border-t-2 fill-black pr-2 text-black outline-none hover:fill-black"
      onPress={() => props.showLessButtonClickHandler(props.facetName)}
    >
      {translate("SHOW_LESS")}{" "}
      <span className="p-1">
        <MinusIcon />
      </span>
    </Button>
  );
}
