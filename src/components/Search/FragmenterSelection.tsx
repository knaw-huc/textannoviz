import type { Key } from "react-aria-components";
import {
  translateProjectSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { SelectComponentAlt } from "../common/SelectComponentAlt.tsx";

interface FragmenterProps {
  onChange: (key: Key) => void;
  value: number;
}

export const FragmenterSelection = (props: FragmenterProps) => {
  const translate = useProjectStore(translateSelector);
  const translateProject = useProjectStore(translateProjectSelector);

  const options = [
    { name: translate("SMALL"), value: 50 },
    { name: translate("MEDIUM"), value: 100 },
    { name: translate("LARGE"), value: 500 },
  ];

  function selectChangeHandler(value: string | number) {
    const key = typeof value === "number" ? value : Number(value);
    props.onChange(key);
  }

  return (
    <SelectComponentAlt
      label={translate("DISPLAY_CONTEXT")}
      helpLabel={translateProject("SHOW_CONTEXT_HELP")}
      options={options}
      value={props.value}
      onChange={selectChangeHandler}
    />
  );
};
