"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Page Header Component
 * 
 * Displays page title and breadcrumb navigation
 * Automatically generates breadcrumbs from current pathname
 */

export function PageHeader({ title, description, className }: { title: string; description?: string; className?: string }) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  return (
    <div className={cn("mb-6", className)}>
      <div className="text-3xl font-bold tracking-tight">{title}</div>
      {description && (
        <div className="mt-1 text-base text-muted-foreground dark:text-slate-400">
          {description}
        </div>
      )}
      <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
        {parts.map((p, i) => {
          const href = "/" + parts.slice(0, i + 1).join("/");
          const isLast = i === parts.length - 1;
          return (
            <span key={href} className="inline-flex items-center gap-1">
              {i === 0 ? null : <span className="text-muted-foreground/60 mx-1">/</span>}
              {isLast ? (
                <span className="capitalize text-muted-foreground">{p}</span>
              ) : (
                <Link href={href} className="capitalize hover:underline text-muted-foreground/80 hover:text-muted-foreground">{p}</Link>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
