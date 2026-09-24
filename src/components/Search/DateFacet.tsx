import React from "react";
import { Button } from "react-aria-components";
import {
  projectConfigSelector,
  useProjectStore,
  useTranslate,
  useTranslateProject,
} from "../../stores/project.ts";
import { ArrowRotateLeft } from "../common/icons/ArrowRotateLeft.tsx";
import { HelpTooltip } from "../common/HelpTooltip.tsx";

type DateFacetProps = {
  dateTo: string;
  dateFrom: string;
  resetDates: (update: { dateFrom: string; dateTo: string }) => void;
  fromDateChangeHandler: (newDateFrom: string, valid: boolean) => void;
  toDateChangeHandler: (newDateTo: string, valid: boolean) => void;
};

export function DateFacet(props: DateFacetProps) {
  const translate = useTranslate();
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useTranslateProject();

  function resetClickHandler() {
    const newDates = {
      dateFrom: projectConfig.initialDateFrom,
      dateTo: projectConfig.initialDateTo,
    };
    props.resetDates(newDates);
  }

  function fromDateChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const newFromDate = event.target.value;
    const isValid = event.target.validity.valid;

    props.fromDateChangeHandler(newFromDate, isValid);
  }

  function toDateChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const newToDate = event.target.value;
    const isValid = event.target.validity.valid;

    props.toDateChangeHandler(newToDate, isValid);
  }

  return (
    <div className="bg-brand2-50 flex w-full max-w-[450px] items-end gap-1 rounded p-1.5">
      <div className="flex min-w-0 flex-1 flex-col gap-2 2xl:flex-row">
        <form className="flex min-w-0 flex-1 flex-col gap-0.5">
          <label
            htmlFor="start"
            className="flex h-5 items-center gap-0.5 text-base font-semibold"
          >
            {translate("DATE_FROM")}
            <HelpTooltip label={translateProject("DATE_HELP")} />
          </label>
          <div className="flex items-center gap-1">
            <input
              className="min-w-0 flex-1 rounded border border-neutral-700 px-1.5 py-0.5 text-xs"
              type="date"
              id="start"
              value={props.dateFrom}
              min={projectConfig.initialDateFrom}
              max={projectConfig.initialDateTo}
              onChange={(event) => fromDateChangeHandler(event)}
              required
            />
            <span className="validity shrink-0" aria-hidden="true" />
          </div>
        </form>

        <form className="flex min-w-0 flex-1 flex-col gap-0.5">
          <label
            htmlFor="end"
            className="flex h-5 items-center text-base font-semibold"
          >
            {translate("UP_TO_AND_INCLUDING")}
          </label>
          <div className="flex items-center gap-1">
            <input
              className="min-w-0 flex-1 rounded border border-neutral-700 px-1.5 py-0.5 text-xs"
              type="date"
              id="end"
              value={props.dateTo}
              min={projectConfig.initialDateFrom}
              max={projectConfig.initialDateTo}
              onChange={(event) => toDateChangeHandler(event)}
              required
            />
            <span className="validity shrink-0" aria-hidden="true" />
          </div>
        </form>
      </div>

      <Button onPress={resetClickHandler} aria-label={translate("RESET_DATE")}>
        <ArrowRotateLeft />
      </Button>
    </div>
  );
}
