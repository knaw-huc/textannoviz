import { globaliseConfig } from "./globalise/config";
import { hooftConfig } from "./hooft/config";
import { mondriaanConfig } from "./mondriaan/config";
import { republicConfig } from "./republic/config";
import { surianoConfig } from "./suriano/config";
import { translatinConfig } from "./translatin/config";
import { vangoghConfig } from "./vangogh/config";

export const projectConfigs = {
  vangogh: vangoghConfig,
  hooft: hooftConfig,
  suriano: surianoConfig,
  translatin: translatinConfig,
  mondriaan: mondriaanConfig,
  globalise: globaliseConfig,
  republic: republicConfig,
};

export type ProjectName = keyof typeof projectConfigs;
