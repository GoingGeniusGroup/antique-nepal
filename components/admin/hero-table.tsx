"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@heroui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { debounce, getPaginationInfo, handleApiError } from "@/lib/admin-utils";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { Search, Plus, ArrowUpDown, RefreshCw } from "lucide-react";

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
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        // Handle 404 or 500 as empty data for better UX during development
        if (res.status === 404 || res.status === 500) {
          console.warn(`API endpoint ${fetchUrl} returned ${res.status}, showing empty state`);
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
      if (e instanceof Error && e.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else if (e instanceof Error && (e.message.includes('Failed to fetch') || e.message.includes('NetworkError'))) {
        // Treat network errors as "no data" for better UX
        console.warn('Network error, treating as no data:', e.message);
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
    <div className="space-y-6">
      {/* Enhanced Header with controls - Responsive */}
      <div className="flex flex-col gap-4">
        {/* Title and Refresh - Always on top */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-lg sm:text-xl font-semibold text-foreground">{title}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200"
              title="Refresh data"
            >
              <RefreshCw className={cn("h-3 w-3 text-blue-600", loading && "animate-spin")} />
            </Button>
          </div>
          
          {/* Add Button - Visible on mobile */}
          {onAdd && (
            <Button 
              onClick={onAdd}
              className="h-9 bg-blue-600 hover:bg-blue-700 text-white shadow-sm sm:hidden"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden xs:inline">Add New</span>
              <span className="xs:hidden">Add</span>
            </Button>
          )}
        </div>
        
        {/* Controls - Responsive layout */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {/* Search - Full width on mobile */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              onChange={(e) => debouncedSetQ(e.target.value)}
              className="h-9 w-full sm:w-56 pl-9 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
            />
          </div>
          
          {/* Sort and Add Controls */}
          <div className="flex items-center gap-2 justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              {/* Sort Controls - Smaller on mobile */}
              <Select value={sort} onValueChange={(v) => setSort(v)}>
                <SelectTrigger className="h-9 w-32 sm:w-40 border-gray-200 focus:border-blue-300">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {columns.filter(c => c.sortable).map((c) => (
                    <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                className="h-9 px-2 sm:px-3 border-gray-200 hover:bg-gray-50" 
                onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown className="h-4 w-4 sm:mr-1 text-gray-600" />
                <span className="hidden sm:inline">{order === "asc" ? "Asc" : "Desc"}</span>
              </Button>
            </div>
            
            {/* Add Button - Hidden on mobile (shown in header) */}
            {onAdd && (
              <Button 
                onClick={onAdd}
                className="hidden sm:flex h-9 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add New
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* HeroUI Table with Skeleton Loading */}
      {loading ? (
        <TableSkeleton rows={pageSize} columns={columns.length + (onEdit || onDelete ? 1 : 0)} />
      ) : error ? (
        <div className="rounded-lg border bg-card">
          {/* Show table header even with error */}
          <Table 
            aria-label={title}
            className="min-w-full"
            classNames={{
              wrapper: "shadow-none border-0 bg-transparent rounded-lg",
              th: "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 font-semibold text-xs uppercase tracking-wide border-b-2 border-gray-200",
              td: "text-sm text-gray-700 border-b border-gray-100",
              tr: "hover:bg-blue-50/50 transition-colors duration-200",
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
                <TableCell colSpan={tableColumns.length} className="px-4 py-8 text-center">
                  <div className="text-red-600">
                    <p className="font-medium">Error loading data</p>
                    <p className="text-xs mt-1">{error}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRefresh}
                      className="mt-2"
                    >
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table 
              aria-label={title}
              className="min-w-full"
              classNames={{
                wrapper: "shadow-none border-0 bg-transparent rounded-lg",
                th: "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 font-semibold text-xs uppercase tracking-wide border-b-2 border-gray-200 whitespace-nowrap px-2 sm:px-4",
                td: "text-sm text-gray-700 border-b border-gray-100 whitespace-nowrap px-2 sm:px-4",
                tr: "hover:bg-blue-50/50 transition-colors duration-200",
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
                  <TableCell colSpan={tableColumns.length} className="px-4 py-8 text-center">
                    <div className="text-muted-foreground">
                      <p>No results found</p>
                      {q && <p className="text-xs mt-1">Try adjusting your search terms</p>}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tableRows.map((row) => (
                  <TableRow key={row.key} className="px-4 py-3">
                    {(columnKey) => {
                      // Handle Actions column
                      if (columnKey === "actions") {
                        return (
                          <TableCell className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {onEdit && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onEdit(row as T)}
                                  className="h-7 px-2 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                                >
                                  Edit
                                </Button>
                              )}
                              {onDelete && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onDelete(row as T)}
                                  className="h-7 px-2 text-xs border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        );
                      }
                      
                      // Handle regular columns
                      const column = columns.find(c => c.key === String(columnKey));
                      const value = column?.render ? column.render(row as T) : getKeyValue(row, columnKey);
                      return <TableCell className="px-4 py-3">{value}</TableCell>;
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
      <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
        {/* Results info - Always visible */}
        <div className="text-sm text-gray-600 font-medium text-center sm:text-left">
          {(() => {
            const paginationInfo = getPaginationInfo(page, pageSize, total);
            return `Showing ${paginationInfo.start} to ${paginationInfo.end} of ${paginationInfo.total} results`;
          })()}
        </div>
        
        {/* Controls - Responsive layout */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden sm:inline">Rows per page:</span>
            <span className="text-sm text-gray-600 sm:hidden">Per page:</span>
            <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
              <SelectTrigger className="h-9 w-16 sm:w-20 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              className="h-9 px-2 sm:px-3 border-gray-200 hover:bg-gray-50 disabled:opacity-50" 
              disabled={page <= 1} 
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>
            
            <div className="flex items-center px-2 sm:px-3 py-1 text-sm font-medium text-gray-700 bg-gray-50 rounded border min-w-[80px] justify-center">
              {page} of {totalPages}
            </div>
            
            <Button 
              variant="outline" 
              className="h-9 px-2 sm:px-3 border-gray-200 hover:bg-gray-50 disabled:opacity-50" 
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
