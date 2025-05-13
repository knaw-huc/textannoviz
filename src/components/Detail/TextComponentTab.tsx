import { TextComponent } from "../Text/TextComponent";
// import { useInitDetail } from "./useInitDetail";

type TextComponentTabProps = {
  viewToRender: string;
};

export const TextComponentTab = (props: TextComponentTabProps) => {
  // const { isLoadingDetail } = useInitDetail(); //This causes extra queries, meaning it (re-)initialises the detail page every time useInitDetail is called.

  return <TextComponent viewToRender={props.viewToRender} isLoading={false} />;
};
