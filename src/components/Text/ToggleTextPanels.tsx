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
              value="textOrig"
              onChange={props.textPanelsCheckboxHandler}
              checked={props.panels.includes("textOrig")}
            />
            <label className="toggleTextPanelCheckboxLabel" htmlFor="panel1">
              Originele tekst
            </label>
          </div>
          <div className="toggleTextPanelCheckbox">
            <Checkbox
              inputId="panel2"
              name="textPanels"
              value="textTrans"
              onChange={props.textPanelsCheckboxHandler}
              checked={props.panels.includes("textTrans")}
            />
            <label className="toggleTextPanelCheckboxLabel" htmlFor="panel2">
              Vertaling
            </label>
          </div>
          <div className="toggleTextPanelCheckbox">
            <Checkbox
              inputId="panel3"
              name="textPanels"
              value="notesEN"
              onChange={props.textPanelsCheckboxHandler}
              checked={props.panels.includes("notesEN")}
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
          <div className="toggleTextPanelCheckbox">
            <Checkbox
              inputId="panel5"
              name="textPanels"
              value="title"
              onChange={props.textPanelsCheckboxHandler}
              checked={props.panels.includes("title")}
            />
            <label className="toggleTextPanelCheckboxLabel" htmlFor="panel5">
              Titel
            </label>
          </div>
        </>
      )}
    </div>
  );
};
