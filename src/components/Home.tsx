import { ProjectConfig } from "../model/ProjectConfig";

interface HomeProps {
  project: string;
  config: ProjectConfig;
}

export default function Home(props: HomeProps) {
  return props.config.renderHome();
}
