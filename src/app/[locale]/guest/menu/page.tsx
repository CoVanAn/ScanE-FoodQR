import dynamic from 'next/dynamic'

// Lazy load MenuOrder để giảm bundle size ban đầu
const MenuOrder = dynamic(() => import('./menu-order'), {
  loading: () => (
    <div className="space-y-4">
      {/* Category selector skeleton */}
      <div className="flex justify-center">
        <div className="h-10 w-56 bg-muted animate-pulse rounded-md"></div>
      </div>
      
      {/* Menu items skeleton */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-3 px-6 sm:px-0">
          <div className="w-[80px] h-[80px] bg-muted animate-pulse rounded-md"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
            <div className="h-3 bg-muted animate-pulse rounded w-full"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
          </div>
          <div className="w-16 h-6 bg-muted animate-pulse rounded"></div>
        </div>
      ))}
    </div>
  )
})

export default async function MenuPage() {
  return (
    <div className='max-w-[400px] mx-auto space-y-4 '>
      <h1 className='text-center text-xl font-bold'>🍜 Menu quán</h1>
      <MenuOrder />
    </div>
  )
}
