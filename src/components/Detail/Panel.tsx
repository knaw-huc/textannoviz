type PanelProps = {
  panelToRender: {
    title: string;
    content: JSX.Element;
  };
  panelName: string;
};

export const Panel = (props: PanelProps) => {
  return <>{props.panelToRender.content}</>;
};
