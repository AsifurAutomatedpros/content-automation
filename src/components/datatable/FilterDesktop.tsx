import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { typography } from "@/app/styles/typography";
import Icon from "@/components/icon/Icon";
import { cn } from "@/lib/utils";
import { CheckboxSymbol } from "@/components/ui/checkbox-symbol";
import { DatePicker } from "@/components/DatePicker";

export type FilterDesktopType = "Selectbox" | "Text input" | "SearchableSelectbox" | "Datepicker";
export type FilterDesktopState =
  | "Default"
  | "Hover"
  | "Filled"
  | "Filled Hover";

export interface FilterDesktopProps {
  type?: FilterDesktopType;
  label?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  defaultHovered?: boolean; // For demo purposes
  showLabel?: boolean; // Whether to show the label
  className?: string; // Additional classes for the container
  // New properties for searchable selectbox
  options?: Array<{ id: string; label: string; value: string; selected?: boolean }>;
  onOptionSelect?: (value: string) => void;
  onMultipleSelect?: (values: string[]) => void; // New prop for multiple selections
  onSearchChange?: (searchValue: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
  isOpen?: boolean;
  onToggleOpen?: () => void;
  multipleSelect?: boolean; // New prop to enable multiple select mode
  selectedValues?: string[]; // New prop for multiple selection values
  // New properties for datepicker
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  datePickerType?: "Date" | "Date & Time";
  _dateFormat?: string; // Renamed with underscore to avoid linter error
}

export const FilterDesktop: React.FC<FilterDesktopProps> = ({
  type = "Selectbox",
  label = "Label",
  value = "",
  placeholder = "Search...",
  onChange,
  onClear,
  defaultHovered = false,
  showLabel = true,
  className = "",
  options = [],
  onOptionSelect,
  onMultipleSelect,
  onSearchChange,
  searchValue = "",
  searchPlaceholder = "Search here...",
  isOpen = false,
  onToggleOpen,
  multipleSelect = false,
  selectedValues = [],
  // Datepicker props
  selectedDate,
  onDateSelect,
  datePickerType = "Date",
  _dateFormat = "MMM dd, yyyy", // Prefix with underscore to avoid linter error
}) => {
  const [isHovered, setIsHovered] = useState(defaultHovered);
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Create internal options with "Select All" option if multipleSelect is true
  const internalOptions = useMemo(() => {
    // Filter out any existing "All" or "Select All" options from the provided options
    const filteredOptions = options.filter(
      opt => opt.value !== "All" && opt.value !== "Select All" && opt.value !== "all"
    );

    // If multipleSelect, add "Select All" option at the beginning
    if (multipleSelect) {
      return [
        { 
          id: "all", 
          label: "Select All", 
          value: "all", 
          selected: selectedValues.includes("all") || 
                    selectedValues.includes("All") || 
                    selectedValues.includes("Select All")
        },
        ...filteredOptions
      ];
    }
    
    return options;
  }, [multipleSelect, options, selectedValues]);

  // Handle option selection with special "Select All" behavior
  const handleInternalOptionSelect = (optionValue: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (multipleSelect && onMultipleSelect) {
      // For multiple selection mode
      let newSelectedValues: string[] = [...selectedValues];
      const realOptionValues = internalOptions
        .filter(opt => opt.value !== "all" && opt.value !== "All" && opt.value !== "Select All")
        .map(opt => opt.value);

      if (optionValue === "all" || optionValue === "All" || optionValue === "Select All") {
        // If All option is already selected and we click it again, deselect all options
        if (realOptionValues.every(val => selectedValues.includes(val))) {
          onMultipleSelect([]);
        } else {
          // If All is clicked and wasn't previously selected, select all real options
          onMultipleSelect([...realOptionValues]);
        }
        return;
      }

      // Toggle this specific option
      if (newSelectedValues.includes(optionValue)) {
        newSelectedValues = newSelectedValues.filter(val => val !== optionValue);
      } else {
        newSelectedValues.push(optionValue);
      }
      
      // Check if after adding this option we now have both active and inactive
      // If so, add "all" to the list to ensure proper display and check state
      if (newSelectedValues.includes("active") && newSelectedValues.includes("inactive")) {
        // Add "all" to the display logic, but filter it out before returning
        // This is handled in the display logic
      }

      // Never include 'all' in selectedValues
      newSelectedValues = newSelectedValues.filter(val => val !== "all");

      onMultipleSelect(newSelectedValues);
    } else if (onOptionSelect) {
      // Single selection mode
      onOptionSelect(optionValue);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  const toggleOpen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    
    // Stop immediate propagation to prevent other handlers from being called
    if (e?.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
      e.nativeEvent.stopImmediatePropagation();
    }
    
    if (onToggleOpen) {
      onToggleOpen();
    } else {
      setLocalIsOpen(!localIsOpen);
    }
  };
  
  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node)) {
        if (onToggleOpen && (isOpen || localIsOpen)) {
          onToggleOpen();
        } else {
          setLocalIsOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onToggleOpen, isOpen, localIsOpen]);

