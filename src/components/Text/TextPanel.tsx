import { XMarkIcon } from "@heroicons/react/24/outline";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { AnnotatedText } from "./Annotated/AnnotatedText.tsx";
// import { StyledText } from "./StyledText.tsx";
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
    <>
      <span className="my-6 mr-8 flex justify-end gap-1 text-sm uppercase text-neutral-500">
        {translateProject(`${props.panel}`)}
      </span>

      {projectConfig.allowCloseTextPanel && (
        <button
          onClick={() => props.closePanelHandler(props.panel)}
          className="rounded p-2"
        >
          <XMarkIcon className="h-6 fill-neutral-500 stroke-neutral-800" />
        </button>
      )}

      <div className="flex justify-center">
        {/* TODO 23102025: Use one of the pre-defined ARIA roles */}
        {/* eslint-disable-next-line jsx-a11y/aria-role */}
        <div className="prose max-w-[450px]" role="textpanel">
          {projectConfig.showAnnotations ? (
            <AnnotatedText text={props.text} showDetail={false} />
          ) : (
            <TextHighlighting text={props.text} />
          )}
        </div>
      </div>
    </>
  );
};
