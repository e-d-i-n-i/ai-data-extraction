import { useState, useEffect, useCallback } from "react";
import { fetchData } from "@/api/fetch-table";
import debounce from "lodash/debounce";

export const useTableData = (route: string) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const loadData = useCallback(
    async (page = 1, pageSize = 10, sortBy = "", sortOrder = "") => {
      try {
        setLoading(true);
        const result = await fetchData(
          `${route}?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`
        );
        setData(result.data);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
        setError(null);
      } catch (err) {
        console.error("Error in useTableData:", err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    },
    [route]
  );

  const debouncedLoadData = useCallback(debounce(loadData, 300), [loadData]);

  useEffect(() => {
    debouncedLoadData();
    return () => debouncedLoadData.cancel();
  }, [debouncedLoadData]);

  return { data, loading, error, totalPages, totalItems, refetch: loadData };
};
