import { ProjectConfig } from "../model/ProjectConfig";

interface HelpProps {
  project: string;
  config: ProjectConfig;
}

export default function Help(props: HelpProps) {
  return props.config.renderHome();
}
