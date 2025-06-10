"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Icon, { iconPaths } from "@/components/icon/Icon";
import { typography } from "@/app/styles/typography";
import { CheckboxItem } from "@/components/ui/checkbox-item";
import { InputField } from "@/components/ui/InputField";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Button } from "@/components/ui/button";
import OrderLabel from "@/components/ui/order-label";
import { Textarea } from "@/components/ui/textarea";
import { RadioItem } from "@/components/ui/radio-item";
import { InputLabel } from "@/components/ui/InputLabel";
import IconicButton from "@/components/IconicButton";

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

        case "checkbox":
          return (
            <CheckboxItem
              label=""
              checked={checked}
              indeterminate={indeterminate}
              onCheck={onCheckedChange}
              size="small"
            />
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

        case "expandable":
        case "expandable-sub":
          return (
            <div className="flex items-center gap-1 pr-s py-xs">
              {type === "expandable" && (
                <IconicButton
                  buttonType="white"
                  size="small"
                  onClick={onExpandClick}
                  className="min-w-[32px] min-h-[32px] p-0"
                  icon={
                    expanded ? "keyboard-arrow-down-20" : "chevron-right-20"
                  }
                />
              )}
              <span className={typography.BodyBold}>{content}</span>
            </div>
          );

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

        case "radio":
          return (
            <RadioItem
              label=""
              checked={checked}
              onChange={onCheckedRadioChange}
              size="small"
            />
          );

        case "status":
          return (
            <OrderLabel
              className={cn(
                "px-2 py-1 rounded-2xl text-white",
                typography.BodyNormal
              )}
              type={status || "Ordered"}
              size="Medium"
            ></OrderLabel>
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

        case "toggle":
          return (
            <ToggleSwitch
              checked={checked}
              onCheckedChange={onToggleCheckedChange}
              size="large"
            />
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
              <div className="flex items-center gap-2">
                {(buttons || [{ text: "Button", variant: "primary" }]).map(
                  (buttonConfig, index) => (
                    <Button
                      key={index}
                      variant={buttonConfig.variant || "primary"}
                      size="small"
                      onClick={buttonConfig.onClick}
                    >
                      {buttonConfig.text}
                    </Button>
                  )
                )}
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
              <div className="flex items-center gap-2">
                {(buttons || [{ text: "Button", variant: "primary" }]).map(
                  (buttonConfig, index) => (
                    <Button
                      key={index}
                      variant={buttonConfig.variant || "primary"}
                      size="large"
                      onClick={buttonConfig.onClick}
                    >
                      {buttonConfig.text}
                    </Button>
                  )
                )}
              </div>
            </div>
          );

        case "modifier":
          return (
            <div className="flex flex-col w-full gap-4 px-s py-m">
              <div className="flex items-center gap-2">
                <ToggleSwitch
                  checked={checked}
                  onCheckedChange={onModifierCheckedChange}
                  size="large"
                />
                <span className={typography.BodyNormal}>
                  {toggleLabel || content}
                </span>
              </div>
              {checked && (
                <div className="flex flex-col gap-s w-full">
                  <div className="flex flex-col gap-xs">
                    <InputLabel label="Price" />
                    <InputField
                      value={modifierValues?.price}
                      placeholder="Enter Price"
                      onChange={(e) =>
                        onModifierChange?.price?.(e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-xs">
                    <div className="flex flex-col gap-xs">
                      <InputLabel label="Kcal" />
                      <InputField
                        value={modifierValues?.kcal}
                        placeholder="Kcal"
                        onChange={(e) =>
                          onModifierChange?.kcal?.(e.target.value)
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-xs">
                      <InputLabel label="Grams" />
                      <InputField
                        value={modifierValues?.grams}
                        placeholder="Grams"
                        onChange={(e) =>
                          onModifierChange?.grams?.(e.target.value)
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-xs">
                      <InputLabel label="Prots." />
                      <InputField
                        value={modifierValues?.prots}
                        placeholder="Prots."
                        onChange={(e) =>
                          onModifierChange?.prots?.(e.target.value)
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-xs">
                      <InputLabel label="Carbs" />
                      <InputField
                        value={modifierValues?.carbs}
                        placeholder="Carbs"
                        onChange={(e) =>
                          onModifierChange?.carbs?.(e.target.value)
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-xs">
                      <InputLabel label="Fats" />
                      <InputField
                        value={modifierValues?.fats}
                        placeholder="Fats"
                        onChange={(e) =>
                          onModifierChange?.fats?.(e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );

        case "input":
          return (
            <InputField
              value={value}
              placeholder={placeholder}
              onChange={(e) => onInputChange?.(e.target.value)}
              className="w-full"
            />
          );

        case "input-2-line":
          return (
            <div className="flex flex-col gap-2 py-2 w-full">
              <InputField
                value={titleValue}
                placeholder={titlePlaceholder}
                onChange={(e) => onTitleChange?.(e.target.value)}
                className="w-full"
              />
              <Textarea
                value={descriptionValue}
                placeholder={descriptionPlaceholder}
                onChange={(e) => onDescriptionChange?.(e.target.value)}
                className="w-full min-h-[120px] resize-none rounded-[24px] border border-black-10"
              />
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
