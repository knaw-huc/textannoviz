import { PlusCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import { ProjectConfig } from "../../model/ProjectConfig";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { useTextStore } from "../../stores/text";
import { CheckboxComponent } from "../common/CheckboxGroupComponent.tsx";

type ToggleTextPanelsProps = {
  textPanelsCheckboxHandler: (event: CheckboxChangeEvent) => void;
  panels: string[];
};

type CheckboxListProps = ToggleTextPanelsProps & {
  translateProject: (key: string) => string;
  viewsInData: string[];
  projectConfig: ProjectConfig;
};

const CheckboxList = React.memo((props: CheckboxListProps) => (
  <>
    {props.viewsInData.map((panel) => {
      const isSelected = props.panels.includes(panel);
      return (
        <div key={panel} className="toggleTextPanelCheckbox">
          <CheckboxComponent
            id={`panel-${panel}`}
            name="textPanels"
            value={panel}
            onChange={() =>
              props.textPanelsCheckboxHandler({
                value: panel,
                checked: !isSelected,
              })
            }
            isSelected={isSelected}
          />
          <label
            className="toggleTextPanelCheckboxLabel"
            htmlFor={`panel-${panel}`}
          >
            {props.translateProject(panel)}
          </label>
        </div>
      );
    })}
  </>
));

export type CheckboxChangeEvent = {
  checked: boolean;
  value: string;
};

CheckboxList.displayName = "CheckboxList";

export const ToggleTextPanels = (props: ToggleTextPanelsProps) => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);

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
          textPanelsCheckboxHandler={props.textPanelsCheckboxHandler}
          projectConfig={projectConfig}
          translateProject={translateProject}
          viewsInData={filteredViewsInData}
        />
      )}
    </div>
  );
};
