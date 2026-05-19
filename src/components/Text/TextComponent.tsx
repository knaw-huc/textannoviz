import { useRef } from "react";
import { ProjectAnnotatedText } from "./Annotated/ProjectAnnotatedText.tsx";
import {
  projectConfigSelector,
  useTranslateProject,
  useProjectStore,
} from "../../stores/project";
import { TextHighlighting } from "./TextHighlighting";
import { useViewText } from "./useViewText.tsx";
import { useSyncHeaderOnScroll } from "./Toc/useSyncHeaderOnScroll.tsx";
import { useSyncHeaderWithHashOnInit } from "./Toc/useSyncHeaderWithHashOnInit.tsx";
import { SkeletonLoader } from "../common/SkeletonLoader.tsx";

type TextComponentProps = {
  viewToRender: string | string[];
  isLoading: boolean;
};

export const TextComponent = (props: TextComponentProps) => {
  const text = useViewText(props.viewToRender);
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useTranslateProject();

  const scrollRef = useRef<HTMLDivElement>(null);
  useSyncHeaderWithHashOnInit(scrollRef);
  useSyncHeaderOnScroll(scrollRef);

  return (
    <div className="flex h-auto justify-center overflow-y-hidden border-r">
      {/* <div className="sr-only">
        <h1>Resolutie</h1>
      </div> */}
      <div
        ref={scrollRef}
        className="flex w-full flex-col overflow-y-scroll px-6 pt-4 xl:px-10"
      >
        <span className="mr-8 mt-4 flex justify-end gap-1 text-sm uppercase text-neutral-500 lg:my-6">
          {translateProject(`${props.viewToRender}`)}
        </span>
        {text && !props.isLoading ? (
          <div className="flex justify-center">
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
          <SkeletonLoader />
        )}
      </div>
    </div>
  );
};
