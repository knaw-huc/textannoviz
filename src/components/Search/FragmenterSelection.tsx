import { translateSelector, useProjectStore } from "../../stores/project.ts";

interface FragmenterProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: number;
}

export const FragmenterSelection = (props: FragmenterProps) => {
  const translate = useProjectStore(translateSelector);

  return (
    <div className="flex items-center justify-between">
      <label className="mr-1 font-semibold">
        {translate("DISPLAY_CONTEXT")}{" "}
      </label>
      <select
        value={props.value}
        onChange={props.onChange}
        className="border-brand1Grey-700 rounded border bg-white px-2 py-1 text-sm"
      >
        <option value={100}>{translate("SNIPPET")}</option>
        <option value={1000}>{translate("PAGE_VIEW")}</option>
      </select>
    </div>
  );
};
