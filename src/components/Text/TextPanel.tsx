import { XMarkIcon } from "@heroicons/react/24/outline";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { AnnotatedText } from "./Annotated/AnnotatedText.tsx";
import { StyledText } from "./StyledText.tsx";
import { TextHighlighting } from "./TextHighlighting.tsx";

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
      <div className="mx-auto mb-8 flex w-full max-w-3xl items-center justify-between border-b pb-4">
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
          {projectConfig.allowCloseTextPanel && (
            <XMarkIcon className="h-6 fill-neutral-500 stroke-neutral-800" />
          )}
        </button>
      </div>

      <div className="flex max-w-3xl" role="textpanel">
        {projectConfig.showAnnotations ? (
          <AnnotatedText text={props.text} showDetail={false} />
        ) : (
          <TextHighlighting text={props.text} />
        )}
      </div>
    </StyledText>
  );
};
