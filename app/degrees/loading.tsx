import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Header skeleton */}
      <div className="text-center mb-8">
        <Skeleton className="h-14 w-14 rounded-full mx-auto mb-4" />
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      {/* Two-panel layout skeleton */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Side panel skeleton */}
        <div className="md:w-1/3 lg:w-1/4">
          <div className="bg-white rounded-xl border overflow-hidden">
            <Skeleton className="h-16 w-full" />
            <div className="divide-y">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Main content area skeleton */}
        <div className="md:w-2/3 lg:w-3/4">
          <Skeleton className="h-24 w-full mb-6 rounded-lg" />
          <Skeleton className="h-16 w-full mb-6 rounded-lg" />

          {/* Course journey skeleton */}
          <div className="space-y-8 py-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-6">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Skeleton className="h-10 w-48 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

