import { useState, useCallback, useEffect } from "react";

export const useWorkspaceData = (fetchDataFn, initialFilters = {}) => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [totals, setTotals] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 100,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchData = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchDataFn({ ...filters, page });

        setData(result.data || []);
        setSummary(result.summary || {});
        setTotals(result.totals || {});
        setPagination({
          currentPage: result.pagination?.page || 1,
          totalPages: result.pagination?.pages || 1,
          totalItems: result.pagination?.total || 0,
          itemsPerPage: result.pagination?.limit || 100,
        });
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchDataFn, filters]
  );

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const handlePageChange = (page) => {
    fetchData(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const refresh = () => {
    fetchData(pagination.currentPage);
  };

  return {
    data,
    summary,
    totals,
    pagination,
    isLoading,
    error,
    filters,
    handlePageChange,
    handleFilterChange,
    refresh,
  };
};
