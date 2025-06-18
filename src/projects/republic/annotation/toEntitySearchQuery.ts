import { AnnoRepoBodyBase } from "../../../model/AnnoRepoAnnotation.ts";
import { skipEmptyValues } from "../../../utils/skipEmptyValues.ts";
import { Base64 } from "js-base64";
import {
  entityCategoryToAgg,
  isDateEntity,
  isEntityEntity,
} from "./ProjectAnnotationModel.ts";
import { QUERY } from "../../../components/Search/SearchUrlParams.ts";
import { SearchQuery } from "../../../model/Search.ts";
import { toEntityCategory } from "../../../components/Text/Annotated/utils/createAnnotationClasses.ts";
import { ProjectConfig } from "../../../model/ProjectConfig.ts";

export function toEntitySearchQuery(
  anno: AnnoRepoBodyBase,
  projectConfig: ProjectConfig,
): URLSearchParams {
  if (isDateEntity(anno)) {
    return createSearchQueryParam(toDateEntityQueryParams(anno.metadata.date));
  } else if (isEntityEntity(anno)) {
    return createSearchQueryParam(
      toEntityTerms(
        anno.metadata.category,
        anno.metadata.name,
        anno.metadata.entityID,
        projectConfig,
      ),
    );
  } else {
    throw new Error("Unknown entity " + JSON.stringify(anno));
  }
}

function toDateEntityQueryParams(date: string): Partial<SearchQuery> {
  const queryWithDate = {} as Partial<SearchQuery>;
  queryWithDate.dateFrom = date;
  queryWithDate.dateTo = date;
  return queryWithDate;
}

function toEntityTerms(
  annoCategory: string,
  name: string,
  id: string,
  projectConfig: ProjectConfig,
): Partial<SearchQuery> {
  const entityAgg =
    entityCategoryToAgg[toEntityCategory(projectConfig, annoCategory)];

  if (!annoCategory) {
    throw new Error("Unknown entity category " + annoCategory);
  }

  return {
    terms: {
      [`${entityAgg}Name`]: [name],
      [`${entityAgg}Id`]: [id],
    },
  };
}

function createSearchQueryParam(queryWithEntity: Partial<SearchQuery>) {
  const params = new URLSearchParams();
  params.set(
    QUERY,
    Base64.encode(JSON.stringify(queryWithEntity, skipEmptyValues)),
  );
  return params;
}
