import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Button } from "react-aria-components";
import { useParams } from "react-router-dom";
import { useDetailNavigation } from "../../components/Detail/useDetailNavigation.tsx";
import { TranslatinPartBody } from "../../model/AnnoRepoAnnotation";
import { useAnnotationStore } from "../../stores/annotation";

export function AnnotationButtons() {
  const annotations = useAnnotationStore().annotations;
  const params = useParams();
  const { navigateDetail } = useDetailNavigation();
  const [isPrevButtonDisabled, setIsPrevButtonDisabled] = React.useState(false);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = React.useState(false);

  const currentAnnotation = annotations.find(
    (annotation) => annotation.body.id === params.tier2,
  );

  const nextPart = (currentAnnotation?.body as TranslatinPartBody)?.metadata
    .nextPart;
  const prevPart = (currentAnnotation?.body as TranslatinPartBody)?.metadata
    .prevPart;

  React.useEffect(() => {
    setIsNextButtonDisabled(!nextPart || nextPart === params.tier2);
    setIsPrevButtonDisabled(!prevPart || prevPart === params.tier2);
  }, [nextPart, params.tier2, prevPart]);

  function nextLetterButtonClickHandler() {
    navigateDetail(`/detail/${nextPart}`);
  }

  function prevLetterButtonClickHandler() {
    navigateDetail(`/detail/${prevPart}`);
  }

  return (
    <>
      <Button
        className="hover:text-brand1-600 active:text-brand1-700 disabled:text-brand1-200 flex flex-row items-center gap-1 py-1 pl-16 outline-none"
        onPress={prevLetterButtonClickHandler}
        isDisabled={isPrevButtonDisabled}
      >
        <ChevronLeftIcon className="h-4 w-4 fill-neutral-500" />
        Prev part
      </Button>
      <Button
        className="hover:text-brand1-600 active:text-brand1-700 disabled:text-brand1-200 flex flex-row items-center gap-1 py-1 pl-16 outline-none"
        onPress={nextLetterButtonClickHandler}
        isDisabled={isNextButtonDisabled}
      >
        Next part
        <ChevronRightIcon className="h-4 w-4 fill-neutral-500" />
      </Button>
    </>
  );
}
