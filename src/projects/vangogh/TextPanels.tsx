import { TextComponentTab } from "../../components/Detail/TextComponentTab";

export const TextPanels = {
  origTextPanel: {
    content: <TextComponentTab viewToRender={["text.nl", "text.fr"]} />,
  },
  transTextPanel: {
    content: <TextComponentTab viewToRender="text.en" />,
  },
};
