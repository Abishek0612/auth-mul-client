import PropTypes from "prop-types";
import { useState } from "react";

const GlobalFilters = ({ filters, onChange }) => {
  const [showFilters, setShowFilters] = useState(true);

  const handleDateChange = (field, value) => {
    onChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value,
      },
    });
  };

  const handleClearFilters = () => {
    onChange({
      dateRange: { from: "", to: "" },
      dateType: "poDate",
      site: [],
      city: [],
      article: "",
    });
  };

  const hasActiveFilters =
    filters.dateRange?.from ||
    filters.dateRange?.to ||
    filters.site?.length > 0 ||
    filters.city?.length > 0 ||
    filters.article;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Date Range:
              </label>
              <input
                type="date"
                value={filters.dateRange?.from || ""}
                onChange={(e) => handleDateChange("from", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={filters.dateRange?.to || ""}
                onChange={(e) => handleDateChange("to", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Type:</label>
              <select
                value={filters.dateType || "poDate"}
                onChange={(e) =>
                  onChange({ ...filters, dateType: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="poDate">PO Date</option>
                <option value="invoiceDate">Invoice Date</option>
                <option value="grnDate">GRN Date</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Site:</label>
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Sites</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">City:</label>
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Cities</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Article:
              </label>
              <input
                type="text"
                placeholder="Search..."
                value={filters.article || ""}
                onChange={(e) =>
                  onChange({ ...filters, article: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent w-48"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="ml-auto flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Reset
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs text-gray-500">Active Filters:</span>
              {filters.dateRange?.from && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-purple-100 text-purple-800">
                  From: {filters.dateRange.from}
                </span>
              )}
              {filters.dateRange?.to && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-purple-100 text-purple-800">
                  To: {filters.dateRange.to}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

GlobalFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default GlobalFilters;
