import { XMarkIcon } from "@heroicons/react/24/outline";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { AnnotatedText } from "./Annotated/AnnotatedText.tsx";
import { TextHighlighting } from "./TextHighlighting.tsx";
import { PropsWithChildren } from "react";

type TextPanelProps = {
  panel: string;
  text: BroccoliTextGeneric;
  closePanelHandler: (panelToClose: string) => void;
};

export const TextPanel = (props: TextPanelProps) => {
  const translateProject = useProjectStore(translateProjectSelector);
  const projectConfig = useProjectStore(projectConfigSelector);

  return (
    <StyledText panel={props.panel}>
      {projectConfig.allowCloseTextPanel && (
        <XMarkIcon
          style={{
            height: "1.5rem",
            width: "1.5rem",
            float: "right",
            cursor: "pointer",
          }}
          onClick={() => props.closePanelHandler(props.panel)}
        />
      )}
      <strong className="text-brand1Grey-800 mb-4 block border-b" tabIndex={0}>
        {translateProject(`${props.panel}`)}
      </strong>
      <AnnotatedText text={props.text} />
      <hr />
      {/*TODO: remove or merge with AnnotatedText? */}
      <TextHighlighting text={props.text} />
    </StyledText>
  );
};

export function StyledText(props: PropsWithChildren<{ panel: string }>) {
  return (
    <div
      id={props.panel}
      className="prose border-brand1Grey-100 mx-auto w-full max-w-full overflow-auto border-x border-y p-3 font-serif text-lg"
    >
      {props.children}
    </div>
  );
}
