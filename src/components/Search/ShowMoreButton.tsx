import { Button } from "react-aria-components";

type ShowMoreButtonProps = {
  showMoreButtonClickHandler: (aggregation: string) => void;
  facetName: string;
};

export function ShowMoreButton(props: ShowMoreButtonProps) {
  return (
    <Button
      className="text-brand2-500 hover:text-brand2-700 border-brand2-100 bg-brand2-50 -mt-10 flex h-10 w-full max-w-[450px] items-center justify-end border-t-2 pr-2 outline-none"
      onPress={() => props.showMoreButtonClickHandler(props.facetName)}
    >
      Show more +
    </Button>
  );
}
