"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Icon, { iconPaths } from "@/components/icon/Icon";
import { typography } from "@/app/styles/typography";


const tableCellVariants = cva(
  "flex items-center w-full min-h-[64px] border-b border-black-10 transition-colors duration-200 bg-white-60",
  {
    variants: {
      type: {
        default: "",
        "2-line": "",
        checkbox: "",
        date: "",
        dropdown: "",
        empty: "",
        expandable: "",
        "expandable-sub": "pl-16",
        notification: "",
        "read-notification": "",
        radio: "",
        status: "",
        "text-link": "",
        toggle: "",
        "translate-2-line": "",
        "icon-action": "",
        "icon-action-large": "",
        "icon-button": "",
        "icon-button-large": "",
        modifier: "",
        input: "",
        "input-2-line": "",
        custom: "",
      },
      state: {
        default: "",
        hover: "",
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

export interface TableCellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tableCellVariants> {
  /**
   * Primary content/label for the cell
   */
  content?: string;
  /**
   * Secondary content/subtitle for 2-line variants
   */
  subtitle?: string;
  /**
   * Link text for text-link variant
   */
  linkText?: string;
  /**
   * Date string for date variant
   */
  date?: string;
  /**
   * Time string for date variant
   */
  time?: string;
  /**
   * Whether checkbox/toggle is checked
   */
  checked?: boolean;
  /**
   * Whether checkbox is in indeterminate state
   */
  indeterminate?: boolean;
  /**
   * Status text for status variant
   */
  status?: "Ordered" | "Accepted" | "Ready" | "Served";
  /**
   * Whether the cell is expanded (for expandable variants)
   */
  expanded?: boolean;
  /**
   * Icon configurations for icon variants
   */
  icons?: Array<{
    name: keyof typeof iconPaths;
    onClick?: () => void;
  }>;
  /**
   * Button configurations for button variants
   */
  buttons?: Array<{
    text: string;
    variant?: "primary" | "secondary";
    onClick?: () => void;
  }>;
  /**
   * Input placeholder text
   */
  placeholder?: string;
  /**
   * Input value
   */
  value?: string;
  /**
   * Callback for checkbox/toggle changes
   */
  onCheckedChange?: (checked: boolean) => void;
  onCheckedRadioChange?: (checked: boolean) => void;
  onToggleCheckedChange?: (checked: boolean) => void;
  onModifierCheckedChange?: (checked: boolean) => void;
  /**
   * Callback for link clicks
   */
  onLinkClick?: () => void;
  /**
   * Callback for dropdown clicks
   */
  onDropdownClick?: () => void;
  /**
   * Callback for expand/collapse
   */
  onExpandClick?: () => void;
  /**
   * Callback for icon/button clicks
   */
  onClick?: () => void;
  /**
   * Callback for input changes
   */
  onInputChange?: (value: string) => void;
  /**
   * Title input value for input-2-line variant
   */
  titleValue?: string;
  /**
   * Description input value for input-2-line variant
   */
  descriptionValue?: string;
  /**
   * Title placeholder for input-2-line variant
   */
  titlePlaceholder?: string;
  /**
   * Description placeholder for input-2-line variant
   */
  descriptionPlaceholder?: string;
  /**
   * Callback for title input changes
   */
  onTitleChange?: (value: string) => void;
  /**
   * Callback for description input changes
   */
  onDescriptionChange?: (value: string) => void;
  /**
   * Values for modifier inputs
   */
  modifierValues?: {
    price?: string;
    kcal?: string;
    grams?: string;
    prots?: string;
    carbs?: string;
    fats?: string;
  };
  /**
   * Callbacks for modifier input changes
   */
  onModifierChange?: {
    price?: (value: string) => void;
    kcal?: (value: string) => void;
    grams?: (value: string) => void;
    prots?: (value: string) => void;
    carbs?: (value: string) => void;
    fats?: (value: string) => void;
  };
  /**
   * Custom React element to render inside the cell (only for custom variant)
   */
  customElement?: React.ReactNode;
  toggleLabel?: string;
}

export const TableCell = React.forwardRef<HTMLDivElement, TableCellProps>(
  (
    {
      className,
      type = "default",
      state = "default",
      alignment = "left",
      content = "Cell Content",
      subtitle,
      linkText = "Link",
      date,
      time,
      checked = false,
      indeterminate = false,
      status,
      expanded = false,
      icons,
      buttons,
      placeholder,
      value,
      onCheckedChange,
      onCheckedRadioChange,
      onToggleCheckedChange,
      onModifierCheckedChange,
      onLinkClick,
      onDropdownClick,
      onExpandClick,
      onClick,
      onInputChange,
      titleValue,
      descriptionValue,
      titlePlaceholder = "Title Translation",
      descriptionPlaceholder = "Description Translation",
      onTitleChange,
      onDescriptionChange,
      modifierValues,
      onModifierChange,
      customElement,
      toggleLabel,
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

    const renderContent = () => {
      switch (type) {
        case "2-line":
          return (
            <div className="flex flex-col gap-2xs py-s">
              <span className={typography.BodyNormal}>{content}</span>
              <span className={cn(typography.BodyNormal, "text-black-60")}>
                {subtitle}
              </span>
            </div>
          );

       

        case "date":
          return (
            <div className="flex flex-col">
              <span className={typography.BodyNormal}>
                {date || "Jan 01, 2024"}
              </span>
              <span className={typography.CaptionNormal}>
                {time || "00:00"}
              </span>
            </div>
          );

        case "dropdown":
          return (
            <div className="flex items-center gap-1" onClick={onDropdownClick}>
              <span className={typography.BodyNormal}>{content}</span>
              <Icon name="arrow-drop-down" className="text-black" />
            </div>
          );

        case "empty":
          return <span className={typography.BodyNormal}>—</span>;

      

        case "notification":
        case "read-notification":
          return (
            <span
              className={cn(
                typography.BodyNormal,
                type === "read-notification" && "text-black-40"
              )}
            >
              {content}
            </span>
          );


        case "text-link":
          return (
            <div className="flex items-center gap-1">
              <span className={typography.BodyNormal}>{content}</span>
              <span className={typography.BodyNormal}>—</span>
              <span
                className={cn(
                  typography.BodyNormal,
                  "underline cursor-pointer"
                )}
                onClick={onLinkClick}
              >
                {linkText}
              </span>
            </div>
          );

       

        case "translate-2-line":
          return (
            <div className="flex flex-col gap-9 py-5">
              <span className={typography.BodyNormal}>{content}</span>
              <span className={cn(typography.BodyNormal, "text-black-60")}>
                {subtitle}
              </span>
            </div>
          );

        case "icon-action":
          return (
            <div className="flex items-center gap-2">
              {icons?.map((icon, index) => (
                <Icon
                  key={index}
                  name={icon.name}
                  onClick={icon.onClick}
                  color="var(--icon-black-40)"
                />
              ))}
            </div>
          );

        case "icon-action-large":
          return (
            <div className="flex items-center gap-2">
              {icons?.map((icon, index) => (
                <Icon
                  key={index}
                  name={icon.name}
                  onClick={icon.onClick}
                  color="var(--icon-black-40)"
                />
              ))}
            </div>
          );

        case "icon-button":
          return (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {icons?.map((icon, index) => (
                  <Icon
                    key={index}
                    name={icon.name}
                    onClick={icon.onClick}
                    color="var(--icon-black-40)"
                  />
                ))}
              </div>
              
            </div>
          );

        case "icon-button-large":
          return (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {icons?.map((icon, index) => (
                  <Icon
                    key={index}
                    name={icon.name}
                    onClick={icon.onClick}
                    color="var(--icon-black-40)"
                  />
                ))}
              </div>
            
            </div>
          );




        case "custom":
          return (
            <div
              className={cn(
                "w-full flex items-center",
                alignment === "right" ? "justify-end" : "justify-start"
              )}
              onClick={onClick}
            >
              {customElement}
            </div>
          );

        default:
          return <span className={typography.BodyNormal}>{content}</span>;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          tableCellVariants({
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
        {renderContent()}
      </div>
    );
  }
);

TableCell.displayName = "TableCell";
