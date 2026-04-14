import { translateSelector, useProjectStore } from "../../stores/project.ts";
import {
  useCanvas,
  useViewerControls,
  useViewerReady,
} from "@knaw-huc/osd-iiif-viewer";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/24/solid";
import { HomeIcon } from "@heroicons/react/24/outline";
import { getValue } from "@iiif/helpers/i18n";
import { RefObject } from "react";

type NavigationBarProps = {
  fullscreenRef: RefObject<HTMLElement | null>;
};

export function NavigationBar({ fullscreenRef }: NavigationBarProps) {
  const translate = useProjectStore(translateSelector);
  const ready = useViewerReady();
  const { currentIndex, current, total, next, prev } = useCanvas();
  const {
    zoomIn,
    zoomOut,
    home,
    zoomLevel,
    zoomMin,
    zoomMax,
    toggleFullPage,
    isFullPage,
  } = useViewerControls(fullscreenRef);

  if (!ready || !zoomLevel || !zoomMin || !zoomMax) {
    return null;
  }

  const isMinZoom = zoomLevel <= zoomMin;
  const isMaxZoom = zoomLevel >= zoomMax;

  return (
    <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center rounded bg-white/75 px-2 py-1">
      <div className="flex items-center gap-1">
        <button
          onClick={zoomIn}
          disabled={isMaxZoom}
          aria-label={translate("ZOOM_IN")}
          className="hover:bg-brand2-100 rounded p-1 disabled:opacity-30"
        >
          <MagnifyingGlassPlusIcon className="h-5 w-5" />
        </button>
        <button
          onClick={zoomOut}
          disabled={isMinZoom}
          aria-label={translate("ZOOM_OUT")}
          className="hover:bg-brand2-100 rounded p-1 disabled:opacity-30"
        >
          <MagnifyingGlassMinusIcon className="h-5 w-5" />
        </button>
        <button
          onClick={home}
          aria-label={translate("ZOOM_RESET")}
          className="hover:bg-brand2-100 rounded p-1"
        >
          <HomeIcon className="h-5 w-5" />
        </button>

        <button
          onClick={toggleFullPage}
          aria-label={translate(isFullPage ? "EXIT_FULLSCREEN" : "FULLSCREEN")}
          className="hover:bg-brand2-100 rounded p-1"
        >
          {isFullPage ? (
            <ArrowsPointingInIcon className="h-5 w-5" />
          ) : (
            <ArrowsPointingOutIcon className="h-5 w-5" />
          )}
        </button>

        <div className="m-2 h-5 w-px bg-black/20" />

        <button
          onClick={prev}
          disabled={currentIndex === 0}
          aria-label={translate("PREV_SCAN")}
          className="hover:bg-brand2-100 rounded p-1 disabled:opacity-50"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          disabled={currentIndex === total - 1}
          aria-label={translate("NEXT_SCAN")}
          className="hover:bg-brand2-100 rounded p-1 disabled:opacity-50"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      <span className="mb-1 mt-2 select-none whitespace-nowrap text-xs">
        {currentIndex + 1} {translate("FROM").toLowerCase()} {total}
        {current && <> · {getValue(current.label)}</>}
      </span>
    </div>
  );
}
