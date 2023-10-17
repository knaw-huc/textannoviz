import { ProjectConfig } from "../model/ProjectConfig";

interface AboutProps {
  project: string;
  config: ProjectConfig;
}

export default function About(props: AboutProps) {
  return props.config.renderAbout();
}
