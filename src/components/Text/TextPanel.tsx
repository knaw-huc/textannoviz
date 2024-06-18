import { XMarkIcon } from "@heroicons/react/24/outline";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { TextHighlighting } from "./TextHighlighting";

type TextPanelProps = {
  panel: string;
  text: BroccoliTextGeneric;
  closePanelHandler: (panelToClose: string) => void;
};

export const TextPanel = (props: TextPanelProps) => {
  const translateProject = useProjectStore(translateProjectSelector);
  const projectConfig = useProjectStore(projectConfigSelector);

  return (
    <div
      id={props.panel}
      className="prose border-brand1Grey-100 mx-auto w-full max-w-full overflow-auto border-x border-y p-3 font-serif text-lg"
    >
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
      <TextHighlighting text={props.text} />
    </div>
  );
};
