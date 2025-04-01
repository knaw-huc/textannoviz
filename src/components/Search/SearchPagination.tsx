import React from "react";
import { Button } from "react-aria-components";

import { SearchResult } from "../../model/Search";
import { translateSelector, useProjectStore } from "../../stores/project.ts";
import { usePagination } from "../../utils/usePagination.tsx";
import { TextFieldComponent } from "../common/TextFieldComponent.tsx";

type SearchPaginationProps = {
  onPrevPageClick: () => void;
  onNextPageClick: () => void;
  onJumpToPage: (page: number) => void;
  pageNumber: number;
  searchResult: SearchResult;
  elasticSize: number;
};

export const SearchPagination = (props: SearchPaginationProps) => {
  const translate = useProjectStore(translateSelector);
  const { hasNextPage, hasPrevPage } = usePagination();
  const [pageNumber, setPageNumber] = React.useState<string>(
    props.pageNumber.toString(),
  );

  //Keep state in sync with prop
  React.useEffect(() => {
    setPageNumber(props.pageNumber.toString());
  }, [props.pageNumber]);

  function pageNumberInputChangeHandler(newValue: string) {
    setPageNumber(newValue);
  }

  function pageNumberInputKeyUpHandler(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Enter") {
      if (pageNumber === "0") {
        setPageNumber("1");
        props.onJumpToPage(1);
        return;
      }
      props.onJumpToPage(parseInt(pageNumber));
    }
  }

  function renderPageNumberInput() {
    return (
      <TextFieldComponent
        aria-label="pageNumberInput"
        value={pageNumber}
        onChange={(newValue) => pageNumberInputChangeHandler(newValue)}
        onKeyUp={(event) => pageNumberInputKeyUpHandler(event)}
      />
    );
  }

  function prevButtonClickedHandler() {
    if (!hasPrevPage()) {
      return;
    }
    setPageNumber((prev) => {
      const prevPageNumber = parseInt(prev, 10);
      return (prevPageNumber - 1).toString();
    });
    props.onPrevPageClick();
  }

  function nextButtonClickHandler() {
    if (!hasNextPage()) {
      return;
    }
    setPageNumber((prev) => {
      const prevPageNumber = parseInt(prev, 10);
      return (prevPageNumber + 1).toString();
    });
    props.onNextPageClick();
  }

  return (
    <nav aria-label="Pagination">
      <ul className="list-style-none flex items-center justify-center gap-1">
        <li>
          <Button
            className={({ isPressed }) =>
              isPressed
                ? "bg-brand1Grey-300 text-brand1Grey-800 dark:text-brand1Grey-400 flex items-center rounded px-3 py-1.5 outline-none"
                : "text-brand1Grey-800 dark:text-brand1Grey-400 hover:bg-brand1Grey-100 flex items-center rounded bg-transparent px-3 py-1.5 outline-none transition-all duration-300 disabled:opacity-25"
            }
            onPress={prevButtonClickedHandler}
            isDisabled={!hasPrevPage()}
          >
            {translate("PREV")}
          </Button>
        </li>
        <li>
          <div className="text-brand1Grey-800 flex items-center bg-transparent px-3 py-1.5">
            {renderPageNumberInput()}
            {`${translate("FROM").toLowerCase()} ${Math.ceil(
              props.searchResult.total.value / props.elasticSize,
            )}`}
          </div>
        </li>
        <li>
          <Button
            className={({ isPressed }) =>
              isPressed
                ? "bg-brand1Grey-300 text-brand1Grey-800 dark:text-brand1Grey-400 relative block rounded px-3 py-1.5 outline-none"
                : "text-brand1Grey-800 dark:text-brand1Grey-400 hover:bg-brand1Grey-100 relative block rounded bg-transparent px-3 py-1.5 outline-none transition-all duration-300  disabled:opacity-25"
            }
            isDisabled={!hasNextPage()}
            onPress={nextButtonClickHandler}
          >
            {translate("NEXT")}
          </Button>
        </li>
      </ul>
    </nav>
  );
};
