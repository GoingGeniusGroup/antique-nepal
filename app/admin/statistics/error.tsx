"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function StatisticsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Statistics dashboard failed to load.", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <section className="max-w-md rounded-2xl border border-white/50 bg-card/80 p-8 text-center shadow-lg backdrop-blur-xl dark:border-white/10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300">
          <AlertTriangle aria-hidden="true" className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-xl font-semibold">Statistics unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn’t load the dashboard data. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </section>
    </div>
  );
}
