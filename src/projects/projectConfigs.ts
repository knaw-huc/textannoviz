import { vangoghConfig } from "./vangogh/config";
import { hooftConfig } from "./hooft/config";
import { surianoConfig } from "./suriano/config";
import { translatinConfig } from "./translatin/config";
import { globaliseConfig } from "./globalise/config";
import { republicConfig } from "./republic/config";
import { israelsConfig } from "./israels/config";
import { brederodeConfig } from "./brederode/config";
import { oratiesConfig } from "./oraties/config";
import { mondrianConfig } from "./mondrian/config";
import { nvvConfig } from "./nvv/config";

export const projectConfigs = {
  vangogh: vangoghConfig,
  hooft: hooftConfig,
  suriano: surianoConfig,
  translatin: translatinConfig,
  mondrian: mondrianConfig,
  globalise: globaliseConfig,
  republic: republicConfig,
  israels: israelsConfig,
  brederode: brederodeConfig,
  oraties: oratiesConfig,
  nvv: nvvConfig,
};

export type ProjectName = keyof typeof projectConfigs;
