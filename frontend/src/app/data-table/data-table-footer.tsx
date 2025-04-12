"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps {
  table: any; // Replace 'any' with the appropriate type from @tanstack/react-table
}

export function DataTablePagination({ table }: DataTablePaginationProps) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);
  const pageCount = table.getPageCount();

  // Function to determine which page numbers to show
  const getVisiblePages = () => {
    // For desktop, we can show more pages
    const desktopPages = Array.from({ length: pageCount }, (_, i) => i + 1);

    // For mobile, we'll show a limited set around the current page
    const mobilePages = [currentPage];

    // Add previous page if it exists
    if (currentPage > 1) {
      mobilePages.unshift(currentPage - 1);
    }

    // Add next page if it exists
    if (currentPage < pageCount) {
      mobilePages.push(currentPage + 1);
    }

    return { desktopPages, mobilePages };
  };

  const { desktopPages, mobilePages } = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 py-4 gap-4 sm:gap-0">
      <div className="text-xs sm:text-sm text-muted-foreground">
        Viewing {startRow}-{endRow} of {totalRows} records
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
        <div className="flex items-center space-x-2">
          <p className="text-xs sm:text-sm font-medium">Rows</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-20 sm:w-24 text-xs sm:text-sm">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Pagination className="w-full sm:w-auto">
          <PaginationContent className="flex-wrap">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                className={
                  !table.getCanPreviousPage()
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>

            {/* Mobile pagination - limited pages */}
            <div className="sm:hidden flex">
              {mobilePages.map((page) => (
                <PaginationItem key={`mobile-${page}`}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => table.setPageIndex(page - 1)}
                    className="text-xs h-8 w-8"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {currentPage < pageCount - 1 && (
                <PaginationItem>
                  <span className="flex h-8 w-8 items-center justify-center">
                    ...
                  </span>
                </PaginationItem>
              )}
            </div>

            {/* Desktop pagination - show all pages */}
            <div className="sm:hidden flex">
              {desktopPages.map((page) => (
                <PaginationItem key={`desktop-${page}`}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => table.setPageIndex(page - 1)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </div>

            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                className={
                  !table.getCanNextPage()
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
