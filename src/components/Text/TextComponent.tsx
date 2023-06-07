import { CheckboxChangeEvent } from "primereact/checkbox";
import React from "react";
import { useTextStore } from "../../stores/text";
import { TextPanels } from "./TextPanels";
import { ToggleTextPanels } from "./ToggleTextPanels";

type TextComponentProps = {
  panels: string[];
};

export type Text = {
  views: Record<string, string[]>;
};

export const TextComponent = (props: TextComponentProps) => {
  const [panels, setPanels] = React.useState(props.panels);
  const textBroccoli = useTextStore((state) => state.text);

  const text: any = {
    views: {
      textNL: [
        "Beste ",
        "Zus",
        ",",
        "\n",
        "",
        "kom ",
        "je ",
        "morgenavond ",
        "(",
        "Woensdag",
        ") ",
        "om ",
        "kwart ",
        "voor ",
        "acht ",
        "ingang ",
        "kleine ",
        "zaal ",
        "Concertgebouw",
        "",
        ", ",
        " ",
        "dan ",
        "heb ",
        "ik ",
        "een ",
        "plaats ",
        "voor ",
        "v ",
        "",
        ". ",
        " ",
        "Bu",
        "l",
        "h",
        "lig ",
        "voor ",
        "je",
        ".",
        "",
        "En ",
        "dan ",
        "kunnen ",
        "we ",
        "een ",
        "andere ",
        "dan ",
        "Donderdagmiddag ",
        "afspreken ",
        "want ",
        "dan ",
        "kan ",
        "ik ",
        "niet ",
        "goed",
        ".",
        "\n",
        "Met ",
        "vele ",
        "beste ",
        "groeten ",
        "je ",
        "Piet",
        ".",
        "\n",
      ],
      textEN: [
        "Dear ",
        "Zus",
        ",",
        "",
        "\n",
        "",
        "If ",
        "you ",
        "come ",
        "to ",
        "the ",
        "entrance ",
        "to ",
        "the ",
        "small ",
        "auditorium ",
        "in ",
        "the ",
        "Concertgebouw ",
        "at ",
        "a ",
        "quarter ",
        "to ",
        "eight ",
        "tomorrow ",
        "(",
        "Wednesday",
        ") ",
        "evening",
        ", ",
        "I ",
        "have ",
        "a ",
        "ticket ",
        "for ",
        "van ",
        "Buhlig ",
        "for ",
        "you",
        ".",
        "",
        "And ",
        "then ",
        "we ",
        "can ",
        "arrange ",
        "a ",
        "time ",
        "other ",
        "than ",
        "Thursday ",
        "afternoon ",
        "because ",
        "I ",
        "ca",
        "n’t ",
        "manage ",
        "that",
        ".",
        "\n",
        "With ",
        "my ",
        "very ",
        "best ",
        "wishes",
        ", ",
        "your ",
        "Piet",
        ".",
        "\n",
      ],
      textNotes: [
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui.",
      ],
      textFull: textBroccoli,
    },
  };

  function textPanelsCheckboxHandler(event: CheckboxChangeEvent) {
    const checkedTextPanels = [...panels];

    if (event.checked) {
      checkedTextPanels.push(event.value);
    } else {
      checkedTextPanels.splice(checkedTextPanels.indexOf(event.value), 1);
    }

    setPanels(checkedTextPanels);
  }

  function closePanelHandler(panelToClose: string) {
    setPanels(panels.filter((panel) => panel !== panelToClose));
  }

  return (
    <div className="textContainer">
      <ToggleTextPanels
        textPanelsCheckboxHandler={textPanelsCheckboxHandler}
        panels={panels}
      />
      <div className="textPanelsContainer">
        <TextPanels
          panels={panels}
          text={text}
          closePanelHandler={closePanelHandler}
        />
      </div>
    </div>
  );
};
