import { ProjectName } from "../projects/projectConfigs";

export const getViteEnvVars = () => {
  const projectName = import.meta.env["VITE_PROJECT"] as ProjectName;
  const routerBasename = import.meta.env["VITE_ROUTER_BASENAME"] as string;
  const prodMode = import.meta.env.PROD;

  if (!projectName) {
    throw new Error("VITE_PROJECT environment variable not set in .env.");
  }

  if (!routerBasename) {
    throw new Error(
      "VITE_ROUTER_BASENAME environment variable not set in .env.",
    );
  }

  return { projectName, routerBasename, prodMode };
};
