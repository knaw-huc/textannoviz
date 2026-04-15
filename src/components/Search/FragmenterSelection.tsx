import React from "react";
import type { Key } from "react-aria-components";
import {
  SelectComponent,
  SelectItemComponent,
} from "../common/SelectComponent.tsx";
import { useTranslate, useTranslateProject } from "../../stores/project.ts";

interface FragmenterProps {
  onChange: (key: Key) => void;
  value: number;
}

export const FragmenterSelection = (props: FragmenterProps) => {
  const translate = useTranslate();
  const translateProject = useTranslateProject();
  const [selectedKey, setSelectedKey] = React.useState<Key>(100);

  const options = [
    { name: translate("SMALL"), value: 50 },
    { name: translate("MEDIUM"), value: 100 },
    { name: translate("LARGE"), value: 500 },
  ];

  function selectChangeHandler(key: Key) {
    setSelectedKey(key);
    props.onChange(key);
  }

  return (
    <SelectComponent
      label={translate("DISPLAY_CONTEXT")}
      helpLabel={translateProject("SHOW_CONTEXT_HELP")}
      items={options}
      selectedKey={selectedKey}
      onSelectionChange={selectChangeHandler}
    >
      {(item) => (
        <SelectItemComponent id={item.value} textValue={item.name}>
          {item.name}
        </SelectItemComponent>
      )}
    </SelectComponent>
  );
};
