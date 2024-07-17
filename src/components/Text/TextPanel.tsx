import { XMarkIcon } from "@heroicons/react/24/outline";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { AnnotatedText } from "./Annotated/AnnotatedText.tsx";
import { TextHighlighting } from "./TextHighlighting.tsx";
import { StyledText } from "./StyledText.tsx";

type TextPanelProps = {
  panel: string;
  text: BroccoliTextGeneric;
  closePanelHandler: (panelToClose: string) => void;
};

export const TextPanel = (props: TextPanelProps) => {
  const translateProject = useProjectStore(translateProjectSelector);
  const projectConfig = useProjectStore(projectConfigSelector);

  if (projectConfig.showAnnotations) {
    import("./Annotated/annotated.css");
  }

  return (
    <StyledText panel={props.panel}>
      {projectConfig.allowCloseTextPanel && (
        <div className="m-auto mb-8 flex w-full max-w-3xl items-center justify-between border-b pb-4">
          <span
            className="font-sans text-sm uppercase text-neutral-800"
            tabIndex={0}
          >
            {translateProject(`${props.panel}`)}
          </span>

          <button
            onClick={() => props.closePanelHandler(props.panel)}
            className="rounded p-2"
          >
            <XMarkIcon className="h-6 fill-neutral-500 stroke-neutral-800" />
          </button>
        </div>
      )}
      <div className="m-auto mb-24 max-w-3xl">
        {projectConfig.showAnnotations ? (
          <AnnotatedText text={props.text} showDetail={false} />
        ) : (
          <TextHighlighting text={props.text} />
        )}
      </div>
    </StyledText>
  );
};
