import { Skeleton } from "primereact/skeleton";
import { useTextStore } from "../../stores/text/text-store.ts";
import { AnnotatedText } from "./Annotated/AnnotatedText";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { TextHighlighting } from "./TextHighlighting";
import {
  BroccoliTextGeneric,
  ViewLang,
  Broccoli,
} from "../../model/Broccoli.ts";
import React from "react";

type TextComponentProps = {
  viewToRender: string;
  isLoading: boolean;
};

export const TextComponent = (props: TextComponentProps) => {
  const textViews = useTextStore((state) => state.views);
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);

  const [
    view,
    // TODO: revert
    // lang
  ] = props.viewToRender.split(".") as [keyof Broccoli["views"], ViewLang];

  const text: BroccoliTextGeneric | undefined = React.useMemo(() => {
    const candidate = textViews?.[view];
    if (!candidate) return;

    if (
      typeof candidate === "object"
      // TODO: revert
      // && candidate !== null
      // && lang in candidate
    ) {
      // TODO: revert
      // return (candidate as Record<string, BroccoliTextGeneric>)[lang];
      return Object.values(candidate)[0] as BroccoliTextGeneric;
    }
    return candidate as BroccoliTextGeneric;
  }, [textViews, view]);

  return (
    <div className="flex h-auto justify-center overflow-y-hidden border-r">
      {/* <div className="sr-only">
        <h1>Resolutie</h1>
      </div> */}
      <div className="flex w-full flex-col overflow-y-scroll px-6 pb-40 pt-4 xl:px-10">
        <span className="my-6 mr-8 flex justify-end gap-1 text-sm uppercase text-neutral-500">
          {translateProject(`${props.viewToRender}`)}
        </span>
        {text && !props.isLoading ? (
          <div className="flex justify-center">
            {/* TODO 23102025: Use one of the pre-defined ARIA roles */}
            {/* eslint-disable-next-line jsx-a11y/aria-role */}
            <div className="prose max-w-[550px]" role="textpanel">
              {projectConfig.showAnnotations ? (
                <AnnotatedText text={text} showDetail={false} />
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
