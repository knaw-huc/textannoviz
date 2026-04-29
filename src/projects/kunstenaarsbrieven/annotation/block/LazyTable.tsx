import { useEffect, useRef, useState } from "react";
import { Block } from "../../../../components/Text/Annotated/core";

import { Elements } from "../../../../components/Text/Annotated/core/Elements.tsx";

type LazyTableProps = {
  block: Block;
  initBatchSize?: number;
  initRowHeight?: number;
};

/**
 * For large tables, first render the {@link initBatchSize} to populate the
 * screen, with an empty spacer at the bottom for scrolling. After the initial
 * batch, render the rest of the table.
 */
export function LazyTable({
  block,
  initBatchSize = 50,
  initRowHeight = 20,
}: LazyTableProps) {
  const tableRef = useRef<HTMLTableElement>(null);
  const [renderAll, setRenderAll] = useState(false);
  const [colWidths, setColWidths] = useState<number[]>([]);
  const [rowHeight, setRowHeight] = useState(initRowHeight);

  const rows = block.children.filter((e) => e.isBlock) as Block[];
  const visibleRows = renderAll ? rows : rows.slice(0, initBatchSize);
  const remainingRows = renderAll ? 0 : rows.length - initBatchSize;
  const needsLazyLoad = rows.length > initBatchSize;

  useEffect(() => {
    if (colWidths.length) {
      return;
    }
    const table = tableRef.current;
    if (!table) {
      return;
    }
    const firstRow = table.querySelector("tbody > tr");
    if (!firstRow) {
      return;
    }

    const tableWidth = table.getBoundingClientRect().width;
    if (!tableWidth) {
      return;
    }
    const cells = [...firstRow.querySelectorAll("td")];
    const columnPercentages = cells.map(
      (cell) => (cell.getBoundingClientRect().width / tableWidth) * 100,
    );
    if (columnPercentages.length) {
      setColWidths(columnPercentages);
    }

    const renderedRows = table.querySelectorAll("tbody > tr");
    if (renderedRows.length) {
      let totalHeight = 0;
      renderedRows.forEach((row) => {
        totalHeight += row.getBoundingClientRect().height;
      });
      setRowHeight(totalHeight / renderedRows.length);
    }
  }, [colWidths.length]);

  useEffect(() => {
    if (renderAll || !needsLazyLoad) {
      return;
    }
    // Wait for the browser to render the first batch, render the rest after that:
    const id = setTimeout(() => setRenderAll(true), 0);
    return () => clearTimeout(id);
  }, [renderAll, needsLazyLoad]);

  const isWidthCalculated = colWidths.length > 0;
  const tableSpacerHeight = remainingRows > 0 ? remainingRows * rowHeight : 0;

  return (
    <table
      ref={tableRef}
      style={{ tableLayout: isWidthCalculated ? "fixed" : "auto" }}
    >
      {isWidthCalculated && (
        <colgroup>
          {colWidths.map((w, i) => (
            <col key={i} style={{ width: `${w}%` }} />
          ))}
        </colgroup>
      )}
      <tbody>
        {visibleRows.map((row) => (
          <tr key={row.id}>
            <Elements elements={row.children} />
          </tr>
        ))}
        {/* To prevent flickering, show an empty spacer when the table is not fully loaded yet: */}
        {tableSpacerHeight > 0 && (
          <tr>
            <td
              colSpan={colWidths.length || 1}
              style={{ height: tableSpacerHeight, padding: 0, border: "none" }}
            />
          </tr>
        )}
      </tbody>
    </table>
  );
}
