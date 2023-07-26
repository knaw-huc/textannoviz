import {
  InformationCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { AnnotationButtons } from "./Annotations/AnnotationButtons";

type FooterProps = {
  nextOrPrevButtonClicked: (clicked: boolean) => boolean;
  showIiifViewerHandler: () => void;
  showAnnotationPanelHandler: () => void;
  showSearchResultsHandler: () => void;
  showSearchResultsDisabled: boolean;
};

export const Footer = (props: FooterProps) => {
  return (
    <div className="border-brand1Grey-100 drop-shadow-top fixed bottom-0 w-full border-t bg-white text-sm text-neutral-500">
      <div className="mx-auto flex w-full flex-col justify-between lg:flex-row">
        <div className="flex w-full flex-row justify-start gap-8 lg:w-2/5">
          <button className="flex flex-row items-center gap-1 py-1 pl-10 text-neutral-500">
            <Link
              to="/search"
              className="hover:text-brand1-600 text-inherit no-underline"
            >
              <MagnifyingGlassIcon className="inline h-4 w-4 fill-neutral-500" />{" "}
              Back to search
            </Link>
          </button>
          <button
            className="hover:text-brand1-600 flex flex-row items-center gap-1 text-neutral-500 disabled:text-neutral-300"
            onClick={props.showSearchResultsHandler}
            disabled={props.showSearchResultsDisabled}
          >
            Show results
          </button>
          <button
            className="hover:text-brand1-600 flex flex-row items-center gap-1 text-neutral-500"
            onClick={props.showIiifViewerHandler}
          >
            Hide facsimile
          </button>
        </div>
        <div className="flex w-full flex-row justify-between lg:w-2/5">
          <AnnotationButtons
            nextOrPrevButtonClicked={props.nextOrPrevButtonClicked}
          />
        </div>
        <div className="flex w-full flex-row justify-end lg:w-1/5">
          <button
            className="hover:text-brand1-600 flex flex-row items-center gap-1 py-1 pr-6 text-neutral-500"
            onClick={props.showAnnotationPanelHandler}
          >
            Hide info{" "}
            <InformationCircleIcon className="inline h-5 w-5 fill-neutral-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
