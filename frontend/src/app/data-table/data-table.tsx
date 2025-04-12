"use client";

import { useState, useEffect } from "react";
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
import { GetAllSitePages } from "@/api/fetch-supabase-data";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, Search, CalendarSync } from "lucide-react";
import { toast } from "sonner";

import { columns } from "./columns";
import { DataTablePagination } from "./data-table-footer";
import { SitePage } from "@/types/SitePage";

export function DataTable() {
  const [data, setData] = useState<SitePage[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchData = async (isManualRefresh: boolean = false) => {
    try {
      const users = await GetAllSitePages();
      setData(users);
      setLastRefreshed(new Date());

      // Show toast only if it's a manual refresh
      if (isManualRefresh) {
        toast.success("Data refreshed successfully!");
      }
    } catch (error) {
      console.error("Failed to fetch Knowledge Base:", error);

      // Show toast only if it's a manual refresh
      if (isManualRefresh) {
        toast.error("Failed to refresh data. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchData(false); // Initial fetch (not manual)

    const interval = setInterval(() => fetchData(false), 3000000); // Automatic refresh (not manual)

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:flex-wrap items-start sm:items-center py-4 gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-full border-input focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
        </div>

        {/* Last Refreshed and Refresh Button */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm whitespace-nowrap"
          >
            <CalendarSync className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Last Refreshed:</span>{" "}
            {lastRefreshed ? lastRefreshed.toLocaleTimeString() : "Never"}
          </Button>
          <Button
            onClick={() => fetchData(true)}
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm"
          >
            Refresh
          </Button>
        </div>

        {/* Columns Dropdown */}
        <div className="sm:ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
              >
                Columns <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
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
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} />
    </div>
  );
}
