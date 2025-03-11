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
import { useRef } from "react";

type TextPanelProps = {
  panel: string;
  text: BroccoliTextGeneric;
  closePanelHandler: (panelToClose: string) => void;
};

export const TextPanel = (props: TextPanelProps) => {
  const translateProject = useProjectStore(translateProjectSelector);
  const projectConfig = useProjectStore(projectConfigSelector);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <StyledText panel={props.panel} ref={containerRef}>
      <div className="mx-auto mb-8 flex w-full max-w-3xl items-center justify-between border-b pb-4">
        <span
          className="font-sans text-sm uppercase text-neutral-800"
          tabIndex={0}
        >
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
      </div>

      <div className="mx-auto flex max-w-3xl" role="textpanel">
        {projectConfig.showAnnotations ? (
          <AnnotatedText
            text={props.text}
            showDetail={false}
            containerRect={containerRef.current?.getBoundingClientRect()}
          />
        ) : (
          <TextHighlighting text={props.text} />
        )}
      </div>
    </StyledText>
  );
};
