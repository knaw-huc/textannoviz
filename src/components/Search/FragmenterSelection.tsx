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
  headingId?: string;
}

export const FragmenterSelection = (props: FragmenterProps) => {
  const translate = useTranslate();
  const translateProject = useTranslateProject();
  const triggerId = React.useId();
  const [selectedKey, setSelectedKey] = React.useState<Key>(100);
  const helpText = translateProject("SHOW_CONTEXT_HELP");

  const options = [
    { name: translate("SMALL"), value: 50 },
    { name: translate("MEDIUM"), value: 100 },
    { name: translate("LARGE"), value: 500 },
  ];

  function selectChangeHandler(key: Key | null) {
    if (key == null) {
      return;
    }
    setSelectedKey(key);
    props.onChange(key);
  }

  return (
    <>
      {helpText ? (
        <label htmlFor={triggerId} className="text-sm text-neutral-600">
          {helpText}
        </label>
      ) : null}
      <SelectComponent
        hideLabel
        triggerId={triggerId}
        aria-labelledby={helpText ? undefined : props.headingId}
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
    </>
  );
};
