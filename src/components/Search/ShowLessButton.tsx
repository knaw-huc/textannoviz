import { Button } from "react-aria-components";

type ShowLessButtonProps = {
  showLessButtonClickHandler: (aggregation: string) => void;
  facetName: string;
};

export function ShowLessButton(props: ShowLessButtonProps) {
  return (
    <Button
      className="text-brand2-500 hover:text-brand2-700 border-brand2-100 bg-brand2-50 -mt-10 flex h-10 w-full max-w-[450px] items-center justify-end border-t-2 pr-2 outline-none"
      onPress={() => props.showLessButtonClickHandler(props.facetName)}
    >
      Show less -
    </Button>
  );
}
