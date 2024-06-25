import {
  Cog6ToothIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { Base64 } from "js-base64";
import React, { PropsWithChildren } from "react";
import {
  Dialog,
  Heading,
  OverlayArrow,
  Popover,
  Switch,
} from "react-aria-components";
import { useNavigate } from "react-router-dom";
import { useAnnotationStore } from "../stores/annotation";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../stores/project";
import { useSearchStore } from "../stores/search/search-store";
import { AnnotationButtons } from "./Annotations/AnnotationButtons";
import {
  DetailParams,
  useDetailUrlParams,
} from "./Text/Annotated/utils/useDetailUrlParams.tsx";
import { SearchResult } from "../model/Search.ts";
import { toDetailPageUrl } from "./Text/Annotated/utils/toDetailPageUrl.tsx";

type FooterProps = {
  showIiifViewerHandler: () => void;
  showAnnotationPanelHandler: () => void;
  showSearchResultsHandler: () => void;
  showSearchResultsDisabled: boolean;
  facsimileShowState: boolean;
  panelShowState: boolean;
  searchResultsShowState: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function skipEmptyValues(_: string, v: any) {
  return [null, ""].includes(v) ? undefined : v;
}

export const Footer = (props: FooterProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const trifferRef = React.useRef(null);
  const projectConfig = useProjectStore(projectConfigSelector);
  const translate = useProjectStore(translateSelector);
  const showSvgsAnnosMirador = useAnnotationStore(
    (state) => state.showSvgsAnnosMirador,
  );
  const setShowSvgsAnnosMirador = useAnnotationStore(
    (state) => state.setShowSvgsAnnosMirador,
  );
  const { searchQuery, searchUrlParams, searchResults } = useSearchStore();
  const detailParams = useDetailUrlParams();
  const { prevResult, nextResult } = createPrevNextUrls(
    detailParams,
    searchResults,
  );

  const cleanQuery = JSON.stringify(searchQuery, skipEmptyValues);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const urlSearchParams = new URLSearchParams(searchUrlParams as any);

  return (
    <div className="border-brand1Grey-100 drop-shadow-top fixed bottom-0 w-full border-t bg-white text-sm text-neutral-500">
      <div className="mx-auto flex w-full flex-col justify-between lg:flex-row">
        <div className="flex w-full flex-row justify-start gap-8 lg:w-2/5">
          <FooterLink classes={["pl-10"]} to={prevResult}>
            &lt; Previous
          </FooterLink>
          <FooterLink
            to={`/?${urlSearchParams}&query=${Base64.toBase64(cleanQuery)}`}
          >
            <MagnifyingGlassIcon className="inline h-4 w-4 fill-neutral-500" />{" "}
            {translate("BACK_TO_SEARCH")}
          </FooterLink>
          <FooterLink to={nextResult}>Next &gt;</FooterLink>
          {projectConfig.showSearchResultsButtonFooter ? (
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
                ? translate("HIDE_SEARCH_RESULTS")
                : translate("SHOW_SEARCH_RESULTS")}
            </button>
          ) : null}

          {projectConfig.showFacsimileButtonFooter ? (
            <button
              className="hover:text-brand1-600 active:text-brand1-700 flex flex-row items-center gap-1 text-neutral-500"
              onClick={props.showIiifViewerHandler}
            >
              {props.facsimileShowState
                ? translate("HIDE_FACSIMILE")
                : translate("SHOW_FACSIMILE")}
            </button>
          ) : null}

          {projectConfig.showSettingsMenuFooter ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              ref={trifferRef}
              className="hover:text-brand1-600 active:text-brand1-700 flex flex-row items-center gap-1 text-neutral-500"
              aria-label="Settingsmenu detailpagina"
            >
              <Cog6ToothIcon className="inline h-4 w-4" />
            </button>
          ) : null}
          {isOpen ? (
            <Popover
              triggerRef={trifferRef}
              isOpen={isOpen}
              onOpenChange={setIsOpen}
            >
              <OverlayArrow>
                <svg width={12} height={12} viewBox="0 0 12 12">
                  <path d="M0 0 L6 6 L12 0" />
                </svg>
              </OverlayArrow>
              <Dialog>
                <Heading slot="title" className="mb-4 text-xl font-bold">
                  Settings menu
                </Heading>
                {/* <div className="mb-8">
                  <AnnotationsToHighlightFilter />
                </div> */}
                <div>
                  <div className="flex w-full flex-row items-center gap-6">
                    <p>Highlight annotations in IIIF viewer</p>
                    <Switch
                      isSelected={showSvgsAnnosMirador}
                      onChange={() =>
                        setShowSvgsAnnosMirador(!showSvgsAnnosMirador)
                      }
                    >
                      <div className="indicator" />
                    </Switch>
                  </div>
                </div>
              </Dialog>
            </Popover>
          ) : null}
        </div>
        <div className="flex w-full flex-row justify-between lg:w-2/5">
          <AnnotationButtons />
        </div>
        <div className="flex w-full flex-row justify-end lg:w-1/5">
          <button
            className="hover:text-brand1-600 active:text-brand1-700 flex flex-row items-center gap-1 py-1 pr-6 text-neutral-500"
            onClick={props.showAnnotationPanelHandler}
          >
            {props.panelShowState
              ? translate("HIDE_INFO")
              : translate("SHOW_INFO")}{" "}
            <InformationCircleIcon className="inline h-5 w-5 fill-neutral-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

function createPrevNextUrls(
  detailParams: DetailParams,
  searchResults?: SearchResult,
): {
  prevResult?: string;
  nextResult?: string;
} {
  if (!searchResults) {
    return {};
  }
  const { tier2, highlight } = detailParams;
  const resultIndex = searchResults.results.findIndex((r) => r._id === tier2);
  const prevResultId =
    resultIndex > 0 ? searchResults.results[resultIndex - 1]._id : undefined;
  const prevResult = prevResultId
    ? toDetailPageUrl(prevResultId, { highlight })
    : undefined;
  const nextResultId =
    resultIndex !== -1 && resultIndex < searchResults.results.length - 1
      ? searchResults.results[resultIndex + 1]._id
      : undefined;
  const nextResult = nextResultId
    ? toDetailPageUrl(nextResultId, { highlight })
    : undefined;
  return { prevResult, nextResult };
}

export function FooterLink(
  props: PropsWithChildren<{
    classes?: string[];
    to?: string;
  }>,
) {
  const navigate = useNavigate();
  const btnClasses = ["flex", "flex-row", "items-center", "gap-1", "py-1"];
  if (props.classes) {
    btnClasses.push(...props.classes);
  }
  const textClasses = ["text-inherit", "no-underline"];
  if (props.to) {
    btnClasses.push("text-neutral-500");
    textClasses.push("hover:text-brand1-600", "active:text-brand1-700");
  } else {
    btnClasses.push("text-neutral-300");
  }
  return (
    <button
      disabled={!props.to}
      className={btnClasses.join(" ")}
      onClick={() => {
        console.log("onClick", props.to);
        props.to && navigate(props.to);
      }}
    >
      <span aria-disabled={!props.to} className={textClasses.join(" ")}>
        {props.children}
      </span>
    </button>
  );
}
