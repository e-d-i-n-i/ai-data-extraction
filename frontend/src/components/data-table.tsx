"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  Search,
  Info,
  RefreshCw,
  CalendarSync,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTableData } from "@/hooks/use-table-data";
import LoadingSpinner from "@/components/loading-spinner"; // Import the LoadingSpinner component

interface Action {
  icon: React.ReactNode;
  title: string;
  path: string;
}

interface DataTableProps<TData extends { id: string | number }, TValue> {
  route: string;
  actions?: Action[];
  columnOrder?: string[];
}

export function DataTable<TData extends { id: string | number }, TValue>({
  route,
  actions = [],
  columnOrder,
}: DataTableProps<TData, TValue>) {
  const { data: fetchedData, loading, refetch } = useTableData(route);
  const [displayData, setDisplayData] = useState<TData[]>([]); // Data to display in the table
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date()); // Initialize with current timestamp
  const [isSilentRefresh, setIsSilentRefresh] = useState(false); // Track silent background refreshes

  // Update displayData when fetchedData changes
  useEffect(() => {
    if (fetchedData.length > 0) {
      setDisplayData(fetchedData);
    }
  }, [fetchedData]);

  // Function to handle data refresh
  const handleRefresh = async (isSilent = false) => {
    try {
      setIsSilentRefresh(isSilent); // Set silent refresh state
      await refetch(); // Refetch data
      setLastRefresh(new Date()); // Update last refresh timestamp
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setIsSilentRefresh(false); // Reset silent refresh state
    }
  };

  // Set up the interval to refresh data every 60 seconds (silent refresh)
  useEffect(() => {
    const interval = setInterval(() => handleRefresh(true), 60000);
    return () => clearInterval(interval);
  }, []);

  const columns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    if (displayData.length === 0) return [];

    const defaultColumnOrder = ["#", ...Object.keys(displayData[0]), "actions"];
    const finalColumnOrder = columnOrder || defaultColumnOrder;

    return finalColumnOrder.map((key) => {
      if (key === "#") {
        return {
          accessorKey: "#",
          header: "#",
          cell: ({ row }) => (
            <div className="text-muted)] text-center">{row.index + 1}</div>
          ),
        };
      } else if (key === "actions") {
        return {
          accessorKey: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <div className="flex items-center justify-center space-x-2">
              {actions.map((action, index) => (
                <Link key={index} href={`${action.path}/${row.original.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary)] hover:text-primary-foreground)] font-semibold"
                  >
                    {action.icon}
                    <span className="ml-2">{action.title}</span>
                  </Button>
                </Link>
              ))}
            </div>
          ),
        };
      } else {
        return {
          accessorKey: key,
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="font-medium text-card-foreground)]"
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Button>
          ),
          cell: ({ row }) => {
            const value = row.getValue(key);
            if (value === null || value === undefined || value === "") {
              return (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted)]" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Data unavailable</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }
            return <div>{value as React.ReactNode}</div>;
          },
        };
      }
    });
  }, [displayData, actions, columnOrder]);

  const table = useReactTable({
    data: displayData, // Use displayData instead of fetchedData
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination: {
        pageIndex: currentPage,
        pageSize,
      },
    },
  });

  const pageSizeOptions = [10, 25, 50, 100]; // Fixed options for page size
  const showPageSizeDropdown = displayData.length > 10;

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    setPageSize(newPageSize);
    table.setPageSize(newPageSize); // Update the table's page size
  };

  return (
    <div className="w-full bg-card)] rounded-lg shadow-sm border-2">
      <div className="flex items-center justify-between p-4 border-b border-border)]">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted)]" />
            <Input
              placeholder="Search..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-10 pr-4 py-2 w-64 rounded-full border-input)] focus:border-primary)] focus:ring focus:ring-primary)] focus:ring-opacity-50"
            />
          </div>
          {showPageSizeDropdown && (
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select page size" />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    Show {size} records
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="p-4 text-sm text-muted)]">
          <Button variant={"outline"}>
            <CalendarSync /> Last Refreshed:{" "}
            {lastRefresh ? lastRefresh.toLocaleTimeString() : "Never"}
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => handleRefresh(false)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto ">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-accent)]">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-medium text-card-foreground)] text-center"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading && !isSilentRefresh ? ( // Show loader only for non-silent refreshes
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? ( // Show data if available
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-colors hover:bg-accent)]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Show "No results found" if no data is available
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted)]"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border)]">
        <div className="text-sm text-muted)] mb-4 sm:mb-0 text-center sm:text-left">
          Showing {table.getState().pagination.pageIndex * pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} results
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage();
              setCurrentPage((old) => Math.max(old - 1, 0));
            }}
            disabled={!table.getCanPreviousPage()}
            className="py-2 px-4 shadow-lg hover:shadow-xl transition duration-200 transform hover:-translate-y-1"
          >
            Previous
          </Button>
          <span className="mx-2">
            Page {currentPage + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage();
              setCurrentPage((old) =>
                Math.min(old + 1, table.getPageCount() - 1)
              );
            }}
            disabled={!table.getCanNextPage()}
            className="py-2 px-4 rounded-md shadow-lg hover:shadow-xl transition duration-200 transform hover:-translate-y-1"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
