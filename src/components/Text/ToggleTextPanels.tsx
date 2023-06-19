import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import React from "react";
import { useProjectStore } from "../../stores/project";
import { useTextStore } from "../../stores/text";

type ToggleTextPanelsProps = {
  textPanelsCheckboxHandler: (event: CheckboxChangeEvent) => void;
  panels: string[];
};

export const ToggleTextPanels = (props: ToggleTextPanelsProps) => {
  const [show, setShow] = React.useState(false);
  const views = useTextStore((state) => state.views);
  const projectConfig = useProjectStore((state) => state.projectConfig);

  return (
    <div className="toggleTextPanelsContainer">
      <Button
        size="small"
        label="Add/remove text panels"
        onClick={() => setShow(!show)}
        raised
      />
      {show && (
        <>
          {projectConfig?.allPossibleTextPanels?.map((panel, index) =>
            views && panel in views ? (
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
            ) : null
          )}
        </>
      )}
    </div>
  );
};
