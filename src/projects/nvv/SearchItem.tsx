import { NVVSearchResultsBody } from "../../model/Search.ts";
import { SearchItemProps } from "../../model/SearchItemProps.ts";
import { useDetailNavigation } from "../../components/Detail/useDetailNavigation.tsx";
import { Link } from "react-router";

export const SearchItem = (props: SearchItemProps<NVVSearchResultsBody>) => {
  const { createDetailUrl } = useDetailNavigation();

  return (
    <li className="divide-brand1Grey-100 border-brand1Grey-200 border-brand1Grey-50 hover:divide-brand1Grey-200 hover:border-brand1Grey-200 mb-4 mb-6 w-full cursor-pointer divide-y divide-solid rounded border border-b bg-white shadow-sm transition hover:bg-white">
      <Link
        to={createDetailUrl(props.result._id)}
        className="hover:text-brand1-600 active:text-brand1-700 text-inherit no-underline"
      >
        <div className="p-4 font-semibold">
          <div className="italic text-neutral-600">
            Vergaderstuk {props.result.file}
          </div>
          {props.result.title}
          <br />
        </div>
        {props.result._hits
          ? Object.entries(props.result._hits).map(([viewType, hits]) => {
              return (
                <div
                  key={viewType}
                  className="w-full border-t border-neutral-200 p-4 transition group-hover/card:border-neutral-400 group-hover/card:text-neutral-900"
                >
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
