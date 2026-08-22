export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Section Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-8 w-64 bg-secondary/60 rounded-lg"></div>
        <div className="h-4 w-96 bg-secondary/40 rounded-md"></div>
      </div>

      {/* Summary Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm h-36 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-secondary/60 rounded-xl"></div>
              <div className="w-16 h-5 bg-secondary/50 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-28 bg-secondary/40 rounded"></div>
              <div className="h-7 w-16 bg-secondary/60 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Blood Stock Chart Skeleton */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm h-[380px] flex flex-col justify-between">
            <div className="h-6 w-48 bg-secondary/60 rounded"></div>
            <div className="h-[280px] w-full bg-secondary/30 rounded-xl"></div>
          </div>

          {/* Recent Requests Table Skeleton */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm p-6 space-y-4">
            <div className="h-6 w-48 bg-secondary/60 rounded mb-4"></div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-full bg-secondary/30 rounded-xl"></div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* Emergency Alerts Skeleton */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm h-[280px]">
            <div className="h-6 w-40 bg-secondary/60 rounded mb-4"></div>
            <div className="h-32 bg-secondary/30 rounded-xl mb-4"></div>
            <div className="h-10 w-full bg-primary/30 rounded-xl"></div>
          </div>

          {/* Donation Trends Skeleton */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm h-[280px]">
            <div className="h-6 w-44 bg-secondary/60 rounded mb-4"></div>
            <div className="h-40 bg-secondary/30 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
