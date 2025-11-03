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
      <div className="bg-muted/50 border-b-2 border-border">
        <div className="flex">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1 px-4 py-3">
              <div className="h-3 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Rows skeleton */}
      <div className="divide-y divide-border/50">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex hover:bg-muted/30 transition-colors duration-200">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1 px-4 py-3">
                <div 
                  className="h-4 bg-muted/70 rounded animate-pulse"
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
      <div className="flex items-center justify-between p-4 border-t border-border/50">
        <div className="h-4 w-32 bg-muted/70 rounded animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 bg-muted/70 rounded animate-pulse" />
          <div className="h-8 w-16 bg-muted/70 rounded animate-pulse" />
          <div className="h-8 w-16 bg-muted/70 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
