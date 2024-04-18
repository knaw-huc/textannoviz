import React from "react";
import type { Key } from "react-aria-components";
import { translateSelector, useProjectStore } from "../../stores/project.ts";
import {
  SelectComponent,
  SelectItemComponent,
} from "../common/SelectComponent.tsx";

interface FragmenterProps {
  onChange: (key: Key) => void;
  value: number;
}

export const FragmenterSelection = (props: FragmenterProps) => {
  const translate = useProjectStore(translateSelector);
  const [selectedKey, setSelectedKey] = React.useState<Key>(100);

  const options = [
    { name: "Small", value: 50 },
    { name: "Medium", value: 100 },
    { name: "Large", value: 500 },
  ];

  function selectChangeHandler(key: Key) {
    setSelectedKey(key);
    props.onChange(key);
  }

  return (
    <SelectComponent
      label={translate("DISPLAY_CONTEXT")}
      items={options}
      selectedKey={selectedKey}
      onSelectionChange={selectChangeHandler}
    >
      {(item) => (
        <SelectItemComponent id={item.value}>{item.name}</SelectItemComponent>
      )}
    </SelectComponent>
  );
};
