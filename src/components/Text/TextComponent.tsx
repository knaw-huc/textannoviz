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
import { useSyncHeaderWithHash } from "./Toc/useSyncHeaderWithHash.tsx";
import { SkeletonLoader } from "../common/SkeletonLoader.tsx";
import { useHasScrollbar } from "./useHasScrollbar.ts";
import { ScrollToTopButton } from "./ScrollToTopButton.tsx";

// Overflow smaller than this counts as "fully visible": a barely-there
// scrollbar shouldn't surface the scroll-to-top button.
const SCROLLBAR_THRESHOLD_PX = 65;

type TextComponentProps = {
  viewToRender: string | string[];
  isLoading: boolean;
};

export const TextComponent = (props: TextComponentProps) => {
  const text = useViewText(props.viewToRender);
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useTranslateProject();

  const scrollRef = useRef<HTMLDivElement>(null);
  useSyncHeaderWithHash(scrollRef);
  useSyncHeaderOnScroll(scrollRef);

  const hasScrollbar = useHasScrollbar(scrollRef, SCROLLBAR_THRESHOLD_PX, [
    text,
    props.isLoading,
  ]);

  const scrollToTop = () =>
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="relative flex h-auto justify-center overflow-y-hidden border-r">
      {/* <div className="sr-only">
        <h1>Resolutie</h1>
      </div> */}
      <div
        ref={scrollRef}
        className={`flex w-full flex-col overflow-y-scroll px-6 pt-4 xl:px-10 ${
          // Reserve a right-hand lane so scrolling text does not slide under
          // the ScrollToTopButton in mobile view.
          hasScrollbar ? "pr-12 xl:px-10" : ""
        }`}
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
      <ScrollToTopButton visible={hasScrollbar} onPress={scrollToTop} />
    </div>
  );
};
