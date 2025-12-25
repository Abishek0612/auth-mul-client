import { useState } from "react";
import PropTypes from "prop-types";

const GlobalDateRangeFilter = ({ filters, onFilterChange, onReset }) => {
  const [localDateRange, setLocalDateRange] = useState({
    from: filters.dateRange?.from || "",
    to: filters.dateRange?.to || "",
  });

  const handleDateChange = (field, value) => {
    const newRange = { ...localDateRange, [field]: value };
    setLocalDateRange(newRange);
    onFilterChange({ dateRange: newRange });
  };

  const handleReset = () => {
    setLocalDateRange({ from: "", to: "" });
    onReset();
  };

  const removeFilter = (filterType) => {
    if (filterType === "from") {
      const newRange = { ...localDateRange, from: "" };
      setLocalDateRange(newRange);
      onFilterChange({ dateRange: newRange });
    } else if (filterType === "to") {
      const newRange = { ...localDateRange, to: "" };
      setLocalDateRange(newRange);
      onFilterChange({ dateRange: newRange });
    }
  };

  const getActiveFilters = () => {
    const active = [];
    if (localDateRange.from) {
      active.push({
        label: `From: ${new Date(localDateRange.from).toLocaleDateString(
          "en-GB",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        )}`,
        type: "from",
      });
    }
    if (localDateRange.to) {
      active.push({
        label: `To: ${new Date(localDateRange.to).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`,
        type: "to",
      });
    }
    return active;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Date Range:
            </label>
            <input
              type="date"
              value={localDateRange.from}
              onChange={(e) => handleDateChange("from", e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
            <span className="text-gray-500 text-sm">to</span>
            <input
              type="date"
              value={localDateRange.to}
              onChange={(e) => handleDateChange("to", e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Type:</label>
            <select
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white"
              value="PO Date"
              disabled
            >
              <option>PO Date</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Site:</label>
            <select
              value={filters.site || "All Sites"}
              onChange={(e) => onFilterChange({ site: e.target.value })}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option>All Sites</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">City:</label>
            <select
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white"
              value="All Cities"
              disabled
            >
              <option>All Cities</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Article:
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={filters.search || ""}
                onChange={(e) => onFilterChange({ search: e.target.value })}
                className="w-40 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 pr-7"
              />
              {filters.search && (
                <button
                  onClick={() => onFilterChange({ search: "" })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Reset
          </button>
        </div>
      </div>

      {getActiveFilters().length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-gray-600">
              Active Filters:
            </span>
            <span className="text-sm text-gray-500">Type: PO Date</span>
            {getActiveFilters().map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
              >
                {filter.label}
                <button
                  onClick={() => removeFilter(filter.type)}
                  className="hover:text-purple-900 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

GlobalDateRangeFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default GlobalDateRangeFilter;
