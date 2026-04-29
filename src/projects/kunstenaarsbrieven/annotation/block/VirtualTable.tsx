import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useRef, useState } from "react";
import { Block } from "../../../../components/Text/Annotated/core/block";
import { Elements } from "../../../../components/Text/Annotated/core/SegmentedText.tsx";
import { useScrollContainerRef } from "../../../../components/Text/ScrollContainerContext.tsx";

type VirtualTableProps = {
  block: Block;
};

/**
 * Only render the rows that are in view
 */
export function VirtualTable({ block }: VirtualTableProps) {
  "use no memo";

  const tableRef = useRef<HTMLTableElement>(null);
  const scrollRef = useScrollContainerRef();
  const [scrollMargin, setScrollMargin] = useState(0);
  const [ready, setReady] = useState(false);
  const [colWidths, setColWidths] = useState<number[]>([]);

  const rows = block.children.filter((e) => e.isBlock) as Block[];

  useEffect(() => {
    const scrollParent = scrollRef?.current;
    const table = tableRef.current;
    if (!scrollParent || !table) {
      return;
    }
    const tableRect = table.getBoundingClientRect();
    const scrollRect = scrollParent.getBoundingClientRect();
    setScrollMargin(tableRect.top - scrollRect.top + scrollParent.scrollTop);
    setReady(true);
  }, [scrollRef]);

  useEffect(() => {
    if (colWidths.length) {
      return;
    }
    const table = tableRef.current;
    if (!table) {
      return;
    }
    const firstDataRow = table.querySelector("tr[data-index]");
    if (!firstDataRow) {
      return;
    }
    const cells = [...firstDataRow.querySelectorAll("td")];
    const widths = cells.map((c) => c.getBoundingClientRect().width);
    if (widths.length) {
      setColWidths(widths);
    }
  });

  const getScrollElement = useCallback(
    () => scrollRef?.current || null,
    [scrollRef],
  );

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement,
    estimateSize: () => 30,
    overscan: 20,
    scrollMargin,
    enabled: ready,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  if (!virtualItems.length) {
    return (
      <table ref={tableRef}>
        <tbody />
      </table>
    );
  }

  const isInit = colWidths.length;
  const before = virtualItems[0].start - scrollMargin;
  const after = totalSize - virtualItems[virtualItems.length - 1].end;

  return (
    <table ref={tableRef} style={{ tableLayout: isInit ? "fixed" : "auto" }}>
      {isInit && (
        <colgroup>
          {colWidths.map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
      )}
      <tbody>
        {before > 0 && (
          <tr>
            <td
              colSpan={99}
              style={{ height: before, padding: 0, border: "none" }}
            />
          </tr>
        )}
        {virtualItems.map((virtualRow) => {
          const row = rows[virtualRow.index];
          return (
            <tr
              key={row.id}
              ref={virtualizer.measureElement}
              data-index={virtualRow.index}
            >
              <Elements elements={row.children} />
            </tr>
          );
        })}
        {after > 0 && (
          <tr>
            <td
              colSpan={99}
              style={{ height: after, padding: 0, border: "none" }}
            />
          </tr>
        )}
      </tbody>
    </table>
  );
}
