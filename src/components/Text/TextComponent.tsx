import { useRef } from "react";
import { Skeleton } from "primereact/skeleton";
import { ProjectAnnotatedText } from "./Annotated/project/ProjectAnnotatedText";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { TextHighlighting } from "./TextHighlighting";
import { useViewText } from "./useViewText.tsx";
import { useSyncTocOnScroll } from "./Toc/useSyncTocOnScroll.tsx";
import { useSyncHeaderWithHashOnInit } from "./Toc/useSyncHeaderWithHashOnInit.tsx";

type TextComponentProps = {
  viewToRender: string | string[];
  isLoading: boolean;
};

export const TextComponent = (props: TextComponentProps) => {
  const text = useViewText(props.viewToRender);
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);

  const scrollRef = useRef<HTMLDivElement>(null);
  useSyncHeaderWithHashOnInit(scrollRef);
  useSyncTocOnScroll(scrollRef);

  return (
    <div className="flex h-auto justify-center overflow-y-hidden border-r">
      {/* <div className="sr-only">
        <h1>Resolutie</h1>
      </div> */}
      <div
        ref={scrollRef}
        className="flex w-full flex-col overflow-y-scroll px-6 pb-40 pt-4 xl:px-10"
      >
        <span className="mr-8 mt-4 flex justify-end gap-1 text-sm uppercase text-neutral-500 lg:my-6">
          {translateProject(`${props.viewToRender}`)}
        </span>
        {text && !props.isLoading ? (
          <div className="flex justify-center">
            {/* TODO 23102025: Use one of the pre-defined ARIA roles */}
            {/* eslint-disable-next-line jsx-a11y/aria-role */}
            <div className="prose max-w-[550px]" role="textpanel">
              {projectConfig.showAnnotations ? (
                <ProjectAnnotatedText text={text} showDetail={false} />
              ) : (
                <TextHighlighting text={text} />
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
