import { toEntityCategory } from "../../../components/Text/Annotated/utils/createAnnotationClasses";
import { AnnoRepoBodyBase } from "../../../model/AnnoRepoAnnotation";
import { LanguageCode } from "../../../model/Language";
import { ProjectConfig } from "../../../model/ProjectConfig";
import { SearchQuery } from "../../../model/Search";
import { encodeObject } from "../../../utils/UrlParamUtils";
import {
  entityCategoryToAgg,
  isArtwork,
  isPerson,
} from "./ProjectAnnotationModel";

export function toEntitySearchQuery(
  anno: AnnoRepoBodyBase,
  projectConfig: ProjectConfig,
  interfaceLang: LanguageCode,
): string {
  if (isPerson(anno)) {
    return createSearchQueryParam(
      toEntityTerms(
        anno["tei:type"],
        anno["tei:ref"].sortLabel,
        projectConfig,
        interfaceLang,
      ),
    );
  } else if (isArtwork(anno)) {
    return createSearchQueryParam(
      toEntityTerms(
        anno["tei:type"],
        anno["tei:ref"].head.text,
        projectConfig,
        interfaceLang,
      ),
    );
  } else {
    throw new Error("Unknown entity: " + JSON.stringify(anno));
  }
}

function toEntityTerms(
  annoCategory: string,
  searchString: string,
  projectConfig: ProjectConfig,
  interfaceLang: LanguageCode,
): Partial<SearchQuery> {
  const entityAgg =
    entityCategoryToAgg[toEntityCategory(projectConfig, annoCategory)];

  if (annoCategory === "artwork") {
    return {
      terms: {
        [`${entityAgg}${interfaceLang.toUpperCase()}`]: [searchString],
      },
    };
  } else {
    return {
      terms: {
        [entityAgg]: [searchString],
      },
    };
  }
}

function createSearchQueryParam(queryWithEntity: Partial<SearchQuery>): string {
  return encodeObject({ query: queryWithEntity });
}
