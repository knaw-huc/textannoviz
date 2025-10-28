import { DetailSearchResultsNavigation } from "./DetailSearchResultsNavigation.tsx";
import { ViewSettings } from "./ViewSettings.tsx";

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex justify-between border-t border-neutral-400 bg-[#dddddd] p-3">
      <div className="flex gap-1 md:gap-4">
        <DetailSearchResultsNavigation />
      </div>
      {/* <div className="flex w-full flex-row justify-between lg:w-max">
        <AnnotationButtons />
      </div> */}
      <ViewSettings />
      {/* <button
          className="hover:text-brand1-600 active:text-brand1-700 flex flex-row items-center gap-1 py-1 pr-6 text-neutral-500"
          onClick={props.showAnnotationPanelHandler}
        >
          {props.panelShowState
            ? translate("HIDE_INFO")
            : translate("SHOW_INFO")}{" "}
          <HelpTooltip label={translateProject("TOGGLE_INFO_HELP")} />
        </button> */}
    </footer>
  );
};
