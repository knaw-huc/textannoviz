import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import React from "react";
import {projectConfigSelector, useProjectStore} from "../../stores/project";
import { useTextStore } from "../../stores/text";

type ToggleTextPanelsProps = {
  textPanelsCheckboxHandler: (event: CheckboxChangeEvent) => void;
  panels: string[];
};

export const ToggleTextPanels = (props: ToggleTextPanelsProps) => {
  const [show, setShow] = React.useState(false);
  const views = useTextStore((state) => state.views);
  const projectConfig = useProjectStore(projectConfigSelector);

  function renderCheckboxes() {
    if (views) {
      return projectConfig.allPossibleTextPanels?.map((panel, index) => {
        return panel in views ? (
          <div key={index} className="toggleTextPanelCheckbox">
            <Checkbox
              inputId={`panel-${index}`}
              name="textPanels"
              value={panel}
              onChange={props.textPanelsCheckboxHandler}
              checked={props.panels.includes(panel)}
            />
            <label
              className="toggleTextPanelCheckboxLabel"
              htmlFor={`panel-${index}`}
            >
              {projectConfig &&
                projectConfig.textPanelTitles &&
                projectConfig.textPanelTitles[panel]}
            </label>
          </div>
        ) : null;
      });
    } else {
      return projectConfig.allPossibleTextPanels?.map((panel, index) => {
        return (
          <div key={index} className="toggleTextPanelCheckbox">
            <Checkbox
              inputId={`panel-${index}`}
              name="textPanels"
              value={panel}
              onChange={props.textPanelsCheckboxHandler}
              checked={props.panels.includes(panel)}
            />
            <label
              className="toggleTextPanelCheckboxLabel"
              htmlFor={`panel-${index}`}
            >
              {projectConfig &&
                projectConfig.textPanelTitles &&
                projectConfig.textPanelTitles[panel]}
            </label>
          </div>
        );
      });
    }
  }

  return (
    <div className="toggleTextPanelsContainer">
      <PlusCircleIcon
        className="text-brand1-500 hover:text-brand1-600 active:text-brand1-700 h-8 w-8 cursor-pointer"
        onClick={() => setShow(!show)}
      />
      {show && <>{renderCheckboxes()}</>}
    </div>
  );
};
