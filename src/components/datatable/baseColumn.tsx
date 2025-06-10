"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TableCell } from "./tableCell";
import { HeaderCell } from "./headerCell";

export interface BaseColumnProps {
  /**
   * Header text for the column
   */
  header?: string;
  /**
   * Content items to display in the column
   */
  items?: string[];
  /**
   * Optional className for additional styling
   */
  className?: string;
  /**
   * Optional header type
   */
  headerType?: "default" | "sort-up" | "sort-down" | "not-sorted" | "drop-down" | "checkbox-label" | "checkbox";
  /**
   * Optional header alignment
   */
  headerAlignment?: "left" | "center" | "right";
  /**
   * Optional cell alignment
   */
  cellAlignment?: "left" | "center" | "right";
}

export const BaseColumn = React.forwardRef<HTMLDivElement, BaseColumnProps>(
  ({
    header = "Header Cell",
    items = [],
    className,
    headerType = "default",
    headerAlignment = "left",
    cellAlignment = "left",
  }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col w-[300px]", className)}>
        <HeaderCell
          type={headerType}
          alignment={headerAlignment}
          label={header}
        />
        {items.map((item, index) => (
          <TableCell
            key={index}
            type="default"
            alignment={cellAlignment}
            content={item}
          />
        ))}
      </div>
    );
  }
);

BaseColumn.displayName = "BaseColumn"; 