  const containerClasses = cn(
    "flex flex-col gap-1 px-3 py-2 h-full w-full",
    isHovered ? "bg-black-5 dark:bg-white-10" : "",
    "border-r border-b border-black-10 dark:border-white-20",
    "transition-colors duration-300",
    className
  );

  const inputContainerClasses = `
    flex items-center gap-1 h-5
  `;

  const labelClasses = `
    ${typography.CaptionNormal}
    text-black-60 dark:text-fixed-white/60
    h-4 flex items-center
  `;

  const valueClasses = `
    ${typography.CaptionBold}
    flex-1 truncate text-black-100 dark:text-fixed-white
  `;

  // Unused because we use inline styles in the input elements
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const inputClasses = `
    ${typography.CaptionNormal}
    w-full outline-none bg-transparent
    text-black-100 dark:text-fixed-white placeholder:text-black-100 dark:placeholder:text-fixed-white/60
    h-5 leading-5
  `;

  const iconColor = isHovered ? "var(--black-90) var(--white-100)" : "var(--black-60) var(--white-60)";
  
  // Check if the selected option is "Select All" or "All"
  const isSelectAllSelected = multipleSelect 
    ? selectedValues.includes("all") || 
      selectedValues.includes("All") || 
      selectedValues.includes("Select All")
    : value === "all" || value === "All" || value === "Select All";
  
  // Get display value for the filter
  const getDisplayValue = () => {
    if (multipleSelect) {
      // No values selected - show "Select [Label]"
      if (selectedValues.length === 0) return `Select ${label}`;
      
      // "All" option is selected - show "All" (not "Select All")
      if (selectedValues.includes("all") || 
          selectedValues.includes("All") || 
          selectedValues.includes("Select All")) {
        return "All";
      }
      
      // If both active and inactive are selected, show "All"
      if (selectedValues.includes("active") && selectedValues.includes("inactive")) {
        return "All";
      }
      
      // Find the labels for the selected values
      const selectedLabels = internalOptions
        .filter(option => selectedValues.includes(option.value))
        .map(option => option.label);
      
      // Return comma-separated list of selected options
      return selectedLabels.join(", ");
    } else {
      // For single select mode
      if (!value) return `Select ${label}`;
      
      // Try to find the label for the selected value
      const selectedOption = internalOptions.find(option => option.value === value);
      return selectedOption ? selectedOption.label : value;
    }
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    if (!date) return "";
    
    try {
      // Simple date formatter
      const options: Intl.DateTimeFormatOptions = datePickerType === "Date" 
        ? { year: 'numeric', month: 'short', day: 'numeric' }
        : { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      
      return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return date.toDateString();
    }
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
    setShowDatePicker(false);
  };
  
  // Toggle date picker visibility
  const toggleDatePicker = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    
    // Stop immediate propagation
    if (e?.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
      e.nativeEvent.stopImmediatePropagation();
    }
    
    setShowDatePicker(!showDatePicker);
  };

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  // Handle search input click - renamed with underscore to avoid linter error
  const _handleSearchInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  // Handle search input keydown - renamed with underscore to avoid linter error
  const _handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  // Render date picker
  const renderDatePicker = () => {
    if (type !== "Datepicker" || !showDatePicker) return null;
    
    return (
      <div className="absolute top-full left-0 z-10">
        <DatePicker
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onClose={() => setShowDatePicker(false)}
          isVisible={true}
          type={datePickerType}
        />
      </div>
    );
  };

  // This function was previously used but is now replaced by inline code in the return statement
  // Kept for reference in case we need it later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderDropdownContent = () => {
    const isDropdownOpen = onToggleOpen ? isOpen : localIsOpen;
    if (type !== "SearchableSelectbox" && type !== "Selectbox" || !isDropdownOpen) return null;

    // Only consider visible options (filtered by search)
    const visibleOptions = internalOptions.filter(option =>
      !searchValue || option.label.toLowerCase().startsWith(searchValue.toLowerCase())
    );
    const normalVisibleOptions = visibleOptions.filter(opt =>
      opt.value !== "all" &&
      opt.value !== "All" &&
      opt.value !== "Select All"
    );
    const allVisibleSelected = normalVisibleOptions.length > 0 && normalVisibleOptions.every(opt => selectedValues.includes(opt.value));

