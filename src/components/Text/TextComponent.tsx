import { Skeleton } from "primereact/skeleton";
import { useTextStore } from "../../stores/text/text-store.ts";
import { AnnotatedText } from "./Annotated/AnnotatedText";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { TextHighlighting } from "./TextHighlighting";

type TextComponentProps = {
  viewToRender: string;
  isLoading: boolean;
};

export const TextComponent = (props: TextComponentProps) => {
  const textViews = useTextStore((state) => state.views);
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);

  return (
    <div className="flex h-auto justify-center overflow-y-hidden p-6">
      {/* <div className="sr-only">
        <h1>Resolutie</h1>
      </div> */}
      <div className="flex w-full flex-col overflow-y-scroll pb-40">
        <span
          className="my-6 mr-8 flex justify-end gap-1 text-sm uppercase text-neutral-500"
          tabIndex={0}
        >
          {translateProject(`${props.viewToRender}`)}
        </span>
        {textViews && !props.isLoading ? (
          <div className="flex justify-center">
            <div className="prose max-w-[450px]" role="textpanel">
              {projectConfig.showAnnotations ? (
                <AnnotatedText
                  text={textViews[props.viewToRender]}
                  showDetail={false}
                />
              ) : (
                <TextHighlighting text={textViews[props.viewToRender]} />
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pl-2 pt-2">
            <Skeleton width="16rem" borderRadius="8px" className="h-4" />
            <Skeleton width="24rem" borderRadius="8px" className="h-4" />
            <Skeleton width="12rem" borderRadius="8px" className="h-4" />
          </div>
        )}
      </div>
    </div>
  );
};
