import React from "react";
import { Search } from "../Search/Search";
import { republicConfig } from "./republic/config";

export const Projects = () => {
  const project = "republic";
  const config = republicConfig;

  return <Search project={project} projectConfig={config} />;
};
