import { ArrowPathIcon } from "@heroicons/react/24/solid";
import React from "react";
import { toast } from "react-toastify";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";

export function DateFacet(props: {
  dateTo: string;
  dateFrom: string;
  changeDateFrom: (value: string) => void;
  changeDateTo: (value: string) => void;
}) {
  const translate = useProjectStore(translateSelector);
  const projectConfig = useProjectStore(projectConfigSelector);
  const [dateFrom, setDateFrom] = React.useState<string>(
    projectConfig.initialDateFrom,
  );
  const [dateTo, setDateTo] = React.useState<string>(
    projectConfig.initialDateTo,
  );

  //to sync date facet with histogram. find better way?
  React.useEffect(() => {
    setDateFrom(props.dateFrom);
    setDateTo(props.dateTo);
  }, [props.dateFrom, props.dateTo]);

  const toastMessage = () =>
    toast(`You are setting an incorrect date. Please set a correct date.`, {
      type: "error",
    });

  const fromDateChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newDateTo = new Date(event.target.value);
    const minDateTo = new Date(event.target.min);
    const maxDateTo = new Date(event.target.max);

    if (
      newDateTo.getFullYear() < minDateTo.getFullYear() ||
      newDateTo.getFullYear() > maxDateTo.getFullYear()
    ) {
      toastMessage();
    }

    if (newDateTo.toString() !== "Invalid Date") {
      props.changeDateFrom(event.target.value);
      setDateFrom(event.target.value);
    } else {
      toastMessage();
    }
  };

  const toDateChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDateTo = new Date(event.target.value);
    const minDateTo = new Date(event.target.min);
    const maxDateTo = new Date(event.target.max);

    if (
      newDateTo.getFullYear() < minDateTo.getFullYear() ||
      newDateTo.getFullYear() > maxDateTo.getFullYear()
    ) {
      toastMessage();
    }

    if (newDateTo.toString() !== "Invalid Date") {
      props.changeDateTo(event.target.value);
      setDateTo(event.target.value);
    } else {
      toastMessage();
    }
  };

  const resetClickHandler = () => {
    setDateFrom(projectConfig.initialDateFrom);
    setDateTo(projectConfig.initialDateTo);
    props.changeDateFrom(projectConfig.initialDateFrom);
    props.changeDateTo(projectConfig.initialDateTo);
  };

  return (
    <div className="flex w-full max-w-[450px] flex-col gap-4 lg:flex-row">
      <div className="flex w-full flex-col">
        <label htmlFor="start" className="font-semibold">
          {translate("FROM")}
        </label>
        <input
          className="w-full rounded border border-neutral-700 px-3 py-1 text-sm"
          type="date"
          id="start"
          value={dateFrom}
          min={projectConfig.initialDateFrom}
          max={projectConfig.initialDateTo}
          onChange={(event) => fromDateChangeHandler(event)}
        />
      </div>
      <div className="flex w-full flex-col">
        <label htmlFor="end" className="font-semibold">
          {translate("UP_TO_AND_INCLUDING")}
        </label>
        <input
          className="w-full rounded border border-neutral-700 px-3 py-1 text-sm"
          type="date"
          id="end"
          value={dateTo}
          min={projectConfig.initialDateFrom}
          max={projectConfig.initialDateTo}
          onChange={(event) => toDateChangeHandler(event)}
        />
      </div>
      <div>
        <ArrowPathIcon
          className="mt-7 h-5 w-5 cursor-pointer"
          onClick={resetClickHandler}
        />
      </div>
    </div>
  );
}
