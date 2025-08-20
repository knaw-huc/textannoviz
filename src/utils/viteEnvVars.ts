import { ProjectName } from "../projects/projectConfigs";

export const getViteEnvVars = () => {
  const projectName = import.meta.env["VITE_PROJECT"] as ProjectName;
  const routerBasename = import.meta.env["VITE_ROUTER_BASENAME"] as string;
  const prodMode = import.meta.env.PROD;
  const mode = import.meta.env.MODE;
  const israelsPersonsUrl = import.meta.env.VITE_ISRAELS_PERSONS_URL;
  const israelsArtworksUrl = import.meta.env.VITE_ISRAELS_ARTWORKS_URL;
  const israelsBiblENUrl = import.meta.env.VITE_ISRAELS_BIBL_EN_URL;
  const israelsBiblNLUrl = import.meta.env.VITE_ISRAELS_BIBL_NL_URL;

  if (!projectName) {
    throw new Error("VITE_PROJECT environment variable not set in .env.");
  }

  if (!routerBasename) {
    throw new Error(
      "VITE_ROUTER_BASENAME environment variable not set in .env.",
    );
  }

  if (!israelsPersonsUrl) {
    throw new Error(
      "VITE_ISRAELS_PERSONS_URL environment variable not set in .env.development, .env.staging or .env.production",
    );
  }

  if (!israelsArtworksUrl) {
    throw new Error(
      "VITE_ISRAELS_ARTWORKS_URL environment variable not set in .env.development, .env.staging or .env.production",
    );
  }

  if (!israelsBiblENUrl) {
    throw new Error(
      "VITE_ISRAELS_BIBL_EN_URL environment variable not set in .env.development, .env.staging or .env.production",
    );
  }

  if (!israelsBiblNLUrl) {
    throw new Error(
      "VITE_ISRAELS_BIBL_NL_URL environment variable not set in .env.development, .env.staging or .env.production",
    );
  }

  return {
    projectName,
    routerBasename,
    prodMode,
    mode,
    israelsPersonsUrl,
    israelsArtworksUrl,
    israelsBiblENUrl,
    israelsBiblNLUrl,
  };
};
