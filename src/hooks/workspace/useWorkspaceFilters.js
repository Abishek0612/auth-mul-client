import { useState, useMemo } from "react";

export const useWorkspaceFilters = (data, filterConfig) => {
  const [activeFilters, setActiveFilters] = useState({});

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.filter((item) => {
      return Object.entries(activeFilters).every(([key, value]) => {
        if (!value || value === "all") return true;

        const filterDef = filterConfig.find((f) => f.key === key);
        if (!filterDef) return true;

        if (filterDef.type === "search") {
          const searchValue = value.toLowerCase();
          return filterDef.fields.some((field) => {
            const fieldValue = item[field]?.toString().toLowerCase() || "";
            return fieldValue.includes(searchValue);
          });
        }

        if (filterDef.type === "select") {
          return item[key] === value;
        }

        if (filterDef.type === "multiSelect") {
          if (Array.isArray(item[key])) {
            return item[key].includes(value);
          }
          return item[key] === value;
        }

        return true;
      });
    });
  }, [data, activeFilters, filterConfig]);

  return {
    filteredData,
    activeFilters,
    setActiveFilters,
  };
};
