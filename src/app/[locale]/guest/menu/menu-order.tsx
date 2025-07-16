'use client'
import { Button } from '@/components/ui/button'
import { useDishListQuery } from '@/queries/useDish'
import { formatCurrency, handleErrorApi } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { useGuestOrderMutation } from '@/queries/useGuest'
import { useRouter} from '@/i18n/navigation'
import { DishStatus } from '@/constants/type'
import { useCart } from '@/lib/hooks/useCartContext'
import { toast } from 'sonner'
import { useCategoryListQuery } from '@/queries/useCategory'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import dynamic from 'next/dynamic'

// Lazy load DishItem component
const DishItem = dynamic(() => import('./dish-item'), {
  loading: () => (
    <div className="flex gap-3 px-6 sm:px-0">
      <div className="w-[80px] h-[80px] bg-muted animate-pulse rounded-md"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
        <div className="h-3 bg-muted animate-pulse rounded w-full"></div>
        <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
      </div>
      <div className="w-16 h-6 bg-muted animate-pulse rounded"></div>
    </div>
  )
})

export default function MenuOrder() {
  const { data } = useDishListQuery()
  const dishes = useMemo(() => data?.payload.data ?? [], [data])
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
  const router = useRouter()
  const { addToCart, cartItems, cartCount } = useCart()
  const { data: categoryData } = useCategoryListQuery()
  const categories = categoryData?.payload.data ?? []
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  // React 19 hoặc Next.js 15 thì không cần dùng useMemo chỗ này
  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id)
      if (!order) return result
      return result + order.quantity * dish.price
    }, 0)
  }, [dishes, orders])

  // Lọc món ăn theo category
  const filteredDishes = useMemo(() => {
    if (!selectedCategory) return dishes
    return dishes.filter((dish) => String(dish.categoryId) === selectedCategory)
  }, [dishes, selectedCategory])

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId)
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId)
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }]
      }
      const newOrders = [...prevOrders]
      newOrders[index] = { ...newOrders[index], quantity }
      return newOrders
    })
  }
  const handleAddToCart = () => {

    addToCart(orders)
    // Hiển thị thông báo thành công
    toast.success(`Đã thêm ${orders.length} món vào giỏ hàng`)

    // Reset lại danh sách đã chọn
    setOrders([])

    // Điều hướng đến trang giỏ hàng
    router.push('/guest/cart')
  }
  return (
    <>
      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="w-full flex flex-col items-center gap-2">
          <div className="flex gap-2 items-center w-full justify-center">
            <Select
              value={selectedCategory || ''}
              onValueChange={(value) => setSelectedCategory(value === '' ? null : value)}
            >
              <SelectTrigger className="w-56 border-primary shadow-sm focus:ring-2 focus:ring-primary/50">
                <SelectValue placeholder="Chọn danh mục..." />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-auto">
                {/* <SelectItem value="">Tất cả các món</SelectItem> */}
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCategory && (
              <Button
                size="icon"
                variant="ghost"
                className="border border-primary text-primary hover:bg-primary/10 transition-colors"
                title="Bỏ lọc danh mục"
                onClick={() => setSelectedCategory(null)}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>
      {filteredDishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => {
          const quantity = orders.find((order) => order.dishId === dish.id)?.quantity ?? 0
          return (
            <DishItem
              key={dish.id}
              dish={dish}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
            />
          )
        })}
      <div className='sticky bottom-0 flex flex-col gap-2 p-4'>
        <Button
          className='w-full justify-between h-12 font-semibold rounded-2xl bg-[#693F1F] text-white'
          onClick={handleAddToCart}
          disabled={orders.length === 0}
        >
          <span>Thêm vào giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>

        {/* <Button
          className='w-full h-12 bg-[#F2A82C] font-semibold'
          variant="outline"
          onClick={() => router.push('/guest/cart')}
        >
          Xem giỏ hàng {cartCount > 0 && `(${cartCount})`}
        </Button> */}
      </div>
    </>
  )
}
