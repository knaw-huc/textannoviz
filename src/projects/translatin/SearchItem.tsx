import { Link } from "react-router-dom";
import { TranslatinSearchResultsBody } from "../../model/Search.ts";

import { SearchItemProps } from "../../model/SearchItemProps.ts";
import { useDetailUrl } from "../../components/Text/Annotated/utils/useDetailUrl.tsx";

export const SearchItem = (
  props: SearchItemProps<TranslatinSearchResultsBody>,
) => {
  const { getDetailUrl } = useDetailUrl();
  return (
    <ul className="border-brand1Grey-200 mb-4 border-b">
      <li className="mb-3 text-base">
        <strong>{`${props.result.earliest} - ${props.result.latest}`}</strong>
      </li>
      <Link
        to={getDetailUrl(props.result._id, props.query.fullText)}
        className="hover:text-brand1-600 active:text-brand1-700 text-inherit no-underline"
      >
        <li className="divide-brand1Grey-100 border-brand1Grey-50 hover:divide-brand1Grey-200 hover:border-brand1Grey-200 mb-6 w-full cursor-pointer divide-y divide-solid rounded border bg-white shadow-sm transition hover:bg-white">
          <div className="p-4 font-semibold">
            {`${props.result.latinTitle} (${props.result.manifestation})`}
          </div>
          {props.result._hits?.text.map((hit, index) => (
            <div key={index} className="hover:bg-brand1Grey-50 w-full p-4">
              <div
                className="mb-1 font-serif text-base"
                dangerouslySetInnerHTML={{ __html: hit }}
              />
            </div>
          ))}
        </li>
      </Link>
    </ul>
  );
};
