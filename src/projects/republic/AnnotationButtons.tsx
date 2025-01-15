import React from "react";
import { Button } from "react-aria-components";
import { useParams } from "react-router-dom";
import { ResolutionBody } from "../../model/AnnoRepoAnnotation";
import { useAnnotationStore } from "../../stores/annotation";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { useDetailNavigation } from "../../components/Detail/useDetailNavigation.tsx";

export function AnnotationButtons() {
  const annotations = useAnnotationStore().annotations;
  const params = useParams();
  const { navigateDetail } = useDetailNavigation();
  const [isPrevButtonDisabled, setIsPrevButtonDisabled] = React.useState(false);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = React.useState(false);
  const translateProject = useProjectStore(translateProjectSelector);
  const currentAnnotation = annotations.find(
    (anno) => anno.body.id === params.tier2,
  );

  const prevResolution = (currentAnnotation?.body as ResolutionBody)?.metadata
    .prevResolutionId;
  const nextResolution = (currentAnnotation?.body as ResolutionBody)?.metadata
    .nextResolutionId;

  React.useEffect(() => {
    setIsPrevButtonDisabled(!prevResolution || prevResolution === params.tier2);
    setIsNextButtonDisabled(!nextResolution || nextResolution === params.tier2);
  }, [prevResolution, nextResolution, params.tier2]);

  function prevResolutionButtonClickHandler() {
    navigateDetail(`/detail/${prevResolution}`);
  }

  function nextResolutionButtonClickHandler() {
    navigateDetail(`/detail/${nextResolution}`);
  }

  return (
    <>
      <Button
        className="hover:text-brand1-600 active:text-brand1-700 disabled:text-brand1-200 flex flex-row items-center gap-1 py-1 pl-16 outline-none"
        onPress={prevResolutionButtonClickHandler}
        isDisabled={isPrevButtonDisabled}
      >
        {/* <ChevronLeftIcon className="h-4 w-4 fill-neutral-500" /> */}
        {translateProject("prevResolution")}
      </Button>
      <Button
        className="hover:text-brand1-600 active:text-brand1-700 disabled:text-brand1-200 flex flex-row items-center gap-1 py-1 pl-16 outline-none"
        onPress={nextResolutionButtonClickHandler}
        isDisabled={isNextButtonDisabled}
      >
        {translateProject("nextResolution")}
        {/* <ChevronRightIcon className="h-4 w-4 fill-neutral-500" /> */}
      </Button>
    </>
  );
}
