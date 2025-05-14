type PanelProps = {
  panelToRender: {
    content: JSX.Element;
  };
  panelName: string;
};

export const Panel = (props: PanelProps) => {
  return <div id={props.panelName}>{props.panelToRender.content}</div>;
};
