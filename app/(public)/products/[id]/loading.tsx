export default function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-16 animate-pulse">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="h-4 w-32 bg-muted rounded mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="w-full aspect-square bg-muted rounded-xl" />

              <div className="flex gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-muted rounded-lg" />
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="h-6 w-3/4 bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded" />
              <div className="h-7 w-24 bg-muted rounded" />

              <div className="flex gap-3 mt-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-9 w-20 bg-muted rounded-lg" />
                ))}
              </div>

              <div className="flex gap-4 mt-4">
                <div className="h-10 w-28 bg-muted rounded" />
                <div className="h-10 w-40 bg-muted rounded" />
              </div>

              <div className="h-10 w-36 bg-muted rounded" />
            </div>
          </div>

          <div className="mt-16">
            <div className="flex gap-6 mb-6">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>

            <div className="space-y-4">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-5/6 bg-muted rounded" />
              <div className="h-4 w-4/6 bg-muted rounded" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
