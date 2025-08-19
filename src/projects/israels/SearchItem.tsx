import { Link } from "react-router-dom";
import { IsraelsSearchResultsBody } from "../../model/Search.ts";

import _ from "lodash";
import { QUERY } from "../../components/Search/SearchUrlParams.ts";
import { SearchItemProps } from "../../model/SearchItemProps.ts";
import { encodeObject } from "../../utils/UrlParamUtils.ts";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";

export const SearchItem = (
  props: SearchItemProps<IsraelsSearchResultsBody>,
) => {
  const translateProject = useProjectStore(translateProjectSelector);
  const interfaceLang = useProjectStore((s) => s.interfaceLanguage);

  const letterNumRegex = /\d+/g;
  const letterNum = props.result.file.match(letterNumRegex);

  let searchItemTitle: string;
  if (props.result.type === "letter") {
    searchItemTitle =
      interfaceLang === "nl" ? props.result.titleNL : props.result.titleEN;
  } else if (props.result.type === "intro") {
    searchItemTitle = translateProject("intro");
  } else {
    searchItemTitle = translateProject("UNKNOWN");
  }

  const queryUrlParam = encodeObject(_.pick(props.query, "fullText"));
  return (
    <ul className="border-brand1Grey-200 mb-4 border-b">
      <li className="divide-brand1Grey-100 border-brand1Grey-50 hover:divide-brand1Grey-200 hover:border-brand1Grey-200 mb-6 w-full divide-y divide-solid rounded border bg-white shadow-sm transition hover:bg-white">
        <Link
          to={`/detail/${props.result._id}?${QUERY}=${queryUrlParam}`}
          className="hover:text-brand1-600 active:text-brand1-700 cursor-pointer text-inherit no-underline"
        >
          <div className="flex flex-col p-4">
            <div className="font-semibold">{searchItemTitle}</div>
            {props.result.type === "letter" ? (
              <div className="text-brand1Grey-600 italic">
                {translateProject("LET_NUM")}: {letterNum}
              </div>
            ) : null}
          </div>
        </Link>
        {props.result._hits
          ? Object.entries(props.result._hits).map(([viewType, hits]) => {
              return (
                <div key={viewType} className="w-full p-4">
                  <div className="mb-1 font-semibold">
                    {translateProject(viewType)}:
                  </div>
                  <ul className="ml-4 list-disc">
                    {hits.map((hit, index) => (
                      <li
                        className="mb-1 ml-4 list-disc font-serif text-base"
                        dangerouslySetInnerHTML={{ __html: hit }}
                        key={index}
                      />
                    ))}
                  </ul>
                </div>
              );
            })
          : null}
      </li>
    </ul>
  );
};
