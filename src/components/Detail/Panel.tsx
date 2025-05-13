type PanelProps = {
  tabsToRender: {
    title: string;
    content: JSX.Element;
  };
  panelName: string;
};

export const Panel = (props: PanelProps) => {
  return <div id={props.panelName}>{props.tabsToRender.content}</div>;
};
