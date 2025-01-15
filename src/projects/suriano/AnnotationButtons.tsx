import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Button } from "react-aria-components";
import { useParams } from "react-router-dom";
import { SurianoLetterBody } from "../../model/AnnoRepoAnnotation";
import { useAnnotationStore } from "../../stores/annotation";
import { useDetailNavigation } from "../../components/Text/Annotated/utils/useDetailNavigation.tsx";

export function AnnotationButtons() {
  const annotations = useAnnotationStore().annotations;
  const params = useParams();
  const { navigateDetail } = useDetailNavigation();
  const [isPrevButtonDisabled, setIsPrevButtonDisabled] = React.useState(false);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = React.useState(false);

  const currentAnnotation = annotations.find(
    (annotation) => annotation.body.id === params.tier2,
  );

  const nextLetter = (currentAnnotation?.body as SurianoLetterBody)?.metadata
    .nextLetterBody;
  const prevLetter = (currentAnnotation?.body as SurianoLetterBody)?.metadata
    .prevLetterBody;

  React.useEffect(() => {
    setIsNextButtonDisabled(!nextLetter || nextLetter === params.tier2);
    setIsPrevButtonDisabled(!prevLetter || prevLetter === params.tier2);
  }, [nextLetter, params.tier2, prevLetter]);

  function nextLetterButtonClickHandler() {
    navigateDetail(`/detail/${nextLetter}`);
  }

  function prevLetterButtonClickHandler() {
    navigateDetail(`/detail/${prevLetter}`);
  }

  return (
    <>
      <Button
        className="hover:text-brand1-600 active:text-brand1-700 disabled:text-brand1-200 flex flex-row items-center gap-1 py-1 pl-16 outline-none"
        onPress={prevLetterButtonClickHandler}
        isDisabled={isPrevButtonDisabled}
      >
        <ChevronLeftIcon className="h-4 w-4 fill-neutral-500" />
        Prev letter
      </Button>
      <Button
        className="hover:text-brand1-600 active:text-brand1-700 disabled:text-brand1-200 flex flex-row items-center gap-1 py-1 pl-16 outline-none"
        onPress={nextLetterButtonClickHandler}
        isDisabled={isNextButtonDisabled}
      >
        Next letter
        <ChevronRightIcon className="h-4 w-4 fill-neutral-500" />
      </Button>
    </>
  );
}
