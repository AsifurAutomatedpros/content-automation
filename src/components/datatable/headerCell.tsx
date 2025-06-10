"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Icon from "@/components/icon/Icon";
import { typography } from "@/app/styles/typography";
import { CheckboxSymbol } from "@/components/checkbox-symbol";

const headerCellVariants = cva(
  "flex items-center w-full h-12 border-b border-black-10 transition-colors duration-200",
  {
    variants: {
      type: {
        default: "",
        "sort-up": "",
        "sort-down": "",
        "not-sorted": "",
        "drop-down": "",
        "checkbox-label": "",
        checkbox: "",
      },
      state: {
        default: "bg-black-5",
        hover: "bg-black-5",
      },
      alignment: {
        left: "justify-start",
        center: "justify-center",
        right: "justify-end",
      },
    },
    defaultVariants: {
      type: "default",
      state: "default",
      alignment: "left",
    },
  }
);

export interface HeaderCellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof headerCellVariants> {
  /**
   * The label text to display
   */
  label: string;
  /**
   * Whether the cell is checked (only for checkbox type)
   */
  checked?: boolean;
  /**
   * Whether the checkbox is in indeterminate state (only for checkbox type)
   */
  indeterminate?: boolean;
  /**
   * Callback when checkbox is clicked (only for checkbox type)
   */
  onCheck?: (checked: boolean) => void;
}

export const HeaderCell = React.forwardRef<HTMLDivElement, HeaderCellProps>(
  (
    {
      className,
      type = "default",
      state = "default",
      alignment = "left",
      label,
      checked,
      indeterminate,
      onCheck,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseEnter = React.useCallback(() => {
      setIsHovered(true);
    }, []);

    const handleMouseLeave = React.useCallback(() => {
      setIsHovered(false);
    }, []);

    const renderIcon = () => {
      if (type === "sort-up") {
        return <Icon name="arrow-upward-alt-20" color={isHovered ? "black" : "black"} className={isHovered ? "dark:text-white" : "dark:text-[var(--icon-black-40)]"} />;
      } else if (type === "sort-down") {
        return <Icon name="arrow-downward-alt-20" color={isHovered ? "black" : "black"} className={isHovered ? "dark:text-white" : "dark:text-[var(--icon-black-40)]"} />;
      } else if (type === "not-sorted") {
        return (
          <Icon
            name="arrow-downward-alt-20"
            color={isHovered ? "black" : "black"}
            className={cn(isHovered ? "dark:text-white" : "dark:text-[var(--icon-black-40)]", !isHovered && "opacity-0")}
          />
        );
      } else if (type === "drop-down") {
        return <Icon name="stat-minus-1" className="" />;
      }
      return null;
    };

    return (
      <div
        ref={ref}
        className={cn(
          headerCellVariants({
            type,
            state: isHovered ? "hover" : state,
            alignment,
          }),
          "px-3",
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {type === "checkbox-label" || type === "checkbox" ? (
          <div className="flex items-center gap-1">
            <CheckboxSymbol
              checked={checked}
              indeterminate={indeterminate}
              onCheck={onCheck}
              size="small"
            />
            {label && (
              <span className={cn(typography.CaptionBold, "text-black-60")}>
                {label}
              </span>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "flex items-center w-full min-h-[48px]",
              alignment === "center" && "justify-center",
              alignment === "right" && "justify-end"
            )}
          >
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  typography.CaptionBold,
                  isHovered ? "text-black" : "text-black-60"
                )}
              >
                {label}
              </span>
              <div className="flex items-center">
                {renderIcon()}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

HeaderCell.displayName = "HeaderCell";
