/**
 * Table Skeleton Loader
 * 
 * Provides instant visual feedback while data loads
 * Shows animated skeleton rows that match the table structure
 */

import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, columns = 4, className }: TableSkeletonProps) {
  return (
    <div className={cn("rounded-lg border bg-card overflow-hidden", className)}>
      {/* Header skeleton */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
        <div className="flex">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1 px-4 py-3">
              <div className="h-3 bg-gray-300 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Rows skeleton */}
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex hover:bg-blue-50/50 transition-colors duration-200">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1 px-4 py-3">
                <div 
                  className="h-4 bg-gray-200 rounded animate-pulse"
                  style={{
                    animationDelay: `${(rowIndex * columns + colIndex) * 50}ms`,
                    width: `${Math.random() * 40 + 60}%` // Random width between 60-100%
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Pagination skeleton */}
      <div className="flex items-center justify-between p-4 border-t border-gray-100">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
