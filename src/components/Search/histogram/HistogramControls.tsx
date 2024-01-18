import React from "react";
import { Button, Input, Label, TextField } from "react-aria-components";
import { toast } from "react-toastify";

type HistogramControlsProps = {
  graphTypeButtonClickHandler: (newGraphType: string) => void;
  graphDateButtonClickHandler: (newDates: { from: string; to: string }) => void;
  showHistogramButtonClickHandler: (newValue: boolean) => void;
  graphFrom: string;
  graphTo: string;
};

export const HistogramControls = (props: HistogramControlsProps) => {
  const [graphFrom, setGraphFrom] = React.useState(props.graphFrom);
  const [graphTo, setGraphTo] = React.useState(props.graphTo);
  const [showHistogram, setShowHistogram] = React.useState(true);

  function graphDateButtonClickHandler() {
    if (parseInt(graphFrom) > parseInt(graphTo)) {
      toast("From is highter than to", { type: "error" });
      return;
    }

    if (parseInt(graphTo) < parseInt(graphFrom)) {
      toast("To is lower than from", { type: "error" });
      return;
    }
    const newDates = {
      from: graphFrom,
      to: graphTo,
    };
    props.graphDateButtonClickHandler(newDates);
  }

  function showHistogramButtonClickHandler() {
    setShowHistogram(!showHistogram);
    props.showHistogramButtonClickHandler(!showHistogram);
  }

  return (
    <div className="mx-auto mb-4 flex w-full flex-row justify-between">
      <div className="flex flex-row items-end justify-start gap-4">
        <TextField onChange={setGraphFrom}>
          <Label>From</Label>
          <Input value={graphFrom} />
        </TextField>
        <TextField onChange={setGraphTo}>
          <Label>To</Label>
          <Input value={graphTo} />
        </TextField>
        <Button
          className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 disabled:bg-brand2-50 active:bg-brand2-200 disabled:text-brand2-200 rounded px-2 py-2 text-sm outline-none"
          onPress={graphDateButtonClickHandler}
        >
          Apply
        </Button>
      </div>
      <div className="flex w-full flex-row justify-end">
        <div className="flex flex-row items-center gap-4">
          <Button
            className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 disabled:bg-brand2-50 active:bg-brand2-200 disabled:text-brand2-200 rounded px-2 py-2 text-sm outline-none"
            onPress={() => props.graphTypeButtonClickHandler("line")}
          >
            Line chart
          </Button>

          <Button
            className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 disabled:bg-brand2-50 active:bg-brand2-200 disabled:text-brand2-200 rounded px-2 py-2 text-sm outline-none"
            onPress={() => props.graphTypeButtonClickHandler("bar")}
          >
            Bar chart
          </Button>
          <Button
            className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 disabled:bg-brand2-50 active:bg-brand2-200 disabled:text-brand2-200 rounded px-2 py-2 text-sm outline-none"
            onPress={showHistogramButtonClickHandler}
          >
            {showHistogram ? "Hide histogram" : "Show histogram"}
          </Button>
        </div>
      </div>
    </div>
  );
};
