import {
  InformationCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import {translateSelector, useProjectStore} from "../stores/project";
import { AnnotationButtons } from "./Annotations/AnnotationButtons";

type FooterProps = {
  nextOrPrevButtonClicked: (clicked: boolean) => boolean;
  showIiifViewerHandler: () => void;
  showAnnotationPanelHandler: () => void;
  showSearchResultsHandler: () => void;
  showSearchResultsDisabled: boolean;
  facsimileShowState: boolean;
  panelShowState: boolean;
  searchResultsShowState: boolean;
};

export const Footer = (props: FooterProps) => {
  const projectConfig = useProjectStore((state) => state.projectConfig);
  const translate = useProjectStore(translateSelector);

  return (
    <div className="border-brand1Grey-100 drop-shadow-top fixed bottom-0 w-full border-t bg-white text-sm text-neutral-500">
      <div className="mx-auto flex w-full flex-col justify-between lg:flex-row">
        <div className="flex w-full flex-row justify-start gap-8 lg:w-2/5">
          <button className="flex flex-row items-center gap-1 py-1 pl-10 text-neutral-500">
            <Link
              to="/"
              className="hover:text-brand1-600 active:text-brand1-700 text-inherit no-underline"
            >
              <MagnifyingGlassIcon className="inline h-4 w-4 fill-neutral-500" />{" "}
              {translate('NEW_SEARCH')}
            </Link>
          </button>
          {projectConfig?.showSearchResultsButtonFooter ? (
            <button
              className={`${
                props.searchResultsShowState
                  ? "text-brand1-500"
                  : "text-neutral-500"
              } hover:text-brand1-600 active:text-brand1-700 flex flex-row items-center gap-1 disabled:text-neutral-300`}
              onClick={props.showSearchResultsHandler}
              disabled={props.searchResultsShowState}
            >
              {props.searchResultsShowState
                ? translate('HIDE_SEARCH_RESULTS')
                : translate('SHOW_SEARCH_RESULTS')}
            </button>
          ) : null}

          {projectConfig?.showFacsimileButtonFooter ? (
            <button
              className="hover:text-brand1-600 active:text-brand1-700 flex flex-row items-center gap-1 text-neutral-500"
              onClick={props.showIiifViewerHandler}
            >
              {props.facsimileShowState
                ? translate('HIDE_FACSIMILE')
                : translate('SHOW_FACSIMILE')}
            </button>
          ) : null}
        </div>
        <div className="flex w-full flex-row justify-between lg:w-2/5">
          <AnnotationButtons
            nextOrPrevButtonClicked={props.nextOrPrevButtonClicked}
          />
        </div>
        <div className="flex w-full flex-row justify-end lg:w-1/5">
          <button
            className="hover:text-brand1-600 active:text-brand1-700 flex flex-row items-center gap-1 py-1 pr-6 text-neutral-500"
            onClick={props.showAnnotationPanelHandler}
          >
            {props.panelShowState
                ? translate('HIDE_INFO')
                : translate('SHOW_INFO')}
            {" "}
            <InformationCircleIcon className="inline h-5 w-5 fill-neutral-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
