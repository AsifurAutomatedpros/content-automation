"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Icon from "@/components/icon/Icon";

/**
 * CheckboxSymbol represents a checkbox component with different visual states,
 * sizes and interactions based on the Figma design system.
 *
 * The component supports checked, unchecked, and indeterminate states,
 * as well as different sizes (small, medium, and large) and hover interactions.
 */
const checkboxSymbolVariants = cva(
  "flex items-center justify-center rounded-[8px] transition-colors",
  {
    variants: {
      size: {
        small: "h-6 w-6 min-h-6 min-w-6",
        medium: "h-7 w-7 min-h-7 min-w-7",
        large: "h-8 w-8 min-h-8 min-w-8",
      },
      state: {
        checked: "bg-green",
        unchecked: "bg-black-10",
        indeterminate: "bg-green",
      },
      hover: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Shadow for hover states - different shadow sizes for small vs large
      {
        size: "small",
        hover: true,
        className: "shadow-[0_0_0_2px_rgba(26,26,26,0.1)]",
      },
      {
        size: "medium",
        hover: true,
        className: "shadow-[0_0_0_3px_rgba(26,26,26,0.1)]",
      },
      {
        size: "large",
        hover: true,
        className: "shadow-[0_0_0_4px_rgba(26,26,26,0.1)]",
      },
    ],
    defaultVariants: {
      size: "small",
      state: "unchecked",
      hover: false,
    },
  }
);

export interface CheckboxSymbolProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof checkboxSymbolVariants> {
  /**
   * Whether the checkbox is checked.
   */
  checked?: boolean;
  /**
   * Whether the checkbox is in an indeterminate state.
   */
  indeterminate?: boolean;
  /**
   * Whether to show the hover state.
   */
  hover?: boolean;
  /**
   * The size of the checkbox symbol.
   */
  size?: "small" | "medium" | "large";
  /**
   * Optional callback for when the checkbox is clicked.
   */
  onCheck?: (checked: boolean) => void;
  /**
   * Optional ref for the checkbox element.
   */
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * CheckboxSymbol is a UI component that visually represents different checkbox states.
 *
 * It can be used to show checked, unchecked, or indeterminate states with different sizes
 * and hover interactions.
 */
export const CheckboxSymbol = React.forwardRef<
  HTMLDivElement,
  CheckboxSymbolProps
>(
  (
    {
      className,
      checked = false,
      indeterminate = false,
      hover = false,
      size = "small",
      onCheck,
      ...props
    },
    ref
  ) => {
    // Determine the state based on checked and indeterminate props
    const state = indeterminate
      ? "indeterminate"
      : checked
      ? "checked"
      : "unchecked";

    // Determine the icon to use based on state
    const iconName = indeterminate ? "remove" : "check";

    // Handle click events if onCheck is provided
    const handleClick = React.useCallback(() => {
      if (onCheck) {
        onCheck(!checked);
      }
    }, [checked, onCheck]);

    // Use React.useRef if ref is not provided
    const internalRef = React.useRef<HTMLDivElement>(null);
    const resolvedRef = ref || internalRef;

    // Add hover effect on mouse enter/leave if onCheck is provided
    const [isHovered, setIsHovered] = React.useState(hover);

    const handleMouseEnter = React.useCallback(() => {
      if (onCheck) {
        setIsHovered(true);
      }
    }, [onCheck]);

    const handleMouseLeave = React.useCallback(() => {
      if (onCheck) {
        setIsHovered(false);
      }
    }, [onCheck]);

    // Use provided hover prop or internal hover state
    const effectiveHover = hover || isHovered;

    return (
      <div
        ref={resolvedRef}
        className={cn(
          checkboxSymbolVariants({ size, state, hover: effectiveHover }),
          onCheck && "cursor-pointer",
          className
        )}
        onClick={onCheck ? handleClick : undefined}
        onMouseEnter={onCheck ? handleMouseEnter : undefined}
        onMouseLeave={onCheck ? handleMouseLeave : undefined}
        role={onCheck ? "checkbox" : undefined}
        aria-checked={checked}
        {...props}
      >
        {state !== "unchecked" && (
          <Icon
            name={iconName}
            color="var(--fixed-white)"
            className="flex items-center justify-center"
          />
        )}
      </div>
    );
  }
);

// Add display name
CheckboxSymbol.displayName = "CheckboxSymbol";
