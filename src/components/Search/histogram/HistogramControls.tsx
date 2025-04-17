import React from "react";
import { Button } from "react-aria-components";

import { translateSelector, useProjectStore } from "../../../stores/project";

type HistogramControlsProps = {
  graphTypeButtonClickHandler: (newGraphType: string) => void;
  showHistogramButtonClickHandler: (newValue: boolean) => void;
  returnToPrevDateRange: () => void;
  histogramZoomed: boolean;
};

export const HistogramControls = (props: HistogramControlsProps) => {
  const [showHistogram, setShowHistogram] = React.useState(true);
  const translate = useProjectStore(translateSelector);

  function showHistogramButtonClickHandler() {
    setShowHistogram(!showHistogram);
    props.showHistogramButtonClickHandler(!showHistogram);
  }

  return (
    <div className="mx-auto mb-4 flex w-full flex-row justify-between">
      <div className="flex w-full flex-row justify-start">
        <div className="flex flex-row items-center gap-4">
          <Button
            className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 disabled:bg-brand2-50 active:bg-brand2-200 disabled:text-brand2-200 rounded px-2 py-2 text-sm outline-none"
            onPress={props.returnToPrevDateRange}
            isDisabled={!props.histogramZoomed}
          >
            {translate("RESET_DATE")}
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-row justify-end">
        <div className="flex flex-row items-center gap-4">
          <Button
            className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 disabled:bg-brand2-50 active:bg-brand2-200 disabled:text-brand2-200 rounded px-2 py-2 text-sm outline-none"
            onPress={() => props.graphTypeButtonClickHandler("line")}
          >
            {translate("LINE_CHART")}
          </Button>

          <Button
            className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 disabled:bg-brand2-50 active:bg-brand2-200 disabled:text-brand2-200 rounded px-2 py-2 text-sm outline-none"
            onPress={() => props.graphTypeButtonClickHandler("bar")}
          >
            {translate("BAR_CHART")}
          </Button>
          <Button
            className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 disabled:bg-brand2-50 active:bg-brand2-200 disabled:text-brand2-200 rounded px-2 py-2 text-sm outline-none"
            onPress={showHistogramButtonClickHandler}
          >
            {showHistogram
              ? translate("HIDE_HISTOGRAM")
              : translate("SHOW_HISTOGRAM")}
          </Button>
        </div>
      </div>
    </div>
  );
};
