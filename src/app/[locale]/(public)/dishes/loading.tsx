export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 mx-auto max-w-xs"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto max-w-md"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-card rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
              <div className="flex items-center justify-between">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
