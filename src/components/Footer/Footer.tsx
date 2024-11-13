import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import React from "react";
import {
  Dialog,
  Heading,
  OverlayArrow,
  Popover,
  Switch,
} from "react-aria-components";
import { useAnnotationStore } from "../../stores/annotation";
import {
  projectConfigSelector,
  translateProjectSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project";
import { AnnotationButtons } from "../Annotations/AnnotationButtons";
import { DetailSearchResultsNavigation } from "./DetailSearchResultsNavigation.tsx";
import { HelpTooltip } from "../common/HelpTooltip.tsx";

type FooterProps = {
  showIiifViewerHandler: () => void;
  showAnnotationPanelHandler: () => void;
  showSearchResultsHandler: () => void;
  showSearchResultsDisabled: boolean;
  facsimileShowState: boolean;
  panelShowState: boolean;
  searchResultsShowState: boolean;
};

export const Footer = (props: FooterProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const trifferRef = React.useRef(null);
  const projectConfig = useProjectStore(projectConfigSelector);
  const translate = useProjectStore(translateSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const showSvgsAnnosMirador = useAnnotationStore(
    (state) => state.showSvgsAnnosMirador,
  );
  const setShowSvgsAnnosMirador = useAnnotationStore(
    (state) => state.setShowSvgsAnnosMirador,
  );

  return (
    <footer className="border-brand1Grey-100 drop-shadow-top fixed bottom-0 w-full border-t bg-white text-sm text-neutral-500">
      <div className="mx-auto flex w-full flex-col justify-between lg:flex-row">
        <div className="flex w-full flex-row justify-start gap-8 lg:w-2/5">
          <DetailSearchResultsNavigation />
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
            <HelpTooltip label={translateProject("TOGGLE_INFO_HELP")} />
          </button>
        </div>
      </div>
    </footer>
  );
};
