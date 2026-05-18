import { Link } from "react-router";
import _ from "lodash";
import { QUERY } from "../../components/Search/SearchUrlParams.ts";
import { SearchItemProps } from "../../model/SearchItemProps.ts";
import { encodeObject } from "../../utils/url/UrlParamUtils.ts";
import {
  IsraelsSearchResultsBody,
  VanGoghSearchResultsBody,
} from "../../model/Search.ts";
import { useTranslateProject } from "../../stores/project.ts";

type KunstenaarsbrievenSearchItemProps = SearchItemProps<
  IsraelsSearchResultsBody | VanGoghSearchResultsBody
> & {
  searchItemTitle: string;
};

export const SearchItem = (props: KunstenaarsbrievenSearchItemProps) => {
  const translateProject = useTranslateProject();

  const letterNum = props.result.file;

  const queryUrlParam = encodeObject(_.pick(props.query, "fullText"));
  return (
    <li className="my-4 flex flex-col border-b border-neutral-400 pb-4">
      <Link
        to={`/detail/${props.result._id}?${QUERY}=${queryUrlParam}`}
        className="group/card hover:border-300 rounded border-b bg-white text-neutral-900 no-underline shadow-sm"
      >
        <div className="flex flex-col p-4">
          <div className="font-semibold">{props.searchItemTitle}</div>
          {props.result.type === "letter" ? (
            <div className="italic text-neutral-600">
              {translateProject("LET_NUM")}: {letterNum}
            </div>
          ) : null}
        </div>

        {props.result._hits
          ? Object.entries(props.result._hits).map(([viewType, hits]) => {
              return (
                <div
                  key={viewType}
                  className="w-full border-t border-neutral-200 p-4 transition group-hover/card:border-neutral-400 group-hover/card:text-neutral-900"
                >
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
      </Link>
    </li>
  );
};
