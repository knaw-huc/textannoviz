import React from "react";
import CheckboxTree from "react-checkbox-tree";

const nodes = [
  {
    value: "landelijk",
    label: "Landelijk",
    children: [
      {
        value: "kerkelijk1",
        label: "Kerkelijk",
        children: [
          {
            value: "waalseSynode",
            label: "Waalse Synode",
          },
          {
            value: "synodenNederland",
            label: "Synoden in de verenigde Nederlanden",
          },
        ],
      },
      { value: "zakenWestFriesland", label: "Zaken van West-Friesland" },
    ],
  },
  {
    value: "binnenland",
    label: "Binnenland",
    children: [
      {
        value: "uniUtrecht",
        label: "Universiteit van Utrecht",
      },
      { value: "uniLeiden", label: "Universiteit Leiden" },
    ],
  },
  {
    value: "buitenland",
    label: "Buitenland",
    children: [
      {
        value: "uniLeuven",
        label: "Universiteit Leuven",
      },
    ],
  },
  {
    value: "synode",
    label: "Synode",
    children: [
      {
        value: "kerkelijk2",
        label: "Kerkelijk",
        children: [
          {
            value: "provinciaal",
            label: "Provinciaal",
            children: [
              {
                value: "synodeUtrecht",
                label: "Synode van Utrecht",
              },
            ],
          },
        ],
      },
    ],
  },
];

export function HierarchicalFacet() {
  const [checked, setChecked] = React.useState<string[]>([]);
  const [expanded, setExpanded] = React.useState<string[]>([]);

  console.log(`Checked: ${checked}`);
  console.log(`Expanded: ${expanded}`);

  return (
    <CheckboxTree
      nodes={nodes}
      checked={checked}
      expanded={expanded}
      onCheck={(newChecked) => setChecked(newChecked)}
      onExpand={(newExpanded) => setExpanded(newExpanded)}
      nativeCheckboxes
      checkModel="all"
      noCascade
      expandOnClick
      onClick={() => undefined}
    />
  );
}
