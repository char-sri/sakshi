export default function Loading() {
  return (
    <div className="max-w-5xl animate-pulse">
      {/* Skeleton Header */}
      <div className="mb-10">
        <div className="h-9 w-48 bg-zinc-200 rounded-md mb-2"></div>
        <div className="h-4 w-72 bg-zinc-200 rounded-md"></div>
      </div>

      {/* Skeleton Grid for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-6 min-h-[120px] flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-lg bg-zinc-200"></div>
            </div>
            <div>
              <div className="h-8 w-16 bg-zinc-200 rounded-md mb-2"></div>
              <div className="h-3 w-24 bg-zinc-200 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 glass-card p-6 min-h-[300px]">
          <div className="h-6 w-32 bg-zinc-200 rounded-md mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 w-full bg-zinc-100 rounded-md"></div>
            <div className="h-10 w-full bg-zinc-100 rounded-md"></div>
            <div className="h-10 w-full bg-zinc-100 rounded-md"></div>
          </div>
        </div>

        <div className="lg:col-span-3 glass-card p-6 min-h-[300px]">
          <div className="h-6 w-32 bg-zinc-200 rounded-md mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-200"></div>
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 bg-zinc-200 rounded-md"></div>
                    <div className="h-3 w-16 bg-zinc-100 rounded-md"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-zinc-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
