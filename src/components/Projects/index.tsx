import React from "react";
import { Detail } from "../../Detail";
import { republicConfig } from "./republic/config";

export const Projects = () => {
  const project = "republic";
  const config = republicConfig;

  return <Detail project={project} config={config} />;
};
