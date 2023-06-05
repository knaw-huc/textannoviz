import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import React from "react";

type ToggleTextPanelsProps = {
  textPanelsCheckboxHandler: (event: CheckboxChangeEvent) => void;
  panels: string[];
};

export const ToggleTextPanels = (props: ToggleTextPanelsProps) => {
  const [show, setShow] = React.useState(false);

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
          <div className="toggleTextPanelCheckbox">
            <Checkbox
              inputId="panel1"
              name="textPanels"
              value="textNL"
              onChange={props.textPanelsCheckboxHandler}
              checked={props.panels.includes("textNL")}
            />
            <label className="toggleTextPanelCheckboxLabel" htmlFor="panel1">
              Originele tekst
            </label>
          </div>
          <div className="toggleTextPanelCheckbox">
            <Checkbox
              inputId="panel2"
              name="textPanels"
              value="textEN"
              onChange={props.textPanelsCheckboxHandler}
              checked={props.panels.includes("textEN")}
            />
            <label className="toggleTextPanelCheckboxLabel" htmlFor="panel2">
              Engelse vertaling
            </label>
          </div>
          <div className="toggleTextPanelCheckbox">
            <Checkbox
              inputId="panel3"
              name="textPanels"
              value="textNotes"
              onChange={props.textPanelsCheckboxHandler}
              checked={props.panels.includes("textNotes")}
            />
            <label className="toggleTextPanelCheckboxLabel" htmlFor="panel3">
              Notities
            </label>
          </div>
          <div className="toggleTextPanelCheckbox">
            <Checkbox
              inputId="panel4"
              name="textPanels"
              value="textFull"
              onChange={props.textPanelsCheckboxHandler}
              checked={props.panels.includes("textFull")}
            />
            <label className="toggleTextPanelCheckboxLabel" htmlFor="panel4">
              Volledige tekst
            </label>
          </div>
        </>
      )}
    </div>
  );
};
