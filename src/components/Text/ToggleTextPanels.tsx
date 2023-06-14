import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import React from "react";
import { useTextStore } from "../../stores/text";

type ToggleTextPanelsProps = {
  textPanelsCheckboxHandler: (event: CheckboxChangeEvent) => void;
  panels: string[];
};

export const ToggleTextPanels = (props: ToggleTextPanelsProps) => {
  const [show, setShow] = React.useState(false);
  const views = useTextStore((state) => state.views);

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
              disabled={views && !("textOrig" in views)}
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
              disabled={views && !("textTrans" in views)}
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
              disabled={views && !("notesEN" in views)}
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
              disabled={views && !("textFull" in views)}
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
              disabled={views && !("title" in views)}
            />
            <label className="toggleTextPanelCheckboxLabel" htmlFor="panel5">
              Titel
            </label>
          </div>
          <div className="toggleTextPanelCheckbox">
            <Checkbox
              inputId="panel6"
              name="textPanels"
              value="postalData"
              onChange={props.textPanelsCheckboxHandler}
              checked={props.panels.includes("postalData")}
              disabled={views && !("postalData" in views)}
            />
            <label className="toggleTextPanelCheckboxLabel" htmlFor="panel6">
              Postal data
            </label>
          </div>
        </>
      )}
    </div>
  );
};
