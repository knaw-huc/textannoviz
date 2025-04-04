import React from "react";
import { Button } from "react-aria-components";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { ArrowRotateLeft } from "../common/icons/ArrowRotateLeft.tsx";

type DateFacetProps = {
  dateTo: string;
  dateFrom: string;
  resetDates: (update: { dateFrom: string; dateTo: string }) => void;
  fromDateChangeHandler: (newDateFrom: string, valid: boolean) => void;
  toDateChangeHandler: (newDateTo: string, valid: boolean) => void;
};

export function DateFacet(props: DateFacetProps) {
  const translate = useProjectStore(translateSelector);
  const projectConfig = useProjectStore(projectConfigSelector);

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
    <div className="flex w-full max-w-[450px] flex-col gap-4 min-[1350px]:flex-row">
      <div className="flex w-full flex-col">
        <form>
          <label htmlFor="start" className="font-semibold">
            {translate("DATE_FROM")}
          </label>
          <input
            className="w-full rounded border border-neutral-700 px-3 py-1 text-sm"
            type="date"
            id="start"
            value={props.dateFrom}
            min={projectConfig.initialDateFrom}
            max={projectConfig.initialDateTo}
            onChange={(event) => fromDateChangeHandler(event)}
            required
          />
          <span className="validity" />
        </form>
      </div>
      <div className="flex w-full flex-col">
        <form>
          <label htmlFor="end" className="font-semibold">
            {translate("UP_TO_AND_INCLUDING")}
          </label>
          <input
            className="w-full rounded border border-neutral-700 px-3 py-1 text-sm"
            type="date"
            id="end"
            value={props.dateTo}
            min={projectConfig.initialDateFrom}
            max={projectConfig.initialDateTo}
            onChange={(event) => toDateChangeHandler(event)}
            required
          />
          <span className="validity" />
        </form>
      </div>
      <Button onPress={resetClickHandler}>
        <ArrowRotateLeft />
      </Button>
    </div>
  );
}
