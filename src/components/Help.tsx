import { ProjectConfig } from "../model/ProjectConfig";

type HelpProps = {
  project: string;
  config: ProjectConfig;
};

export default function Help(props: HelpProps) {
  return <props.config.components.Help />;
}