    // Calculate if we should show indeterminate state for Select All option
    const hasAllSelected = multipleSelect && allVisibleSelected;
    const someOptionsSelected = normalVisibleOptions.some(opt => selectedValues.includes(opt.value));
    const isIndeterminate = !hasAllSelected && someOptionsSelected && !allVisibleSelected;

    const rect = dropdownRef.current?.getBoundingClientRect();
    if (!rect) return null;

    const dropdownContent = (
      <div
        className={cn(
          "fixed bg-white-100 dark:bg-black-100 dark:bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg",
          "border border-black-10 dark:border-white-40",
          "z-[9999]",
          "min-w-[200px]"
        )}
        style={{
          top: `${rect.bottom + 4}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {type === "SearchableSelectbox" && (
          <div
            className="sticky top-0 bg-white dark:bg-black-100 dark:bg-opacity-80 z-20 border-b border-black-10 dark:border-white-40"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              className={cn("w-full py-s px-m h-full outline-none", typography.BodyNormal, "text-black-100 dark:text-fixed-white placeholder:text-black-60 dark:placeholder:text-fixed-white/60 bg-transparent")}
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchInputChange}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              onKeyUp={(e) => e.stopPropagation()}
              onKeyPress={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              autoComplete="off"
            />
          </div>
        )}
        <div className="max-h-[250px] overflow-y-auto">
          {visibleOptions.map(option => {
            const isSelectAllOption = option.value === "all" || option.value === "All" || option.value === "Select All";
            let isChecked = false;
            if (multipleSelect) {
              if (isSelectAllOption) {
                isChecked = normalVisibleOptions.length > 0 && normalVisibleOptions.every(opt => selectedValues.includes(opt.value)) ||
                           (selectedValues.includes("active") && selectedValues.includes("inactive"));
              } else {
                isChecked = selectedValues.includes(option.value);
              }
            } else {
              isChecked = isSelectAllOption ? isSelectAllSelected : option.value === value;
            }
            return (
              <div
                key={option.id}
                className={cn(
                  "py-s px-m hover:bg-black-5 dark:hover:bg-white-20 cursor-pointer flex items-center gap-xs border-b last:border-b-0 border-black-10 dark:border-white-40",
                  isChecked ? "text-black dark:text-fixed-white font-medium" : "text-black-60 dark:text-fixed-white/60",
                  typography.BodyNormal,
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (typeof e.nativeEvent.stopImmediatePropagation === 'function') {
                    e.nativeEvent.stopImmediatePropagation();
                  }
                  handleInternalOptionSelect(option.value, e);
                }}
              >
                <CheckboxSymbol
                  checked={isChecked}
                  indeterminate={isSelectAllOption && isIndeterminate}
                  size="small"
                />
                {option.label}
              </div>
            );
          })}
        </div>
      </div>
    );

    return createPortal(dropdownContent, document.body);
  };

  return (
    <div
      ref={dropdownRef}
      className={cn(containerClasses, "relative")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'static' }}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest('input')) {
          e.stopPropagation();
          if (typeof e.nativeEvent.stopImmediatePropagation === 'function') {
            e.nativeEvent.stopImmediatePropagation();
          }
        }
      }}
    >
      {showLabel && <span className={labelClasses}>{label}</span>}
      <div 
        className={inputContainerClasses}
        onClick={(e) => {
          e.stopPropagation();
          if (type === "Selectbox" || type === "SearchableSelectbox") {
            toggleOpen(e);
          } else if (type === "Datepicker") {
            toggleDatePicker(e);
          }
        }}
      >
        {type === "Text input" ? (
          <>
            <div className="flex-shrink-0 w-5 flex items-center justify-center">
              <Icon name="search-20" color={iconColor} />
            </div>
            <input
              type="text"
              className={cn(
                typography.CaptionNormal,
                "w-full bg-transparent outline-none",
                "text-black-100 dark:text-fixed-white placeholder:text-black-100 dark:placeholder:text-fixed-white/60",
                "h-5 leading-5"
              )}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
            />
            {value && (
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear?.();
                  }}
                  className="hover:opacity-80 transition-opacity w-5 h-5 flex items-center justify-center"
                >
                  <Icon name="cancel-20" color={iconColor} />
                </button>
              </div>
            )}
          </>
        ) : type === "Datepicker" ? (
          <>
            <span className={valueClasses}>
              {selectedDate ? formatDate(selectedDate) : `Select a Date`}
            </span>
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              <Icon name="keyboard-arrow-down-20" color={iconColor} />
            </div>
          </>
        ) : (
          <>
            <span className={cn(
              typography.CaptionBold, 
              "flex-1 truncate",
              "text-black-100 dark:text-fixed-white"
            )}>
              {getDisplayValue()}
            </span>
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              <Icon 
                name={(type === "SearchableSelectbox" || type === "Selectbox") 
                  ? (isOpen ? "keyboard-arrow-up-20" : "keyboard-arrow-down-20")
                  : "calendar-today-20"
                } 
                color={iconColor} 
              />
            </div>
          </>
        )}
      </div>
      
      {(type === "SearchableSelectbox" || type === "Selectbox") && (isOpen || localIsOpen) && (() => {
        // Filter options based on search
        const visibleOptions = internalOptions.filter(option =>
          !searchValue || option.label.toLowerCase().startsWith(searchValue.toLowerCase())
        );
        const normalVisibleOptions = visibleOptions.filter(opt =>
          opt.value !== "all" &&
          opt.value !== "All" &&
          opt.value !== "Select All"
        );
        const allVisibleSelected = normalVisibleOptions.length > 0 && normalVisibleOptions.every(opt => selectedValues.includes(opt.value));

        // Calculate if we should show indeterminate state for Select All option
        const hasAllSelected = multipleSelect && allVisibleSelected;
        const someOptionsSelected = normalVisibleOptions.some(opt => selectedValues.includes(opt.value));
        const isIndeterminate = !hasAllSelected && someOptionsSelected && !allVisibleSelected;

        return (
          <div
            className="fixed inset-0 z-[999]"
            onClick={() => {
              if (onToggleOpen) {
                onToggleOpen();
              } else {
                setLocalIsOpen(false);
              }
            }}
          >
            <div
              className={cn(
                "absolute bg-white dark:bg-black-100 dark:bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg",
                "border border-black-10 dark:border-white-40",
                "z-[9999]"
              )}
              style={{
                top: `${dropdownRef.current?.getBoundingClientRect().bottom ?? 0}px`,
                left: `${dropdownRef.current?.getBoundingClientRect().left ?? 0}px`,
                minWidth: `${dropdownRef.current?.offsetWidth ?? 200}px`,
                maxHeight: '300px',
                overflow: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {type === "SearchableSelectbox" && (
                <div
                  className="sticky top-0 bg-white dark:bg-black-100 dark:bg-opacity-80 z-20 border-b border-black-10 dark:border-white-40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    className={cn("w-full py-s px-m outline-none", typography.BodyNormal, "text-black-100 dark:text-fixed-white placeholder:text-black-60 dark:placeholder:text-fixed-white/60 bg-transparent")}
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={handleSearchInputChange}
                    onMouseDown={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyUp={(e) => e.stopPropagation()}
                    onKeyPress={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    autoComplete="off"
                  />
                </div>
              )}
              <div className="max-h-[250px] overflow-y-auto">
                {visibleOptions.map((option) => {
                  const isSelectAllOption = option.value === "all" || option.value === "All" || option.value === "Select All";
                  let isChecked = false;
                  if (multipleSelect) {
                    if (isSelectAllOption) {
                      isChecked = normalVisibleOptions.length > 0 && normalVisibleOptions.every(opt => selectedValues.includes(opt.value)) ||
                                 (selectedValues.includes("active") && selectedValues.includes("inactive"));
                    } else {
                      isChecked = selectedValues.includes(option.value);
                    }
                  } else {
                    isChecked = isSelectAllOption ? isSelectAllSelected : option.value === value;
                  }
                  return (
                    <div
                      key={option.id}
                      className={cn(
                        "py-s px-m hover:bg-black-5 dark:hover:bg-white-20 cursor-pointer flex items-center gap-xs border-b last:border-b-0 border-black-10 dark:border-white-40",
                        isChecked ? "text-black dark:text-fixed-white font-medium" : "text-black-60 dark:text-fixed-white/60",
                        typography.BodyNormal,
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (typeof e.nativeEvent.stopImmediatePropagation === 'function') {
                          e.nativeEvent.stopImmediatePropagation();
                        }
                        handleInternalOptionSelect(option.value, e);
                      }}
                    >
                      <CheckboxSymbol
                        checked={isChecked}
                        indeterminate={isSelectAllOption && isIndeterminate}
                        size="small"
                      />
                      {option.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
      
      {renderDatePicker()}
    </div>
  );
};

export default FilterDesktop;
