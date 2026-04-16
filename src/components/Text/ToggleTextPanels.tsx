import { PlusCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import { ProjectConfig } from "../../model/ProjectConfig";
import {
  projectConfigSelector,
  useTranslateProject,
  useProjectStore,
} from "../../stores/project";
import { useTextStore } from "../../stores/text/text-store.ts";
import { Checkbox } from "react-aria-components";

type ToggleTextPanelsProps = {
  onChange: (panel: string, checked: boolean) => void;
  panels: string[];
};

type CheckboxListProps = ToggleTextPanelsProps & {
  translateProject: (key: string) => string;
  viewsInData: string[];
  projectConfig: ProjectConfig;
};

const CheckboxList = React.memo((props: CheckboxListProps) => (
  <>
    {props.viewsInData.map((panel) => (
      <div key={panel} className="toggleTextPanelCheckbox">
        <Checkbox
          id={`panel-${panel}`}
          name="textPanels"
          value={panel}
          isSelected={props.panels.includes(panel)}
          onChange={(isSelected) => props.onChange(panel, isSelected)}
        >
          {props.translateProject(panel)}
        </Checkbox>
        <label
          className="toggleTextPanelCheckboxLabel"
          htmlFor={`panel-${panel}`}
        >
          {props.translateProject(panel)}
        </label>
      </div>
    ))}
  </>
));

CheckboxList.displayName = "CheckboxList";

export const ToggleTextPanels = (props: ToggleTextPanelsProps) => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useTranslateProject();

  const [show, setShow] = React.useState(false);
  const views = useTextStore((state) => state.views);
  const viewsInData = Object.keys(views!).map((view) => view);
  const filteredViewsInData = viewsInData.filter((viewInData) =>
    projectConfig.allPossibleTextPanels.includes(viewInData),
  );

  return (
    <div className="toggleTextPanelsContainer">
      <PlusCircleIcon
        className="text-brand1-500 hover:text-brand1-600 active:text-brand1-700 h-8 w-8 cursor-pointer"
        onClick={() => setShow(!show)}
      />
      {show && views && (
        <CheckboxList
          panels={props.panels}
          onChange={props.onChange}
          projectConfig={projectConfig}
          translateProject={translateProject}
          viewsInData={filteredViewsInData}
        />
      )}
    </div>
  );
};
