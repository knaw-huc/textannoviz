import { toEntityCategory } from "../../../components/Text/Annotated/utils/createAnnotationClasses";
import { AnnoRepoBodyBase } from "../../../model/AnnoRepoAnnotation";
import { ProjectConfig } from "../../../model/ProjectConfig";
import { SearchQuery } from "../../../model/Search";
import { encodeObject } from "../../../utils/UrlParamUtils";
import {
  entityCategoryToAgg,
  isEntity,
  isPersonEntity,
} from "./ProjectAnnotationModel";

export function toEntitySearchQuery(
  anno: AnnoRepoBodyBase,
  projectConfig: ProjectConfig,
): string {
  if (isEntity(anno) && isPersonEntity(anno.metadata.ref)) {
    return createSearchQueryParam(
      toEntityTerms(
        anno.metadata["tei:type"],
        anno.metadata.ref[0].sortLabel,
        projectConfig,
      ),
    );
  } else {
    throw new Error("Unknown entity " + JSON.stringify(anno));
  }
}

function toEntityTerms(
  annoCategory: string,
  searchString: string,
  projectConfig: ProjectConfig,
): Partial<SearchQuery> {
  const entityAgg =
    entityCategoryToAgg[toEntityCategory(projectConfig, annoCategory)];

  return {
    terms: {
      [entityAgg]: [searchString],
    },
  };
}

function createSearchQueryParam(queryWithEntity: Partial<SearchQuery>): string {
  return encodeObject({ query: queryWithEntity });
}
