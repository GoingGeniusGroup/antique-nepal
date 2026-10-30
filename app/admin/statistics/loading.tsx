function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-muted/70 ${className}`} />;
}

export default function StatisticsLoading() {
  return (
    <div className="space-y-7" aria-label="Loading statistics" role="status">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-32" />)}
      </div>
      <Skeleton className="h-[390px]" />
      <div className="grid gap-5 xl:grid-cols-2">
        <Skeleton className="h-[360px]" />
        <Skeleton className="h-[360px]" />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Skeleton className="h-[330px]" />
        <Skeleton className="h-[330px]" />
      </div>
    </div>
  );
}
