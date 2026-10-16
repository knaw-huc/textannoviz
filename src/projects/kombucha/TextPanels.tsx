import { TextComponentTab } from "../../components/Detail/TextComponentTab";

export const TextPanels = {
  origTextPanel: {
    content: (
      <TextComponentTab viewToRender={["text.nl", "text.fr", "text.en"]} />
    ),
  },
  transTextPanel: {
    content: <TextComponentTab viewToRender="text.en" />,
  },
};
