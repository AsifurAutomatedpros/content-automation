import React, { useEffect, useState } from "react";
import { IconicButton } from "@/components/IconicButton";
import { cn } from "@/lib/utils";
import { FilterDesktop } from "@/components/ui/datatable/FilterDesktop";
import { useParams } from 'next/navigation';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  selected?: boolean;
}

export interface FilterConfig {
  label: string;
  value: string | string[];
  options?: FilterOption[];
  multipleSelect?: boolean;
  searchPlaceholder?: string;
}

export interface FilterRowProps {
  /**
   * Whether to show the search input
   * @default true
   */
  showSearch?: boolean;

  /**
   * Whether to show action buttons
   * @default true
   */
  showActions?: boolean;

  /**
   * Whether to show the first action button
   * @default true
   */
  showFirstAction?: boolean;

  /**
   * Whether to show the second action button
   * @default true
   */
  showSecondAction?: boolean;

  /**
   * Whether to show the third action button
   * @default true
   */
  showThirdAction?: boolean;

  /**
   * Whether to force tablet layout
   * @default false
   */
  forceTablet?: boolean;

  /**
   * Whether to show filters in the first row
   * @default true
   */
  showFiltersInline?: boolean;

  /**
   * Whether to force filters to stay inline on tablet view (overrides the tablet breakpoint behavior)
   * @default false
   */
  forceInlineOnTablet?: boolean;

  /**
   * Additional class name for the container
   */
  className?: string;

  /**
   * Search value
   */
  searchValue?: string;

  /**
   * Search placeholder
   */
  searchPlaceholder?: string;

  /**
   * Search change handler
   */
  onSearchChange?: (value: string) => void;

  /**
   * Search clear handler
   */
  onSearchClear?: () => void;

  /**
   * Array of filter configurations
   */
  filters?: FilterConfig[];

  /**
   * Filter change handler
   */
  onFilterChange?: (label: string, value: string | string[]) => void;

  /**
   * Children to render in the action buttons area
   */
  children?: React.ReactNode;
}

export const FilterRow: React.FC<FilterRowProps> = ({
  showSearch = true,
  showActions = true,
  showFirstAction = true,
  showSecondAction = true,
  showThirdAction = true,
  forceTablet = false,
  showFiltersInline = true,
  forceInlineOnTablet = false,
  className,
  searchValue = "",
  searchPlaceholder = "Search...",
  onSearchChange,
  onSearchClear,
  filters = [],
  onFilterChange,
  children,
}) => {
  const [isTablet, setIsTablet] = useState(false);
  const [filterSearchValues, setFilterSearchValues] = useState<
    Record<string, string>
  >({});
  const [openFilterDropdown, setOpenFilterDropdown] = useState<string | null>(null);
  const params = useParams();
  const isRTL = params?.locale === 'ar';

  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth <= 834 || forceTablet);
    };

    checkTablet();
    window.addEventListener("resize", checkTablet);
    return () => window.removeEventListener("resize", checkTablet);
  }, [forceTablet]);

  // Always show filters in second row on tablet (unless forceInlineOnTablet is true),
  // otherwise respect showFiltersInline prop
  const shouldShowFiltersInNextRow =
    (isTablet && !forceInlineOnTablet) || !showFiltersInline;

  // Handle filter search change
  const handleFilterSearchChange = (filterLabel: string, value: string) => {
    console.log("Filter search changed:", filterLabel, value);
    setFilterSearchValues((prev) => ({
      ...prev,
      [filterLabel]: value,
    }));
  };

  // Handle toggling the dropdown open/closed
  const handleToggleDropdown = (filterLabel: string) => {
    setOpenFilterDropdown(prev => prev === filterLabel ? null : filterLabel);
  };

  const renderFilters = () => (
    <div className="flex items-stretch flex-wrap md:flex-nowrap">
      {filters.map((filter, index) => (
        <div
          key={`${filter.label}-${index}`}
          className={cn(
            "min-w-[160px]",
            index !== filters.length - 1 && "border-r border-black-10"
          )}
        >
          <FilterDesktop
            type="SearchableSelectbox"
            label={filter.label}
            value={Array.isArray(filter.value) ? filter.value[0] : filter.value}
            options={filter.options || []}
            onChange={(value: string) => {
              console.log("Filter changed:", filter.label, value);
              onFilterChange?.(filter.label, value);
            }}
            onMultipleSelect={(values: string[]) => {
              console.log("Multiple selection:", filter.label, values);
              onFilterChange?.(filter.label, values);
            }}
            searchPlaceholder={
              filter.searchPlaceholder ||
              `Search ${filter.label.toLowerCase()}...`
            }
            searchValue={filterSearchValues[filter.label] || ""}
            onSearchChange={(value: string) =>
              handleFilterSearchChange(filter.label, value)
            }
            multipleSelect={filter.multipleSelect}
            selectedValues={
              Array.isArray(filter.value) ? filter.value : [filter.value]
            }
            isOpen={openFilterDropdown === filter.label}
            onToggleOpen={() => handleToggleDropdown(filter.label)}
          />
        </div>
      ))}
    </div>
  );

  const renderActionButtons = () => {
    if (!showActions) return null;

    return (
      <div className="flex items-center gap-2">
        {showFirstAction && (
          <IconicButton
            buttonType="white"
            size="small"
            icon=""
            onClick={() => {}}
            iconColor="var(--icon-black-40)"
          />
        )}
        {showSecondAction && (
          <IconicButton
            buttonType="white"
            size="small"
            icon=""
            onClick={() => {}}
            iconColor="var(--icon-black-40)"
          />
        )}
        {showThirdAction && (
          <IconicButton
            buttonType="white"
            size="small"
            icon=""
            onClick={() => {}}
            iconColor="var(--icon-black-40)"
          />
        )}
        {children}
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col w-full", className)}>
      <div
        className={cn(
          "flex w-full",
          shouldShowFiltersInNextRow ? "flex-col" : "items-stretch"
        )}
      >
        {/* First Row - Search, Filters (if inline), and Actions */}
        <div className="flex items-stretch w-full">
          {/* Search */}
          {showSearch && (
            <div
              className={cn(
                "overflow-hidden",
                !shouldShowFiltersInNextRow && "w-[200px]",
                className
              )}
            >
              <FilterDesktop
                type="Text input"
                value={searchValue}
                placeholder={searchPlaceholder}
                onChange={(value: string) => {
                  console.log("Search changed:", value);
                  onSearchChange?.(value);
                }}
                onClear={onSearchClear}
                showLabel={false}
                className={`border-none h-full items-center justify-center ${isRTL ? "rounded-tr-[16px]" : "rounded-tl-[16px]"}`}
              />
            </div>
          )}

          {/* Inline Filters */}
          {!shouldShowFiltersInNextRow && filters.length > 0 && (
            <div className="flex items-stretch border-l border-black-10">
              {renderFilters()}
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className={cn(
              "flex items-center gap-2 px-3 py-2",
              isRTL ? "mr-auto" : "ml-auto"
            )}>
              {renderActionButtons()}
            </div>
          )}
        </div>

        {/* Filters Row (when not inline) */}
        {shouldShowFiltersInNextRow && filters.length > 0 && (
          <div className="flex items-stretch border-t border-black-10">
            {renderFilters()}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterRow;
