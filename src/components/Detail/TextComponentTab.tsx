import { TextComponent } from "../Text/TextComponent";
import { useInitDetail } from "./useInitDetail";

type TextComponentTabProps = {
  viewToRender: string;
};

export const TextComponentTab = (props: TextComponentTabProps) => {
  const { isLoadingDetail } = useInitDetail();

  return (
    <TextComponent
      viewToRender={props.viewToRender}
      isLoading={isLoadingDetail}
    />
  );
};
