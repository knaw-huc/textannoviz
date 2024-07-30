import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Button } from "react-aria-components";
import { useNavigate, useParams } from "react-router-dom";
import { SurianoTfFileBody } from "../../model/AnnoRepoAnnotation";
import { useAnnotationStore } from "../../stores/annotation";

export function AnnotationButtons() {
  const annotations = useAnnotationStore().annotations;
  const params = useParams();
  const navigate = useNavigate();
  const [isPrevButtonDisabled, setIsPrevButtonDisabled] = React.useState(false);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = React.useState(false);

  const currentAnnotation = annotations.find(
    (annotation) => annotation.body.id === params.tier2,
  );
  const nextLetter = (currentAnnotation?.body as SurianoTfFileBody)?.metadata
    .nextFile;
  const prevLetter = (currentAnnotation?.body as SurianoTfFileBody)?.metadata
    .prevFile;

  React.useEffect(() => {
    setIsNextButtonDisabled(nextLetter === params.tier2);
    setIsPrevButtonDisabled(prevLetter === params.tier2);
  }, [nextLetter, params.tier2, prevLetter]);

  function nextLetterButtonClickHandler() {
    navigate(`/detail/${nextLetter}`);
  }

  function prevLetterButtonClickHandler() {
    navigate(`/detail/${prevLetter}`);
  }

  return (
    <>
      {params.tier2 ? (
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
      ) : null}
    </>
  );
}
