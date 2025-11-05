"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { debounce, getPaginationInfo, handleApiError } from "@/lib/admin-utils";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { Search, Plus, ArrowUpDown, RefreshCw } from "lucide-react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconEdit, IconTrash } from "@tabler/icons-react";

/**
 * Enhanced HeroUI Table Component
 *
 * A reusable, feature-rich table component for admin data management.
 *
 * Features:
 * - Real-time data fetching with debounced search
 * - Server-side sorting and pagination
 * - CRUD operation support with callbacks
 * - Responsive design with loading states
 * - Customizable column rendering
 * - Error handling and user feedback
 * - Accessible design with proper ARIA labels
 *
 * Usage:
 * ```tsx
 * <HeroTable<User>
 *   title="Users"
 *   fetchUrl="/api/admin/users"
 *   columns={userColumns}
 *   onAdd={handleAddUser}
 *   onEdit={handleEditUser}
 *   onDelete={handleDeleteUser}
 * />
 * ```
 */

type OrderDir = "asc" | "desc";

export type HeroColumn<T> = {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

export interface HeroTableProps<T extends { id: string }> {
  /** Table title displayed in header */
  title: string;
  /** API endpoint for fetching data */
  fetchUrl: string;
  /** Column definitions */
  columns: HeroColumn<T>[];
  /** Default sort field */
  defaultSort?: string;
  /** Default sort order */
  defaultOrder?: OrderDir;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Callback for add new item */
  onAdd?: () => void;
  /** Callback for edit item */
  onEdit?: (item: T) => void;
  /** Callback for delete item */
  onDelete?: (item: T) => void;
}

export function HeroTable<T extends { id: string }>({
  title,
  fetchUrl,
  columns,
  defaultSort = columns[0]?.key || "createdAt",
  defaultOrder = "desc",
  pageSizeOptions = [10, 20, 50],
  onAdd,
  onEdit,
  onDelete,
}: HeroTableProps<T>) {
  // State management
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<string>(defaultSort);
  const [order, setOrder] = useState<OrderDir>(defaultOrder);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0] || 10);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (sort) p.set("sort", sort);
    if (order) p.set("order", order);
    p.set("page", String(page));
    p.set("pageSize", String(pageSize));
    return p.toString();
  }, [q, sort, order, page, pageSize]);

  // Optimized data fetching with better error handling
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Add timeout for faster perceived performance
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch(`${fetchUrl}?${params}`, {
        cache: "no-store",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        // Handle 404 or 500 as empty data for better UX during development
        if (res.status === 404 || res.status === 500) {
          console.warn(
            `API endpoint ${fetchUrl} returned ${res.status}, showing empty state`
          );
          setRows([]);
          setTotal(0);
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      // Handle different response formats
      if (json.data) {
        setRows(json.data as T[]);
        setTotal(json.total || json.data.length);
      } else if (Array.isArray(json)) {
        setRows(json as T[]);
        setTotal(json.length);
      } else {
        // If response format is unexpected but not an error, treat as empty
        setRows([]);
        setTotal(0);
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else if (
        e instanceof Error &&
        (e.message.includes("Failed to fetch") ||
          e.message.includes("NetworkError"))
      ) {
        // Treat network errors as "no data" for better UX
        console.warn("Network error, treating as no data:", e.message);
        setRows([]);
        setTotal(0);
        setError(null);
      } else {
        const errorMessage = handleApiError(e);
        setError(errorMessage);
      }
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced search to avoid excessive API calls
  const debouncedSetQ = useMemo(
    () => debounce((value: string) => setQ(value), 300),
    []
  );

  // Reset to first page when query or page size changes
  useEffect(() => {
    setPage(1);
  }, [q, pageSize, sort, order]);

  // Refresh data function
  const handleRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Transform rows for HeroUI Table
  const tableRows = rows.map((row) => ({
    key: row.id,
    ...row,
  }));

  // Transform columns for HeroUI Table - add Actions column if CRUD operations are available
  const tableColumns = [
    ...columns.map((col) => ({
      key: col.key,
      label: col.label,
    })),
    ...(onEdit || onDelete ? [{ key: "actions", label: "Actions" }] : []),
  ];

  return (
    <div className="space-y-4">
      {/* Enhanced Header with controls - Responsive */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* Search with stats badge and refresh */}
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
            <Input
              placeholder="Search across all fields..."
              onChange={(e) => debouncedSetQ(e.target.value)}
              className="h-10 w-full sm:w-72 pl-10 pr-4 border-2 border-border dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg shadow-sm dark:bg-slate-800 dark:text-slate-100 placeholder:text-muted-foreground dark:placeholder:text-slate-500 transition-colors"
            />
          </div>

          {/* Total items badge with refresh - next to search */}
          <div className="hidden sm:flex items-center gap-2">
            {total > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800">
                <span className="text-xs font-medium text-muted-foreground dark:text-slate-400">
                  Total items:
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse"></div>
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                    {total}
                  </span>
                </div>
              </div>
            )}

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="h-10 w-10 p-0 border-2 border-border dark:border-slate-600 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
              title="Refresh data"
            >
              <RefreshCw
                className={cn(
                  "h-4 w-4 text-blue-600 dark:text-blue-400",
                  loading && "animate-spin"
                )}
              />
            </Button>
          </div>
        </div>

        {/* Sort and Add Controls */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            {/* Sort Controls */}
            <Select value={sort} onValueChange={(v) => setSort(v)}>
              <SelectTrigger className="h-10 w-36 sm:w-44 border-2 border-border dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {columns
                  .filter((c) => c.sortable)
                  .map((c) => (
                    <SelectItem key={c.key} value={c.key}>
                      {c.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-10 w-10 p-0 border-2 border-border dark:border-slate-600 dark:bg-slate-800 transition-all",
                order === "desc"
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 dark:border-blue-500"
                  : "hover:bg-muted dark:hover:bg-slate-700 dark:text-slate-200"
              )}
              onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
              title={order === "asc" ? "Ascending (A→Z)" : "Descending (Z→A)"}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Add Button - Icon only */}
          {onAdd && (
            <Button
              onClick={onAdd}
              className="h-10 w-10 p-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
              title="Add new item"
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* HeroUI Table with Skeleton Loading */}
      {loading ? (
        <TableSkeleton
          rows={pageSize}
          columns={columns.length + (onEdit || onDelete ? 1 : 0)}
        />
      ) : error ? (
        <div className="rounded-lg border border-border dark:border-slate-600 bg-card dark:!bg-slate-800 overflow-hidden shadow-sm">
          {/* Show table header even with error */}
          <Table
            aria-label={title}
            className="min-w-full"
            classNames={{
              wrapper: "shadow-none border-0 bg-transparent",
              th: "bg-gradient-to-b from-muted/80 to-muted/50 dark:!from-slate-700 dark:!to-slate-750 text-foreground dark:!text-slate-100 font-semibold text-xs uppercase tracking-wide border-b border-r border-border dark:!border-slate-600 last:border-r-0 whitespace-nowrap px-2 py-2 first:pl-3 last:pr-3",
              td: "text-sm text-foreground dark:!text-slate-200 border-b border-border/40 dark:!border-slate-600/40",
              tr: "transition-colors duration-200",
            }}
          >
            <TableHeader>
              {tableColumns.map((column) => (
                <TableColumn key={column.key} className="px-4 py-3">
                  {column.label}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="px-4 py-12 text-center"
                >
                  <div className="text-destructive dark:text-red-400">
                    <p className="font-semibold text-base">
                      Error loading data
                    </p>
                    <p className="text-sm mt-2 text-muted-foreground dark:text-slate-400">
                      {error}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      className="mt-4 border-2 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border border-border dark:border-slate-600 bg-card dark:!bg-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table
              aria-label={title}
              className="min-w-full"
              classNames={{
                wrapper: "shadow-none border-0 bg-transparent",
                th: "bg-gradient-to-b from-muted/80 to-muted/50 dark:!from-slate-700 dark:!to-slate-750 text-foreground dark:!text-slate-100 font-semibold text-xs uppercase tracking-wide border-b border-r border-border dark:!border-slate-600 last:border-r-0 whitespace-nowrap px-2 py-2 first:pl-3 last:pr-3",
                td: "text-sm text-foreground dark:!text-slate-200 border-b border-r border-border/40 dark:!border-slate-600/40 last:border-r-0 whitespace-nowrap px-2 py-1.5 first:pl-3 last:pr-3",
                tr: "hover:bg-blue-50/50 dark:!hover:bg-slate-700/70 transition-all duration-150 border-b border-border/30 dark:!border-slate-600/30 last:border-b-0",
              }}
            >
              <TableHeader>
                {tableColumns.map((column) => (
                  <TableColumn key={column.key} className="px-4 py-3">
                    {column.label}
                  </TableColumn>
                ))}
              </TableHeader>
              <TableBody>
                {tableRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={tableColumns.length}
                      className="px-4 py-8 text-center"
                    >
                      <div className="text-muted-foreground">
                        <p>No results found</p>
                        {q && (
                          <p className="text-xs mt-1">
                            Try adjusting your search terms
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  tableRows.map((row) => (
                    <TableRow key={row.key} className="px-4 py-3">
                      {(columnKey) => {
                        // Handle Actions column
                        if (columnKey === "actions") {
                          const actionLinks = [];

                          if (onEdit) {
                            actionLinks.push({
                              title: "Edit",
                              icon: (
                                <IconEdit className="h-full w-full text-blue-500 dark:text-blue-400" />
                              ),
                              href: "#",
                              onClick: (e: React.MouseEvent) => {
                                e.preventDefault();
                                onEdit(row as T);
                              },
                            });
                          }

                          if (onDelete) {
                            actionLinks.push({
                              title: "Delete",
                              icon: (
                                <IconTrash className="h-full w-full text-red-500 dark:text-red-400" />
                              ),
                              href: "#",
                              onClick: (e: React.MouseEvent) => {
                                e.preventDefault();
                                onDelete(row as T);
                              },
                            });
                          }

                          return (
                            <TableCell className="px-2 py-1.5">
                              <div className="flex items-center justify-center gap-0.5 scale-75">
                                <FloatingDock
                                  items={actionLinks}
                                  desktopClassName="transform-none [&>div]:h-5 [&>div]:w-5 [&>div>a]:h-5 [&>div>a]:w-5 [&>div>a>svg]:h-2.5 [&>div>a>svg]:w-2.5 [&>div]:transition-all [&>div]:duration-75 [&>div>a]:transition-all [&>div>a]:duration-75 [&>div:hover]:scale-105 [&>div>a:hover]:scale-105"
                                  mobileClassName="transform-none [&>div]:h-5 [&>div]:w-5 [&>div>a]:h-5 [&>div>a]:w-5 [&>div>a>svg]:h-2.5 [&>div>a>svg]:w-2.5 [&>div]:transition-all [&>div]:duration-75 [&>div>a]:transition-all [&>div>a]:duration-75 [&>div:hover]:scale-105 [&>div>a:hover]:scale-105"
                                />
                              </div>
                            </TableCell>
                          );
                        }

                        // Handle regular columns
                        const column = columns.find(
                          (c) => c.key === String(columnKey)
                        );
                        const value = column?.render
                          ? column.render(row as T)
                          : getKeyValue(row, columnKey);
                        return (
                          <TableCell className="px-2 py-1.5">{value}</TableCell>
                        );
                      }}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Enhanced Pagination - Responsive */}
      <div className="flex flex-col gap-3 pt-3 border-t border-border dark:border-slate-600">
        {/* Results info - Always visible */}
        <div className="text-xs text-muted-foreground dark:text-slate-400 font-medium text-center sm:text-left">
          {(() => {
            const paginationInfo = getPaginationInfo(page, pageSize, total);
            return `Showing ${paginationInfo.start} to ${paginationInfo.end} of ${paginationInfo.total} results`;
          })()}
        </div>

        {/* Controls - Responsive layout */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground dark:text-slate-400 hidden sm:inline">
              Rows per page:
            </span>
            <span className="text-xs text-muted-foreground dark:text-slate-400 sm:hidden">
              Per page:
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => setPageSize(Number(v))}
            >
              <SelectTrigger className="h-8 w-16 sm:w-20 border-border dark:border-slate-600 dark:bg-slate-800 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page Navigation with Numbers */}
          <div className="flex items-center gap-1">
            {/* Previous Button */}
            <Button
              variant="outline"
              className="h-8 px-2 sm:px-3 text-xs border-border dark:border-slate-600 hover:bg-muted dark:hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {(() => {
                const pageNumbers = [];
                const maxVisiblePages = 5;

                if (totalPages <= maxVisiblePages) {
                  // Show all pages if total is small
                  for (let i = 1; i <= totalPages; i++) {
                    pageNumbers.push(i);
                  }
                } else {
                  // Show smart pagination with ellipsis
                  if (page <= 3) {
                    // Near start: 1 2 3 4 ... last
                    pageNumbers.push(1, 2, 3, 4, -1, totalPages);
                  } else if (page >= totalPages - 2) {
                    // Near end: 1 ... last-3 last-2 last-1 last
                    pageNumbers.push(
                      1,
                      -1,
                      totalPages - 3,
                      totalPages - 2,
                      totalPages - 1,
                      totalPages
                    );
                  } else {
                    // Middle: 1 ... current-1 current current+1 ... last
                    pageNumbers.push(
                      1,
                      -1,
                      page - 1,
                      page,
                      page + 1,
                      -2,
                      totalPages
                    );
                  }
                }

                return pageNumbers.map((pageNum, idx) => {
                  if (pageNum === -1 || pageNum === -2) {
                    // Ellipsis
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-muted-foreground dark:text-slate-500"
                      >
                        ...
                      </span>
                    );
                  }

                  const isActive = pageNum === page;
                  return (
                    <Button
                      key={pageNum}
                      variant={isActive ? "default" : "outline"}
                      className={cn(
                        "h-8 w-8 p-0 text-xs font-medium transition-colors",
                        isActive
                          ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 dark:border-blue-500"
                          : "border-border dark:border-slate-600 hover:bg-muted dark:hover:bg-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      )}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                });
              })()}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              className="h-8 px-2 sm:px-3 text-xs border-border dark:border-slate-600 hover:bg-muted dark:hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
