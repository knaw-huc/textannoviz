import { useEffect, useRef, useState } from "react";
import { Block, Element } from "../../../../components/Text/Annotated/core";

import { Elements } from "../../../../components/Text/Annotated/core/Elements.tsx";
import {
  cancelIdleCallback,
  requestIdleCallback,
} from "../../../../components/Text/Annotated/core/utils/requestIdleCallback.ts";

type LazyTableProps = {
  block: Block;
  initBatchSize?: number;
  initRowHeight?: number;
};

/**
 * Render both a table block and its row children
 *
 * For large tables, first render the {@link initBatchSize} to populate the
 * screen, with an empty spacer at the bottom for scrolling. After the initial
 * batch, render the rest of the table.
 */
export function LazyTableAndRows({
  block,
  initBatchSize = 50,
  initRowHeight = 20,
}: LazyTableProps) {
  const tableRef = useRef<HTMLTableElement>(null);
  const [renderAll, setRenderAll] = useState(false);
  const [colWidths, setColWidths] = useState<number[]>([]);
  const [rowHeight, setRowHeight] = useState(initRowHeight);

  const rows = block.children.filter((e) => e.isBlock) as Block[];
  // initBatchSize = rows.length
  const headerRow = rows[0];
  const dataRows = rows.slice(1);
  const visibleRows = renderAll ? dataRows : dataRows.slice(0, initBatchSize);
  const remainingRows = renderAll ? 0 : dataRows.length - initBatchSize;
  const needsLazyLoad = dataRows.length > initBatchSize;

  useEffect(() => {
    if (colWidths.length) {
      return;
    }
    const table = tableRef.current;
    if (!table) {
      return;
    }
    const headerTr = table.querySelector("thead > tr");
    if (!headerTr) {
      return;
    }

    const tableWidth = table.getBoundingClientRect().width;
    if (!tableWidth) {
      return;
    }
    const cells = [...headerTr.querySelectorAll("td")];
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
    // Wait for the browser to render the first batch, render the rest later:
    const id = requestIdleCallback(() => setRenderAll(true));
    return () => cancelIdleCallback(id);
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
      <thead>
        <tr key={headerRow.id}>
          <Elements
            elements={headerRow.children.filter((e) => !isWhitespaceOnly(e))}
          />
        </tr>
      </thead>
      <tbody>
        {visibleRows.map((row) => (
          <tr key={row.id}>
            <Elements
              // tr is not allowed to have text nodes, i.e. whitespace:
              elements={row.children.filter((e) => !isWhitespaceOnly(e))}
            />
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

function isWhitespaceOnly(inline: Element): boolean {
  if (inline.isBlock) {
    return false;
  }
  return inline.segments.every((s) => /^\s*$/.test(s.body));
}
