import { ArrowPathIcon } from "@heroicons/react/24/solid";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";

export function DateFacet(props: {
  dateTo: string;
  dateFrom: string;
  changeDates: (updates: { dateFrom: string; dateTo: string }) => void;
}) {
  const translate = useProjectStore(translateSelector);
  const projectConfig = useProjectStore(projectConfigSelector);

  const resetClickHandler = () => {
    const newDates = {
      dateFrom: projectConfig.initialDateFrom,
      dateTo: projectConfig.initialDateTo,
    };
    props.changeDates(newDates);
  };

  const datesOnChangeHandler = (update: string, type: string) => {
    if (type === "from") {
      const newDates = {
        dateFrom: update,
        dateTo: props.dateTo,
      };
      props.changeDates(newDates);
    }

    if (type === "to") {
      const newDates = {
        dateFrom: props.dateFrom,
        dateTo: update,
      };
      props.changeDates(newDates);
    }
  };

  return (
    <div className="flex w-full max-w-[450px] flex-col gap-4 lg:flex-row">
      <div className="flex w-full flex-col">
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
          onChange={(event) => datesOnChangeHandler(event.target.value, "from")}
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
          value={props.dateTo}
          min={projectConfig.initialDateFrom}
          max={projectConfig.initialDateTo}
          onChange={(event) => datesOnChangeHandler(event.target.value, "to")}
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
