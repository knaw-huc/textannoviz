import {projectConfigSelector, translateSelector, useProjectStore} from "../../stores/project.ts";

export function DateFacet(props: {
  dateTo: string;
  dateFrom: string;
  changeDateFrom: (value: string) => void;
  changeDateTo: (value: string) => void;
}) {
  const translate = useProjectStore(translateSelector);
  const projectConfig = useProjectStore(projectConfigSelector);

  return <div
      className="flex w-full max-w-[450px] flex-col gap-4 lg:flex-row"
  >
    <div className="flex w-full flex-col">
      <label htmlFor="start" className="font-semibold">
        {translate("FROM")}
      </label>
      <input
          className="w-full rounded border border-neutral-700 px-3 py-1 text-sm"
          type="date"
          id="start"
          value={props.dateFrom}
          min={projectConfig.initialDateFrom}
          max={projectConfig.initialDateTo}
          onChange={(event) => props.changeDateFrom(event.target.value)}
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
          onChange={(event) => props.changeDateTo(event.target.value)}
      />
    </div>
  </div>
}