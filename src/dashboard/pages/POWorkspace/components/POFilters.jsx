import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const POFilters = ({ filters, onFilterChange, availableFilters }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempDateRange, setTempDateRange] = useState({ from: "", to: "" });
  const [selectingFrom, setSelectingFrom] = useState(true);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateToYMD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = (dateString) => {
    if (selectingFrom || !tempDateRange.from) {
      setTempDateRange({ from: dateString, to: "" });
      setSelectingFrom(false);
    } else {
      if (new Date(dateString) < new Date(tempDateRange.from)) {
        setTempDateRange({ from: dateString, to: tempDateRange.from });
      } else {
        setTempDateRange({ ...tempDateRange, to: dateString });
      }
      setSelectingFrom(true);
    }
  };

  const applyDateRange = () => {
    onFilterChange({ dateRange: tempDateRange });
    setShowCalendar(false);
  };

  const clearDateRange = () => {
    setTempDateRange({ from: "", to: "" });
    onFilterChange({ dateRange: { from: "", to: "" } });
    setSelectingFrom(true);
    setShowCalendar(false);
  };

  const formatDateRange = () => {
    if (filters.dateRange.from && filters.dateRange.to) {
      const fromDate = new Date(filters.dateRange.from + "T00:00:00");
      const toDate = new Date(filters.dateRange.to + "T00:00:00");
      return `${fromDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} - ${toDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }
    return "Select date range";
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const days = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({
        date: date,
        dateString: formatDateToYMD(date),
        day: day,
      });
    }

    return days;
  };

  const isDateInRange = (dateString) => {
    if (!tempDateRange.from || !dateString) return false;
    if (!tempDateRange.to) return dateString === tempDateRange.from;
    return dateString >= tempDateRange.from && dateString <= tempDateRange.to;
  };

  const isDateSelected = (dateString) => {
    if (!dateString) return false;
    return dateString === tempDateRange.from || dateString === tempDateRange.to;
  };

  useEffect(() => {
    if (showCalendar) {
      setTempDateRange(filters.dateRange);
    }
  }, [showCalendar, filters.dateRange]);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search PO No, Article, Description..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div className="relative" ref={calendarRef}>
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center justify-between w-64 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
          >
            <span>{formatDateRange()}</span>
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>

          {showCalendar && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {new Date().toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                    {selectingFrom ? "Start date" : "End date"}
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-400 py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 mb-3">
                  {generateCalendarDays().map((dayData, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        dayData && handleDateClick(dayData.dateString)
                      }
                      disabled={!dayData}
                      className={`h-6 w-6 text-xs rounded flex items-center justify-center ${
                        !dayData
                          ? "invisible"
                          : isDateSelected(dayData.dateString)
                          ? "bg-blue-600 text-white font-medium"
                          : isDateInRange(dayData.dateString)
                          ? "bg-blue-100 text-blue-800 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {dayData ? dayData.day : ""}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={clearDateRange}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear
                  </button>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowCalendar(false)}
                      className="px-2 py-1 text-xs text-gray-600 border border-gray-200 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={applyDateRange}
                      className="px-2 py-1 text-xs text-white bg-blue-600 rounded"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <select
          value={filters.site}
          onChange={(e) => onFilterChange({ site: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          {availableFilters.sites.map((site) => (
            <option key={site} value={site}>
              {site}
            </option>
          ))}
        </select>

        <select
          value={filters.buyer}
          onChange={(e) => onFilterChange({ buyer: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          {availableFilters.buyers.map((buyer) => (
            <option key={buyer} value={buyer}>
              {buyer}
            </option>
          ))}
        </select>

        <select
          value={filters.seller}
          onChange={(e) => onFilterChange({ seller: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          {availableFilters.sellers.map((seller) => (
            <option key={seller} value={seller}>
              {seller}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          {availableFilters.statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

POFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  availableFilters: PropTypes.object.isRequired,
};

export default POFilters;
